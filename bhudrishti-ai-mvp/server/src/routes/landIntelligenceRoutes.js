import express from "express";

const router = express.Router();

router.get("/analyze", async (req, res) => {
  const latitude = Number(req.query.lat);
  const longitude = Number(req.query.lng ?? req.query.lon);

  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    return res
      .status(400)
      .json({ success: false, error: "A valid latitude is required." });
  }
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    return res
      .status(400)
      .json({ success: false, error: "A valid longitude is required." });
  }

  const serviceUrl = process.env.AI_SERVICE_URL || "http://localhost:8000";
  const url = new URL("/land-analysis", serviceUrl);
  url.search = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
  });

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
    const payload = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: payload.detail || "Land analysis service failed.",
      });
    }
    return res.json(payload);
  } catch (error) {
    console.error("Land intelligence service failed:", error);
    return res.status(502).json({
      success: false,
      error:
        "Land intelligence is temporarily unavailable. Start the AI service and try again.",
    });
  }
});

export default router;
