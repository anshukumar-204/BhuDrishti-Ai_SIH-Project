import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import landRoutes from "./routes/landRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import researchRoutes from "./routes/researchRoutes.js";
import landCheckRoutes from "./routes/landCheckRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import simulationRoutes from "./routes/simulationRoutes.js";
import verificationRoutes from "./routes/verificationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import dataSourceRoutes from "./routes/dataSourceRoutes.js";
import landIntelligenceRoutes from "./routes/landIntelligenceRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import assistantRoutes from "./routes/assistantRoutes.js";
import geospatialRoutes from "./routes/geospatialRoutes.js";
import { requireAuth, requireRole } from "./middleware/authMiddleware.js";
import auditLogger from "./middleware/auditLogger.js";

const app = express();

// Security Middleware
app.use(helmet());

// CORS Configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || "15") * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
  message: "Too many requests from this IP, please try again later.",
});

app.use("/api/", limiter);

// Body Parser Middleware
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ limit: "10kb", extended: true }));

// Audit Logger Middleware
app.use(auditLogger);

// Protected API groups must be guarded before their routers are mounted.
app.use(
  [
    "/api/analytics",
    "/api/land-check",
    "/api/ai",
    "/api/simulation",
    "/api/verification",
    "/api/dashboard",
    "/api/profile",
    "/api/geospatial",
  ],
  requireAuth,
);

// Routes
app.use("/api/lands", landRoutes);
app.use("/api/land-intelligence", landIntelligenceRoutes);
app.use("/api/geospatial", geospatialRoutes);
app.get("/api/locations/search", async (req, res) => {
  const query = String(req.query.q || "").trim();
  if (!query) {
    return res
      .status(400)
      .json({ success: false, error: "Search query is required" });
  }

  try {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.search = new URLSearchParams({
      q: query,
      format: "jsonv2",
      addressdetails: "1",
      limit: "5",
      countrycodes: "in",
    });
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "BhuDrishtiAI/1.0 (land-explorer-demo)",
      },
    });
    if (!response.ok) throw new Error(`Nominatim returned ${response.status}`);
    const places = await response.json();
    res.json({
      success: true,
      data: places.map((place) => ({
        name: place.display_name,
        latitude: Number(place.lat),
        longitude: Number(place.lon),
        type: place.type,
        boundingBox: place.boundingbox?.map(Number) || null,
        source: "OpenStreetMap Nominatim",
      })),
    });
  } catch (err) {
    console.error("Location search failed:", err);
    res
      .status(502)
      .json({ success: false, error: "Location service unavailable" });
  }
});
app.use("/api/analytics", analyticsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/research", researchRoutes);
app.use("/api/assistant", assistantRoutes);
app.use("/api/data-sources", dataSourceRoutes);
app.use(
  "/api/projects",
  requireAuth,
  requireRole("researcher", "admin"),
  projectRoutes,
);
app.use("/api/land-check", landCheckRoutes);
app.use("/api/ai", requireRole("researcher", "government", "admin"), aiRoutes);
app.use(
  "/api/simulation",
  requireRole("researcher", "government", "admin"),
  simulationRoutes,
);
app.use("/api/verification", verificationRoutes);
app.use("/api/auth", authRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "BhuDrishti AI",
    timestamp: new Date().toISOString(),
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("🔴 Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export default app;
