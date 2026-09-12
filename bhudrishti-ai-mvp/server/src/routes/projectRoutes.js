import express from "express";
import pool from "../config/database.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, title, description, status, created_at, updated_at
       FROM research_projects WHERE owner_id = $1 ORDER BY updated_at DESC`,
      [req.user.sub],
    );
    res.json({ success: true, data: { projects: result.rows } });
  } catch (error) {
    next(error);
  }
});

router.get("/saved-resources", async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT r.id, r.title, r.type, r.region, r.year, sr.created_at AS saved_at
       FROM saved_resources sr
       JOIN research_resources r ON r.id = sr.resource_id
       WHERE sr.user_id = $1
       ORDER BY sr.created_at DESC`,
      [req.user.sub],
    );
    res.json({ success: true, data: { resources: result.rows } });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const title = String(req.body?.title || "").trim();
    const description = String(req.body?.description || "").trim();
    if (!title)
      return res
        .status(400)
        .json({ success: false, error: "Project title is required" });
    const result = await pool.query(
      `INSERT INTO research_projects (title, description, owner_id)
       VALUES ($1, $2, $3) RETURNING id, title, description, status, created_at, updated_at`,
      [title, description || null, req.user.sub],
    );
    res.status(201).json({ success: true, data: { project: result.rows[0] } });
  } catch (error) {
    next(error);
  }
});

router.post("/:projectId/notes", async (req, res, next) => {
  try {
    const projectId = Number(req.params.projectId);
    const body = String(req.body?.body || "").trim();
    const visibility =
      req.body?.visibility === "project" ? "project" : "private";
    if (!body)
      return res
        .status(400)
        .json({ success: false, error: "Note body is required" });
    const membership = await pool.query(
      `SELECT id FROM research_projects WHERE id = $1 AND owner_id = $2
       UNION SELECT project_id FROM project_members WHERE project_id = $1 AND user_id = $2`,
      [projectId, req.user.sub],
    );
    if (!membership.rowCount)
      return res
        .status(404)
        .json({ success: false, error: "Project not found" });
    const result = await pool.query(
      `INSERT INTO research_notes (project_id, user_id, body, visibility)
       VALUES ($1, $2, $3, $4) RETURNING id, project_id, body, visibility, created_at`,
      [projectId, req.user.sub, body, visibility],
    );
    res.status(201).json({ success: true, data: { note: result.rows[0] } });
  } catch (error) {
    next(error);
  }
});

router.post("/saved-resources", async (req, res, next) => {
  try {
    const resourceId = Number(req.body?.resourceId);
    if (!Number.isInteger(resourceId))
      return res
        .status(400)
        .json({ success: false, error: "resourceId is required" });
    const result = await pool.query(
      `INSERT INTO saved_resources (user_id, resource_id) VALUES ($1, $2)
       ON CONFLICT (user_id, resource_id) DO NOTHING
       RETURNING id, user_id, resource_id, created_at`,
      [req.user.sub, resourceId],
    );
    res
      .status(201)
      .json({ success: true, data: { saved: result.rows[0] || null } });
  } catch (error) {
    next(error);
  }
});

router.delete("/saved-resources/:resourceId", async (req, res, next) => {
  try {
    await pool.query(
      "DELETE FROM saved_resources WHERE user_id = $1 AND resource_id = $2",
      [req.user.sub, Number(req.params.resourceId)],
    );
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
