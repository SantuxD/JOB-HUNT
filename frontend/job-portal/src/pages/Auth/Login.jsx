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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const validatePassword = (password) => {};
  const handleInputChange = (e) => {};
  const validateForm = () => {};
  const handleSubmit = async (e) => {};
  return (
    <div className="">
            <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className=""
        >
          <div className="">
            <h2 className="">Login to Your Account</h2>
            <p className="">Welcome back! Please enter your details.</p>
            </div>

            <form onSubmit={handleSubmit} className="">
              <div>
                <label htmlFor="email" className="">Email address</label>
                <div className="">
                  <Mail className="" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${formState.error.email ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:boreder-transparent transition-colors `}
                    placeholder="Eneter your email"
                  />
                </div>
                {formState.error.email && (
                  <p className="">
                    <AlertCircle className=""/>
                    {formState.error.email}</p>
                )}
              </div>
              
            </form>

          </div>
        </motion.div>
    </div>

  )
};

export default Login;
