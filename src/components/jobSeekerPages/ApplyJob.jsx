import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProfile } from "../../helpers/profileData"; // fetch jobseeker profile data

const ApplyJob = () => {
  const { jobId } = useParams();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    portfolio: "",
    expectedSalary: "",
    availability: "",
    coverLetter: "",
    resume: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    // Get resumes from profile
    const profile = getProfile();
    if (profile) {
      setForm((prev) => ({
        ...prev,
        fullName: profile.fullName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
      }));
      if (profile?.resumes) setResumes(profile.resumes);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Job Application:", { jobId, ...form });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-full mx-auto px-4 py-6 dark:bg-black-100">
        <div className="max-w-2xl mx-auto p-6 text-center mt-10 bg-white dark:bg-gray-900 rounded-xl shadow">
          <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">
            Application Submitted
          </h2>
          <p className="mt-4 text-gray-700 dark:text-gray-300">
            Thank you for applying. We'll review your application and get back
            to you soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto px-4 py-6 dark:bg-black-100">
      <div className="max-w-3xl mx-auto p-8 mt-10 bg-white dark:bg-gray-900 shadow-lg rounded-xl">
        <h2 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-400">
          Apply for this Job
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
              Address
            </label>
            <input
              type="text"
              name="address"
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              value={form.address}
              onChange={handleChange}
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
              LinkedIn Profile (optional)
            </label>
            <input
              type="url"
              name="linkedin"
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              value={form.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          {/* Portfolio */}
          <div>
            <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
              Portfolio / Website (optional)
            </label>
            <input
              type="url"
              name="portfolio"
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              value={form.portfolio}
              onChange={handleChange}
              placeholder="https://myportfolio.com"
            />
          </div>

          {/* Expected Salary */}
          <div>
            <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
              Expected Salary (optional)
            </label>
            <input
              type="text"
              name="expectedSalary"
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              value={form.expectedSalary}
              onChange={handleChange}
              placeholder="e.g. $1200/month"
            />
          </div>

          {/* Availability */}
          <div>
            <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
              Availability
            </label>
            <select
              name="availability"
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              value={form.availability}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Availability --</option>
              <option value="immediate">Immediate</option>
              <option value="2_weeks">Within 2 weeks</option>
              <option value="1_month">Within 1 month</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>

          {/* Resume Selection */}
          <div>
            <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
              Select Resume
            </label>
            {resumes.length > 0 ? (
              <select
                name="resume"
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                value={form.resume}
                onChange={handleChange}
                required
              >
                <option value="">-- Choose your resume --</option>
                {resumes.map((res, idx) => (
                  <option key={idx} value={res}>
                    {res}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-red-600 dark:text-red-400">
                You haven’t uploaded any resumes yet. Please update your profile
                first.
              </p>
            )}
          </div>

          {/* Cover Letter */}
          <div>
            <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
              Cover Letter
            </label>
            <textarea
              name="coverLetter"
              rows="6"
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              value={form.coverLetter}
              onChange={handleChange}
              placeholder="Write your motivation or experience related to this job..."
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-3 rounded-full hover:opacity-90 disabled:opacity-60"
            disabled={resumes.length === 0}
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyJob;
