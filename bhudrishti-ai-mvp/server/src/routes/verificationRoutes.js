import express from "express";
import crypto from "node:crypto";
import pool from "../config/database.js";

const router = express.Router();

// Upload document and generate/store SHA-256 hash
router.post(
  "/hash",
  express.raw({ type: "application/octet-stream", limit: "10mb" }),
  async (req, res) => {
    try {
      const fileName = req.headers["x-file-name"] || `document-${Date.now()}`;
      const userId = req.user?.sub || null;

      // Generate SHA-256 hash of the file
      const hash = crypto
        .createHash("sha256")
        .update(req.body || Buffer.from(""))
        .digest("hex");

      // Store in database
      const result = await pool.query(
        `INSERT INTO verification_records (file_name, file_hash, algorithm, uploaded_by, verification_status)
         VALUES ($1, $2, 'SHA-256', $3, 'stored')
         RETURNING id, file_name, file_hash, algorithm, created_at`,
        [fileName, hash, userId],
      );

      res.json({
        success: true,
        data: {
          id: result.rows[0].id,
          fileName: result.rows[0].file_name,
          hash: result.rows[0].file_hash,
          algorithm: result.rows[0].algorithm,
          createdAt: result.rows[0].created_at,
          message: "Document hash generated and stored for verification",
        },
      });
    } catch (err) {
      console.error("Error generating hash:", err);
      res
        .status(500)
        .json({ success: false, error: "Failed to generate hash" });
    }
  },
);

// Verify document integrity by comparing SHA-256 hashes
router.post(
  "/verify",
  express.raw({ type: "application/octet-stream", limit: "10mb" }),
  async (req, res) => {
    try {
      const { fileHash, recordId } = req.query;

      if (!fileHash && !recordId) {
        return res.status(400).json({
          success: false,
          error: "Either fileHash or recordId is required",
        });
      }

      // Generate hash of uploaded file
      const newHash = crypto
        .createHash("sha256")
        .update(req.body || Buffer.from(""))
        .digest("hex");

      let result;
      let isMatch = false;
      let storedRecord = null;

      if (recordId) {
        // Verify against stored record
        const stored = await pool.query(
          `SELECT id, file_name, file_hash, created_at FROM verification_records WHERE id = $1`,
          [parseInt(recordId)],
        );

        if (stored.rows.length === 0) {
          return res.status(404).json({
            success: false,
            error: "Verification record not found",
          });
        }

        storedRecord = stored.rows[0];
        isMatch = newHash === storedRecord.file_hash;
      } else {
        // Verify against provided hash
        isMatch = newHash === fileHash;
      }

      // Update verification status if using record ID
      if (recordId && isMatch) {
        await pool.query(
          `UPDATE verification_records 
           SET verification_status = 'verified', verified_at = NOW()
           WHERE id = $1`,
          [parseInt(recordId)],
        );
      }

      res.json({
        success: true,
        data: {
          verified: isMatch,
          newHash,
          storedHash: storedRecord?.file_hash || fileHash,
          status: isMatch ? "MATCH ✓" : "MISMATCH ✗",
          message: isMatch
            ? "✓ File integrity verified - hash matches exactly"
            : "✗ File integrity check failed - hash does not match. File may have been modified.",
          verifiedFile: storedRecord?.file_name || "Provided hash",
          verifiedAt: storedRecord?.created_at || new Date().toISOString(),
          algorithm: "SHA-256",
          disclaimer:
            "Hash verification confirms file integrity but does not verify content authenticity or legal status.",
        },
      });
    } catch (err) {
      console.error("Error verifying hash:", err);
      res.status(500).json({ success: false, error: "Verification failed" });
    }
  },
);

// Get verification records for authenticated user
router.get("/records", async (req, res) => {
  try {
    const userId = req.user?.sub;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const result = await pool.query(
      `SELECT id, file_name, file_hash, algorithm, verification_status, created_at, verified_at
       FROM verification_records
       WHERE uploaded_by = $1
       ORDER BY created_at DESC
       LIMIT 100`,
      [userId],
    );

    res.json({
      success: true,
      data: {
        total: result.rows.length,
        records: result.rows,
      },
    });
  } catch (err) {
    console.error("Error fetching verification records:", err);
    res.status(500).json({ success: false, error: "Failed to fetch records" });
  }
});

// Get specific verification record
router.get("/record/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT id, file_name, file_hash, algorithm, verification_status, created_at, verified_at
       FROM verification_records
       WHERE id = $1`,
      [parseInt(id)],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Verification record not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error fetching verification record:", err);
    res.status(500).json({ success: false, error: "Failed to fetch record" });
  }
});

export default router;
