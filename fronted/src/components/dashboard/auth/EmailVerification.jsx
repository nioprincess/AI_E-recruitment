import React from "react";

const EmailVerification = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black-100 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          Verify Your Email
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          We’ve sent a verification link to your email. Please check your inbox and click on the link to verify your account.
        </p>
        <button className="bg-black text-white dark:bg-white dark:text-black px-6 py-2 rounded-full font-medium hover:opacity-90 transition">
          Resend Email
        </button>
      </div>
    </div>
  );
};

export default EmailVerification;
