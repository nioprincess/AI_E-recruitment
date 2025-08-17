// src/pages/auth/ForgotPassword.jsx
import React from 'react';
import AuthLayout from './AuthLayout';

const ForgotPassword = () => {
  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
      <p className="text-sm text-gray-600 mb-6 text-center">
        Enter your email address and we’ll send you instructions to reset your password.
      </p>

      <form className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded px-4 py-2"
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded"
        >
          Send Reset Instructions
        </button>
      </form>

      <div className="mt-6 text-center text-sm">
        <a href="/signin" className="text-blue-500 hover:underline">
          Back to Sign In
        </a>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
