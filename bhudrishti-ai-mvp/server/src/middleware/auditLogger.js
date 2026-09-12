import pool from "../config/database.js";

// Audit logger middleware
const auditLogger = async (req, res, next) => {
  // Skip logging for health checks
  if (req.path === "/api/health") {
    return next();
  }

  // Capture original send function
  const originalSend = res.send;

  // Override send to log after response
  res.send = function (data) {
    // Log the audit
    if (req.user) {
      logAudit({
        user_id: req.user.sub,
        action: `${req.method} ${req.path}`,
        resource: req.path.split("/").pop() || "api",
        status: res.statusCode >= 400 ? "error" : "success",
        metadata: {
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          timestamp: new Date().toISOString(),
        },
      }).catch((err) => console.error("❌ Audit logging error:", err));
    }

    // Call original send
    res.send = originalSend;
    return res.send(data);
  };

  next();
};

// Helper function to log audit
async function logAudit({ user_id, action, resource, status, metadata }) {
  try {
    await pool.query(
      `INSERT INTO audit_logs (user_id, action, resource, status, metadata, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [user_id, action, resource, status, JSON.stringify(metadata)],
    );
  } catch (err) {
    console.error("❌ Failed to log audit:", err);
  }
}

export default auditLogger;
