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
    const apps = await applicationModal
      .find({ applicant: req.user._id })
      .populate("job", "title company location type")
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
const getApplicantsForJob = async (req, res) => {
  try {
    const job = await jobModal.findById(req.params.jobId);
    if (!job || job.company.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to view applicants" });
    }

    const application = await applicationModal
      .find({ job: req.params.jobId })
      .populate("job", "title location category type")
      .populate("applicant", "name email avatar resume");
    res.json(application);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
const getApplicationById = async (req, res) => {
  try {
    const app = await applicationModal
      .findById(req.params.id)
      .populate("job", "title company")
      .populate("applicant", "name email avatar resume");
    if (!app)
      return res.status(404).json({
        message: "Appliaction is not found",
        id: req.params.id,
      });

    const isOwner =
      app.applicant._id.toString() === req.user._id.toString() ||
      app.job.company.toString() === req.user._id.toString();

    if (!isOwner) {
      return res.status(403).json({
        message: "not authorized to view this application",
      });
    }
    res.json(app);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
const updateStatus = async (req, res) => {
  //   try {
  //     const { status } = req.body;
  //     const app = await applicationModal.findById(req.params.id).populate("job");
  //     if (!app || app.job.company.toString() !== req.user._id.toString()) {
  //       return res
  //         .status(403)
  //         .json({ message: "Not authorized to update this application" });
  //     }
  //     app.status = status;
  //     await app.save();
  //     res.json({ message: "Application status updated", status });
  //   } catch (err) {
  //     res.status(500).json({
  //       message: err.message,
  //     });
  //   }

  try {
    const { status } = req.body;

    const allowedStatus = ["Applied", "Rejected", "Accepted", "In-Review"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    const app = await applicationModal.findById(req.params.id).populate("job");

    if (!app) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (!app.job || app.job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to update this application",
      });
    }

    app.status = status;
    await app.save();

    res.json({ message: "Application status updated", status });
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
