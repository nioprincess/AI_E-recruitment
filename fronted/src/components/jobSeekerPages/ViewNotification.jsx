import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useUserAxios from "../../hooks/useUserAxios";

const ViewNotification = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axios = useUserAxios();
  useEffect(() => {
    const fetchNotification = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch notification from API
        const response = await axios.get(`/api/notifications/${id}/`);
        setNotification(response.data);

        // Mark as read when viewing
        if (!response.data.n_is_read) {
          await markAsRead(response.data.id);
        }
      } catch (error) {
        console.error("Error fetching notification:", error);
        setError("Failed to load notification. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotification();
  }, [id]);

  const markAsRead = async (notificationId) => {
    try {
      await axios.post(`/api/notifications/${notificationId}/mark-read/`);
      // Update local state to reflect read status
      setNotification((prev) => (prev ? { ...prev, n_is_read: true } : null));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      job_application: (
        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
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
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      ),
      system: (
        <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      ),
    };
    return icons[type] || icons.system;
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      high: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200",
      medium:
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200",
      low: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
    };
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${styles[priority]}`}
      >
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Extract job title from message
  const getJobTitle = (message) => {
    const match = message.match(/Job '([^']+)'/);
    return match ? match[1] : "Job Application";
  };

  // Get detailed message based on notification type
  const getDetailedMessage = (notification) => {
    if (notification.detailedMessage) {
      return notification.detailedMessage;
    }

    switch (notification.n_type) {
      case "job_application":
        return `Your application for ${getJobTitle(
          notification.n_message
        )} has been received and is being processed. You will be notified about the status of your application soon.`;

      case "exam":
        return `An assessment has been scheduled for your application. Please complete the assessment to proceed with your application.`;

      case "interview":
        return `You have been invited for an interview. Please check the details below and confirm your availability.`;

      default:
        return notification.n_message;
    }
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

  if (error || !notification) {
    return (
      <div className="max-w-4xl mt-12 mx-auto px-4 py-8">
        <div className="text-center">
          <svg
            className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
            {error ? "Error loading notification" : "Notification not found"}
          </h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {error || "The notification you're looking for doesn't exist."}
          </p>
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
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Notifications
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatTime(notification.created_at)}
            </span>
          </div>
        </div>

        {/* Notification Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          {/* Header */}
          <div className="flex items-start space-x-4 mb-6">
            {getNotificationIcon(notification.n_type)}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {getJobTitle(notification.n_message)}
                </h1>
                <div className="flex items-center space-x-2">
                  {!notification.n_is_read && (
                    <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                      <svg
                        className="h-3 w-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      New
                    </span>
                  )}
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatTime(notification.created_at)}
                  </span>
                </div>
              </div>
          
            </div>
          </div>

          {/* Detailed Content */}
          <div className="prose dark:prose-invert max-w-none">
            <div className="whitespace-pre-line text-gray-700 dark:text-gray-300 leading-relaxed">
              {getDetailedMessage(notification)}
            </div>
          </div>

          {/* Meta Information */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Notification Information
                </h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-500 dark:text-gray-400">
                      Type:
                    </span>{" "}
                    <span className="capitalize text-gray-700 dark:text-gray-300">
                      {notification.n_type.replace("_", " ")}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-500 dark:text-gray-400">
                      Status:
                    </span>{" "}
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        notification.n_is_read
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                          : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                      }`}
                    >
                      {notification.n_is_read ? "Read" : "Unread"}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-500 dark:text-gray-400">
                      Received:
                    </span>{" "}
                    <span className="text-gray-700 dark:text-gray-300">
                      {new Date(notification.created_at).toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>
 
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex space-x-4">
         

            {!notification.n_is_read && (
              <button
                onClick={() => markAsRead(notification.id)}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
              >
                Mark as Read
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewNotification;
