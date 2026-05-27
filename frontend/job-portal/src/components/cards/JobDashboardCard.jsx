import { Briefcase, MapPin, Calendar } from "lucide-react";
import moment from "moment";
const JobDashboardCard = ({ job }) => {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
          <Briefcase className="h-5 w-5 text-blue-600 " />
        </div>
        <div>
          <h4 className="text-[15px] font-medium text-gray-900">{job.title}</h4>
          <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
            <span className="flex items-center">
              <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" />
              {job.location || job.loaction}
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400" />
              {moment(job.createdAt)?.format("Do MMM YYYY")}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${
            !job.isClosed
              ? "bg-green-100 text-green-700 "
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {job.isClosed ? "closed" : "Active"}
        </span>
      </div>
    </div>
  );
};

export default JobDashboardCard;
