const jobModal = require("../models/Job.modals");
const applicationModal = require("../models/Application.modals");


const getTrend = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

const getEmployerAnalytics = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const companyId = req.user._id;

    const now = new Date();
    const last7days = new Date(now);
    last7days.setDate(now.getDate() - 7);
    const prev7Days = new Date(now);
    prev7Days.setDate(now.getDate() - 14);

    const totalActiveJobs = await jobModal.countDocuments({
      company: companyId,
      isClosed: false,
    });
    const jobs = await jobModal
      .find({ company: companyId })
      .select("_id")
      .lean();
    const jobIds = jobs.map((job) => job._id);

    const totalApplications = await applicationModal.countDocuments({
      job: { $in: jobIds },
    });
    const totalHired = await applicationModal.countDocuments({
      job: { $in: jobIds },

      status: "Accepted",
    });

    const activeJobsLast7 = await jobModal.countDocuments({
      company: companyId,
      createdAt: { $gte: prev7Days, $lt: now },
    });

    const activeJobsPrev7 = await jobModal.countDocuments({
      company: companyId,
      createdAt: { $gte: prev7Days, $lt: last7days },
    });

    const activeJobTrend = getTrend(activeJobsLast7, activeJobsPrev7);

    const applicationsLast7 = await applicationModal.countDocuments({
      job: { $in: jobIds },
      createdAt: { $gte: last7days, $lte: now },
    });

    const applicationsPrev7 = await applicationModal.countDocuments({
      job: { $in: jobIds },
      createdAt: { $gte: prev7Days, $lt: last7days },
    });

    const applicantTrend = getTrend(applicationsLast7, applicationsPrev7);

    const hiredLast7 = await applicationModal.countDocuments({
      job: { $in: jobIds },
      status: "Accepetd",
      createdAt: { $gte: last7days, $lte: now },
    });

    const hiredPrev7 = await applicationModal.countDocuments({
      job: { $in: jobIds },
      status: "Accepted",
      createdAt: { $gte: prev7Days, $lt: last7days },
    });

    const hiredTrend = getTrend(hiredLast7, hiredPrev7);

    const recentJobs = await jobModal
      .find({ company: companyId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title location type createdAt isClosed");

    const recentApplications = await applicationModal
      .find({
        job: { $in: jobIds },
      })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("applicant", "name email avatar")
      .populate("job", "title");

    res.json({
      counts: {
        totalActiveJobs,
        totalApplications,
        totalHired,
        trends: {
          activeJobs: activeJobTrend,
          totalApplicants: applicantTrend,
          totalHired: hiredTrend,
        },
      },

      data: {
        recentJobs,
        recentApplications,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "err fetch getEmployerAnalytics",
      err: err.message,
    });
  }
};

module.exports = { getEmployerAnalytics };
