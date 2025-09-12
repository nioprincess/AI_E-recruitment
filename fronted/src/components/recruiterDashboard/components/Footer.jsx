import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-300 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 p-4 text-center">
      © {new Date().getFullYear()}  Hiretrust Recruiter Panel. All rights reserved.
    </footer>
  );
};

export default Footer;
