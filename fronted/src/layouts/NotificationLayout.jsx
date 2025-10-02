import { useEffect } from "react";
import { Outlet } from "react-router";
import useSocket from "../hooks/useSockets";
import useToast from "../hooks/useToast";
import useNotifications from "../hooks/useNotifications";
import useUserAxios from "../hooks/useUserAxios";
 
function NotificationLayout() {
  const { setToastMessage } = useToast();
  const {connectWebSocket} = useSocket();
  const{setNotifications}= useNotifications()
  const axios= useUserAxios()
 
  const getNotifications= async()=>{
    try {
      const resp= await axios.get("/api/notifications/my-notifications/")
      if(resp.data.success){
        setNotifications(resp.data.data)
      }
      
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getNotifications()
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
