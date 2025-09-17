import React, { useState, useEffect, useRef } from "react";
import {
  MoonIcon,
  SunIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import useUser from "../../hooks/useUser";

const Navbar1 = () => {
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user= useUser()

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Toggle dark mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Check if user is logged in
  useEffect(() => {
     console.log(user)
    setIsLoggedIn(user.user_id);
  }, []);

 

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { label: "Explore Opportunities", href: "/jobs-for-you" },
    { label: "My Applications", href: "/my-applications" },
    { label: "Notifications", href: "/notifications" },
  ];

  const profilePicture =
    `https://ui-avatars.com/api/?name=${user.firstname +" "+user.middlename+ " "+ user.lastname}&background=random`;

  return (
    <nav className="bg-white dark:bg-black-100 text-black dark:text-white px-6 py-3 shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link to="/" className="no-underline">
            HireTrust
          </Link>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="hover:bg-gray-200 dark:hover:text-black-100 px-3 py-2 rounded-md dark:text-gray-200"
            >
              {item.label}
            </Link>
          ))}

          {/* ✅ If logged in → show dropdown */}
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <img
                src={profilePicture}
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-300"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border dark:border-gray-700 z-50">
                  <Link
                    to="/my-profile"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setDropdownOpen(false)}
                  >
                    View Profile
                  </Link>
                  <Link
                    to="/profile-setup"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Complete Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Settings
                  </Link>
                  <Link
                    to={"/logout"}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Logout
                  </Link>
                </div>
              )}
            </div>
          ) : (
            // ✅ If NOT logged in → show Sign In / Sign Up
            <div className="flex items-center gap-4">
              <Link
                to="/signin"
                className="hover:underline dark:text-gray-300"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 border bg-blue-100 rounded-full dark:text-white dark:border-white"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Dark mode toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <SunIcon className="w-5 h-5" />
            ) : (
              <MoonIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-1"
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <SunIcon className="w-5 h-5" />
            ) : (
              <MoonIcon className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1"
            aria-label="Toggle Menu"
          >
            {menuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col items-start gap-4 px-6 pb-4 text-sm">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="hover:underline dark:text-gray-200"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {isLoggedIn ? (
            <>
              <Link
                to="/my-profile"
                className="hover:underline dark:text-gray-200"
                onClick={() => setMenuOpen(false)}
              >
                View Profile
              </Link>
              <Link
                to="/profile-setup"
                className="hover:underline dark:text-gray-200"
                onClick={() => setMenuOpen(false)}
              >
                Complete Profile
              </Link>
              <Link
                to="/settings"
                className="hover:underline dark:text-gray-200"
                onClick={() => setMenuOpen(false)}
              >
                Settings
              </Link>
              <Link
                 to={"/logout"}
                className="text-red-600 dark:text-red-400"
              >
                Logout
              </Link>
            </>
          ) : (
            <>
             <Link
                to="/signin"
                className="hover:underline dark:text-gray-300"
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 border border-[1px solid to-black-100] rounded-full dark:text-white dark:border-white"
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar1;
