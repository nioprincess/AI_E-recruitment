import React, { useState } from "react";

const employerFeatures = [
  {
    title: "Post Job Listings",
    description:
      "Reach the right candidates by creating and managing job posts easily.",
    details:
      "Our job posting tool lets you customize roles, set deadlines, and target the right audience. Posts are automatically optimized for visibility to attract qualified applicants.",
  },
  {
    title: "Manage Applicants",
    description:
      "Review, filter, and organize all candidate applications in one place.",
    details:
      "Centralize your hiring process with applicant tracking. Sort by skills, filter by experience, and quickly identify top candidates without the clutter.",
  },
  {
    title: "Schedule Interviews",
    description:
      "Invite candidates to interviews with smart scheduling tools.",
    details:
      "Easily set interview slots, send reminders, and avoid double-booking. Our system integrates with your calendar for seamless scheduling.",
  },
  {
    title: "Recruiter Dashboard",
    description:
      "Track job views, application stats, and engagement metrics in real-time.",
    details:
      "Stay on top of your hiring pipeline with insights into candidate activity, conversion rates, and job performance analytics.",
  },
];

const Employer = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const closeModal = () => setSelectedFeature(null);

  return (
    <section id="employer" className="bg-white dark:bg-gray-900 py-16 px-6 sm:px-10 md:px-16 lg:px-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Solutions for Employers
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Simplify recruitment workflows with tools built for every step of the
          hiring journey.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {employerFeatures.map((feature, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-[#2F80ED] to-[#56CCF2] text-white rounded-2xl shadow-lg p-6 flex flex-col justify-between h-full transition-transform duration-300 hover:scale-105"
          >
            <div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-sm mb-4">{feature.description}</p>
            </div>
            <button
              onClick={() => setSelectedFeature(feature)}
              className="mt-auto text-white bg-white/20 border border-white px-4 py-2 rounded-full hover:bg-white/30 transition-all"
            >
              Explore More
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-300/70 backdrop-blur-0 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full p-6 relative">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {selectedFeature.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {selectedFeature.details}
            </p>

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Employer;
