import { useEffect } from "react";
import { Outlet } from "react-router";
import useSocket from "../hooks/useSockets";
import useToast from "../hooks/useToast";
import useObservations from "../hooks/useObservation";
function parseMessage(message) {
  try {
    const parsed = JSON.parse(message);
    return parsed;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
}
function ObservationLayout() {
  const { setToastMessage } = useToast();
  const { connectWebSocket } = useSocket();
  const { setObservations, setSocket } = useObservations();

  useEffect(() => {
    const socket = connectWebSocket("/ws/observation/");
    
    socket.onmessage = (event) => {
      try {
        const message = parseMessage(event.data);
        setObservations((prev) => {
          return [{ ...message }];
        });
      } catch (e) {
        console.log(e);
        setToastMessage({
          message: "Invalid observation",
          variant: "danger",
        });
      }
    };
    setSocket(socket);

    
  }, []);

  return <Outlet />;
}

export default ObservationLayout;
