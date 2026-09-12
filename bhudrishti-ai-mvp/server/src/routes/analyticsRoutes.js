import express from "express";
import pool from "../config/database.js";

const router = express.Router();

// Get overall analytics summary
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT region, total_parcels, residential_parcels, agricultural_parcels, 
              forest_parcels, builtup_parcels, low_risk, medium_risk, high_risk, 
              total_area, year, calculated_at
       FROM analytics_records
       ORDER BY year DESC, calculated_at DESC
       LIMIT 1`,
    );

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        data: {
          message: "No analytics data available yet",
          data: null,
        },
      });
    }

    const data = result.rows[0];

    res.json({
      success: true,
      data: {
        region: data.region,
        year: data.year,
        totalParcels: data.total_parcels,
        residential: data.residential_parcels,
        agricultural: data.agricultural_parcels,
        forest: data.forest_parcels,
        builtup: data.builtup_parcels,
        lowRisk: data.low_risk,
        mediumRisk: data.medium_risk,
        highRisk: data.high_risk,
        totalArea: data.total_area,
        calculatedAt: data.calculated_at,
      },
    });
  } catch (err) {
    console.error("Error fetching analytics:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch analytics" });
  }
});

// Get analytics summary by region
router.get("/summary/:region", async (req, res) => {
  try {
    const { region } = req.params;

    const result = await pool.query(
      `SELECT region, total_parcels, residential_parcels, agricultural_parcels, 
              forest_parcels, builtup_parcels, low_risk, medium_risk, high_risk, 
              total_area, year
       FROM analytics_records
       WHERE region ILIKE $1
       ORDER BY year DESC
       LIMIT 5`,
      [region],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No analytics data found for region: ${region}`,
      });
    }

    res.json({
      success: true,
      data: result.rows.map((row) => ({
        region: row.region,
        year: row.year,
        totalParcels: row.total_parcels,
        residential: row.residential_parcels,
        agricultural: row.agricultural_parcels,
        forest: row.forest_parcels,
        builtup: row.builtup_parcels,
        lowRisk: row.low_risk,
        mediumRisk: row.medium_risk,
        highRisk: row.high_risk,
        totalArea: row.total_area,
      })),
    });
  } catch (err) {
    console.error("Error fetching region analytics:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch analytics" });
  }
});

// Get land use distribution
router.get("/land-use/:region", async (req, res) => {
  try {
    const { region } = req.params;

    const result = await pool.query(
      `SELECT region, residential_parcels, agricultural_parcels, forest_parcels, 
              builtup_parcels, year
       FROM analytics_records
       WHERE region ILIKE $1
       ORDER BY year DESC
       LIMIT 1`,
      [region],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No land use data found",
      });
    }

    const data = result.rows[0];

    res.json({
      success: true,
      data: {
        region: data.region,
        year: data.year,
        distribution: {
          residential: data.residential_parcels,
          agricultural: data.agricultural_parcels,
          forest: data.forest_parcels,
          builtup: data.builtup_parcels,
        },
        dataType: "Indicative Demo Data",
      },
    });
  } catch (err) {
    console.error("Error fetching land use distribution:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch land use data" });
  }
});

// Get risk distribution
router.get("/risk/:region", async (req, res) => {
  try {
    const { region } = req.params;

    const result = await pool.query(
      `SELECT region, low_risk, medium_risk, high_risk, year
       FROM analytics_records
       WHERE region ILIKE $1
       ORDER BY year DESC
       LIMIT 1`,
      [region],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No risk data found",
      });
    }

    const data = result.rows[0];

    res.json({
      success: true,
      data: {
        region: data.region,
        year: data.year,
        distribution: {
          low: data.low_risk,
          medium: data.medium_risk,
          high: data.high_risk,
        },
        riskBasis:
          "Based on available dataset: proximity to water, slope, infrastructure context",
      },
    });
  } catch (err) {
    console.error("Error fetching risk distribution:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch risk data" });
  }
});

// Get multi-year trends
router.get("/trends/:region", async (req, res) => {
  try {
    const { region } = req.params;

    const result = await pool.query(
      `SELECT year, total_parcels, residential_parcels, agricultural_parcels, 
              forest_parcels, low_risk, medium_risk, high_risk
       FROM analytics_records
       WHERE region ILIKE $1
       ORDER BY year ASC`,
      [region],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No trend data found",
      });
    }

    res.json({
      success: true,
      data: {
        region,
        trends: result.rows.map((row) => ({
          year: row.year,
          totalParcels: row.total_parcels,
          residential: row.residential_parcels,
          agricultural: row.agricultural_parcels,
          forest: row.forest_parcels,
          lowRisk: row.low_risk,
          mediumRisk: row.medium_risk,
          highRisk: row.high_risk,
        })),
        note: "Demonstration trend data based on available dataset",
      },
    });
  } catch (err) {
    console.error("Error fetching trends:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch trend data" });
  }
});

export default router;
