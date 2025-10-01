import { createContext, useState, useCallback } from "react";

const ObservationMessagesContext = createContext({
  socket: WebSocket,
  setSocket: () => {},
  observations: [],
  setObservations: () => {},
  clearObservations: () => {},
});

export const ObservationsProvider = ({ children }) => {
  const [observations, setObservations] = useState([]);
  const [socket, setSocket] = useState(null);
  const clearObservations = useCallback(() => {
    setObservations([]);
  }, []);
  return (
    <ObservationMessagesContext.Provider
      value={{
        socket,
        setSocket,
        observations,
        setObservations,
        clearObservations,
      }}
    >
      {children}
    </ObservationMessagesContext.Provider>
  );
};

export default ObservationMessagesContext;
