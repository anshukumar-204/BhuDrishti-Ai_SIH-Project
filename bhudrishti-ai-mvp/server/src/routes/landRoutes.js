import express from "express";
import pool from "../config/database.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

const parcelSelect = `
  SELECT id, parcel_id, survey_number, locality, ward_zone, land_use, category,
         area, risk_level, risk_factors, environmental_risk, development_risk,
         data_source, last_updated,
         ST_AsGeoJSON(geometry)::json AS geometry
  FROM land_parcels`;

const nearbyCategories = {
  hospital: '["amenity"="hospital"]',
  school: '["amenity"="school"]',
  market: '["shop"~"supermarket|mall|marketplace"]',
  publicTransport: '["public_transport"~"platform|station"]',
  railway: '["railway"="station"]',
  road: '["highway"]',
  waterBody: '["natural"~"water|wetland"]',
  forest: '["landuse"="forest"]',
};

const distanceKm = (from, to) => {
  const earthRadiusKm = 6371;
  const latitudeDelta = ((to.latitude - from.latitude) * Math.PI) / 180;
  const longitudeDelta = ((to.longitude - from.longitude) * Math.PI) / 180;
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos((from.latitude * Math.PI) / 180) *
      Math.cos((to.latitude * Math.PI) / 180) *
      Math.sin(longitudeDelta / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Get all land parcels
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `${parcelSelect}
       ORDER BY created_at DESC`,
    );

    res.json({
      success: true,
      data: {
        total: result.rows.length,
        parcels: result.rows,
      },
    });
  } catch (err) {
    console.error("Error fetching parcels:", err);
    res.status(500).json({ success: false, error: "Failed to fetch parcels" });
  }
});

// Search by parcel, khasra/survey number, registration reference, or locality.
// Query parameters keep this endpoint compatible with the public explorer UI.
router.get("/search", async (req, res) => {
  try {
    const { q, parcelId, khasra, registrationReference } = req.query;
    const searchValue = q || parcelId || khasra || registrationReference;

    if (!searchValue) {
      return res.status(400).json({
        success: false,
        error: "Provide q, parcelId, khasra, or registrationReference",
      });
    }

    const result = await pool.query(
      `${parcelSelect}
       WHERE parcel_id ILIKE $1
          OR survey_number ILIKE $1
          OR locality ILIKE $1
       ORDER BY parcel_id
       LIMIT 50`,
      [`%${searchValue}%`],
    );

    res.json({
      success: true,
      data: {
        query: searchValue,
        results: result.rows,
        count: result.rows.length,
      },
    });
  } catch (err) {
    console.error("Error searching parcels:", err);
    res.status(500).json({ success: false, error: "Search failed" });
  }
});

router.get("/export", requireAuth, async (req, res) => {
  try {
    const format = String(req.query.format || "geojson").toLowerCase();
    if (!["csv", "geojson"].includes(format)) {
      return res
        .status(400)
        .json({
          success: false,
          error: "Supported formats are csv and geojson",
        });
    }
    const result = await pool.query(
      `${parcelSelect} ORDER BY parcel_id LIMIT 10000`,
    );
    if (format === "geojson") {
      return res.json({
        type: "FeatureCollection",
        features: result.rows.map(({ geometry, ...properties }) => ({
          type: "Feature",
          geometry,
          properties,
        })),
      });
    }
    const columns = [
      "parcel_id",
      "survey_number",
      "locality",
      "land_use",
      "category",
      "area",
      "risk_level",
      "data_source",
    ];
    const escapeCsv = (value) =>
      `"${String(value ?? "").replaceAll('"', '""')}"`;
    const csv = [
      columns.join(","),
      ...result.rows.map((row) =>
        columns.map((column) => escapeCsv(row[column])).join(","),
      ),
    ].join("\n");
    res.type("text/csv").send(csv);
  } catch (error) {
    console.error("Parcel export failed:", error);
    res
      .status(500)
      .json({ success: false, error: "Unable to export parcel data" });
  }
});

