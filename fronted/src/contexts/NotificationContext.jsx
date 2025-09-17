import { createContext, useState, useCallback } from "react";
 
 

const NotificationContext = createContext ({
  notifications: [],
  setNotifications: () => {},
  clearNotifications: () => {},
});

export const NotificationProvider = ({ children } ) => {
  const [notifications, setNotificationsData] = useState ([]);
 
  const clearNotifications = useCallback(() => {
    setNotificationsData([]);
  }, []);

  const setNotifications = useCallback(
    (data ) => {
      if (typeof data === 'function') {
        setNotificationsData(data);
      } else {
        setNotificationsData(data);
      }
    },
    []
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        setNotifications,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;