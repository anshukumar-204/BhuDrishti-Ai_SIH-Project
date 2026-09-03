import express from "express";
import cors from "cors";
import landRoutes from "./routes/landRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import researchRoutes from "./routes/researchRoutes.js";
import landCheckRoutes from "./routes/landCheckRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import simulationRoutes from "./routes/simulationRoutes.js";
import verificationRoutes from "./routes/verificationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { requireAuth } from "./middleware/authMiddleware.js";

const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Protected API groups must be guarded before their routers are mounted.
app.use(
  [
    "/api/analytics",
    "/api/land-check",
    "/api/ai",
    "/api/simulation",
    "/api/verification",
  ],
  requireAuth,
);

// Routes
app.use("/api/lands", landRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/research", researchRoutes);
app.use("/api/land-check", landCheckRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/simulation", simulationRoutes);
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
  console.error(err.stack);
  res.status(500).json({ success: false, error: err.message });
});

export default app;
