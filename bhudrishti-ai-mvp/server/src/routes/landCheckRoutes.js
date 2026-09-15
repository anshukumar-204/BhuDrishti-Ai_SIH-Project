import express from "express";
import pool from "../config/database.js";

const router = express.Router();

// Search for parcel by parcel_id, survey_number, or locality
router.get("/", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: "Search query is required",
      });
    }

    const searchTerm = `%${query}%`;

    const result = await pool.query(
      `SELECT id, parcel_id, survey_number, locality, ward_zone, land_use, category, 
              area, risk_level, risk_factors, environmental_risk, development_risk, 
              data_source, last_updated,
              ST_Y(ST_Centroid(geometry)) AS latitude,
              ST_X(ST_Centroid(geometry)) AS longitude
       FROM land_parcels
       WHERE parcel_id ILIKE $1 
          OR survey_number ILIKE $1 
          OR locality ILIKE $1
       LIMIT 1`,
      [searchTerm],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No parcel found matching: "${query}"`,
      });
    }

    const parcel = result.rows[0];

    // Get related research
    const researchResult = await pool.query(
      `SELECT id, title, type, category, region, year, abstract
       FROM research_resources
       WHERE region ILIKE $1 OR category ILIKE $2
       LIMIT 5`,
      [parcel.locality, parcel.land_use],
    );

    // Simulate nearby features (in real scenario, would use PostGIS distance queries)
    const nearbyFeatures = [];
    if (parcel.risk_level === "High" || parcel.risk_level === "Medium") {
      nearbyFeatures.push({
        name: "Water body",
        type: "hazard",
        distance: "0.5-2 km",
      });
      nearbyFeatures.push({
        name: "Steep slope",
        type: "hazard",
        distance: "Nearby",
      });
    }
    if (parcel.land_use === "Residential" || parcel.land_use === "Commercial") {
      nearbyFeatures.push({ name: "Road network", distance: "Direct access" });
    }
    if (parcel.land_use === "Agricultural") {
      nearbyFeatures.push({ name: "Irrigation", distance: "Nearby" });
    }

    res.json({
      success: true,
      data: {
        parcel: {
          parcel_id: parcel.parcel_id,
          survey_number: parcel.survey_number,
          locality: parcel.locality,
          ward_zone: parcel.ward_zone,
          land_use: parcel.land_use,
          category: parcel.category,
          area: parcel.area,
          risk_level: parcel.risk_level,
          risk_factors: parcel.risk_factors,
          environmental_risk: parcel.environmental_risk,
          development_risk: parcel.development_risk,
          data_source: parcel.data_source,
          last_updated: parcel.last_updated,
          latitude: parcel.latitude ? Number(parcel.latitude) : null,
          longitude: parcel.longitude ? Number(parcel.longitude) : null,
        },
        nearbyFeatures,
        relatedResearch: researchResult.rows,
        disclaimer:
          "This is research and decision-support information only, not official legal land records.",
        dataSource: "Demo/Authorized Spatial Dataset",
        confidence: "Dataset-dependent",
      },
    });
  } catch (err) {
    console.error("Error in land check:", err);
    res.status(500).json({ success: false, error: "Land check failed" });
  }
});

// Get land check for specific parcel ID
router.get("/:parcelId", async (req, res) => {
  try {
    const { parcelId } = req.params;

    const result = await pool.query(
      `SELECT id, parcel_id, survey_number, locality, ward_zone, land_use, category, 
              area, risk_level, risk_factors, environmental_risk, development_risk, 
              data_source, last_updated
       FROM land_parcels
       WHERE parcel_id = $1`,
      [parcelId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Parcel ${parcelId} not found`,
      });
    }

    const parcel = result.rows[0];

    res.json({
      success: true,
      data: {
        parcel,
        disclaimer: "This is research and decision-support information only.",
      },
    });
  } catch (err) {
    console.error("Error fetching parcel check:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch parcel details" });
  }
});

export default router;
