// src/pages/auth/AuthLayout.jsx
import React from 'react';
import image from '../../../assets/images/auth_img.png'; // Adjust the path as necessary

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
      {/* Left Side - Image */}
      <div className="hidden md:block">
        <img
          src={image}
          alt="Auth Visual"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
