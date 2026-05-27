import { useEffect, useState } from "react";
import {
  Briefcase,
  TrendingUp,
  Users,
  Search,
  Edit2,
  Trash2,
  Plus,
  MapPin,
  DollarSign,
  AlertTriangle,
  Clock,
  Eye,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatCard from "../../components/cards/StatCard";
import Card from "../../components/cards/Card";

// Dynamic Theme Colors mapped by Job Category
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

// Dynamic color mapping for Job Types
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

const ManageJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'active', 'closed'
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(API_PATHS.JOBS.GET_JOBS_ADMIN);
      if (response.status === 200) {
        setJobs(response.data);
      }
    } catch (error) {
      console.error("Error fetching admin jobs:", error);
      toast.error("Failed to load jobs.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggleClose = async (jobId) => {
    try {
      const response = await axiosInstance.put(
        API_PATHS.JOBS.TOGGLE_CLOSE_JOB(jobId),
      );
      if (response.status === 200) {
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job._id === jobId ? { ...job, isClosed: !job.isClosed } : job,
          ),
        );
        const updatedJob = jobs.find((j) => j._id === jobId);
        toast.success(
          updatedJob?.isClosed
            ? "Job is now open for applications!"
            : "Job closed successfully!",
        );
      }
    } catch (error) {
      console.error("Error toggling job status:", error);
      toast.error("Failed to change job status.");
    }
  };

  const handleDeleteJob = async () => {
    if (!deleteConfirmId) return;
    try {
      setIsDeleting(true);
      const response = await axiosInstance.delete(
        API_PATHS.JOBS.DELETE_JOB(deleteConfirmId),
      );
      if (response.status === 200) {
        setJobs((prevJobs) => prevJobs.filter((job) => job._id !== deleteConfirmId));
        toast.success("Job deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete the job.");
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  // Calculations for stats
  const totalJobsCount = jobs.length;
  const activeJobsCount = jobs.filter((job) => !job.isClosed).length;
  const totalApplicationsCount = jobs.reduce(
    (sum, job) => sum + (job.applicationCount || 0),
    0,
  );

  // Search & Filter Logic
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !job.isClosed) ||
      (statusFilter === "closed" && job.isClosed);

    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout activeMenu="manage-jobs">
      <div className="max-w-7xl mx-auto space-y-8 pb-24">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Manage Job Postings
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Create, edit, toggle, or delete your job listings and view applications.
            </p>
          </div>
          <button
            onClick={() => navigate("/post-jobs")}
            className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" />
            <span>Post a New Job</span>
          </button>
        </div>

        {/* Stats Section */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Total Job Posts"
              value={totalJobsCount}
              icon={Briefcase}
              color="blue"
            />
            <StatCard
              title="Active Postings"
              value={activeJobsCount}
              icon={TrendingUp}
              color="green"
            />
            <StatCard
              title="Total Applications"
              value={totalApplicationsCount}
              icon={Users}
              color="purple"
            />
          </div>
        )}

        {/* Search, filter & list section */}
        <Card>
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, location, category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-200 rounded-xl text-sm py-2 px-3 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="closed">Closed Only</option>
              </select>
            </div>
          </div>

          {/* List content */}
          {isLoading ? (
            <div className="py-12">
              <LoadingSpinner />
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-16 w-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <Briefcase className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No Job Postings Found</h3>
              <p className="text-sm text-gray-500 max-w-sm mt-1">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search filters or status selection."
                  : "Get started by posting your very first job opening."}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <button
                  onClick={() => navigate("/post-jobs")}
                  className="mt-6 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition-all"
                >
                  Create job
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto -mx-6">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-4">Job Info</th>
                      <th className="px-6 py-4">Type & Location</th>
                      <th className="px-6 py-4">Compensation</th>
                      <th className="px-6 py-4">Applicants</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredJobs.map((job) => {
                      const colors = CATEGORY_COLORS[job.category] || CATEGORY_COLORS.Others;
                      return (
                        <tr key={job._id} className="hover:bg-gray-50/40 transition-colors group">
                          {/* Job Info */}
                          <td className="px-6 py-5">
                            <div>
                              <div
                                className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer text-sm flex items-center transition-colors"
                                onClick={() => navigate(`/job/${job._id}`)}
                              >
                                {job.title}
                              </div>
                              <div className="text-[10px] mt-1.5 ml-5">
                                <span className={`inline-flex items-center font-bold px-2 py-0.5 border rounded-md ${colors.badge}`}>
                                  {job.category}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Type & Location */}
                          <td className="px-6 py-5">
                            <div className="flex flex-col space-y-1">
                              <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full w-fit border ${getTypeColor(job.type)}`}>
                                {job.type}
                              </span>
                              <span className="text-xs text-gray-500 flex items-center mt-0.5">
                                <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" />
                                {job.type === "Remote" && job.location
                                  ? `Remote . ${job.location}`
                                  : job.location || "Remote"}
                              </span>
                            </div>
                          </td>

                          {/* Salary */}
                          <td className="px-6 py-5">
                            <div className="text-xs font-bold text-emerald-600">
                              {job.salaryMin ? `$${job.salaryMin.toLocaleString()}` : "$0"}{" "}
                              -{" "}
                              {job.salaryMax ? `$${job.salaryMax.toLocaleString()}` : "$Any"}
                            </div>
                            <div className="text-[10px] text-gray-400 mt-0.5">Per Year</div>
                          </td>

                          {/* Applicants count */}
                          <td className="px-6 py-5">
                            <button
                              onClick={() =>
                                navigate("/applicants", {
                                  state: { jobid: job._id, jobTitle: job.title },
                                })
                              }
                              className="group flex items-center space-x-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                            >
                              <Users className="h-3.5 w-3.5" />
                              <span className="text-xs font-bold">
                                {job.applicationCount || 0}
                              </span>
                            </button>
                          </td>

                          {/* Status Toggle */}
                          <td className="px-6 py-5">
                            <button
                              onClick={() => handleToggleClose(job._id)}
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                                !job.isClosed ? "bg-emerald-500" : "bg-gray-200"
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                  !job.isClosed ? "translate-x-5" : "translate-x-0"
                                }`}
                              />
                            </button>
                            <span className="text-xs ml-2 font-medium text-gray-600">
                              {job.isClosed ? "Closed" : "Open"}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-5 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => navigate(`/job/${job._id}`)}
                                title="View Posting"
                                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() =>
                                  navigate("/post-jobs", { state: { jobid: job._id } })
                                }
                                title="Edit Job"
                                className="p-1.5 text-blue-500 hover:text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(job._id)}
                                title="Delete Job"
                                className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {filteredJobs.map((job) => {
                  const colors = CATEGORY_COLORS[job.category] || CATEGORY_COLORS.Others;
                  return (
                    <div
                      key={job._id}
                      className="border border-gray-100 rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow relative bg-white overflow-hidden"
                    >

                      <div className="flex justify-between items-start mb-3 pl-1">
                        <div>
                          <h4
                            onClick={() => navigate(`/job/${job._id}`)}
                            className="font-bold text-gray-900 hover:text-blue-600 cursor-pointer text-base"
                          >
                            {job.title}
                          </h4>
                          <div className="mt-1">
                            <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 border rounded-md ${colors.badge}`}>
                              {job.category}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                            !job.isClosed
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-gray-100 text-gray-600 border border-gray-200"
                          }`}
                        >
                          {job.isClosed ? "Closed" : "Open"}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4 pt-3 border-t border-gray-100/60 text-xs text-gray-600 pl-1">
                        <div>
                          <span className="text-gray-400 block mb-0.5">Location</span>
                          <span className="font-medium flex items-center">
                            <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" />
                            {job.location || "Remote"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 block mb-0.5">Job Type</span>
                          <span className={`font-semibold px-2 py-0.5 rounded-md border ${getTypeColor(job.type)}`}>
                            {job.type}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 block mb-0.5">Salary</span>
                          <span className="font-bold text-emerald-600 flex items-center">
                            <DollarSign className="h-3.5 w-3.5 text-emerald-500 mr-0.5" />
                            {job.salaryMin ? `${job.salaryMin.toLocaleString()}` : "0"} -{" "}
                            {job.salaryMax ? `${job.salaryMax.toLocaleString()}` : "Any"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 block mb-0.5">Applicants</span>
                          <button
                            onClick={() =>
                              navigate("/applicants", {
                                state: { jobid: job._id, jobTitle: job.title },
                              })
                            }
                            className="font-bold text-blue-600 flex items-center space-x-1 hover:underline"
                          >
                            <Users className="h-3.5 w-3.5 mr-1" />
                            <span>{job.applicationCount || 0}</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 pl-1">
                        {/* Toggle status on mobile */}
                        <button
                          onClick={() => handleToggleClose(job._id)}
                          className="text-xs text-gray-600 font-semibold hover:text-blue-600 flex items-center space-x-1"
                        >
                          <Clock className="h-4 w-4" />
                          <span>Toggle Status</span>
                        </button>

                        {/* Action buttons on mobile */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => navigate(`/job/${job._id}`)}
                            className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() =>
                              navigate("/post-jobs", { state: { jobid: job._id } })
                            }
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(job._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Delete Confirmation Modal (Glassmorphic design) */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 transform scale-100 transition-transform animate-in fade-in duration-200">
            <div className="flex items-center space-x-3 text-red-600 mb-4">
              <div className="p-2.5 bg-red-50 rounded-xl">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Delete Job Posting?</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this job posting? This action is permanent,
              and all applications for this job will be lost.
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setDeleteConfirmId(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteJob}
                disabled={isDeleting}
                className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-xs"
              >
                {isDeleting ? (
                  <span className="h-4 w-4 border-2 border-transparent border-t-white rounded-full animate-spin mr-2"></span>
                ) : null}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ManageJobs;
