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

export async function findUserById(id) {
  if (!pool) {
    return (
      [...developmentUsers.values()].find((user) => user.id === id) || null
    );
  }
  const result = await pool.query(
    "SELECT id, name, email, password_hash, role, organization FROM users WHERE id = $1",
    [id],
  );
  return result.rows[0] || null;
}

export async function createUser({ name, email, passwordHash, role }) {
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
      role,
      organization: null,
    };
    developmentUsers.set(email, user);
    return user;
  }
  const result = await pool.query(
    "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, password_hash, role, organization",
    [name, email, passwordHash, role],
  );
  return result.rows[0];
}

export async function updateUserName(id, name) {
  if (!pool) {
    const user = [...developmentUsers.values()].find((item) => item.id === id);
    if (!user) return null;
    user.name = name;
    return user;
  }
  const result = await pool.query(
    "UPDATE users SET name = $1, updated_at = NOW() WHERE id = $2 RETURNING id, name, email, password_hash, role, organization",
    [name, id],
  );
  return result.rows[0] || null;
}
