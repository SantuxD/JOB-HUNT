import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Bookmark,
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  FileText,
  AlertCircle,
} from "lucide-react";
import moment from "moment";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import Card from "../../components/cards/Card";

// Dynamic color mapping for categories
const CATEGORY_COLORS = {
  Engineering: {
    badge: "bg-blue-50 text-blue-750 border-blue-200/50",
  },
  Design: {
    badge: "bg-pink-50 text-pink-755 border-pink-200/40",
  },
  Marketing: {
    badge: "bg-orange-50 text-orange-755 border-orange-200/40",
  },
  Sales: {
    badge: "bg-amber-50 text-amber-755 border-amber-200/40",
  },
  "Customer Support": {
    badge: "bg-cyan-50 text-cyan-755 border-cyan-200/40",
  },
  Finance: {
    badge: "bg-emerald-50 text-emerald-755 border-emerald-250/40",
  },
  "IT & Software": {
    badge: "bg-violet-50 text-violet-755 border-violet-200/40",
  },
  "Human Resources": {
    badge: "bg-teal-50 text-teal-755 border-teal-200/40",
  },
  Operations: {
    badge: "bg-sky-50 text-sky-755 border-sky-200/40",
  },
  "Product Management": {
    badge: "bg-fuchsia-50 text-fuchsia-755 border-fuchsia-200/40",
  },
  Others: {
    badge: "bg-gray-50 text-gray-755 border-gray-200/50",
  },
};

const JOB_TYPE_COLORS = {
  "Full-time": "bg-purple-50 text-purple-750 border-purple-200/40",
  "Part-time": "bg-pink-50 text-pink-755 border-pink-200/40",
  Contract: "bg-amber-50 text-amber-755 border-amber-200/40",
  Internship: "bg-indigo-50 text-indigo-755 border-indigo-200/40",
  Freelance: "bg-teal-50 text-teal-755 border-teal-200/40",
  Remote: "bg-emerald-50 text-emerald-755 border-emerald-250/40",
};

const getCategoryColor = (category) => {
  return CATEGORY_COLORS[category]?.badge || CATEGORY_COLORS.Others.badge;
};

const getTypeColor = (type) => {
  return JOB_TYPE_COLORS[type] || "bg-gray-50 text-gray-700 border-gray-250/40";
};

const getStatusColor = (status) => {
  switch (status) {
    case "Applied":
      return "bg-blue-50 text-blue-700 border border-blue-200";
    case "In-Review":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    case "Accepted":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "Rejected":
      return "bg-rose-50 text-rose-700 border border-rose-200";
    default:
      return "bg-gray-50 text-gray-700 border border-gray-200";
  }
};

