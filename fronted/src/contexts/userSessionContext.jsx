import  { createContext, useState } from "react";

 
const userSessionContext = createContext (undefined);

 

export const AuthProvider  = ({ children }) => {
  const [auth, setAuth] = useState (null); 

  return (
    <userSessionContext.Provider value={{ auth, setAuth }}>
      {children}
    </userSessionContext.Provider>
  );
};

export default userSessionContext;
