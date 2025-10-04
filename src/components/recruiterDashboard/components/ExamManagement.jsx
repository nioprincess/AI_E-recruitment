import React, { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Plus,
  Calendar,
  Users,
  ClipboardList,
  Eye,
  Edit,
  Trash2,
  Search,
  X,
  Clock,
  LinkIcon,
  Monitor,
  Building,
  BookOpen,
  Code,
  Brain,
  FileText,
  Send,
  ChevronDown,
  ChevronUp,
  Archive,
  Download,
  Filter,
  BarChart3,
  HardDrive,
  CheckCircle2,
  Smartphone,
  Bell,
  Target,
  Zap,
  Settings,
  BrainCircuit,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";

const ExamManagement = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showCreateExam, setShowCreateExam] = useState(false);
  const [showScheduleExam, setShowScheduleExam] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [currentExam, setCurrentExam] = useState(null);
  const [currentJob, setCurrentJob] = useState(null);
  const [expandedJobs, setExpandedJobs] = useState({});
  const [activeTab, setActiveTab] = useState("active"); // active, completed, archived
  const [examForm, setExamForm] = useState({
    job: "",
    exams: [],
  });
  const [newExam, setNewExam] = useState({
    title: "",
    type: "written",
    level: "screening",
    mode: "online",
    duration: 60,
    deadlineType: "fixed",
    deadline: "",
    instructions: "",
  });
  const [scheduleForm, setScheduleForm] = useState({
    scheduledDate: "",
    sendNotification: true,
    emailMessage: "You have been shortlisted for the following exam. Please find the schedule and details below:",
  });
  const dropdownRefs = useRef({});

  // Enhanced jobs with status management
  const [jobs, setJobs] = useState([
    { 
      id: 1, 
      title: "Frontend Developer", 
      createdAt: "2025-01-15",
      status: "active",
      archivedAt: null,
      candidateCount: 3,
      autoCompleted: false
    },
    { 
      id: 2, 
      title: "Product Manager", 
      createdAt: "2025-01-10",
      status: "active", 
      archivedAt: null,
      candidateCount: 2,
      autoCompleted: false
    },
    { 
      id: 3, 
      title: "Backend Engineer", 
      createdAt: "2025-01-08",
      status: "completed",
      archivedAt: null,
      candidateCount: 5,
      autoCompleted: true
    },
    { 
      id: 4, 
      title: "DevOps Specialist", 
      createdAt: "2024-12-15",
      status: "archived",
      archivedAt: "2025-01-20",
      candidateCount: 4,
      autoCompleted: true
    },
  ]);

  const [examsByJob, setExamsByJob] = useState({
    1: [
      { 
        id: 1, 
        title: "Frontend Coding Challenge", 
        type: "coding", 
        level: "technical", 
        mode: "online", 
        duration: 120, 
        deadlineType: "fixed", 
        deadline: "2025-09-15T23:59", 
        status: "Scheduled", 
        link: "https://exam-platform.com/assessment/abcd1234",
        scheduledDate: "2025-09-10T14:00",
        instructions: "Complete the React coding challenge within the time limit.",
        candidateCount: 3,
        createdAt: "2025-01-15T10:00:00"
      },
      { 
        id: 2, 
        title: "Technical Interview", 
        type: "case study", 
        level: "final", 
        mode: "online", 
        duration: 90, 
        deadlineType: "flexible", 
        deadline: "2025-09-20T23:59", 
        status: "Draft", 
        link: "",
        scheduledDate: "",
        instructions: "Prepare a technical discussion on system design.",
        candidateCount: 2,
        createdAt: "2025-01-16T14:00:00"
      },
    ],
    2: [
      { 
        id: 3, 
        title: "Product Sense Interview", 
        type: "case study", 
        level: "final", 
        mode: "onsite", 
        duration: 90, 
        deadlineType: "flexible", 
        deadline: "2025-09-20T23:59", 
        status: "Scheduled", 
        link: "",
        scheduledDate: "2025-09-18T10:00",
        instructions: "Prepare a product critique for the given case study.",
        candidateCount: 2,
        createdAt: "2025-01-12T09:00:00"
      },
    ],
    3: [
      { 
        id: 4, 
        title: "System Design Interview", 
        type: "interview", 
        level: "final", 
        mode: "online", 
        duration: 120, 
        deadlineType: "fixed", 
        deadline: "2024-12-20T23:59", 
        status: "Completed", 
        link: "",
        scheduledDate: "2024-12-15T14:00",
        instructions: "Design a scalable system architecture.",
        candidateCount: 5,
        createdAt: "2024-12-01T10:00:00",
        completedAt: "2024-12-21T00:00:00",
        completedAutomatically: true
      },
    ],
    4: [
      { 
        id: 5, 
        title: "Infrastructure Coding Test", 
        type: "coding", 
        level: "technical", 
        mode: "online", 
        duration: 90, 
        deadlineType: "fixed", 
        deadline: "2024-12-10T23:59", 
        status: "Completed", 
        link: "",
        scheduledDate: "2024-12-05T10:00",
        instructions: "Complete the infrastructure automation challenge.",
        candidateCount: 4,
        createdAt: "2024-11-20T14:00:00",
        completedAt: "2024-12-11T00:00:00",
        completedAutomatically: true
      },
    ]
  });

  const candidates = [
    { id: 1, name: "Alice Johnson", email: "alice@mail.com", stage: "Written Test", status: "Passed", score: 85, shortlisted: true },
    { id: 2, name: "Bob Smith", email: "bob@mail.com", stage: "Technical Test", status: "Pending", score: null, shortlisted: true },
    { id: 3, name: "Carol Williams", email: "carol@mail.com", stage: "Interview", status: "Scheduled", score: null, shortlisted: false },
  ];

  // Auto-completion check - runs every minute
  useEffect(() => {
    const checkExamCompletion = () => {
      const now = new Date();
      let hasUpdates = false;
      
      const updatedExamsByJob = { ...examsByJob };
      
      Object.keys(updatedExamsByJob).forEach(jobId => {
        updatedExamsByJob[jobId] = updatedExamsByJob[jobId].map(exam => {
          // Auto-complete exams that have passed their deadline
          if (exam.status === "Scheduled" && exam.deadline && new Date(exam.deadline) < now) {
            hasUpdates = true;
            return {
              ...exam,
              status: "Completed",
              completedAt: now.toISOString(),
              completedAutomatically: true
            };
          }
          return exam;
        });
      });
      
      if (hasUpdates) {
        setExamsByJob(updatedExamsByJob);
        console.log("Auto-completed exams based on deadlines");
      }
    };

    // Check immediately on mount
    checkExamCompletion();
    
    // Set up interval to check every minute
    const interval = setInterval(checkExamCompletion, 60000);
    
    return () => clearInterval(interval);
  }, [examsByJob]);

  // Auto-update job status based on exam completion
  useEffect(() => {
    const updateJobStatus = () => {
      let hasUpdates = false;
      const updatedJobs = [...jobs];
      
      updatedJobs.forEach(job => {
        if (job.status === "active") {
          const jobExams = getExamsForJob(job.id);
          const allExamsCompleted = jobExams.length > 0 && jobExams.every(exam => exam.status === "Completed");
          
          if (allExamsCompleted && !job.autoCompleted) {
            hasUpdates = true;
            job.status = "completed";
            job.autoCompleted = true;
          }
        }
      });
      
      if (hasUpdates) {
        setJobs(updatedJobs);
        console.log("Auto-updated job status based on exam completion");
      }
    };

    updateJobStatus();
  }, [examsByJob, jobs]);

  // Filter jobs based on active tab
  const getFilteredJobs = () => {
    return jobs.filter(job => job.status === activeTab);
  };

  const getJobsWithExams = () => {
    const filteredJobs = getFilteredJobs();
    return filteredJobs.filter(job => {
      const jobExams = getExamsForJob(job.id);
      return jobExams && jobExams.length > 0;
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.values(dropdownRefs.current).forEach(ref => {
        if (ref && !ref.contains(event.target)) {
          setOpenDropdown(null);
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const stages = [
    { id: 1, name: "Written Test", type: "Exam", scheduled: "2025-09-10", status: "Scheduled", examId: 1 },
    { id: 2, name: "Technical Test", type: "Exam", scheduled: "2025-09-15", status: "Not Scheduled" },
    { id: 3, name: "Interview", type: "Interview", scheduled: "2025-09-20", status: "Scheduled", examId: 2 },
  ];

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const toggleJobExpansion = (jobId) => {
    setExpandedJobs(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
  };

  const statusColors = {
    Scheduled: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "Not Scheduled": "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    Draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    Passed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    Completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    Archived: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  };

  const jobStatusColors = {
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    archived: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  };

  const examTypes = [
    { value: "written", label: "Written Test", icon: <FileText className="h-4 w-4" /> },
    { value: "coding", label: "Coding Challenge", icon: <Code className="h-4 w-4" /> },
    { value: "aptitude", label: "Aptitude Test", icon: <Brain className="h-4 w-4" /> },
    { value: "case study", label: "Case Study", icon: <BookOpen className="h-4 w-4" /> },
    { value: "interview", label: "Interview", icon: <Users className="h-4 w-4" /> },
  ];

  const examLevels = [
    { value: "screening", label: "Stage 1 (Screening)" },
    { value: "technical", label: "Stage 2 (Technical)" },
    { value: "final", label: "Stage 3 (Final)" },
  ];

  // Get current date-time in the format needed for datetime-local input
  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  // Validate if a datetime is in the future
  const isFutureDateTime = (datetime) => {
    return new Date(datetime) > new Date();
  };

  const addExamToForm = () => {
    if (newExam.title.trim() === "") {
      alert("Please enter an exam title");
      return;
    }

    // Validate deadline if it's fixed type
    if (newExam.deadlineType === "fixed" && newExam.deadline && !isFutureDateTime(newExam.deadline)) {
      alert("Please select a future date and time for the deadline");
      return;
    }

    setExamForm(prev => ({
      ...prev,
      exams: [...prev.exams, { ...newExam, id: Date.now(), status: "Draft" }]
    }));

    // Reset new exam form
    setNewExam({
      title: "",
      type: "written",
      level: "screening",
      mode: "online",
      duration: 60,
      deadlineType: "fixed",
      deadline: "",
      instructions: "",
    });
  };

  const removeExamFromForm = (examId) => {
    setExamForm(prev => ({
      ...prev,
      exams: prev.exams.filter(exam => exam.id !== examId)
    }));
  };

  const handleCreateExams = () => {
    if (!examForm.job) {
      alert("Please select a job");
      return;
    }

    if (examForm.exams.length === 0) {
      alert("Please add at least one exam");
      return;
    }

    // Add exams to the state
    const jobId = parseInt(examForm.job);
    const newExams = examForm.exams.map(exam => ({
      ...exam,
      id: Date.now() + Math.random(), // Ensure unique IDs
      candidateCount: 0,
      createdAt: new Date().toISOString()
    }));

    setExamsByJob(prev => ({
      ...prev,
      [jobId]: [...(prev[jobId] || []), ...newExams]
    }));

    // Show success message
    alert(`Successfully created ${examForm.exams.length} exams for ${jobs.find(j => j.id === jobId)?.title}!`);

    // Reset form and close modal
    setExamForm({
      job: "",
      exams: [],
    });
    setShowCreateExam(false);
  };

  const handleScheduleExam = () => {
    if (!scheduleForm.scheduledDate) {
      alert("Please select a schedule date and time");
      return;
    }

    if (!isFutureDateTime(scheduleForm.scheduledDate)) {
      alert("Please select a future date and time for the schedule");
      return;
    }

    // Update the exam status to scheduled
    const jobId = Object.keys(examsByJob).find(jobId => 
      examsByJob[jobId].some(exam => exam.id === currentExam.id)
    );

    if (jobId) {
      setExamsByJob(prev => ({
        ...prev,
        [jobId]: prev[jobId].map(exam => 
          exam.id === currentExam.id 
            ? { ...exam, status: "Scheduled", scheduledDate: scheduleForm.scheduledDate }
            : exam
        )
      }));
    }

    if (scheduleForm.sendNotification) {
      const shortlistedCandidates = candidates.filter(c => c.shortlisted);
      console.log("Notifying candidates:", shortlistedCandidates);
    }

    setShowScheduleExam(false);
    setCurrentExam(null);
    
    // Show success message
    alert("Exam scheduled successfully! Candidates have been notified.");
  };

  const openScheduleModal = (exam) => {
    setCurrentExam(exam);
    setScheduleForm({
      scheduledDate: exam.scheduledDate || "",
      sendNotification: true,
      emailMessage: "You have been shortlisted for the following exam. Please find the schedule and details below:",
    });
    setShowScheduleExam(true);
  };

  const handleArchiveJob = (jobId) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { 
            ...job, 
            status: "archived",
            archivedAt: new Date().toISOString()
          }
        : job
    ));
    setCurrentJob(null);
    
    alert('Job archived successfully! It will be kept for records.');
  };

  const handleExportJobData = (jobId, format = 'json') => {
    const job = jobs.find(j => j.id === jobId);
    const jobExams = getExamsForJob(jobId);
    
    const exportData = {
      job: {
        ...job,
        totalExams: jobExams.length,
        completedExams: jobExams.filter(e => e.status === 'Completed').length,
        pendingExams: jobExams.filter(e => e.status !== 'Completed').length,
      },
      exams: jobExams,
      exportInfo: {
        exportedAt: new Date().toISOString(),
        format: format,
        totalRecords: jobExams.length + 1
      }
    };
    
    // Simulate file download
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `job-${job.title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setShowExportModal(false);
    alert(`Data exported successfully for ${job.title}!`);
  };

  const openExportModal = (job) => {
    setCurrentJob(job);
    setShowExportModal(true);
  };

  const getExamTypeIcon = (type) => {
    return examTypes.find(t => t.value === type)?.icon || <FileText className="h-4 w-4" />;
  };

  const getExamsForJob = (jobId) => {
    return examsByJob[jobId] || [];
  };

  // Calculate storage statistics
  const getStorageStats = () => {
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(j => j.status === 'active').length;
    const completedJobs = jobs.filter(j => j.status === 'completed').length;
    const archivedJobs = jobs.filter(j => j.status === 'archived').length;
    const totalExams = Object.values(examsByJob).flat().length;
    const autoCompletedExams = Object.values(examsByJob).flat().filter(e => e.completedAutomatically).length;
    
    return { totalJobs, activeJobs, completedJobs, archivedJobs, totalExams, autoCompletedExams };
  };

  const storageStats = getStorageStats();

  // Check if all exams in a job are completed
  const isJobFullyCompleted = (jobId) => {
    const jobExams = getExamsForJob(jobId);
    return jobExams.length > 0 && jobExams.every(exam => exam.status === "Completed");
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Exam Management</h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
            Create, schedule, and manage candidate exams with automatic scoring & notifications.
            <span className="text-green-600 dark:text-green-400 font-medium"> AI-powered passing scores & instant results.</span>
          </p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
          onClick={() => setShowCreateExam(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Create Exams</span>
          <span className="sm:hidden">Create</span>
        </Button>
      </div>

      {/* Storage Stats - Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Jobs</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{storageStats.totalJobs}</p>
              </div>
              <ClipboardList className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Active Jobs</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{storageStats.activeJobs}</p>
              </div>
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Auto-Completed</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{storageStats.autoCompletedExams}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">exams</p>
              </div>
              <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Exams</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{storageStats.totalExams}</p>
              </div>
              <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Auto-completion notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Smart Automation Active</p>
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-0.5">
              Exams auto-complete when deadlines pass. AI suggests passing scores. Automatic result notifications enabled.
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation - Responsive */}
      <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardContent className="p-3">
          <div className="flex space-x-1 overflow-x-auto pb-1 -mx-2 px-2">
            <Button
              variant={activeTab === "active" ? "default" : "ghost"}
              onClick={() => setActiveTab("active")}
              className={`flex-shrink-0 text-xs sm:text-sm ${
                activeTab === "active" 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Active ({storageStats.activeJobs})
            </Button>
            <Button
              variant={activeTab === "completed" ? "default" : "ghost"}
              onClick={() => setActiveTab("completed")}
              className={`flex-shrink-0 text-xs sm:text-sm ${
                activeTab === "completed" 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <ClipboardList className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Completed ({storageStats.completedJobs})
            </Button>
            <Button
              variant={activeTab === "archived" ? "default" : "ghost"}
              onClick={() => setActiveTab("archived")}
              className={`flex-shrink-0 text-xs sm:text-sm ${
                activeTab === "archived" 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Archive className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Archived ({storageStats.archivedJobs})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Jobs and Exams Summary Dashboard - Fully Responsive */}
      <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardContent className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
            {activeTab === 'active' && 'Active Jobs & Exams'}
            {activeTab === 'completed' && 'Completed Jobs'}
            {activeTab === 'archived' && 'Archived Jobs'}
          </h2>
          
          {getJobsWithExams().length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <ClipboardList className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
                {activeTab === 'active' && 'No active jobs with exams'}
                {activeTab === 'completed' && 'No completed jobs'}
                {activeTab === 'archived' && 'No archived jobs'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 max-w-sm mx-auto">
                {activeTab === 'active' && 'Get started by creating exams for your jobs.'}
                {activeTab === 'completed' && 'Jobs will appear here once all exams are completed.'}
                {activeTab === 'archived' && 'Jobs will appear here once they are archived.'}
              </p>
              {activeTab === 'active' && (
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setShowCreateExam(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Exams
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {getJobsWithExams().map((job) => {
                const jobExams = getExamsForJob(job.id);
                const isExpanded = expandedJobs[job.id];
                const isFullyCompleted = isJobFullyCompleted(job.id);
                
                return (
                  <div key={job.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    {/* Job Header - Responsive */}
                    <div 
                      className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => toggleJobExpansion(job.id)}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex-shrink-0">
                          <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate text-sm sm:text-base">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-0.5">
                            <Badge className={`text-xs ${jobStatusColors[job.status]}`}>
                              <span className="hidden sm:inline">
                                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                              </span>
                              <span className="sm:hidden">
                                {job.status.charAt(0).toUpperCase()}
                              </span>
                              {job.autoCompleted && " (A)"}
                            </Badge>
                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                              {jobExams.length} exam{jobExams.length !== 1 ? 's' : ''} • {job.candidateCount} cand
                            </p>
                            {isFullyCompleted && activeTab === 'active' && (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs">
                                Ready
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    {/* Expanded Exams List - Responsive */}
                    {isExpanded && (
                      <div className="p-3 sm:p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3 sm:mb-4">
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Exams</h4>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => openExportModal(job)}
                              variant="outline"
                              size="sm"
                              className="text-xs h-8"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              <span className="hidden sm:inline">Export</span>
                              <span className="sm:hidden">Export</span>
                            </Button>
                            {job.status === 'active' && isFullyCompleted && (
                              <Button
                                onClick={() => handleArchiveJob(job.id)}
                                variant="outline"
                                size="sm"
                                className="text-xs h-8"
                              >
                                <Archive className="h-3 w-3 mr-1" />
                                <span className="hidden sm:inline">Archive</span>
                                <span className="sm:hidden">Archive</span>
                              </Button>
                            )}
                            {job.status === 'completed' && (
                              <Button
                                onClick={() => handleArchiveJob(job.id)}
                                variant="outline"
                                size="sm"
                                className="text-xs h-8"
                              >
                                <Archive className="h-3 w-3 mr-1" />
                                <span className="hidden sm:inline">Archive</span>
                                <span className="sm:hidden">Archive</span>
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          {jobExams.map((exam) => (
                            <div key={exam.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-3 border border-gray-200 dark:border-gray-700 rounded-lg gap-2 sm:gap-0">
                              <div className="flex items-start sm:items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                <div className="flex-shrink-0 mt-0.5 sm:mt-0">
                                  {getExamTypeIcon(exam.type)}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                                    {exam.title}
                                  </h4>
                                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-0.5">
                                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs">
                                      {examTypes.find(t => t.value === exam.type)?.label}
                                    </Badge>
                                    <Badge className={`text-xs ${statusColors[exam.status]}`}>
                                      {exam.status}
                                      {exam.completedAutomatically && " (A)"}
                                    </Badge>
                                    {renderNotificationBadge(exam)}
                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                      Pass: {exam.passingScore}%
                                    </span>
                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                      {exam.candidateCount} cand
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 self-end sm:self-auto">
                                {exam.status === "Draft" && job.status === 'active' && (
                                  <Button
                                    onClick={() => openScheduleModal(exam)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-7 sm:h-9"
                                  >
                                    <Calendar className="h-3 w-3 mr-1" />
                                    <span className="hidden sm:inline">Schedule</span>
                                    <span className="sm:hidden">Schedule</span>
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openScheduleModal(exam)}
                                  className="h-7 w-7 sm:h-9 sm:w-9 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                  <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Multiple Exams Modal with Enhanced Settings */}
      {showCreateExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-2">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Create Multiple Exams</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCreateExam(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Job Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Job *
                </label>
                <select
                  value={examForm.job}
                  onChange={(e) => setExamForm({...examForm, job: e.target.value})}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">-- Choose Job --</option>
                  {jobs.filter(job => job.status === 'active').map((job) => (
                    <option key={job.id} value={job.id}>{job.title}</option>
                  ))}
                </select>
              </div>

              {/* Add Exam Form */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-3 sm:mb-4">Add New Exam</h3>
                
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label htmlFor="examTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Exam Title *
                    </label>
                    <Input
                      id="examTitle"
                      value={newExam.title}
                      onChange={(e) => setNewExam({...newExam, title: e.target.value})}
                      className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm"
                      placeholder="e.g., Frontend Coding Challenge"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Exam Type
                      </label>
                      <select
                        value={newExam.type}
                        onChange={(e) => setNewExam({...newExam, type: e.target.value})}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        {examTypes.map((type) => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Exam Level
                      </label>
                      <select
                        value={newExam.level}
                        onChange={(e) => setNewExam({...newExam, level: e.target.value})}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        {examLevels.map((level) => (
                          <option key={level.value} value={level.value}>{level.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                 {/* Enhanced: Passing Score Section */}
<div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
  <div className="flex items-center gap-2 mb-3">
    <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
    <h4 className="font-medium text-blue-900 dark:text-blue-300">Passing Score Settings</h4>
  </div>
  
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-blue-800 dark:text-blue-300">AI Suggested Score</p>
        <p className="text-xs text-blue-700 dark:text-blue-400">
          Based on {newExam.type} exam at {newExam.level} level
        </p>
      </div>
      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
        <BrainCircuit className="h-3 w-3 mr-1" />
        {newExam.aiSuggestedScore}%
      </Badge>
    </div>

    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Set Passing Score
        </label>
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {newExam.passingScore}%
        </span>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          value={newExam.passingScore}
          onChange={(e) => setNewExam({...newExam, passingScore: parseInt(e.target.value)})}
          min="50"
          max="100"
          step="5"
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
        />
        <Input
          type="number"
          value={newExam.passingScore}
          onChange={(e) => setNewExam({...newExam, passingScore: parseInt(e.target.value) || 70})}
          min="50"
          max="100"
          className="w-20 text-sm"
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>

    <div className="flex gap-2">
      <Button
        onClick={() => setNewExam({...newExam, passingScore: newExam.aiSuggestedScore})}
        variant="outline"
        size="sm"
        className="text-xs"
      >
        Use AI Suggestion
      </Button>
      <Button
        onClick={() => setNewExam({...newExam, passingScore: 70})}
        variant="outline"
        size="sm"
        className="text-xs"
      >
        Reset to Default
      </Button>
    </div>
  </div>
</div>
                  {/* Enhanced: Automatic Notifications Section */}
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Bell className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <h4 className="font-medium text-green-900 dark:text-green-300">Automatic Result Notifications</h4>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-800 dark:text-green-300">Enable Automatic Notifications</p>
                          <p className="text-xs text-green-700 dark:text-green-400">
                            Candidates receive results automatically after exam completion
                          </p>
                        </div>
                        <Switch
                          checked={newExam.autoNotify}
                          onCheckedChange={(checked) => setNewExam({...newExam, autoNotify: checked})}
                        />
                      </div>

                      {newExam.autoNotify && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Notification Timing
                            </label>
                            <div className="space-y-2">
                              {notificationTimingOptions.map((option) => (
                                <div
                                  key={option.value}
                                  onClick={() => setNewExam({...newExam, notifyTiming: option.value})}
                                  className={`p-3 border rounded-lg cursor-pointer ${
                                    newExam.notifyTiming === option.value
                                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                      : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-4 h-4 rounded-full border-2 ${
                                      newExam.notifyTiming === option.value
                                        ? "border-green-500 bg-green-500"
                                        : "border-gray-400"
                                    }`} />
                                    <div>
                                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                                        {option.label}
                                      </p>
                                      <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {option.description}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={newExam.includeFeedback}
                                onCheckedChange={(checked) => setNewExam({...newExam, includeFeedback: checked})}
                              />
                              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Include Personalized Feedback
                              </label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={newExam.includeStrengths}
                                onCheckedChange={(checked) => setNewExam({...newExam, includeStrengths: checked})}
                              />
                              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Include Identified Strengths
                              </label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={newExam.includeImprovement}
                                onCheckedChange={(checked) => setNewExam({...newExam, includeImprovement: checked})}
                              />
                              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Include Improvement Areas
                              </label>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Rest of the form fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Exam Mode
                      </label>
                      <select
                        value={newExam.mode}
                        onChange={(e) => setNewExam({...newExam, mode: e.target.value})}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="online">Online</option>
                        <option value="onsite">Onsite</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="examDuration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Duration (minutes)
                      </label>
                      <Input
                        id="examDuration"
                        type="number"
                        value={newExam.duration}
                        onChange={(e) => setNewExam({...newExam, duration: parseInt(e.target.value) || 60})}
                        className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Deadline Type
                    </label>
                    <select
                      value={newExam.deadlineType}
                      onChange={(e) => setNewExam({...newExam, deadlineType: e.target.value})}
                      className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="fixed">Fixed Time Window</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>

                  {newExam.deadlineType === "fixed" && (
                    <div>
                      <label htmlFor="examDeadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Deadline *
                      </label>
                      <Input
                        id="examDeadline"
                        type="datetime-local"
                        value={newExam.deadline}
                        onChange={(e) => setNewExam({...newExam, deadline: e.target.value})}
                        min={getCurrentDateTime()}
                        className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm"
                      />
                      {newExam.deadline && !isFutureDateTime(newExam.deadline) && (
                        <p className="text-red-500 text-xs mt-1">Please select a future date and time</p>
                      )}
                      <p className="text-green-600 text-xs mt-1">
                        ✓ Exam will auto-complete when deadline passes
                      </p>
                    </div>
                  )}

                  <div>
                    <label htmlFor="examInstructions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Instructions
                    </label>
                    <Textarea
                      id="examInstructions"
                      value={newExam.instructions}
                      onChange={(e) => setNewExam({...newExam, instructions: e.target.value})}
                      rows={3}
                      className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm"
                      placeholder="Provide clear instructions for candidates..."
                    />
                  </div>

                  <Button
                    onClick={addExamToForm}
                    disabled={newExam.deadlineType === "fixed" && newExam.deadline && !isFutureDateTime(newExam.deadline)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm h-10"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Exam to List
                  </Button>
                </div>
              </div>

              {/* Added Exams List */}
              {examForm.exams.length > 0 && (
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-3">
                    Exams to Create ({examForm.exams.length})
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {examForm.exams.map((exam, index) => (
                      <div key={exam.id} className="flex items-center justify-between p-2 sm:p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex-shrink-0">
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                              {index + 1}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                              {exam.title}
                            </h4>
                            <div className="flex flex-wrap items-center gap-1 mt-0.5">
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {examTypes.find(t => t.value === exam.type)?.label} • {exam.level} • {exam.duration} mins
                              </p>
                              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs">
                                Pass: {exam.passingScore}%
                              </Badge>
                              {exam.autoNotify && (
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs">
                                  <Zap className="h-2 w-2 mr-1" />
                                  Auto
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeExamFromForm(exam.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900 h-7 w-7 sm:h-9 sm:w-9"
                        >
                          <X className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => setShowCreateExam(false)}
                className="border-gray-300 dark:border-gray-600 text-sm h-9"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateExams}
                disabled={!examForm.job || examForm.exams.length === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm h-9"
              >
                Create {examForm.exams.length} Exam{examForm.exams.length !== 1 ? 's' : ''}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Exam Modal */}
      {showScheduleExam && currentExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-2">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Schedule Exam</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowScheduleExam(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{currentExam.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {examTypes.find(t => t.value === currentExam.type)?.label} • {currentExam.level}
                </p>
              </div>
              
              <div>
                <label htmlFor="examDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Exam Date & Time *
                </label>
                <Input
                  id="examDate"
                  type="datetime-local"
                  value={scheduleForm.scheduledDate}
                  onChange={(e) => setScheduleForm({...scheduleForm, scheduledDate: e.target.value})}
                  min={getCurrentDateTime()}
                  className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm"
                />
                {scheduleForm.scheduledDate && !isFutureDateTime(scheduleForm.scheduledDate) && (
                  <p className="text-red-500 text-xs mt-1">Please select a future date and time</p>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">Shortlisted Candidates</h3>
                <div className="space-y-2">
                  {candidates.filter(c => c.shortlisted).map(candidate => (
                    <div key={candidate.id} className="flex items-center justify-between p-2 sm:p-3 border border-gray-200 dark:border-gray-600 rounded-md">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{candidate.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{candidate.email}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs">
                        Shortlisted
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center">
                  <Switch
                    id="send-notification"
                    checked={scheduleForm.sendNotification}
                    onCheckedChange={(checked) => setScheduleForm({...scheduleForm, sendNotification: checked})}
                  />
                  <label htmlFor="send-notification" className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Send notification to candidates
                  </label>
                </div>

                {scheduleForm.sendNotification && (
                  <div>
                    <label htmlFor="emailMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Notification Message
                    </label>
                    <Textarea
                      id="emailMessage"
                      value={scheduleForm.emailMessage}
                      onChange={(e) => setScheduleForm({...scheduleForm, emailMessage: e.target.value})}
                      rows={4}
                      className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm"
                      placeholder="Enter the message that will be sent to shortlisted candidates..."
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => setShowScheduleExam(false)}
                className="border-gray-300 dark:border-gray-600 text-sm h-9"
              >
                Cancel
              </Button>
              <Button
                onClick={handleScheduleExam}
                disabled={!scheduleForm.scheduledDate || !isFutureDateTime(scheduleForm.scheduledDate)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm h-9"
              >
                <Send className="h-4 w-4 mr-2" />
                Schedule & Notify
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamManagement;