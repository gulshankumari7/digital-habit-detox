const express = require("express");
const router = express.Router();
const Usage = require("../models/Usage");
const auth = require("../middleware/auth");

// ✅ SAVE USAGE (protected)
router.post("/", auth, async (req, res) => {
  try {
    const { appName, category, minutes, period } = req.body;

    if (!appName || !minutes) {
      return res.status(400).json({ message: "App name & minutes required" });
    }

    const usage = await Usage.create({
      user: req.user.id, // ✅ comes from JWT
      appName,
      category,
      minutes,
      period,
    });

    res.status(201).json(usage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET USER USAGE ONLY
router.get("/", auth, async (req, res) => {
  try {
    const list = await Usage.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ CLEAR HISTORY
router.delete("/", auth, async (req, res) => {
  try {
    await Usage.deleteMany({ user: req.user.id });
    res.json({ message: "✅ History cleared" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
