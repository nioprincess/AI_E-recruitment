import { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Calendar,
  ClipboardList,
  Eye,
  Clock,
  LinkIcon,
  Monitor,
  Building,
  Code,
  Brain,
  FileText,
  MicVocal,
  Settings2Icon,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

import { Badge } from "../ui/badge";

import useUserAxios from "../../../hooks/useUserAxios";
import { Link } from "react-router-dom";

const CandidateExamManagement = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  const axios = useUserAxios();

  const dropdownRefs = useRef({});

  const [jobs, setJobs] = useState([]);
  const [exams, setExams] = useState([]);

  const getExams = async () => {
    try {
      const resp = await axios.get("/api/examination/exams/my_exams");
      if (resp.data.success) {
        setExams(resp.data.data);

        const jobs = [];
        resp.data.data.forEach((exam) => {
          if (!jobs.find((j) => j.id == exam.application.job.id)) {
            jobs.push(exam.application.job);
          }
        });
        setJobs(jobs);
        setSelectedJob(jobs.length > 0 ? jobs[0].id : null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const statusColors = {
    Scheduled:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "Not Scheduled":
      "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    Draft:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    Passed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
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
    Promise.all([getExams()]);
  }, []);

  console.log(selectedJob);

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen mt-15">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Exam & Interview Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage exams and interviews for your job postings
          </p>
        </div>
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
              Exams for {jobs.find((job) => job.id == selectedJob)?.j_title}
            </h2>

            {exams.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  No exams created yet
                </h3>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {exams
                  .filter((e) => e.exam.j_id == selectedJob)
                  .map((exam) => (
                    <div
                      key={exam.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            {getExamTypeIcon(exam.exam.e_type)}
                            {exam.exam.e_title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                              {exam.exam.e_mode.charAt(0).toUpperCase() +
                                exam.exam.e_mode.slice(1)}
                            </Badge>
                            <Badge
                              className={
                                statusColors[exam.exam.e_status] ||
                                statusColors.Draft
                              }
                            >
                              {exam.exam.e_status || "Draft"}
                            </Badge>
                          </div>
                        </div>
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              toggleDropdown(`exam-${exam.exam.id}`)
                            }
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>

                          {openDropdown === `exam-${exam.exam.id}` && (
                            <div
                              ref={(el) =>
                                (dropdownRefs.current[`exam-${exam.exam.id}`] =
                                  el)
                              }
                              className="absolute right-0 z-10 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg"
                            >
                              <div className="py-1">
                                <button
                                  onClick={() => {
                                    // Handle view results
                                    setOpenDropdown(null);
                                  }}
                                  className="flex cursor-pointer items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Results
                                </button>

                                <Link
                                  to={`/exam/${exam.exam.e_type}/${exam.id}`}
                                  className="flex cursor-pointer items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  <Settings2Icon className="h-4 w-4 mr-2" />
                                  Take Exam
                                </Link>
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
                            {exam.exam.e_mode.charAt(0).toUpperCase() +
                              exam.exam.e_mode.slice(1)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{exam.exam.e_duration} minutes</span>
                        </div>

                        {exam.exam.e_start_time && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Start Time:{" "}
                              {new Date(
                                exam.exam.e_start_time
                              ).toLocaleString()}
                            </span>
                          </div>
                        )}

                        {exam.exam.e_link && (
                          <div className="flex items-center gap-2">
                            <LinkIcon className="h-4 w-4" />
                            <span className="truncate">{exam.exam.e_link}</span>
                          </div>
                        )}
                      </div>

                      {exam.exam.e_notes && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {exam.exam.e_notes}
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
    </div>
  );
};

export default CandidateExamManagement;
