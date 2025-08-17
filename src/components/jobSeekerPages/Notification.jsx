import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  // Sample notification data
  const notifications = {
    all: [
      {
        id: 1,
        type: "application",
        title: "Application Update",
        message: "Your application for Senior Frontend Developer at Tech Solutions Rwanda has been shortlisted",
        time: "2 hours ago",
        read: false,
        meta: {
          jobId: 123,
          status: "shortlisted"
        }
      },
      {
        id: 2,
        type: "exam",
        title: "AI Assessment Scheduled",
        message: "Complete your AI assessment for Backend Engineer position at Andela Rwanda",
        time: "1 day ago",
        read: true,
        meta: {
          examId: 456,
          deadline: "2023-06-15"
        }
      },
      {
        id: 3,
        type: "interview",
        title: "Interview Invitation",
        message: "You've been invited for an interview with KLab Rwanda on May 25, 2023 at 10:00 AM",
        time: "3 days ago",
        read: false,
        meta: {
          interviewId: 789,
          date: "2023-05-25T10:00:00"
        }
      },
      {
        id: 4,
        type: "system",
        title: "Profile Completion Reminder",
        message: "Complete your profile to increase your visibility to recruiters",
        time: "1 week ago",
        read: true,
        meta: {}
      }
    ],
    unread: [
      {
        id: 1,
        type: "application",
        title: "Application Update",
        message: "Your application for Senior Frontend Developer at Tech Solutions Rwanda has been shortlisted",
        time: "2 hours ago",
        read: false,
        meta: {
          jobId: 123,
          status: "shortlisted"
        }
      },
      {
        id: 3,
        type: "interview",
        title: "Interview Invitation",
        message: "You've been invited for an interview with KLab Rwanda on May 25, 2023 at 10:00 AM",
        time: "3 days ago",
        read: false,
        meta: {
          interviewId: 789,
          date: "2023-05-25T10:00:00"
        }
      }
    ]
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "application":
        return (
          <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
              <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
            </svg>
          </div>
        );
      case "exam":
        return (
          <div className="p-2 rounded-full bg-purple-100 dark:bg-black-100 text-purple-600 dark:text-purple-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
          </div>
        );
      case "interview":
        return (
          <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark as read logic would go here
    console.log("Notification clicked:", notification);
    
    // Example navigation based on notification type
    switch (notification.type) {
      case "application":
        navigate(`/jobs/${notification.meta.jobId}`);
        break;
      case "exam":
        navigate("/assessments");
        break;
      case "interview":
        navigate("/interviews");
        break;
      default:
        break;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Notifications</h1>
        <button className="text-blue-600 dark:text-blue-400 hover:underline">
          Mark all as read
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-3 text-sm font-medium ${activeTab === "all" ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
          >
            All Notifications
          </button>
          <button
            onClick={() => setActiveTab("unread")}
            className={`px-4 py-3 text-sm font-medium ${activeTab === "unread" ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
          >
            Unread
          </button>
        </nav>
      </div>

      {/* Notification List */}
      <div className="space-y-4">
        {notifications[activeTab].length > 0 ? (
          notifications[activeTab].map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`p-4 rounded-lg cursor-pointer transition ${notification.read ? "bg-white dark:bg-gray-800" : "bg-blue-50 dark:bg-blue-900/20"} hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700`}
            >
              <div className="flex items-start space-x-3">
                {getNotificationIcon(notification.type)}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className={`font-medium ${notification.read ? "text-gray-800 dark:text-gray-200" : "text-gray-900 dark:text-white"}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {notification.time}
                    </span>
                  </div>
                  <p className={`mt-1 ${notification.read ? "text-gray-600 dark:text-gray-400" : "text-gray-700 dark:text-gray-300"}`}>
                    {notification.message}
                  </p>
                  {notification.type === "exam" && !notification.read && (
                    <button className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition">
                      Take Assessment
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No notifications</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {activeTab === "unread" ? "You have no unread notifications" : "You don't have any notifications yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;