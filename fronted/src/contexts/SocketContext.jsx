import { createContext, useState } from "react";
import useAuth from "../hooks/useAuth";

 
const SocketContext = createContext ({
  newSocketData: [],
  setNewSocketData: () => {},
  clearSocketData: () => {},
  connectWebSocket: () => {
    throw new Error("connectWebSocket must be used within a SocketProvider");
  },
});

export const SocketProvider = ({ children } ) => {
  const [newSocketData, setSocketData] = useState ([]);
  const { auth } = useAuth();
  const setNewSocketData = (data ) => {
    setSocketData((prev) => {
      const isDuplicate = prev.some(
        (msg) => JSON.stringify(msg) === JSON.stringify(data)
      );
      return isDuplicate ? prev : [...prev, data];
    });
  };

  const clearSocketData = () => {
    setSocketData([]);
  };

  const connectWebSocket = (path ) => {
    

    const baseUrl = import.meta.env.VITE_SERVER_URL.replace(/^http/, "ws");
    const socketUrl = `${baseUrl}${path}${auth ? `?token=${auth}` : ""}`;

    const ws = new WebSocket(socketUrl);
    return ws;
  }

  return (
    <SocketContext.Provider
      value={{
        newSocketData,
        setNewSocketData,
        clearSocketData,
        connectWebSocket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;

