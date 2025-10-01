import  { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Plus,
  Calendar,
  ClipboardList,
  Eye,
  Trash2,
  Search,
  X,
  Clock,
  LinkIcon,
  Monitor,
  Building,
  Code,
  Brain,
  FileText,
  Send,
  MicVocal,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import useUserAxios from "../../../hooks/useUserAxios";

const ExamManagement = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showCreateExam, setShowCreateExam] = useState(false);
  const [showScheduleExam, setShowScheduleExam] = useState(false);
  const [currentExam, setCurrentExam] = useState(null);
  const axios = useUserAxios();
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [examForm, setExamForm] = useState({
    e_title: "",
    e_type: "written",
    e_mode: "online",
    e_duration: 60,
    e_deadline_type: "fixed",
    e_start_time: null,
    e_max_score: 100,
    e_notes: "",
  });
  const dropdownRefs = useRef({});

  const [jobs, setJobs] = useState([]);
  const [exams, setExams] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [scheduleForm, setScheduleForm] = useState({
    e_start_time: ""
  });
  
  const getJobs = async () => {
    try {
      const resp = await axios.get("/api/jobs/my_jobs");
      if (resp.data.success) {
        setJobs(
          resp.data.data.map((j) => {
            return { ...j, j_requirements: JSON.parse(j.j_requirements) };
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };


  const deleteExam = async(examId) => {
    try {
      const resp = await axios.delete(`/api/examination/exams/${examId}/`);
      if (resp.status < 400) {
        alert("Exam deleted successfully!");
        getExams();
      }
    } catch (error) {
      console.log(error);
      alert("Error deleting exam: " + (error.response?.data?.message || error.message));
    }
  };

  const getExams= async()=>{
    try {
      const resp = await axios.get("/api/examination/exams/my_exams");
      if (resp.data.success) {
        setExams(resp.data.data);
      }
    } catch (error) {
      console.log(error);
      
    }

  }
  const getCandidates = async () => {
    try {
      const resp = await axios.get("/api/jobs/all-applications");
      if (resp.data.success) {
        setCandidates(resp.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
    {
      value: "written",
      label: "Written Test",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      value: "coding",
      label: "Coding Challenge",
      icon: <Code className="h-4 w-4" />,
    },
    {
      value: "aptitude",
      label: "Aptitude Test",
      icon: <Brain className="h-4 w-4" />,
    },
    {
      value: "Interview",
      label: "Interview",
      icon: <MicVocal className="h-4 w-4" />,
    },
  ];

  const scheduleExam =  async(exam) => {
    try {
      if (!scheduleForm.e_start_time) return alert("Please select a start time");
      const resp = await axios.patch(`/api/examination/exams/${exam.id}/`, scheduleForm);
      if (resp.status === 200) {
        alert("Exam scheduled successfully!");
        setShowScheduleExam(false);
        setCurrentExam(null);
        setScheduleForm({ e_start_time: "" });
        getExams();
      }
    } catch (error) {
      console.log(error);
      alert("Error scheduling exam: " + (error.response?.data?.message || error.message));
    }
  };

  const handleCreateExam = async () => {
    try {
      // Prepare the exam data with correct field names
      const examData = {
        ...examForm,
        a_ids: selectedCandidates.map((c) => c.id),
        j_id: selectedJob,
      };

      const resp = await axios.post("/api/examination/exams/", examData);
      if (resp.status < 400) {
        setShowCreateExam(false);
        setExamForm({
          e_title: "",
          e_type: "written",
          e_mode: "online",
          e_duration: 60,
          e_deadline_type: "fixed",
          e_start_time: null,
          e_max_score: 100,
          e_notes: "",
        });
        setSelectedCandidates([]);
        getExams();
        // Show success message
        alert("Exam created successfully!");
      }
    } catch (error) {
      console.log(error);
      alert("Error creating exam: " + (error.response?.data?.message || error.message));
    }
  };

  const handleScheduleExam = async(exam) => {
    await scheduleExam(exam);
  };

  const handleSendNotification = (exam) => {
    // In a real app, this would send notifications to shortlisted candidates
    const shortlistedCandidates = candidates.filter((c) => c.shortlisted);
    console.log(
      "Sending exam notifications for:",
      exam.title,
      "to:",
      shortlistedCandidates
    );

    // Show success message
    alert(
      `Notifications sent to ${shortlistedCandidates.length} shortlisted candidates!`
    );
  };

  const getExamTypeIcon = (type) => {
    return (
      examTypes.find((t) => t.value === type)?.icon || (
        <FileText className="h-4 w-4" />
      )
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.values(dropdownRefs.current).forEach((ref) => {
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

  useEffect(() => {
    Promise.all([getJobs(), getCandidates(), getExams()]);
    if(jobs.length>0){
     setSelectedJob(jobs.length > 0 ? jobs[0].id : null);
    }
  }, []);

  useEffect(() => {
    if (selectedJob) {
      // Fixed: Use setSelectedCandidates function correctly
      const filteredCandidates = candidates.filter((c) => c.job?.id == selectedJob);
      setSelectedCandidates(filteredCandidates);
      
      // Update exam form with selected candidates
      setExamForm(prev => ({
        ...prev,
        a_ids: filteredCandidates.map((c) => c.id)
      }));
    }
  }, [selectedJob, candidates, exams]);

  

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Exam & Interview Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create, schedule, and manage candidate exams & interviews.
          </p>
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
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Job:
            </label>
            <select
              className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedJob || ""}
              onChange={(e) => {
                setSelectedJob(e.target.value);
              }}
            >
              <option value="">-- Choose Job --</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.j_title}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Exams List */}
      {selectedJob && (
        <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Exams for{" "}
              {jobs.find((job) => job.id == selectedJob)?.j_title}
            </h2>

            {exams.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  No exams created yet
                </h3>
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
                {exams.filter(e=>e.j_id == selectedJob).map((exam) => (
                  <div
                    key={exam.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          {getExamTypeIcon(exam.e_type)}
                          {exam.e_title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            {exam.e_mode.charAt(0).toUpperCase() + exam.e_mode.slice(1)}
                          </Badge>
                          <Badge className={statusColors[exam.e_status] || statusColors.Draft}>
                            {exam.e_status || "Draft"}
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
                            ref={(el) =>
                              (dropdownRefs.current[`exam-${exam.id}`] = el)
                            }
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
                                  if (window.confirm("Are you sure you want to delete this exam? This action cannot be undone.")) {
                                    deleteExam(exam.id);
                                  }
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
                        {exam.e_mode === "online" ? (
                          <Monitor className="h-4 w-4" />
                        ) : (
                          <Building className="h-4 w-4" />
                        )}
                        <span>
                          {exam.e_mode.charAt(0).toUpperCase() + exam.e_mode.slice(1)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{exam.e_duration} minutes</span>
                      </div>

                      {exam.e_start_time && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Start Time:{" "}
                            {new Date(exam.e_start_time).toLocaleString()}
                          </span>
                        </div>
                      )}

                      {exam.e_link && (
                        <div className="flex items-center gap-2">
                          <LinkIcon className="h-4 w-4" />
                          <span className="truncate">{exam.e_link}</span>
                        </div>
                      )}
                    </div>

                    {exam.e_notes && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {exam.e_notes}
                        </p>
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
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Create New Exam
              </h2>
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
                <label
                  htmlFor="examTitle"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Exam Title
                </label>
                <Input
                  id="examTitle"
                  value={examForm.e_title}
                  onChange={(e) =>
                    setExamForm({ ...examForm, e_title: e.target.value })
                  }
                  className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder={`e.g.,  ${
                    jobs.find((job) => job.id == selectedJob)?.j_title || "Job"
                  } Exam`}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Exam Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {examTypes.map((type) => (
                      <div
                        key={type.value}
                        onClick={() =>
                          setExamForm({ ...examForm, e_type: type.value })
                        }
                        className={`p-3 border rounded-md cursor-pointer flex flex-col items-center justify-center ${
                          examForm.e_type === type.value
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                        }`}
                      >
                        <div className="text-blue-600 dark:text-blue-400 mb-1">
                          {type.icon}
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {type.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Exam Mode
                  </label>
                  <div className="flex gap-4">
                    <div
                      onClick={() =>
                        setExamForm({ ...examForm, e_mode: "online" })
                      }
                      className={`flex items-center gap-2 p-3 border rounded-md cursor-pointer ${
                        examForm.e_mode === "online"
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                      }`}
                    >
                      <Monitor className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <span>Online</span>
                    </div>
                    <div
                      onClick={() =>
                        setExamForm({ ...examForm, e_mode: "onsite" })
                      }
                      className={`flex items-center gap-2 p-3 border rounded-md cursor-pointer ${
                        examForm.e_mode === "onsite"
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
                  <label
                    htmlFor="examDuration"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Duration (minutes)
                  </label>
                  <Input
                    id="examDuration"
                    type="number"
                    value={examForm.e_duration}
                    onChange={(e) =>
                      setExamForm({
                        ...examForm,
                        e_duration: parseInt(e.target.value) || 60,
                      })
                    }
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
                    onClick={() =>
                      setExamForm({ ...examForm, e_deadline_type: "fixed" })
                    }
                    className={`flex items-center gap-2 p-3 border rounded-md cursor-pointer ${
                      examForm.e_deadline_type === "fixed"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                    }`}
                  >
                    <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Fixed Time Window</span>
                  </div>
                  <div
                    onClick={() =>
                      setExamForm({ ...examForm, e_deadline_type: "flexible" })
                    }
                    className={`flex items-center gap-2 p-3 border rounded-md cursor-pointer ${
                      examForm.e_deadline_type === "flexible"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                    }`}
                  >
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Flexible</span>
                  </div>
                </div>
              </div>

              {examForm.e_deadline_type === "fixed" && (
                <div>
                  <label
                    htmlFor="examStartTime"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Start Time
                  </label>
                  <Input
                    id="examStartTime"
                    type="datetime-local"
                    value={examForm.e_start_time}
                    onChange={(e) =>
                      setExamForm({ ...examForm, e_start_time: e.target.value })
                    }
                    className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="examMaxScore"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Maximum Score
                </label>
                <Input
                  id="examMaxScore"
                  type="number"
                  value={examForm.e_max_score}
                  onChange={(e) =>
                    setExamForm({
                      ...examForm,
                      e_max_score: parseInt(e.target.value) || 100,
                    })
                  }
                  className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="examNotes"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Notes/Instructions
                </label>
                <Textarea
                  id="examNotes"
                  value={examForm.e_notes}
                  onChange={(e) =>
                    setExamForm({ ...examForm, e_notes: e.target.value })
                  }
                  rows={3}
                  className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Provide clear instructions for candidates..."
                />
              </div>

              {/* Candidate Selection */}
              {selectedCandidates.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Candidates ({selectedCandidates.length} available)
                  </label>
                  <div className="max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-2">
                    {selectedCandidates.map((candidate) => (
                      <div key={candidate.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                        <input
                          type="checkbox"
                          checked={examForm.a_ids?.includes(candidate.id)}
                          onChange={(e) => {
                            const isSelected = e.target.checked;
                            if (isSelected) {
                              setExamForm(prev => ({
                                ...prev,
                                a_ids: [...(prev.a_ids || []), candidate.id]
                              }));
                            } else {
                              setExamForm(prev => ({
                                ...prev,
                                a_ids: prev.a_ids?.filter(id => id !== candidate.id) || []
                              }));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {candidate?.applicant?.u_first_name} {candidate?.applicant?.u_last_name} - {candidate?.applicant?.u_email}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Selected {examForm.a_ids?.length || 0} candidates
                  </p>
                </div>
              )}
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
                disabled={!examForm.e_title || !examForm.e_type}
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
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Schedule Exam
              </h2>
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
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {currentExam.e_title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {examTypes.find((t) => t.value === currentExam.e_type)?.label} •{" "}
                  {currentExam.e_mode}
                </p>
              </div>

              <div>
                <label
                  htmlFor="examDate"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Exam Date & Time
                </label>
                <Input
                  id="examDate"
                  type="datetime-local"
                  className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={scheduleForm.e_start_time}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, e_start_time: e.target.value })}
                />
              </div>

              <div className="flex items-center">
                <Switch
                  id="send-notification"
                  checked={true}
                  onCheckedChange={() => {}}
                />
                <label
                  htmlFor="send-notification"
                  className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
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
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Candidates for{" "}
                {jobs.find((job) => job.id == selectedJob)?.j_title}
              </h2>
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
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Select
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Stage
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {selectedCandidates.map((candidate) => (
                    <tr
                      key={candidate.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={examForm.a_ids?.includes(candidate.id)}
                          onChange={(e) => {
                            const isSelected = e.target.checked;
                            if (isSelected) {
                              setExamForm(prev => ({
                                ...prev,
                                a_ids: [...(prev.a_ids || []), candidate.id]
                              }));
                            } else {
                              setExamForm(prev => ({
                                ...prev,
                                a_ids: prev.a_ids?.filter(id => id !== candidate.id) || []
                              }));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white">
                        {candidate?.applicant?.u_first_name} {candidate?.applicant?.u_last_name}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {candidate?.applicant?.u_email}
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white">
                        {
                          candidate?.stages?.find(
                            (s) => s.s_completed === false
                          )?.s_name || "Not Started"
                        }
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={statusColors[candidate?.status] || statusColors.Pending}>
                          {candidate?.status || "Pending"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white">
                        {candidate?.score ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="relative inline-block text-left">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              toggleDropdown(`candidate-${candidate.id}`)
                            }
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>

                          {openDropdown === `candidate-${candidate.id}` && (
                            <div
                              ref={(el) =>
                                (dropdownRefs.current[
                                  `candidate-${candidate.id}`
                                ] = el)
                              }
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