import React from 'react';
import './index.css';

// Landing Pages
import Hero from './components/dashboard/landingPages/Hero';
import Footer from './components/dashboard/landingPages/Footer';
import Employer from './components/dashboard/landingPages/employer';
import AboutUs from './components/dashboard/landingPages/AboutUs';
import LandingNavbar from './components/dashboard/landingPages/NavBar1';

// Auth Pages
import SignIn from './components/dashboard/auth/SignIn';
import SignUp from './components/dashboard/auth/SignUp';
import ForgotPassword from './components/dashboard/auth/ForgotPassword';
import EmailVerification from './components/dashboard/auth/EmailVerification';

// User Pages
import ProfileSetup from './components/jobSeekerPages/ProfileSetup';
import MyProfile from './components/jobSeekerPages/MyProfile';
import UserNavbar from './components/jobSeekerPages/Navbar1';
import Notifications from './components/jobSeekerPages/Notification';
import Applications from './components/jobSeekerPages/MyApplication';

// Jobs Section
import { Jobs, ThemeProvider } from './components/dashboard/landingPages/Jobs';
import JobDescription from "./components/dashboard/landingPages/JobDescription";
import ApplyJob from "./components/jobSeekerPages/ApplyJob";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from 'react-router-dom';

// ✅ Simulated auth check (replace with real auth logic)
const useAuth = () => {
  const user = localStorage.getItem("user");
  const profileCompleted = localStorage.getItem("profileCompleted") === "true";
  return { isLoggedIn: !!user, profileCompleted };
};

// ✅ Public landing content
const FullLandingPage = () => (
  <>
    <Hero />
    <Jobs />
    <Employer />
    <AboutUs />
  </>
);

// ✅ Logged-in home page content
const UserLandingPage = () => (
  <div className="min-h-screen flex items-center dark:bg-black-100 justify-center text-center text-lg font-medium">
    <p>Welcome to your personalized dashboard 🎉</p>
  </div>
);

// ✅ Layout manager with dynamic NavBar
const Layout = ({ children }) => {
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  const hideLayout = ['/signin', '/signup', '/forgot-password'].includes(location.pathname);
  const showUserNavbar = isLoggedIn && !hideLayout;

  return (
    <>
      {!hideLayout && (showUserNavbar ? <UserNavbar /> : <LandingNavbar />)}
      <main>{children}</main>
      {!hideLayout && <Footer />}
    </>
  );
};

// ✅ Main route definitions
const AppRoutes = () => {
  const { isLoggedIn, profileCompleted } = useAuth();

  return (
    <Layout>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/" /> : <FullLandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<EmailVerification />} />

        <Route path="/jobs" element={<Jobs />} />
        <Route path="/employer" element={<Employer />} />
        <Route path="/about" element={<AboutUs />} />

        {/* Protected Routes */}
        <Route path="/home" element={isLoggedIn ? <UserLandingPage /> : <Navigate to="/signin" />} />
        <Route path="/profile-setup" element={isLoggedIn ? <ProfileSetup /> : <Navigate to="/signin" />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/jobs/:id" element={<JobDescription />} />
        <Route path="/apply/:id" element={<ApplyJob />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/my-applications" element={<Applications />} />
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
