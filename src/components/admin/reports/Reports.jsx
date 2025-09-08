import React, { useState } from "react";
import {
  BarChart3,
  Download,
  Filter,
  Eye,
  Users,
  Briefcase,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Award,
  Calendar,
  PieChart,
} from "lucide-react";
import { Button } from "../../recruiterDashboard/ui/button";
import { Card, CardContent } from "../../recruiterDashboard/ui/card";
import { Badge } from "../../../components/recruiterDashboard/ui/badge";

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Mock data for reports
  const reportStats = {
    totalApplications: 1247,
    totalExams: 589,
    totalInterviews: 342,
    totalHires: 89,
    successRate: 25.4,
  };

  const recruiterReports = [
    {
      id: 1,
      name: "Emma Wilson",
      company: "Tech Innovations Inc.",
      jobsPosted: 8,
      applicationsReceived: 245,
      examsScheduled: 124,
      interviewsConducted: 78,
      finalHires: 12,
    },
    {
      id: 2,
      name: "Michael Chen",
      company: "Data Solutions Ltd.",
      jobsPosted: 5,
      applicationsReceived: 187,
      examsScheduled: 92,
      interviewsConducted: 45,
      finalHires: 8,
    },
    {
      id: 3,
      name: "Sophia Rodriguez",
      company: "Creative Minds Agency",
      jobsPosted: 3,
      applicationsReceived: 96,
      examsScheduled: 42,
      interviewsConducted: 18,
      finalHires: 4,
    },
    {
      id: 4,
      name: "James Taylor",
      company: "Global Enterprises",
      jobsPosted: 12,
      applicationsReceived: 432,
      examsScheduled: 210,
      interviewsConducted: 124,
      finalHires: 22,
    },
  ];

  const candidateReports = [
    {
      id: 1,
      name: "Alice Johnson",
      applicationsSubmitted: 12,
      examsTaken: 8,
      examScores: "85% avg",
      interviewsAttended: 4,
      finalResult: "Hired",
    },
    {
      id: 2,
      name: "Bob Smith",
      applicationsSubmitted: 8,
      examsTaken: 5,
      examScores: "72% avg",
      interviewsAttended: 2,
      finalResult: "Shortlisted",
    },
    {
      id: 3,
      name: "Carol Williams",
      applicationsSubmitted: 5,
      examsTaken: 3,
      examScores: "68% avg",
      interviewsAttended: 1,
      finalResult: "Rejected",
    },
    {
      id: 4,
      name: "David Brown",
      applicationsSubmitted: 15,
      examsTaken: 10,
      examScores: "91% avg",
      interviewsAttended: 6,
      finalResult: "Hired",
    },
  ];

  const conversionMetrics = {
    applicationToExam: 65.2,
    examToInterview: 58.1,
    interviewToHire: 26.0,
  };

  const statusColors = {
    Hired: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Shortlisted: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    Rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  };

  const timePeriods = ["Last 7 days", "Last 30 days", "Last 90 days", "This year"];
  const [selectedPeriod, setSelectedPeriod] = useState("Last 30 days");

  if (selectedRecruiter) {
    return (
      <RecruiterDetailView 
        recruiter={selectedRecruiter} 
        onBack={() => setSelectedRecruiter(null)} 
      />
    );
  }

  if (selectedCandidate) {
    return (
      <CandidateDetailView 
        candidate={selectedCandidate} 
        onBack={() => setSelectedCandidate(null)} 
      />
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered insights into your recruitment process
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-gray-300 dark:border-gray-600">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" className="border-gray-300 dark:border-gray-600">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Time Period Selector */}
      <div className="flex flex-wrap gap-2">
        {timePeriods.map(period => (
          <Button
            key={period}
            variant={selectedPeriod === period ? "default" : "outline"}
            className={selectedPeriod === period ? 
              "bg-blue-600 hover:bg-blue-700 text-white" : 
              "border-gray-300 dark:border-gray-600"
            }
            onClick={() => setSelectedPeriod(period)}
          >
            {period}
          </Button>
        ))}
      </div>

      {/* Tabs */}
      <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardContent className="p-4">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              className={`px-4 py-2 font-medium text-sm focus:outline-none ${
                activeTab === "overview"
                  ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm focus:outline-none ${
                activeTab === "recruiters"
                  ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("recruiters")}
            >
              Recruiter Reports
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm focus:outline-none ${
                activeTab === "candidates"
                  ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("candidates")}
            >
              Candidate Reports
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Overview Dashboard */}
      {activeTab === "overview" && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Applications</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {reportStats.totalApplications}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Exams Conducted</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {reportStats.totalExams}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Interviews</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {reportStats.totalInterviews}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <Award className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Successful Hires</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {reportStats.totalHires}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conversion Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Application to Exam</h3>
                <div className="flex items-center justify-between">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${conversionMetrics.applicationToExam}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                    {conversionMetrics.applicationToExam}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Exam to Interview</h3>
                <div className="flex items-center justify-between">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-purple-600 h-2.5 rounded-full" 
                      style={{ width: `${conversionMetrics.examToInterview}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                    {conversionMetrics.examToInterview}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Interview to Hire</h3>
                <div className="flex items-center justify-between">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ width: `${conversionMetrics.interviewToHire}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                    {conversionMetrics.interviewToHire}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Recruiters */}
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-4">Top Recruiters</h3>
                <div className="space-y-4">
                  {recruiterReports.slice(0, 3).map((recruiter, index) => (
                    <div key={recruiter.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            {recruiter.name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{recruiter.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{recruiter.company}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{recruiter.finalHires} hires</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{recruiter.jobsPosted} jobs</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Candidates */}
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-4">Top Candidates</h3>
                <div className="space-y-4">
                  {candidateReports.filter(c => c.finalResult === "Hired").slice(0, 3).map((candidate, index) => (
                    <div key={candidate.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">
                            {candidate.name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{candidate.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{candidate.examScores}</p>
                        </div>
                      </div>
                      <Badge className={statusColors[candidate.finalResult]}>
                        {candidate.finalResult}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Recruiter Reports */}
      {activeTab === "recruiters" && (
        <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardContent className="p-0">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recruiter Performance Reports</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Recruiter
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Jobs Posted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Applications
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Exams
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Interviews
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Hires
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recruiterReports.map((recruiter) => (
                    <tr key={recruiter.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{recruiter.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{recruiter.company}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {recruiter.jobsPosted}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {recruiter.applicationsReceived}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {recruiter.examsScheduled}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {recruiter.interviewsConducted}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {recruiter.finalHires}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedRecruiter(recruiter)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
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
          <CardContent className="p-0">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Candidate Performance Reports</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Applications
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Exams Taken
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Avg. Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Interviews
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Result
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {candidateReports.map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 dark:text-white">{candidate.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {candidate.applicationsSubmitted}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {candidate.examsTaken}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {candidate.examScores}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {candidate.interviewsAttended}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={statusColors[candidate.finalResult]}>
                          {candidate.finalResult}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedCandidate(candidate)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
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

// Recruiter Detail View Component
const RecruiterDetailView = ({ recruiter, onBack }) => {
  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
      >
        ← Back to reports
      </Button>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{recruiter.name}</h1>
          <p className="text-gray-600 dark:text-gray-400">{recruiter.company}</p>
        </div>
        <Button variant="outline" className="mt-4 md:mt-0 border-gray-300 dark:border-gray-600">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{recruiter.jobsPosted}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Jobs Posted</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{recruiter.applicationsReceived}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Applications Received</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{recruiter.interviewsConducted}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Interviews Conducted</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{recruiter.finalHires}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Successful Hires</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardContent className="p-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Conversion Rate</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {((recruiter.finalHires / recruiter.applicationsReceived) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${(recruiter.finalHires / recruiter.applicationsReceived) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Interview Rate</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {((recruiter.interviewsConducted / recruiter.applicationsReceived) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{ width: `${(recruiter.interviewsConducted / recruiter.applicationsReceived) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Candidate Detail View Component
const CandidateDetailView = ({ candidate, onBack }) => {
  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
      >
        ← Back to reports
      </Button>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{candidate.name}</h1>
          <p className="text-gray-600 dark:text-gray-400">Candidate Performance Report</p>
        </div>
        <Badge className={statusColors[candidate.finalResult]}>
          {candidate.finalResult}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{candidate.applicationsSubmitted}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Applications Submitted</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{candidate.examsTaken}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Exams Taken</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{candidate.interviewsAttended}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Interviews Attended</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{candidate.examScores}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Average Score</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardContent className="p-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-4">Performance Overview</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Application Completion</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">100%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `100%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Exam Participation</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {((candidate.examsTaken / candidate.applicationsSubmitted) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{ width: `${(candidate.examsTaken / candidate.applicationsSubmitted) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Interview Conversion</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {((candidate.interviewsAttended / candidate.applicationsSubmitted) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-purple-600 h-2.5 rounded-full" 
                  style={{ width: `${(candidate.interviewsAttended / candidate.applicationsSubmitted) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;