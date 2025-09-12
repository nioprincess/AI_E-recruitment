import React from "react";
import { Users, Briefcase, FileText, BarChart2 } from "lucide-react";

const stats = [
  {
    title: "Total Job Seekers",
    value: "1,245",
    icon: <Users className="h-6 w-6 text-blue-500" />,
    color: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
  },
  {
    title: "Total Recruiters",
    value: "320",
    icon: <Users className="h-6 w-6 text-green-500" />,
    color: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
  },
  {
    title: "Active Jobs",
    value: "85",
    icon: <Briefcase className="h-6 w-6 text-purple-500" />,
    color: "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300",
  },
  {
    title: "Applications",
    value: "3,540",
    icon: <FileText className="h-6 w-6 text-orange-500" />,
    color: "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300",
  },
];

const Overview = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Admin Dashboard Overview
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Welcome to the Admin Dashboard. Here you can monitor the system’s users,
        job postings, and applications at a glance.
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex items-center gap-4 ${stat.color}`}
          >
            <div className="p-3 rounded-full bg-white dark:bg-gray-800 shadow">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium">{stat.title}</p>
              <h2 className="text-xl font-bold">{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder for charts or reports */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          System Activity
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Charts and reports will be displayed here to visualize activity across
          the platform.
        </p>
      </div>
    </div>
  );
};

export default Overview;
