import React, { useState } from "react";

import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  ArrowRight,
  CheckCircle,
  VenusAndMars,
} from "lucide-react";

import AuthLayout from "./AuthLayout";
import { useEffect, useRef } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "../../../API/axios";
import useToast from "../../../hooks/useToast";
import { isAxiosError } from "axios";
const SignUp = () => {
  const [userType, setUserType] = useState("jobseeker");
  const [formData, setFormData] = useState({
    u_first_name: "",
    u_last_name: "",
    u_email: "",
    password: "",
    confirm_password: "",
    u_dob: "",
    u_gender: "",
    u_phone: "",
    u_middle_name: "",
    has_company: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const { setToastMessage } = useToast();
  const [age, setAge] = useState(null);

  const calculateAge = () => {
    if (!formData.u_dob) return;

    const birthDateTime = new Date(formData.u_dob).getTime();
    const currentTime = new Date().getTime();

    // Calculate age in years with high precision
    const ageInMilliseconds = currentTime - birthDateTime;
    const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365.2425; // Average year length including leap years

    const preciseAge = ageInMilliseconds / millisecondsPerYear;
    setAge(preciseAge);
  };

  const formatAge = (ageValue) => {
    if (ageValue === null || ageValue === undefined) return "--.--";

    return ageValue.toFixed(6);
  };
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Client-side validation
    if (formData.password !== formData.confirm_password) {
      setErrors({ confirm_password: "Passwords do not match" });
      setLoading(false);
      return;
    }

    try {
      // Prepare data according to the serializer fields only
      const userData = {
        u_first_name: formData.u_first_name,
        u_last_name: formData.u_last_name,
        u_email: formData.u_email,
        password: formData.password,
        u_role: userType === "recruiter" ? "recruiter" : "user",
        has_company: userType === "recruiter" ? true : false,
        u_dob: formData.u_dob,
        u_gender: formData.u_gender,
        u_phone: formData.u_phone,
        u_middle_name: formData.u_middle_name || "",
      };

      const response = await axios.post("/api/users/", userData);

      setSuccess(true);

      // Reset form
      setFormData({
        u_first_name: "",
        u_last_name: "",
        u_email: "",
        password: "",
        confirm_password: "",
        u_dob: "",
        u_gender: "",
        u_phone: "",
        has_company: false,
        u_middle_name: "",
      });
    } catch (error) {
      if (isAxiosError(error)) {
        let message = error.response.data.message;
        setToastMessage({
          variant: "danger",
          message: JSON.stringify(message),
        });
      }
      if (error.response && error.response.data) {
        const apiErrors = error.response.data;
        const formattedErrors = {};
        Object.keys(apiErrors).forEach((key) => {
          if (Array.isArray(apiErrors[key])) {
            formattedErrors[key] = apiErrors[key].join(" ");
          } else {
            formattedErrors[key] = apiErrors[key];
          }
        });
        setErrors(formattedErrors);
      } else {
        setErrors({
          general: "An error occurred during registration. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setAge(null);
    setIsRunning(false);
  };

  useEffect(() => {
    if (formData.u_dob) {
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  }, [formData.u_dob]);

  // Set up the interval for real-time updates
  useEffect(() => {
    if (isRunning) {
      calculateAge(); // Calculate immediately
      intervalRef.current = setInterval(calculateAge, 10); // Update every 100ms
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        handleClear();
      }
    };
  }, [isRunning, formData.u_dob]);
  return (
    <AuthLayout>
      <div>
        {success && (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Registration Successful!
                </h2>
                <p className="text-gray-600 mb-6">
                  Your account has been created successfully. You can now sign
                  in to your account.
                </p>
                <button
                  onClick={() => (window.location.href = "/signin")}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Go to Sign In
                </button>
              </div>
            </div>
          </div>
        )}
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Create an Account
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Join us and start your journey
        </p>

        {/* User type selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            I am a:
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setUserType("jobseeker")}
              className={`flex-1 px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                userType === "jobseeker"
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              Job Seeker
            </button>
            <button
              type="button"
              onClick={() => setUserType("recruiter")}
              className={`flex-1 px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                userType === "recruiter"
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              Recruiter
            </button>
          </div>
        </div>

        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {errors.general}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="u_first_name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                First Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="u_first_name"
                  name="u_first_name"
                  value={formData.u_first_name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              {errors.u_first_name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.u_first_name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="u_last_name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Last Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="u_last_name"
                  name="u_last_name"
                  value={formData.u_last_name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              {errors.u_last_name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.u_last_name}
                </p>
              )}
            </div>
          </div>

          {/* Middle Name (Optional) */}
          <div>
            <label
              htmlFor="u_middle_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Middle Name (Optional)
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="u_middle_name"
                name="u_middle_name"
                value={formData.u_middle_name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="u_email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                id="u_email"
                name="u_email"
                value={formData.u_email}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            {errors.u_email && (
              <p className="text-red-500 text-sm mt-1">{errors.u_email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-12 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirm_password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm_password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-12 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.confirm_password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirm_password}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="u_phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number *
            </label>
            <div className="relative">
              <PhoneInput
                country={"rw"}
                value={formData.u_phone}
                type="tel"
                id="u_phone"
                name="u_phone"
                onChange={(phone) => {
                  setFormData({ ...formData, u_phone: phone });
                }}
                inputStyle={{
                  width: "96%",
                  padding: "1.7em",
                  marginLeft: "1.3em",
                }}
                inputProps={{
                  name: "u_phone",
                  required: true,
                  autoFocus: true,
                  length: 12,
                }}
                required
              />
            </div>
            {errors.u_phone && (
              <p className="text-red-500 text-sm mt-1">{errors.u_phone}</p>
            )}
          </div>

          {/* Date of Birth and Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="u_dob"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {age ? "You're " : "Date of Birth* "}
                {age && (
                  <span>
                    <span className="mt-2 p-2 bg-[#f0f0f0] rounded-md font-bold text-[#007bff]">
                      {formatAge(age)}
                    </span>{" "}
                    years old.
                  </span>
                )}
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  id="u_dob"
                  name="u_dob"
                  value={formData.u_dob}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              {errors.u_dob && (
                <p className="text-red-500 text-sm mt-1">{errors.u_dob}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="u_gender"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Gender *
              </label>
              <div className="relative">
                <VenusAndMars className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  id="u_gender"
                  name="u_gender"
                  value={formData.u_gender}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  required
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
              {errors.u_gender && (
                <p className="text-red-500 text-sm mt-1">{errors.u_gender}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating Account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/signin"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
