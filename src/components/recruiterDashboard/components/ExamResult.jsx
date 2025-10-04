import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Filter,
  Search,
  Eye,
  Send,
  Mail,
  FileText,
  Calendar,
  Award,
  Target,
  PieChart,
  BarChart,
  LineChart,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Star,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";

const ExamResults = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedExams, setSelectedExams] = useState([]);
  const [filters, setFilters] = useState({
    dateRange: "all",
    examType: "all",
    status: "all",
    scoreRange: "all",
    jobRole: "all"
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCandidate, setExpandedCandidate] = useState(null);

  // Sample data structure
  const resultsData = {
    overview: {
      totalExams: 45,
      completedExams: 38,
      averageScore: 72.5,
      passRate: 68,
      trendingUp: true,
      topPerformer: {
        name: "Alice Johnson",
        score: 95,
        exam: "Frontend Coding Challenge"
      },
      recentActivity: [
        { exam: "React Assessment", candidates: 12, date: "2025-01-20" },
        { exam: "System Design", candidates: 8, date: "2025-01-19" },
        { exam: "JavaScript Fundamentals", candidates: 15, date: "2025-01-18" }
      ]
    },
    candidateResults: [
      {
        id: 1,
        name: "Alice Johnson",
        email: "alice@mail.com",
        exam: "Frontend Coding Challenge",
        jobRole: "Frontend Developer",
        score: 85,
        maxScore: 100,
        percentage: 85,
        status: "Passed",
        timeSpent: "45m",
        totalTime: "60m",
        submittedAt: "2025-01-20T14:30:00Z",
        rank: 1,
        breakdown: {
          coding: { score: 40, max: 50, percentage: 80 },
          theory: { score: 25, max: 30, percentage: 83 },
          practical: { score: 20, max: 20, percentage: 100 }
        },
        strengths: ["React", "JavaScript", "Problem Solving"],
        weaknesses: ["CSS", "Time Management"],
        recommendation: "Strong candidate - Recommend for technical interview"
      },
      {
        id: 2,
        name: "Bob Smith",
        email: "bob@mail.com",
        exam: "Frontend Coding Challenge",
        jobRole: "Frontend Developer",
        score: 72,
        maxScore: 100,
        percentage: 72,
        status: "Passed",
        timeSpent: "55m",
        totalTime: "60m",
        submittedAt: "2025-01-20T15:45:00Z",
        rank: 2,
        breakdown: {
          coding: { score: 35, max: 50, percentage: 70 },
          theory: { score: 22, max: 30, percentage: 73 },
          practical: { score: 15, max: 20, percentage: 75 }
        },
        strengths: ["JavaScript", "Debugging"],
        weaknesses: ["React Hooks", "CSS Layout"],
        recommendation: "Good fundamentals - Consider for junior role"
      },
      {
        id: 3,
        name: "Carol Williams",
        email: "carol@mail.com",
        exam: "Backend System Design",
        jobRole: "Backend Engineer",
        score: 45,
        maxScore: 100,
        percentage: 45,
        status: "Failed",
        timeSpent: "35m",
        totalTime: "90m",
        submittedAt: "2025-01-19T11:20:00Z",
        rank: 8,
        breakdown: {
          architecture: { score: 20, max: 40, percentage: 50 },
          scalability: { score: 15, max: 30, percentage: 50 },
          security: { score: 10, max: 30, percentage: 33 }
        },
        strengths: ["Basic Concepts"],
        weaknesses: ["System Design", "Scalability", "Security"],
        recommendation: "Needs improvement - Consider re-evaluation after training"
      },
      {
        id: 4,
        name: "David Brown",
        email: "david@mail.com",
        exam: "Fullstack Assessment",
        jobRole: "Fullstack Developer",
        score: 92,
        maxScore: 100,
        percentage: 92,
        status: "Passed",
        timeSpent: "85m",
        totalTime: "120m",
        submittedAt: "2025-01-18T16:15:00Z",
        rank: 1,
        breakdown: {
          frontend: { score: 45, max: 50, percentage: 90 },
          backend: { score: 47, max: 50, percentage: 94 }
        },
        strengths: ["React", "Node.js", "Database Design", "API Development"],
        weaknesses: ["None identified"],
        recommendation: "Exceptional candidate - Fast-track to final interview"
      }
    ],
    analytics: {
      scoreDistribution: [5, 15, 45, 25, 10], // 0-20, 21-40, 41-60, 61-80, 81-100
      timeAnalysis: {
        averageTime: "52m",
        optimalTime: "45m",
        overtimeCandidates: 12,
        underTimeCandidates: 8
      },
      difficultyAnalysis: {
        easy: { correct: 85, total: 100, percentage: 85 },
        medium: { correct: 65, total: 100, percentage: 65 },
        hard: { correct: 35, total: 100, percentage: 35 }
      },
      trendData: [
        { month: "Jan", averageScore: 68, passRate: 62 },
        { month: "Feb", averageScore: 72, passRate: 65 },
        { month: "Mar", averageScore: 75, passRate: 68 },
        { month: "Apr", averageScore: 71, passRate: 66 },
        { month: "May", averageScore: 73, passRate: 67 }
      ]
    }
  };

  const filterOptions = {
    dateRange: [
      { value: "all", label: "All Time" },
      { value: "7d", label: "Last 7 Days" },
      { value: "30d", label: "Last 30 Days" },
      { value: "90d", label: "Last 90 Days" }
    ],
    examType: [
      { value: "all", label: "All Exams" },
      { value: "coding", label: "Coding Challenges" },
      { value: "written", label: "Written Tests" },
      { value: "interview", label: "Interviews" },
      { value: "aptitude", label: "Aptitude Tests" }
    ],
    status: [
      { value: "all", label: "All Status" },
      { value: "passed", label: "Passed" },
      { value: "failed", label: "Failed" },
      { value: "pending", label: "Pending" }
    ],
    scoreRange: [
      { value: "all", label: "All Scores" },
      { value: "0-50", label: "0-50%" },
      { value: "50-75", label: "50-75%" },
      { value: "75-100", label: "75-100%" }
    ],
    jobRole: [
      { value: "all", label: "All Roles" },
      { value: "frontend", label: "Frontend" },
      { value: "backend", label: "Backend" },
      { value: "fullstack", label: "Fullstack" },
      { value: "devops", label: "DevOps" }
    ]
  };

  const filteredCandidates = resultsData.candidateResults.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.exam.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = 
      (filters.examType === "all" || candidate.exam.toLowerCase().includes(filters.examType)) &&
      (filters.status === "all" || candidate.status.toLowerCase() === filters.status) &&
      (filters.jobRole === "all" || candidate.jobRole.toLowerCase().includes(filters.jobRole)) &&
      (filters.scoreRange === "all" || {
        "0-50": candidate.percentage <= 50,
        "50-75": candidate.percentage > 50 && candidate.percentage <= 75,
        "75-100": candidate.percentage > 75
      }[filters.scoreRange]);

    return matchesSearch && matchesFilters;
  });

  const handleBulkAction = (action) => {
    if (selectedExams.length === 0) {
      alert("Please select at least one candidate");
      return;
    }

    switch (action) {
      case 'shortlist':
        alert(`Shortlisted ${selectedExams.length} candidates`);
        break;
      case 'reject':
        alert(`Rejected ${selectedExams.length} candidates`);
        break;
      case 'email':
        alert(`Sending emails to ${selectedExams.length} candidates`);
        break;
      case 'export':
        handleExportResults();
        break;
    }
  };

  const handleExportResults = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      filters: filters,
      results: filteredCandidates,
      overview: resultsData.overview
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `exam-results-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toggleCandidateExpansion = (candidateId) => {
    setExpandedCandidate(expandedCandidate === candidateId ? null : candidateId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Passed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exam Results & Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive analysis of candidate performance and exam results
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleExportResults()}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Results
          </Button>
          <Button
            onClick={() => handleBulkAction('email')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Send className="h-4 w-4 mr-2" />
            Notify Candidates
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardContent className="p-4">
          <div className="flex space-x-1 overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "results", label: "Exam Results", icon: FileText },
              { id: "candidates", label: "Candidate Results", icon: Users },
              { id: "analytics", label: "Analytics", icon: TrendingUp },
              { id: "actions", label: "Actions", icon: Target }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 ${
                    activeTab === tab.id 
                      ? "bg-blue-600 text-white" 
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search candidates, exams, or emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.keys(filters).map((filterKey) => (
                <select
                  key={filterKey}
                  value={filters[filterKey]}
                  onChange={(e) => setFilters(prev => ({ ...prev, [filterKey]: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {filterOptions[filterKey].map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Exams</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{resultsData.overview.totalExams}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Score</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {resultsData.overview.averageScore}%
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">+5.2%</span>
                    </div>
                  </div>
                  <BarChart3 className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pass Rate</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {resultsData.overview.passRate}%
                    </p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Time</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {resultsData.analytics.timeAnalysis.averageTime}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performer and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  Top Performer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                        <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {resultsData.overview.topPerformer.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {resultsData.overview.topPerformer.exam}
                      </p>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 mt-1">
                        Score: {resultsData.overview.topPerformer.score}%
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {resultsData.overview.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{activity.exam}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {activity.candidates} candidates
                        </p>
                      </div>
                      <Badge variant="outline">{activity.date}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Candidate Results Tab */}
      {activeTab === "candidates" && (
        <div className="space-y-6">
          {/* Bulk Actions */}
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => handleBulkAction('shortlist')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ThumbsUp className="h-4 w-4" />
                  Shortlist Selected ({selectedExams.length})
                </Button>
                <Button
                  onClick={() => handleBulkAction('reject')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ThumbsDown className="h-4 w-4" />
                  Reject Selected
                </Button>
                <Button
                  onClick={() => handleBulkAction('email')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Send Email
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Candidates List */}
          <div className="space-y-4">
            {filteredCandidates.map((candidate) => (
              <Card key={candidate.id} className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Candidate Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{candidate.name}</h3>
                        <Badge className={getStatusColor(candidate.status)}>
                          {candidate.status}
                        </Badge>
                        <Badge variant="outline">Rank: #{candidate.rank}</Badge>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Email</p>
                          <p className="text-gray-900 dark:text-white">{candidate.email}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Exam</p>
                          <p className="text-gray-900 dark:text-white">{candidate.exam}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Score</p>
                          <p className={`font-semibold ${getScoreColor(candidate.percentage)}`}>
                            {candidate.score}/{candidate.maxScore} ({candidate.percentage}%)
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Time</p>
                          <p className="text-gray-900 dark:text-white">{candidate.timeSpent}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleCandidateExpansion(candidate.id)}
                      >
                        {expandedCandidate === candidate.id ? (
                          <ChevronUp className="h-4 w-4 mr-2" />
                        ) : (
                          <ChevronDown className="h-4 w-4 mr-2" />
                        )}
                        Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedExams(prev => 
                          prev.includes(candidate.id) 
                            ? prev.filter(id => id !== candidate.id)
                            : [...prev, candidate.id]
                        )}
                      >
                        {selectedExams.includes(candidate.id) ? "Selected" : "Select"}
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedCandidate === candidate.id && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
                      {/* Score Breakdown */}
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Score Breakdown</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {Object.entries(candidate.breakdown).map(([section, data]) => (
                            <div key={section} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                              <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                {section}
                              </p>
                              <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                                {data.score}/{data.max} ({data.percentage}%)
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Analysis */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Strengths</h4>
                          <div className="flex flex-wrap gap-2">
                            {candidate.strengths.map((strength, index) => (
                              <Badge key={index} className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                {strength}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Areas for Improvement</h4>
                          <div className="flex flex-wrap gap-2">
                            {candidate.weaknesses.map((weakness, index) => (
                              <Badge key={index} className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                                {weakness}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Recommendation */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Target className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-blue-900 dark:text-blue-300">Recommendation</h4>
                            <p className="text-blue-800 dark:text-blue-400 mt-1">{candidate.recommendation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Score Distribution */}
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-blue-600" />
                  Score Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { range: "81-100%", count: resultsData.analytics.scoreDistribution[4], color: "bg-green-500" },
                    { range: "61-80%", count: resultsData.analytics.scoreDistribution[3], color: "bg-blue-500" },
                    { range: "41-60%", count: resultsData.analytics.scoreDistribution[2], color: "bg-yellow-500" },
                    { range: "21-40%", count: resultsData.analytics.scoreDistribution[1], color: "bg-orange-500" },
                    { range: "0-20%", count: resultsData.analytics.scoreDistribution[0], color: "bg-red-500" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{item.range}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${item.color}`}
                            style={{ width: `${item.count}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                          {item.count}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Difficulty Analysis */}
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-green-600" />
                  Difficulty Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(resultsData.analytics.difficultyAnalysis).map(([difficulty, data]) => (
                    <div key={difficulty}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400 capitalize">{difficulty}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{data.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-green-500"
                          style={{ width: `${data.percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {data.correct}/{data.total} questions correct
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Time Analysis */}
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                Time Management Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {resultsData.analytics.timeAnalysis.averageTime}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Average Time</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {resultsData.analytics.timeAnalysis.overtimeCandidates}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Overtime Candidates</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {resultsData.analytics.timeAnalysis.underTimeCandidates}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Early Finishers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Actions Tab */}
      {activeTab === "actions" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" variant="outline">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Shortlist Top Performers
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Bulk Notifications
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Comprehensive Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Create Performance Certificates
                </Button>
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  Smart Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-300">Top Performers</p>
                    <p className="text-sm text-green-800 dark:text-green-400 mt-1">
                      12 candidates scored above 85%. Ready for technical interviews.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-900 dark:text-yellow-300">Need Re-evaluation</p>
                    <p className="text-sm text-yellow-800 dark:text-yellow-400 mt-1">
                      8 candidates showed potential but need additional assessment.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-300">Training Opportunities</p>
                    <p className="text-sm text-blue-800 dark:text-blue-400 mt-1">
                      Identified common weak areas: System Design (45% success rate)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamResults;