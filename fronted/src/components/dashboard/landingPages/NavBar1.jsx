import React, { useState, useEffect } from "react";
import {
  MoonIcon,
  SunIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link as ScrollLink } from "react-scroll";

const Navbar1 = () => {
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const menuItems = [
    { label: "Explore Opportunities", to: "jobs" },
    { label: "For Employers", to: "employer" },
    { label: "About Us", to: "about" },
    { label: "Contact Us", to: "contact_us" },
  ];

  return (
    <nav className="bg-white mb-12 dark:bg-black-100 text-black dark:text-white px-6 py-3 shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <a href="/" className="no-underline">HireTrust</a>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          {menuItems.map((item) => (
            <ScrollLink
              key={item.label}
              to={item.to}
              smooth={true}
              duration={600}
              offset={-70} // adjust for navbar height
              className="cursor-pointer hover:bg-gray-200 dark:hover:text-black-100 px-3 py-2 rounded-md dark:text-gray-200"
            >
              {item.label}
            </ScrollLink>
          ))}

          {/* Sign Up */}
          <a
            href="/signup"
            className="px-4 py-2 border border-gray-900 dark:border-gray-300 rounded-full text-sm hover:bg-white hover:text-black dark:hover:bg-gray-100 dark:hover:text-black transition"
          >
            Sign Up
          </a>

          {/* Sign In */}
          <a
            href="/signin"
            className="px-4 py-2 bg-blue-300 dark:bg-white text-black font-semibold dark:text-gray-900 rounded-full text-sm hover:opacity-90 transition"
          >
            Sign In
          </a>

          {/* Theme toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            aria-label="Toggle Theme"
          >
            {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-1"
            aria-label="Toggle Theme"
          >
            {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1"
            aria-label="Toggle Menu"
          >
            {menuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col items-start gap-4 px-6 pb-4 text-sm">
          {menuItems.map((item) => (
            <ScrollLink
              key={item.label}
              to={item.to}
              smooth={true}
              duration={600}
              offset={-70}
              onClick={() => setMenuOpen(false)}
              className="cursor-pointer hover:underline dark:text-gray-200"
            >
              {item.label}
            </ScrollLink>
          ))}
          <a href="/signin" className="hover:underline dark:text-gray-300">
            Sign In
          </a>
          <a
            href="/signup"
            className="px-4 py-2 border rounded-full dark:text-white dark:border-white"
          >
            Sign Up
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar1;
