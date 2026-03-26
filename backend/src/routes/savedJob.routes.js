const express = require("express");
const protect = require("../middlewares/auth.Middleware");

const {
  saveJob,
  unSaveJob,
  getMySavedJobs,
} = require("../controllers/savedJob.controller");

const router = express.Router();

router.post("/:id", protect, saveJob);
router.delete("/:id", protect, unSaveJob);
router.get("/my", protect, getMySavedJobs);

module.exports = router;
