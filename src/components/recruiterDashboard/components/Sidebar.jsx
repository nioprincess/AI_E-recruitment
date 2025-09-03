import React from 'react';
import { 
  Home, 
  Briefcase, 
  Users, 
  FileText, 
  ClipboardList,
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const menuItems = [
  { id: 'overview', label: 'Overview', icon: Home, path: '/recruiter/dashboard' },
  { id: 'jobs', label: 'Job Management', icon: Briefcase, path: '/recruiter/jobs' },
  { id: 'applications', label: 'Applications', icon: Users, path: '/recruiter/applications' },
  { id: 'exams', label: 'Exams & Interviews', icon: ClipboardList, path: '/recruiter/exams' },
  { id: 'profile', label: 'Profile', icon: Settings, path: '/recruiter/profile' },
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

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
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg lg:shadow-none
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          {/* Header with Close Button (mobile only) */}
          <div className="flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800 dark:text-white">Recruiter</span>
            </div>
            
            {/* Close Button - Mobile Only */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {menuItems.map((item) => {
              const active = isActive(item.path);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                    group relative overflow-hidden
                    ${active
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  {/* Active indicator bar */}
                  {active && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
                  )}
                  
                  <item.icon className={`w-5 h-5 transition-transform duration-200 ${
                    active ? 'scale-110' : 'group-hover:scale-110'
                  }`} />
                  
                  <span className="font-medium transition-all duration-200">
                    {item.label}
                  </span>
                  
                  {/* Hover effect background */}
                  <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-200 rounded-lg" />
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button className="
              w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
              text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700
              group relative overflow-hidden
            ">
              <LogOut className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              <span className="font-medium">Logout</span>
              
              {/* Hover effect background */}
              <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-10 transition-opacity duration-200 rounded-lg" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;