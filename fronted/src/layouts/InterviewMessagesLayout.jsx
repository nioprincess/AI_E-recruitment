import { useEffect } from "react";
import { Outlet } from "react-router";
import useSocket from "../hooks/useSockets";
import useToast from "../hooks/useToast";

import useInterviewMessages from "../hooks/useInterviewContext";
function parseMessage(message) {
  try {
    const parsed = JSON.parse(message);
    if (parsed.message && typeof parsed.message === "string") {
      parsed.message = JSON.parse(parsed.message);
    }
    return parsed;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
}
function InterviewMessagesLayout() {
  const { setToastMessage } = useToast();
  const { connectWebSocket } = useSocket();
  const { setMessages } = useInterviewMessages();

  useEffect(() => {
    const socket = connectWebSocket("/ws/interview/");
    socket.onmessage = (event) => {
      try {
        const message = parseMessage(event.data);

        console.log(message);
        setMessages((prev) => {
          return [{ ...message}];
        });
      } catch (e) {
        console.log(e);
        setToastMessage({
          message: "Invalid notification",
          variant: "danger",
        });
      }
    };

    return () => {
      socket?.close();
    };
  }, []);

  return <Outlet />;
}

export default InterviewMessagesLayout;
