import React from 'react';
import { Briefcase, Users, FileText, Clock, ArrowUp, ArrowDown } from 'lucide-react';

const stats = [
  {
    title: 'Total Jobs',
    value: '24',
    change: '+12%',
    trend: 'up',
    icon: Briefcase,
    color: 'blue'
  },
  {
    title: 'Applications',
    value: '156',
    change: '+8%',
    trend: 'up',
    icon: FileText,
    color: 'green'
  },
  {
    title: 'Candidates',
    value: '89',
    change: '-3%',
    trend: 'down',
    icon: Users,
    color: 'orange'
  },
  {
    title: 'Avg. Hire Time',
    value: '14 days',
    change: '-20%',
    trend: 'down',
    icon: Clock,
    color: 'purple'
  }
];

const DashboardOverview = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome back, John! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const trendColor = stat.trend === 'up' ? 'text-green-600' : 'text-red-600';
          const bgColor = `bg-${stat.color}-100 dark:bg-${stat.color}-900`;
          const iconColor = `text-${stat.color}-600 dark:text-${stat.color}-400`;
          
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stat.value}</p>
                  <div className={`flex items-center mt-2 ${trendColor}`}>
                    {stat.trend === 'up' ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                    <span className="text-sm font-medium">{stat.change}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${bgColor}`}>
                  <Icon className={`h-6 w-6 ${iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Interviews */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Upcoming Interviews</h2>
          {/* Add interview list here */}
        </div>

        {/* Recent Applications */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Applications</h2>
          {/* Add applications list here */}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;