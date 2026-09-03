import "dotenv/config";
import pg from "pg";

const { Pool } = pg;
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : false,
    })
  : null;
const developmentUsers = new Map();

export async function findUserByEmail(email) {
  if (!pool) return developmentUsers.get(email) || null;
  const result = await pool.query(
    "SELECT id, name, email, password_hash, role, organization FROM users WHERE email = $1",
    [email],
  );
  return result.rows[0] || null;
}

export async function createUser({ name, email, passwordHash }) {
  if (!pool) {
    if (developmentUsers.has(email)) {
      const error = new Error("Email is already registered");
      error.code = "USER_EXISTS";
      throw error;
    }
    const user = {
      id: `dev-${developmentUsers.size + 1}`,
      name,
      email,
      password_hash: passwordHash,
      role: "researcher",
      organization: null,
    };
    developmentUsers.set(email, user);
    return user;
  }
  const result = await pool.query(
    "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'researcher') RETURNING id, name, email, password_hash, role, organization",
    [name, email, passwordHash],
  );
  return result.rows[0];
}
