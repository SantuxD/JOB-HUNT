import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  AlertCircle,
  Briefcase,
  DollarSign,
  Eye,
  MapPin,
  Send,
  Users,
} from "lucide-react";
import { API_PATHS } from "../../utils/apiPath";
import { useLocation, useNavigate } from "react-router-dom";
import InputField from "../../components/inputs/InpuField";
import { CATEGORIES, JOB_TYPES } from "../../utils/data";
import SelectField from "../../components/inputs/SelectField";
import TextAreaField from "../../components/inputs/TextAreaField";
import axiosInstance from "../../utils/axiosInstance";
import JobPostingPreview from "../../components/cards/JobPostingPreview";


const JobPostingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const jobid = location.state?.jobid || null;
  const [formData, setFormData] = useState({
    jobTitle: "",
    location: "",
    category: "",
    jobType: "",
    description: "",
    requirements: "",
    salaryMin: "",
    salaryMax: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    if (jobid) {
      const fetchJobDetails = async () => {
        try {
          const response = await axiosInstance.get(
            API_PATHS.JOBS.GET_JOB_BY_ID(jobid),
          );
          const job = response.data;
          setFormData({
            jobTitle: job.title || "",
            location: job.location || "",
            category: job.category || "",
            jobType: job.type || "",
            description: job.description || "",
            requirements: job.requirements || "",
            salaryMin:
              job.salaryMin !== undefined && job.salaryMin !== null
                ? String(job.salaryMin)
                : "",
            salaryMax:
              job.salaryMax !== undefined && job.salaryMax !== null
                ? String(job.salaryMax)
                : "",
          });
        } catch (error) {
          console.error("Error fetching job details:", error);
          toast.error("Failed to load job details.");
        }
      };
      fetchJobDetails();
    }
  }, [jobid]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);

    const jobPayload = {
      title: formData.jobTitle,
      description: formData.description,
      requirements: formData.requirements,
      location: formData.location,
      category: formData.category,
      type: formData.jobType,
      salaryMax: formData.salaryMax,
      salaryMin: formData.salaryMin,
    };

    try {
      const response = jobid
        ? await axiosInstance.put(API_PATHS.JOBS.UPDATE_JOB(jobid), jobPayload)
        : await axiosInstance.post(API_PATHS.JOBS.POST_JOB, jobPayload);
      if (response.status === 200 || response.status === 201) {
        toast.success(
          jobid ? "Job updated successfully!" : "Job posted successfully!",
        );
      }

      setFormData({
        jobTitle: "",
        location: "",
        category: "",
        jobType: "",
        description: "",
        requirements: "",
        salaryMin: "",
        salaryMax: "",
      });
      navigate("/admin-dashboard");
      return;
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to save job. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const validateForm = (data) => {
    const newErrors = {};
    if (!data.jobTitle?.trim()) newErrors.jobTitle = "Job Title is required";
    if (!data.location?.trim()) newErrors.location = "Location is required";
    if (!data.category) newErrors.category = "Category is required";
    if (!data.jobType) newErrors.jobType = "Job Type is required";
    if (!data.description?.trim())
      newErrors.description = "Job description is required";
    if (!data.requirements?.trim())
      newErrors.requirements = "Requirements are required";

    if (
      data.salaryMin &&
      (isNaN(data.salaryMin) || Number(data.salaryMin) < 0)
    ) {
      newErrors.salaryMin = "Must be a valid positive number";
    }

    if (data.salaryMax) {
      if (isNaN(data.salaryMax) || Number(data.salaryMax) < 0) {
        newErrors.salaryMax = "Must be a valid positive number";
      } else if (
        data.salaryMin &&
        Number(data.salaryMax) < Number(data.salaryMin)
      ) {
        newErrors.salaryMax = "Maximum salary cannot be less than minimum";
      }
    }
    return newErrors;
  };

  const isFormValid = () => {
    const validationErrors = validateForm(formData);
    return Object.keys(validationErrors).length === 0;
  };

  if (isPreview) {
    return (
      <DashboardLayout activeMenu="post-job">
        <JobPostingPreview formData={formData} setIsPreview={setIsPreview} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="post-job">
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-purple-50/20 py-8 px-4 sm:px-6 lg:px-8 ">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-xl rounded-2xl p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Post a new Job
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Fill out the form below to create your job posting
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsPreview(!isPreview)}
                  disabled={!isFormValid() && !isPreview}
                  className="group flex items-center space-x-2 px-6 py-3 text-sm font-medium text-gray-600 hover:text-white bg-white/50 hover:bg-linear-to-r hover:from-blue-500 hover:to-blue-600 border border-gray-200 hover:border-transparent rounded-xl transition-all duration-300 shadow-gray-100 hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isPreview ? (
                    <span>Edit Form</span>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                      <span>Preview</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            {isPreview ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="border-b pb-6">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {formData.jobTitle}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-2" /> {formData.category}{" "}
                      - {formData.jobType}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" /> {formData.location}
                    </span>
                    {(formData.salaryMin || formData.salaryMax) && (
                      <span className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-2" />$
                        {formData.salaryMin || "0"} - $
                        {formData.salaryMax || "Any"}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Job Description
                  </h3>
                  <div className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                    {formData.description}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Requirements
                  </h3>
                  <div className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                    {formData.requirements}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Job Title"
                    id="jobTitle"
                    placeholder="e.g., Senior Frontend Developer"
                    value={formData.jobTitle}
                    onChange={(e) =>
                      handleInputChange("jobTitle", e.target.value)
                    }
                    error={errors.jobTitle}
                    required
                    icon={Briefcase}
                  />
                  <InputField
                    label="Location"
                    id="location"
                    placeholder="e.g., Bangalore, Kolkata"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    error={errors.location}
                    required
                    icon={MapPin}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SelectField
                    label="Category"
                    id="Category"
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    options={CATEGORIES}
                    placeholder="Select a Category"
                    error={errors.category}
                    required
                    icon={Users}
                  />
                  <SelectField
                    label="Job Type"
                    id="jobType"
                    value={formData.jobType}
                    onChange={(e) =>
                      handleInputChange("jobType", e.target.value)
                    }
                    options={JOB_TYPES}
                    placeholder="Select job type"
                    error={errors.jobType}
                    required
                    icon={Briefcase}
                  />
                </div>

                <TextAreaField
                  label="Job Description"
                  id="description"
                  placeholder="Describe the role, responsibilities, and ideal candidate..."
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  error={errors.description}
                  required
                  rows={5}
                />

                <TextAreaField
                  label="Requirements"
                  id="requirements"
                  placeholder="List the key skills, qualifications, and experience required..."
                  value={formData.requirements}
                  onChange={(e) =>
                    handleInputChange("requirements", e.target.value)
                  }
                  error={errors.requirements}
                  required
                  rows={4}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Minimum Salary"
                    id="salaryMin"
                    placeholder="e.g., 50000"
                    type="number"
                    value={formData.salaryMin}
                    onChange={(e) =>
                      handleInputChange("salaryMin", e.target.value)
                    }
                    error={errors.salaryMin}
                    icon={DollarSign}
                  />
                  <InputField
                    label="Maximum Salary"
                    id="salaryMax"
                    placeholder="e.g., 80000"
                    type="number"
                    value={formData.salaryMax}
                    onChange={(e) =>
                      handleInputChange("salaryMax", e.target.value)
                    }
                    error={errors.salaryMax}
                    icon={DollarSign}
                  />
                </div>

                <div className="pt-6 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !isFormValid()}
                    className="flex items-center justify-center space-x-2 px-8 py-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                  >
                    {isSubmitting ? (
                      <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-transparent border-t-white"></span>
                    ) : (
                      <>
                        <span>Publish Job</span>
                        <Send className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobPostingForm;
