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
  Send,
  Archive,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import CreateJobForm from "./CreateJobForm";

// Mock data
const mockJobs = [
  {
    id: "JOB-001",
    title: "Senior Frontend Developer",
    department: "Engineering",
    status: "published",
    type: "Full-time",
    location: "Remote",
    salary: { min: 80000, max: 120000, currency: "USD" },
    applicationCount: 45,
    createdDate: "2024-01-15",
    publishedDate: "2024-01-16",
    deadline: "2024-02-15",
    aboutCompany: "We are a global tech company building AI recruitment tools.",
    jobDescription: "Build, maintain, and optimize scalable web apps.",
    responsibilities: ["Write clean code", "Collaborate with designers", "Review PRs"],
    qualifications: ["Bachelor's in CS", "5+ years in frontend dev"],
    competencies: ["React", "Tailwind", "Communication"],
    languages: ["English"],
    performanceIndicators: ["On-time delivery", "Code quality"],
    exams: ["Technical test", "Live coding"],
    applicationGuidelines: "Apply before deadline with updated resume.",
    // Application questions
    fixedQuestions: [
      "Why do you want to work with us?",
      "What is your notice period?",
      "What are your salary expectations?"
    ],
    customQuestions: [
      "Describe your experience with React performance optimization",
      "How do you handle cross-browser compatibility issues?"
    ]
  },
  {
    id: "JOB-002",
    title: "Product Manager",
    department: "Product",
    status: "draft",
    type: "Full-time",
    location: "Office",
    salary: { min: 90000, max: 130000, currency: "USD" },
    applicationCount: 0,
    createdDate: "2024-01-18",
    publishedDate: null,
    deadline: null,
    fixedQuestions: [
      "Why do you want to work with us?",
      "What is your notice period?",
      "What are your salary expectations?"
    ],
    customQuestions: []
  },
  {
    id: "JOB-003",
    title: "UX Designer",
    department: "Design",
    status: "closed",
    type: "Full-time",
    location: "Hybrid",
    salary: { min: 70000, max: 100000, currency: "USD" },
    applicationCount: 32,
    createdDate: "2024-01-10",
    publishedDate: "2024-01-11",
    deadline: "2024-01-31",
    fixedQuestions: [
      "Why do you want to work with us?",
      "What is your notice period?",
      "What are your salary expectations?"
    ],
    customQuestions: [
      "Walk us through your design process",
      "How do you measure the success of your designs?"
    ]
  },
  {
    id: "JOB-004",
    title: "Backend Engineer",
    department: "Engineering",
    status: "draft",
    type: "Full-time",
    location: "Remote",
    salary: { min: 85000, max: 125000, currency: "USD" },
    applicationCount: 0,
    createdDate: "2024-01-20",
    publishedDate: null,
    deadline: null,
    fixedQuestions: [
      "Why do you want to work with us?",
      "What is your notice period?",
      "What are your salary expectations?"
    ],
    customQuestions: [
      "Describe your experience with microservices architecture",
      "How do you handle database migrations in production?"
    ]
  },
];

const statusColors = {
  draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  published: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  closed: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  archived: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
};

