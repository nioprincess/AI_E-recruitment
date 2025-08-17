import React from 'react';

const AboutUs = () => {
  return (
    <div className="bg-white dark:bg-black-100 text-black dark:text-white px-6 py-16">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          About Us
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          We’re building a smarter, simpler, and more powerful recruitment platform for both employers and job seekers. Our mission is to connect top talent with meaningful opportunities in a way that’s fast, transparent, and easy to manage.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-blue-100 to-cyan-200 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
          <p className="text-sm text-gray-800 dark:text-gray-300">
            To redefine how hiring works by offering an all-in-one platform that empowers employers and job seekers alike.
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-100 to-cyan-200 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-2">What We Offer</h3>
          <p className="text-sm text-gray-800 dark:text-gray-300">
            From job posting and applicant tracking to interview scheduling — our tools streamline your entire hiring process.
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-100 to-cyan-200 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-2">Why Choose Us</h3>
          <p className="text-sm text-gray-800 dark:text-gray-300">
            Built with simplicity and efficiency in mind, our platform helps you save time, reduce costs, and hire smarter.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
