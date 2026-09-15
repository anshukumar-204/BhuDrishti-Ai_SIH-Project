import express from "express";
import pool from "../config/database.js";

const router = express.Router();

const disclaimer =
  "Based on available mapped datasets. This is decision-support information, not legal ownership, official risk certification, or a prediction.";

function detectIntent(text) {
  if (
    /nearby|hospital|school|market|facility|road|railway|water body|forest/i.test(
      text,
    )
  )
    return "NEARBY_FEATURES";
  if (/risk|flood|environment|hazard/i.test(text)) return "RISK_INFO";
  if (/dataset|data set|download|gis layer/i.test(text))
    return "DATASET_SEARCH";
  if (/research|paper|study|article|resource|literature/i.test(text))
    return "RESEARCH_SEARCH";
  if (/policy|simulation|scenario/i.test(text))
    return "POLICY_SIMULATION_GUIDE";
  if (/analytic|trend|distribution|compare/i.test(text))
    return "ANALYTICS_EXPLANATION";
  if (/parcel|khasra|survey|land.*search|search.*land/i.test(text))
    return "PARCEL_INFO";
  return "PLATFORM_HELP";
}

function actionsFor(intent) {
  const actions = {
    PARCEL_INFO: [{ label: "Open Land Explorer", path: "/land-explorer" }],
    NEARBY_FEATURES: [{ label: "Open Land Explorer", path: "/land-explorer" }],
    RESEARCH_SEARCH: [{ label: "Open Research Hub", path: "/research-hub" }],
    DATASET_SEARCH: [{ label: "Open Datasets", path: "/datasets" }],
    ANALYTICS_EXPLANATION: [{ label: "Open Analytics", path: "/analytics" }],
    POLICY_SIMULATION_GUIDE: [
      { label: "Open Policy Simulation", path: "/policy-simulation" },
    ],
    PLATFORM_HELP: [{ label: "Open Land Explorer", path: "/land-explorer" }],
  };
  return actions[intent] || [];
}

router.post("/", async (req, res) => {
  try {
    const question = String(req.body.question || "").trim();
    const parcelId = String(req.body.parcelId || "").trim();
    if (!question)
      return res
        .status(400)
        .json({ success: false, error: "Question is required" });

    const intent = detectIntent(question);
    let answer =
      "I can help with land parcels, GIS layers, research, datasets, analytics, policy simulation, and BhuDrishti navigation.";
    let evidence = [];
    let results = [];

    if (["PARCEL_INFO", "RISK_INFO", "NEARBY_FEATURES"].includes(intent)) {
      const queryId = parcelId || question.match(/[A-Z]{2,5}-?\d{3,}/i)?.[0];
      if (queryId) {
        const parcelResult = await pool.query(
          `SELECT parcel_id, survey_number, locality, land_use, category, area,
                  risk_level, risk_factors, data_source, last_updated
           FROM land_parcels
           WHERE parcel_id ILIKE $1 OR survey_number ILIKE $1
           LIMIT 1`,
          [queryId],
        );
        const parcel = parcelResult.rows[0];
        if (parcel) {
          results = [parcel];
          answer = `Parcel ${parcel.parcel_id} is mapped as ${parcel.land_use || "unavailable"} land in ${parcel.locality || "the available region"}. Area: ${parcel.area ?? "unavailable"} sq. m. Risk layer: ${parcel.risk_level || "unavailable"}.`;
          if (intent === "RISK_INFO")
            answer = `The available risk layer classifies ${parcel.parcel_id} as ${parcel.risk_level || "unavailable"}. ${parcel.risk_factors || "No additional risk factors are recorded."}`;
          if (intent === "NEARBY_FEATURES")
            answer = `I can check nearby mapped facilities for ${parcel.parcel_id} after you open the parcel in Land Explorer. Nearby distances must come from the spatial provider; I will not estimate them.`;
          evidence = [
            `Parcel dataset: ${parcel.data_source || "available land parcel dataset"}`,
            `Last updated: ${parcel.last_updated || "not provided"}`,
          ];
        } else {
          answer = `I could not find a parcel matching ${queryId} in the available dataset. Try a Parcel ID, Khasra/Survey Number, or locality in Land Explorer.`;
        }
      } else {
        answer =
          "Search by location, Parcel ID, or available Khasra/Survey Number in Land Explorer, then select a mapped parcel to view its available land intelligence.";
      }
    } else if (["RESEARCH_SEARCH", "DATASET_SEARCH"].includes(intent)) {
      const search = question
        .replace(/show|find|search|research|papers?|datasets?|data/gi, " ")
        .trim();
      const researchResult = await pool.query(
        `SELECT id, title, type, category, region, year, abstract, source_url, license
         FROM research_resources
         WHERE ($1 = '' OR title ILIKE $2 OR abstract ILIKE $2 OR key_findings ILIKE $2
                OR region ILIKE $2 OR category ILIKE $2)
         ORDER BY year DESC NULLS LAST
         LIMIT 5`,
        [search, `%${search}%`],
      );
      results = researchResult.rows;
      answer = results.length
        ? `I found ${results.length} matching resources from the available research catalog. Open a result to inspect its source and metadata.`
        : "I could not find a matching resource in the available research catalog. Try a region, topic, year, or resource type.";
      evidence = results.length
        ? [
            "Source: BhuDrishti research catalog",
            "Results are limited to resources currently indexed",
          ]
        : [];
    } else if (intent === "ANALYTICS_EXPLANATION") {
      const analyticsResult = await pool.query(
        `SELECT region, year, total_parcels, residential_parcels, agricultural_parcels,
                forest_parcels, builtup_parcels, low_risk, medium_risk, high_risk
         FROM analytics_records ORDER BY year DESC, calculated_at DESC LIMIT 1`,
      );
      const analytics = analyticsResult.rows[0];
      answer = analytics
        ? `Available analytics for ${analytics.region} (${analytics.year}) include land-use distribution, parcel totals, and low/medium/high risk counts. Open Analytics for the complete view.`
        : "No analytics record is currently available for this question.";
      evidence = analytics
        ? [
            `Analytics region: ${analytics.region}`,
            `Data year: ${analytics.year}`,
          ]
        : [];
    } else if (intent === "POLICY_SIMULATION_GUIDE") {
      answer =
        "Open Policy Simulation, select a scenario, define the change to examine, and review the available impact indicators. Results depend on the datasets and model available for that scenario.";
      evidence = [
        "Simulation results are scenario-specific and should be treated as decision support.",
      ];
    } else {
      answer =
        "BhuDrishti combines land parcels, geospatial layers, environmental context, research resources, datasets, analytics, and policy tools. Try asking how to search a parcel, find Dehradun research, explain risk, or explore analytics.";
    }

    res.json({
      success: true,
      data: {
        intent,
        answer,
        evidence,
        results,
        actions: actionsFor(intent),
        disclaimer,
      },
    });
  } catch (error) {
    console.error("Assistant request failed:", error);
    res
      .status(500)
      .json({ success: false, error: "Assistant is temporarily unavailable" });
  }
});

export default router;
