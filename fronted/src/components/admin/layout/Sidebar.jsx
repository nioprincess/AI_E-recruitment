import React from "react";
import { Home, Users, Briefcase,Slack,Sheet, FileText, Settings, LogOut, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const menu = [
    { name: "Dashboard", icon: <Home size={18} />, path: "/admin" },
    { name: "Users", icon: <Users size={18} />, path: "/admin/users" },
    { name: "Jobs", icon: <Briefcase size={18} />, path: "/admin/jobs" },
    { name: "Applications", icon: <FileText size={18} />, path: "/admin/applications" },
    { name: "Reports", icon: <Sheet size={18} />, path: "/admin/reports" },
    { name: "Settings", icon: <Settings size={18} />, path: "/admin/settings" },
  ];

const handleNavigation = (path) => {
    navigate(path);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          {/* Header with Close Button (mobile only) */}
<div className="flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Slack className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800 dark:text-white">Admin Panel</span>
            </div>
            {/* Close Button - Mobile Only */}
            <button
              onClick={onClose}
              className="md:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-1">
            {menu.map((item, idx) => {
              const active = isActive(item.path);
              return (
                <button
                  key={idx}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-200
                    group relative overflow-hidden
                    ${active
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  {/* Active indicator bar */}
                  {active && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full" />
                  )}
                  
                  <div className={`
                    transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}
                  `}>
                    {item.icon}
                  </div>
                  
                  <span className="font-medium transition-all duration-200">
                    {item.name}
                  </span>
                  
                  {/* Hover effect background */}
                  <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-200 rounded-md" />
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button className="
              w-full flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-200
              text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700
              group relative overflow-hidden
            ">
              <LogOut className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
              <span className="font-medium">Logout</span>
              
              {/* Hover effect background */}
              <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-10 transition-opacity duration-200 rounded-md" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;


