import React, { useEffect, useState } from "react";
import {
  Upload,
  Eye,
  Trash2,
  FileText,
  Calendar,
  User,
  DownloadCloud,
} from "lucide-react";
import useUserAxios from "../hooks/useUserAxios";
import  ReactMarkdown  from "react-markdown";

const ResumeManager = () => {
  const [resume, setResume] = useState(null);
  const axios = useUserAxios();

  const [isDragOver, setIsDragOver] = useState(false);

  const getResumes = async () => {
    try {
      const resp = await axios.get("/api/users/cv");
      if (resp.data.success) {
        setResume(resp.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileUpload = async (file) => {
    if (
      file &&
      (file.type === "application/pdf" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "application/msword")
    ) {
      const formData = new FormData();
      formData.append("c_f_id", file);
      try {
        const resp = await axios.post("/api/users/cv/", formData);
        if (resp.data.success) {
          getResumes();
        }
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Failed to upload resume. Please try again.");
      }
    } else {
      alert("Please upload only PDF or Word documents");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file);
    e.target.value = "";
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      try {
        await axios.delete(`/api/users/cv/`);
        setResume(null);
        // Refresh the resume list after deletion
        getResumes();
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete resume. Please try again.");
      }
    }
  };

  const downloadFile = async (url, filename) => {
    try {
      const resp = await axios.get(url, { responseType: "blob" });

      if (resp.status < 400) {
        const url = window.URL.createObjectURL(new Blob([resp.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const getFileExtension = (filename) => {
    if (!filename) return "Unknown";
    return filename.split(".").pop().toUpperCase();
  };

  useEffect(() => {
    getResumes();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Resume Manager
        </h1>
        <p className="text-gray-600">Upload, view, and manage your resumes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload and List Section */}
        <div className="space-y-6">
          {/* Upload Area */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Upload Resume
            </h2>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                isDragOver
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg text-gray-600 mb-2">
                Drag and drop your resume here
              </p>
              <p className="text-sm text-gray-500 mb-4">
                or click to browse files
              </p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </label>
              <p className="text-xs text-gray-400 mt-2">
                Supported formats: PDF, DOC, DOCX
              </p>
            </div>
          </div>

          {/* Current Resume Info */}
          {resume && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Current Resume
                </h2>
                <button
                  onClick={() =>
                    downloadFile(
                      `${import.meta.env.VITE_SERVER_URL}/api/files/cv/${
                        resume.id
                      }`,
                      resume.c_f_id.f_name
                    )
                  }
                >
                  <DownloadCloud />
                </button>
                <button
                  onClick={() => handleDelete(resume.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Resume"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <FileText className="h-10 w-10 text-blue-600" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {resume.c_f_id?.f_name || "Unknown filename"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Uploaded on{" "}
                    {formatDate(
                      resume.c_f_id?.f_uploaded_at || resume.created_at
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                <div className="p-3 bg-gray-50 rounded">
                  <span className="font-medium text-gray-700">File Size:</span>
                  <p className="text-gray-600">
                    {formatFileSize(resume.c_f_id?.f_size)}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <span className="font-medium text-gray-700">Format:</span>
                  <p className="text-gray-600">
                    {getFileExtension(resume.c_f_id?.f_name)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Preview</h2>
            <button
              onClick={() =>
                downloadFile(
                  `${import.meta.env.VITE_SERVER_URL}/api/files/cv/${
                    resume.id
                  }`,
                  resume.c_f_id.f_name
                )
              }
              disabled={!resume}
            >
              <DownloadCloud />
            </button>
          </div>
          <div className="p-6">
            {resume ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <FileText className="h-10 w-10 text-blue-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {resume.c_f_id?.f_name || "Unknown filename"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Uploaded on{" "}
                      {formatDate(
                        resume.c_f_id?.f_uploaded_at || resume.created_at
                      )}
                    </p>
                  </div>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <FileText className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">
                    Resume preview will appear here
                  </p>
                  {resume.c_f_id?.f_url && resume.c_f_id.f_url !== "#" && (
                    <a
                      href={resume.c_f_id.f_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Open Full View
                    </a>
                  )}
                  {resume.c_f_id?.f_path && !resume.c_f_id?.f_url && (
                    <p className="text-sm text-gray-400 mt-2">
                      File path: {resume.c_f_id.f_path}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-gray-50 rounded">
                    <span className="font-medium text-gray-700">
                      File Size:
                    </span>
                    <p className="text-gray-600">
                      {formatFileSize(resume.c_f_id?.f_size)}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <span className="font-medium text-gray-700">Format:</span>
                    <p className="text-gray-600">
                      {getFileExtension(resume.c_f_id?.f_name)}
                    </p>
                  </div>
                </div>

                {/* Content Preview Section */}
                {resume.c_content && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Content Preview
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                      <ReactMarkdown>
                        {resume.parsed_data
                          ? resume.c_content
                          : resume.c_content}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <User className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500 mb-2">No resume uploaded</p>
                <p className="text-sm text-gray-400">
                  Upload a resume to see it here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeManager;
