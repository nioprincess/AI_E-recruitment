import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';

const SignIn = () => {
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    // Placeholder for actual login logic
    // After successful login:
    // inside your login success logic
localStorage.setItem("user", JSON.stringify({ email: "user@example.com" }));
navigate("/home");

    navigate('/verify-email');
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold mb-4 text-center">Sign In to Your Account</h2>
      <form className="space-y-4" onSubmit={handleSignIn}>
        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded px-4 py-2"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded px-4 py-2"
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#2F80ED] to-[#56CCF2] hover:from-blue-300 hover:to-blue-500 text-white py-2 rounded"
        >
          Sign In
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
          Don't have an account?{' '}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignIn;
