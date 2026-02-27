import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import { validateEmail } from "../../utils/helper";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [formState, setFormState] = useState({
    loading: false,
    error: {},
    showpassword: false,
    success: false,
  });

 
  const validatePassword = (password) => {
    if (!password.trim()) return "Password is required.";

    return "";
  };

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

  const validateForm = () => {
    const errors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
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
    } catch (error) {
      setFormState((prevState) => ({
        ...prevState,
        error: {
          submit:
            error.response?.data?.message ||
            "An error occurred. Please try again.",
        },
        loading: false,
      }));
    }
    // Simulate API call
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
            Welcome Back
          </h2>
          <p className="text-gray-600 mb-4">
            You have been successfully logged in
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md "
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Login to Your Account
          </h2>
          <p className="tetx-gray-600">
            Welcome back! Please enter your details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 tetx-gray-400 w-5 h-5" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${formState.error.email ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors `}
                placeholder="Enter your email"
              />
            </div>
            {formState.error.email && (
              <p className="text-red-500 mt-2 flex items-center text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.error.email}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 tetx-gray-400 w-5 h-5" />
              <input
                type={formState.showpassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${formState.error.password ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors `}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() =>
                  setFormState((prevState) => ({
                    ...prevState,
                    showpassword: !prevState.showpassword,
                  }))
                }
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {formState.showpassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
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
          <div className="flex items-center justify-between">
            {formState.error.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                </p>
              </div>
            )}
            {formState.success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-700 text-sm flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 inline-block mr-1" />
                </p>
              </div>
            )}
          </div>

          {/* <div className="">
            <label className="">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className=""
              />
              Remember me
            </label>
          </div> */}
          <button
            type="submit"
            className=" w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 "
            disabled={formState.loading}
          >
            {formState.loading ? (
              <>
                <Loader className="animate-spin w-5 h-5" />
                <span>Signing In....</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>

          <div className="text-center">
            <p className=" text-gray-600">
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign up
              </a>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
