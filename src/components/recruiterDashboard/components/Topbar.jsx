import React, { useState } from 'react';
import { Menu, Bell, Search, Sun, Moon, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { useTheme } from '../components/ThemeContext';
import { Button } from '../ui/button';

const Topbar = ({ onMenuToggle, isSidebarOpen }) => {
  const { theme, toggleTheme } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="lg:hidden p-2 hover:bg-accent transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5 text-foreground" />
        </Button>
        
        {/* Logo for mobile */}
        <div className="lg:hidden flex items-center space-x-2">
          <div className="w-18 h-8 rounded-lg bg-gradient-to-br  from-blue-500 to-blue-600 flex items-center justify-center">
            <span className="text-white w-full font-bold text-sm">HireTrust</span>
          </div>
          <span className="text-lg font-bold text-foreground dark:text-white">Recruiter</span>
        </div>
        
        {/* Search Bar */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground dark:text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search jobs, candidates..."
            className="pl-10 pr-4 py-2 w-80 border border-input dark:border-gray-600 rounded-lg bg-background dark:bg-gray-800 text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="p-2 hover:bg-accent transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5 text-foreground dark:text-white" />
          ) : (
            <Sun className="h-5 w-5 text-foreground dark:text-white" />
          )}
        </Button>

        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative p-2 hover:bg-accent transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-foreground dark:text-white" />
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center border-2 border-card dark:border-gray-800">
            3
          </span>
        </Button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent dark:hover:bg-gray-700 transition-colors group"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground dark:text-white text-left">John Doe</p>
              <p className="text-xs text-muted-foreground dark:text-gray-400">Senior Recruiter</p>
            </div>
            
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-200">
                <span className="text-sm font-medium text-white">JD</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-card dark:border-gray-800"></div>
            </div>
            
            <ChevronDown className={`h-4 w-4 text-muted-foreground dark:text-gray-400 transition-transform duration-200 ${
              isProfileOpen ? 'rotate-180' : ''
            }`} />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-card dark:bg-gray-800 border border-border dark:border-gray-700 rounded-lg shadow-lg py-2 z-50 backdrop-blur-sm">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-border dark:border-gray-700">
                <p className="text-sm font-medium text-foreground dark:text-white">John Doe</p>
                <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">john.doe@company.com</p>
              </div>
              
              {/* Menu Items */}
              <div className="py-1">
                <button className="w-full flex items-center space-x-3 px-4 py-2 text-foreground dark:text-white hover:bg-accent dark:hover:bg-gray-700 transition-colors">
                  <User className="h-4 w-4" />
                  <span className="text-sm">My Profile</span>
                </button>
                
                <button className="w-full flex items-center space-x-3 px-4 py-2 text-foreground dark:text-white hover:bg-accent dark:hover:bg-gray-700 transition-colors">
                  <Settings className="h-4 w-4" />
                  <span className="text-sm">Settings</span>
                </button>
              </div>
              
              {/* Separator */}
              <div className="border-t border-border dark:border-gray-700 my-1"></div>
              
              {/* Sign Out */}
              <div className="py-1">
                <button className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {isProfileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </header>
  );
};

export default Topbar;