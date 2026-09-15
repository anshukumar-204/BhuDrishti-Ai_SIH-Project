import express from "express";
import {
  getNearbyFeatures,
  OVERPASS_CATEGORIES,
} from "../services/overpassService.js";

const router = express.Router();

router.get("/nearby", async (req, res) => {
  try {
    const categories = String(req.query.categories || "")
      .split(",")
      .map((category) => category.trim())
      .filter(Boolean);
    const data = await getNearbyFeatures({
      latitude: Number(req.query.lat),
      longitude: Number(req.query.lng ?? req.query.lon),
      radiusKm: Number(req.query.radius ?? 2),
      categories: categories.length
        ? categories
        : Object.keys(OVERPASS_CATEGORIES),
    });
    res.json({ success: true, data });
  } catch (error) {
    console.error("Geospatial lookup failed:", error);
    const status = /required|between|categories/i.test(error.message)
      ? 400
      : 502;
    res.status(status).json({
      success: false,
      error:
        status === 400
          ? error.message
          : "Geospatial source temporarily unavailable",
    });
  }
});

export default router;
