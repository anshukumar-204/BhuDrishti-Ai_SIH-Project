import express from "express";
import pool from "../config/database.js";

const router = express.Router();

// Generate AI insight for a selected parcel
router.post("/insight", async (req, res) => {
  try {
    const { parcelId, locality, landUse, riskLevel, area } = req.body;

    if (!parcelId) {
      return res.status(400).json({
        success: false,
        error: "Parcel ID is required",
      });
    }

    // Fetch parcel details from database
    const parcelResult = await pool.query(
      `SELECT * FROM land_parcels WHERE parcel_id = $1`,
      [parcelId],
    );

    if (parcelResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Parcel not found",
      });
    }

    const parcel = parcelResult.rows[0];

    // Fetch related research
    const researchResult = await pool.query(
      `SELECT id, title, type, category, year FROM research_resources
       WHERE region ILIKE $1 OR category ILIKE $2
       LIMIT 3`,
      [parcel.locality, parcel.land_use],
    );

    // Get analytics context
    const analyticsResult = await pool.query(
      `SELECT total_parcels, residential_parcels, agricultural_parcels, 
              low_risk, medium_risk, high_risk
       FROM analytics_records
       WHERE region ILIKE $1
       ORDER BY year DESC
       LIMIT 1`,
      [parcel.locality],
    );

    // Build AI insight
    const insight = generateAIInsight(
      parcel,
      analyticsResult.rows[0],
      researchResult.rows,
    );

    res.json({
      success: true,
      data: {
        parcelId: parcel.parcel_id,
        insight,
        relatedResearch: researchResult.rows,
        disclaimer:
          "Based on available dataset. This is decision-support information, not legal or official verification.",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error("Error generating AI insight:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to generate insight" });
  }
});

// Helper function to generate structured AI insight
function generateAIInsight(parcel, analytics, research) {
  const riskDescription = {
    Low: "low mapped risk indicators",
    Medium: "moderate risk factors requiring attention",
    High: "significant risk indicators requiring careful review",
  };

  const riskBasis = [
    "Proximity to water bodies and hazard zones",
    "Environmental sensitivity classification",
    "Infrastructure accessibility and density",
    "Dataset-based risk indicators",
  ];

  const landUseContext =
    {
      Residential: "residential development context",
      Agricultural: "agricultural productivity zone",
      Commercial: "commercial activity area",
      Forest: "forest conservation area",
    }[parcel.land_use] || "mixed-use area";

  return {
    summary: `${parcel.parcel_id} displays ${landUseContext} with ${riskDescription[parcel.risk_level] || "variable risk"}. Area: ${parcel.area} sq.m, located in ${parcel.locality}.`,

    observedSignals: [
      `Land Use: ${parcel.land_use} (${parcel.category} category)`,
      `Risk Level: ${parcel.risk_level} - ${parcel.risk_factors}`,
      `Environmental Context: ${parcel.environmental_risk} environmental risk`,
      `Development Context: ${parcel.development_risk} development pressure`,
    ],

    potentialConsiderations: [
      `Review zoning and land-use policy for ${parcel.land_use} in ${parcel.locality}`,
      `Validate with official records and government cadastral data`,
      `Consider infrastructure capacity: ${parcel.development_risk} development risk indicated`,
      `Cross-reference with local environmental regulations`,
    ],

    recommendedNextSteps: [
      "Review official zoning documentation",
      "Consult with municipal planning authority",
      "Validate boundaries with official cadastral records",
      "Cross-check with environmental and climate risk assessments",
    ],

    evidence: {
      parcelDataset: "✓ Land parcel records",
      riskLayer: "✓ Risk assessment data",
      infrastructureContext: "✓ Infrastructure mapping",
      researchResources:
        research.length > 0
          ? `✓ ${research.length} related research items`
          : "○ No directly related research",
      analyticsContext: analytics
        ? "✓ Regional analytics"
        : "○ No regional analytics",
    },

    limitations: [
      "Based on available demonstration dataset",
      "Risk assessment is indicative, not scientifically validated prediction",
      "Spatial data accuracy depends on source dataset precision",
      "Should not be used as sole basis for legal or investment decisions",
      "Always verify with official government records and legal professionals",
    ],

    riskBasisDetails: {
      floodProximity: "Distance to water bodies and flood zones",
      environmentalSensitivity: "Classification based on ecosystem value",
      infrastructureContext: "Proximity to roads, utilities, services",
      datasetIndicator: "Dataset-derived risk signal",
    },
  };
}

export default router;
