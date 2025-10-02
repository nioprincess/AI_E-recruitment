import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserAxios from "../../hooks/useUserAxios";

const Applications = () => {
  const navigate = useNavigate();
  const axios= useUserAxios()
  const[ applications  , setApplications]= useState([])
  const getApplications= async()=>{
    try {
      const resp = await axios.get("/api/jobs/my-applications")
      if(resp.data.success){
         setApplications(resp.data.data)
      }
      
    } catch (error) {
      console.log(error)
      
    }
  }

   
  

  const statusStyles = {
    applied: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
    "under-review": "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200",
    shortlisted: "bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200",
    rejected: "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200",
    hired: "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200",
  };

  const statusLabels = {
    submitted: "Submitted",
    "under-review": "Under Review",
    shortlisted: "Shortlisted",
    rejected: "Not Selected",
    hired: "Hired",
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "submitted":
        return (
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "under-review":
        return (
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "accepted":
        return (
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        );
      case "rejected":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case "hired":
        return (
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        );
      default:
        return null;
    }
  };

  useEffect(()=>{
    getApplications()
  },[])

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-6 mt-12 dark:bg-black-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My Applications</h1>
       
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-800">
          <nav className="flex -mb-px">
            <button className="px-4 py-3 text-sm font-medium text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400">
              All Applications
            </button>
            <button className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              Accepted
            </button>
            <button className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              Archived
            </button>
          </nav>
        </div>

        {/* Application List */}
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {applications.map((application) => (
            <div key={application.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-blue-950 dark:bg-gray-800 flex items-center justify-center">
                      <span className="text-lg font-medium text-gray-500 dark:text-gray-400">
                        {application?.job.company?.c_admin?.u_first_name?.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                        {application.job.j_title}
                      </h3>
                      <div className="flex flex-wrap items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
                        <span>{application?.job?.company?.c_admin?.u_first_name}</span>
                        <span className="mx-2">•</span>
                        <span>{application?.job?.j_location}</span>
                        <span className="mx-2">•</span>
                        <span>{application?.job?.j_employment_type}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Applied on</p>
                    <p className="font-medium text-gray-700 dark:text-gray-300">
                      {new Date(application?.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Salary</p>
                    <p className="font-medium text-gray-700 dark:text-gray-300">
                      {application?.job?.j_salary_min}- {application?.job?.j_salary_max}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status and Progress */}
              <div className="mt-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex items-center mb-2 md:mb-0">
                    <span className={`inline-flex items-center px-1 py-1 rounded-full text-sm font-medium  ${statusStyles[application.stages.filter(s=>s.s_completed===false)[0]?.s_name]}`}>
                      {getStatusIcon(application.stages.filter(s=>s.s_completed===false)[0]?.s_name  )}
                      {/* {statusLabels[application.stages.filter(s=>s.s_completed===false)[0]?.s_name  ]} */}
                    </span>
                   {application.stages.filter(s=>s.s_completed===false)[0]?.s_notes?.length>0 &&   <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                      Comment: {application.stages.filter(s=>s.s_completed===false)[0]?.s_notes}
                    </span>}
                    <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                     Updated: {new Date(application?.updated_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    {application.stages.filter(s=>s.s_completed===false)[0]?.s_name === "shortlisted" && (
                      <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition">
                        View Interview Details
                      </button>
                    )}
                    <button 
                      onClick={() => navigate(`/jobs/${application?.job?.id}`)}
                      className="px-3 py-1 mx-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
                    >
                      View Job
                    </button>
                    {/* <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                      </svg>
                    </button> */}
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="mt-4">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${application.stages.filter(s=>s.s_completed===false)[0]?.s_name === 'submitted' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                      1
                    </div>
                    <div className={`flex-1 h-1 ${application?.status !== 'submitted' ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>

                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${['under-review', 'accepted', 'hired'].includes(application.stages.filter(s=>s.s_completed===false)[0]?.s_name) ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                      2
                    </div>
                    <div className={`flex-1 h-1 ${['accepted', 'hired'].includes(application.stages.filter(s=>s.s_completed===false)[0]?.s_name) ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                    
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${application.stages.filter(s=>s.s_completed===false)[0]?.s_name === 'accepted' ? 'bg-blue-600 text-white' : application.stages.filter(s=>s.s_completed===false)[0]?.s_name === 'hired' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                      3
                    </div>
                    <div className={`flex-1 h-1 ${application?.status === 'hired' ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                    
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${application.stages.filter(s=>s.s_completed===false)[0]?.s_name === 'hired' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <span>Applied</span>
                    <span>Under Review</span>
                    <span>Interview/Exam</span>
                    <span>Decision</span>
                  </div>
                </div>

                {/* AI Exam and Interview Status */}
                {application?.aiExam?.completed && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Assessment</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Completed on {new Date(application.lastUpdate).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center">
                          <span className="text-lg font-bold text-gray-800 dark:text-white mr-2">
                            {application.aiExam.score}%
                          </span>
                          <div className="relative w-12 h-12">
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                              <path
                                d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#E5E7EB"
                                strokeWidth="3"
                                strokeDasharray="100, 100"
                                className="dark:stroke-gray-700"
                              />
                              <path
                                d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#3B82F6"
                                strokeWidth="3"
                                strokeDasharray={`${application.aiExam.score}, 100`}
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {application?.interview?.scheduled ? (
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {application.interview.completed ? 'Interview Completed' : 'Interview Scheduled'}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(application.interview.scheduled).toLocaleDateString()}
                            </p>
                          </div>
                          <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition">
                            {application.interview.completed ? 'View Feedback' : 'View Details'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Interview</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {application.stages.filter(s=>s.s_completed===false)[0]?.s_name === 'shortlisted' ? 'Pending schedule' : 'Not scheduled'}
                          </p>
                        </div>
                        <div className="text-gray-400">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing <span className="font-medium">1</span> to <span className="font-medium">4</span> of{' '}
                <span className="font-medium">12</span> applications
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button aria-current="page" className="z-10 bg-blue-50 dark:bg-blue-900/50 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-300 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  1
                </button>
                <button className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  2
                </button>
                <button className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  3
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applications;