import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Upload,
  Save,
  Loader2,
  FileText,
  Trash2,
  Download,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/cards/Card";
import InputField from "../../components/inputs/InpuField";

const UserProfile = () => {
  const { user, updateUser } = useAuth();

  const [fullName, setFullName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [resume, setResume] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [isDeletingResume, setIsDeletingResume] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setAvatar(user.avatar || "");
      setResume(user.resume || "");
      setAvatarPreview(user.avatar || "");
    }
  }, [user]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, WEBP)");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      toast.error("Image file size must be less than 3MB");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("image", file);

    try {
      setIsUploadingAvatar(true);
      const response = await axiosInstance.post(
        API_PATHS.IMAGE.UPLOAD,
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        const imageUrl = response.data.imageUrl;
        setAvatar(imageUrl);
        setAvatarPreview(imageUrl);
        // Automatically save avatar update to user profile context
        await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
          fullName: fullName || user.fullName,
          avatar: imageUrl,
          resume,
        });
        updateUser({ avatar: imageUrl });
        toast.success("Profile photo updated successfully!");
      }
    } catch (err) {
      console.error("Error uploading avatar:", err);
      toast.error("Failed to upload avatar.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please select a valid PDF file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Resume file size must be less than 5MB");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("image", file); // The backend endpoint expects 'image' key regardless of mimetype

    try {
      setIsUploadingResume(true);
      const response = await axiosInstance.post(
        API_PATHS.IMAGE.UPLOAD,
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        const fileUrl = response.data.imageUrl;
        setResume(fileUrl);
        // Automatically save resume update to user profile context
        await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
          fullName: fullName || user.fullName,
          avatar,
          resume: fileUrl,
        });
        updateUser({ resume: fileUrl });
        toast.success("Resume uploaded successfully!");
      }
    } catch (err) {
      console.error("Error uploading resume:", err);
      toast.error("Failed to upload resume.");
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!resume) return;
    try {
      setIsDeletingResume(true);
      const response = await axiosInstance.post(
        API_PATHS.AUTH.DELETE_RESUME,
        { resumeUrl: resume }
      );
      if (response.status === 200) {
        setResume("");
        updateUser({ resume: "" });
        toast.success("Resume deleted successfully!");
      }
    } catch (err) {
      console.error("Error deleting resume:", err);
      toast.error("Failed to delete resume.");
    } finally {
      setIsDeletingResume(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError("Full name is required");
      return;
    }
    setError("");

    try {
      setIsSubmitting(true);
      const response = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE,
        {
          fullName,
          avatar,
          resume,
        }
      );
      if (response.status === 200) {
        updateUser(response.data);
        toast.success("Personal details updated successfully!");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileName = (url) => {
    if (!url) return "";
    return url.split("/").pop() || "resume.pdf";
  };

  return (
    <DashboardLayout activeMenu="user-profile">
      <div className="max-w-7xl mx-auto space-y-8 pb-24">
        {/* Header Section */}
        <div>
          <h2 className="text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            My Account Profile
          </h2>
          <p className="text-sm text-gray-555 mt-1">
            Manage your personal profile information and resume.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Avatar Settings */}
          <div className="lg:col-span-1">
            <Card title="Profile Image">
              <div className="flex flex-col items-center justify-center p-6 space-y-5 text-center">
                <div className="relative group">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt={user?.fullName || "User Avatar"}
                      className="h-28 w-28 rounded-full object-cover border-4 border-slate-50 shadow-md transition-all duration-300"
                    />
                  ) : (
                    <div className="h-28 w-28 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 shadow-inner">
                      <User className="h-12 w-12" />
                    </div>
                  )}

                  {isUploadingAvatar && (
                    <div className="absolute inset-0 bg-white/70 rounded-full flex items-center justify-center z-10">
                      <Loader2 className="h-7 w-7 text-blue-600 animate-spin" />
                    </div>
                  )}
                </div>

                <div className="space-y-2 w-full">
                  <label className="relative inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 transition-all cursor-pointer w-full hover:border-gray-300">
                    <Upload className="h-4 w-4" />
                    <span>{avatar ? "Change Photo" : "Upload Photo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={isUploadingAvatar}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[10px] text-gray-400">
                    JPG, PNG or WEBP. Max size 3MB.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Profile Details & Resume Settings */}
          <div className="lg:col-span-2 space-y-8">
            {/* Form details card */}
            <Card title="Personal Information">
              <form onSubmit={handleSubmit} className="space-y-6 pt-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <InputField
                    label="Full Name"
                    id="fullName"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    error={error}
                    icon={User}
                  />

                  {/* Email (Read Only) */}
                  <InputField
                    label="Email Address"
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    icon={Mail}
                    helperText="Authentication emails cannot be updated."
                  />
                </div>

                <div className="flex justify-end border-t border-gray-50 pt-5">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center space-x-2 px-6 py-2.5 bg-linear-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </Card>

            {/* Resume Upload Settings */}
            <Card title="Resume & Documents">
              <div className="space-y-6 pt-3">
                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-bold text-gray-900">
                    Curriculum Vitae (CV)
                  </h4>
                  <p className="text-xs text-gray-450 leading-relaxed">
                    Upload your latest resume in PDF format. This document is
                    automatically attached to your applications when applying
                    for jobs.
                  </p>
                </div>

                {resume ? (
                  /* Uploaded Resume View */
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-2xl gap-4">
                    <div className="flex items-center space-x-3.5">
                      <div className="p-3 bg-rose-50 text-rose-500 rounded-xl border border-rose-100/50">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="space-y-0.5 max-w-[200px] sm:max-w-xs md:max-w-md">
                        <span className="text-sm font-bold text-gray-900 block truncate">
                          {getFileName(resume)}
                        </span>
                        <span className="text-[10px] text-gray-400 flex items-center">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mr-1 shrink-0" />
                          Ready for applications
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <a
                        href={resume}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center space-x-1.5 px-4 py-2 border border-gray-150 rounded-xl bg-white hover:bg-gray-50 text-gray-655 hover:text-gray-950 font-bold text-xs transition-colors shadow-xs"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Download</span>
                      </a>
                      <button
                        onClick={handleDeleteResume}
                        disabled={isDeletingResume}
                        className="flex items-center space-x-1.5 px-4 py-2 border border-rose-100 rounded-xl bg-rose-50/40 hover:bg-rose-50 text-rose-600 font-bold text-xs transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                      >
                        {isDeletingResume ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Empty state / Resume upload zone */
                  <div className="relative border-2 border-dashed border-gray-200 hover:border-blue-450 hover:bg-blue-50/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all">
                    {isUploadingResume ? (
                      <div className="flex flex-col items-center space-y-3">
                        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                        <span className="text-sm font-bold text-gray-700">
                          Uploading your resume...
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="p-3 bg-gray-50 text-gray-400 border border-gray-100 rounded-2xl mb-4">
                          <FileText className="h-8 w-8" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-sm font-bold text-gray-800">
                            No resume uploaded
                          </span>
                          <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                            Click to select a file. PDF files only, up to 5MB.
                          </p>
                        </div>
                        <label className="mt-5 inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer hover:shadow-lg">
                          <Upload className="h-4 w-4 mr-2" />
                          <span>Upload Resume</span>
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleResumeUpload}
                            disabled={isUploadingResume}
                            className="hidden"
                          />
                        </label>
                      </>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;