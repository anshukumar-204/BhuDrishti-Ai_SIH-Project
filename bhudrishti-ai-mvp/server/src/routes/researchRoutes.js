import express from "express";
import pool from "../config/database.js";

const router = express.Router();

// Get all research resources with optional filtering
router.get("/", async (req, res) => {
  try {
    const {
      type,
      category,
      region,
      search,
      limit = 50,
      offset = 0,
    } = req.query;

    let query = `SELECT id, title, type, category, region, authors, organization, year, 
                        abstract, key_findings, source_url, license, tags, published_date
                 FROM research_resources
                 WHERE 1=1`;
    const params = [];
    let paramCount = 1;

    if (type) {
      query += ` AND type ILIKE $${paramCount}`;
      params.push(type);
      paramCount++;
    }

    if (category) {
      query += ` AND category ILIKE $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    if (region) {
      query += ` AND region ILIKE $${paramCount}`;
      params.push(region);
      paramCount++;
    }

    if (search) {
      query += ` AND (title ILIKE $${paramCount} OR abstract ILIKE $${paramCount} OR key_findings ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    query += ` ORDER BY year DESC, published_date DESC
               LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = `SELECT COUNT(*) as total FROM research_resources WHERE 1=1`;
    const countParams = [];
    let countParamCount = 1;

    if (type) {
      countQuery += ` AND type ILIKE $${countParamCount}`;
      countParams.push(type);
      countParamCount++;
    }
    if (category) {
      countQuery += ` AND category ILIKE $${countParamCount}`;
      countParams.push(category);
      countParamCount++;
    }
    if (region) {
      countQuery += ` AND region ILIKE $${countParamCount}`;
      countParams.push(region);
      countParamCount++;
    }
    if (search) {
      countQuery += ` AND (title ILIKE $${countParamCount} OR abstract ILIKE $${countParamCount})`;
      countParams.push(`%${search}%`);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      data: {
        total,
        count: result.rows.length,
        offset: parseInt(offset),
        resources: result.rows,
      },
    });
  } catch (err) {
    console.error("Error fetching research resources:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch resources" });
  }
});

// Get research by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT id, title, type, category, region, authors, organization, year, 
              abstract, key_findings, source_url, license, tags, published_date, created_at
       FROM research_resources
       WHERE id = $1`,
      [parseInt(id)],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Resource not found" });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("Error fetching research resource:", err);
    res.status(500).json({ success: false, error: "Failed to fetch resource" });
  }
});

// Get research by type (Research, Policy, Dataset, Case Study)
router.get("/type/:type", async (req, res) => {
  try {
    const { type } = req.params;

    const result = await pool.query(
      `SELECT id, title, type, category, region, authors, organization, year, 
              abstract, key_findings, source_url, license
       FROM research_resources
       WHERE type ILIKE $1
       ORDER BY year DESC
       LIMIT 100`,
      [type],
    );

    res.json({
      success: true,
      data: {
        type,
        total: result.rows.length,
        resources: result.rows,
      },
    });
  } catch (err) {
    console.error("Error fetching resources by type:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch resources" });
  }
});

// Get research by region
router.get("/region/:region", async (req, res) => {
  try {
    const { region } = req.params;

    const result = await pool.query(
      `SELECT id, title, type, category, region, authors, organization, year, 
              abstract, key_findings, source_url, license
       FROM research_resources
       WHERE region ILIKE $1
       ORDER BY year DESC
       LIMIT 100`,
      [region],
    );

    res.json({
      success: true,
      data: {
        region,
        total: result.rows.length,
        resources: result.rows,
      },
    });
  } catch (err) {
    console.error("Error fetching resources by region:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch resources" });
  }
});

// Get research statistics
router.get("/stats/overview", async (req, res) => {
  try {
    const typeCount = await pool.query(
      `SELECT type, COUNT(*) as count FROM research_resources GROUP BY type`,
    );

    const categoryCount = await pool.query(
      `SELECT category, COUNT(*) as count FROM research_resources GROUP BY category`,
    );

    const regionCount = await pool.query(
      `SELECT region, COUNT(*) as count FROM research_resources GROUP BY region`,
    );

    const totalCount = await pool.query(
      `SELECT COUNT(*) as total FROM research_resources`,
    );

    res.json({
      success: true,
      data: {
        total: parseInt(totalCount.rows[0].total),
        byType: typeCount.rows.reduce((acc, row) => {
          acc[row.type] = parseInt(row.count);
          return acc;
        }, {}),
        byCategory: categoryCount.rows.reduce((acc, row) => {
          acc[row.category] = parseInt(row.count);
          return acc;
        }, {}),
        byRegion: regionCount.rows.reduce((acc, row) => {
          acc[row.region] = parseInt(row.count);
          return acc;
        }, {}),
      },
    });
  } catch (err) {
    console.error("Error fetching research stats:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch statistics" });
  }
});

export default router;
