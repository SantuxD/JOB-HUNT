import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  DollarSign,
  Briefcase,
  Bookmark,
  BookmarkCheck,
  Building2,
  Clock,
  Filter,
  X,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import Card from "../../components/cards/Card";
import { CATEGORIES, JOB_TYPES } from "../../utils/data";

// Category-based dynamic theme colors for a premium appearance
const CATEGORY_COLORS = {
  Engineering: {
    border: "border-blue-100 hover:border-blue-200",
    bg: "bg-blue-50/30",
    text: "text-blue-700",
    badge: "bg-blue-50 text-blue-755 border-blue-150/40",
    accent: "from-blue-500 to-indigo-650",
    dot: "bg-blue-500",
  },
  Design: {
    border: "border-pink-100 hover:border-pink-200",
    bg: "bg-pink-50/30",
    text: "text-pink-700",
    badge: "bg-pink-50 text-pink-755 border-pink-150/40",
    accent: "from-pink-500 to-rose-650",
    dot: "bg-pink-500",
  },
  Marketing: {
    border: "border-orange-100 hover:border-orange-200",
    bg: "bg-orange-55/10 border-orange-150/20",
    text: "text-orange-705",
    badge: "bg-orange-50 text-orange-755 border-orange-150/40",
    accent: "from-orange-500 to-amber-650",
    dot: "bg-orange-500",
  },
  Sales: {
    border: "border-amber-100 hover:border-amber-200",
    bg: "bg-amber-50/30",
    text: "text-amber-700",
    badge: "bg-amber-50 text-amber-755 border-amber-150/40",
    accent: "from-amber-500 to-yellow-600",
    dot: "bg-amber-500",
  },
  "Customer Support": {
    border: "border-cyan-100 hover:border-cyan-200",
    bg: "bg-cyan-50/30",
    text: "text-cyan-700",
    badge: "bg-cyan-50 text-cyan-755 border-cyan-150/40",
    accent: "from-cyan-500 to-blue-650",
    dot: "bg-cyan-500",
  },
  Finance: {
    border: "border-emerald-100 hover:border-emerald-200",
    bg: "bg-emerald-50/30",
    text: "text-emerald-700",
    badge: "bg-emerald-50 text-emerald-755 border-emerald-150/40",
    accent: "from-emerald-500 to-teal-650",
    dot: "bg-emerald-500",
  },
  "IT & Software": {
    border: "border-violet-100 hover:border-violet-200",
    bg: "bg-violet-50/30",
    text: "text-violet-700",
    badge: "bg-violet-50 text-violet-755 border-violet-150/40",
    accent: "from-violet-500 to-purple-650",
    dot: "bg-violet-500",
  },
  "Human Resources": {
    border: "border-teal-100 hover:border-teal-200",
    bg: "bg-teal-50/30",
    text: "text-teal-700",
    badge: "bg-teal-50 text-teal-755 border-teal-150/40",
    accent: "from-teal-500 to-emerald-650",
    dot: "bg-teal-500",
  },
  Operations: {
    border: "border-sky-100 hover:border-sky-200",
    bg: "bg-sky-50/30",
    text: "text-sky-700",
    badge: "bg-sky-50 text-sky-755 border-sky-150/40",
    accent: "from-sky-500 to-indigo-600",
    dot: "bg-sky-500",
  },
  "Product Management": {
    border: "border-fuchsia-100 hover:border-fuchsia-200",
    bg: "bg-fuchsia-50/30",
    text: "text-fuchsia-700",
    badge: "bg-fuchsia-50 text-fuchsia-755 border-fuchsia-150/40",
    accent: "from-fuchsia-500 to-purple-650",
    dot: "bg-fuchsia-500",
  },
  Others: {
    border: "border-gray-200 hover:border-gray-300",
    bg: "bg-gray-50/40",
    text: "text-gray-700",
    badge: "bg-gray-50 text-gray-755 border-gray-200/50",
    accent: "from-gray-500 to-gray-650",
    dot: "bg-gray-500",
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

const JobSeekerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [keyword, setKeyword] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Salary Sliders State
  const [minSalary, setMinSalary] = useState(0);
  const [maxSalary, setMaxSalary] = useState(250000);

  // Search trigger helper to execute queries
  const [triggerQuery, setTriggerQuery] = useState(0);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);

      const params = {
        userId: user?._id || "",
        keyword: keyword.trim() || undefined,
        location: locationFilter.trim() || undefined,
        category: selectedCategory || undefined,
        type: selectedType || undefined,
        minSalary: minSalary > 0 ? minSalary : undefined,
        maxSalary: maxSalary < 250000 ? maxSalary : undefined,
      };

      const response = await axiosInstance.get(API_PATHS.JOBS.GET_ALL_JOBS, {
        params,
      });

      if (response.status === 200) {
        setJobs(response.data);
      }
    } catch (error) {
      console.error("Error fetching jobs seeker:", error);
      toast.error("Failed to fetch jobs.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [selectedCategory, selectedType, triggerQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setTriggerQuery((prev) => prev + 1);
  };

  const handleClearFilters = () => {
    setKeyword("");
    setLocationFilter("");
    setSelectedCategory("");
    setSelectedType("");
    setMinSalary(0);
    setMaxSalary(250000);
    setTriggerQuery((prev) => prev + 1);
    toast.success("Filters cleared");
  };

  const handleToggleSave = async (e, jobId, isAlreadySaved) => {
    e.stopPropagation(); // Prevent card navigation
    if (!user) {
      toast.error("Please login to save jobs.");
      return;
    }
    try {
      if (isAlreadySaved) {
        const response = await axiosInstance.delete(
          API_PATHS.JOBS.UNSAVE_JOB(jobId),
        );
        if (response.status === 200) {
          setJobs((prevJobs) =>
            prevJobs.map((job) =>
              job._id === jobId ? { ...job, isSaved: false } : job,
            ),
          );
          toast.success("Job removed from saved list.");
        }
      } else {
        const response = await axiosInstance.post(
          API_PATHS.JOBS.SAVE_JOB(jobId),
        );
        if (response.status === 201 || response.status === 200) {
          setJobs((prevJobs) =>
            prevJobs.map((job) =>
              job._id === jobId ? { ...job, isSaved: true } : job,
            ),
          );
          toast.success("Job saved successfully!");
        }
      }
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error("Failed to update saved job status.");
    }
  };

  const getApplicationStatusStyles = (status) => {
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
        return "";
    }
  };

  // Inline filter panel component (features range sliders for salary)
  const FiltersPanel = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          Category
        </h4>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full border border-gray-200 rounded-xl py-2 px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div className="border-t border-gray-100 pt-5">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3.5">
          Job Type
        </h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedType("")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              selectedType === ""
                ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                : "bg-white text-gray-650 hover:bg-gray-50 border-gray-200"
            }`}
          >
            All Types
          </button>
          {JOB_TYPES.map((type) => {
            const isSelected = selectedType === type.value;
            const colorClass = getTypeColor(type.value);
            return (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${colorClass} ${
                  isSelected
                    ? "ring-2 ring-blue-500/50 ring-offset-1 font-bold scale-105"
                    : "opacity-75 hover:opacity-100"
                }`}
              >
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Salary Range Sliders Block */}
      <div className="border-t border-gray-100 pt-5 space-y-4">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
          Salary Range (Per Year)
        </h4>

        {/* Minimum Salary Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Min Salary</span>
            <span className="font-bold text-gray-900">
              ${minSalary.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="200000"
            step="5000"
            value={minSalary}
            onChange={(e) => setMinSalary(Number(e.target.value))}
            onMouseUp={() => setTriggerQuery((p) => p + 1)}
            onTouchEnd={() => setTriggerQuery((p) => p + 1)}
            className="w-full h-1.5 bg-gray-150 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Maximum Salary Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Max Salary</span>
            <span className="font-bold text-gray-900">
              {maxSalary >= 250000 ? "Any" : `$${maxSalary.toLocaleString()}`}
            </span>
          </div>
          <input
            type="range"
            min="10000"
            max="250000"
            step="10000"
            value={maxSalary}
            onChange={(e) => setMaxSalary(Number(e.target.value))}
            onMouseUp={() => setTriggerQuery((p) => p + 1)}
            onTouchEnd={() => setTriggerQuery((p) => p + 1)}
            className="w-full h-1.5 bg-gray-150 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>

      <button
        onClick={handleClearFilters}
        className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-650 hover:text-gray-900 border border-gray-200 font-semibold rounded-xl text-xs transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );

  return (
    <DashboardLayout activeMenu="find-jobs">
      <div className="max-w-7xl mx-auto space-y-8 pb-24">
        {/* Hero banner search area */}
        <div className="relative rounded-3xl bg-linear-to-r from-blue-600 to-indigo-650 p-6 md:p-12 text-white shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-24 translate-x-24 blur-xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-white/5 rounded-full translate-y-16 blur-lg pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-blue-100">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Discover new career horizons</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Find Your Next Career Move
            </h2>
            <p className="text-sm md:text-base text-blue-100 font-medium">
              Explore thousands of job postings from verified organizations worldwide.
            </p>

            {/* Search Form */}
            <form
              onSubmit={handleSearchSubmit}
              className="pt-4 flex flex-col md:flex-row gap-3"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Job title, keywords, or skills..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white text-gray-900 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-400 transition-shadow"
                />
              </div>

              <div className="relative flex-1">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Location or 'Remote'..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white text-gray-900 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-400 transition-shadow"
                />
              </div>

              <button
                type="submit"
                className="px-8 py-3 bg-white hover:bg-blue-50 text-blue-700 font-bold rounded-xl text-sm shadow-md transition-colors cursor-pointer shrink-0"
              >
                Search Jobs
              </button>
            </form>
          </div>
        </div>

        {/* Dashboard Content split grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filters Panel */}
          <div className="hidden lg:block lg:col-span-1">
            <Card title="Filter Openings">
              <FiltersPanel />
            </Card>
          </div>

          {/* Jobs Listing Grid (Right Column) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-lg flex items-center">
                Available Positions
                {!isLoading && (
                  <span className="ml-2.5 text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-650 rounded-full">
                    {jobs.length} open roles
                  </span>
                )}
              </h3>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center space-x-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-650 bg-white"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>
            </div>

            {isLoading ? (
              <div className="py-24">
                <LoadingSpinner />
              </div>
            ) : jobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-100 rounded-2xl text-center p-6">
                <div className="h-16 w-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <Briefcase className="h-8 w-8 text-gray-455" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  No Job Openings Match Your Query
                </h3>
                <p className="text-sm text-gray-550 max-w-sm mt-1">
                  We couldn't find any job matches. Try updating your keywords,
                  categories, or clearing filters.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {jobs.map((job) => {
                  const colors =
                    CATEGORY_COLORS[job.category] || CATEGORY_COLORS.Others;
                  return (
                    <div
                      key={job._id}
                      onClick={() => navigate(`/job/${job._id}`)}
                      className="relative overflow-hidden bg-white border border-gray-100 hover:border-gray-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer group flex flex-col justify-between min-h-[250px]"
                    >

                      <div>
                        {/* Company logo, Name, Badges & Save button row */}
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center space-x-3">
                            {job.company?.companyLogo ? (
                              <img
                                src={job.company.companyLogo}
                                alt={
                                  job.company.companyName || job.company.name
                                }
                                className="h-11 w-11 rounded-xl object-cover border border-gray-150 bg-white"
                              />
                            ) : (
                              <div className="h-11 w-11 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400">
                                <Building2 className="h-5 w-5" />
                              </div>
                            )}
                            <div>
                              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                {job.company?.companyName || "Organization"}
                              </div>
                              <div className="flex flex-wrap gap-1.5 mt-1.5">
                                <span
                                  className={`inline-flex items-center text-[9px] font-bold px-2 py-0.5 border rounded-md ${colors.badge}`}
                                >
                                  {job.category}
                                </span>
                                <span
                                  className={`inline-flex items-center text-[9px] font-bold px-2 py-0.5 border rounded-md ${getTypeColor(
                                    job.type,
                                  )}`}
                                >
                                  {job.type}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Save Bookmark button */}
                          <button
                            onClick={(e) =>
                              handleToggleSave(e, job._id, job.isSaved)
                            }
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            title={job.isSaved ? "Saved Job" : "Save Job"}
                          >
                            {job.isSaved ? (
                              <BookmarkCheck className="h-5 w-5 text-blue-600" />
                            ) : (
                              <Bookmark className="h-5 w-5" />
                            )}
                          </button>
                        </div>

                        {/* Job title & description snip */}
                        <div className="mt-2 space-y-1">
                          <h4 className="font-bold text-gray-900 group-hover:text-blue-600 text-base leading-tight transition-colors">
                            {job.title}
                          </h4>
                          <p className="text-xs text-gray-500 line-clamp-2 mt-1.5">
                            {job.description}
                          </p>
                        </div>
                      </div>

                      {/* Footer: salary, location, applied tag & view action */}
                      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-555">
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
                          <div className="flex items-center text-[10px]">
                            <MapPin className="h-3.5 w-3.5 text-gray-455 mr-1 shrink-0" />
                            <span className="truncate max-w-[120px]">
                              {job.type === "Remote" && job.location
                                ? `Remote . ${job.location}`
                                : job.location || "Remote"}
                            </span>
                          </div>
                        </div>

                        {/* Applied Status Badge / Apply Button */}
                        <div>
                          {job.applicationStatus ? (
                            <span
                              className={`inline-flex items-center font-bold px-3 py-1.5 rounded-xl text-[10px] ${getApplicationStatusStyles(
                                job.applicationStatus,
                              )}`}
                            >
                              {job.applicationStatus === "Applied"
                                ? "Applied"
                                : job.applicationStatus}
                            </span>
                          ) : (
                            <div className="text-blue-600 hover:text-blue-700 font-bold flex items-center space-x-0.5 group/btn">
                              <span>View Details</span>
                              <ChevronRight className="h-4 w-4 transform group-hover/btn:translate-x-0.5 transition-transform" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Slide-Over filters */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-black/40 backdrop-blur-xs">
          <div className="bg-white w-80 h-full p-6 flex flex-col space-y-6 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900 text-lg">Filters</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-xl"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-1">
              <FiltersPanel />
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default JobSeekerDashboard;