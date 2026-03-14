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

const protect = require("../middlewares/auth.Middleware");

const router = express.Router();

router.post("/create-jobs", protect, createJobs);
router.get("/get-jobs", getJobs);
router.get("/get-jobs-admin", protect, getJobsAdmin);
router.get("/:id", getJobById);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);


router.put("/:id/toggle-close", protect, toggleCloseJob);

module.exports = router;
