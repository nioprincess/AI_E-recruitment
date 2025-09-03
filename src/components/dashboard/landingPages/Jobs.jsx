import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import logo1 from '../../../assets/images/ex-logo1.png';
import logo2 from '../../../assets/images/ex-logo3.png';
import logo3 from '../../../assets/images/ex-logo4.png';
import logo4 from '../../../assets/images/ex-logo5.png';
import logo5 from '../../../assets/images/ex-logo8.png';

const ThemeContext = React.createContext();

const Jobs = () => {
  const { isDark } = useContext(ThemeContext) || { isDark: false };
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const navigate = useNavigate();

  const jobList = [
    {
      id: 1, title: 'Software Engineer', company: 'TechCorp', location: 'Kigali, Rwanda', level: 'Mid', 
      postNumber: 'TC-SE-001', type: 'Full-Time', contract: 'Permanent', postedOn: '2025-08-01', 
      deadline: '2025-09-01', image: logo1, category: 'Job'
    },
    {
      id: 2, title: 'Data Analyst', company: 'DataSolutions', location: 'Nairobi, Kenya', level: 'Entry', 
      postNumber: 'DS-DA-002', type: 'Part-Time', contract: 'Contract', postedOn: '2025-08-05', 
      deadline: '2025-08-30', image: logo2, category: 'Job'
    },
    {
      id: 3, title: 'UI/UX Designer', company: 'DesignHub', location: 'Dar es Salaam, Tanzania', level: 'Senior', 
      postNumber: 'DH-UX-003', type: 'Full-Time', contract: 'Permanent', postedOn: '2025-08-10', 
      deadline: '2025-09-10', image: logo3, category: 'Job'
    },
    {
      id: 4, title: 'Backend Developer', company: 'TechCorp', location: 'Kigali, Rwanda', level: 'Mid', 
      postNumber: 'TC-BD-004', type: 'Contract', contract: 'Temporary', postedOn: '2025-08-12', 
      deadline: '2025-08-28', image: logo4, category: 'Job'
    },
    {
      id: 5, title: 'Marketing Specialist', company: 'DataSolutions', location: 'Nairobi, Kenya', level: 'Junior', 
      postNumber: 'DS-MS-005', type: 'Full-Time', contract: 'Permanent', postedOn: '2025-08-15', 
      deadline: '2025-09-15', image: logo5, category: 'Job'
    },
    {
      id: 6, title: 'AI Researcher', company: 'AIHub', location: 'Kampala, Uganda', level: 'Senior', 
      postNumber: 'AIH-AR-006', type: 'Full-Time', contract: 'Internship', postedOn: '2025-08-20', 
      deadline: '2025-09-05', image: logo1, category: 'Internship'
    },
  ];

  const companies = [...new Set(jobList.map(job => job.company))];
  const locations = [...new Set(jobList.map(job => job.location))];
  const jobTypes = [...new Set(jobList.map(job => job.type))];

  const calculateTimeLeft = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate - now;
    if (diff <= 0) return 'Expired';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  };

  const filteredJobs = jobList.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || job.location === locationFilter;
    const matchesJobType = !jobTypeFilter || job.type === jobTypeFilter;
    const matchesCompany = !selectedCompany || job.company === selectedCompany;
    return matchesSearch && matchesLocation && matchesJobType && matchesCompany;
  });

  const showOnly = 6;
  const hasMore = filteredJobs.length > showOnly;
  const visibleJobs = filteredJobs.slice(0, showOnly);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header and Filters */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6">
            Job Opportunities
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search jobs or companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-1/2 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white 
                text-gray-900 placeholder-gray-500"
            />
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full sm:w-1/4 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white 
                text-gray-900"
            >
              <option value="">All Locations</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <select
              value={jobTypeFilter}
              onChange={(e) => setJobTypeFilter(e.target.value)}
              className="w-full sm:w-1/4 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white 
                text-gray-900"
            >
              <option value="">All Job Types</option>
              {jobTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Company Filter */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Filter by Company
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCompany(null)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors 
                ${!selectedCompany 
                  ? 'bg-blue-100 text-black' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'} 
                hover:bg-blue-400 hover:text-black`}
            >
              All Companies
            </button>
            {companies.map(company => (
              <button
                key={company}
                onClick={() => setSelectedCompany(company)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors 
                  ${selectedCompany === company 
                    ? 'bg-blue-100 text-black' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'} 
                  hover:bg-blue-400 hover:text-black`}
              >
                {company}
              </button>
            ))}
          </div>
        </div>

        {/* Job Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleJobs.map(job => (
            <div
              key={job.id}
              className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 hover:shadow-xl 
                transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start gap-4">
                <img
                  src={job.image}
                  alt={`${job.company} logo`}
                  className="w-16 h-16 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {job.title}
                    </h3>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full 
                        ${job.category === 'Internship' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}`}
                    >
                      {job.category}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-1">
                    {job.company}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {job.location}
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <div>
                      <span className="font-medium">Level: </span>{job.level}
                    </div>
                    <div>
                      <span className="font-medium">Post: </span>{job.postNumber}
                    </div>
                    <div>
                      <span className="font-medium">Contract: </span>{job.contract}
                    </div>
                    <div>
                      <span className="font-medium">Posted: </span>{job.postedOn}
                    </div>
                    <div>
                      <span className="font-medium">Deadline: </span>{job.deadline}
                    </div>
                    <div>
                      <span className="font-medium">Time Left: </span>
                      <span className="text-red-600 dark:text-red-400">
                        {calculateTimeLeft(job.deadline)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="mt-4 w-full bg-gradient-to-r from-blue-100 to-blue-400 
                      hover:from-blue-400 hover:to-blue-100 text-white font-semibold 
                      py-2 px-4 rounded-lg transition-colors duration-300"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* See More Button */}
        {hasMore && (
          <div className="mt-10 text-center">
            <a
              href="/"
              className="inline-block px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 
                hover:from-indigo-500 hover:to-purple-500 text-white font-semibold 
                rounded-full transition-colors duration-300"
            >
              See More Jobs →
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

// Theme provider for app root
const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);
  }, []);
  return <ThemeContext.Provider value={{ isDark, setIsDark }}>{children}</ThemeContext.Provider>;
};

export { Jobs, ThemeProvider };