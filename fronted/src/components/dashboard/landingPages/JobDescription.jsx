import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import logo1 from "../../../assets/images/ex-logo1.png";
import logo2 from "../../../assets/images/ex-logo3.png";
import logo3 from "../../../assets/images/ex-logo4.png";
import logo4 from "../../../assets/images/ex-logo5.png";
import logo5 from "../../../assets/images/ex-logo8.png";
import useUserAxios from "../../../hooks/useUserAxios";
import { UploadCloud, Download, Building, MapPin, Calendar, Clock, DollarSign, User, Mail, Phone, Globe, FileText, CheckCircle, AlertCircle } from "lucide-react";

const JobDescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [notes, setNotes] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [applyError, setApplyError] = useState("");
  const axios = useUserAxios();

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
      console.log("Download error:", error);
    }
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

    return nameMap[company?.c_admin?.u_first_name] || logo5;
  };

  // Parse requirements if they're in JSON format
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
      return `RWF ${formatAmount(min)} - ${formatAmount(max)}`;
    }
    return min ? `From RWF ${formatAmount(min)}` : `Up to RWF ${formatAmount(max)}`;
  };

  const getTimeRemaining = (deadline) => {
    if (!deadline) return null;
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: "Expired", color: "text-red-500" };
    if (diffDays === 0) return { text: "Today", color: "text-orange-500" };
    if (diffDays === 1) return { text: "Tomorrow", color: "text-orange-500" };
    if (diffDays <= 7) return { text: `${diffDays} days left`, color: "text-orange-500" };
    return { text: `${diffDays} days left`, color: "text-green-500" };
  };

  const getJob = async () => {
    try {
      setLoading(true);
      setError(null);
      const resp = await axios.get(`/api/jobs/${id}`);
      if (resp.data.success) {
        setJob(resp.data.data);
      } else {
        setError("Failed to fetch job details");
      }
    } catch (error) {
      console.error("Error fetching job:", error);
      setError("Error loading job details");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!selectedFile) {
      setApplyError("Please upload a cover letter");
      return;
    }

    try {
      setIsApplying(true);
      setApplyError("");
      const formData = new FormData();
      formData.append("a_cover_letter", selectedFile);
      formData.append("notes", notes);

      const resp = await axios.post(
        `/api/jobs/${id}/submit-applications/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (resp.data.success) {
        navigate("/my-applications", { 
          state: { 
            message: "Application submitted successfully!",
            type: "success"
          }
        });
      }
    } catch (error) {
      console.error("Application error:", error);
      setApplyError(error.response?.data?.message || "Failed to submit application. Please try again.");
    } finally {
      setIsApplying(false);
    }
  };

  useEffect(() => {
    getJob();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            </div>
            <div className="text-center mb-8">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
            </div>
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {error || "Job Not Found"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error ? "We encountered an error loading the job details." : "The job you're looking for doesn't exist or has been removed."}
            </p>
            <div className="space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={() => navigate("/jobs")}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                Browse Jobs
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const requirements = parseRequirements(job.j_requirements);
  const requirementFields = Object.keys(requirements).filter(
    (key) => Array.isArray(requirements[key]) && requirements[key].length > 0
  );

  const timeRemaining = getTimeRemaining(job.j_deadline);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
            <div className="flex-shrink-0">
              <img
                src={getCompanyLogo(job.company)}
                alt={`${job.company?.c_admin?.u_first_name || "Company"} logo`}
                className="w-20 h-20 lg:w-24 lg:h-24 rounded-xl object-cover border border-gray-200 dark:border-gray-700 shadow-md"
              />
            </div>
            
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                {job.j_title || "Untitled Position"}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-4">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Building className="h-4 w-4 mr-2" />
                  <span>{job.company?.c_admin?.u_first_name || "Unknown Company"}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{job.j_location || "Remote"}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{job.j_employement_type || "Full-time"}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span>{formatSalary(job.j_salary_min, job.j_salary_max)}</span>
                </div>
                <div className="flex items-center text-blue-600 dark:text-blue-400">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Posted {formatDate(job.created_at)}</span>
                </div>
                {timeRemaining && (
                  <div className={`flex items-center ${timeRemaining.color}`}>
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{timeRemaining.text}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center lg:items-end gap-3">
              <span
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  job.j_status === "active"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : job.j_status === "draft"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                }`}
              >
                {job.j_status === "active" && <CheckCircle className="h-4 w-4 mr-1" />}
                {job.j_status?.toUpperCase() || "UNKNOWN"}
              </span>
              
              <button
                onClick={handleApply}
                disabled={job.j_status !== "active" || isApplying}
                className={`px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center gap-2 ${
                  job.j_status === "active"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white cursor-pointer transform hover:scale-105"
                    : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                }`}
              >
                {isApplying ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Applying...
                  </>
                ) : (
                  "Apply Now"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Description */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <FileText className="h-6 w-6 mr-2 text-blue-600" />
                Job Description
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {job.j_description || "No job description provided."}
                </p>
              </div>
            </div>

            {/* Requirements */}
            {requirementFields.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Requirements & Qualifications
                </h2>
                <div className="space-y-6">
                  {requirementFields.map((field) => (
                    <div key={field}>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize mb-3">
                        {field.replace(/_/g, " ")}
                      </h3>
                      <ul className="space-y-2">
                        {requirements[field].map((item, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Application Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Apply for this Position
              </h2>

              {applyError && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-700 dark:text-red-300 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {applyError}
                  </p>
                </div>
              )}

              <div className="space-y-6">
                {/* Notes Input */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    maxLength={255}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Tell us why you're interested in this position..."
                    className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  />
                  <div className="text-right text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {notes.length}/255 characters
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Cover Letter *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer">
                    <input
                      type="file"
                      id="cover-letter"
                      className="hidden"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      accept=".pdf,.doc,.docx,.txt"
                    />
                    <label htmlFor="cover-letter" className="cursor-pointer">
                      <UploadCloud className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                        {selectedFile ? "File Selected" : "Upload Cover Letter"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        {selectedFile ? selectedFile.name : "PDF, DOC, DOCX, TXT (Max 5MB)"}
                      </p>
                      <button
                        type="button"
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        {selectedFile ? "Change File" : "Choose File"}
                      </button>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Building className="h-5 w-5 mr-2 text-blue-600" />
                About the Company
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <User className="h-4 w-4 mr-3 text-gray-400" />
                  <span>{job.company?.c_name || "N/A"}</span>
                </div>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <Mail className="h-4 w-4 mr-3 text-gray-400" />
                  <span>{job.company?.c_email || "N/A"}</span>
                </div>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <Phone className="h-4 w-4 mr-3 text-gray-400" />
                  <span>{job.company?.c_phone || "N/A"}</span>
                </div>
                {job.company?.c_website && (
                  <div className="flex items-center text-blue-600 dark:text-blue-400">
                    <Globe className="h-4 w-4 mr-3" />
                    <a
                      href={job.company.c_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {job.company?.c_description || "No company description available."}
                </p>
              </div>
            </div>

            {/* Job Details */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Job Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Employment Type</span>
                  <span className="font-medium text-gray-900 dark:text-white">{job.j_employement_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Location</span>
                  <span className="font-medium text-gray-900 dark:text-white">{job.j_location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Salary Range</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatSalary(job.j_salary_min, job.j_salary_max)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Posted Date</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatDate(job.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Application Deadline</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatDate(job.j_deadline)}</span>
                </div>
              </div>
            </div>

            {/* Attachments */}
            {job.attachments && job.attachments.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Job Attachments
                </h3>
                <div className="space-y-3">
                  {job.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-lg">
                          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
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
                            `${import.meta.env.VITE_SERVER_URL}/api/files/attachment/${attachment.id}`,
                            attachment.f_name
                          )
                        }
                        className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;