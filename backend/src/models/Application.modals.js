const mongoose = require("mongoose");
const app = require("../app");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, 
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    status: {
      type: String,
      enum: ["Applied", "Rejected", "Accepted", "In-Review"],
      default: "Applied",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Application", applicationSchema);
