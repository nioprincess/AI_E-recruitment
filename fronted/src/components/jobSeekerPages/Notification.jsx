import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useNotifications from "../../hooks/useNotifications";
import useUserAxios from "../../hooks/useUserAxios";

const Notifications = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const {notifications, setNotifications} = useNotifications();
  const [loading, setLoading] = useState(true);
  const [markingRead, setMarkingRead] = useState(null);
  const axios= useUserAxios()

  useEffect(() => {
    // Process notifications from the hook
    const processNotifications = () => {
      try {
        if (notifications && Array.isArray(notifications)) {
          const unreadNotifications = notifications.filter(notif => !notif.n_is_read);
          setNotifications({
            all: notifications,
            unread: unreadNotifications
          });
        }
      } catch (error) {
        console.error("Error processing notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    processNotifications();
  }, [notifications]);

  const markAsRead = async (id) => {
    try {
      setMarkingRead(id);
      
      setNotifications(prev => ({
        all: prev.all.map(n => n.id === id ? { ...n, n_is_read: true } : n),
        unread: prev.unread.filter(n => n.id !== id)
      }));

      await axios.post(`/api/notifications/${id}/mark-read/`);
      
    } catch (error) {
      console.error("Error marking as read:", error);
      
      setNotifications(prev => ({
        all: prev.all.map(n => n.id === id ? { ...n, n_is_read: false } : n),
        unread: [...prev.unread, prev.all.find(n => n.id === id)]
      }));
      
      alert("Failed to mark notification as read. Please try again.");
    } finally {
      setMarkingRead(null);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Update UI optimistically
      const previousState = { ...notifications };
      setNotifications(prev => ({
        all: prev.all.map(n => ({ ...n, n_is_read: true })),
        unread: []
      }));

      // API calls to mark all unread notifications as read
      const markReadPromises = previousState.unread.map(notification =>
        axios.post(`/api/notifications/${notification.id}/mark-read/`)
      );
      
      await Promise.all(markReadPromises);
      
    } catch (error) {
      console.error("Error marking all as read:", error);
      
      // Revert UI changes if API call fails
      setNotifications(previousState);
      
      // Show error message to user
      alert("Failed to mark all notifications as read. Please try again.");
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      job_application: (
        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </div>
      ),
      exam: (
        <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
          </svg>
        </div>
      ),
      interview: (
        <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
          </svg>
        </div>
      ),
      system: (
        <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
      )
    };
    return icons[type] || icons.system;
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
    return match ? match[1] : 'Job Application';
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          {[1, 2, 3].map((n) => (
            <div key={n} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full mt-12 mx-auto px-4 py-6 dark:bg-black-100">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Notifications</h1>
          {notifications.unread && notifications.unread.length > 0 && (
            <button
              onClick={markAllAsRead}
              disabled={markingRead}
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === "all" 
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400" 
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              All Notifications
              {notifications.all && notifications.all.length > 0 && (
                <span className="ml-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                  {notifications.all.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("unread")}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === "unread" 
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400" 
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Unread
              {notifications.unread && notifications.unread.length > 0 && (
                <span className="ml-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-xs px-2 py-1 rounded-full">
                  {notifications.unread.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Notification List */}
        <div className="space-y-3">
          {notifications[activeTab] && notifications[activeTab].length > 0 ? (
            notifications[activeTab].map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg cursor-pointer transition ${
                  notification.n_is_read 
                    ? "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700" 
                    : "bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                } border border-gray-200 dark:border-gray-700`}
              >
                <Link to={`/notifications/${notification.id}`} className="block">
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.n_type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className={`text-sm font-medium truncate ${
                          notification.n_is_read 
                            ? "text-gray-800 dark:text-gray-200" 
                            : "text-gray-900 dark:text-gray-100"
                        }`}>
                          {getJobTitle(notification.n_message)}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs whitespace-nowrap text-gray-500 dark:text-gray-400">
                            {formatTime(notification.created_at)}
                          </span>
                        </div>
                      </div>
                      <p className={`text-sm ${
                        notification.n_is_read 
                          ? "text-gray-600 dark:text-gray-400" 
                          : "text-gray-700 dark:text-gray-300"
                      }`}>
                        {notification.n_message}
                      </p>
                      {!notification.n_is_read && (
                        <div className="mt-2 flex items-center space-x-4">
                          <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                            <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            New
                          </span>
                          {notification.n_type === "exam" && (
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                navigate("/assessments");
                              }}
                              className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
                            >
                              Take Assessment
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
                {!notification.n_is_read && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => markAsRead(notification.id)}
                      disabled={markingRead === notification.id}
                      className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {markingRead === notification.id ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Marking...
                        </>
                      ) : (
                        "Mark as read"
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-10">
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
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                />
              </svg>
              <h3 className="mt-3 text-lg font-medium text-gray-900 dark:text-gray-100">
                No notifications
              </h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                {activeTab === "unread" 
                  ? "You have no unread notifications" 
                  : "You don't have any notifications yet"}
              </p>
            </div>
          )}
        </div>

        {/* Stats Footer */}
        {notifications.all && notifications.all.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              <span>
                {notifications.unread ? notifications.unread.length : 0} unread of {notifications.all.length} total
              </span>
              <span>
                Last updated: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;