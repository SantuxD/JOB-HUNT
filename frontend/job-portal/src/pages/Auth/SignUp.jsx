import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Building2,
  CheckCircle,
  AlertCircle,
  Loader,
  Upload,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { validateEmail } from "../../utils/helper";
import { validatePassword } from "../../utils/helper";
import { validateAvatar } from "../../utils/helper";
const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
    avatar: null,
  });

  const [formState, setFormState] = useState({
    loading: false,
    error: {},
    showPassword: false,
    avatarPreview: null,
    success: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (formState.error[name]) {
      setFormState((prevState) => ({
        ...prevState,
        error: {
          ...prevState.error,
          [name]: "",
        },
      }));
    }
  };

  const handleRoleChange = (role) => {
    setFormData((prevData) => ({
      ...prevData,
      role,
    }));
    if (formState.error.role) {
      setFormState((prevState) => ({
        ...prevState,
        error: {
          ...prevState.error,
          role: "",
        },
      }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const error = validateAvatar(file);
      if (error) {
        setFormState((prevData) => ({
          ...prevData,
          error: {
            ...prevState.error,
            avatar: error,
          },
        }));
        return;
      }
      setFormData((prevData) => ({
        ...prevData,
        avatar: file,
      }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormState((prev) => ({
          ...prev,
          avatarPreview: e.target.result,
          errors: { ...prev.error, avatar: "" },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {
      fullName: !formData.fullName ? "Enter full name" : "",
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      role: !formData.role ? "please select a role" : "",
      avatar: "",
    };
    Object.keys(errors).forEach((key) => {
      if (!errors[key]) {
        delete errors[key];
      }
    });

    setFormState((prevState) => ({
      ...prevState,
      error: errors,
    }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setFormState((prevState) => ({
      ...prevState,
      loading: true,
    }));
    try {
      // Simulate API call
    } catch (error) {
      console.log("error", error);
      setFormState((prevState) => ({
        ...prevState,
        error: {
          submit:
            error.response?.data?.message ||
            "Registration failed. Please try again.",
        },
        loading: false,
      }));
    }
  };

  if (formState.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className=" bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Registration Successful
          </h2>
          <p className="text-gray-600 mb-4">
            Your account has been created successfully.
          </p>
          <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto " />
          <p className="text-sm text-gray-500 mt-2 ">
            Redirect to you dashboard
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full"
      >
        <div className="text-center mb-8">
          <h2 className="font-bold text-xl text-gray-900 mb-2">
            Create Account
          </h2>
          <p className="text-sm text-gray-600">
            Join us and start your job search journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 ">
              {" "}
              Full Name*
            </label>
            <div className="relative">
              <User className=" absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full Name"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  formState.error.fullName
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
              />
            </div>
            {formState.error.fullName && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.error.fullName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {" "}
              Email Address*{" "}
            </label>
            <div className="relative">
              <Mail className=" absolute  left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  formState.error.email ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:boreder-transparent transition-colors`}
              />
            </div>
            {formState.error.email && (
              <p className="text-red-500 text-sm flex items-center mt-1">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.error.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {" "}
              Password*
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2  w-5 h-5 text-gray-400" />
              <input
                type={formState.showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  formState.error.password
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:boreder-transparent transition-colors`}
              />
              <button
                type="button"
                onClick={() =>
                  setFormState((prev) => ({
                    ...prev,
                    showPassword: !prev.showPassword,
                  }))
                }
                className="absolute right-3 top-1/2 transform -translate-y-1/2  text-gray-400 hover:text-gray-600"
              >
                {formState.showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {formState.error.password && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.error.password}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture (Optional)
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {formState.avatarPreview ? (
                  <img
                    src={formState.avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  id="avatar"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <label
                  htmlFor="avatar"
                  className="cursor-pointer bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2 "
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Photo</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG up to 5MB{" "}
                </p>
              </div>
            </div>
            {formState.error.avatar && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.error.avatar}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              I am a*
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleRoleChange("jobseeker")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.role === "jobseeker"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <UserCheck className="w-8 h-8 mx-auto mb-2" />
                <div className="font-medium "> Job Seeker</div>
                <div className="text-xs text-gray-500">
                  {" "}
                  Looking for Opportunities
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange("admin")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.role === "admin"
                    ? "border-blue-500 bg-blue-50 text-blue-700 "
                    : "border-gray-200 hover:border-gray-300"
                } `}
              >
                <Building2 className="w-8 h-8 mx-auto mb-2" />

                <div className="font-medium">Admin</div>
                <div className="text-xs text-gray-500">Hiring Talent</div>
              </button>
            </div>
            {formState.error.role && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.error.role}
              </p>
            )}
          </div>
          {formState.error.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {formState.error.submit}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={formState.loading}
            className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg py-3 font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {formState.loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Creating Account.....</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>

          <div className="text-center">
            <p className="text-gray-600">
              Already have an Account ?{" "}
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {" "}
                Login here !!
              </a>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SignUp;
