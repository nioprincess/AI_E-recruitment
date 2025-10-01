import { useContext } from "react";
import ObservationMessagesContext from "../contexts/ObservationMessageContext";
function useObservations() {
  return useContext( ObservationMessagesContext);
}

export default useObservations;
