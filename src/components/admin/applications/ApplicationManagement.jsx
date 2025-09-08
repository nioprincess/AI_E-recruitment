
import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Download,
} from "lucide-react";
import { Button } from "../../recruiterDashboard/ui/button";
import { Input } from "../../recruiterDashboard/ui/input";
import { Badge } from "../../recruiterDashboard/ui/badge";
import { Card, CardContent } from "../../recruiterDashboard/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../recruiterDashboard/ui/tooltip";

const ApplicationManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedApp, setExpandedApp] = useState(null);
  const [isLoading, setIsLoading] = useState({ edit: false });
  const itemsPerPage = 5;

  // Mock data for applications
  const applications = [
    {
      id: 1,
      jobTitle: "Software Engineer",
      applicant: "Alice Johnson",
      recruiter: "Emma Wilson",
      status: "submitted",
      submittedOn: "2025-09-01",
      notes: "Strong technical skills, awaiting review.",
    },
    {
      id: 2,
      jobTitle: "Data Analyst",
      applicant: "Bob Smith",
      recruiter: "Michael Chen",
      status: "shortlisted",
      submittedOn: "2025-09-02",
      notes: "Scheduled for interview on 2025-09-08.",
    },
    {
      id: 3,
      jobTitle: "UI/UX Designer",
      applicant: "Carol Williams",
      recruiter: "Sophia Rodriguez",
      status: "rejected",
      submittedOn: "2025-09-03",
      notes: "Lack of relevant experience.",
    },
    {
      id: 4,
      jobTitle: "Backend Developer",
      applicant: "David Brown",
      recruiter: "Emma Wilson",
      status: "submitted",
      submittedOn: "2025-09-04",
      notes: "Resume under review.",
    },
    {
      id: 5,
      jobTitle: "Marketing Specialist",
      applicant: "Emma Davis",
      recruiter: "Michael Chen",
      status: "shortlisted",
      submittedOn: "2025-09-05",
      notes: "Pending final interview.",
    },
    {
      id: 6,
      jobTitle: "AI Researcher",
      applicant: "Frank Miller",
      recruiter: "James Taylor",
      status: "rejected",
      submittedOn: "2025-09-06",
      notes: "Insufficient qualifications.",
    },
  ];

  const statusColors = {
    submitted: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    shortlisted: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  const filteredApplications = useMemo(() =>
    applications.filter((app) =>
      (app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.recruiter.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterType === "all" ||
        (filterType === "job" && app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (filterType === "recruiter" && app.recruiter.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (filterType === "applicant" && app.applicant.toLowerCase().includes(searchTerm.toLowerCase())))
    ),
    [searchTerm, filterType]
  );

  const paginatedApps = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredApplications.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredApplications, currentPage]);

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);

  const handleEditApp = async (appId) => {
    setIsLoading(prev => ({ ...prev, edit: true }));
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock 1-second delay
      console.log(`Editing application ${appId}`);
      alert(`Editing application ${appId} - Redirect to edit form here`);
      // Replace with navigation to edit form or open edit modal
    } catch (error) {
      console.error("Failed to edit application:", error);
      alert("Failed to edit application. Please try again.");
    } finally {
      setIsLoading(prev => ({ ...prev, edit: false }));
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilterType("all");
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Application Management</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage all applications across jobs</p>
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600">
              <Download className="h-5 w-5 mr-2" />
              Export Applications
            </Button>
          </div>

          {/* Filters */}
          <Card className="border-l border-t border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
                  <Input
                    placeholder="Search jobs, applicants, or recruiters..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-10 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    aria-label="Search applications"
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
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    aria-label="Filter by type"
                  >
                    <option value="all">All</option>
                    <option value="job">By Job</option>
                    <option value="recruiter">By Recruiter</option>
                    <option value="applicant">By Applicant</option>
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

          {/* Applications Table */}
          <Card className="border-l border-t border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Job Title
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Applicant
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Recruiter
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Submitted On
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {paginatedApps.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                          No applications found
                        </td>
                      </tr>
                    ) : (
                      paginatedApps.map((app) => (
                        <React.Fragment key={app.id}>
                          <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-200">
                              {app.jobTitle}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-200">
                              {app.applicant}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                              {app.recruiter}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <Badge className={statusColors[app.status]}>{app.status.charAt(0).toUpperCase() + app.status.slice(1)}</Badge>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                              {new Date(app.submittedOn).toLocaleDateString()}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
                                      onClick={() => setExpandedApp(expandedApp === app.id ? null : app.id)}
                                      aria-label={`View ${app.applicant}'s application`}
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
                                      onClick={() => handleEditApp(app.id)}
                                      disabled={isLoading.edit}
                                      aria-label={`Edit ${app.applicant}'s application`}
                                    >
                                      {isLoading.edit ? (
                                        <span className="animate-pulse">...</span>
                                      ) : (
                                        <Edit className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Edit Application</TooltipContent>
                                </Tooltip>
                              </div>
                            </td>
                          </tr>
                          {expandedApp === app.id && (
                            <tr className="bg-gray-50 dark:bg-gray-700">
                              <td colSpan={6} className="px-4 sm:px-6 py-4 text-gray-900 dark:text-gray-200">
                                <div className="space-y-2">
                                  <h3 className="text-lg font-semibold">Application Details</h3>
                                  <p><strong>Job Title:</strong> {app.jobTitle}</p>
                                  <p><strong>Applicant:</strong> {app.applicant}</p>
                                  <p><strong>Recruiter:</strong> {app.recruiter}</p>
                                  <p><strong>Status:</strong> {app.status.charAt(0).toUpperCase() + app.status.slice(1)}</p>
                                  <p><strong>Submitted On:</strong> {new Date(app.submittedOn).toLocaleDateString()}</p>
                                  <p><strong>Notes:</strong> {app.notes}</p>
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
                    Showing {paginatedApps.length} of {filteredApplications.length} applications
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

export default ApplicationManagement;
