import React, { useState } from "react";
import {
  Save,
  Shield,
  Bell,
  Mail,
  FileText,
  Users,
  Briefcase,
  Clock,
  Globe,
  Lock,
  Database,
  Cpu,
  BarChart3,
  Eye,
  EyeOff,
  Download,
  Upload,
} from "lucide-react";
import { Button } from "../../recruiterDashboard/ui/button";
import { Input } from "../../recruiterDashboard/ui/input";
import { Textarea } from "../../recruiterDashboard/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../recruiterDashboard/ui/card";
import { Switch } from "../../recruiterDashboard/ui/switch";
import { Badge } from "../../recruiterDashboard/ui/badge";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "AI-Erecruitment",
    siteDescription: "AI-Powered Recruitment Platform",
    adminEmail: "admin@ai-erecruitment.com",
    supportEmail: "support@ai-erecruitment.com",
    timezone: "UTC+0",
    dateFormat: "YYYY-MM-DD",
    
    // Application Rules
    minJobDescriptionLength: 100,
    maxJobDescriptionLength: 2000,
    minJobTitleLength: 5,
    maxJobTitleLength: 100,
    applicationDeadlineDays: 30,
    autoArchiveJobsAfterDays: 90,
    
    // Candidate Requirements
    minResumeLength: 50,
    maxResumeLength: 2000,
    requireCoverLetter: false,
    minSkillsRequired: 3,
    maxSkillsAllowed: 15,
    
    // AI Configuration
    aiScreeningEnabled: true,
    aiScreeningThreshold: 70,
    aiResumeParsing: true,
    aiSkillMatching: true,
    aiBiasDetection: true,
    
    // Notification Settings
    emailNotifications: true,
    candidateApplicationAlerts: true,
    recruiterActivityAlerts: true,
    systemUpdateAlerts: true,
    dailySummaryReport: true,
    
    // Privacy & Security
    requireStrongPasswords: true,
    twoFactorAuth: false,
    dataEncryption: true,
    autoLogoutMinutes: 30,
    maxLoginAttempts: 5,
    
    // System Instructions
    applicationInstructions: `Welcome to our AI-powered recruitment platform. Please ensure your profile is complete before applying to positions. 
    
• Upload an updated resume in PDF format
• Complete all required profile sections
• Add relevant skills and experience
• Provide accurate contact information

Applications missing required information may be automatically rejected by our AI screening system.`,

    recruiterInstructions: `As a recruiter on our platform, you have access to powerful AI tools to streamline your hiring process.

• Create detailed job descriptions with clear requirements
• Use AI screening to identify top candidates efficiently
• Schedule interviews directly through the platform
• Provide timely feedback to maintain candidate engagement

All recruitment activities must comply with our equal opportunity employment guidelines.`,

    aiUsageGuidelines: `Our AI systems are designed to assist in the recruitment process while maintaining fairness and transparency.

• AI screening scores are based on skill matching and qualification assessment
• Human review is required for final hiring decisions
• Candidates can request feedback on AI evaluation results
• All AI algorithms are regularly audited for bias and accuracy`
  });

  const [showConfirm, setShowConfirm] = useState(false);

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = () => {
    // In a real application, this would save to your backend
    console.log("Saving settings:", settings);
    setShowConfirm(true);
    setTimeout(() => setShowConfirm(false), 3000);
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'ai-erecruitment-settings.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportSettings = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          setSettings(importedSettings);
        } catch (error) {
          alert("Error importing settings: Invalid file format");
        }
      };
      reader.readAsText(file);
    }
  };

  const tabs = [
    { id: "general", name: "General", icon: <Globe size={18} /> },
    { id: "rules", name: "Application Rules", icon: <FileText size={18} /> },
    { id: "candidates", name: "Candidate Requirements", icon: <Users size={18} /> },
    { id: "ai", name: "AI Configuration", icon: <Cpu size={18} /> },
    { id: "notifications", name: "Notifications", icon: <Bell size={18} /> },
    { id: "security", name: "Privacy & Security", icon: <Shield size={18} /> },
    { id: "instructions", name: "Instructions", icon: <FileText size={18} /> },
  ];

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configure platform rules, AI settings, and system instructions
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleExportSettings}
            className="border-gray-300 dark:border-gray-600"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <label htmlFor="import-settings">
            <Button 
              variant="outline" 
              as="span"
              className="border-gray-300 dark:border-gray-600 cursor-pointer"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <input
              id="import-settings"
              type="file"
              accept=".json"
              onChange={handleImportSettings}
              className="hidden"
            />
          </label>
          <Button 
            onClick={handleSaveSettings}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {showConfirm && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          Settings saved successfully!
        </div>
      )}

      {/* Tabs */}
      <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Settings Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Settings */}
          {activeTab === "general" && (
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure basic platform information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Site Name
                    </label>
                    <Input
                      value={settings.siteName}
                      onChange={(e) => handleInputChange("siteName", e.target.value)}
                      className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Admin Email
                    </label>
                    <Input
                      type="email"
                      value={settings.adminEmail}
                      onChange={(e) => handleInputChange("adminEmail", e.target.value)}
                      className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Site Description
                  </label>
                  <Input
                    value={settings.siteDescription}
                    onChange={(e) => handleInputChange("siteDescription", e.target.value)}
                    className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Timezone
                    </label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => handleInputChange("timezone", e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="UTC+0">UTC+0</option>
                      <option value="UTC+1">UTC+1</option>
                      <option value="UTC+2">UTC+2</option>
                      <option value="UTC+3">UTC+3</option>
                      <option value="UTC-5">UTC-5 (EST)</option>
                      <option value="UTC-8">UTC-8 (PST)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date Format
                    </label>
                    <select
                      value={settings.dateFormat}
                      onChange={(e) => handleInputChange("dateFormat", e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Application Rules */}
          {activeTab === "rules" && (
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Application Rules</CardTitle>
                <CardDescription>
                  Set rules and constraints for job postings and applications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Minimum Job Description Length
                    </label>
                    <Input
                      type="number"
                      value={settings.minJobDescriptionLength}
                      onChange={(e) => handleInputChange("minJobDescriptionLength", parseInt(e.target.value))}
                      className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Maximum Job Description Length
                    </label>
                    <Input
                      type="number"
                      value={settings.maxJobDescriptionLength}
                      onChange={(e) => handleInputChange("maxJobDescriptionLength", parseInt(e.target.value))}
                      className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Minimum Job Title Length
                    </label>
                    <Input
                      type="number"
                      value={settings.minJobTitleLength}
                      onChange={(e) => handleInputChange("minJobTitleLength", parseInt(e.target.value))}
                      className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Maximum Job Title Length
                    </label>
                    <Input
                      type="number"
                      value={settings.maxJobTitleLength}
                      onChange={(e) => handleInputChange("maxJobTitleLength", parseInt(e.target.value))}
                      className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Application Deadline (Days)
                    </label>
                    <Input
                      type="number"
                      value={settings.applicationDeadlineDays}
                      onChange={(e) => handleInputChange("applicationDeadlineDays", parseInt(e.target.value))}
                      className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Auto-archive Jobs After (Days)
                    </label>
                    <Input
                      type="number"
                      value={settings.autoArchiveJobsAfterDays}
                      onChange={(e) => handleInputChange("autoArchiveJobsAfterDays", parseInt(e.target.value))}
                      className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Configuration */}
          {activeTab === "ai" && (
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>AI Configuration</CardTitle>
                <CardDescription>
                  Configure AI-powered features and screening parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Enable AI Screening
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Automatically screen applications using AI
                    </p>
                  </div>
                  <Switch
                    checked={settings.aiScreeningEnabled}
                    onCheckedChange={(checked) => handleInputChange("aiScreeningEnabled", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Enable AI Resume Parsing
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Extract information from resumes automatically
                    </p>
                  </div>
                  <Switch
                    checked={settings.aiResumeParsing}
                    onCheckedChange={(checked) => handleInputChange("aiResumeParsing", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Enable AI Skill Matching
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Match candidate skills to job requirements
                    </p>
                  </div>
                  <Switch
                    checked={settings.aiSkillMatching}
                    onCheckedChange={(checked) => handleInputChange("aiSkillMatching", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Enable AI Bias Detection
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Detect and mitigate bias in hiring process
                    </p>
                  </div>
                  <Switch
                    checked={settings.aiBiasDetection}
                    onCheckedChange={(checked) => handleInputChange("aiBiasDetection", checked)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    AI Screening Threshold (%)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={settings.aiScreeningThreshold}
                    onChange={(e) => handleInputChange("aiScreeningThreshold", parseInt(e.target.value))}
                    className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Minimum score for candidates to pass AI screening
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          {activeTab === "instructions" && (
            <div className="space-y-6">
              <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle>Application Instructions</CardTitle>
                  <CardDescription>
                    Guidelines for candidates applying to positions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    rows={6}
                    value={settings.applicationInstructions}
                    onChange={(e) => handleInputChange("applicationInstructions", e.target.value)}
                    className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </CardContent>
              </Card>
              
              <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle>Recruiter Instructions</CardTitle>
                  <CardDescription>
                    Guidelines for recruiters using the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    rows={6}
                    value={settings.recruiterInstructions}
                    onChange={(e) => handleInputChange("recruiterInstructions", e.target.value)}
                    className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </CardContent>
              </Card>
              
              <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle>AI Usage Guidelines</CardTitle>
                  <CardDescription>
                    Explanation of how AI is used in the recruitment process
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    rows={6}
                    value={settings.aiUsageGuidelines}
                    onChange={(e) => handleInputChange("aiUsageGuidelines", e.target.value)}
                    className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Add other tabs content following the same pattern */}
        </div>

        {/* Status Panel */}
        <div className="space-y-6">
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle>Settings Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Screening</span>
                <Badge className={settings.aiScreeningEnabled ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"}>
                  {settings.aiScreeningEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Resume Parsing</span>
                <Badge className={settings.aiResumeParsing ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"}>
                  {settings.aiResumeParsing ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Skill Matching</span>
                <Badge className={settings.aiSkillMatching ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"}>
                  {settings.aiSkillMatching ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Bias Detection</span>
                <Badge className={settings.aiBiasDetection ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"}>
                  {settings.aiBiasDetection ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start border-gray-300 dark:border-gray-600">
                <Database className="h-4 w-4 mr-2" />
                Backup Settings
              </Button>
              <Button variant="outline" className="w-full justify-start border-gray-300 dark:border-gray-600">
                <BarChart3 className="h-4 w-4 mr-2" />
                View System Logs
              </Button>
              <Button variant="outline" className="w-full justify-start border-gray-300 dark:border-gray-600">
                <Cpu className="h-4 w-4 mr-2" />
                AI Model Status
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;