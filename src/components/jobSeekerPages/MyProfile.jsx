import React from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../helpers/profileData";

const MyProfile = () => {
  const navigate = useNavigate();
  const profile = {
  name: "Alice Uwase",
  field: "Software Engineering",
  otherField: "",
  location: "Kigali, Rwanda",
  bio: "Full-stack developer with 4 years of experience specializing in JavaScript technologies. Passionate about building scalable web applications and mentoring junior developers. Open to opportunities that challenge me to grow while contributing to meaningful projects.",
  profilePicture: "https://randomuser.me/api/portraits/women/44.jpg",
  coverPicture: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=300",
  maritalStatus: "Single",
  cv: "https://example.com/alice-uwase-cv.pdf",
  documents: [
    { name: "AWS Certification", url: "https://example.com/aws-cert.pdf" },
    { name: "University Diploma", url: "https://example.com/diploma.pdf" }
  ],
  experience: [
    { 
      year: "2021 - Present", 
      role: "Senior Software Engineer", 
      company: "Tech Solutions Rwanda",
      description: "Lead a team of 5 developers building enterprise SaaS solutions. Implemented CI/CD pipelines reducing deployment time by 40%. Introduced React best practices that improved code maintainability."
    },
    { 
      year: "2019 - 2021", 
      role: "Junior Developer", 
      company: "Andela Rwanda",
      description: "Developed and maintained web applications for international clients. Contributed to open source projects. Received 'Rising Star' award in 2020."
    },
    { 
      year: "2018", 
      role: "Intern", 
      company: "Rwanda Coding Academy",
      description: "Built student management system using Django. Assisted in teaching Python fundamentals to new students."
    }
  ],
  education: [
    {
      level: "Bachelor's Degree",
      institution: "University of Rwanda",
      field: "Computer Science",
      year: "2018",
      achievements: "Graduated with First Class Honors. Thesis on Machine Learning applications in agriculture."
    },
    {
      level: "Advanced Diploma",
      institution: "IPRC Kigali",
      field: "Information Technology",
      year: "2015"
    }
  ],
  skills: [
    "JavaScript", "React", "Node.js", "Python", 
    "AWS", "Docker", "GraphQL", "TypeScript",
    "Agile Methodologies", "Team Leadership"
  ],
  languages: [
    { name: "Kinyarwanda", proficiency: "Native" },
    { name: "English", proficiency: "Fluent" },
    { name: "French", proficiency: "Intermediate" }
  ],
  contact: {
    email: "alice.uwase@example.com",
    phone: "+250 78 888 1234",
    linkedin: "linkedin.com/in/alice-uwase",
    github: "github.com/alice-uwase",
    twitter: "@alice_uwase"
  },
  certifications: [
    "AWS Certified Developer - Associate (2022)",
    "Google Cloud Fundamentals (2021)"
  ],
  projects: [
    {
      name: "E-commerce Platform",
      description: "Led development of Rwanda's first mobile-first e-commerce platform serving 50,000+ users",
      technologies: ["React", "Node.js", "MongoDB"],
      url: "https://example.com/ecom-platform"
    },
    {
      name: "Health Management System",
      description: "Developed patient records system for rural clinics, improving data access for 20 health centers",
      technologies: ["Python", "Django", "PostgreSQL"],
      url: "https://example.com/health-system"
    }
  ],
  memberships: [
    "Rwanda Software Developers Association",
    "Women in Tech Rwanda"
  ],
  availability: "Open to opportunities",
  salaryExpectations: "Competitive, negotiable based on role",
  noticePeriod: "1 month"

  };

  return (
    <div className="max-w-6xl mx-auto mt-6 bg-white dark:bg-black-100 shadow-lg rounded-xl overflow-hidden">
      {/* Cover & Profile Header */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600">
          {profile.coverPicture && (
            <img
              src={profile.coverPicture}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        <div className="absolute -bottom-16 left-8 flex items-end space-x-6">
          <div className="relative">
            <img
              src={profile.profilePicture}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg bg-white"
            />
            <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="pb-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{profile.name}</h2>
            <p className="text-lg text-blue-600 dark:text-blue-400 font-medium">
              {profile.otherField || profile.field}
            </p>
            <div className="flex items-center mt-1 text-gray-600 dark:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {profile.location}
            </div>
          </div>
        </div>
        
        <div className="absolute top-4 right-4 flex space-x-3">
          <button
            onClick={() => navigate("/profile-setup")}
            className="flex items-center bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 shadow transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit Profile
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow transition">
            Download CV
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 pt-20">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Me */}
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              About Me
            </h3>
            <p className="text-gray-700 dark:text-gray-300">{profile.bio}</p>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-600 dark:text-gray-400">Member since: 2022</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-600 dark:text-gray-400">Status: {profile.maritalStatus}</span>
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
              </svg>
              Work Experience
            </h3>
            
            <div className="space-y-6">
              {profile.experience.map((exp, idx) => (
                <div key={idx} className="relative pl-8 pb-6 border-l-2 border-blue-200 dark:border-blue-900">
                  <div className="absolute -left-2.5 top-0 h-5 w-5 rounded-full bg-blue-500 border-4 border-white dark:border-gray-800"></div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <h4 className="font-bold text-lg text-gray-800 dark:text-white">{exp.role}</h4>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">{exp.company}</p>
                    <span className="inline-block px-2 py-1 mt-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                      {exp.year}
                    </span>
                    {exp.description && (
                      <p className="mt-2 text-gray-600 dark:text-gray-400">{exp.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
              Education
            </h3>
            
            <div className="space-y-4">
              {profile.education.map((edu, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h4 className="font-bold text-gray-800 dark:text-white">{edu.level} in {edu.field}</h4>
                  <p className="text-blue-600 dark:text-blue-400">{edu.institution}</p>
                  <span className="inline-block mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Graduated: {edu.year}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Contact Info */}
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Contact Information
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">{profile.contact?.email || "Not provided"}</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">{profile.contact?.phone || "Not provided"}</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">{profile.contact?.linkedin || "Not provided"}</span>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
              </svg>
              Skills
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, idx) => (
                <span 
                  key={idx} 
                  className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.829.829 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
              </svg>
              Languages
            </h3>
            
            <div className="space-y-3">
              {profile.languages.map((lang, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{lang.name}</span>
                  <span className="text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                    {lang.proficiency}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              Documents
            </h3>
            
            <div className="space-y-3">
              {profile.cv && (
                <a
                  href={profile.cv}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Curriculum Vitae</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              )}
              
              {profile.documents && (
                <a
                  href={profile.documents}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Certificates</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;