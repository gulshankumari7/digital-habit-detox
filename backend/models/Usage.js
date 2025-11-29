const mongoose = require("mongoose");

const usageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // 🔑 important
    },
    appName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    minutes: {
      type: Number,
      required: true,
    },
    period: {
      type: String,
      enum: ["Day", "Night"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Usage", usageSchema);
