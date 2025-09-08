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
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";

// Mock data
const mockJobs = [
  { id: "JOB-001", title: "Senior Frontend Developer" },
  { id: "JOB-002", title: "Product Manager" },
  { id: "JOB-003", title: "UX Designer" },
];

const mockApplicants = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    appliedJobId: "JOB-001",
    status: "New",
    appliedDate: "2024-01-20",
    resumeSummary: "Experienced frontend developer with 5+ years in React",
    answers: [
      { q: "Why do you want to work here?", a: "I admire your company's mission" },
      { q: "What are your strengths?", a: "Problem-solving and teamwork" }
    ]
  },
  {
    id: "2",
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    appliedJobId: "JOB-002",
    status: "New",
    appliedDate: "2024-01-19",
    resumeSummary: "Product manager with startup experience",
    answers: [
      { q: "Why do you want to work here?", a: "I want to build products that matter" },
      { q: "What are your strengths?", a: "Strategic thinking and user empathy" }
    ]
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    appliedJobId: "JOB-003",
    status: "Screened",
    appliedDate: "2024-01-18",
    fitScore: 85,
    resumeSummary: "UX designer with background in psychology",
    answers: [
      { q: "Why do you want to work here?", a: "I respect your design-first approach" },
      { q: "What are your strengths?", a: "User research and prototyping" }
    ],
    aiReasons: ["Strong portfolio", "Relevant experience", "Good cultural fit"]
  },
];

