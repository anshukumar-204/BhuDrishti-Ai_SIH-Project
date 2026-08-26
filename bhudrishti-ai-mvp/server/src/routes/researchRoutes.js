import express from "express";
import { research } from "../data/mockData.js";

const router = express.Router();

router.get("/", (req, res) => {
  const { type, search } = req.query;
  let filtered = [...research];
  if (type) filtered = filtered.filter((r) => r.type === type);
  if (search) {
    filtered = filtered.filter(
      (r) =>
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase()),
    );
  }
  res.json({
    success: true,
    data: { total: filtered.length, resources: filtered },
  });
});

router.get("/:id", (req, res) => {
  const item = research.find((r) => r.id === parseInt(req.params.id));
  if (!item)
    return res
      .status(404)
      .json({ success: false, error: "Resource not found" });
  res.json({ success: true, data: item });
});

export default router;