const JobDetails = () => {
  const { jobid } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchJobDetails = async () => {
    try {
      setIsLoading(true);
      // Pass the current user's ID as query parameter to retrieve application status
      const response = await axiosInstance.get(
        API_PATHS.JOBS.GET_JOB_BY_ID(jobid),
        {
          params: { userId: user?._id || "" },
        }
      );
      if (response.status === 200) {
        setJob(response.data);
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
      toast.error("Failed to load job details.");
    } finally {
      setIsLoading(false);
    }
  };

  const checkSavedStatus = async () => {
    if (!user) return;
    try {
      const response = await axiosInstance.get(API_PATHS.JOBS.GET_SAVED_JOBS);
      if (response.status === 200) {
        const savedList = response.data.savedJobs || [];
        const found = savedList.some((item) => {
          const id = item.job?._id || item.job;
          return id === jobid;
        });
        setIsSaved(found);
      }
    } catch (error) {
      console.error("Error checking saved status:", error);
    }
  };

  useEffect(() => {
    if (jobid) {
      fetchJobDetails();
      checkSavedStatus();
    }
  }, [jobid, user]);

  const handleApply = async () => {
    if (!user) {
      toast.error("Please login to apply for this job.");
      navigate("/login");
      return;
    }
    if (user.role !== "jobseeker") {
      toast.error("Only job seekers can apply for jobs.");
      return;
    }
    // Check if user has uploaded a resume
    if (!user.resume) {
      toast.error(
        "Please upload a resume in your Profile page before submitting applications."
      );
      navigate("/user-profile");
      return;
    }

    try {
      setIsApplying(true);
      const response = await axiosInstance.post(
        API_PATHS.APPLICATIONS.APPLY_TO_JOB(jobid)
      );
      if (response.status === 201 || response.status === 200) {
        toast.success("Application submitted successfully!");
        setJob((prev) => ({
          ...prev,
          applicationStatus: "Applied",
          appliedAt: response.data.createdAt || new Date(),
        }));
      }
    } catch (error) {
      console.error("Error applying to job:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit your application."
      );
    } finally {
      setIsApplying(false);
    }
  };

  const handleToggleSave = async () => {
    if (!user) {
      toast.error("Please login to save this job.");
      return;
    }
    try {
      setIsSaving(true);
      if (isSaved) {
        const response = await axiosInstance.delete(
          API_PATHS.JOBS.UNSAVE_JOB(jobid)
        );
        if (response.status === 200) {
          setIsSaved(false);
          toast.success("Job removed from saved list.");
        }
      } else {
        const response = await axiosInstance.post(
          API_PATHS.JOBS.SAVE_JOB(jobid)
        );
        if (response.status === 201 || response.status === 200) {
          setIsSaved(true);
          toast.success("Job saved successfully!");
        }
      }
    } catch (error) {
      console.error("Error updating saved status:", error);
      toast.error("Failed to update saved job status.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout activeMenu="find-jobs">
      <div className="max-w-7xl mx-auto space-y-8 pb-24">
        {/* Navigation & Actions Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/find-jobs")}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-150 rounded-xl bg-white hover:bg-gray-50 text-gray-650 hover:text-gray-900 transition-colors shadow-xs cursor-pointer text-sm font-semibold"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to jobs</span>
          </button>

          {job && user?.role === "jobseeker" && (
            <button
              onClick={handleToggleSave}
              disabled={isSaving}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isSaved
                  ? "bg-blue-50 border-blue-200 text-blue-600"
                  : "bg-white border-gray-150 text-gray-400 hover:text-blue-600 hover:border-blue-150"
              }`}
              title={isSaved ? "Saved" : "Save Job"}
            >
              <Bookmark className={`h-5 w-5 ${isSaved ? "fill-blue-600" : ""}`} />
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="py-24">
            <LoadingSpinner />
          </div>
        ) : !job ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-150 rounded-2xl text-center p-6">
            <AlertCircle className="h-12 w-12 text-rose-500 mb-4 animate-bounce" />
            <h3 className="text-lg font-bold text-gray-900">Job Not Found</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-sm">
              We couldn't retrieve the details for this position. It might have
              been deleted or filled.
            </p>
            <button
              onClick={() => navigate("/find-jobs")}
              className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition-all"
            >
              Browse Openings
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: Job Details Banner & Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header card with logo, title, and badges */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-xs relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start space-x-4">
                    {job.company?.companyLogo ? (
                      <img
                        src={job.company.companyLogo}
                        alt={job.company?.companyName || job.company?.name}
                        className="h-16 w-16 rounded-2xl object-cover border border-gray-150 bg-white shadow-xs"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400">
                        <Building2 className="h-8 w-8" />
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <div className="text-xs text-gray-450 font-bold uppercase tracking-wider">
                        {job.company?.companyName || "Organization"}
                      </div>
                      <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                        {job.title}
                      </h1>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <span
                          className={`inline-flex items-center text-xs font-bold px-3 py-1 border rounded-md ${getCategoryColor(
                            job.category
                          )}`}
                        >
                          {job.category}
                        </span>
                        <span
                          className={`inline-flex items-center text-xs font-bold px-3 py-1 border rounded-md ${getTypeColor(
                            job.type
                          )}`}
                        >
                          {job.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Apply Actions */}
                  <div className="shrink-0">
                    {job.isClosed ? (
                      <span className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-500 font-semibold rounded-xl text-sm border border-gray-200">
                        Position Closed
                      </span>
                    ) : job.applicationStatus ? (
                      <div className="flex flex-col items-end gap-1.5">
                        <span
                          className={`inline-flex items-center font-bold px-5 py-3 rounded-xl text-sm border ${getStatusColor(
                            job.applicationStatus
                          )}`}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1.5" />
                          {job.applicationStatus === "Applied"
                            ? "Applied"
                            : job.applicationStatus}
                        </span>
                        <p className="text-[10px] text-gray-400 italic">
                          Applied {moment(job.appliedAt || job.createdAt).fromNow()}
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={handleApply}
                        disabled={isApplying}
                        className="w-full md:w-auto px-8 py-3 bg-linear-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isApplying ? "Submitting..." : "Apply Now"}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* About the Role Section */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 space-y-4 shadow-xs">
                <h3 className="text-base font-bold text-gray-900 flex items-center border-b border-gray-50 pb-2.5">
                  <Briefcase className="h-5 w-5 mr-2.5 text-blue-600" />
                  About the Role
                </h3>
                <div className="text-sm text-gray-650 leading-relaxed whitespace-pre-line">
                  {job.description}
                </div>
              </div>

              {/* Requirements & Qualifications Section */}
              {job.requirements && (
                <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 space-y-4 shadow-xs">
                  <h3 className="text-base font-bold text-gray-900 flex items-center border-b border-gray-50 pb-2.5">
                    <ShieldCheck className="h-5 w-5 mr-2.5 text-emerald-600" />
                    Requirements & Qualifications
                  </h3>
                  <ul className="grid grid-cols-1 gap-3 text-sm text-gray-650">
                    {job.requirements.split("\n").map((reqLine, idx) => {
                      const cleanLine = reqLine.replace(/^[-\*\u2022]\s*/, "");
                      if (!cleanLine.trim()) return null;
                      return (
                        <li key={idx} className="flex items-start">
                          <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full mt-2 mr-3 shrink-0" />
                          <span>{cleanLine}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column: Meta Info Card */}
            <div className="space-y-6">
              <Card title="Job Information">
                <div className="space-y-5 pt-3">
                  {/* Compensation */}
                  <div className="flex items-start space-x-3.5">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl mt-0.5">
                      <DollarSign className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                        Offered Salary
                      </span>
                      <span className="text-base font-bold text-emerald-600">
                        {job.salaryMin ? `$${job.salaryMin.toLocaleString()}` : "$0"}{" "}
                        -{" "}
                        {job.salaryMax ? `$${job.salaryMax.toLocaleString()}` : "$Any"}
                      </span>
                      <span className="text-[10px] text-gray-400 block mt-0.5">
                        Per Year
                      </span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start space-x-3.5 border-t border-gray-50 pt-4">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl mt-0.5">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                        Work Location
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {job.type === "Remote" && job.location
                          ? `Remote / ${job.location}`
                          : job.location || "Remote"}
                      </span>
                    </div>
                  </div>

                  {/* Job Type */}
                  <div className="flex items-start space-x-3.5 border-t border-gray-50 pt-4">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-xl mt-0.5">
                      <Briefcase className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                        Employment Type
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {job.type}
                      </span>
                    </div>
                  </div>

                  {/* Posted Date */}
                  <div className="flex items-start space-x-3.5 border-t border-gray-50 pt-4">
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-xl mt-0.5">
                      <Calendar className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                        Posted Date
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {moment(job.createdAt).format("Do MMMM YYYY")}
                      </span>
                      <span className="text-[10px] text-gray-400 block mt-0.5">
                        {moment(job.createdAt).fromNow()}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Company Info Card */}
              <Card title="About Company">
                <div className="space-y-4 pt-3 text-center md:text-left">
                  <div className="flex flex-col items-center space-y-3">
                    {job.company?.companyLogo ? (
                      <img
                        src={job.company.companyLogo}
                        alt={job.company?.companyName || job.company?.name}
                        className="h-16 w-16 rounded-2xl object-cover border border-gray-150 bg-white"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-450">
                        <Building2 className="h-7 w-7" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-gray-900 text-base">
                        {job.company?.companyName || "Organization"}
                      </h4>
                      <p className="text-xs text-gray-450 italic mt-0.5">
                        Verified Employer
                      </p>
                    </div>
                  </div>

                  {job.company?.companyDescription ? (
                    <p className="text-xs text-gray-600 leading-relaxed border-t border-gray-50 pt-3 text-left">
                      {job.company.companyDescription}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400 leading-relaxed border-t border-gray-50 pt-3 text-left italic">
                      No description provided by the employer.
                    </p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default JobDetails;