const savedJobModal = require("../models/SavedJob.modals");
const mongoose = require("mongoose");

const saveJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const jobObjectId = new mongoose.Types.ObjectId(jobId);

    if (!jobId) {
      return res.status(400).json({ message: "jobId is required" });
    }

    const exist = await savedJobModal.findOne({
      job: jobObjectId,
      jobseeker: req.user._id,
    });
    if (exist) return res.status(400).json({ message: "job already saved" });

    const saved = await savedJobModal.create({
      job: jobObjectId,
      jobseeker: req.user._id,
    });
    res.status(201).json({
      message: "Job saved successfully",
      saved,
    });
  } catch (err) {
    res.status(500).json({
      message: "Err while save job" + err.message,
    });
  }
};

const unSaveJob = async (req, res) => {
  try {
    await savedJobModal.findOneAndDelete({
      job: req.params.jobId,
      jobseeker: req.user._id,
    });
    res.status(200).json({
      message: "job remove from savedList",
    });
  } catch (err) {
    res.status(500).json({
      message: "err while unsave job" + err.message,
    });
  }
};

const getMySavedJobs = async (req, res) => {
  try {
    const savedJobs = await savedJobModal.find({
      jobseeker: req.user._id,
    }).populate({
      path: "job",
      populate: {
        path: "company",
        select: "name companyName companyLogo",
      },
    });
    res.json({ savedJobs });
  } catch (err) {
    res.status(500).json({
      message: "err while getting my jobs" + err.message,
    });
  }
};

module.exports = { saveJob, unSaveJob, getMySavedJobs };
