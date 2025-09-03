import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import logo1 from "../../../assets/images/ex-logo1.png";
import logo2 from "../../../assets/images/ex-logo3.png";
import logo3 from "../../../assets/images/ex-logo4.png";
import logo4 from "../../../assets/images/ex-logo5.png";
import logo5 from "../../../assets/images/ex-logo8.png";

const dummyJobs = [
  {
    id: "1",
    title: "Frontend Developer",
    company: "Nexus Inc.",
    location: "Kigali, Rwanda",
    level: "Mid-level",
    workingType: "On-site",
    type: "Job",
    department: "Engineering",
    reportsTo: "Lead Software Engineer",
    postedDate: "August 1, 2025",
    deadlineDate: "August 31, 2025",
    aboutCompany:
      "Nexus Inc. is a leading tech company in Rwanda building innovative solutions for African markets.",
    description:
      "We’re looking for a skilled frontend developer to join our team. You’ll work closely with designers and backend developers to deliver amazing user experiences.",
    responsibilities: [
      "Develop responsive web interfaces using React and Tailwind CSS.",
      "Collaborate with cross-functional teams.",
      "Write clean, maintainable code.",
      "Participate in code reviews and sprint planning.",
    ],
    qualifications: [
      "Bachelor’s degree in Computer Science or related field.",
      "2+ years experience with React.js and modern JavaScript.",
      "Strong understanding of UI/UX design principles.",
    ],
    competencies: [
      "Problem-solving",
      "Teamwork",
      "Attention to detail",
      "Time management",
    ],
    languages: ["English", "Kinyarwanda"],
    performanceIndicators: [
      "Timely delivery of assigned tasks.",
      "Code quality and maintainability.",
      "Positive peer reviews.",
    ],
    exams: ["Technical coding challenge", "System design interview"],
    applicationGuidelines:
      "Submit your application through our careers portal. Ensure your resume is updated and tailored to this role.",
    image: logo1,
  },
  {
    id: "2",
    title: "UI/UX Designer",
    company: "Designify",
    location: "Butare, Rwanda",
    level: "Entry-level",
    workingType: "Hybrid",
    type: "Internship",
    department: "Design",
    reportsTo: "Product Manager",
    postedDate: "July 20, 2025",
    deadlineDate: "August 15, 2025",
    aboutCompany:
      "Designify is a creative design agency helping startups and enterprises build beautiful products.",
    description:
      "Creative UI/UX designer to design mobile and web apps alongside developers.",
    responsibilities: ["Design wireframes", "Create prototypes", "Conduct user testing"],
    qualifications: ["Knowledge of Figma", "Creativity", "Team collaboration"],
    competencies: ["Innovation", "Visual communication"],
    languages: ["English", "French"],
    performanceIndicators: ["User satisfaction", "Design delivery on time"],
    exams: ["Portfolio review"],
    applicationGuidelines:
      "Email your design portfolio with a resume attached to hr@designify.com",
    image: logo3,
  },
];

const JobDescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = dummyJobs.find((j) => j.id === id);

  if (!job)
    return (
      <div className="p-10 text-center text-red-600 dark:text-red-400">
        Job not found
      </div>
    );

  const handleApply = () => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/signin");
    } else {
      navigate(`/apply/${id}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 mt-100 py-8">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img
          src={job.image}
          alt={`${job.company} logo`}
          className="w-24 h-24 rounded-full mt-20 object-cover border border-gray-300 dark:border-gray-700 shadow-md"
        />
      </div>

      {/* Job Info */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-1">
          {job.title}
        </h1>
        <p className="text-base font-medium text-gray-700 dark:text-gray-200">
          {job.company} • {job.location}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Level: {job.level} • {job.workingType}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {job.type} • Posted on {job.postedDate} • Deadline {job.deadlineDate}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Department: {job.department} • Reports to: {job.reportsTo}
        </p>
      </div>

      {/* About Company */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          About Company
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          {job.aboutCompany}
        </p>
      </div>

      {/* Description */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Job Description
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          {job.description}
        </p>
      </div>

      {/* Responsibilities */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Job Responsibilities
        </h2>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 text-sm">
          {job.responsibilities.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Qualifications */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Qualifications
        </h2>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 text-sm">
          {job.qualifications.map((q, idx) => (
            <li key={idx}>{q}</li>
          ))}
        </ul>
      </div>

      {/* Competencies */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Required Competencies
        </h2>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 text-sm">
          {job.competencies.map((c, idx) => (
            <li key={idx}>{c}</li>
          ))}
        </ul>
      </div>

      {/* Languages */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Languages
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          {job.languages.join(", ")}
        </p>
      </div>

      {/* Performance Indicators */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Performance Indicators
        </h2>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 text-sm">
          {job.performanceIndicators.map((pi, idx) => (
            <li key={idx}>{pi}</li>
          ))}
        </ul>
      </div>

      {/* Exams */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Exams to be Conducted
        </h2>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 text-sm">
          {job.exams.map((e, idx) => (
            <li key={idx}>{e}</li>
          ))}
        </ul>
      </div>

      {/* Application Guidelines */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Application Guidelines
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          {job.applicationGuidelines}
        </p>
      </div>

      {/* Apply Button */}
      <div className="text-center">
        <button
          onClick={handleApply}
          className="bg-gradient-to-r from-blue-100 to-blue-400 
          hover:from-blue-400 hover:to-blue-100 text-gray-900 
          dark:text-white px-6 py-3 rounded-full shadow-md transition"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobDescription;
