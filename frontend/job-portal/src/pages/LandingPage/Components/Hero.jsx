import { motion } from "framer-motion";
import { Search, ArrowRight, Users, Building2, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const isAuthenticated = true;
  const user = {
    fullName: "John Doe",
    role: "Admin",
  };
  const stats = [
    {
      icon: Users,
      value: "2.5M+",
      label: "Active Users",
    },
    {
      icon: Building2,
      value: "500K+",
      label: "Companies",
    },
    {
      icon: TrendingUp,
      value: "1M+",
      label: "Jobs Posted",
    },
  ];
  const navigate = useNavigate();
  return (
    <section className="bg-white pb-16 pt-24 min-h-screen flex items-center">
      <div className="container mx-auto px-4 ">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl  lg:text-6xl font-bold text-gray-900 mb-6 pt-10"
          >
            Find Your Dream Job or
            <span className="block bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2 ">
              {" "}
              Hire Top Talent
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Join millions of job seekers and employers on JobVerse, the ultimate
            job portal for finding your next opportunity or hiring top talent.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center items-center mb-16 gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/find-jobs")}
              className="group bg-linear-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2 text-lg"
            >
              <Search className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <span>Find Jobs</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                navigate(
                  isAuthenticated && user?.role === "admin"
                    ? "/admin-dashboard"
                    : "/login",
                )
              }
              className="bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg  hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md flex items-center "
            >
              {/* <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform " /> */}
              <span>Post a Job</span>
            </motion.button>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                className="rounded-xl  shadow p-4 flex flex-col items-center space-y-2 hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 bg-linear-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mb-2 ">
                  <stat.icon className="w-6 h-6 text-blue-600 " />
                </div>

                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-30  "></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-r from-blue-50 to purple-50 rounded-full blur-3xl opacity-20  "></div>
      </div>
    </section>
  );
};

export default Hero;
