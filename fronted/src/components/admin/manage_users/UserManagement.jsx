
import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Mail,
  UserX,
  UserCheck,
  Calendar,
  Briefcase,
  MapPin,
  Download,
  UserPlus,
  X,
} from "lucide-react";
import { Button } from "../../recruiterDashboard/ui/button";
import { Input } from "../../recruiterDashboard/ui/input";
import { Badge } from "../../recruiterDashboard/ui/badge";
import { Card, CardContent } from "../../recruiterDashboard/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../recruiterDashboard/ui/tooltip";

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("jobSeekers");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Mock data for job seekers
  const jobSeekers = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      location: "New York, USA",
      status: "Active",
      joined: "2024-01-15",
      resume: "alice_johnson_resume.pdf",
      skills: ["React", "JavaScript", "Node.js"],
      appliedJobs: 12,
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob.smith@example.com",
      location: "London, UK",
      status: "Active",
      joined: "2024-02-20",
      resume: "bob_smith_resume.pdf",
      skills: ["Python", "Django", "PostgreSQL"],
      appliedJobs: 8,
    },
    {
      id: 3,
      name: "Carol Williams",
      email: "carol.williams@example.com",
      location: "Toronto, Canada",
      status: "Inactive",
      joined: "2024-01-05",
      resume: "carol_williams_resume.pdf",
      skills: ["UI/UX Design", "Figma", "Adobe XD"],
      appliedJobs: 5,
    },
    {
      id: 4,
      name: "David Brown",
      email: "david.brown@example.com",
      location: "Sydney, Australia",
      status: "Active",
      joined: "2024-03-10",
      resume: "david_brown_resume.pdf",
      skills: ["Java", "Spring Boot", "MySQL"],
      appliedJobs: 15,
    },
  ];

  // Mock data for recruiters
  const recruiters = [
    {
      id: 1,
      name: "Emma Wilson",
      email: "emma.wilson@company.com",
      company: "Tech Innovations Inc.",
      location: "San Francisco, USA",
      status: "Active",
      joined: "2023-11-15",
      postedJobs: 8,
      hires: 24,
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@company.com",
      company: "Data Solutions Ltd.",
      location: "Berlin, Germany",
      status: "Active",
      joined: "2024-01-22",
      postedJobs: 5,
      hires: 12,
    },
    {
      id: 3,
      name: "Sophia Rodriguez",
      email: "sophia.rodriguez@company.com",
      company: "Creative Minds Agency",
      location: "Madrid, Spain",
      status: "Pending",
      joined: "2024-03-05",
      postedJobs: 0,
      hires: 0,
    },
    {
      id: 4,
      name: "James Taylor",
      email: "james.taylor@company.com",
      company: "Global Enterprises",
      location: "Chicago, USA",
      status: "Suspended",
      joined: "2023-09-18",
      postedJobs: 12,
      hires: 18,
    },
  ];

  const statusColors = {
    Active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Inactive: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    Suspended: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  const filteredJobSeekers = useMemo(() =>
    jobSeekers.filter(
      (user) =>
        (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === "all" || user.status === statusFilter)
    ),
    [searchTerm, statusFilter]
  );

  const filteredRecruiters = useMemo(() =>
    recruiters.filter(
      (user) =>
        (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === "all" || user.status === statusFilter)
    ),
    [searchTerm, statusFilter]
  );

  const currentUsers = activeTab === "jobSeekers" ? filteredJobSeekers : filteredRecruiters;

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return currentUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [currentUsers, currentPage]);

  const totalPages = Math.ceil(currentUsers.length / itemsPerPage);

  const handleStatusToggle = (userId, currentStatus) => {
    if (window.confirm(`Are you sure you want to ${currentStatus === "Active" ? "deactivate" : "activate"} this user?`)) {
      console.log(`Toggling status for user ${userId} from ${currentStatus}`);
      // Implement status toggle logic here
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              User Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage job seekers and recruiters in your platform
            </p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <UserPlus className="h-5 w-5 mr-2" />
            Add User
          </Button>
        </div>

        {/* Tabs */}
        <Card className="dark:border-gray-700 bg-white dark:bg-gray-800 mb-6">
          <CardContent className="p-4">
            <div className="flex  dark:border-gray-700">
              <button
                className={`px-4 py-2 font-semibold text-sm focus:outline-none transition-colors ${
                  activeTab === "jobSeekers"
                    ? "text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
                onClick={() => { setActiveTab("jobSeekers"); setCurrentPage(1); }}
                aria-current={activeTab === "jobSeekers" ? "page" : undefined}
              >
                Job Seekers ({filteredJobSeekers.length})
              </button>
              <button
                className={`px-4 py-2 font-semibold text-sm focus:outline-none transition-colors ${
                  activeTab === "recruiters"
                    ? "text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
                onClick={() => { setActiveTab("recruiters"); setCurrentPage(1); }}
                aria-current={activeTab === "recruiters" ? "page" : undefined}
              >
                Recruiters ({filteredRecruiters.length})
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className=" dark:border-gray-700 dark:bg-gray-800 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder={`Search ${activeTab === "jobSeekers" ? "job seekers" : "recruiters"}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  aria-label="Search users"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
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
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  aria-label="Filter by status"
                >
                  <option value="all">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                  <option value="Suspended">Suspended</option>
                </select>
                <Button
                  variant="outline"
                  className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={resetFilters}
                >
                  <Filter className="h-5 w-5 mr-2" />
                  Reset Filters
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card
            className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => { setStatusFilter("all"); setCurrentPage(1); }}
          >
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {jobSeekers.length + recruiters.length}
              </p>
            </CardContent>
          </Card>
          <Card
            className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => { setActiveTab("jobSeekers"); setStatusFilter("all"); setCurrentPage(1); }}
          >
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Job Seekers</p>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {jobSeekers.length}
              </p>
            </CardContent>
          </Card>
          <Card
            className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => { setActiveTab("recruiters"); setStatusFilter("all"); setCurrentPage(1); }}
          >
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Recruiters</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {recruiters.length}
              </p>
            </CardContent>
          </Card>
          <Card
            className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => { setStatusFilter("Active"); setCurrentPage(1); }}
          >
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {jobSeekers.filter(u => u.status === "Active").length +
                 recruiters.filter(u => u.status === "Active").length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className=" border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {activeTab === "jobSeekers" ? "Job Seeker" : "Recruiter"}
                    </th>
                    {activeTab === "recruiters" && (
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Company
                      </th>
                    )}
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {activeTab === "jobSeekers" ? "Applications" : "Hires"}
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={activeTab === "jobSeekers" ? 6 : 7}
                        className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                      >
                        No {activeTab === "jobSeekers" ? "job seekers" : "recruiters"} found
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                          </div>
                        </td>
                        {activeTab === "recruiters" && (
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                            {user.company}
                          </td>
                        )}
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-gray-700 dark:text-gray-300">{user.location}</span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <Badge className={statusColors[user.status]}>{user.status}</Badge>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-gray-700 dark:text-gray-300">
                              {new Date(user.joined).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-gray-700 dark:text-gray-300">
                              {activeTab === "jobSeekers" ? user.appliedJobs : user.hires}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right">
                          <TooltipProvider>
                            <div className="flex items-center justify-end gap-2">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    aria-label={`View ${user.name}'s profile`}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>View Profile</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    aria-label={`Email ${user.name}`}
                                  >
                                    <Mail className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Send Email</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className={user.status === "Active"
                                      ? "text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                      : "text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"}
                                    onClick={() => handleStatusToggle(user.id, user.status)}
                                    aria-label={user.status === "Active" ? `Deactivate ${user.name}` : `Activate ${user.name}`}
                                  >
                                    {user.status === "Active" ? (
                                      <UserX className="h-4 w-4" />
                                    ) : (
                                      <UserCheck className="h-4 w-4" />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>{user.status === "Active" ? "Deactivate" : "Activate"}</TooltipContent>
                              </Tooltip>
                            </div>
                          </TooltipProvider>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center p-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {paginatedUsers.length} of {currentUsers.length} users
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="border-gray-300 dark:border-gray-600"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="border-gray-300 dark:border-gray-600"
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
  );
};

export default UserManagement;