// Resolve nearby public OSM features at request time for authenticated users.
// The frontend never calls Overpass directly, keeping the provider policy in one place.
router.get("/:id/nearby", requireAuth, async (req, res) => {
  try {
    const parcelResult = await pool.query(
      `SELECT ST_Y(ST_Centroid(geometry)) AS latitude,
              ST_X(ST_Centroid(geometry)) AS longitude
       FROM land_parcels
       WHERE id = $1 OR parcel_id = $1
       LIMIT 1`,
      [isNaN(req.params.id) ? req.params.id : Number(req.params.id)],
    );
    const parcel = parcelResult.rows[0];
    if (!parcel?.latitude || !parcel?.longitude) {
      return res
        .status(404)
        .json({ success: false, error: "Parcel geometry is unavailable" });
    }

    const query = Object.values(nearbyCategories)
      .map(
        (filter) =>
          `nwr(around:10000,${parcel.latitude},${parcel.longitude})${filter};`,
      )
      .join("\n");
    const overpassResponse = await fetch(
      "https://overpass-api.de/api/interpreter",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          data: `[out:json][timeout:25];(${query});out center;`,
        }),
      },
    );
    if (!overpassResponse.ok)
      throw new Error(`Overpass returned ${overpassResponse.status}`);
    const payload = await overpassResponse.json();
    const features = payload.elements
      .map((element) => {
        const latitude = element.lat ?? element.center?.lat;
        const longitude = element.lon ?? element.center?.lon;
        if (latitude == null || longitude == null) return null;
        return {
          name: element.tags?.name || "Unnamed mapped feature",
          latitude,
          longitude,
          distanceKm: distanceKm(parcel, { latitude, longitude }),
          tags: element.tags || {},
        };
      })
      .filter(Boolean);

    const data = Object.fromEntries(
      Object.entries(nearbyCategories).map(([category, filter]) => {
        const tagKey = filter.match(/\["([^\"]+)/)?.[1];
        const matching = features.filter((feature) => {
          if (category === "road") return feature.tags.highway;
          if (category === "market") return feature.tags.shop;
          if (category === "waterBody") return feature.tags.natural;
          if (category === "forest") return feature.tags.landuse === "forest";
          return feature.tags[tagKey];
        });
        return [
          category,
          matching.sort((a, b) => a.distanceKm - b.distanceKm)[0] || null,
        ];
      }),
    );
    res.json({
      success: true,
      data: { source: "OpenStreetMap Overpass", radiusKm: 10, ...data },
    });
  } catch (err) {
    console.error("Nearby lookup failed:", err);
    res.status(502).json({
      success: false,
      error: "Nearby public map data is temporarily unavailable",
    });
  }
});

// Get parcel by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    let query = parcelSelect;
    let params = [];

    // Check if ID is numeric or parcel_id
    if (isNaN(id)) {
      query += ` WHERE parcel_id = $1`;
      params = [id];
    } else {
      query += ` WHERE id = $1`;
      params = [parseInt(id)];
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Parcel not found" });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("Error fetching parcel:", err);
    res.status(500).json({ success: false, error: "Failed to fetch parcel" });
  }
});

// Legacy path retained for existing clients.
router.get("/search/:query", async (req, res) => {
  try {
    const { query } = req.params;
    const searchTerm = `%${query}%`;

    const result = await pool.query(
      `${parcelSelect}
       WHERE parcel_id ILIKE $1 
          OR survey_number ILIKE $1 
          OR locality ILIKE $1
       LIMIT 50`,
      [searchTerm],
    );

    res.json({
      success: true,
      data: {
        query,
        results: result.rows,
        count: result.rows.length,
      },
    });
  } catch (err) {
    console.error("Error searching parcels:", err);
    res.status(500).json({ success: false, error: "Search failed" });
  }
});

// Get parcels by locality (for map layer)
router.get("/location/:locality", async (req, res) => {
  try {
    const { locality } = req.params;

    const result = await pool.query(
      `SELECT id, parcel_id, survey_number, locality, ward_zone, land_use, category, 
              area, risk_level, risk_factors, environmental_risk, development_risk, 
              data_source, last_updated
       FROM land_parcels
       WHERE locality ILIKE $1
       ORDER BY parcel_id`,
      [`%${locality}%`],
    );

    res.json({
      success: true,
      data: {
        locality,
        parcels: result.rows,
        count: result.rows.length,
      },
    });
  } catch (err) {
    console.error("Error fetching parcels by location:", err);
    res.status(500).json({ success: false, error: "Failed to fetch parcels" });
  }
});

// Get parcels by land use type
router.get("/type/:landUse", async (req, res) => {
  try {
    const { landUse } = req.params;

    const result = await pool.query(
      `SELECT id, parcel_id, survey_number, locality, ward_zone, land_use, category, 
              area, risk_level, risk_factors, environmental_risk, development_risk, 
              data_source, last_updated
       FROM land_parcels
       WHERE land_use ILIKE $1
       ORDER BY locality`,
      [landUse],
    );

    res.json({
      success: true,
      data: {
        landUse,
        parcels: result.rows,
        count: result.rows.length,
      },
    });
  } catch (err) {
    console.error("Error fetching parcels by type:", err);
    res.status(500).json({ success: false, error: "Failed to fetch parcels" });
  }
});

// Get parcels by risk level
router.get("/risk/:riskLevel", async (req, res) => {
  try {
    const { riskLevel } = req.params;

    const result = await pool.query(
      `SELECT id, parcel_id, survey_number, locality, ward_zone, land_use, category, 
              area, risk_level, risk_factors, environmental_risk, development_risk, 
              data_source, last_updated
       FROM land_parcels
       WHERE risk_level ILIKE $1
       ORDER BY locality`,
      [riskLevel],
    );

    res.json({
      success: true,
      data: {
        riskLevel,
        parcels: result.rows,
        count: result.rows.length,
      },
    });
  } catch (err) {
    console.error("Error fetching parcels by risk:", err);
    res.status(500).json({ success: false, error: "Failed to fetch parcels" });
  }
});

export default router;
