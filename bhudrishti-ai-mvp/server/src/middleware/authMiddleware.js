import "dotenv/config";
import jwt from "jsonwebtoken";

const jwtSecret =
  process.env.JWT_SECRET || "local-development-secret-change-me";

export function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token)
    return res
      .status(401)
      .json({ success: false, error: "Authentication required" });
  try {
    req.user = jwt.verify(token, jwtSecret);
    return next();
  } catch {
    return res
      .status(401)
      .json({ success: false, error: "Invalid or expired token" });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role))
      return res
        .status(403)
        .json({ success: false, error: "Insufficient permissions" });
    return next();
  };
}
