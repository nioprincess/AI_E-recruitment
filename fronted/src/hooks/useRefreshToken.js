import axios from "../API/axios";
import useAuth from "./useAuth";
import useToast from "./useToast";
 

 

const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const { setToastMessage } = useToast();

  const refresh = async () => {
    try {
      const resp = await axios.post ("/api/users/token/refresh/", {});
      setAuth(resp.data.access);
      return resp.data.access;
    } catch (err) {
      const error = err  ;

      const toast  = {
        message: error.response?.data?.message || error.message || "Unknown error",
        variant: "danger",
      };

      setToastMessage(toast);
    }
  };

  return refresh;
};

export default useRefreshToken;
