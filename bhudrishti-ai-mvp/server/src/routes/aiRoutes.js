import express from "express";
const router = express.Router();
router.post("/insight", (req, res) => {
  const parcel = req.body?.parcel || {};
  res.json({
    success: true,
    data: {
      summary: `${parcel.parcelId || "Selected area"} shows a ${String(parcel.landUse || "mixed").toLowerCase()} context with ${String(parcel.riskLevel || "moderate").toLowerCase()} mapped risk. Review local zoning, infrastructure capacity, and official records before action.`,
      evidence: [
        "Parcel dataset",
        "Mapped risk layer",
        "Infrastructure context",
        "Curated research resources",
      ],
    },
  });
});
export default router;
