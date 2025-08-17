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
    { id: 1, title: 'Software Engineer', company: 'TechCorp', location: 'Kigali, Rwanda', type: 'Full-Time', image: logo1 },
    { id: 2, title: 'Data Analyst', company: 'DataSolutions', location: 'Nairobi, Kenya', type: 'Part-Time', image: logo2 },
    { id: 3, title: 'UI/UX Designer', company: 'DesignHub', location: 'Dar es Salaam, Tanzania', type: 'Full-Time', image: logo3 },
    { id: 4, title: 'Backend Developer', company: 'TechCorp', location: 'Kigali, Rwanda', type: 'Contract', image: logo4 },
    { id: 5, title: 'Marketing Specialist', company: 'DataSolutions', location: 'Nairobi, Kenya', type: 'Full-Time', image: logo5 },
    { id: 6, title: 'AI Researcher', company: 'AIHub', location: 'Kampala, Uganda', type: 'Full-Time', image: logo1 },
  ];

  const companies = [...new Set(jobList.map(job => job.company))];
  const locations = [...new Set(jobList.map(job => job.location))];
  const jobTypes = [...new Set(jobList.map(job => job.type))];

  const filteredJobs = jobList.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || job.location === locationFilter;
    const matchesJobType = !jobTypeFilter || job.type === jobTypeFilter;
    const matchesCompany = !selectedCompany || job.company === selectedCompany;
    return matchesSearch && matchesLocation && matchesJobType && matchesCompany;
  });

  const showOnly = 5;
  const hasMore = filteredJobs.length > showOnly;
  const visibleJobs = filteredJobs.slice(0, showOnly);

  return (
    <div className="bg-white dark:bg-black-100 text-black dark:text-white px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header and Filters */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-4">Job Opportunities</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search jobs or companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-2/3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            />
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full sm:w-1/6 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Locations</option>
              {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
            <select
              value={jobTypeFilter}
              onChange={(e) => setJobTypeFilter(e.target.value)}
              className="w-full sm:w-1/6 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Job Types</option>
              {jobTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
        </div>

        {/* Company Filter */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Filter by Company</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCompany(null)}
              className={`px-4 py-2 rounded-md ${!selectedCompany ? 'bg-gray-300 dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-800'} hover:bg-gray-300 dark:hover:bg-gray-600 transition`}
            >
              All Companies
            </button>
            {companies.map(company => (
              <button
                key={company}
                onClick={() => setSelectedCompany(company)}
                className={`px-4 py-2 rounded-md ${selectedCompany === company ? 'bg-gray-300 dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-800'} hover:bg-gray-300 dark:hover:bg-gray-600 transition`}
              >
                {company}
              </button>
            ))}
          </div>
        </div>

        {/* Job Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleJobs.map(job => (
            <div key={job.id} className="bg-gray-100 dark:bg-gray-900 shadow-lg p-6 rounded-lg flex flex-row justify-between gap-4 hover:shadow-lg transition-shadow">
              <img src={job.image} alt="Job Thumbnail" className="w-24 h-24 rounded-full object-cover" />
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{job.company}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">{job.location}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">{job.type}</p>
                </div>
                <button
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  className="mt-4 inline-block bg-gradient-to-br from-[#2F80ED] to-[#56CCF2] hover:from-blue-300 hover:to-blue-500 px-4 py-2 rounded-full text-white text-sm font-medium transition relative overflow-hidden group"
                >
                  <span className="relative z-10 text-white group-hover:text-black">Apply Now</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* See More Button */}
        {hasMore && (
          <div className="mt-8 text-center">
            <a
              href="/"
              className="inline-block px-6 py-3 bg-gradient-to-br from-[#2F80ED] to-[#56CCF2] text-black rounded-full font-semibold hover:from-blue-300 hover:to-blue-500 transition"
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
