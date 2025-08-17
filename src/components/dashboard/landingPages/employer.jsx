import React from 'react';

const employerFeatures = [
  {
    title: 'Post Job Listings',
    description: 'Reach the right candidates by creating and managing job posts easily.',
  },
  {
    title: 'Manage Applicants',
    description: 'Review, filter, and organize all candidate applications in one place.',
  },
  {
    title: 'Schedule Interviews',
    description: 'Invite candidates to interviews with smart scheduling tools.',
  },
  {
    title: 'Recruiter Dashboard',
    description: 'Track job views, application stats, and engagement metrics in real-time.',
  },
];

const Employer = () => {
  return (
    <section className="bg-white dark:bg-gray-900 py-16 px-6 sm:px-10 md:px-16 lg:px-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Solutions for Employers
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Simplify recruitment workflows with tools built for every step of the hiring journey.
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
            <button className="mt-auto text-white bg-white/20 border border-white px-4 py-2 rounded-full hover:bg-white/30 transition-all">
              Explore More
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Employer;
