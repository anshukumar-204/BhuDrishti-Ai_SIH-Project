import express from "express";
import pool from "../config/database.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const domain = String(req.query.domain || "").trim();
    const params = [];
    let query = `SELECT id, source_key, name, data_domain, source_type, format,
                        coverage, publisher, provenance, limitations,
                        path_or_endpoint, last_updated
                 FROM data_sources`;
    if (domain) {
      params.push(domain);
      query += " WHERE data_domain ILIKE $1";
    }
    query += " ORDER BY data_domain, name";
    const result = await pool.query(query, params);
    res.json({ success: true, data: { sources: result.rows } });
  } catch (error) {
    next(error);
  }
});

router.get("/:sourceKey", async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, source_key, name, data_domain, source_type, format,
              coverage, publisher, provenance, limitations,
              path_or_endpoint, last_updated
       FROM data_sources WHERE source_key = $1`,
      [req.params.sourceKey],
    );
    if (!result.rowCount)
      return res
        .status(404)
        .json({ success: false, error: "Data source not found" });
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

export default router;
