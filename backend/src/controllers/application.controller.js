const applicationModal = require("../models/Application.modals");
const jobModal = require("../models/Job.modals");

const applyToJob = async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({
        message: "Only jobseeker can apply ",
      });
    }
    const existing = await applicationModal.findOne({
      job: req.params.jobId,
      application: req.user._id,
    });

    if (existing) {
      return res.status(400).json({
        message: "Already applied to this job",
      });
    }

    const application = await applicationModal.create({
      job: req.params.jobId,
      applicant: req.user._id,
      resume: req.user.resume,
    });
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const apps = (
      await applicationModal
        .find({ applicant: req.user._id })
        .populate("job", "title company location type")
    ).tosort({ createdAt: -1 });

    res.json(apps);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
const getApplicantsForJob = async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
const getApplicationById = async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
const updateStatus = async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  getApplicationById,
  updateStatus,
};
