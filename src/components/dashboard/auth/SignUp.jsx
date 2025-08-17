// src/pages/auth/SignUp.jsx
import React, { useState } from 'react';
import AuthLayout from './AuthLayout';

const SignUp = () => {
  const [userType, setUserType] = useState('jobseeker');

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold mb-4 text-center">Create an Account</h2>

      {/* Toggle user type */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setUserType('jobseeker')}
          className={`px-4 py-2 border rounded ${
            userType === 'jobseeker'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700'
          }`}
        >
          Job Seeker
        </button>
        <button
          onClick={() => setUserType('recruiter')}
          className={`px-4 py-2 border rounded ${
            userType === 'recruiter'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700'
          }`}
        >
          Recruiter
        </button>
      </div>

      <form className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full border rounded px-4 py-2"
        />
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
          Sign Up
        </button>
      </form>

      <div className="mt-6 text-center">
        <button className="w-full border py-2 rounded text-sm hover:bg-gray-100">
          Continue with Google
        </button>
        <p className="mt-4 text-sm">
          Already have an account?{' '}
          <a href="/signin" className="text-blue-500 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
