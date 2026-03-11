const express = require("express");
const {
  createJobs,
  getJobById,
  getJobs,
  updateJob,
  deleteJob,
  toggleCloseJob,
  getJobsAdmin,
} = require("../controllers/job.controller");

const { protect } = require("../middlewares/auth.Middleware");

const router = express.Router();

router.post("/create-jobs", protect, createJobs);
router.get("/get-jobs", getJobs);
router.put("/update-jobs", protect, updateJob);
router.delete("/delete-jobs", protect, deleteJob);
router.get("/id", getJobById);
router.get("get-jobs-admin", protect, getJobsAdmin);
router.put("/:id/toggle-close", protect, toggleCloseJob);

module.exports = router;
