import { motion } from "framer-motion";
import { TrendingUp, Users, Briefcase, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Analytics = () => {
  const stats = [
    {
      icon: Users,
      title: "Active Users",
      value: "2.5M+",
      growth: "+15% MOM",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Briefcase,
      title: "Jobs Posted",
      value: "1M+",
      growth: "+10% MOM",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Target,
      title: "Successful Hires",
      value: "500K+",
      growth: "+20% MOM ",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: TrendingUp,
      title: "Match Rate",
      value: "94%",
      growth: "+5% MOM ",
      color: "bg-orange-100 text-orange-600",
    },
  ];
  const navigate = useNavigate();

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Impact in Numbers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              See how JobVerse is transforming the job market with our
              impressive stats and growth.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`p-6 rounded-2xl shadow-lg ${stat.color} flex items-center space-x-4`}
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700">
                    {stat.title}
                  </h4>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p
                    className={`text-sm font-medium ${stat.growth.includes("+") ? "text-green-600" : "text-red-600"}`}
                  >
                    {stat.growth}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Join the JobVerse Revolution
          </h3>
          <p className="text-lg text-gray-600 mb-6">
            Be part of the millions of job seekers and employers who are
            experiencing the future of recruitment with JobVerse.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-linear-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            onClick={() => navigate("/signup")}
          >
            Get Started
          </motion.button>
        </div>
      </div>
      <div className="container mx-auto px-4 py-16 ">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose JobVerse?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our platform is designed to connect job seekers and employers in the
            most efficient and effective way possible. With our powerful
            features and user-friendly interface, we are revolutionizing the job
            search experience.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="p-6 rounded-2xl shadow-lg bg-blue-100 flex items-center space-x-4"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700">
                Vast Talent Pool
              </h4>
              <p className="text-lg font-bold text-gray-900">
                Access millions of qualified candidates and job opportunities.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="p-6 rounded-2xl shadow-lg bg-green-100 flex items-center space-x-4"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700">
                User-Friendly Interface
              </h4>
              <p className="text-lg font-bold text-gray-900">
                Navigate our intuitive platform with ease and efficiency.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="p-6 rounded-2xl shadow-lg bg-purple-100 flex items-center space-x-4"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700">
                Advanced Matching Algorithm
              </h4>
              <p className="text-lg font-bold text-gray-900">
                Connect with the most relevant job opportunities and candidates.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="p-6 rounded-2xl shadow-lg bg-orange-100 flex items-center space-x-4"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700">
                Real-Time Analytics
              </h4>
              <p className="text-lg font-bold text-gray-900">
                Gain insights into your job search and hiring process with our
                analytics dashboard.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Analytics;
