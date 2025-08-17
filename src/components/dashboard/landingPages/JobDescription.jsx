import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const dummyJobs = [
  {
    id: "1",
    title: "Frontend Developer",
    company: "Nexus Inc.",
    location: "Kigali, Rwanda",
    type: "Full-time",
    postedDate: "August 1, 2025",
    salary: "RWF 1,200,000 - 1,800,000 / month",
    description: "We're looking for a passionate and skilled frontend developer to join our dynamic team. You’ll collaborate with designers and backend developers to bring user interfaces to life.",
    responsibilities: [
      "Develop responsive web interfaces using React and Tailwind CSS.",
      "Collaborate with cross-functional teams.",
      "Write clean, scalable, and maintainable code.",
      "Participate in code reviews and team meetings.",
    ],
    requirements: [
      "Bachelor's degree in Computer Science or related field.",
      "2+ years of frontend development experience.",
      "Proficiency in React.js, JavaScript, Tailwind CSS.",
      "Familiarity with REST APIs and Git.",
    ],
  },
];

const JobDescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = dummyJobs.find((j) => j.id === id);

  if (!job) return <div className="p-10 text-center text-red-600">Job not found</div>;

  const handleApply = () => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/signin");
    } else {
      navigate(`/apply/${id}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-blue-700 mb-2">{job.title}</h1>
      <p className="text-lg font-medium mb-1">{job.company} • {job.location}</p>
      <p className="text-sm text-gray-500 mb-4">{job.type} • Posted on {job.postedDate}</p>
      <p className="text-gray-700 mb-6">{job.description}</p>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Responsibilities:</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          {job.responsibilities.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Requirements:</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          {job.requirements.map((req, idx) => (
            <li key={idx}>{req}</li>
          ))}
        </ul>
      </div>

      <p className="text-lg font-semibold text-gray-700 mb-6">Salary: {job.salary}</p>

      <button
        onClick={handleApply}
        className="bg-gradient-to-r from-[#2F80ED] to-[#56CCF2] text-white px-6 py-3 rounded-full hover:opacity-90 transition"
      >
        Apply Now
      </button>
    </div>
  );
};

export default JobDescription;
