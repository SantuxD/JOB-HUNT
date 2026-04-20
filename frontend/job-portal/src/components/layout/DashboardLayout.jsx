import { useState, useEffect, use } from "react";
import { Briefcase, Building2, LogOut, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { NAVIGATION_MENU } from "../../utils/data";
const DashboardLayout = ({ activeMenu }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState(activeMenu || "dashboard");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const NavigationItem = ({ item, isActive, onClick, collapsed }) => {
    const Icon = item.icon;

    return (
      <button
        onClick={() => onClick(item.id)}
        className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg  transition-all duration-200 group ${isActive ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-50" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
      >
        <Icon
          className={`w-5 h-5 shrink-0 ${isActive ? "text-blue-600" : "text-gray-500"}`}
        />

        {!collapsed && <span className="ml-3 truncate">{item.name}</span>}
      </button>
    );
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownOpen) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [profileDropdownOpen]);

  const handleNavigation = (itemId) => {
    setActiveNavItem(itemId);
    navigate(`/${itemId}`);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const sidebarCollapse = !isMobile && false;

  return (
    <div className="flex h-screen bg-gray-50">
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 transform ${isMobile
            ? sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
          } ${sidebarCollapse ? "w-20" : "w-64"} bg-white border-r border-gray-200 shadow-lg`}
      >
        <div className="flex items-center h-16 border-b border-gray-200 pl-6">
          {!sidebarCollapse ? (
            <Link className="flex items-center space-x-3" to="/">
              <div className="h-8 w-8 bg-linear-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-gray-900 font-bold text-xl">JobVerse</span>
            </Link>
          ) : (
            <div className="h-8 w-8 bg-linear-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        <nav className="p-4 space-y-2">
          {NAVIGATION_MENU.map((item) => (
            <NavigationItem
              key={item.id}
              item={item}
              isActive={activeNavItem === item.id}
              onClick={() => handleNavigation}
              collapsed={sidebarCollapse}
            />
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200  "
            onClick={logout}
          >
            <LogOut className="w-5 h-5 shrink-0 text-gray-500" />
            {!sidebarCollapse && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
