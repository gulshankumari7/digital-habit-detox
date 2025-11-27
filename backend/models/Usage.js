const mongoose = require("mongoose");

const usageSchema = new mongoose.Schema(
  {
    appName: { type: String, required: true },
    category: { type: String, required: true },
    minutes: { type: Number, required: true },
    period: { type: String, enum: ["Day", "Night"], required: true },
    // abhi userId nahi, baad me auth add karenge
  },
  { timestamps: true }
);

module.exports = mongoose.model("Usage", usageSchema);
