import { Briefcase } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-gray-50 text-gray-900 overflow-hidden">
      <div className="relative z-10 px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className=" flex items-center justify-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold  text-gray-800">JobVerse</h3>
              </div>
              <p
                className={`text-sm text-gray-800 max-w-2xl mx-auto leading-relaxed`}
              >
                Connecting talent with opportunity. Your next career move starts
                here.
              </p>
            </div>
            <div className="space-y-2">
              <p className={`text-sm text-gray-600`}>
                &copy; {new Date().getFullYear()} JobHunt. All rights reserved.
              </p>
              <p className={`text-xs text-gray-500`}>
                Made By <span className="">Santu</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
