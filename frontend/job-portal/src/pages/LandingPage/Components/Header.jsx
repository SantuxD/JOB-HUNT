import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Briefcase } from "lucide-react";

const Header = () => {
  const isAuthenticated = true;
  const user = {
    fullName: "John Doe",
    role: "Admin",
  };
  const navigate = useNavigate();
  return (
    <header>
      <div className="container mx-auto px-4 ">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3 ">
            <div className="w-8 h-8 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">JobVerse</span>
          </div>
          <nav className="hidden md:flex space-x-8 items-center">
            <a
              onClick={() => navigate("/find-jobs")}
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Find Jobs
            </a>

            <a
              onClick={() =>
                navigate(
                  isAuthenticated && user?.role === "admin"
                    ? "/admin-dashboard"
                    : "/login",
                )
              }
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              For Admin
            </a>
          </nav>
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-gray-700">Welcome, {user.fullName}</span>
                <a
                  href={
                    user?.role === "admin" ? "/admin-dashboard" : "/find-jobs"
                  }
                  className="bg-linear-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-sm hover:shadow-md"
                >
                  Dashboard
                </a>
              </div>
            ) : (
              <>
                <a
                  href="/login"
                  className="text-gray-600 hover:text-gray-900 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-gray-500 "
                >
                  Login
                </a>
                <a
                  href="/signup"
                  className="bg-linear-to-r from-blue-600 to purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Register
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
