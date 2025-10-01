import { useContext } from "react";
import InterviewMessagesContext from "../contexts/InterviewMessagesContext";
function useInterviewMessages() {
  return useContext(InterviewMessagesContext);
}

export default useInterviewMessages;
