import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  DollarSign,
  BookmarkCheck,
  Building2,
  Calendar,
  Clock,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/LoadingSpinner";

// Dynamic color mapping for categories
const CATEGORY_COLORS = {
  Engineering: {
    badge: "bg-blue-50 text-blue-755 border-blue-200/50",
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

const SavedJobs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [savedJobs, setSavedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSavedJobs = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(API_PATHS.JOBS.GET_SAVED_JOBS);
      if (response.status === 200) {
        // Filter out null or missing job documents in case a job was deleted
        const jobs = (response.data.savedJobs || []).filter(
          (item) => item && item.job
        );
        setSavedJobs(jobs);
      }
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
      toast.error("Failed to load saved jobs.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsave = async (e, jobId) => {
    e.stopPropagation(); // Stop navigation to job details
    try {
      const response = await axiosInstance.delete(
        API_PATHS.JOBS.UNSAVE_JOB(jobId)
      );
      if (response.status === 200) {
        setSavedJobs((prev) => prev.filter((item) => item.job._id !== jobId));
        toast.success("Job removed from saved list.");
      }
    } catch (error) {
      console.error("Error unsaving job:", error);
      toast.error("Failed to remove job.");
    }
  };

  useEffect(() => {
    if (user) {
      fetchSavedJobs();
    }
  }, [user]);

  return (
    <DashboardLayout activeMenu="saved-jobs">
      <div className="max-w-7xl mx-auto space-y-8 pb-24">
        {/* Back Button */}
        <div>
          <button
            onClick={() => navigate("/find-jobs")}
            className="group flex items-center space-x-2 px-4 py-2 border border-gray-150 hover:border-blue-200 rounded-xl bg-white hover:bg-blue-50/50 text-gray-650 hover:text-blue-600 transition-all duration-200 shadow-xs cursor-pointer text-sm font-semibold mb-2 w-fit transform hover:-translate-x-0.5"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span>Back to jobs</span>
          </button>
        </div>

        {/* Header Section */}
        <div>
          <h2 className="text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            My Bookmarked Jobs
          </h2>
          <p className="text-sm text-gray-550 mt-1">
            Browse and apply to the positions you've saved.
          </p>
        </div>

        {isLoading ? (
          <div className="py-24">
            <LoadingSpinner />
          </div>
        ) : savedJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-100 rounded-2xl text-center p-6 shadow-xs">
            <div className="h-16 w-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mb-4 text-gray-400">
              <Clock className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              No Bookmarked Jobs Yet
            </h3>
            <p className="text-sm text-gray-550 max-w-sm mt-1">
              Find opportunities that catch your eye on the job search page and
              save them for later.
            </p>
            <button
              onClick={() => navigate("/find-jobs")}
              className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md"
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {savedJobs.map((item) => {
              const { job } = item;
              const company = job.company || {};
              return (
                <div
                  key={item._id}
                  onClick={() => navigate(`/job/${job._id}`)}
                  className="relative overflow-hidden bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col justify-between min-h-[240px]"
                >
                  <div>
                    {/* Header: Company Details & Unsave action */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center space-x-3">
                        {company.companyLogo ? (
                          <img
                            src={company.companyLogo}
                            alt={company.companyName || company.name}
                            className="h-11 w-11 rounded-xl object-cover border border-gray-150 bg-white"
                          />
                        ) : (
                          <div className="h-11 w-11 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400">
                            <Building2 className="h-5 w-5" />
                          </div>
                        )}
                        <div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            {company.companyName || "Organization"}
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            <span
                              className={`inline-flex items-center text-[9px] font-bold px-2 py-0.5 border rounded-md ${getCategoryColor(
                                job.category
                              )}`}
                            >
                              {job.category}
                            </span>
                            <span
                              className={`inline-flex items-center text-[9px] font-bold px-2 py-0.5 border rounded-md ${getTypeColor(
                                job.type
                              )}`}
                            >
                              {job.type}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bookmark button (to remove) */}
                      <button
                        onClick={(e) => handleUnsave(e, job._id)}
                        className="p-2 text-blue-600 bg-blue-50/50 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all cursor-pointer"
                        title="Remove Bookmark"
                      >
                        <BookmarkCheck className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Job Title & Snippet */}
                    <div className="mt-2.5 space-y-1">
                      <h4 className="font-bold text-gray-900 group-hover:text-blue-600 text-base leading-tight transition-colors flex items-center">
                        {job.title}
                        {job.isClosed && (
                          <span className="ml-2 text-[9px] font-extrabold px-1.5 py-0.2 bg-rose-50 text-rose-600 border border-rose-100 rounded-md">
                            Closed
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1.5">
                        {job.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer details */}
                  <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-550">
                    <div className="space-y-1">
                      <div className="font-bold text-emerald-600 flex items-center">
                        <DollarSign className="h-3.5 w-3.5 text-emerald-500 mr-0.5" />
                        {job.salaryMin
                          ? `${job.salaryMin.toLocaleString()}`
                          : "0"}{" "}
                        -{" "}
                        {job.salaryMax
                          ? `${job.salaryMax.toLocaleString()}`
                          : "Any"}
                      </div>
                      <div className="flex items-center text-[10px] text-gray-400">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400 shrink-0" />
                        <span className="truncate max-w-[120px]">
                          {job.location || "Remote"}
                        </span>
                      </div>
                    </div>

                    {/* View Posting CTA */}
                    <div className="flex items-center space-x-1 text-blue-600 font-bold text-[11px] group-hover:translate-x-1 transition-transform">
                      <span>View details</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SavedJobs;