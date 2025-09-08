import React, { useState } from "react";
import {
  Download,
  Filter,
  BarChart3,
  Users,
  Briefcase,
  Calendar,
  FileText,
  ChevronDown,
  Eye,
  FileDown,
  TrendingUp,
  Target,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

const RecruiterReports = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("last30");
  const [selectedJob, setSelectedJob] = useState("all");

  // Mock data for reports
  const reportData = {
    overview: {
      totalApplications: 347,
      screeningCompleted: 284,
      interviewsConducted: 156,
      offersMade: 42,
      conversionRate: 12.1,
      avgTimeToHire: 24, // days
    },
    jobs: [
      {
        id: "job-001",
        title: "Senior Frontend Developer",
        department: "Engineering",
        applications: 87,
        screeningCompleted: 72,
        interviews: 38,
        offers: 12,
        hires: 9,
        avgScreeningScore: 76.4,
        avgTimeToHire: 22,
        status: "Closed"
      },
      {
        id: "job-002",
        title: "Product Manager",
        department: "Product",
        applications: 124,
        screeningCompleted: 98,
        interviews: 45,
        offers: 8,
        hires: 6,
        avgScreeningScore: 82.1,
        avgTimeToHire: 28,
        status: "Active"
      },
      {
        id: "job-003",
        title: "UX Designer",
        department: "Design",
        applications: 68,
        screeningCompleted: 54,
        interviews: 32,
        offers: 7,
        hires: 5,
        avgScreeningScore: 79.3,
        avgTimeToHire: 26,
        status: "Closed"
      }
    ],
    candidates: [
      {
        id: "candidate-001",
        name: "Alice Johnson",
        appliedJob: "Senior Frontend Developer",
        screeningScore: 88,
        screeningStatus: "Passed",
        technicalScore: 92,
        technicalStatus: "Passed",
        interviewScore: 4.5,
        interviewStatus: "Recommended",
        overallStatus: "Hired",
        timeline: {
          applied: "2024-01-15",
          screened: "2024-01-17",
          technical: "2024-01-20",
          interviewed: "2024-01-25",
          offered: "2024-01-28"
        }
      },
      {
        id: "candidate-002",
        name: "Bob Smith",
        appliedJob: "Senior Frontend Developer",
        screeningScore: 76,
        screeningStatus: "Passed",
        technicalScore: 68,
        technicalStatus: "Failed",
        interviewScore: null,
        interviewStatus: "Not Reached",
        overallStatus: "Rejected",
        timeline: {
          applied: "2024-01-16",
          screened: "2024-01-18",
          technical: "2024-01-21",
          interviewed: null,
          offered: null
        }
      },
      {
        id: "candidate-003",
        name: "Carol Williams",
        appliedJob: "Product Manager",
        screeningScore: 92,
        screeningStatus: "Passed",
        technicalScore: 85,
        technicalStatus: "Passed",
        interviewScore: 4.2,
        interviewStatus: "Recommended",
        overallStatus: "Hired",
        timeline: {
          applied: "2024-01-10",
          screened: "2024-01-12",
          technical: "2024-01-16",
          interviewed: "2024-01-20",
          offered: "2024-01-23"
        }
      },
      {
        id: "candidate-004",
        name: "David Brown",
        appliedJob: "UX Designer",
        screeningScore: 81,
        screeningStatus: "Passed",
        technicalScore: 79,
        technicalStatus: "Passed",
        interviewScore: 3.8,
        interviewStatus: "Consider",
        overallStatus: "On Hold",
        timeline: {
          applied: "2024-01-18",
          screened: "2024-01-20",
          technical: "2024-01-23",
          interviewed: "2024-01-27",
          offered: null
        }
      }
    ]
  };

  const statusColors = {
    Hired: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    "On Hold": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    Active: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    Closed: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    Passed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    Recommended: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Consider: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    "Not Reached": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  };

  const handleExport = (format, type) => {
    // In a real app, this would generate and download the report
    alert(`Exporting ${type} report as ${format.toUpperCase()}`);
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track recruitment performance and candidate progress
          </p>
        </div>
        <div className="flex gap-2 dark:text-white">
          <Button variant="outline" className="border-gray-300 dark:border-gray-600">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <div className="relative">
            <Button variant="outline" className="border-gray-300 dark:border-gray-600">
              <Download className="h-4 w-4 mr-2" />
              Export
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
            {/* Export dropdown would go here */}
          </div>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: "last7", label: "Last 7 days" },
          { value: "last30", label: "Last 30 days" },
          { value: "last90", label: "Last 90 days" },
          { value: "ytd", label: "Year to date" },
          { value: "custom", label: "Custom range" },
        ].map((period) => (
          <button
            key={period.value}
            onClick={() => setDateRange(period.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              dateRange === period.value
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                : "bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {[
          { id: "overview", label: "Overview", icon: <BarChart3 className="h-4 w-4" /> },
          { id: "jobs", label: "Job Reports", icon: <Briefcase className="h-4 w-4" /> },
          { id: "candidates", label: "Candidate Reports", icon: <Users className="h-4 w-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm focus:outline-none ${
              activeTab === tab.id
                ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Dashboard */}
      {activeTab === "overview" && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Applications</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {reportData.overview.totalApplications}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Interviews</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {reportData.overview.interviewsConducted}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Offers Made</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {reportData.overview.offersMade}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {reportData.overview.conversionRate}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <Clock className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Time to Hire</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {reportData.overview.avgTimeToHire} days
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Screening Completed</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {reportData.overview.screeningCompleted}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Funnel Visualization */}
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle>Recruitment Funnel</CardTitle>
              <CardDescription>
                Visualization of candidate progression through hiring stages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4">
                {[
                  { label: "Applications", value: reportData.overview.totalApplications, color: "bg-blue-500" },
                  { label: "Screening", value: reportData.overview.screeningCompleted, color: "bg-purple-500" },
                  { label: "Interviews", value: reportData.overview.interviewsConducted, color: "bg-yellow-500" },
                  { label: "Offers", value: reportData.overview.offersMade, color: "bg-green-500" },
                ].map((stage, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className={`h-4 w-4 rounded-full ${stage.color} mb-2`}></div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{stage.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stage.label}</div>
                  </div>
                ))}
              </div>
              <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-4">
                <div className="absolute top-0 left-0 h-full bg-blue-500" style={{ width: '100%' }}></div>
                <div className="absolute top-0 left-0 h-full bg-purple-500" style={{ width: `${(reportData.overview.screeningCompleted / reportData.overview.totalApplications) * 100}%` }}></div>
                <div className="absolute top-0 left-0 h-full bg-yellow-500" style={{ width: `${(reportData.overview.interviewsConducted / reportData.overview.totalApplications) * 100}%` }}></div>
                <div className="absolute top-0 left-0 h-full bg-green-500" style={{ width: `${(reportData.overview.offersMade / reportData.overview.totalApplications) * 100}%` }}></div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Job Reports */}
      {activeTab === "jobs" && (
        <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Job Performance Reports</CardTitle>
              <CardDescription>
                Analytics for each job position in your recruitment pipeline
              </CardDescription>
            </div>
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Jobs</option>
              {reportData.jobs.map(job => (
                <option key={job.id} value={job.id}>{job.title}</option>
              ))}
            </select>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Applications
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Screening
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Interviews
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Hires
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Avg. Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Time to Hire
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {reportData.jobs
                    .filter(job => selectedJob === "all" || job.id === selectedJob)
                    .map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 dark:text-white">{job.title}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{job.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {job.applications}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {job.screeningCompleted}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {job.interviews}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {job.hires}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {job.avgScreeningScore}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {job.avgTimeToHire} days
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[job.status]}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleExport('pdf', `job-${job.id}`)}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            <FileDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleExport('excel', `job-${job.id}`)}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Candidate Reports */}
      {activeTab === "candidates" && (
        <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Candidate Evaluation Reports</CardTitle>
            <CardDescription>
              Detailed candidate performance across screening stages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Applied Job
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      AI Screening
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Technical
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Interview
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Final Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {reportData.candidates.map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 dark:text-white">{candidate.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {candidate.appliedJob}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-gray-900 dark:text-white font-medium">{candidate.screeningScore}%</span>
                          <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${statusColors[candidate.screeningStatus]}`}>
                            {candidate.screeningStatus}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {candidate.technicalScore ? (
                          <div className="flex items-center">
                            <span className="text-gray-900 dark:text-white font-medium">{candidate.technicalScore}%</span>
                            <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${statusColors[candidate.technicalStatus]}`}>
                              {candidate.technicalStatus}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {candidate.interviewScore ? (
                          <div className="flex items-center">
                            <span className="text-gray-900 dark:text-white font-medium">{candidate.interviewScore}/5</span>
                            <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${statusColors[candidate.interviewStatus]}`}>
                              {candidate.interviewStatus}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[candidate.overallStatus]}`}>
                          {candidate.overallStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleExport('pdf', `candidate-${candidate.id}`)}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            <FileDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RecruiterReports;