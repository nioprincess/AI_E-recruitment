import React, { useState } from "react";

const educationLevels = [
  "High School Diploma",
  "Certificate",
  "Diploma",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
  "Other",
];

const languagesList = ["English", "Kinyarwanda", "French", "Swahili"];

const maritalStatuses = ["Single", "Married", "Divorced", "Widowed"];

const fieldsOfWork = [
  "Information Technology",
  "Engineering",
  "Healthcare",
  "Education",
  "Finance",
  "Sales & Marketing",
  "Human Resources",
  "Design & Creative",
  "Construction",
  "Hospitality",
  "Other",
];

const ProfileSetup = () => {
  const [formData, setFormData] = useState({
    name: "",
    field: "",
    otherField: "",
    location: "",
    bio: "",
    profilePicture: null,
    coverPicture: null,
    maritalStatus: "",
    cv: null,
    documents: null,
    experience: [{ year: "", role: "", company: "" }],
    education: [""],
    skills: [],
    languages: [],
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCheckboxToggle = (name, option) => {
    const current = formData[name];
    if (current.includes(option)) {
      setFormData({ ...formData, [name]: current.filter((item) => item !== option) });
    } else {
      setFormData({ ...formData, [name]: [...current, option] });
    }
  };

  const handleExperienceChange = (index, e) => {
    const updated = [...formData.experience];
    updated[index][e.target.name] = e.target.value;
    setFormData({ ...formData, experience: updated });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { year: "", role: "", company: "" }],
    });
  };

  const addEducation = () => {
    setFormData({ ...formData, education: [...formData.education, ""] });
  };

  const handleEducationChange = (index, value) => {
    const updated = [...formData.education];
    updated[index] = value;
    setFormData({ ...formData, education: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = new FormData();

    // prepare field of work
    const finalField = formData.field === "Other" ? formData.otherField : formData.field;

    Object.entries({ ...formData, field: finalField }).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        payload.append(key, JSON.stringify(value));
      } else {
        payload.append(key, value);
      }
    });

    console.log("Submitting payload:", Object.fromEntries(payload.entries()));
    // TODO: send to backend
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black-100 flex justify-center items-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl w-full max-w-4xl shadow-lg space-y-8"
        encType="multipart/form-data"
      >
        <h2 className="text-3xl font-bold text-center text-black dark:text-white">
          Complete Your Profile
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
          Add details to make your profile stand out to employers
        </p>

        {/* Profile & Cover Image Upload */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FileInput name="profilePicture" label="Profile Picture" accept="image/*" onChange={handleChange} />
          <FileInput name="coverPicture" label="Cover Photo" accept="image/*" onChange={handleChange} />
        </div>

        {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input name="name" label="Full Name" onChange={handleChange} required />

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">Field of Work</label>
            <select
              name="field"
              value={formData.field}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded bg-white dark:bg-black-100 text-black dark:text-white"
              required
            >
              <option value="">Select field</option>
              {fieldsOfWork.map((f, i) => (
                <option key={i} value={f}>{f}</option>
              ))}
            </select>
            {formData.field === "Other" && (
              <input
                type="text"
                name="otherField"
                placeholder="Please specify your field"
                value={formData.otherField}
                onChange={handleChange}
                className="w-full mt-2 p-2 border rounded bg-white dark:bg-black-100 text-black dark:text-white"
              />
            )}
          </div>

          <Input name="location" label="Location" onChange={handleChange} required />

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">Marital Status</label>
            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded bg-white dark:bg-black-100 text-black dark:text-white"
            >
              <option value="">Select status</option>
              {maritalStatuses.map((status, i) => (
                <option key={i} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Education */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-black dark:text-white">Education</h3>
          {formData.education.map((edu, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <select
                value={edu}
                onChange={(e) => handleEducationChange(idx, e.target.value)}
                className="w-full p-2 border rounded bg-white dark:bg-black-100 dark:text-white"
              >
                <option value="">Select education level</option>
                {educationLevels.map((level, i) => (
                  <option key={i} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <button type="button" onClick={addEducation} className="text-sm text-blue-500 hover:underline">
            + Add another education
          </button>
        </div>

        {/* Skills */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-black dark:text-white">Soft Skills</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "Communication",
              "Teamwork",
              "Problem-solving",
              "Time Management",
              "Critical Thinking",
              "Adaptability",
              "Leadership",
              "Creativity",
              "Work Ethic",
              "Empathy",
              "Decision Making",
              "Attention to Detail",
            ].map((skill) => (
              <button
                type="button"
                key={skill}
                onClick={() => handleCheckboxToggle("skills", skill)}
                className={`px-4 py-1 rounded-full text-sm border ${
                  formData.skills.includes(skill)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white dark:bg-black-100 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                } hover:opacity-80 transition`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Languages with Proficiency */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-black dark:text-white">Languages</h3>
          {formData.languages.map((langObj, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-4 items-center">
              <select
                value={langObj.name}
                onChange={(e) => {
                  const updated = [...formData.languages];
                  updated[index].name = e.target.value;
                  setFormData({ ...formData, languages: updated });
                }}
                className="w-full md:w-1/2 p-2 border rounded bg-white dark:bg-black-100 text-black dark:text-white"
              >
                <option value="">Select language</option>
                {languagesList.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>

              <select
                value={langObj.proficiency}
                onChange={(e) => {
                  const updated = [...formData.languages];
                  updated[index].proficiency = e.target.value;
                  setFormData({ ...formData, languages: updated });
                }}
                className="w-full md:w-1/2 p-2 border rounded bg-white dark:bg-black-100 text-black dark:text-white"
              >
                <option value="">Select proficiency</option>
                <option value="Basic">Basic</option>
                <option value="Conversational">Conversational</option>
                <option value="Fluent">Fluent</option>
                <option value="Native">Native</option>
              </select>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                languages: [...formData.languages, { name: "", proficiency: "" }],
              })
            }
            className="text-sm text-blue-500 hover:underline"
          >
            + Add another language
          </button>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300">Short Bio</label>
          <textarea
            name="bio"
            rows="4"
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded bg-white dark:bg-black-100 text-black dark:text-white"
            placeholder="Tell us about yourself"
          />
        </div>

        {/* Experience */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-black dark:text-white">Experience</h3>
          {formData.experience.map((exp, index) => (
            <div key={index} className="grid md:grid-cols-3 gap-4">
              <Input name="year" label="Year" value={exp.year} onChange={(e) => handleExperienceChange(index, e)} />
              <Input name="role" label="Role" value={exp.role} onChange={(e) => handleExperienceChange(index, e)} />
              <Input name="company" label="Company" value={exp.company} onChange={(e) => handleExperienceChange(index, e)} />
            </div>
          ))}
          <button type="button" onClick={addExperience} className="text-sm text-blue-500 hover:underline">
            + Add another experience
          </button>
        </div>

        {/* File Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FileInput name="cv" label="Upload CV (PDF)" accept=".pdf" onChange={handleChange} />
          <FileInput name="documents" label="Other Documents" multiple onChange={handleChange} />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-full hover:opacity-90 transition"
        >
          Save & Continue
        </button>
      </form>
    </div>
  );
};

const Input = ({ name, label, value = "", onChange, required }) => (
  <div>
    <label className="block text-sm text-gray-600 dark:text-gray-300">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-black-100 text-black dark:text-white"
    />
  </div>
);

const FileInput = ({ name, label, accept, multiple = false, onChange }) => (
  <div>
    <label className="block text-sm text-gray-600 dark:text-gray-300">{label}</label>
    <input
      type="file"
      name={name}
      accept={accept}
      onChange={onChange}
      multiple={multiple}
      className="w-full mt-1 p-2 border rounded bg-white dark:bg-black-100 text-black dark:text-white"
    />
  </div>
);

export default ProfileSetup;
