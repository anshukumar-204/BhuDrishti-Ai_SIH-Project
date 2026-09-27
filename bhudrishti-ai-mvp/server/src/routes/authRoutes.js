import "dotenv/config";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserName,
} from "../models/userModel.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();
const jwtSecret =
  process.env.JWT_SECRET || "local-development-secret-change-me";

const publicUser = ({ id, name, email, role, organization }) => ({
  id,
  name,
  email,
  role,
  organization,
});
const createToken = (user) =>
  jwt.sign({ sub: user.id, role: user.role, email: user.email }, jwtSecret, {
    expiresIn: "7d",
  });
const selectableRoles = ["citizen", "researcher", "government"];

router.post("/register", async (req, res, next) => {
  try {
    const name = String(req.body?.name || "").trim();
    const email = String(req.body?.email || "")
      .trim()
      .toLowerCase();
    const password = String(req.body?.password || "");
    const role = String(req.body?.role || "citizen")
      .trim()
      .toLowerCase();
    if (!name || !email || password.length < 8) {
      return res.status(400).json({
        success: false,
        error:
          "Name, email, and a password of at least 8 characters are required",
      });
    }
    if (!selectableRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        error: "Choose citizen, researcher, or government access",
      });
    }
    const user = await createUser({
      name,
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role,
    });
    return res.status(201).json({
      success: true,
      data: { token: createToken(user), user: publicUser(user) },
    });
  } catch (error) {
    if (error.code === "23505" || error.code === "USER_EXISTS")
      return res
        .status(409)
        .json({ success: false, error: "Email is already registered" });
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const email = String(req.body?.email || "")
      .trim()
      .toLowerCase();
    const password = String(req.body?.password || "");
    const requestedRole = String(req.body?.role || "")
      .trim()
      .toLowerCase();
    const user = await findUserByEmail(email);
    const valid = user && (await bcrypt.compare(password, user.password_hash));
    if (!valid)
      return res
        .status(401)
        .json({ success: false, error: "Invalid email or password" });
    if (requestedRole && requestedRole !== user.role && user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: `This account is registered as ${user.role}. Choose the matching access type.`,
      });
    }
    return res.json({
      success: true,
      data: { token: createToken(user), user: publicUser(user) },
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await findUserById(req.user.sub);
    if (!user)
      return res.status(404).json({ success: false, error: "User not found" });
    return res.json({ success: true, data: { user: publicUser(user) } });
  } catch (error) {
    return next(error);
  }
});

router.patch("/me", requireAuth, async (req, res, next) => {
  try {
    const name = String(req.body?.name || "").trim();
    if (name.length < 2 || name.length > 120) {
      return res.status(400).json({
        success: false,
        error: "Name must be between 2 and 120 characters",
      });
    }
    const user = await updateUserName(req.user.sub, name);
    if (!user)
      return res.status(404).json({ success: false, error: "User not found" });
    return res.json({ success: true, data: { user: publicUser(user) } });
  } catch (error) {
    return next(error);
  }
});

export default router;
