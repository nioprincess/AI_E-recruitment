import React from "react";
import UserNavbar from "./Navbar1";  // ✅ Your jobseeker navbar
import Footer from "../jobSeekerPages/Footer1"; // ✅ Reuse existing footer

const JobSeekerLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Navbar */}
      <UserNavbar />

      {/* Main content */}
      <main className="flex-1 w-full max-w-7xl mx-auto ">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default JobSeekerLayout;
