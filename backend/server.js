// ✅ dotenv MUST be first
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const Usage = require("./models/Usage");
const auth = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ MIDDLEWARES
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// ✅ AUTH ROUTES
app.use("/api/auth", authRoutes);

// ✅ HEALTH CHECK
app.get("/", (req, res) => {
  res.send("✅ Digital Detox API running");
});

// ✅ POST: Add usage (AUTH REQUIRED)
app.post("/api/usage", auth, async (req, res) => {
  try {
    const { appName, category, minutes, period } = req.body;

    if (!appName || !category || !minutes || !period) {
      return res.status(400).json({ message: "All fields required" });
    }

    const usage = await Usage.create({
      user: req.user.id, // ✅ FIXED
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

// ✅ GET: Fetch user usage (AUTH REQUIRED)
app.get("/api/usage", auth, async (req, res) => {
  try {
    const list = await Usage.find({ user: req.user.id }) // ✅ FIXED
      .sort({ createdAt: -1 });

    res.json(list);
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ DELETE: Clear user history (AUTH REQUIRED)
app.delete("/api/usage", auth, async (req, res) => {
  try {
    await Usage.deleteMany({ user: req.user.id }); // ✅ FIXED
    res.json({ message: "✅ User history cleared" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ CONNECT DB & START SERVER
async function startServer() {
  try {
    console.log("🌍 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`✅ Server running at http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
  }
}

startServer();
