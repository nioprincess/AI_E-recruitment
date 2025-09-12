import React from "react";
import "./index.css";

// Landing Pages
import Hero from "./components/dashboard/landingPages/Hero";
import Footer from "./components/dashboard/landingPages/Footer";
import Employer from "./components/dashboard/landingPages/employer";
import AboutUs from "./components/dashboard/landingPages/AboutUs";
import LandingNavbar from "./components/dashboard/landingPages/NavBar1";
import ContactUs from "./components/dashboard/landingPages/Contact_us";

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
import JobSeekerLayout from "./components/jobSeekerPages/JobseekerLayout";  

// Jobs Section
import { Jobs } from "./components/dashboard/landingPages/Jobs";
import {JobseekerJobs} from "./components/jobSeekerPages/JobseekerJobs";
import JobDescription from "./components/dashboard/landingPages/JobDescription";
import ApplyJob from "./components/jobSeekerPages/ApplyJob";

// Recruiter Dashboard Components
import DashboardLayout from "./components/recruiterDashboard/components/DashboardLayout";
import DashboardOverview from "./components/recruiterDashboard/components/DashboardOverview";
import JobManagement from "./components/recruiterDashboard/components/JobManagement";
import ApplicationsManagement from "./components/recruiterDashboard/components/Applications";
import ExamManagement from "./components/recruiterDashboard/components/ExamManagement";
import RecruiterProfile from "./components/recruiterDashboard/components/RecruiterProfile";
import RecruiterReports from "./components/recruiterDashboard/components/Reports";

// Admin Dashboard Components
import AdminLayout from "./components/admin/layout/AdminLayout";
import Overview from "./components/admin/dashboard/OverView";
import UserManagement from "./components/admin/manage_users/UserManagement";
import JobManagementAdmin from "./components/admin/jobs/JobManagement";
import ApplicationManagementAdmin from "./components/admin/applications/ApplicationManagement";
import Reports from "./components/admin/reports/Reports";
import Settings from "./components/admin/settings/Settings";

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
    <LandingNavbar />
    <Hero />
    <Jobs />
    <Employer />
    <AboutUs />
    <ContactUs />
    <Footer />
    
    
  </>
);

const JobSeekerHome = () => (
  <>
  <Hero className="w-full" />
  <Jobs />
  </>

);

// ✅ Layout manager with dynamic NavBar
const Layout = ({ children }) => {
  const location = useLocation();

  const hideLayout = ["/signin", "/signup", "/forgot-password"].includes(
    location.pathname
  );
  const isRecruiterRoute = location.pathname.startsWith("/recruiter");
  const isAdminRoute = location.pathname.startsWith("/admin");

  const showUserNavbar = !hideLayout && !isRecruiterRoute && !isAdminRoute;

  return (
    <>
      
      
      <main>{children}</main>
      
    </>
  );
};

// ✅ Main route definitions
const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<FullLandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/employer" element={<Employer />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact_us" element={<ContactUs />} />

        {/* Job Seeker Routes */}
        <Route path="/home" element={<JobSeekerLayout><JobSeekerHome /></JobSeekerLayout>} />
        <Route path="/profile-setup" element={<JobSeekerLayout><ProfileSetup /></JobSeekerLayout>} />
        <Route path="/my-profile" element={<JobSeekerLayout><MyProfile /></JobSeekerLayout>} />
        <Route path="/jobs/:id" element={<JobSeekerLayout><JobDescription /></JobSeekerLayout>} />
        <Route path="/jobs-for-you" element={<JobSeekerLayout><JobseekerJobs /></JobSeekerLayout>} />
        <Route path="/apply/:id" element={<JobSeekerLayout><ApplyJob /></JobSeekerLayout>} />
        <Route path="/notifications" element={<JobSeekerLayout><Notifications /></JobSeekerLayout>} />
        <Route path="/my-applications" element={<JobSeekerLayout><Applications /></JobSeekerLayout>} />
        <Route path="/notifications/:id" element={<JobSeekerLayout><ViewNotification /></JobSeekerLayout>} />

        {/* Recruiter Dashboard Routes */}
        <Route path="/recruiter/dashboard" element={<DashboardLayout><DashboardOverview /></DashboardLayout>}/>
        <Route path="/recruiter/jobs" element={<DashboardLayout><JobManagement /></DashboardLayout>}/>
        <Route path="/recruiter/applications" element={<DashboardLayout><ApplicationsManagement /></DashboardLayout>}/>
        <Route path="/recruiter/exams" element={<DashboardLayout><ExamManagement /></DashboardLayout>}/>
        <Route path="/recruiter/profile" element={<DashboardLayout><RecruiterProfile /></DashboardLayout>}/>
        <Route path="/recruiter/reports" element={<DashboardLayout><RecruiterReports /></DashboardLayout>}/>

        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={<AdminLayout><Overview /></AdminLayout>} />
        <Route path="/admin/users/" element={<AdminLayout><UserManagement /></AdminLayout>} />  
        <Route path="/admin/jobs" element={<AdminLayout><JobManagementAdmin /></AdminLayout>} />
        <Route path="/admin/applications" element={<AdminLayout><ApplicationManagementAdmin /></AdminLayout>} />
        <Route path="/admin/reports" element={<AdminLayout><Reports /></AdminLayout>} />
        <Route path="/admin/settings" element={<AdminLayout><Settings /></AdminLayout>} /> 

      
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
