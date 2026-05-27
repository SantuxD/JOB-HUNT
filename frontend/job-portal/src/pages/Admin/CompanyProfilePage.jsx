import { useEffect, useState } from "react";
import {
  Building2,
  Upload,
  User,
  Save,
  Loader2,
  Mail,
  Shield,
  Edit2,
  X,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/cards/Card";
import InputField from "../../components/inputs/InpuField";
import TextAreaField from "../../components/inputs/TextAreaField";

const CompanyProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    avatar: "",
    companyName: "",
    companyDescription: "",
    companyLogo: "",
  });
  const [logoPreview, setLogoPreview] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        avatar: user.avatar || "",
        companyName: user.companyName || "",
        companyDescription: user.companyDescription || "",
        companyLogo: user.companyLogo || "",
      });
      setLogoPreview(user.companyLogo || "");
      setAvatarPreview(user.avatar || "");
    }
  }, [user, isEditing]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Representative Name is required";
    }
    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company Name is required";
    }
    if (!formData.companyDescription.trim()) {
      newErrors.companyDescription = "Company Description is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageUpload = async (e, type) => {
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
      if (type === "avatar") {
        setIsUploadingAvatar(true);
      } else {
        setIsUploadingLogo(true);
      }

      const response = await axiosInstance.post(
        API_PATHS.IMAGE.UPLOAD,
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.status === 200) {
        const imageUrl = response.data.imageUrl;
        if (type === "avatar") {
          setAvatarPreview(imageUrl);
          setFormData((prev) => ({ ...prev, avatar: imageUrl }));
        } else {
          setLogoPreview(imageUrl);
          setFormData((prev) => ({ ...prev, companyLogo: imageUrl }));
        }
        toast.success(
          `${type === "avatar" ? "User avatar" : "Company logo"} uploaded successfully!`,
        );
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image.");
    } finally {
      if (type === "avatar") {
        setIsUploadingAvatar(false);
      } else {
        setIsUploadingLogo(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const response = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE,
        formData,
      );
      if (response.status === 200) {
        updateUser(response.data);
        toast.success("Profile settings updated successfully!");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout activeMenu="company-profile">
      <div className="max-w-4xl mx-auto space-y-8 pb-24">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Company & Admin Settings
            </h2>
            <p className="text-sm text-gray-505 mt-1">
              {isEditing
                ? "Modify your personal account settings, company details, representative avatar and company logo."
                : "View your personal profile settings and company branding details."}
            </p>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer animate-in fade-in"
            >
              <Edit2 className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        {!isEditing ? (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="relative bg-linear-to-r from-blue-600 to-indigo-650 rounded-3xl p-6 md:p-8 text-white shadow-xl overflow-hidden min-h-[160px] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-24 translate-x-24 blur-xl pointer-events-none" />
              <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white/5 rounded-full translate-y-12 blur-lg pointer-events-none" />

              <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                {user?.companyLogo ? (
                  <img
                    src={user.companyLogo}
                    alt={user.companyName}
                    className="h-20 w-20 rounded-2xl object-cover border-3 border-white/20 shadow-lg bg-white"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-2xl bg-white/10 border-3 border-white/10 flex items-center justify-center shadow-lg">
                    <Building2 className="h-10 w-10 text-white/80" />
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">
                    {user?.companyName || "Organization Profile"}
                  </h3>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-2">
                    <span className="inline-flex items-center text-xs font-semibold px-3 py-0.5 rounded-full bg-white/10 border border-white/10 text-white">
                      {user?.role === "admin" ? " Admin" : "User"}
                    </span>
                    <span className="inline-flex items-center text-xs font-semibold px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      Verified Business
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 space-y-6">
                <Card title="User Information">
                  <div className="space-y-4">
                    <div className="flex flex-col items-center pb-4 border-b border-gray-100/60">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.fullName}
                          className="h-20 w-20 rounded-full object-cover border-2 border-blue-100 shadow-md bg-white"
                        />
                      ) : (
                        <div className="h-20 w-20 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-extrabold text-2xl shadow-inner">
                          {user?.fullName?.charAt(0).toUpperCase() || "?"}
                        </div>
                      )}
                      <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-3">
                        Admin User Avatar
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-405 block uppercase tracking-wider">
                        Representative Name
                      </span>
                      <div className="text-sm font-semibold text-gray-900 mt-1">
                        {user?.fullName}
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-3">
                      <span className="text-[10px] text-gray-405 block uppercase tracking-wider">
                        Contact Email
                      </span>
                      <div className="text-xs font-medium text-gray-600 truncate mt-1">
                        {user?.email}
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-3">
                      <span className="text-[10px] text-gray-405 block uppercase tracking-wider">
                        Account Role
                      </span>
                      <div className="flex items-center space-x-1.5 mt-1 text-xs font-bold text-purple-700 uppercase">
                        <Shield className="h-4 w-4" />
                        <span>{user?.role}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="md:col-span-2 space-y-6">
                <Card title="Company Information">
                  <div className="flex items-center space-x-4 mb-4 pb-4 border-b border-gray-100/60">
                    {user?.companyLogo ? (
                      <img
                        src={user.companyLogo}
                        alt={user.companyName}
                        className="h-16 w-16 rounded-xl object-cover border border-gray-200 shadow-xs bg-white"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400">
                        <Building2 className="h-7 w-7" />
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] text-gray-405 block uppercase tracking-wider">
                        Company Name
                      </span>
                      <div className="font-bold text-gray-900 text-lg mt-0.5">
                        {user?.companyName || "Not configured"}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] text-gray-405 block uppercase tracking-wider">
                        Organization Status
                      </span>
                      <div className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 mt-1">
                        Verified Business Account
                      </div>
                    </div>
                  </div>
                </Card>

                <Card title="About Company">
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-normal">
                    {user?.companyDescription || (
                      <span className="text-gray-400 italic">
                        No company description provided yet. Click "Edit
                        Profile" to write about your organization.
                      </span>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 animate-in fade-in duration-200"
          >
            <Card title="Personal Information">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex flex-col items-center shrink-0">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
                    User Avatar
                  </span>
                  <div className="relative group h-28 w-28 rounded-full overflow-hidden border border-gray-200 shadow-sm bg-gray-50 flex items-center justify-center transition-all duration-300 hover:border-blue-400">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="User Avatar Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-10 w-10 text-gray-300" />
                    )}

                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity duration-300">
                      {isUploadingAvatar ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <Upload className="h-5 w-5 mb-1" />
                          <span className="text-[9px] font-semibold">
                            Change Avatar
                          </span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "avatar")}
                        disabled={isUploadingAvatar}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Full Name"
                    id="fullName"
                    placeholder="e.g. John Doe"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    error={errors.fullName}
                    required
                    icon={User}
                  />

                  <InputField
                    label="Email Address"
                    id="email"
                    value={user?.email || ""}
                    disabled={true}
                    icon={Mail}
                    helperText="Credentials email address cannot be edited."
                  />
                </div>
              </div>
            </Card>

            <Card title="Company Information">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex flex-col items-center shrink-0">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
                    Company Logo
                  </span>
                  <div className="relative group h-28 w-28 rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50 flex items-center justify-center transition-all duration-300 hover:border-blue-400">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Company Logo Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Building2 className="h-10 w-10 text-gray-300" />
                    )}

                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity duration-300">
                      {isUploadingLogo ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <Upload className="h-5 w-5 mb-1" />
                          <span className="text-[9px] font-semibold">
                            Change Logo
                          </span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "companyLogo")}
                        disabled={isUploadingLogo}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <InputField
                    label="Company Name"
                    id="companyName"
                    placeholder="e.g. Acme Corporation"
                    value={formData.companyName}
                    onChange={(e) =>
                      handleInputChange("companyName", e.target.value)
                    }
                    error={errors.companyName}
                    required
                    icon={Building2}
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100/60 mt-6">
                <TextAreaField
                  label="Company Description"
                  id="companyDescription"
                  placeholder="Tell candidates about your company mission, values, and work culture..."
                  value={formData.companyDescription}
                  onChange={(e) =>
                    handleInputChange("companyDescription", e.target.value)
                  }
                  error={errors.companyDescription}
                  required
                  rows={6}
                />
              </div>
            </Card>

            <div className="flex justify-end items-center space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                disabled={isSubmitting || isUploadingLogo || isUploadingAvatar}
                className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl border border-gray-200 transition-all duration-200 cursor-pointer"
              >
                <X className="h-4 w-4 mr-1.5" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isUploadingLogo || isUploadingAvatar}
                className="flex items-center justify-center space-x-2 px-6 py-2.5 bg-linear-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-1.5" />
                )}
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CompanyProfilePage;
