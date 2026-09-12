import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || undefined,
  user: process.env.DATABASE_USER || "postgres",
  password: process.env.DATABASE_PASSWORD || undefined,
  host: process.env.DATABASE_HOST || "localhost",
  port: parseInt(process.env.DATABASE_PORT || "5432"),
  database: process.env.DATABASE_NAME || "bhudrishti",
});

// Test connection
pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL database");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected error on idle client", err);
});

export default pool;

// Query function for convenience
export const query = (text, params) => {
  const start = Date.now();
  return pool.query(text, params).then((res) => {
    const duration = Date.now() - start;
    console.log(
      `📊 Executed query (${duration}ms): ${text.substring(0, 50)}...`,
    );
    return res;
  });
};
