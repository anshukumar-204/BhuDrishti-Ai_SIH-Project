import express from "express";
const router = express.Router();
router.post("/login", (req, res) => {
  const email = String(req.body?.email || "");
  if (!email)
    return res.status(400).json({ success: false, error: "Email is required" });
  res.json({
    success: true,
    data: {
      token: `demo-token-${Date.now()}`,
      user: { name: email.split("@")[0], email, role: "Researcher" },
    },
  });
});
export default router;