const statusStyles = {
  New: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Screened: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  Shortlisted: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const ApplicationsPage = () => {
  // Data state
  const [applicants, setApplicants] = useState(mockApplicants);

  // UI state
  const [search, setSearch] = useState("");
  const [jobFilter, setJobFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [viewingApplicant, setViewingApplicant] = useState(null);
  const [screeningApplicant, setScreeningApplicant] = useState(null);
  const [bulkScreenOpen, setBulkScreenOpen] = useState(false);
  const [screening, setScreening] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("Congratulations! You've been shortlisted for the next round. We'll contact you shortly to schedule an interview.");
  const [sendEmailNotification, setSendEmailNotification] = useState(true);
  const [showNotificationSuccess, setShowNotificationSuccess] = useState(false);

  // Dropdown states
  const [openDropdown, setOpenDropdown] = useState(null);
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

  // Pagination
  const [page, setPage] = useState(1);
  const perPage = 6;

  /** ---------- Filtering ---------- */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return applicants.filter((a) => {
      const matchesQ =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        jobTitle(a.appliedJobId).toLowerCase().includes(q);
      const matchesJob = jobFilter === "all" || a.appliedJobId === jobFilter;
      const matchesStatus = statusFilter === "all" || a.status === statusFilter;
      return matchesQ && matchesJob && matchesStatus;
    });
  }, [search, jobFilter, statusFilter, applicants]);

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
  const jobTitle = (id) => mockJobs.find((j) => j.id === id)?.title ?? "—";
  
  const markStatus = (id, status) => {
    setApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const screenOne = async (a) => {
    setScreeningApplicant(a);
    setScreening(true);
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 900));
    // Mock result: generate a pseudo score & status
    const score = Math.floor(60 + Math.random() * 40);
    const qualified = score >= 70;
    const reasons = qualified
      ? [
          "Matches required skills",
          "Relevant experience level",
          "Strong communication indicators",
        ]
      : ["Missing specific required skill", "Limited domain depth"];
    setApplicants((prev) =>
      prev.map((app) =>
        app.id === a.id
          ? { 
              ...app, 
              status: qualified ? "Shortlisted" : "Rejected", 
              fitScore: score, 
              aiReasons: reasons,
              screened: true
            }
          : app
      )
    );
    setScreening(false);
    
    // Auto-show notification panel for shortlisted candidates
    if (qualified) {
      setShowNotificationSuccess(true);
      setTimeout(() => setShowNotificationSuccess(false), 3000);
    }
  };

  const screenBulk = async () => {
    const ids = Array.from(selectedIds);
    setBulkScreenOpen(true);
    setScreening(true);
    
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setApplicants((prev) =>
      prev.map((a) =>
        ids.includes(a.id)
          ? {
              ...a,
              status: "Shortlisted",
              fitScore: Math.floor(70 + Math.random() * 25),
              screened: true
            }
          : a
      )
    );
    
    setScreening(false);
    setShowNotificationSuccess(true);
    setTimeout(() => {
      setShowNotificationSuccess(false);
      setBulkScreenOpen(false);
    }, 3000);
  };

  const sendNotifications = () => {
    // In a real app, this would connect to your backend email/notification service
    setShowNotificationSuccess(true);
    setTimeout(() => setShowNotificationSuccess(false), 3000);
  };

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Applications</h1>
          <p className="text-gray-600 dark:text-gray-400">AI-powered screening to streamline your hiring process</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {selectedIds.size > 0 && (
            <Button 
              onClick={screenBulk}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={screening}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Screen Selected ({selectedIds.size})
            </Button>
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
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Applicants</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{applicants.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">New</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {applicants.filter(a => a.status === "New").length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Shortlisted</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {applicants.filter(a => a.status === "Shortlisted").length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Screening Progress</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {Math.round((applicants.filter(a => a.status !== "New").length / applicants.length) * 100)}%
          </p>
        </div>
      </div>

{/* useEffect(()=>{},[selectedJob])
useEffect(()=>{
if(selectedJob=="All"){}
},[selectedJob])
Impano
19:44
const[selectActive, setSelectActive]=useState(false)
useEffect(()=>{
if(selectedJob!!="All"){
setSelectActive(false)

}else{
setSelectActive(true);
}
},[selectedJob])

<button disabled={selectActive>Select All</button>}}*/}
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
                onClick={() => toggleDropdown('jobFilter')}
              >
                <Filter className="h-4 w-4" />
                Job: {jobFilter === "all" ? "All" : jobTitle(jobFilter)}
                <ChevronDown className="h-4 w-4" />
              </Button>
              
              {openDropdown === 'jobFilter' && (
                <div 
                  ref={el => dropdownRefs.current['jobFilter'] = el}
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
                    {mockJobs.map((job) => (
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
                onClick={() => toggleDropdown('statusFilter')}
              >
                <Filter className="h-4 w-4" />
                Status: {statusFilter === "all" ? "All" : statusFilter}
                <ChevronDown className="h-4 w-4" />
              </Button>
              
              {openDropdown === 'statusFilter' && (
                <div 
                  ref={el => dropdownRefs.current['statusFilter'] = el}
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
                    <button
                      onClick={() => {
                        setStatusFilter("New");
                        setOpenDropdown(null);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      New
                    </button>
                    <button
                      onClick={() => {
                        setStatusFilter("Shortlisted");
                        setOpenDropdown(null);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Shortlisted
                    </button>
                    <button
                      onClick={() => {
                        setStatusFilter("Rejected");
                        setOpenDropdown(null);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Rejected
                    </button>
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
                <tr key={applicant.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(applicant.id)}
                        onChange={() => toggleSelect(applicant.id)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{applicant.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{applicant.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900 dark:text-white">{jobTitle(applicant.appliedJobId)}</div>
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
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewingApplicant(applicant)}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {applicant.status === "New" && (
                        <Button
                          onClick={() => screenOne(applicant)}
                          disabled={screening}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-blue-200"
                        >
                          {screening && screeningApplicant?.id === applicant.id ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                          ) : (
                            <Sparkles className="h-4 w-4 mr-1" />
                          )}
                          Screen
                        </Button>
                      )}
                      
                      {applicant.status === "Shortlisted" && (
                        <Button
                          onClick={sendNotifications}
                          className="bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900 dark:hover:bg-green-800 dark:text-green-200"
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          Notify
                        </Button>
                      )}
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
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No applicants found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
            <span className="font-medium">{Math.min(startIndex + perPage, filtered.length)}</span> of{" "}
            <span className="font-medium">{filtered.length}</span> results
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

      {/* Notification Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Candidate Notification</h2>
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            {applicants.filter(a => a.status === "Shortlisted").length} Shortlisted
          </Badge>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="notificationMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notification Message
            </label>
            <Textarea
              id="notificationMessage"
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              rows={3}
              className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Switch
                id="email-notification"
                checked={sendEmailNotification}
                onCheckedChange={setSendEmailNotification}
                className="mr-2"
              />
              <label htmlFor="email-notification" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Send email notification
              </label>
            </div>
            
            <Button 
              onClick={sendNotifications}
              disabled={applicants.filter(a => a.status === "Shortlisted").length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              Notify Shortlisted Candidates
            </Button>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {showNotificationSuccess && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg shadow-lg flex items-center">
            <CheckCircle2 className="h-5 w-5 mr-2" />
            <span>Notifications sent successfully to shortlisted candidates!</span>
          </div>
        </div>
      )}

      {/* Applicant Details Modal */}
      {viewingApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{viewingApplicant.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {viewingApplicant.email} • {jobTitle(viewingApplicant.appliedJobId)}
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
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Resume Summary</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {viewingApplicant.resumeSummary || "—"}
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Application Answers
                </h3>
                <ul className="space-y-3">
                  {(viewingApplicant.answers || []).map((qa, i) => (
                    <li key={i}>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{qa.q}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{qa.a}</p>
                    </li>
                  ))}
                </ul>
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
                        <span className="text-gray-600 dark:text-gray-400">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
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