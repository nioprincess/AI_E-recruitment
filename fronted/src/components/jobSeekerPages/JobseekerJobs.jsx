import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import logo1 from "../../../src/assets/images/ex_logo2.png";
import logo2 from "../../../src/assets/images/ex-logo3.png";
import logo3 from "../../../src/assets/images/ex-logo4.png";
import logo4 from "../../../src/assets/images/ex-logo5.png";
import logo5 from "../../../src/assets/images/ex-logo8.png";
import { Target } from "lucide-react";
import useUserAxios from "../../hooks/useUserAxios";

const ThemeContext = React.createContext();

// Job Dialog Component
const JobDialog = ({ job, isOpen, onClose }) => {
  if (!isOpen || !job) return null;

  const parseRequirements = (requirements) => {
    if (!requirements) return {};

    try {
      if (typeof requirements === "string") {
        return JSON.parse(requirements);
      }
      return requirements;
    } catch (error) {
      return { other: [requirements] };
    }
  };
  const axios = useUserAxios();
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return "Negotiable";

    const formatAmount = (amount) => {
      if (!amount) return "";
      return new Intl.NumberFormat("en-US").format(amount);
    };

    if (min && max) {
      return `${formatAmount(min)} - ${formatAmount(max)}`;
    }

    return min ? `From ${formatAmount(min)}` : `Up to ${formatAmount(max)}`;
  };
  const downloadFile = async (url, filename) => {
    try {
      const resp = await axios.get(url, { responseType: "blob" });

      if (resp.status < 400) {
        const url = window.URL.createObjectURL(new Blob([resp.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const requirements = parseRequirements(job.j_requirements);
  const requirementFields = Object.keys(requirements).filter(
    (key) => Array.isArray(requirements[key]) && requirements[key].length > 0
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start space-x-4">
            <img
              src={getCompanyLogo(job.company)}
              alt={`${job.company?.c_name || "Company"} logo`}
              className="w-16 h-16 rounded-full object-cover border border-gray-300 dark:border-gray-600"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {job.j_title || "Untitled Position"}
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                {job.company?.c_name || "Unknown Company"}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {job.j_location}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Job Details */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Employment Type
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {job.j_employement_type || "Not specified"}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Salary Range
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {formatSalary(job.j_salary_min, job.j_salary_max)}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Posted Date
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {formatDate(job.created_at)}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Application Deadline
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {formatDate(job.j_deadline)}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Status
              </h3>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  job.j_status === "active"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : job.j_status === "draft"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                }`}
              >
                {job.j_status?.toUpperCase() || "UNKNOWN"}
              </span>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Job Description
            </h3>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
              {job.j_description || "No description provided."}
            </p>
          </div>

          {/* Dynamic Requirements */}
          {requirementFields.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Requirements
              </h3>
              <div className="space-y-4">
                {requirementFields.map((field) => (
                  <div key={field}>
                    <h4 className="font-medium text-gray-900 dark:text-white capitalize">
                      {field.replace(/_/g, " ")}
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                      {requirements[field].map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attachments */}
          {job.attachments && job.attachments.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Attachments
              </h3>
              <div className="space-y-2">
                {job.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded">
                        <span className="text-blue-600 dark:text-blue-300 text-sm font-medium">
                          {attachment.f_type?.includes("pdf")
                            ? "PDF"
                            : attachment.f_type?.includes("image")
                            ? "IMG"
                            : attachment.f_type?.includes("word")
                            ? "DOC"
                            : "FILE"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {attachment.f_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {Math.round(attachment.f_size / 1024)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        downloadFile(
                          `${
                            import.meta.env.VITE_SERVER_URL
                          }/api/files/attachment/${attachment.id}`,
                          attachment.f_name
                        )
                      }
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Company Information */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Company Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Company Name
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {job.company?.c_admin?.c_name|| "N/A"}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Industry
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {job.company?.c_industry || "N/A"}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Email
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {job.company?.c_email || "N/A"}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Phone
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {job.company?.c_phone || "N/A"}
                </p>
              </div>
              <div className="md:col-span-2">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Description
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {job.company?.c_description || "No description available."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
            }}
            disabled={job.j_status !== "active"}
            className={`px-6 py-2 rounded-lg font-medium ${
              job.j_status === "active"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            }`}
          >
            {job.j_status === "active"
              ? "Apply Now"
              : "Not Accepting Applications"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to get company logo
const getCompanyLogo = (company) => {
  const logoMap = {
    1: logo1,
    2: logo2,
    3: logo3,
    4: logo4,
    5: logo5,
  };

  const companyId = company?.id;
  if (companyId && logoMap[companyId]) {
    return logoMap[companyId];
  }

  const nameMap = {
    TechCorp: logo1,
    DataSolutions: logo2,
    DesignHub: logo3,
    AIHub: logo4,
  };

  return nameMap[company?.c_name] || logo5;
};

const JobseekerJobs = () => {
  const { isDark } = useContext(ThemeContext) || { isDark: false };
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const axios = useUserAxios();

  // Mock user profile data (in a real app, this would come from backend/context)
  const userProfile = {
    preferredLocation: "Kigali, Rwanda",
    preferredJobType: "Full-Time",
    experienceLevel: "Mid",
    industry: "Technology",
  };

  const getJobs = async () => {
    try {
      setLoading(true);
      const resp = await axios.get("/api/jobs");
      if (resp.data.success) {
        setJobs(resp.data.data);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const openJobDialog = (job) => {
    setSelectedJob(job);
    setIsDialogOpen(true);
  };

  const closeJobDialog = () => {
    setIsDialogOpen(false);
    setSelectedJob(null);
  };

  const calculateTimeLeft = (deadline) => {
    if (!deadline) return "No deadline";

    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate - now;

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return `${days}d ${hours}h`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return "Negotiable";

    const formatAmount = (amount) => {
      if (!amount) return "";
      return new Intl.NumberFormat("en-US").format(amount);
    };

    if (min && max) {
      return `${formatAmount(min)} - ${formatAmount(max)}`;
    }

    return min ? `From ${formatAmount(min)}` : `Up to ${formatAmount(max)}`;
  };

  // Filter jobs based on user profile preferences
  const recommendedJobs = jobs
    .filter((job) => {
      const matchesLocation = job.j_location === userProfile.preferredLocation;
      const matchesJobType =
        job.j_employement_type === userProfile.preferredJobType;

      // Recommend jobs that match at least one preference
      return matchesLocation || matchesJobType;
    })
    .slice(0, 3); // Show top 3 recommendations

  const companies = [
    ...new Set(
      jobs.map((job) => job.company?.c_name|| "Unknown Company")
    ),
  ];
  const locations = [
    ...new Set(jobs.map((job) => job.j_location).filter(Boolean)),
  ];
  const jobTypes = [
    ...new Set(jobs.map((job) => job.j_employement_type).filter(Boolean)),
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.j_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.c_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesLocation =
      !locationFilter || job.j_location === locationFilter;
    const matchesJobType =
      !jobTypeFilter || job.j_employement_type === jobTypeFilter;
    const matchesCompany =
      !selectedCompany ||
      job.company?.c_name === selectedCompany;

    return matchesSearch && matchesLocation && matchesJobType && matchesCompany;
  });

  const showOnly = 6;
  const hasMore = filteredJobs.length > showOnly;
  const visibleJobs = filteredJobs.slice(0, showOnly);

  useEffect(() => {
    getJobs();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen mt-12 px-12 py-8 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-gray-600 dark:text-gray-400">
              Loading jobs...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen mt-12 px-12 py-8 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Recommended Jobs Section */}
          {recommendedJobs.length > 0 && (
            <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Recommended For You
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Based on your profile preferences
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 hover:shadow-xl 
                      transition-shadow duration-300 border border-gray-200 dark:border-gray-700 
                      cursor-pointer"
                    onClick={() => openJobDialog(job)}
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={getCompanyLogo(job.company)}
                        alt={`${
                          job.company?.c_name || "Company"
                        } logo`}
                        className="w-16 h-16 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {job.j_title || "Untitled Position"}
                          </h3>
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              job.j_status === "active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : job.j_status === "draft"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                            }`}
                          >
                            {job.j_status?.toUpperCase() || "UNKNOWN"}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-1">
                          {job.company?.c_name ||
                            "Unknown Company"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {job.j_location || "Location not specified"}
                        </p>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                          <div>
                            <span className="font-medium">Type: </span>
                            {job.j_employement_type || "Not specified"}
                          </div>
                          <div>
                            <span className="font-medium">Salary: </span>
                            {formatSalary(job.j_salary_min, job.j_salary_max)}
                          </div>
                          <div>
                            <span className="font-medium">Posted: </span>
                            {formatDate(job.created_at)}
                          </div>
                          <div>
                            <span className="font-medium">Deadline: </span>
                            {formatDate(job.j_deadline)}
                          </div>
                          <div className="col-span-2">
                            <span className="font-medium">Time Left: </span>
                            <span
                              className={`${
                                calculateTimeLeft(job.j_deadline) === "Expired"
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-green-600 dark:text-green-400"
                              }`}
                            >
                              {calculateTimeLeft(job.j_deadline)}
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openJobDialog(job);
                            }}
                            className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 
                              text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg 
                              transition-colors duration-300"
                          >
                            View Details
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/jobs/${job.id}`);
                            }}
                            disabled={job.j_status !== "active"}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors duration-300 ${
                              job.j_status === "active"
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Header and Filters */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6">
              Job Opportunities
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Search jobs or companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-1/2 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white 
                  text-gray-900 placeholder-gray-500"
              />
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full sm:w-1/4 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white 
                  text-gray-900"
              >
                <option value="">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <select
                value={jobTypeFilter}
                onChange={(e) => setJobTypeFilter(e.target.value)}
                className="w-full sm:w-1/4 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white 
                  text-gray-900"
              >
                <option value="">All Job Types</option>
                {jobTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Company Filter */}
          {companies.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Filter by Company
              </h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedCompany(null)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors 
                    ${
                      !selectedCompany
                        ? "bg-blue-100 text-black"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                    } 
                    hover:bg-blue-400 hover:text-black`}
                >
                  All Companies
                </button>
                {companies.map((company) => (
                  <button
                    key={company}
                    onClick={() => setSelectedCompany(company)}
                    className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors 
                      ${
                        selectedCompany === company
                          ? "bg-blue-100 text-black"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                      } 
                      hover:bg-blue-400 hover:text-black`}
                  >
                    {company}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Job Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 hover:shadow-xl 
                  transition-shadow duration-300 border border-gray-200 dark:border-gray-700 
                  cursor-pointer"
                onClick={() => openJobDialog(job)}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={getCompanyLogo(job.company)}
                    alt={`${
                      job.company?.c_name || "Company"
                    } logo`}
                    className="w-16 h-16 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {job.j_title || "Untitled Position"}
                      </h3>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          job.j_status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : job.j_status === "draft"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                        }`}
                      >
                        {job.j_status?.toUpperCase() || "UNKNOWN"}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-1">
                      {job.company?.c_name || "Unknown Company"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {job.j_location || "Location not specified"}
                    </p>

                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <div>
                        <span className="font-medium">Type: </span>
                        {job.j_employement_type || "Not specified"}
                      </div>
                      <div>
                        <span className="font-medium">Salary: </span>
                        {formatSalary(job.j_salary_min, job.j_salary_max)}
                      </div>
                      <div>
                        <span className="font-medium">Posted: </span>
                        {formatDate(job.created_at)}
                      </div>
                      <div>
                        <span className="font-medium">Deadline: </span>
                        {formatDate(job.j_deadline)}
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">Time Left: </span>
                        <span
                          className={`${
                            calculateTimeLeft(job.j_deadline) === "Expired"
                              ? "text-red-600 dark:text-red-400"
                              : "text-green-600 dark:text-green-400"
                          }`}
                        >
                          {calculateTimeLeft(job.j_deadline)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openJobDialog(job);
                        }}
                        className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 
                          text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg 
                          transition-colors duration-300"
                      >
                        View Details
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/jobs/${job.id}`);
                        }}
                        disabled={job.j_status !== "active"}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors duration-300 ${
                          job.j_status === "active"
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Jobs Message */}
          {filteredJobs.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 dark:text-gray-400">
                No jobs found matching your criteria.
              </p>
            </div>
          )}

          {/* See More Button */}
          {hasMore && (
            <div className="mt-10 text-center">
              <button
                onClick={() => navigate("/jobs")}
                className="inline-block px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 
                  hover:from-indigo-500 hover:to-purple-500 text-white font-semibold 
                  rounded-full transition-colors duration-300"
              >
                See More Jobs →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Job Dialog */}
      <JobDialog
        job={selectedJob}
        isOpen={isDialogOpen}
        onClose={closeJobDialog}
      />
    </>
  );
};

// Theme provider for app root
const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDark(prefersDark);
  }, []);
  return (
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { JobseekerJobs, ThemeProvider };
