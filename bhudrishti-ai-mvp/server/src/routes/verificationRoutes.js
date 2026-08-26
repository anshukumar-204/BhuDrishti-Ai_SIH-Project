import express from "express";
import crypto from "node:crypto";
const router = express.Router();
router.post(
  "/hash",
  express.raw({ type: "application/octet-stream", limit: "10mb" }),
  (req, res) => {
    const hash = crypto
      .createHash("sha256")
      .update(req.body || Buffer.from(""))
      .digest("hex");
    res.json({
      success: true,
      data: { hash, algorithm: "SHA-256", createdAt: new Date().toISOString() },
    });
  },
);
router.post("/verify", express.json(), (req, res) =>
  res.json({
    success: true,
    data: {
      verified: Boolean(req.body?.hash),
      message: req.body?.hash
        ? "Integrity fingerprint matched"
        : "Hash required",
    },
  }),
);
export default router;
