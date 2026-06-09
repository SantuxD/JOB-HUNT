import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FileText,
  Mail,
  User,
  Clock,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  Briefcase,
  MapPin,
  Filter,
  X,
  Calendar,
  Download,
} from "lucide-react";
import moment from "moment";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import Card from "../../components/cards/Card";


const CATEGORY_COLORS = {
  Engineering: {
    border: "border-blue-150",
    bg: "bg-blue-50/40",
    text: "text-blue-700",
    badge: "bg-blue-50 text-blue-750 border-blue-200/50",
    accent: "from-blue-500 to-indigo-650",
    dot: "bg-blue-500",
    textHover: "group-hover:text-blue-600",
  },
  Design: {
    border: "border-pink-150",
    bg: "bg-pink-50/40",
    text: "text-pink-700",
    badge: "bg-pink-50 text-pink-750 border-pink-200/50",
    accent: "from-pink-500 to-rose-650",
    dot: "bg-pink-500",
    textHover: "group-hover:text-pink-600",
  },
  Marketing: {
    border: "border-orange-150",
    bg: "bg-orange-50/40",
    text: "text-orange-700",
    badge: "bg-orange-50 text-orange-750 border-orange-200/50",
    accent: "from-orange-500 to-amber-650",
    dot: "bg-orange-500",
    textHover: "group-hover:text-orange-600",
  },
  Sales: {
    border: "border-amber-150",
    bg: "bg-amber-50/40",
    text: "text-amber-700",
    badge: "bg-amber-50 text-amber-750 border-amber-200/50",
    accent: "from-amber-500 to-yellow-600",
    dot: "bg-amber-500",
    textHover: "group-hover:text-amber-600",
  },
  "Customer Support": {
    border: "border-cyan-150",
    bg: "bg-cyan-50/40",
    text: "text-cyan-700",
    badge: "bg-cyan-50 text-cyan-750 border-cyan-200/50",
    accent: "from-cyan-500 to-blue-650",
    dot: "bg-cyan-500",
    textHover: "group-hover:text-cyan-600",
  },
  Finance: {
    border: "border-emerald-150",
    bg: "bg-emerald-50/40",
    text: "text-emerald-700",
    badge: "bg-emerald-50 text-emerald-750 border-emerald-200/50",
    accent: "from-emerald-500 to-teal-650",
    dot: "bg-emerald-500",
    textHover: "group-hover:text-emerald-600",
  },
  "IT & Software": {
    border: "border-violet-150",
    bg: "bg-violet-50/40",
    text: "text-violet-700",
    badge: "bg-violet-50 text-violet-750 border-violet-200/50",
    accent: "from-violet-500 to-purple-650",
    dot: "bg-violet-500",
    textHover: "group-hover:text-violet-600",
  },
  "Human Resources": {
    border: "border-teal-150",
    bg: "bg-teal-50/40",
    text: "text-teal-700",
    badge: "bg-teal-50 text-teal-750 border-teal-200/50",
    accent: "from-teal-500 to-emerald-650",
    dot: "bg-teal-500",
    textHover: "group-hover:text-teal-600",
  },
  Operations: {
    border: "border-sky-150",
    bg: "bg-sky-50/40",
    text: "text-sky-700",
    badge: "bg-sky-50 text-sky-750 border-sky-200/50",
    accent: "from-sky-500 to-indigo-600",
    dot: "bg-sky-500",
    textHover: "group-hover:text-sky-600",
  },
  "Product Management": {
    border: "border-fuchsia-150",
    bg: "bg-fuchsia-50/40",
    text: "text-fuchsia-700",
    badge: "bg-fuchsia-50 text-fuchsia-750 border-fuchsia-200/50",
    accent: "from-fuchsia-500 to-purple-650",
    dot: "bg-fuchsia-500",
    textHover: "group-hover:text-fuchsia-600",
  },
  Others: {
    border: "border-gray-200",
    bg: "bg-gray-50/45",
    text: "text-gray-700",
    badge: "bg-gray-50 text-gray-750 border-gray-200/50",
    accent: "from-gray-500 to-gray-650",
    dot: "bg-gray-500",
    textHover: "group-hover:text-gray-600",
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

const getTypeColor = (type) => {
  return (
    JOB_TYPE_COLORS[type] ||
    "bg-gray-50 text-gray-700 border-gray-250/40"
  );
};

const ApplicationViewer = () => {
  const location = useLocation();
  const navigate = useNavigate();

 
  const initialJobId = location.state?.jobid || null;
  const initialJobTitle = location.state?.jobTitle || "";

  const [adminJobs, setAdminJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const [applications, setApplications] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

 
  const fetchAdminJobs = async () => {
    try {
      setIsLoadingJobs(true);
      const response = await axiosInstance.get(API_PATHS.JOBS.GET_JOBS_ADMIN);
      if (response.status === 200) {
        setAdminJobs(response.data);
        if (!initialJobId && response.data.length > 0) {
          setSelectedJobId(response.data[0]._id);
        }
      }
    } catch (error) {
      console.error("Error fetching admin jobs:", error);
      toast.error("Failed to load jobs list.");
    } finally {
      setIsLoadingJobs(false);
    }
  };
  const fetchApplications = async (jobId) => {
    if (!jobId) return;
    try {
      setIsLoadingApps(true);
      const response = await axiosInstance.get(
        API_PATHS.APPLICATIONS.GET_ALL_APPLICATIONS(jobId),
      );
      if (response.status === 200) {
        setApplications(response.data);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications.");
    } finally {
      setIsLoadingApps(false);
    }
  };

  useEffect(() => {
    fetchAdminJobs();
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      fetchApplications(selectedJobId);
      setSelectedCandidate(null); 
    } else {
      setApplications([]);
      setSelectedCandidate(null);
    }
  }, [selectedJobId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.getElementById("job-selector-dropdown");
      if (dropdown && !dropdown.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const response = await axiosInstance.put(
        API_PATHS.APPLICATIONS.UPDATE_STATUS(appId),
        { status: newStatus },
      );
      if (response.status === 200) {
        setApplications((prevApps) =>
          prevApps.map((app) =>
            app._id === appId ? { ...app, status: newStatus } : app,
          ),
        );
        toast.success(`Application status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      toast.error(error.response?.data?.message || "Failed to update status.");
    }
  };
  const getResumeUrl = (resumePath) => {
    if (!resumePath) return null;
    if (resumePath.startsWith("http://") || resumePath.startsWith("https://")) {
      return resumePath;
    }
    return `https://job-hunt-1bmu.onrender.com/uploads/${resumePath}`;
  };
  const selectedJob = adminJobs.find((job) => job._id === selectedJobId);
  const totalCount = applications.length;
  const appliedCount = applications.filter((app) => app.status === "Applied").length;
  const reviewCount = applications.filter((app) => app.status === "In-Review").length;
  const acceptedCount = applications.filter((app) => app.status === "Accepted").length;
  const rejectedCount = applications.filter((app) => app.status === "Rejected").length;

  const filteredApps = applications.filter((app) => {
    if (statusFilter === "all") return true;
    return app.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Applied":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "In-Review":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Accepted":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Rejected":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };
  const colors = selectedJob
    ? CATEGORY_COLORS[selectedJob.category] || CATEGORY_COLORS.Others
    : CATEGORY_COLORS.Others;

  return (
    <DashboardLayout activeMenu="manage-jobs">
      <div className="max-w-7xl mx-auto space-y-8 pb-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate("/manage-jobs")}
              className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors shadow-xs"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Application Overview
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Review applicant profiles, download resumes, and manage hiring statuses.
              </p>
            </div>
          </div>
          <div className="w-full sm:w-80 relative select-none" id="job-selector-dropdown">
            <button
              disabled={isLoadingJobs || adminJobs.length === 0}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white font-semibold text-gray-700 transition-all flex items-center justify-between shadow-xs hover:border-gray-300 cursor-pointer disabled:opacity-50"
            >
              {isLoadingJobs ? (
                <span className="text-gray-400">Loading positions...</span>
              ) : adminJobs.length === 0 ? (
                <span className="text-gray-400">No job openings</span>
              ) : selectedJob ? (
                <div className="flex items-center space-x-2 text-left truncate">
                  <span className="truncate">{selectedJob.title}</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-md border font-bold shrink-0 ${getTypeColor(selectedJob.type)}`}>
                    {selectedJob.type}
                  </span>
                </div>
              ) : (
                <span>Select a Position</span>
              )}
              <svg
                className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && !isLoadingJobs && adminJobs.length > 0 && (
              <div className="absolute right-0 top-full mt-2 w-full sm:w-96 bg-white border border-gray-150 rounded-2xl shadow-xl z-50 py-2 max-h-80 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 mb-1">
                  Select Position
                </div>
                {adminJobs.map((job) => {
                  const jobColors = CATEGORY_COLORS[job.category] || CATEGORY_COLORS.Others;
                  const isCurrent = job._id === selectedJobId;
                  return (
                    <button
                      key={job._id}
                      onClick={() => {
                        setSelectedJobId(job._id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex flex-col gap-1 border-l-2 ${
                        isCurrent ? "bg-blue-50/30 border-blue-500 font-medium" : "border-transparent"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-gray-900 text-sm truncate">{job.title}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-md border font-bold shrink-0 ${getTypeColor(job.type)}`}>
                          {job.type}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-gray-500">
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-0.5 text-gray-400" />
                          {job.location || "Remote"}
                        </span>
                        <span className={`px-1.5 py-0.2 border rounded-md font-medium text-[9px] ${jobColors.badge}`}>
                          {job.category}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        {selectedJob && (
          <div
            className="border border-gray-150 bg-white rounded-2xl p-6 shadow-xs flex flex-col md:flex-row justify-between gap-6 items-start md:items-center transition-all duration-300"
          >
            <div className="space-y-2">
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full border ${getTypeColor(selectedJob.type)}`}
              >
                {selectedJob.type}
              </span>
              <div className="flex items-center space-x-3 mt-2">
                <div
                  className="w-1.5 h-8 rounded-full bg-linear-to-b from-blue-500 to-indigo-600"
                ></div>
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedJob.title}
                </h3>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                <span className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-1 text-gray-455" />
                  {selectedJob.category}
                </span>
                <span className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-gray-455" />
                  {selectedJob.location || "Remote"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              {[
                { label: "Total", value: totalCount, bg: "bg-white text-gray-700" },
                { label: "Applied", value: appliedCount, bg: "bg-blue-50 text-blue-700 border-blue-100" },
                { label: "In-Review", value: reviewCount, bg: "bg-amber-50 text-amber-700 border-amber-100" },
                { label: "Accepted", value: acceptedCount, bg: "bg-emerald-50 text-emerald-700 border-emerald-100" },
                { label: "Rejected", value: rejectedCount, bg: "bg-rose-50 text-rose-700 border-rose-100" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`px-3.5 py-2 rounded-xl text-center border ${stat.bg}`}
                >
                  <div className="text-lg font-extrabold leading-none">{stat.value}</div>
                  <div className="text-[10px] font-medium opacity-80 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Card>
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
            <h4 className="font-bold text-gray-900 text-base">Candidate Applications</h4>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-200 rounded-xl text-xs py-1.5 px-3 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-gray-655"
              >
                <option value="all">All Applications</option>
                <option value="applied">Applied</option>
                <option value="in-review">In-Review</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {isLoadingApps ? (
            <div className="py-12">
              <LoadingSpinner />
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-16 w-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <User className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No Candidates Found</h3>
              <p className="text-sm text-gray-500 max-w-sm mt-1">
                {statusFilter !== "all"
                  ? `There are no candidate profiles marked as '${statusFilter}' for this job.`
                  : "No jobseeker has applied for this opening yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Candidate Profile</th>
                    <th className="px-6 py-4">Applied On</th>
                    <th className="px-6 py-4">Resume Actions</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredApps.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50/30 transition-colors">
                    
                      <td className="px-6 py-4">
                        <div
                          className="flex items-center space-x-3.5 cursor-pointer group"
                          onClick={() => setSelectedCandidate(app)}
                          title="Click to view candidate profile"
                        >
                          {app.applicant?.avatar ? (
                            <img
                              src={app.applicant.avatar}
                              alt={app.applicant.fullName}
                              className="h-10 w-10 rounded-full object-cover border border-gray-200 transition-transform group-hover:scale-105"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm transition-colors group-hover:bg-blue-100">
                              {app.applicant?.fullName?.charAt(0).toUpperCase() || "?"}
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                              {app.applicant?.fullName || "Anonymous User"}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center mt-0.5">
                              <Mail className="h-3.5 w-3.5 mr-1 text-gray-400" />
                              {app.applicant?.email}
                            </div>
                          </div>
                        </div>
                      </td>

                     
                      <td className="px-6 py-4 text-xs text-gray-650">
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                          {moment(app.createdAt).format("MMM DD, YYYY")}
                        </div>
                        <div className="text-[10px] text-gray-450 mt-0.5 ml-5">
                          {moment(app.createdAt).fromNow()}
                        </div>
                      </td>

                     
                      <td className="px-6 py-4">
                        {app.applicant?.resume ? (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedCandidate(app)}
                              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 rounded-lg text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                              title="View resume details and inline preview"
                            >
                              <FileText className="h-3.5 w-3.5 text-red-500" />
                              <span>View</span>
                            </button>
                            <a
                              href={getResumeUrl(app.applicant.resume)}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center p-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-700 rounded-lg transition-all shadow-2xs cursor-pointer"
                              title="Download Resume"
                            >
                              <Download className="h-3.5 w-3.5 text-blue-600" />
                            </a>
                          </div>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-xs text-gray-450 italic">
                            <AlertCircle className="h-3.5 w-3.5 text-gray-400" />
                            <span>No Resume</span>
                          </span>
                        )}
                      </td>

                    
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center text-xs font-bold px-3 py-1 rounded-full border ${getStatusColor(
                            app.status,
                          )}`}
                        >
                          {app.status}
                        </span>
                      </td>

  
                      <td className="px-6 py-4 text-right">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          className="border border-gray-255 rounded-xl text-xs py-1.5 px-3 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white font-medium text-gray-700 w-36"
                        >
                          <option value="Applied">Applied</option>
                          <option value="In-Review">In-Review</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity duration-200">
          <div className="bg-white rounded-2xl max-w-5xl w-full h-[85vh] flex flex-col shadow-2xl border border-gray-100 transform scale-100 transition-all animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
      
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center space-x-4">
                {selectedCandidate.applicant?.avatar ? (
                  <img
                    src={selectedCandidate.applicant.avatar}
                    alt={selectedCandidate.applicant.fullName}
                    className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-md"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-extrabold text-lg shadow-xs">
                    {selectedCandidate.applicant?.fullName?.charAt(0).toUpperCase() || "?"}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {selectedCandidate.applicant?.fullName || "Candidate Profile"}
                  </h3>
                  <p className="text-xs text-gray-500 flex items-center mt-0.5">
                    <Mail className="h-3.5 w-3.5 mr-1 text-gray-400" />
                    {selectedCandidate.applicant?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">

                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
             
              <div className="w-full md:w-80 border-r border-gray-100 p-6 space-y-6 overflow-y-auto bg-gray-50/30">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Application Status
                  </h4>
                  <div className="p-4 bg-white border border-gray-100 rounded-xl space-y-3 shadow-2xs">
                    <div>
                      <span className="text-[10px] text-gray-450 block mb-1">
                        Current Status
                      </span>
                      <span
                        className={`inline-flex items-center text-xs font-bold px-3 py-1 rounded-full border ${getStatusColor(
                          selectedCandidate.status,
                        )}`}
                      >
                        {selectedCandidate.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-450 block mb-1">
                        Update Status
                      </span>
                      <select
                        value={selectedCandidate.status}
                        onChange={(e) => {
                          handleStatusChange(selectedCandidate._id, e.target.value);
                          setSelectedCandidate({
                            ...selectedCandidate,
                            status: e.target.value,
                          });
                        }}
                        className="w-full border border-gray-200 rounded-xl text-xs py-2 px-3 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white font-medium text-gray-700 transition-colors"
                      >
                        <option value="Applied">Applied</option>
                        <option value="In-Review">In-Review</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                    Timeline
                  </h4>
                  <div className="text-xs text-gray-600 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-450">Applied on:</span>
                      <span className="font-medium">
                        {moment(selectedCandidate.createdAt).format("MMMM DD, YYYY")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-455">Relative:</span>
                      <span className="font-medium">
                        {moment(selectedCandidate.createdAt).fromNow()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <a
                    href={`mailto:${selectedCandidate.applicant?.email}`}
                    className="flex items-center justify-center space-x-2 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-xs hover:shadow-md transition-all duration-200"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Contact Candidate</span>
                  </a>
                </div>
              </div>

      
              <div className="flex-1 flex flex-col p-6 overflow-hidden bg-gray-50/50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold text-gray-450 uppercase tracking-wider flex items-center">
                    <FileText className="h-4 w-4 mr-1 text-red-500" />
                    Resume Preview
                  </h4>
                  {selectedCandidate.applicant?.resume && (
                    <div className="flex items-center space-x-3">
                      <a
                        href={getResumeUrl(selectedCandidate.applicant.resume)}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-gray-650 hover:text-gray-900 flex items-center space-x-1 border border-gray-200 bg-white px-2.5 py-1 rounded-lg shadow-2xs transition-colors cursor-pointer"
                        title="Download Resume File"
                      >
                        <Download className="h-3.5 w-3.5 text-blue-600 mr-1" />
                        <span>Download</span>
                      </a>
                      <a
                        href={getResumeUrl(selectedCandidate.applicant.resume)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                      >
                        <span>Open in New Tab</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex-1 border border-gray-200/80 rounded-2xl overflow-hidden bg-white shadow-inner relative">
                  {selectedCandidate.applicant?.resume ? (
                    <iframe
                      src={getResumeUrl(selectedCandidate.applicant.resume)}
                      className="w-full h-full border-0"
                      title="Candidate Resume Preview"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gray-50/30">
                      <AlertCircle className="h-10 w-10 text-gray-400 mb-2" />
                      <h4 className="font-semibold text-gray-900 text-sm">
                        No Resume Available
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 max-w-xs">
                        This candidate has not uploaded a resume to their profile.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ApplicationViewer;