import React, { useState } from "react";
import { X, Save, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const TAB_LABELS = {
  summary: "Job Summary",
  questions: "Application Questions",
  moreInfo: "More Info",
};

const REQUIRED_APPLICATION_FIELDS = [
  "Full Name",
  "Email",
  "Phone",
  "Address",
  "Expected Salary",
];

const CreateJobForm = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState("summary");

  const [formData, setFormData] = useState({
    jobTitle: "",
    companyName: "Nexus Inc.",
    location: "Kigali, Rwanda",
    department: "Engineering",
    level: "Mid-level",
    workType: "On-site",
    positionType: "Job",
    reportsTo: "Lead Software Engineer",
    postedDate: new Date().toISOString().split("T")[0],
    deadline: "",
    summaryDescription: "",

    requireResume: true,
    requireCoverLetter: false,
    requirePortfolio: false,
    applicationFields: [...REQUIRED_APPLICATION_FIELDS],
    customQuestions: [""],

    aboutCompany:
      "Nexus Inc. is a leading tech company in Rwanda building innovative solutions for African markets.",
    jobDescription: "",
    responsibilities: [""],
    qualifications: [""],
    competencies: [""],
    languages: ["English", "Kinyarwanda"],
    performanceIndicators: [""],
    exams: ["Technical coding challenge", "System design interview"],
    applicationGuidelines:
      "Submit your application through our careers portal. Ensure your resume is updated and tailored to this role.",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Create job:", formData);
  };

  // Reusable helpers
  const SectionTitle = ({ children }) => (
    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
      {children}
    </h3>
  );

  const FieldLabel = ({ children }) => (
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {children}
    </label>
  );

  // Helper to render array inputs
  const renderArrayInputs = (field, placeholderBase) => (
    <div className="space-y-2">
      {formData[field].map((item, idx) => (
        <div key={idx} className="flex gap-2">
          <Input
            placeholder={`${placeholderBase} ${idx + 1}`}
            value={item}
            onChange={(e) => {
              const updated = [...formData[field]];
              updated[idx] = e.target.value;
              setFormData({ ...formData, [field]: updated });
            }}
            className="border border-border border-gray-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 text-gray-900"
          />
          {formData[field].length > 1 && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => {
                const updated = formData[field].filter((_, i) => i !== idx);
                setFormData({ ...formData, [field]: updated });
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          setFormData({ ...formData, [field]: [...formData[field], ""] })
        }
        className = "border border-border border-gray-400 hover:shadow-lg text-gray-700"
      >
        <Plus className="h-4 w-4 mr-2" /> Add {placeholderBase}
      </Button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">
            Create New Job Posting
          </h2>
          <Button variant="ghost" size="icon" className="dark:text-gray-50" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 px-2 md:px-4">
          {Object.entries(TAB_LABELS).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveSection(key)}
              className={`px-4 md:px-5 py-2 text-sm font-medium transition-colors ${
                activeSection === key
                  ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto max-h-[calc(90vh-9.5rem)] p-6 space-y-8"
        >
          {/* Summary Section */}
          {activeSection === "summary" && (
            <div className="space-y-6">
              <SectionTitle>Basic Details</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Job Title *</FieldLabel>
                  <Input
                    placeholder="Frontend Developer"
                    value={formData.jobTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, jobTitle: e.target.value })
                    }
                    required
                    className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 text-gray-900 border border-border border-gray-500"
                  />
                </div>

                <div>
                  <FieldLabel>Company Name *</FieldLabel>
                  <Input
                    placeholder="Company"
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                    required
                    className=" border border-border border-gray-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 text-gray-900"
                  />
                </div>

                <div>
                  <FieldLabel>Location *</FieldLabel>
                  <Input
                    placeholder="City, Country"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    required
                    className="border border-border border-gray-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 text-gray-900"
                  />
                </div>

                <div>
                  <FieldLabel>Department *</FieldLabel>
                  <select
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-gray-500 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                    required
                  >
                    <option>Engineering</option>
                    <option>Product</option>
                    <option>Design</option>
                    <option>Marketing</option>
                    <option>Sales</option>
                    <option>Human Resources</option>
                  </select>
                </div>

                <div>
                  <FieldLabel>Level *</FieldLabel>
                  <select
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({ ...formData, level: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-gray-500 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                    required
                  >
                    <option>Entry-level</option>
                    <option>Mid-level</option>
                    <option>Senior</option>
                    <option>Lead</option>
                    <option>Executive</option>
                  </select>
                </div>

                <div>
                  <FieldLabel>Work Type *</FieldLabel>
                  <select
                    value={formData.workType}
                    onChange={(e) =>
                      setFormData({ ...formData, workType: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-gray-500 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                    required
                  >
                    <option>On-site</option>
                    <option>Remote</option>
                    <option>Hybrid</option>
                  </select>
                </div>

                <div>
                  <FieldLabel>Position Type *</FieldLabel>
                  <select
                    value={formData.positionType}
                    onChange={(e) =>
                      setFormData({ ...formData, positionType: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-gray-500 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                    required
                  >
                    <option>Job</option>
                    <option>Internship</option>
                    <option>Ikiraka</option>
                    <option>Contract</option>
                    <option>Part-time</option>
                  </select>
                </div>

                <div>
                  <FieldLabel>Reports To</FieldLabel>
                  <Input
                    placeholder="Role or Person"
                    value={formData.reportsTo}
                    onChange={(e) =>
                      setFormData({ ...formData, reportsTo: e.target.value })
                    }
                    className="border border-border border-gray-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 text-gray-900"
                  />
                </div>

                <div>
                  <FieldLabel>Posted Date</FieldLabel>
                  <Input value={formData.postedDate} className="border border-border border-gray-400" disabled />
                </div>

                <div>
                  <FieldLabel>Application Deadline *</FieldLabel>
                  <Input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) =>
                      setFormData({ ...formData, deadline: e.target.value })
                    }
                    required
                    className="border border-border border-gray-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 text-gray-900"
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Short Summary *</FieldLabel>
                <Textarea
                  rows={3}
                  placeholder="Briefly describe the role and impact…"
                  value={formData.summaryDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      summaryDescription: e.target.value,
                    })
                  }
                  required
                  className="border border-border border-gray-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 text-gray-900"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={() => setActiveSection("questions")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Continue to Application Questions
                </Button>
              </div>
            </div>
          )}

          {/* Questions Section */}
          {activeSection === "questions" && (
            <div className="space-y-8">
              <SectionTitle>Required Applicant Information</SectionTitle>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-800 dark:text-gray-200">
                {formData.applicationFields.map((f, i) => (
                  <li
                    key={i}
                    className="border border-border border-gray-400 px-3 py-2 rounded-md dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                  >
                    {f}
                  </li>
                ))}
              </ul>

              <SectionTitle>File Requirements</SectionTitle>
              <div className="grid grid-cols-1 dark:text-gray-50 sm:grid-cols-3 gap-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.requireResume}
                    onChange={(e) =>
                      setFormData({ ...formData, requireResume: e.target.checked })
                    }
                  />
                  Require Resume
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.requireCoverLetter}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requireCoverLetter: e.target.checked,
                      })
                    }
                  />
                  Require Cover Letter
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.requirePortfolio}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requirePortfolio: e.target.checked,
                      })
                    }
                  />
                  Require Portfolio Link
                </label>
              </div>

              <SectionTitle>Custom Questions</SectionTitle>
              <div className="space-y-2">
                {formData.customQuestions.map((q, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      placeholder={`Question ${idx + 1}`}
                      value={q}
                      onChange={(e) => {
                        const updated = [...formData.customQuestions];
                        updated[idx] = e.target.value;
                        setFormData({ ...formData, customQuestions: updated });
                      }}
                      className="border border-border border-gray-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 text-gray-900"
                    />
                    {formData.customQuestions.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          const updated = formData.customQuestions.filter(
                            (_, i) => i !== idx
                          );
                          setFormData({ ...formData, customQuestions: updated });
                        }}
                        className= " text-gray-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      customQuestions: [...formData.customQuestions, ""],
                    })
                  }
                  className = "border border-border border-gray-400 hover:shadow-lg text-gray-700"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Question
                </Button>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveSection("summary")}
                  className = "border border-border border-gray-400 hover:shadow-lg text-gray-700"
                >
                  Back to Summary
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveSection("moreInfo")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Continue to More Info
                </Button>
              </div>
            </div>
          )}

          {/* More Info Section */}
          {activeSection === "moreInfo" && (
            <div className="space-y-8">
              <div>
                <SectionTitle>About Company</SectionTitle>
                <Textarea
                  rows={3}
                  value={formData.aboutCompany}
                  onChange={(e) =>
                    setFormData({ ...formData, aboutCompany: e.target.value })
                  }
                  className="border border-border border-gray-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 text-gray-900"
                />
              </div>

              <div>
                <SectionTitle>Job Description</SectionTitle>
                <Textarea
                  rows={5}
                  value={formData.jobDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, jobDescription: e.target.value })
                  }
                  className="border border-border border-gray-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 text-gray-900"
                />
              </div>

              <div>
                <SectionTitle>Job Responsibilities</SectionTitle>
                {renderArrayInputs("responsibilities", "Responsibility")}
              </div>

              <div>
                <SectionTitle>Qualifications</SectionTitle>
                {renderArrayInputs("qualifications", "Qualification")}
              </div>

              <div>
                <SectionTitle>Required Competencies</SectionTitle>
                {renderArrayInputs("competencies", "Competency")}
              </div>

              <div>
                <SectionTitle>Languages</SectionTitle>
                {renderArrayInputs("languages", "Language")}
              </div>

              <div>
                <SectionTitle>Performance Indicators</SectionTitle>
                {renderArrayInputs("performanceIndicators", "Performance Indicator")}
              </div>

              <div>
                <SectionTitle>Exams to be Conducted</SectionTitle>
                {renderArrayInputs("exams", "Exam")}
              </div>

              <div>
                <SectionTitle>Application Guidelines</SectionTitle>
                <Textarea
                  rows={4}
                  value={formData.applicationGuidelines}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      applicationGuidelines: e.target.value,
                    })
                  }
                  className="border border-border border-gray-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 text-gray-900"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveSection("questions")}
                  className = "border border-border border-gray-400 hover:shadow-lg text-gray-700"
                >
                  Back to Application
                </Button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button type="button" variant="outline" className="dark:text-gray-50" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Job
            </Button>
          </div>
        </form>
      </div>
        </div>
  );
};

export default CreateJobForm;