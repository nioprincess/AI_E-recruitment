import { useEffect } from "react";
import { Outlet } from "react-router";
import useSocket from "../hooks/useSockets";
import useToast from "../hooks/useToast";
import useNotifications from "../hooks/useNotifications";
import useUserAxios from "../hooks/useUserAxios";
 
function NotificationLayout() {
  const { setToastMessage } = useToast();
  const {connectWebSocket} = useSocket();
  const{notifications,setNotifications}= useNotifications()
 
  

  useEffect(() => {
    const socket=connectWebSocket("/ws/notification/");
    socket.onmessage = (event ) => {
      console.log(event)
      try {
        const notification  = JSON.parse(event.data);
        if (notification.message) {
          setToastMessage({
            message: notification.message || "New message received",
            variant:"info" ,
            
          });
               setNotifications((prevNotifications ) => [
            ...prevNotifications,
            notification
          ]);

        }
      } catch (e) {
        console.log(e)
        setToastMessage({
            message: "Invalid notification",
            variant:"danger" ,
            
          });
      }
    };

    return () => {
      socket?.close();  
    };
  }, []);
   

  return <Outlet />;
}

export default NotificationLayout;
