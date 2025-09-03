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
  const [currentExam, setCurrentExam] = useState(null);
  const [examForm, setExamForm] = useState({
    title: "",
    type: "written",
    level: "screening",
    mode: "online",
    duration: 60,
    deadlineType: "fixed",
    deadline: "",
    instructions: "",
  });
  const dropdownRefs = useRef({});

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

  const jobs = ["Frontend Developer", "Product Manager", "UX Designer"];
  
  const candidates = [
    { id: 1, name: "Alice Johnson", email: "alice@mail.com", stage: "Written Test", status: "Passed", score: 85, shortlisted: true },
    { id: 2, name: "Bob Smith", email: "bob@mail.com", stage: "Technical Test", status: "Pending", score: null, shortlisted: true },
    { id: 3, name: "Carol Williams", email: "carol@mail.com", stage: "Interview", status: "Scheduled", score: null, shortlisted: false },
  ];

  const exams = [
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
      instructions: "Complete the React coding challenge within the time limit."
    },
    { 
      id: 2, 
      title: "Product Sense Interview", 
      type: "case study", 
      level: "final", 
      mode: "onsite", 
      duration: 90, 
      deadlineType: "flexible", 
      deadline: "2025-09-20T23:59", 
      status: "Draft", 
      link: "",
      scheduledDate: "",
      instructions: "Prepare a product critique for the given case study."
    },
  ];

  const stages = [
    { id: 1, name: "Written Test", type: "Exam", scheduled: "2025-09-10", status: "Scheduled", examId: 1 },
    { id: 2, name: "Technical Test", type: "Exam", scheduled: "2025-09-15", status: "Not Scheduled" },
    { id: 3, name: "Interview", type: "Interview", scheduled: "2025-09-20", status: "Scheduled", examId: 2 },
  ];

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const statusColors = {
    Scheduled: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "Not Scheduled": "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    Draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    Passed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    Completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  };

  const examTypes = [
    { value: "written", label: "Written Test", icon: <FileText className="h-4 w-4" /> },
    { value: "coding", label: "Coding Challenge", icon: <Code className="h-4 w-4" /> },
    { value: "aptitude", label: "Aptitude Test", icon: <Brain className="h-4 w-4" /> },
    { value: "case study", label: "Case Study", icon: <BookOpen className="h-4 w-4" /> },
  ];

  const examLevels = [
    { value: "screening", label: "Stage 1 (Screening)" },
    { value: "technical", label: "Stage 2 (Technical)" },
    { value: "final", label: "Stage 3 (Final)" },
  ];

  const handleCreateExam = () => {
    // In a real app, this would send data to the backend
    const newExam = {
      id: exams.length + 1,
      ...examForm,
      status: "Draft",
      link: examForm.mode === "online" ? `https://exam-platform.com/assessment/${Math.random().toString(36).substring(2, 10)}` : "",
    };
    
    console.log("Created exam:", newExam);
    setShowCreateExam(false);
    setExamForm({
      title: "",
      type: "written",
      level: "screening",
      mode: "online",
      duration: 60,
      deadlineType: "fixed",
      deadline: "",
      instructions: "",
    });
    
    // Show success message
    alert("Exam created successfully!");
  };

  const handleScheduleExam = (exam) => {
    // In a real app, this would schedule the exam and notify candidates
    console.log("Scheduled exam:", exam);
    setShowScheduleExam(false);
    setCurrentExam(null);
    
    // Show success message
    alert("Exam scheduled successfully! Candidates have been notified.");
  };

  const handleSendNotification = (exam) => {
    // In a real app, this would send notifications to shortlisted candidates
    const shortlistedCandidates = candidates.filter(c => c.shortlisted);
    console.log("Sending exam notifications for:", exam.title, "to:", shortlistedCandidates);
    
    // Show success message
    alert(`Notifications sent to ${shortlistedCandidates.length} shortlisted candidates!`);
  };

  const getExamTypeIcon = (type) => {
    return examTypes.find(t => t.value === type)?.icon || <FileText className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exam & Interview Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Create, schedule, and manage candidate exams & interviews.</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => setShowCreateExam(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Exam
        </Button>
      </div>

      {/* Job Selector */}
      <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Job:</label>
            <select
              className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedJob || ""}
              onChange={(e) => setSelectedJob(e.target.value)}
            >
              <option value="">-- Choose Job --</option>
              {jobs.map((job) => (
                <option key={job} value={job}>{job}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Exams List */}
      {selectedJob && (
        <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Exams for {selectedJob}</h2>
            
            {exams.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No exams created yet</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Get started by creating a new exam.
                </p>
                <div className="mt-6">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => setShowCreateExam(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Exam
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {exams.map((exam) => (
                  <div key={exam.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          {getExamTypeIcon(exam.type)}
                          {exam.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            {exam.level.charAt(0).toUpperCase() + exam.level.slice(1)}
                          </Badge>
                          <Badge className={statusColors[exam.status]}>
                            {exam.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="relative">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => toggleDropdown(`exam-${exam.id}`)}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                        
                        {openDropdown === `exam-${exam.id}` && (
                          <div 
                            ref={el => dropdownRefs.current[`exam-${exam.id}`] = el}
                            className="absolute right-0 z-10 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg"
                          >
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  setCurrentExam(exam);
                                  setShowScheduleExam(true);
                                  setOpenDropdown(null);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <Calendar className="h-4 w-4 mr-2" />
                                Schedule Exam
                              </button>
                              <button
                                onClick={() => handleSendNotification(exam)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <Send className="h-4 w-4 mr-2" />
                                Notify Candidates
                              </button>
                              <button
                                onClick={() => {
                                  // Handle view results
                                  setOpenDropdown(null);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Results
                              </button>
                              <button
                                onClick={() => {
                                  // Handle delete exam
                                  setOpenDropdown(null);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Exam
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        {exam.mode === "online" ? (
                          <Monitor className="h-4 w-4" />
                        ) : (
                          <Building className="h-4 w-4" />
                        )}
                        <span>{exam.mode.charAt(0).toUpperCase() + exam.mode.slice(1)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{exam.duration} minutes</span>
                      </div>
                      
                      {exam.deadline && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Deadline: {new Date(exam.deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      {exam.link && (
                        <div className="flex items-center gap-2">
                          <LinkIcon className="h-4 w-4" />
                          <span className="truncate">{exam.link}</span>
                        </div>
                      )}
                    </div>
                    
                    {exam.instructions && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <p className="text-sm text-gray-700 dark:text-gray-300">{exam.instructions}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Exam Modal */}
      {showCreateExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Exam</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCreateExam(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label htmlFor="examTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Exam Title
                </label>
                <Input
                  id="examTitle"
                  value={examForm.title}
                  onChange={(e) => setExamForm({...examForm, title: e.target.value})}
                  className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Frontend Coding Challenge"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Exam Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {examTypes.map((type) => (
                      <div
                        key={type.value}
                        onClick={() => setExamForm({...examForm, type: type.value})}
                        className={`p-3 border rounded-md cursor-pointer flex flex-col items-center justify-center ${
                          examForm.type === type.value
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                        }`}
                      >
                        <div className="text-blue-600 dark:text-blue-400 mb-1">
                          {type.icon}
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{type.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Exam Level
                  </label>
                  <select
                    value={examForm.level}
                    onChange={(e) => setExamForm({...examForm, level: e.target.value})}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {examLevels.map((level) => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Exam Mode
                  </label>
                  <div className="flex gap-4">
                    <div
                      onClick={() => setExamForm({...examForm, mode: "online"})}
                      className={`flex items-center gap-2 p-3 border rounded-md cursor-pointer ${
                        examForm.mode === "online"
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                      }`}
                    >
                      <Monitor className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <span>Online</span>
                    </div>
                    <div
                      onClick={() => setExamForm({...examForm, mode: "onsite"})}
                      className={`flex items-center gap-2 p-3 border rounded-md cursor-pointer ${
                        examForm.mode === "onsite"
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                      }`}
                    >
                      <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <span>Onsite</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="examDuration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Duration (minutes)
                  </label>
                  <Input
                    id="examDuration"
                    type="number"
                    value={examForm.duration}
                    onChange={(e) => setExamForm({...examForm, duration: parseInt(e.target.value) || 60})}
                    className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Deadline Type
                </label>
                <div className="flex gap-4">
                  <div
                    onClick={() => setExamForm({...examForm, deadlineType: "fixed"})}
                    className={`flex items-center gap-2 p-3 border rounded-md cursor-pointer ${
                      examForm.deadlineType === "fixed"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                    }`}
                  >
                    <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Fixed Time Window</span>
                  </div>
                  <div
                    onClick={() => setExamForm({...examForm, deadlineType: "flexible"})}
                    className={`flex items-center gap-2 p-3 border rounded-md cursor-pointer ${
                      examForm.deadlineType === "flexible"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                    }`}
                  >
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Flexible</span>
                  </div>
                </div>
              </div>
              
              {examForm.deadlineType === "fixed" && (
                <div>
                  <label htmlFor="examDeadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Deadline
                  </label>
                  <Input
                    id="examDeadline"
                    type="datetime-local"
                    value={examForm.deadline}
                    onChange={(e) => setExamForm({...examForm, deadline: e.target.value})}
                    className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              )}
              
              <div>
                <label htmlFor="examInstructions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Instructions
                </label>
                <Textarea
                  id="examInstructions"
                  value={examForm.instructions}
                  onChange={(e) => setExamForm({...examForm, instructions: e.target.value})}
                  rows={3}
                  className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Provide clear instructions for candidates..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => setShowCreateExam(false)}
                className="border-gray-300 dark:border-gray-600"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateExam}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Create Exam
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Exam Modal */}
      {showScheduleExam && currentExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Schedule Exam</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowScheduleExam(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white">{currentExam.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {examTypes.find(t => t.value === currentExam.type)?.label} • {currentExam.level}
                </p>
              </div>
              
              <div>
                <label htmlFor="examDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Exam Date & Time
                </label>
                <Input
                  id="examDate"
                  type="datetime-local"
                  className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Shortlisted Candidates</h3>
                <div className="space-y-2">
                  {candidates.filter(c => c.shortlisted).map(candidate => (
                    <div key={candidate.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-md">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{candidate.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{candidate.email}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        Shortlisted
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center">
                <Switch
                  id="send-notification"
                  checked={true}
                  onCheckedChange={() => {}}
                />
                <label htmlFor="send-notification" className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Send notification to candidates
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => setShowScheduleExam(false)}
                className="border-gray-300 dark:border-gray-600"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleScheduleExam(currentExam)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Schedule Exam
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Candidates Table */}
      {selectedJob && (
        <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Candidates for {selectedJob}</h2>
              <div className="relative mt-2 sm:mt-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search candidates..."
                  className="pl-10 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Stage</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Score</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {candidates.map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3 text-gray-900 dark:text-white">{candidate.name}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{candidate.email}</td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white">{candidate.stage}</td>
                      <td className="px-4 py-3">
                        <Badge className={statusColors[candidate.status]}>
                          {candidate.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white">{candidate.score ?? "-"}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="relative inline-block text-left">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => toggleDropdown(`candidate-${candidate.id}`)}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                          
                          {openDropdown === `candidate-${candidate.id}` && (
                            <div 
                              ref={el => dropdownRefs.current[`candidate-${candidate.id}`] = el}
                              className="absolute right-0 z-10 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg"
                            >
                              <div className="py-1">
                                <button
                                  onClick={() => {
                                    // Handle view report
                                    setOpenDropdown(null);
                                  }}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Report
                                </button>
                                <button
                                  onClick={() => {
                                    // Handle reschedule
                                    setOpenDropdown(null);
                                  }}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  <Calendar className="h-4 w-4 mr-2" />
                                  Reschedule
                                </button>
                                <button
                                  onClick={() => {
                                    // Handle remove candidate
                                    setOpenDropdown(null);
                                  }}
                                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Remove Candidate
                                </button>
                              </div>
                            </div>
                          )}
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

export default ExamManagement;