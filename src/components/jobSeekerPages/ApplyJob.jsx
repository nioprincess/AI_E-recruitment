import React, { useState } from "react";
import { useParams } from "react-router-dom";

const ApplyJob = () => {
  const { jobId } = useParams();
  const [form, setForm] = useState({ coverLetter: "", resume: null });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate submission logic
    console.log("Job Application:", { jobId, ...form });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center mt-10">
        <h2 className="text-2xl font-bold text-green-600">Application Submitted</h2>
        <p className="mt-4">Thank you for applying. We'll review your application and get back to you soon.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Apply for this Job</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium mb-1">Cover Letter</label>
          <textarea
            name="coverLetter"
            rows="6"
            className="w-full border border-gray-300 rounded px-4 py-2"
            value={form.coverLetter}
            onChange={handleChange}
            placeholder="Write your motivation or experience related to this job..."
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Upload Resume (PDF, DOC)</label>
          <input
            type="file"
            name="resume"
            accept=".pdf,.doc,.docx"
            className="w-full border border-gray-300 px-4 py-2 rounded"
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-[#2F80ED] to-[#56CCF2] text-white px-6 py-3 rounded-full hover:opacity-90"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default ApplyJob;
