import React from "react";
import "./index.css";

// Landing Pages
import Hero from "./components/dashboard/landingPages/Hero";
import Footer from "./components/dashboard/landingPages/Footer";
import Employer from "./components/dashboard/landingPages/employer";
import AboutUs from "./components/dashboard/landingPages/AboutUs";
import LandingNavbar from "./components/dashboard/landingPages/NavBar1";

// Auth Pages
import SignIn from "./components/dashboard/auth/SignIn";
import SignUp from "./components/dashboard/auth/SignUp";
import ForgotPassword from "./components/dashboard/auth/ForgotPassword";
import EmailVerification from "./components/dashboard/auth/EmailVerification";

// User Pages
import ProfileSetup from "./components/jobSeekerPages/ProfileSetup";
import MyProfile from "./components/jobSeekerPages/MyProfile";
import UserNavbar from "./components/jobSeekerPages/Navbar1";
import Notifications from "./components/jobSeekerPages/Notification";
import Applications from "./components/jobSeekerPages/MyApplication";
import ViewNotification from "./components/jobSeekerPages/ViewNotification";

// Jobs Section
import { Jobs } from "./components/dashboard/landingPages/Jobs";
import JobDescription from "./components/dashboard/landingPages/JobDescription";
import ApplyJob from "./components/jobSeekerPages/ApplyJob";

// Recruiter Dashboard Components
import DashboardLayout from "./components/recruiterDashboard/components/DashboardLayout";
import DashboardOverview from "./components/recruiterDashboard/components/DashboardOverview";
import JobManagement from "./components/recruiterDashboard/components/JobManagement";
import ApplicationsManagement from "./components/recruiterDashboard/components/Applications";
import ExamManagement from "./components/recruiterDashboard/components/ExamManagement";
import RecruiterProfile from "./components/recruiterDashboard/components/RecruiterProfile";

// Theme Provider
import { ThemeProvider } from "./components/recruiterDashboard/components/ThemeContext";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";

// ✅ Public landing content
const FullLandingPage = () => (
  <>
    <Hero />
    <Jobs />
    <Employer />
    <AboutUs />
  </>
);

// ✅ Simple recruiter test page
const TestRecruiterPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
      Recruiter Dashboard Test
    </h1>
    <p className="text-gray-600 dark:text-gray-400">
      If you can see this, the recruiter dashboard routing is working!
    </p>
  </div>
);

// ✅ Layout manager with dynamic NavBar
const Layout = ({ children }) => {
  const location = useLocation();

  const hideLayout = ["/signin", "/signup", "/forgot-password"].includes(
    location.pathname
  );
  const isRecruiterRoute = location.pathname.startsWith("/recruiter");
  const showUserNavbar = !hideLayout && !isRecruiterRoute;

  return (
    <>
      {!hideLayout && !isRecruiterRoute && (
        showUserNavbar ? <UserNavbar /> : <LandingNavbar />
      )}
      <main>{children}</main>
      {!hideLayout && !isRecruiterRoute && <Footer />}
    </>
  );
};

// ✅ Main route definitions (NO auth checks)
const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<FullLandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/employer" element={<Employer />} />
        <Route path="/about" element={<AboutUs />} />

        {/* Job Seeker Routes */}
        <Route path="/home" element={<div>Jobseeker Home 🎉</div>} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/jobs/:id" element={<JobDescription />} />
        <Route path="/apply/:id" element={<ApplyJob />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/my-applications" element={<Applications />} />
        <Route path="/notifications/:id" element={<ViewNotification />} />

        {/* Recruiter Dashboard Routes */}
        <Route
          path="/recruiter/dashboard"
          element={<DashboardLayout><DashboardOverview /></DashboardLayout>}
        />
        <Route
          path="/recruiter/jobs"
          element={<DashboardLayout><JobManagement /></DashboardLayout>}
        />
        <Route path="/recruiter/applications" element={<DashboardLayout><ApplicationsManagement /></DashboardLayout>} />
        <Route path="/recruiter/exams" element={<DashboardLayout><ExamManagement /></DashboardLayout>} />
        <Route path="/recruiter/profile" element={<DashboardLayout><RecruiterProfile /></DashboardLayout>} />
        

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <div className="App">
      <Router>
        <ThemeProvider>
          <AppRoutes />
        </ThemeProvider>
      </Router>
    </div>
  );
}

export default App;
