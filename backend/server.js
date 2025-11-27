const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Usage = require("./models/Usage");

const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(cors({ origin: "http://localhost:5173" })); // React dev URL
app.use(express.json());

// simple health check
app.get("/", (req, res) => {
  res.send("Digital Detox API running");
});

// POST /api/usage  -> save one usage entry
app.post("/api/usage", async (req, res) => {
  try {
    const { appName, category, minutes, period } = req.body;

    if (!appName || !minutes) {
      return res.status(400).json({ message: "App name & minutes required" });
    }

    const usage = await Usage.create({
      appName,
      category,
      minutes,
      period,
    });

    res.status(201).json(usage);
  } catch (err) {
    console.error("Error saving usage:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/usage  -> get all usage (later: by user / date)
app.get("/api/usage", async (req, res) => {
  try {
    const list = await Usage.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error("Error fetching usage:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// connect DB & start server
async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("DB connection failed:", err);
    process.exit(1);
  }
}

start();
