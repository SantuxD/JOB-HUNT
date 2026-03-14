const jobModal = require("../models/Job.modals");
const userModal = require("../models/User.modals");
const ApplicationModal = require("../models/Application.modals");
const savedJobModal = require("../models/SavedJob.modals");
const jwt = require("jsonwebtoken");
const ApplicationModals = require("../models/Application.modals");
const JobModals = require("../models/Job.modals");

const createJobs = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "only admin can post the job" + err.message,
      });
    }

    const job = await jobModal.create({ ...req.body, company: req.user._id });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({
      message: "Error for create job" + err.message,
    });
  }
};

const getJobs = async (req, res) => {
  const { keyword, location, category, type, minSalary, maxSalary, userId } =
    req.query;

  const query = {
    isClosed: false,
    ...(keyword && { title: { $regex: keyword, $options: "i" } }),
    ...(location && { location: { $regex: location, $options: "i" } }),
    ...(category && { category }),
    ...(type && { type }),
  };
  if (minSalary || maxSalary) {
    query.$and = [];

    if (minSalary) {
      query.$and.push({ salaryMax: { $gte: Number(minSalary) } });
    }

    if (maxSalary) {
      query.$and.push({ salaryMin: { $lte: Number(maxSalary) } });
    }
    if (query.$and.length === 0) {
      delete query.$and;
    }
  }

  try {
    const jobs = await jobModal
      .find(query)
      .populate("company", "name companyName, companyLogo");
    let savedJobIds = [];
    let appliedJobStatusMap = {};

    if (userId) {
      const savedJobs = await savedJobModal
        .find({ jobseeker: userId })
        .select("job");
      savedJobIds = savedJobs.map((s) => String(s.job));

      const applications = await ApplicationModal.find({
        applicant: userId,
      }).select("job status");
      applications.forEach((app) => {
        appliedJobStatusMap[String(app.job)] = app.status;
      });
    }

    const jobWithExtras = jobs.map((job) => {
      const jobIdstr = String(job._id);
      return {
        ...job.toObject(),
        isSaved: savedJobIds.includes(jobIdstr),
        applicationStatus: appliedJobStatusMap[jobIdstr] || null,
      };
    });

    res.json(jobWithExtras);
  } catch (err) {
    res.status(500).json({
      message: "Error for getting job" + err.message,
    });
  }
};

const getJobsAdmin = async (req, res) => {
  try {
    const userId = req.user._id;
    const { role } = req.user;

    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!role == "admin") {
      return res.status(403).json({
        message: "Acess denied",
      });
    }

    const jobs = await jobModal
      .find({ company: userId })
      .populate("company", "name companyName companyLogo")
      .lean();
    const jobWithApplicationsCount = await Promise.all(
      jobs.map(async (job) => {
        const applicationCount = await ApplicationModal.countDocuments({
          job: job._id,
        });
        return {
          ...job,
          applicationCount,
        };
      }),
    );
    res.json(jobWithApplicationsCount);
  } catch (err) {
    res.status(500).json({
      message: "Error for getting admin job" + err.message,
    });
  }
};

const getJobById = async (req, res) => {
  try {
    const { userId } = req.query;
    const job = await jobModal
      .findById(req.params.id)
      .populate("company", "name companyName companyLogo");
    if (!job) {
      return res.status(404).json({
        message: "job not found",
      });
    }

    let applicationStatus = null;
    if (userId) {
      const application = await ApplicationModal.findOne({
        job: job._id,
        applicant: userId,
      }).select("status");
      if (application) {
        applicationStatus = application.status;
      }
    }
    res.json({
      ...job.toObject(),
      applicationStatus,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error for getting jobs with ID" + err.message,
    });
  }
};
const updateJob = async (req, res) => {
  try {
    const job = await JobModals.findById(req.params.id);
    if (!job)
      return res.status(404).json({
        message: "job not found",
      });
    if (job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to update this job",
      });
    }
    Object.assign(job, req.body);
    const updated = await job.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({
      message: "Error for updating jobs" + err.message,
    });
  }
};
const deleteJob = async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({
      message: "Error for delete jobs" + err.message,
    });
  }
};
const toggleCloseJob = async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({
      message: "Error for closejobs" + err.message,
    });
  }
};

module.exports = {
  createJobs,
  getJobById,
  getJobs,
  updateJob,
  deleteJob,
  toggleCloseJob,
  getJobsAdmin,
};
