import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import logo1 from "../../../assets/images/ex-logo1.png";
import logo2 from "../../../assets/images/ex-logo3.png";
import logo3 from "../../../assets/images/ex-logo4.png";
import logo4 from "../../../assets/images/ex-logo5.png";
import logo5 from "../../../assets/images/ex-logo8.png";
import useUserAxios from "../../../hooks/useUserAxios";
import { UploadCloud } from "lucide-react";
import { Textarea } from "../../recruiterDashboard/ui/textarea";

const JobDescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [notes, setNotes] = useState("");
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
      console.log(error);
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
      // If it's not valid JSON, treat it as plain text
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
      return `${formatAmount(min)} - ${formatAmount(max)}`;
    }

    return min ? `From ${formatAmount(min)}` : `Up to ${formatAmount(max)}`;
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
    try {
      const formData = new FormData();
      formData.append("a_cover_letter", selectedFile);
      formData.append("notes", notes)
      const resp = await axios.post(
        `/api/jobs/${id}/submit-applications/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    if(resp.data.success){
      navigate("/my-applications")
    }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getJob();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 mt-20 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">Loading job details...</div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-3xl mx-auto px-6 mt-20 py-8">
        <div className="text-center">
          <p className="text-xl text-red-600">{error || "Job not found"}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const requirements = parseRequirements(job.j_requirements);
  const requirementFields = Object.keys(requirements).filter(
    (key) => Array.isArray(requirements[key]) && requirements[key].length > 0
  );

  return (
    <div className="max-w-4xl mx-auto px-6 mt-20 py-8">
      {/* Logo and Basic Info */}
      <div className="flex justify-center mb-6">
        <img
          src={getCompanyLogo(job.company)}
          alt={`${job.company?.c_admin?.u_first_name || "Company"} logo`}
          className="w-24 h-24 rounded-full object-cover border border-gray-300 dark:border-gray-700 shadow-md"
        />
      </div>

      {/* Job Info */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-2">
          {job.j_title || "Untitled Position"}
        </h1>
        <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
          {job.company?.c_admin?.u_first_name || "Unknown Company"} •{" "}
          {job.j_location || "Location not specified"}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {job.j_employement_type || "Not specified"} • Posted on{" "}
          {formatDate(job.created_at)}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Salary: {formatSalary(job.j_salary_min, job.j_salary_max)} • Deadline:{" "}
          {formatDate(job.j_deadline)}
        </p>
        <div className="mt-2">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              job.j_status === "active"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : job.j_status === "draft"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
            }`}
          >
            Status: {job.j_status?.toUpperCase() || "UNKNOWN"}
          </span>
        </div>
      </div>

      {/* Company Information */}
      <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          About the Company
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {job.company?.c_description ||
                "No company description available."}
            </p>
          </div>
          <div className="space-y-2 text-sm">
                  <p>
              <strong>Name:</strong> {job.company?.c_name || "N/A"}
            </p>
            <p>
              <strong>Industry:</strong> {job.company?.c_industry || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {job.company?.c_email || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {job.company?.c_phone || "N/A"}
            </p>
            <p>
              <strong>Website:</strong>
              {job.company?.c_website ? (
                <a
                  href={job.company.c_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                >
                  {job.company.c_website}
                </a>
              ) : (
                " N/A"
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Job Description */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          Job Description
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
          {job.j_description || "No job description provided."}
        </p>
      </div>

      {/* Dynamic Requirements */}
      {requirementFields.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Requirements
          </h2>
          <div className="space-y-4">
            {requirementFields.map((field) => (
              <div key={field}>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white capitalize mb-2">
                  {field.replace(/_/g, " ")}
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
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
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Job Attachments
          </h2>
          <div className="space-y-3">
            {job.attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <span className="text-blue-600 dark:text-blue-300 font-medium">
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
                    <p className="font-medium text-gray-900 dark:text-white">
                      {attachment.f_name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {Math.round(attachment.f_size / 1024)} KB •{" "}
                      {attachment.f_type}
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
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Job Information */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            Job Details
          </h3>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Employment Type:</strong>{" "}
              {job.j_employement_type || "Not specified"}
            </p>
            <p>
              <strong>Location:</strong> {job.j_location || "Not specified"}
            </p>
            <p>
              <strong>Salary Range:</strong>{" "}
              {formatSalary(job.j_salary_min, job.j_salary_max)}
            </p>
            <p>
              <strong>Posted:</strong> {formatDate(job.created_at)}
            </p>
            <p>
              <strong>Deadline:</strong> {formatDate(job.j_deadline)}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            Contact Information
          </h3>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Company:</strong>{" "}
              {job.company?.c_admin?.u_first_name || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {job.company?.c_email || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {job.company?.c_phone || "N/A"}
            </p>
            <p>
              <strong>Posted by:</strong> {job.user?.u_first_name || "N/A"}{" "}
              {job.user?.u_last_name || ""}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col mb-3">
        <label htmlFor="notes" className="font-bold">
          Application Notes
        </label>
        <textarea
          maxLength={255}
          value={notes}
          className="border border-gray-400 p-2 rounded-md"
          onChange={(e) => {
            setNotes(e.target.value);
          }}
        />
      </div>

      <div className="flex flex-col text-white">
        <label
          htmlFor="cover-letter"
          className="bg-yellow-600 p-2 rounded-md text-center flex justify-center items-center space-x-2 cursor-pointer"
        >
          <UploadCloud /> Upload Cover Letter
        </label>
        <input
          type="file"
          id="cover-letter"
          className="hidden"
          onChange={(e) => {
            setSelectedFile(e.target.files[0]);
          }}
        />
       
      </div>
       {selectedFile && <span>{selectedFile.name}</span>}

      {/* Apply Button */}
      <div className="text-center mt-8">
        <button
          onClick={handleApply}
          disabled={job.j_status !== "active"}
          className={`px-8 py-3 rounded-full shadow-md transition-all duration-300 ${
            job.j_status === "active"
              ? "bg-gradient-to-r from-blue-100 to-blue-400 hover:from-blue-400 hover:to-blue-100 text-gray-900 dark:text-white cursor-pointer"
              : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          }`}
        >
          {job.j_status === "active" ? "Apply Now" : "Not Accepting Applications"}
        </button>

        {job.j_status !== "active" && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            This job is currently not accepting applications.
          </p>
        )}
      </div>
    </div>
  );
};

export default JobDescription;