const JobManagement = () => {
  const [jobs, setJobs] = useState(mockJobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [viewingJob, setViewingJob] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRefs = useRef({});

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.values(dropdownRefs.current).forEach(ref => {
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
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);

  const getStatusBadge = (status) => (
    <Badge className={statusColors[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );

  const handleCreateJob = () => {
    setEditingJob(null);
    setIsCreateJobOpen(true);
  };

  const handleEditJob = (jobId) => {
    const jobToEdit = jobs.find((job) => job.id === jobId);
    setEditingJob(jobToEdit);
    setIsCreateJobOpen(true);
    setOpenDropdownId(null);
  };

  const handleDeleteJob = (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      setJobs(jobs.filter((job) => job.id !== jobId));
    }
    setOpenDropdownId(null);
  };

  const handleViewJob = (job) => {
    setViewingJob(job);
    setOpenDropdownId(null);
  };

  const handlePublishJob = (jobId) => {
    setJobs(jobs.map(job => 
      job.id === jobId 
        ? { 
            ...job, 
            status: "published",
            publishedDate: new Date().toISOString().split('T')[0]
          }
        : job
    ));
    setOpenDropdownId(null);
    alert("Job published successfully! Candidates can now apply.");
  };

  const handleCloseJob = (jobId) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, status: "closed" } : job
    ));
    setOpenDropdownId(null);
    alert("Job closed successfully! No new applications will be accepted.");
  };

  const handleArchiveJob = (jobId) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, status: "archived" } : job
    ));
    setOpenDropdownId(null);
    alert("Job archived successfully!");
  };

  const handleReopenJob = (jobId) => {
    setJobs(jobs.map(job => 
      job.id === jobId 
        ? { 
            ...job, 
            status: "published",
            publishedDate: new Date().toISOString().split('T')[0]
          }
        : job
    ));
    setOpenDropdownId(null);
    alert("Job reopened successfully! Candidates can now apply.");
  };

  const handleRestoreJob = (jobId) => {
    setJobs(jobs.map(job => 
      job.id === jobId 
        ? { 
            ...job, 
            status: "draft",
            publishedDate: null
          }
        : job
    ));
    setOpenDropdownId(null);
    alert("Job restored to drafts successfully!");
  };

  const toggleDropdown = (jobId) => {
    setOpenDropdownId(openDropdownId === jobId ? null : jobId);
  };

  // Get available actions based on job status
  const getAvailableActions = (job) => {
    const baseActions = [
      {
        label: "View",
        icon: Eye,
        onClick: () => handleViewJob(job),
        show: true
      },
      {
        label: "Edit",
        icon: Edit,
        onClick: () => handleEditJob(job.id),
        show: job.status === "draft"
      }
    ];

    const statusActions = {
      draft: [
        {
          label: "Publish Job",
          icon: Send,
          onClick: () => handlePublishJob(job.id),
          show: true,
          variant: "success"
        }
      ],
      published: [
        {
          label: "Close Job",
          icon: X,
          onClick: () => handleCloseJob(job.id),
          show: true,
          variant: "warning"
        }
      ],
      closed: [
        {
          label: "Re-open Job",
          icon: Send,
          onClick: () => handleReopenJob(job.id),
          show: true,
          variant: "success"
        },
        {
          label: "Archive Job",
          icon: Archive,
          onClick: () => handleArchiveJob(job.id),
          show: true,
          variant: "secondary"
        }
      ],
      archived: [
        {
          label: "Restore to Drafts",
          icon: Send,
          onClick: () => handleRestoreJob(job.id),
          show: true,
          variant: "success"
        }
      ]
    };

    return [
      ...baseActions,
      ...(statusActions[job.status] || [])
    ].filter(action => action.show);
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Job Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create jobs as drafts and publish when ready
          </p>
        </div>
        <Button
          onClick={handleCreateJob}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Job
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Jobs</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{jobs.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Drafts</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {jobs.filter((j) => j.status === "draft").length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Published</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {jobs.filter((j) => j.status === "published").length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Applications</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {jobs.reduce((sum, j) => sum + j.applicationCount, 0)}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search jobs by title or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                  Job Title
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                  Department
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                  Applications
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                  Created
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                  Published
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentJobs.map((job) => (
                <tr
                  key={job.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-4 py-4 font-medium text-gray-900 dark:text-white">{job.title}</td>
                  <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{job.department}</td>
                  <td className="px-4 py-4">{getStatusBadge(job.status)}</td>
                  <td className="px-4 py-4 flex items-center text-gray-600 dark:text-gray-300">
                    <Users className="h-4 w-4 text-gray-400 mr-2" />
                    {job.applicationCount}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      {new Date(job.createdDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                    {job.publishedDate ? (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        {new Date(job.publishedDate).toLocaleDateString()}
                      </div>
                    ) : (
                      <span className="text-gray-400">Not published</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right whitespace-nowrap relative">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => toggleDropdown(job.id)}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>

                    {openDropdownId === job.id && (
                      <div 
                        ref={el => dropdownRefs.current[job.id] = el}
                        className="absolute right-0 z-10 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg"
                        style={{ top: '100%' }}
                      >
                        <div className="py-1">
                          {getAvailableActions(job).map((action, index) => {
                            const IconComponent = action.icon;
                            return (
                              <button
                                key={index}
                                onClick={action.onClick}
                                className={`flex items-center w-full px-4 py-2 text-sm ${
                                  action.variant === 'success' 
                                    ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900' 
                                    : action.variant === 'warning'
                                    ? 'text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900'
                                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                              >
                                <IconComponent className="h-4 w-4 mr-2" />
                                {action.label}
                              </button>
                            );
                          })}
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900 border-t border-gray-200 dark:border-gray-700 mt-1"
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
        {filteredJobs.length > 0 && (
          <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-sm text-gray-600 dark:text-gray-400">
            <span>
              Showing {startIndex + 1}–
              {Math.min(startIndex + jobsPerPage, filteredJobs.length)} of{" "}
              {filteredJobs.length}
            </span>
            <div className="flex gap-2 items-center">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="border-gray-300 dark:border-gray-600"
              >
                Previous
              </Button>
              <span className="px-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="border-gray-300 dark:border-gray-600"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <Users className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No jobs found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm ? "No jobs match your search criteria." : "Get started by creating your first job."}
            </p>
            {!searchTerm && (
              <Button
                onClick={handleCreateJob}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Job
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Job Modal */}
      {isCreateJobOpen && (
        <CreateJobForm
          job={editingJob}
          onSave={(newJob) => {
            if (editingJob) {
              // Update existing job
              setJobs(jobs.map(job => job.id === editingJob.id ? newJob : job));
            } else {
              // Add new job as draft
              setJobs([...jobs, { 
                ...newJob, 
                id: `JOB-${String(jobs.length + 1).padStart(3, '0')}`,
                status: "draft", 
                applicationCount: 0,
                createdDate: new Date().toISOString().split('T')[0],
                publishedDate: null
              }]);
            }
            setIsCreateJobOpen(false);
            setEditingJob(null);
          }}
          onClose={() => {
            setIsCreateJobOpen(false);
            setEditingJob(null);
          }}
        />
      )}

      {/* View Job Modal */}
      {viewingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {viewingJob.title}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusBadge(viewingJob.status)}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {viewingJob.department} • {viewingJob.type} • {viewingJob.location}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewingJob(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Application Questions Section */}
              <section>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-lg border-b pb-2">
                  Application Questions
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Fixed Questions</h4>
                    <ul className="space-y-2 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      {(viewingJob.fixedQuestions || []).map((question, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                          <span className="text-gray-700 dark:text-gray-300">{question}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {viewingJob.customQuestions && viewingJob.customQuestions.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Custom Questions</h4>
                      <ul className="space-y-2 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        {viewingJob.customQuestions.map((question, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-green-600 dark:text-green-400 mr-2">•</span>
                            <span className="text-gray-700 dark:text-gray-300">{question}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>

              {/* Job Details Sections */}
              <section>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  About Company
                </h3>
                <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  {viewingJob.aboutCompany || "No company description provided."}
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Job Description
                </h3>
                <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  {viewingJob.jobDescription || "No job description provided."}
                </p>
              </section>

              {viewingJob.responsibilities && viewingJob.responsibilities.length > 0 && (
                <section>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Responsibilities
                  </h3>
                  <ul className="space-y-2 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    {viewingJob.responsibilities.map((responsibility, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                        <span className="text-gray-700 dark:text-gray-300">{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {viewingJob.qualifications && viewingJob.qualifications.length > 0 && (
                <section>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Qualifications
                  </h3>
                  <ul className="space-y-2 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    {viewingJob.qualifications.map((qualification, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-green-600 dark:text-green-400 mr-2">•</span>
                        <span className="text-gray-700 dark:text-gray-300">{qualification}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {viewingJob.applicationGuidelines && (
                <section>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Application Guidelines
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    {viewingJob.applicationGuidelines}
                  </p>
                </section>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <Button
                variant="outline"
                onClick={() => setViewingJob(null)}
                className="border-gray-300 dark:border-gray-600"
              >
                Close
              </Button>
              {viewingJob.status === 'draft' && (
                <Button
                  onClick={() => handleEditJob(viewingJob.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Job
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobManagement;