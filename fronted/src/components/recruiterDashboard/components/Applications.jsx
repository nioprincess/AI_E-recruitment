import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  Search,
  MoreVertical,
  Eye,
  CheckCircle2,
  MinusCircle,
  ClipboardList,
  Users,
  Calendar,
  X,
  Sparkles,
  Loader2,
  Trash2,
  Mail,
  Bell,
  Filter,
  ChevronDown,
  Send,
  Download,
  ArrowUpCircle,
  CircleArrowLeft,
  SquarePen,
  UserCheck,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import useUserAxios from "../../../hooks/useUserAxios";
import { Link } from "react-router-dom";

// Status mapping from your API to component status
const statusMapping = {
  submitted: "New",
  "under-review": "Under Review",
  accepted: "Accepted",
  rejected: "Rejected",
};

const statusStyles = {
  New: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "Under Review":
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  Accepted:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const ApplicationsPage = () => {
  // Data state
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const axios = useUserAxios();

  // UI state
  const [search, setSearch] = useState("");
  const [jobFilter, setJobFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [viewingApplicant, setViewingApplicant] = useState(null);
 
  const [bulkScreenOpen, setBulkScreenOpen] = useState(false);
  const [screening, setScreening] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(
    "Congratulations! You've been shortlisted for the next round. We'll contact you shortly to schedule an interview."
  );
  const [sendEmailNotification, setSendEmailNotification] = useState(true);
  const [showNotificationSuccess, setShowNotificationSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [changingStatus, setChangingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState({
    rejected: false,
    accepted: false,
    "under-review": false,
  });
  const [newStatusNotes, setNewStatusNotes] = useState("");
  const [currentApplication, setCurrentApplication] = useState(null);
  
  // Bulk status change state
  const [bulkStatusChangeOpen, setBulkStatusChangeOpen] = useState(false);
  const [bulkChangingStatus, setBulkChangingStatus] = useState(false);
  const [bulkNewStatus, setBulkNewStatus] = useState({
    rejected: false,
    accepted: false,
    "under-review": false,
  });
  const [bulkStatusNotes, setBulkStatusNotes] = useState("");

  // Dropdown states
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = useRef({});

  const changeStatus = (app) => {
    setChangingStatus(true);
    setCurrentApplication(app);
  };

  const handleChangingApplicationStatus = async () => {
    console.log(currentApplication)
    try {
      if ((!newStatus.accepted && !newStatus.rejected && !newStatus["under-review"]) || !currentApplication)
        return;
      const resp = await axios.patch(
        `/api/jobs/${currentApplication.job.id}/applications-status/${currentApplication.id}/`,
        {
          status:  newStatus.accepted ? "accepted" : newStatus.rejected ? "rejected" : "under-review",
          notes: newStatusNotes,
        }
      );
      if (resp.data.success) {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === currentApplication.id
              ? { ...app, status: resp.data.data.status === "accepted" ? "Accepted" : resp.data.data.status === "rejected" ? "Rejected" : "Under Review" }
              : app
          )
        );
        setNewStatus({ rejected: false, accepted: false, "under-review": false });
        setCurrentApplication(null);
        setChangingStatus(false);
        setNewStatusNotes("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Bulk status change functions
  const handleBulkStatusChange = async () => {
    if ((!bulkNewStatus.accepted && !bulkNewStatus.rejected && !bulkNewStatus["under-review"]) || selectedIds.size === 0) {
      return;
    }

    setBulkChangingStatus(true);

    try {
      const selectedApps = applications.filter(app => selectedIds.has(app.id));
      const status = bulkNewStatus.accepted ? "accepted" : bulkNewStatus.rejected ? "rejected" : "under-review";
      
      // Process each application
      const updatePromises = selectedApps.map(async (app) => {
        try {
          const resp = await axios.patch(
            `/api/jobs/${app.job.id}/applications-status/${app.id}/`,
            {
              status: status,
              notes: bulkStatusNotes,
            }
          );
          return { appId: app.id, success: true, newStatus: resp.data.data.status };
        } catch (error) {
          console.error(`Failed to update application ${app.id}:`, error);
          return { appId: app.id, success: false };
        }
      });

      const results = await Promise.all(updatePromises);
      
      // Update applications state with successful changes
      setApplications((prev) =>
        prev.map((app) => {
          const result = results.find(r => r.appId === app.id);
          if (result && result.success) {
            const displayStatus = result.newStatus === "accepted" ? "Accepted" 
              : result.newStatus === "rejected" ? "Rejected" 
              : "Under Review";
            return { ...app, status: displayStatus };
          }
          return app;
        })
      );

      // Count successful updates
      const successCount = results.filter(r => r.success).length;
      const failureCount = results.length - successCount;

      // Reset form and close modal
      setBulkNewStatus({ rejected: false, accepted: false, "under-review": false });
      setBulkStatusNotes("");
      setBulkStatusChangeOpen(false);
      setSelectedIds(new Set()); // Clear selection

      // Show success message
      if (successCount > 0) {
        setShowNotificationSuccess(true);
        setTimeout(() => setShowNotificationSuccess(false), 3000);
      }

      if (failureCount > 0) {
        console.warn(`${failureCount} applications failed to update`);
      }

    } catch (error) {
      console.error("Bulk status change failed:", error);
    } finally {
      setBulkChangingStatus(false);
    }
  };

  const openBulkStatusChange = () => {
    if (selectedIds.size > 0) {
      setBulkStatusChangeOpen(true);
    }
  };

  // Close dropdown when clicking outside
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

  // Pagination
  const [page, setPage] = useState(1);
  const perPage = 6;

  // Transform API data to match component format
  const transformApplications = (apiData) => {
    return apiData.map((app) => ({
      id: app.id.toString(),
      name: `${app.applicant.u_first_name} ${app.applicant.u_last_name}`,
      email: app.applicant.u_email,
      appliedJobId: app.job.id.toString(),
      status: statusMapping[app.status] || "New",
      appliedDate: app.created_at.split("T")[0],
      resumeSummary: app.notes || "No summary provided",
      phone: app.applicant.u_phone,
      coverLetter: app.a_cover_letter,
      job: app.job,
      applicant: app.applicant,
      // Mock data for AI features (you can replace with real AI integration)
      answers: [
        { q: "Cover Letter", a: app.notes || "No cover letter provided" },
      ],
      // These will be populated after screening
      fitScore: null,
      aiReasons: null,
      screened: app.status !== "submitted",
    }));
  };

  // Extract unique jobs from applications
  const extractJobs = (applications) => {
    const jobMap = new Map();
    applications.forEach((app) => {
      if (app.job && !jobMap.has(app.job.id)) {
        jobMap.set(app.job.id, {
          id: app.job.id.toString(),
          title: app.job.j_title,
          company:
            app.job.company?.c_name ||
            app.job.company?.c_description ||
            "Unknown Company",
        });
      }
    });
    return Array.from(jobMap.values());
  };

  /** ---------- Filtering ---------- */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return applications.filter((a) => {
      const matchesQ =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.job?.j_title?.toLowerCase().includes(q) ||
        a.phone?.includes(q);
      const matchesJob = jobFilter === "all" || a.appliedJobId === jobFilter;
      const matchesStatus = statusFilter === "all" || a.status === statusFilter;
      return matchesQ && matchesJob && matchesStatus;
    });
  }, [search, jobFilter, statusFilter, applications]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const startIndex = (page - 1) * perPage;
  const current = filtered.slice(startIndex, startIndex + perPage);

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, jobFilter, statusFilter]);

  /** ---------- Selection ---------- */
  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAllVisible = () => {
    const allVisibleIds = current.map((a) => a.id);
    const allSelected = allVisibleIds.every((id) => selectedIds.has(id));
    setSelectedIds((prev) => {
      if (allSelected) {
        const next = new Set(prev);
        allVisibleIds.forEach((id) => next.delete(id));
        return next;
      } else {
        const next = new Set(prev);
        allVisibleIds.forEach((id) => next.add(id));
        return next;
      }
    });
  };

  /** ---------- Actions ---------- */
  const jobTitle = (jobId) => {
    const job = jobs.find((j) => j.id === jobId);
    return job ? job.title : "—";
  };

  const screenBulk = async () => {
    try {
      
      if (selectedIds.size === 0) return;
      setScreening(true);
      const resp = await axios.patch(`/api/jobs/applications-screen-ai/`, {
        applications: Array.from(selectedIds),
        
      });

      if (resp.data.success) {
        // Handle successful screening
        console.log(resp.data.message)
      }
    } catch (error) {
      console.error("Error screening applications:", error);
    } finally {
      setScreening(false);
    }
  };
 
  const downloadFile = async (url, filename) => {
    try {
      const resp = await axios.get(url, { responseType: "blob" });

      if (resp.status < 400) {
        const url = window.URL.createObjectURL(new Blob([resp.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendNotifications = async () => {
    try {
      const shortlisted = applications.filter(
        (a) => a.status === "Shortlisted"
      );

      // Send notifications via API
      await axios.post("/api/notifications/send", {
        applications: shortlisted.map((app) => app.id),
        message: notificationMessage,
        sendEmail: sendEmailNotification,
      });

      setShowNotificationSuccess(true);
      setTimeout(() => setShowNotificationSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to send notifications:", error);
    }
  };

  const downloadResume = (applicant) => {
    if (applicant.coverLetter?.f_path) {
      // Create download link for the resume/cover letter
      const link = document.createElement("a");
      link.href = applicant.coverLetter.f_path;
      link.download = applicant.coverLetter.f_name || "resume.pdf";
      link.click();
    }
  };

  const getApplications = async () => {
    try {
      setLoading(true);
      const resp = await axios.get("/api/jobs/all-applications");
      if (resp.data.data) {
        const transformedApps = transformApplications(resp.data.data);
        setApplications(transformedApps);
        setJobs(extractJobs(transformedApps));
      }
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  useEffect(() => {
    getApplications();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-lg">Loading applications...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Applications
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered screening to streamline your hiring process
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {selectedIds.size > 0 && (
            <>
              
              <Button
                onClick={screenBulk}
                className="bg-blue-600 hover:bg-blue-700 text-white bg-gradient-to-t from-blue-600 via-purple-600 to-purple-700"
                disabled={screening}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Screen Selected ({selectedIds.size}) with AI
              </Button>

              <Button
                onClick={openBulkStatusChange}
                className="bg-purple-600 hover:bg-purple-700 text-white"
                disabled={bulkChangingStatus}
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Change Status ({selectedIds.size})
              </Button>
            </>
          )}

          <Button
            variant="outline"
            onClick={() => toggleSelectAllVisible()}
            className="border-gray-300 dark:border-gray-600 dark:text-white"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            {selectedIds.size > 0 ? "Deselect All" : "Select All"}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total Applicants
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {applications.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">New</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {applications.filter((a) => a.status === "submitted").length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Shortlisted
          </p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {applications.filter((a) => a.status === "Accepted").length}
          </p>
        </div>
         <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
             Rejected
          </p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {applications.filter((a) => a.status === "Rejected").length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Screening Progress
          </p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {Math.round(
              (applications.filter((a) => a.status !== "New").length /
                applications.length) *
                100
            )}
            %
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search applicants..."
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                className="pl-10 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <Button
                variant="outline"
                className="flex items-center gap-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                onClick={() => toggleDropdown("jobFilter")}
              >
                <Filter className="h-4 w-4" />
                Job: {jobFilter === "all" ? "All" : jobTitle(jobFilter)}
                <ChevronDown className="h-4 w-4" />
              </Button>

              {openDropdown === "jobFilter" && (
                <div
                  ref={(el) => (dropdownRefs.current["jobFilter"] = el)}
                  className="absolute right-0 z-10 mt-1 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg"
                >
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setJobFilter("all");
                        setOpenDropdown(null);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      All Jobs
                    </button>
                    {jobs.map((job) => (
                      <button
                        key={job.id}
                        onClick={() => {
                          setJobFilter(job.id);
                          setOpenDropdown(null);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {job.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <Button
                variant="outline"
                className="flex items-center gap-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                onClick={() => toggleDropdown("statusFilter")}
              >
                <Filter className="h-4 w-4" />
                Status: {statusFilter === "all" ? "All" : statusFilter}
                <ChevronDown className="h-4 w-4" />
              </Button>

              {openDropdown === "statusFilter" && (
                <div
                  ref={(el) => (dropdownRefs.current["statusFilter"] = el)}
                  className="absolute right-0 z-10 mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg"
                >
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setStatusFilter("all");
                        setOpenDropdown(null);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      All Statuses
                    </button>
                    {Object.values(statusMapping).map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFilter(status);
                          setOpenDropdown(null);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Job
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Applied
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {current.map((applicant) => (
                <tr
                  key={applicant.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(applicant.id)}
                        onChange={() => toggleSelect(applicant.id)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {applicant.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {applicant.email}
                        </div>
                        <div className="text-xs text-gray-400">
                          {applicant.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900 dark:text-white">
                      {applicant.job?.j_title || "—"}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {applicant.job?.company?.c_name ||
                        applicant.job?.company?.c_description ||
                        "—"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={statusStyles[applicant.status]}>
                      {applicant.status}
                    </Badge>
                    {applicant.fitScore && (
                      <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        ({applicant.fitScore}%)
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(applicant.appliedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/recruiter/jobs`}
                        className="bg-green-100 hover:bg-green-200  dark:bg-green-900 dark:hover:bg-green-800 dark:text-green-200 text-white p-2 rounded-md"
                      >
                        View Job
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewingApplicant(applicant)}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {applicant.coverLetter && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            downloadFile(
                              `${
                                import.meta.env.VITE_SERVER_URL
                              }/api/files/user_cv/${applicant.applicant.id}`,
                              "resume.pdf"
                            )
                          }
                          className="  text-gray-400 hover:text-gray-900 dark:hover:text-white"
                          title="Download Resume"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}

                      <Button
                        onClick={() => changeStatus(applicant)}
                       variant="ghost"
                          size="icon"
                                className="  text-gray-400 hover:text-gray-900 dark:hover:text-white"
                          title="Change Status"
                      >
                        <SquarePen className="h-4 w-4 mr-2" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {current.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No applicants found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(startIndex + perPage, filtered.length)}
            </span>{" "}
            of <span className="font-medium">{filtered.length}</span> results
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="border-gray-300 dark:border-gray-600"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="border-gray-300 dark:border-gray-600"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      

      {/* Success Notification */}
      {showNotificationSuccess && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg shadow-lg flex items-center">
            <CheckCircle2 className="h-5 w-5 mr-2" />
            <span>
              Status changes applied successfully!
            </span>
          </div>
        </div>
      )}

      {/* Applicant Details Modal */}
      {viewingApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {viewingApplicant.name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {viewingApplicant.email} • {viewingApplicant.phone}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Applied for: {viewingApplicant.job?.j_title}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewingApplicant(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <section>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Application Summary
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {viewingApplicant.resumeSummary}
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Cover Letter
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {viewingApplicant.answers[0]?.a || "No cover letter provided"}
                </p>
              </section>

              {viewingApplicant.aiReasons && (
                <section>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    AI Screening Results
                  </h3>
                  <ul className="space-y-2">
                    {viewingApplicant.aiReasons.map((reason, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {reason}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {viewingApplicant.coverLetter && (
                <section>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Attachments
                  </h3>
                  <Button
                    onClick={() =>
                      downloadFile(
                        `${import.meta.env.VITE_SERVER_URL}/api/files/cover/${
                          viewingApplicant.coverLetter.id
                        }`,
                        "resume.pdf"
                      )
                    }
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Cover Letter
                  </Button>
                </section>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Single Application Status Change Modal */}
      {changingStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 shadow-md">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Change Application Status</h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setChangingStatus(false);
                  setNewStatus({ rejected: false, accepted: false, "under-review": false });
                  setNewStatusNotes("");
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Select New Status</h3>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="under-review"
                      name="status"
                      value="under-review"
                      onChange={() =>
                        setNewStatus({ "under-review": true, rejected: false, accepted: false })
                      }
                      checked={newStatus["under-review"]}
                      className="text-blue-600"
                    />
                    <label htmlFor="under-review" className="text-gray-700 dark:text-gray-300">Under Review</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="accept"
                      name="status"
                      value="accepted"
                      onChange={() =>
                        setNewStatus({ rejected: false, accepted: true, "under-review": false })
                      }
                      checked={newStatus.accepted}
                      className="text-blue-600"
                    />
                    <label htmlFor="accept" className="text-gray-700 dark:text-gray-300">Accept</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="reject"
                      name="status"
                      value="rejected"
                      onChange={() =>
                        setNewStatus({ rejected: true, accepted: false , "under-review": false })
                      }
                      checked={newStatus.rejected}
                      className="text-blue-600"
                    />
                    <label htmlFor="reject" className="text-gray-700 dark:text-gray-300">Reject</label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Notes</h3>
                <textarea
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  rows="4"
                  value={newStatusNotes}
                  onChange={(e) => setNewStatusNotes(e.target.value)}
                  placeholder="Add notes about this status change..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setChangingStatus(false);
                    setNewStatus({ rejected: false, accepted: false, "under-review": false });
                    setNewStatusNotes("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleChangingApplicationStatus}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={!newStatus.accepted && !newStatus.rejected && !newStatus["under-review"]}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Status Change Modal */}
      {bulkStatusChangeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Change Status for {selectedIds.size} Applications
              </h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setBulkStatusChangeOpen(false);
                  setBulkNewStatus({ rejected: false, accepted: false, "under-review": false });
                  setBulkStatusNotes("");
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Select New Status</h3>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="bulk-under-review"
                      name="bulkStatus"
                      value="under-review"
                      onChange={() =>
                        setBulkNewStatus({ "under-review": true, rejected: false, accepted: false })
                      }
                      checked={bulkNewStatus["under-review"]}
                      className="text-blue-600"
                    />
                    <label htmlFor="bulk-under-review" className="text-gray-700 dark:text-gray-300">Under Review</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="bulk-accept"
                      name="bulkStatus"
                      value="accepted"
                      onChange={() =>
                        setBulkNewStatus({ rejected: false, accepted: true, "under-review": false })
                      }
                      checked={bulkNewStatus.accepted}
                      className="text-blue-600"
                    />
                    <label htmlFor="bulk-accept" className="text-gray-700 dark:text-gray-300">Accept</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="bulk-reject"
                      name="bulkStatus"
                      value="rejected"
                      onChange={() =>
                        setBulkNewStatus({ rejected: true, accepted: false, "under-review": false })
                      }
                      checked={bulkNewStatus.rejected}
                      className="text-blue-600"
                    />
                    <label htmlFor="bulk-reject" className="text-gray-700 dark:text-gray-300">Reject</label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Notes</h3>
                <textarea
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  rows="4"
                  value={bulkStatusNotes}
                  onChange={(e) => setBulkStatusNotes(e.target.value)}
                  placeholder="Add notes that will be applied to all selected applications..."
                />
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Selected Applications:</h4>
                <div className="max-h-32 overflow-y-auto">
                  {applications
                    .filter(app => selectedIds.has(app.id))
                    .map(app => (
                      <div key={app.id} className="flex justify-between items-center py-1 text-sm">
                        <span className="text-gray-700 dark:text-gray-300">{app.name}</span>
                        <Badge className={statusStyles[app.status] + " text-xs"}>
                          {app.status}
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setBulkStatusChangeOpen(false);
                    setBulkNewStatus({ rejected: false, accepted: false, "under-review": false });
                    setBulkStatusNotes("");
                  }}
                  disabled={bulkChangingStatus}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleBulkStatusChange}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={bulkChangingStatus || (!bulkNewStatus.accepted && !bulkNewStatus.rejected && !bulkNewStatus["under-review"])}
                >
                  {bulkChangingStatus ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <UserCheck className="h-4 w-4 mr-2" />
                      Update {selectedIds.size} Applications
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Screening Banner */}
      {bulkScreenOpen && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 shadow-lg flex items-center gap-3">
            {screening ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                <span className="text-sm text-gray-900 dark:text-white">
                  Screening {selectedIds.size} applicants...
                </span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-900 dark:text-white">
                  Successfully screened {selectedIds.size} applicants
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setBulkScreenOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;