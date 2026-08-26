import express from "express";
import { analytics } from "../data/mockData.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ success: true, data: analytics });
});

router.get("/area-stats", (req, res) => {
  res.json({
    success: true,
    data: {
      region: "dehradun",
      ...analytics,
      landUseDistribution: {
        residential: analytics.residential,
        agricultural: analytics.agricultural,
        forest: analytics.forest,
        commercial: analytics.commercial,
      },
      riskDistribution: {
        low: analytics.lowRisk,
        medium: analytics.mediumRisk,
        high: analytics.highRisk,
      },
    },
  });
});

export default router;
