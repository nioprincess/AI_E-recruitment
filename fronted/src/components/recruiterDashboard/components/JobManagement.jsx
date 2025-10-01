import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Users,
  X,
  MapPin,
  DollarSign,
  Clock,
  Building,
  User,
  Paperclip,
  DownloadCloud,
  ListCheckIcon,
} from "lucide-react";
import useUserAxios from "../../../hooks/useUserAxios";
import { Badge } from "../ui/badge";

const statusColors = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  draft:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  closed: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  archived: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
};

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [viewingJob, setViewingJob] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRefs = useRef({});

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.values(dropdownRefs.current).forEach((ref) => {
        if (ref && !ref.contains(event.target)) {
          setOpenDropdownId(null);
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  const filteredJobs = jobs.filter((job) =>
    job.j_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);
  const axios = useUserAxios();

  const getStatusBadge = (status) => (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );

  const getJobs = async () => {
    try {
      const resp = await axios.get("/api/jobs/my_jobs");
      if (resp.data.success) {
        setJobs(
          resp.data.data.map((j) => {
            return { ...j, j_requirements: JSON.parse(j.j_requirements) };
          })
        );
      }
    } catch (error) {}
  };

  const handleCreateJob = async (formData, jobId) => {
    try {
      let resp = null;
      const data = new FormData();
      // Append simple fields
      data.append("j_title", formData.j_title);
      data.append("j_description", formData.j_description);
      data.append("j_location", formData.j_location);
      data.append("j_employement_type", formData.j_employement_type);
      data.append("j_salary_min", formData.j_salary_min);
      data.append("j_salary_max", formData.j_salary_max);
      data.append("j_deadline", formData.j_deadline);
      data.append("j_status", formData.j_status);

      // Append attachments (files)
      formData.j_attachments.forEach((file, index) => {
        data.append(`j_attachments`, file);
      });

      // Append requirements object as JSON string
      data.append("j_requirements", JSON.stringify(formData.j_requirements));

      if (editingJob) {
        resp = await axios.patch(`/api/jobs/${jobId}/`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        resp = await axios.post("/api/jobs/", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      if (resp.data.success) {
        getJobs();
        setIsCreateJobOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenCreateJobForm = async () => {
    setEditingJob(null);
    setIsCreateJobOpen(true);
  };

  const handleEditJob = (jobId) => {
    const jobToEdit = jobs.find((job) => job.id === jobId);
    setEditingJob(jobToEdit);
    setIsCreateJobOpen(true);
    setOpenDropdownId(null);
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        const resp = await axios.delete(`/api/jobs/${jobId}/`);
        if (resp.status == 204) {
          setJobs(jobs.filter((job) => job.id !== jobId));
        }
      } catch (error) {}
    }
    setOpenDropdownId(null);
  };

  const handleViewJob = (job) => {
    setViewingJob(job);
    setOpenDropdownId(null);
  };

  const toggleDropdown = (jobId) => {
    setOpenDropdownId(openDropdownId === jobId ? null : jobId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatSalary = (min, max) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  };

  // Get application count (mock function - replace with actual API call)
  const getApplicationCount = (jobId) => {
    // Mock application counts
    const mockCounts = { 1: 45, 2: 0 };
    return mockCounts[jobId] || 0;
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

  const addFile = async (file, job_id) => {
    try {
      const formData = new FormData();
      formData.append(`j_attachments`, file);
      const resp = await axios.post(
        `/api/jobs/add-job-attachment/?job_id=${job_id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
     

      if (resp.status < 400) {
        getJobs()
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteFile = async (fileId, url) => {
    try {
      const resp = await axios.delete(url);

      if (resp.status < 400) {
        setViewingJob((prev) => {
          return {
            ...prev,
            attachments: [...prev.attachments.filter((f) => f.id != fileId)],
          };
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getJobs();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Job Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create and manage job postings
          </p>
        </div>
        <button
          onClick={handleOpenCreateJobForm}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Job
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Jobs</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {jobs.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Active Jobs
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {jobs.filter((j) => j.j_status === "active").length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Applications
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {jobs.reduce((sum, j) => sum + getApplicationCount(j.id), 0)}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200 outline-none"
          />
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">
                  Job Title
                </th>
                 
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">
                  Location
                </th>
               
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">
                  Attachements
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">
                  Created
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentJobs.map((job) => (
                <tr
                  key={job.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                >
                  <td className="px-4 py-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {job.j_title}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs">
                        {job.j_employement_type}
                      </div>
                    </div>
                  </td>
                 
                  <td className="px-4 py-4">{getStatusBadge(job.j_status)}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900 dark:text-white">
                        {job.j_location}
                      </span>
                    </div>
                  </td>
                

                  <td className="px-4 py-4">
                    <Badge variant={"success"}>
                      {job.j_attachments.length}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900 dark:text-white">
                        {formatDate(job.created_at)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right whitespace-nowrap relative">
                    <button
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => toggleDropdown(job.id)}
                    >
                      <MoreVertical className="h-4 w-4 text-gray-400" />
                    </button>

                    {openDropdownId === job.id && (
                      <div
                        ref={(el) => (dropdownRefs.current[job.id] = el)}
                        className="absolute right-0 z-10 mt-1 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg"
                        style={{ top: "100%" }}
                      >
                        <div className="py-1">
                          <button
                            onClick={() => handleViewJob(job)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </button>
                              <button
                            onClick={() => handleViewJob(job)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <ListCheckIcon className="h-4 w-4 mr-2" />
                            Applications
                          </button>
                          <button
                            onClick={() => handleEditJob(job.id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
          <span>
            Showing {startIndex + 1}–
            {Math.min(startIndex + jobsPerPage, filteredJobs.length)} of{" "}
            {filteredJobs.length}
          </span>
          <div className="flex gap-2 items-center">
            <button
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </button>
            <span className="px-2 text-gray-900 dark:text-white">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Create/Edit Job Modal */}
      {isCreateJobOpen && (
        <JobForm
          job={editingJob}
          onSave={handleCreateJob}
          onClose={() => {
            setIsCreateJobOpen(false);
            setEditingJob(null);
          }}
        />
      )}

      {/* View Job Modal */}
      {viewingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {viewingJob.j_title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {viewingJob.company.name}
                </p>
              </div>
              <button
                onClick={() => setViewingJob(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-6">
              {/* Job Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Location:
                    </span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {viewingJob.j_location}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Type:
                    </span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {viewingJob.j_employement_type}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Salary:
                    </span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {formatSalary(
                        viewingJob.j_salary_min,
                        viewingJob.j_salary_max
                      )}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Posted by:
                    </span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {viewingJob.user.first_name} {viewingJob.user.last_name}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Deadline:
                    </span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {viewingJob.j_deadline
                        ? formatDate(viewingJob.j_deadline)
                        : "No deadline"}
                    </span>
                  </div>
                  <div className="flex justify-between text-white">
                    <label
                      htmlFor="addFile"
                      className="p-2 bg-blue-900 rounded-md flex justify-evenly items-center cursor-pointer"
                    >
                      <Paperclip />
                      Add Attachment
                    </label>
                    <input
                      type="file"
                      id="addFile"
                      className="hidden"
                      onChange={(e) => {
                        addFile(e.target.files[0], viewingJob.id);
                      }}
                    />
                  </div>
                  {viewingJob.j_attachments.length > 0 && (
                    <div className="flex items-center text-sm">
                      <Paperclip className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Attachments:
                      </span>
                      <span className="ml-2 text-gray-900 dark:text-white">
                        {viewingJob.attachments.length} file(s)
                      </span>
                    </div>
                  )}
                  {viewingJob.j_attachments.length > 0 && (
                    <div className="m-1 text-white">
                      <table className="w-full border border-gray-400 text-left">
                        <thead className="bg-gray-700">
                          <tr>
                            <th className="p-2 border border-gray-400">#</th>
                            <th className="p-2 border border-gray-400">Name</th>
                            <th className="p-2 border border-gray-400">
                              Size (MB)
                            </th>
                            <th className="p-2 border border-gray-400">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {viewingJob.attachments.map((f, idx) => (
                            <tr key={idx} className="border border-gray-400">
                              <td className="p-2 border border-gray-400">
                                {idx + 1}
                              </td>
                              <td className="p-2 border border-gray-400">
                                {f.f_name}
                              </td>
                              <td className="p-2 border border-gray-400">
                                {(
                                  Number.parseInt(f.f_size) /
                                  1024 /
                                  1024
                                ).toFixed(2)}{" "}
                                MB
                              </td>
                              <td className="p-2 border border-gray-400">
                                <button
                                  className="px-2 py-1 bg-red-800 rounded-md"
                                  onClick={() => {
                                    deleteFile(
                                      f.id,
                                      `${
                                        import.meta.env.VITE_SERVER_URL
                                      }/api/jobs/delete-job-attachment/?job_id=${
                                        viewingJob.id
                                      }&file_id=${f.id}`
                                    );
                                  }}
                                >
                                  <Trash2 />
                                </button>
                                <button
                                  onClick={() =>
                                    downloadFile(
                                      `${
                                        import.meta.env.VITE_SERVER_URL
                                      }/api/files/attachment/${f.id}`,
                                      f.f_name
                                    )
                                  }
                                >
                                  <DownloadCloud />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Description */}
              <section>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Job Description
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {viewingJob.j_description}
                </p>
              </section>

              {/* Requirements */}
              <section>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Requirements
                </h3>
                <div className="space-y-4">
                  {Object.entries(viewingJob.j_requirements).map(
                    ([category, items]) => (
                      <div key={category}>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200 capitalize mb-2">
                          {category}
                        </h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {Array.isArray(items) ? (
                            items.map((item, index) => (
                              <li
                                key={index}
                                className="text-gray-600 dark:text-gray-400"
                              >
                                {item}
                              </li>
                            ))
                          ) : (
                            <li className="text-gray-600 dark:text-gray-400">
                              {items}
                            </li>
                          )}
                        </ul>
                      </div>
                    )
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Job Form Component
const JobForm = ({ job, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    j_title: job?.j_title || "",
    j_description: job?.j_description || "",
    j_location: job?.j_location || "",
    j_employement_type: job?.j_employement_type || "Full-time",
    j_salary_min: job?.j_salary_min || "",
    j_salary_max: job?.j_salary_max || "",
    j_deadline: job?.j_deadline ? job.j_deadline.split("T")[0] : "",
    j_status: job?.j_status || "draft",
    j_attachments: [],
    j_requirements: job?.j_requirements || {
      education: [""],
      experience: [""],
      skills: [""],
      languages: [""],
      certifications: [""],
      other: [""],
    },
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRequirementChange = (category, index, value) => {
    setFormData((prev) => ({
      ...prev,
      j_requirements: {
        ...prev.j_requirements,
        [category]: prev.j_requirements[category].map((item, i) =>
          i === index ? value : item
        ),
      },
    }));
  };

  const addRequirement = (category) => {
    setFormData((prev) => ({
      ...prev,
      j_requirements: {
        ...prev.j_requirements,
        [category]: [...prev.j_requirements[category], ""],
      },
    }));
  };

  const removeAttachment = (filename) => {
    setFormData((prev) => ({
      ...prev,
      j_attachments: [...prev.j_attachments.filter((f) => f.name != filename)],
    }));
  };
  const addAttachment = (attachmentFile) => {
    setFormData((prev) => ({
      ...prev,
      j_attachments: [...prev.j_attachments, attachmentFile],
    }));
  };

  const removeRequirement = (category, index) => {
    setFormData((prev) => ({
      ...prev,
      j_requirements: {
        ...prev.j_requirements,
        [category]: prev.j_requirements[category].filter((_, i) => i !== index),
      },
    }));
  };

  const addRequirementCategory = () => {
    const categoryName = prompt("Enter requirement category name:");
    if (categoryName && !formData.j_requirements[categoryName]) {
      setFormData((prev) => ({
        ...prev,
        j_requirements: {
          ...prev.j_requirements,
          [categoryName]: [""],
        },
      }));
    }
  };

  const removeRequirementCategory = (category) => {
    if (window.confirm(`Remove ${category} category?`)) {
      setFormData((prev) => {
        const newRequirements = { ...prev.j_requirements };
        delete newRequirements[category];
        return {
          ...prev,
          j_requirements: newRequirements,
        };
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to save the job
    console.log("Job data:", formData);
    onSave(formData, job?.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {job ? "Edit Job" : "Create New Job"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-6"
        >
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={formData.j_title}
                onChange={(e) => handleInputChange("j_title", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Employment Type *
              </label>
              <select
                required
                value={formData.j_employement_type}
                onChange={(e) =>
                  handleInputChange("j_employement_type", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status *
              </label>
              <select
                required
                value={formData.j_status}
                onChange={(e) => handleInputChange("j_status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location *
              </label>
              <input
                type="text"
                required
                value={formData.j_location}
                onChange={(e) =>
                  handleInputChange("j_location", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
              />
            </div>
          </div>

          {/* Salary Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Minimum Salary
              </label>
              <input
                type="number"
                value={formData.j_salary_min}
                onChange={(e) =>
                  handleInputChange("j_salary_min", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Maximum Salary
              </label>
              <input
                type="number"
                value={formData.j_salary_max}
                onChange={(e) =>
                  handleInputChange("j_salary_max", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
              />
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Application Deadline
            </label>
            <input
              type="date"
              value={formData.j_deadline}
              onChange={(e) => handleInputChange("j_deadline", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
            />
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Job Description *
            </label>
            <textarea
              required
              rows={4}
              value={formData.j_description}
              onChange={(e) =>
                handleInputChange("j_description", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200 resize-vertical"
              placeholder="Describe the role, responsibilities, and what the ideal candidate will be doing..."
            />
          </div>

          {/* Dynamic Requirements */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Requirements
              </h3>
              <button
                type="button"
                onClick={addRequirementCategory}
                className="px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-sm font-medium transition-colors"
              >
                Add Category
              </button>
            </div>

            <div className="space-y-6">
              {Object.entries(formData.j_requirements).map(
                ([category, items]) => (
                  <div
                    key={category}
                    className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-900 dark:text-white capitalize">
                        {category}
                      </h4>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => addRequirement(category)}
                          className="px-2 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded text-xs font-medium transition-colors"
                        >
                          Add Item
                        </button>
                        <button
                          type="button"
                          onClick={() => removeRequirementCategory(category)}
                          className="px-2 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded text-xs font-medium transition-colors"
                        >
                          Remove Category
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {items.map((item, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) =>
                              handleRequirementChange(
                                category,
                                index,
                                e.target.value
                              )
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
                            placeholder={`Enter ${category} requirement...`}
                          />
                          {items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeRequirement(category, index)}
                              className="px-3 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
          {!job && (
            <div className="space-y-6 border border-gray-200 p-2 rounded-md">
              <div>
                {formData.j_attachments.map((f, idx) => {
                  return (
                    <div className="flex justify-between text-white" key={idx}>
                      <span>
                        {idx + 1}. {f.name}
                      </span>{" "}
                      <button
                        type="button"
                        className="bg-red-700  p-2 rounded-md m-1"
                        onClick={() => {
                          removeAttachment(f.name);
                        }}
                      >
                        delete
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="flex  justify-between items-center space-y-2 text-white">
                <label htmlFor="attach">Add Attachment</label>
                <input
                  id="attach"
                  type="file"
                  onChange={(e) => {
                    addAttachment(e.target.files[0]);
                  }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              {job ? "Update Job" : "Create Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobManagement;
