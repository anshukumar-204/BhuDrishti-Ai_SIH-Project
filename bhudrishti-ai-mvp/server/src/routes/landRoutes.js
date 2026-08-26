import express from "express";
import { lands } from "../data/mockData.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ success: true, data: { total: lands.length, parcels: lands } });
});

router.get("/:id", (req, res) => {
  const parcel = lands.find(
    (l) => l.parcelId === req.params.id || l.id === parseInt(req.params.id),
  );
  if (!parcel)
    return res.status(404).json({ success: false, error: "Parcel not found" });
  res.json({ success: true, data: parcel });
});

export default router;
