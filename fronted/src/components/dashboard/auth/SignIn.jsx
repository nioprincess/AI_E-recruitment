import { useNavigate } from "react-router-dom";
 
import useAuth from "../../../hooks/useAuth";
import useToast from "../../../hooks/useToast";
import { useState } from "react";
import { Eye, EyeOff,  Loader2 } from "lucide-react";
import AuthLayout from "./AuthLayout";
import  {isAxiosError} from "axios";
import useUserAxios from "../../../hooks/useUserAxios";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const { setToastMessage } = useToast();
  const[pending, setPending]= useState(false)
  const axios= useUserAxios()
 const location = useLocation();
  const from=  location?.state?.from?.pathname
  ? location?.state?.from?.pathname
  : null;
  const [formData, setFormData] = useState({
    u_email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const  handleSubmit = async (e) => {
    e.preventDefault()
     setPending(true)
    try {
      const resp = await axios.post("api/users/token/", formData);
      const { access } = resp.data;
      setAuth(access);
      if (from) navigate(from, { replace: true });
      else {
        let user =  jwtDecode(access);
        console.log(user)
        if (user.role == "admin") navigate("/admin/", { replace: true });
        else if (user.role == "admin") {
          navigate("/admin/", { replace: true });
        } else if (user.role == "user") {
          navigate("/home/", { replace: true });
        } else if (user.role == "recruiter") {
          navigate("/recruiter/dashboard/", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }
    } catch (error) {
        console.log(error)
      if (isAxiosError(error)) {
      
        const message = error.response?.data?.message;
        setToastMessage({
          message:
            message?.email?.join(" , ") ||
            message?.password?.join(" , ") ||
            message?.detail,
          variant: "danger",
        });
      } else {
        setToastMessage({
          message: "Something went wrong",
          variant: "danger",
        });
      }
    }finally{
      setPending(false)
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold mb-4 text-center">
        Sign In to Your Account
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="email"
          name="u_email"
          onChange={handleChange}
          placeholder="Email"
          className="w-full border rounded px-4 py-2"
        />
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            onChange={handleChange}
            name="password"
            placeholder="password"
                className="w-full border rounded px-4 py-2"
          />
          <button
            type="button"
            className="absolute right-2 top-3 text-gray-500 hover:text-gray-700"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <button type="submit" className="w-full bg-[#7588f9] p-2" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : "Login"}
        </button>
        <p className="text-sm text-right">
          <a href="/forgot-password" className="text-blue-500 hover:underline">
            Forgot Password?
          </a>
        </p>
      </form>

      <div className="mt-6 text-center">
        <button className="w-full border py-2 rounded text-sm hover:bg-gray-100">
          Continue with Google
        </button>
        <p className="mt-4 text-sm">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignIn;
