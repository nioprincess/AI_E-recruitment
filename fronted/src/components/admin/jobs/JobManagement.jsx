
import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Archive,
  Trash,
  Download,
} from "lucide-react";
import { Button } from "../../recruiterDashboard/ui/button";
import { Input } from "../../recruiterDashboard/ui/input";
import { Badge } from "../../recruiterDashboard/ui/badge";
import { Card, CardContent } from "../../recruiterDashboard/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../recruiterDashboard/ui/tooltip";

const JobManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedJob, setExpandedJob] = useState(null);
  const [isLoading, setIsLoading] = useState({ edit: false, archive: false, delete: false });
  const itemsPerPage = 5;

  // Mock data for jobs from all recruiters
  const jobs = [
    {
      id: 1,
      title: "Software Engineer",
      company: "TechCorp",
      location: "Kigali, Rwanda",
      status: "active",
      postedOn: "2025-08-01",
      deadline: "2025-09-01",
      recruiter: "Emma Wilson",
      description: "Develop and maintain web applications.",
    },
    {
      id: 2,
      title: "Data Analyst",
      company: "DataSolutions",
      location: "Nairobi, Kenya",
      status: "closed",
      postedOn: "2025-08-05",
      deadline: "2025-08-30",
      recruiter: "Michael Chen",
      description: "Analyze data and generate reports.",
    },
    {
      id: 3,
      title: "UI/UX Designer",
      company: "DesignHub",
      location: "Dar es Salaam, Tanzania",
      status: "draft",
      postedOn: "2025-08-10",
      deadline: "2025-09-10",
      recruiter: "Sophia Rodriguez",
      description: "Design user interfaces and experiences.",
    },
    {
      id: 4,
      title: "Backend Developer",
      company: "TechCorp",
      location: "Kigali, Rwanda",
      status: "active",
      postedOn: "2025-08-12",
      deadline: "2025-08-28",
      recruiter: "Emma Wilson",
      description: "Build and optimize server-side applications.",
    },
    {
      id: 5,
      title: "Marketing Specialist",
      company: "DataSolutions",
      location: "Nairobi, Kenya",
      status: "closed",
      postedOn: "2025-08-15",
      deadline: "2025-09-15",
      recruiter: "Michael Chen",
      description: "Develop marketing strategies and campaigns.",
    },
    {
      id: 6,
      title: "AI Researcher",
      company: "AIHub",
      location: "Kampala, Uganda",
      status: "draft",
      postedOn: "2025-08-20",
      deadline: "2025-09-05",
      recruiter: "James Taylor",
      description: "Research and develop AI models.",
    },
  ];

  const statusColors = {
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    closed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  };

  const filteredJobs = useMemo(() =>
    jobs.filter(
      (job) =>
        (job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.recruiter.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === "all" || job.status === statusFilter)
    ),
    [searchTerm, statusFilter]
  );

  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredJobs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredJobs, currentPage]);

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  const handleEditJob = async (jobId) => {
    setIsLoading(prev => ({ ...prev, edit: true }));
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock 1-second delay
      console.log(`Editing job ${jobId}`);
      alert(`Editing job ${jobId} - Redirect to edit form here`);
      // Replace with navigation to edit form or open edit modal
    } catch (error) {
      console.error("Failed to edit job:", error);
      alert("Failed to edit job. Please try again.");
    } finally {
      setIsLoading(prev => ({ ...prev, edit: false }));
    }
  };

  const handleArchiveJob = async (jobId) => {
    if (!window.confirm(`Are you sure you want to archive job ${jobId}?`)) return;
    setIsLoading(prev => ({ ...prev, archive: true }));
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock 1-second delay
      console.log(`Archived job ${jobId}`);
      alert(`Job ${jobId} has been archived successfully!`);
      // Update local state or call real API to archive
    } catch (error) {
      console.error("Failed to archive job:", error);
      alert("Failed to archive job. Please try again.");
    } finally {
      setIsLoading(prev => ({ ...prev, archive: false }));
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm(`Are you sure you want to delete job ${jobId}? This action cannot be undone.`)) return;
    setIsLoading(prev => ({ ...prev, delete: true }));
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock 1-second delay
      console.log(`Deleted job ${jobId}`);
      alert(`Job ${jobId} has been deleted successfully!`);
      // Update local state or call real API to delete
    } catch (error) {
      console.error("Failed to delete job:", error);
      alert("Failed to delete job. Please try again.");
    } finally {
      setIsLoading(prev => ({ ...prev, delete: false }));
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Job Management</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage all job postings from recruiters</p>
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600">
              <Download className="h-5 w-5 mr-2" />
              Export Jobs
            </Button>
          </div>

          {/* Filters */}
          <Card className="border-l border-t border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
                  <Input
                    placeholder="Search jobs, companies, or recruiters..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-10 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    aria-label="Search jobs"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
                      aria-label="Clear search"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <div className="flex gap-3 items-center">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    aria-label="Filter by status"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                    <option value="draft">Draft</option>
                  </select>
                  <Button
                    variant="outline"
                    className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-200"
                    onClick={resetFilters}
                  >
                    <Filter className="h-5 w-5 mr-2" />
                    Reset Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Jobs Table */}
          <Card className="border-l border-t border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Posted On
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Deadline
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Recruiter
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {paginatedJobs.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                          No jobs found
                        </td>
                      </tr>
                    ) : (
                      paginatedJobs.map((job) => (
                        <React.Fragment key={job.id}>
                          <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-200">
                              {job.title}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-200">
                              {job.company}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                              {job.location}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <Badge className={statusColors[job.status]}>{job.status.charAt(0).toUpperCase() + job.status.slice(1)}</Badge>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                              {new Date(job.postedOn).toLocaleDateString()}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                              {new Date(job.deadline).toLocaleDateString()}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-200">
                              {job.recruiter}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
                                      onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                                      aria-label={`View ${job.title} details`}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>View Details</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 disabled:opacity-50"
                                      onClick={() => handleEditJob(job.id)}
                                      disabled={isLoading.edit}
                                      aria-label={`Edit ${job.title}`}
                                    >
                                      {isLoading.edit ? (
                                        <span className="animate-pulse">...</span>
                                      ) : (
                                        <Edit className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Edit Job</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-yellow-500 dark:text-yellow-400 hover:text-yellow-600 dark:hover:text-yellow-300 disabled:opacity-50"
                                      onClick={() => handleArchiveJob(job.id)}
                                      disabled={isLoading.archive}
                                      aria-label={`Archive ${job.title}`}
                                    >
                                      {isLoading.archive ? (
                                        <span className="animate-pulse">...</span>
                                      ) : (
                                        <Archive className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Archive Job</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 disabled:opacity-50"
                                      onClick={() => handleDeleteJob(job.id)}
                                      disabled={isLoading.delete}
                                      aria-label={`Delete ${job.title}`}
                                    >
                                      {isLoading.delete ? (
                                        <span className="animate-pulse">...</span>
                                      ) : (
                                        <Trash className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Delete Job</TooltipContent>
                                </Tooltip>
                              </div>
                            </td>
                          </tr>
                          {expandedJob === job.id && (
                            <tr className="bg-gray-50 dark:bg-gray-700">
                              <td colSpan={8} className="px-4 sm:px-6 py-4 text-gray-900 dark:text-gray-200">
                                <div className="space-y-2">
                                  <h3 className="text-lg font-semibold">Job Details</h3>
                                  <p><strong>Company:</strong> {job.company}</p>
                                  <p><strong>Location:</strong> {job.location}</p>
                                  <p><strong>Status:</strong> {job.status.charAt(0).toUpperCase() + job.status.slice(1)}</p>
                                  <p><strong>Posted On:</strong> {new Date(job.postedOn).toLocaleDateString()}</p>
                                  <p><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</p>
                                  <p><strong>Recruiter:</strong> {job.recruiter}</p>
                                  <p><strong>Description:</strong> {job.description}</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {paginatedJobs.length} of {filteredJobs.length} jobs
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                      className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-200"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-200"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default JobManagement;
