// ✅ dotenv MUST be first
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Usage = require("./models/Usage");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ MIDDLEWARES
app.use(cors({ origin: "http://localhost:5173" })); // Vite frontend
app.use(express.json());

// ✅ HEALTH CHECK
app.get("/", (req, res) => {
  res.send("✅ Digital Detox API running");
});

// ✅ POST: Add app usage
app.post("/api/usage", async (req, res) => {
  try {
    const { appName, category, minutes, period } = req.body;

    if (!appName || !minutes || !category || !period) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const usage = await Usage.create({
      appName,
      category,
      minutes,
      period,
    });

    res.status(201).json(usage);
  } catch (err) {
    console.error("❌ Save error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET: Fetch usage history
app.get("/api/usage", async (req, res) => {
  try {
    const list = await Usage.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ DELETE: Clear all history
app.delete("/api/usage", async (req, res) => {
  try {
    await Usage.deleteMany({});
    res.json({ message: "✅ All history cleared" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ CONNECT DB & START SERVER (ONLY ONCE)
async function startServer() {
  try {
    console.log("🌍 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
  }
}

startServer();
