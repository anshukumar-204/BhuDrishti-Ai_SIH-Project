import express from "express";
import { lands } from "../data/mockData.js";

const router = express.Router();
router.get("/", (req, res) => {
  const query = String(req.query.query || "").toLowerCase();
  const parcel = lands.find((land) =>
    [land.parcelId, land.surveyNumber, land.locality].some((value) =>
      String(value).toLowerCase().includes(query),
    ),
  );
  if (!parcel)
    return res
      .status(404)
      .json({ success: false, error: "No matching parcel found" });
  res.json({
    success: true,
    data: {
      parcel,
      nearbyFeatures: [
        { name: "Highway", distance: "1.2 km" },
        { name: "Hospital", distance: "0.8 km" },
      ],
      disclaimer:
        "Research and decision-support only; not official land records.",
    },
  });
});
export default router;
