import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const ViewNotification = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API call
  const notificationsData = [
    {
      id: 1,
      type: "application",
      title: "Application Status Update",
      message: "Your application for Senior Frontend Developer at Tech Solutions Rwanda has been shortlisted for the next stage of the hiring process.",
      detailedMessage: "Congratulations! Your application has impressed our hiring team. You have been shortlisted for the Senior Frontend Developer position at Tech Solutions Rwanda. Our AI assessment system has reviewed your qualifications and found them to be an excellent match for this role.\n\nNext Steps:\n1. Complete the AI-powered technical assessment\n2. Schedule your interview with the hiring manager\n3. Prepare any additional materials requested",
      time: "2 hours ago",
      timestamp: "2023-05-20T14:30:00",
      read: false,
      priority: "high",
      meta: {
        jobId: 123,
        jobTitle: "Senior Frontend Developer",
        company: "Tech Solutions Rwanda",
        companyLogo: "https://via.placeholder.com/60",
        status: "shortlisted",
        applicationDate: "2023-05-15",
        salary: "RWF 1,500,000 - 2,000,000",
        location: "Kigali, Rwanda",
        nextSteps: [
          "Complete AI assessment by May 25, 2023",
          "Prepare for technical interview",
          "Review job requirements"
        ]
      }
    },
    {
      id: 2,
      type: "exam",
      title: "AI Assessment Scheduled",
      message: "Complete your AI assessment for Backend Engineer position at Andela Rwanda",
      detailedMessage: "Your AI assessment for the Backend Engineer position has been scheduled. This assessment will evaluate your technical skills, problem-solving abilities, and cultural fit for Andela Rwanda.\n\nAssessment Details:\n- Duration: 90 minutes\n- Format: Multiple choice + coding challenges\n- Topics: Node.js, Databases, System Design\n- Requirements: Stable internet connection, webcam\n\nYour performance on this assessment will determine your progression to the interview stage.",
      time: "1 day ago",
      timestamp: "2023-05-19T10:15:00",
      read: true,
      priority: "medium",
      meta: {
        examId: 456,
        jobTitle: "Backend Engineer",
        company: "Andela Rwanda",
        companyLogo: "https://via.placeholder.com/60",
        deadline: "2023-06-15T23:59:00",
        duration: "90 minutes",
        topics: ["Node.js", "MongoDB", "REST APIs", "System Design"],
        requirements: ["Webcam", "Microphone", "Stable Internet"],
        passingScore: 70
      }
    },
    {
      id: 3,
      type: "interview",
      title: "Interview Invitation",
      message: "You've been invited for an interview with KLab Rwanda",
      detailedMessage: "Congratulations! You have been invited for a technical interview for the UX Designer position at KLab Rwanda.\n\nInterview Details:\n- Date: May 25, 2023\n- Time: 10:00 AM - 10:45 AM\n- Mode: Virtual (Google Meet)\n- Interviewers: Sarah M. (Lead Designer), John D. (Product Manager)\n\nPreparation Tips:\n- Review your portfolio and past projects\n- Be prepared to discuss your design process\n- Have examples of your work ready to share\n- Prepare questions about the role and company culture",
      time: "3 days ago",
      timestamp: "2023-05-17T09:00:00",
      read: false,
      priority: "high",
      meta: {
        interviewId: 789,
        jobTitle: "UX Designer",
        company: "KLab Rwanda",
        companyLogo: "https://via.placeholder.com/60",
        date: "2023-05-25T10:00:00",
        duration: "45 minutes",
        mode: "Virtual",
        platform: "Google Meet",
        interviewers: ["Sarah M. (Lead Designer)", "John D. (Product Manager)"],
        preparation: ["Portfolio review", "Design process discussion", "Case study presentation"]
      }
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchNotification = async () => {
      try {
        const foundNotification = notificationsData.find(notif => notif.id === parseInt(id));
        if (foundNotification) {
          setNotification(foundNotification);
          // Mark as read
          // await markAsRead(foundNotification.id);
        } else {
          console.error("Notification not found");
        }
      } catch (error) {
        console.error("Error fetching notification:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotification();
  }, [id]);

  const getNotificationIcon = (type) => {
    const icons = {
      application: (
        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </div>
      ),
      exam: (
        <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300">
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
          </svg>
        </div>
      ),
      interview: (
        <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300">
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
          </svg>
        </div>
      )
    };
    return icons[type] || icons.application;
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      high: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200",
      medium: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200",
      low: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!notification) {
    return (
      
      <div className="max-w-4xl mt-12 mx-auto px-4 py-8">
        <div className="text-center">
          <svg className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">Notification not found</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">The notification you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/notifications")}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Back to Notifications
          </button>
        </div>
      </div>
      
    );
  }

  return (
    <div className="max-w-full mx-auto mt-12 px-4 py-6 dark:bg-black-100">
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/notifications")}
          className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Notifications
        </button>
        <div className="flex items-center space-x-2">
          {getPriorityBadge(notification.priority)}
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(notification.timestamp).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Notification Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        {/* Header */}
        <div className="flex items-start space-x-4 mb-6">
          {getNotificationIcon(notification.type)}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {notification.title}
              </h1>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {notification.time}
              </span>
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {notification.message}
            </p>
          </div>
        </div>

        {/* Detailed Content */}
        <div className="prose dark:prose-invert max-w-none">
          <div className="whitespace-pre-line text-gray-700 dark:text-gray-300 leading-relaxed">
            {notification.detailedMessage}
          </div>
        </div>

        {/* Meta Information */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Details
          </h3>

          {notification.type === "application" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Job Information</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500 dark:text-gray-400">Position:</span> <span className="text-gray-500 dark:text-gray-400">{notification.meta.jobTitle}</span></p>
                  <p><span className="text-gray-500 dark:text-gray-400">Company:</span> <span className="text-gray-500 dark:text-gray-400">{notification.meta.company}</span></p>
                  <p><span className="text-gray-500 dark:text-gray-400">Location:</span> <span className="text-gray-500 dark:text-gray-400">{notification.meta.location}</span></p>
                  <p><span className="text-gray-500 dark:text-gray-400">Salary:</span> <span className="text-gray-500 dark:text-gray-400">{notification.meta.salary}</span></p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Next Steps</h4>
                <ul className="space-y-1 text-sm">
                  {notification.meta.nextSteps.map((step, index) => (
                    <li key={index} className="text-gray-600 dark:text-gray-300">• {step}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {notification.type === "exam" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Assessment Details</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500 dark:text-gray-400">Position:</span> {notification.meta.jobTitle}</p>
                  <p><span className="text-gray-500 dark:text-gray-400">Company:</span> {notification.meta.company}</p>
                  <p><span className="text-gray-500 dark:text-gray-400">Duration:</span> {notification.meta.duration}</p>
                  <p><span className="text-gray-500 dark:text-gray-400">Deadline:</span> {new Date(notification.meta.deadline).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Topics & Requirements</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500 dark:text-gray-400">Topics:</span> {notification.meta.topics.join(", ")}</p>
                  <p><span className="text-gray-500 dark:text-gray-400">Requirements:</span> {notification.meta.requirements.join(", ")}</p>
                  <p><span className="text-gray-500 dark:text-gray-400">Passing Score:</span> {notification.meta.passingScore}%</p>
                </div>
              </div>
            </div>
          )}

          {notification.type === "interview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Interview Details</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500 dark:text-gray-400">Position:</span> {notification.meta.jobTitle}</p>
                  <p><span className="text-gray-500 dark:text-gray-400">Company:</span> {notification.meta.company}</p>
                  <p><span className="text-gray-500 dark:text-gray-400">Date:</span> {new Date(notification.meta.date).toLocaleDateString()}</p>
                  <p><span className="text-gray-500 dark:text-gray-400">Time:</span> {new Date(notification.meta.date).toLocaleTimeString()}</p>
                  <p><span className="text-gray-500 dark:text-gray-400">Duration:</span> {notification.meta.duration}</p>
                  <p><span className="text-gray-500 dark:text-gray-400">Mode:</span> {notification.meta.mode}</p>
                  <p><span className="text-gray-500 dark:text-gray-400">Platform:</span> {notification.meta.platform}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Interview Panel</h4>
                <ul className="space-y-1 text-sm mb-4">
                  {notification.meta.interviewers.map((interviewer, index) => (
                    <li key={index} className="text-gray-600 dark:text-gray-300">• {interviewer}</li>
                  ))}
                </ul>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Preparation</h4>
                <ul className="space-y-1 text-sm">
                  {notification.meta.preparation.map((item, index) => (
                    <li key={index} className="text-gray-600 dark:text-gray-300">• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex space-x-4">
          {notification.type === "exam" && (
            <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition">
              Start Assessment
            </button>
          )}
          {notification.type === "interview" && (
            <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition">
              Confirm Attendance
            </button>
          )}
          {notification.type === "application" && (
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
              View Job Details
            </button>
          )}
          <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition">
            Mark as Read
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ViewNotification;