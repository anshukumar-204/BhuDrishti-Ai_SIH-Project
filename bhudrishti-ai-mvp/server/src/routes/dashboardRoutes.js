import express from "express";
import pool from "../config/database.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const userId = req.user.sub;
    const [
      counts,
      projects,
      resources,
      savedParcels,
      activity,
      snapshot,
      research,
    ] = await Promise.all([
      pool.query(
        `SELECT
             COUNT(*) FILTER (WHERE action LIKE '%/land-check%')::int AS land_checks,
             COUNT(*) FILTER (WHERE action LIKE '%/ai/insight%')::int AS insights
           FROM audit_logs
           WHERE user_id = $1 AND status = 'success'`,
        [userId],
      ),
      pool.query(
        "SELECT COUNT(*)::int AS count FROM research_projects WHERE owner_id = $1",
        [userId],
      ),
      pool.query(
        "SELECT COUNT(*)::int AS count FROM saved_resources WHERE user_id = $1",
        [userId],
      ),
      pool.query(
        `SELECT sp.id, p.parcel_id, p.locality, p.land_use, p.category,
                  p.risk_level, sp.created_at AS saved_at
           FROM saved_parcels sp
           JOIN land_parcels p ON p.id = sp.parcel_id
           WHERE sp.user_id = $1
           ORDER BY sp.created_at DESC
           LIMIT 6`,
        [userId],
      ),
      pool.query(
        `SELECT action, resource, status, created_at
           FROM audit_logs
           WHERE user_id = $1 AND status = 'success'
           ORDER BY created_at DESC
           LIMIT 6`,
        [userId],
      ),
      pool.query(
        `SELECT parcel_id, locality, land_use, category, risk_level, area,
                  last_updated
           FROM land_parcels
           ORDER BY last_updated DESC NULLS LAST, created_at DESC
           LIMIT 1`,
      ),
      pool.query(
        `SELECT id, title, type, category, region, year
           FROM research_resources
           ORDER BY is_featured DESC, year DESC, published_date DESC NULLS LAST
           LIMIT 4`,
      ),
    ]);

    const countRow = counts.rows[0];
    const snapshotRow = snapshot.rows[0] || null;
    res.json({
      success: true,
      data: {
        stats: {
          savedResources: resources.rows[0].count,
          landChecks: countRow.land_checks,
          insights: countRow.insights,
          projects: projects.rows[0].count,
        },
        recentActivity: activity.rows,
        savedParcels: savedParcels.rows,
        snapshot: snapshotRow
          ? {
              parcelId: snapshotRow.parcel_id,
              locality: snapshotRow.locality,
              landUse: snapshotRow.land_use,
              category: snapshotRow.category,
              riskLevel: snapshotRow.risk_level,
              area: snapshotRow.area,
              lastUpdated: snapshotRow.last_updated,
            }
          : null,
        recommendedResearch: research.rows,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/saved-parcels", async (req, res, next) => {
  try {
    const parcelId = String(req.body?.parcelId || "").trim();
    if (!parcelId)
      return res
        .status(400)
        .json({ success: false, error: "parcelId is required" });

    const result = await pool.query(
      `INSERT INTO saved_parcels (user_id, parcel_id)
       SELECT $1, id FROM land_parcels WHERE parcel_id = $2
       ON CONFLICT (user_id, parcel_id) DO NOTHING
       RETURNING id, parcel_id, created_at`,
      [req.user.sub, parcelId],
    );
    if (!result.rowCount)
      return res
        .status(404)
        .json({ success: false, error: "Parcel not found" });
    res.status(201).json({ success: true, data: { saved: result.rows[0] } });
  } catch (error) {
    next(error);
  }
});

router.delete("/saved-parcels/:parcelId", async (req, res, next) => {
  try {
    await pool.query(
      `DELETE FROM saved_parcels sp
       USING land_parcels p
       WHERE sp.user_id = $1 AND sp.parcel_id = p.id AND p.parcel_id = $2`,
      [req.user.sub, req.params.parcelId],
    );
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
