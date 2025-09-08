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
    status: "active",
    type: "Full-time",
    location: "Remote",
    salary: { min: 80000, max: 120000, currency: "USD" },
    applicationCount: 45,
    createdDate: "2024-01-15",
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
    deadline: null,
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
    deadline: "2024-01-31",
  },
];

const statusColors = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
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
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
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
    setOpenDropdownId(null); // Close dropdown after action
  };

  const handleDeleteJob = (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      setJobs(jobs.filter((job) => job.id !== jobId));
    }
    setOpenDropdownId(null); // Close dropdown after action
  };

  const handleViewJob = (job) => {
    setViewingJob(job);
    setOpenDropdownId(null); // Close dropdown after action
  };

  const toggleDropdown = (jobId) => {
    setOpenDropdownId(openDropdownId === jobId ? null : jobId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground dark:text-white">Job Management</h1>
          <p className="text-muted-foreground text-gray-600 dark:text-gray-400">Create and manage job postings</p>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-muted-foreground  text-gray-600 dark:text-gray-400">Total Jobs</p>
          <p className="text-2xl font-bold text-foreground dark:text-white">{jobs.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-muted-foreground  text-gray-600 dark:text-gray-400">Active Jobs</p>
          <p className="text-2xl font-bold text-foreground dark:text-white">
            {jobs.filter((j) => j.status === "active").length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-muted-foreground  text-gray-600 dark:text-gray-400">Applications</p>
          <p className="text-2xl font-bold text-foreground dark:text-white">
            {jobs.reduce((sum, j) => sum + j.applicationCount, 0)}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-card  rounded-lg p-4">
        <div className="relative">
          <Search className="absolute left-3 dark:text-gray-200 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-border dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 outline-1 border-gray-300 hover:border-gray-200 "
          />
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-card border border-border border-spacing-5 border-gray-700 dark:bg-gray-800 dark:text-gray-200  rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border dark:hover:bg-gray-700 border-gray-700  bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Job Title
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Department
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Applications
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Created
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border ">
              {currentJobs.map((job) => (
                <tr
                  key={job.id}
                  className="hover:bg-muted/50 border-border dark:hover:bg-gray-700 border-gray-700  transition-colors group"
                >
                  <td className="px-4 py-4 font-medium">{job.title}</td>
                  <td className="px-4 py-4">{job.department}</td>
                  <td className="px-4 py-4">{getStatusBadge(job.status)}</td>
                  <td className="px-4 py-4 flex items-center">
                    <Users className="h-4 w-4 text-muted-foreground mr-2" />
                    {job.applicationCount}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-foreground">
                        {new Date(job.createdDate).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                
                  <td className="px-4 py-4 text-right whitespace-nowrap relative">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="hover:bg-muted"
                      onClick={() => toggleDropdown(job.id)}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>

                    {openDropdownId === job.id && (
                      <div 
                        ref={el => dropdownRefs.current[job.id] = el}
                        className="absolute right-0 z-10 mt-1 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg"
                        style={{ top: '100%' }}
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
        <div className="flex justify-between items-center px-4 py-3 border-t border-border border-gray-300  text-sm text-muted-foreground">
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
            >
              Prev
            </Button>
            <span className="px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Create/Edit Job Modal */}
      {isCreateJobOpen && (
        <CreateJobForm
          job={editingJob}
          onSave={() => setIsCreateJobOpen(false)}
          onClose={() => {
            setIsCreateJobOpen(false);
            setEditingJob(null);
          }}
        />
      )}

      {/* View Job Modal */}
      {viewingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 dark:bg-gray-300/50 backdrop-blur-0 dark:text-gray-50 p-4">
          <div className="bg-card bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-border sticky top-0 bg-card fixed bg-white dark:bg-gray-800">
              <h2 className="text-xl font-bold text-foreground">
                {viewingJob.title}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewingJob(null)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 text-muted-foreground">
              <section>
                <h3 className="font-semibold text-foreground mb-2">
                  About Company
                </h3>
                <p>{viewingJob.aboutCompany || "N/A"}</p>
              </section>

              <section>
                <h3 className="font-semibold text-foreground mb-2">
                  Job Description
                </h3>
                <p>{viewingJob.jobDescription || "N/A"}</p>
              </section>

              <section>
                <h3 className="font-semibold text-foreground mb-2">
                  Responsibilities
                </h3>
                <ul className="list-disc pl-6 space-y-1">
                  {(viewingJob.responsibilities || []).map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-foreground mb-2">
                  Qualifications
                </h3>
                <ul className="list-disc pl-6 space-y-1">
                  {(viewingJob.qualifications || []).map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-foreground mb-2">
                  Competencies
                </h3>
                <ul className="list-disc pl-6 space-y-1">
                  {(viewingJob.competencies || []).map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-foreground mb-2">
                  Languages
                </h3>
                <p>{(viewingJob.languages || []).join(", ")}</p>
              </section>

              <section>
                <h3 className="font-semibold text-foreground mb-2">
                  Performance Indicators
                </h3>
                <ul className="list-disc pl-6 space-y-1">
                  {(viewingJob.performanceIndicators || []).map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-foreground mb-2">Exams</h3>
                <ul className="list-disc pl-6 space-y-1">
                  {(viewingJob.exams || []).map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-foreground mb-2">
                  Application Guidelines
                </h3>
                <p>{viewingJob.applicationGuidelines || "N/A"}</p>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobManagement;