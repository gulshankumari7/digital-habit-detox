// ✅ Load env first
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// routes & middleware
const authRoutes = require("./routes/auth");
const auth = require("./middleware/auth");
const Usage = require("./models/Usage");

const app = express();
const PORT = process.env.PORT || 5000;


// ✅ MIDDLEWARES
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://digital-habit-detox.vercel.app"
    ],
    credentials: true,
  })
);

app.use(express.json());

// ✅ ROUTES
app.use("/api/auth", authRoutes);

// ✅ HEALTH CHECK
app.get("/", (req, res) => {
  res.send("✅ Digital Detox API running");
});

// ✅ ADD USAGE
app.post("/api/usage", auth, async (req, res) => {
  try {
    const { appName, category, minutes, period } = req.body;

    if (!appName || !category || !minutes || !period) {
      return res.status(400).json({ message: "All fields required" });
    }

    const usage = await Usage.create({
      user: req.user.id,
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

// ✅ GET USAGE
app.get("/api/usage", auth, async (req, res) => {
  try {
    const list = await Usage.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ DELETE USAGE
app.delete("/api/usage", auth, async (req, res) => {
  try {
    await Usage.deleteMany({ user: req.user.id });
    res.json({ message: "✅ User history cleared" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ CONNECT DB & START SERVER
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB error:", err.message);
  });
