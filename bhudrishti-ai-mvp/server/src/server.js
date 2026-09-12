import app from "./app.js";
import dotenv from "dotenv";
import initializeDatabase from "./utils/initializeDb.js";
import seedDatabase from "./utils/seedDb.js";
import pool from "./config/database.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Initialize database on startup
const startServer = async () => {
  try {
    // Test database connection
    const result = await pool.query("SELECT NOW()");
    console.log("✅ Database connected");

    // Initialize database schema
    await initializeDatabase();

    // Seed database with initial data
    await seedDatabase();

    // Start server
    app.listen(PORT, () => {
      console.log(
        `🚀 BhuDrishti AI Server running on http://localhost:${PORT}`,
      );
      console.log(`📍 API: http://localhost:${PORT}/api`);
      console.log(`🗄️  Database: ${process.env.DATABASE_NAME || "bhudrishti"}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
