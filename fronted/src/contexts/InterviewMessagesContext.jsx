import { createContext, useState, useCallback } from "react";
 
 

const InterviewMessagesContext = createContext ({
  messages: [],
  setMessages: () => {},
  clearMessages: () => {},
});

export const MessagesProvider = ({ children } ) => {
  const [messages, setMessages] = useState ([]);
 
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

 

  return (
    <InterviewMessagesContext.Provider
      value={{
        messages,
        setMessages,
        clearMessages,
      }}
    >
      {children}
    </InterviewMessagesContext.Provider>
  );
};

export default InterviewMessagesContext;