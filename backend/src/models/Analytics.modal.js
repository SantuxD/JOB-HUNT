const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    totalJobsPosted: {
      type: Number,
      default: 0,
    },
    totalApplicationReceived: {
      type: Number,
      default: 0,
    },
    totalHired: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Analytics", analyticsSchema);
