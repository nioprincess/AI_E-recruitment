import React, { createContext, useState, ReactNode } from "react";
import { useToast } from "../hooks/use-toast";

 

 

const ToastContext = createContext (undefined);

 
export const ToastProvider  = ({ children }) => {
  const [toastMessage, setToastMessageInner] = useState ({message:"", variant:"success"});
  const[key, setKey]= useState(0)
   const { toast } = useToast()
    const [serverLoadingMessage, setServerLoadingMessage] = useState (null);
  const setToastMessage = (receivedMessage ) => {

     if (receivedMessage === null) {
        return null;
      }else{
           toast({
          description: receivedMessage.message,
          variant: receivedMessage.variant == "danger" ? "destructive" : "default"
          
        })
      }


     
  }


  return (
    <ToastContext.Provider value={{ toastMessage, setToastMessage, key, serverLoadingMessage, setServerLoadingMessage }}>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastContext;
