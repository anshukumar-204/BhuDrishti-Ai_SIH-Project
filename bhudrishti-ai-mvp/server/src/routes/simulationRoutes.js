import express from "express";
import pool from "../config/database.js";

const router = express.Router();

// Create and run a policy simulation
router.post("/", async (req, res) => {
  try {
    const { region, scenarioName, areaHectares } = req.body;
    const userId = req.user?.sub || null;

    if (!region || !scenarioName || !areaHectares) {
      return res.status(400).json({
        success: false,
        error: "region, scenarioName, and areaHectares are required",
      });
    }

    // Calculate indicative impacts (demo model)
    const area = Math.max(100, Number(areaHectares || 500));
    const factor = area / 500;

    const agriculturalImpact = Math.min(92, Math.round(42 * factor));
    const environmentalRisk = Math.min(88, Math.round(28 * factor));
    const infrastructurePressure = Math.min(95, Math.round(36 * factor));
    const developmentPotential = Math.min(99, Math.round(61 + factor * 8));

    // Store simulation in database
    const result = await pool.query(
      `INSERT INTO simulations (user_id, region, scenario_name, area_hectares, 
                                agricultural_impact, environmental_risk, 
                                infrastructure_pressure, development_potential, results)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, created_at`,
      [
        userId,
        region,
        scenarioName,
        areaHectares,
        agriculturalImpact,
        environmentalRisk,
        infrastructurePressure,
        developmentPotential,
        JSON.stringify({
          inputArea: area,
          factor,
          methodology: "Indicative scenario-based decision support",
        }),
      ],
    );

    res.json({
      success: true,
      data: {
        simulationId: result.rows[0].id,
        region,
        scenario: scenarioName,
        areaHectares,
        results: {
          agriculturalImpact,
          environmentalRisk,
          infrastructurePressure,
          developmentPotential,
        },
        disclaimer:
          "Indicative scenario-based decision-support model. NOT a scientifically validated prediction. Use only for preliminary planning discussion.",
        riskFactors: {
          agriculturalImpact:
            "Based on land-use conversion and productivity loss estimate",
          environmentalRisk:
            "Based on ecosystem sensitivity and protection criteria",
          infrastructurePressure:
            "Based on density and service capacity indicators",
          developmentPotential: "Based on zoning and regulatory framework",
        },
        methodology: "Indicative scenario simulation for planning discussion",
        createdAt: result.rows[0].created_at,
      },
    });
  } catch (err) {
    console.error("Error running simulation:", err);
    res.status(500).json({ success: false, error: "Simulation failed" });
  }
});

// Get simulation results
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT id, region, scenario_name, area_hectares, agricultural_impact, 
              environmental_risk, infrastructure_pressure, development_potential, 
              results, created_at
       FROM simulations
       WHERE id = $1`,
      [parseInt(id)],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Simulation not found",
      });
    }

    const sim = result.rows[0];

    res.json({
      success: true,
      data: {
        simulationId: sim.id,
        region: sim.region,
        scenario: sim.scenario_name,
        areaHectares: sim.area_hectares,
        results: {
          agriculturalImpact: sim.agricultural_impact,
          environmentalRisk: sim.environmental_risk,
          infrastructurePressure: sim.infrastructure_pressure,
          developmentPotential: sim.development_potential,
        },
        disclaimer:
          "Indicative scenario-based decision-support. NOT a validated prediction.",
        createdAt: sim.created_at,
      },
    });
  } catch (err) {
    console.error("Error fetching simulation:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch simulation" });
  }
});

// List simulations for user
router.get("/", async (req, res) => {
  try {
    const userId = req.user?.sub;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const result = await pool.query(
      `SELECT id, region, scenario_name, area_hectares, agricultural_impact, 
              environmental_risk, infrastructure_pressure, development_potential, 
              created_at
       FROM simulations
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 100`,
      [userId],
    );

    res.json({
      success: true,
      data: {
        total: result.rows.length,
        simulations: result.rows,
      },
    });
  } catch (err) {
    console.error("Error fetching simulations:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch simulations" });
  }
});

export default router;
