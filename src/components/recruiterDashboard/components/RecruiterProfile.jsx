import React, { useState } from "react";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  Briefcase,
  Users,
  Edit,
  Linkedin,
  Twitter,
  Facebook,
  X,
  Save,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const RecruiterProfile = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [recruiter, setRecruiter] = useState({
    company: {
      name: "Nexus Inc.",
      industry: "Technology",
      location: "Kigali, Rwanda",
      website: "https://nexus.com",
      email: "info@nexus.com",
      phone: "+250 788 987 654",
      socials: {
        linkedin: "https://linkedin.com/company/nexus",
        twitter: "https://twitter.com/nexus",
        facebook: "https://facebook.com/nexus",
      },
      description:
        "Nexus Inc. is a leading tech company in Rwanda building innovative solutions for African markets.",
      logo: "https://via.placeholder.com/100",
    },
    recruiter: {
      name: "Princess Niyomugenga",
      title: "Talent Acquisition Lead",
      email: "princess@nexus.com",
      phone: "+250 788 123 456",
      linkedin: "https://linkedin.com/in/princess",
    },
    stats: {
      jobsPosted: 24,
      activeJobs: 8,
      applications: 450,
      shortlisted: 120,
    },
  });

  // Handle updates
  const handleChange = (section, field, value) => {
    setRecruiter((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSocialChange = (platform, value) => {
    setRecruiter((prev) => ({
      ...prev,
      company: {
        ...prev.company,
        socials: {
          ...prev.company.socials,
          [platform]: value,
        },
      },
    }));
  };

  const handleSave = () => {
    console.log("Updated recruiter profile:", recruiter);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground dark:text-white">
          Recruiter Profile
        </h1>
        <Button
          className="bg-blue-600 hover:bg-blue-500 text-white"
          onClick={() => setIsEditing(true)}
        >
          <Edit className="h-4 w-4 mr-2" /> Update Profile
        </Button>
      </div>

      {/* Company Info */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-6">
          <img
            src={recruiter.company.logo}
            alt="Company Logo"
            className="w-24 h-24 rounded-lg object-cover border dark:border-gray-700"
          />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">{recruiter.company.name}</h2>
            <p className="text-muted-foreground">{recruiter.company.industry}</p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-4 w-4" /> {recruiter.company.location}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Globe className="h-4 w-4" />{" "}
              <a
                href={recruiter.company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {recruiter.company.website}
              </a>
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" /> {recruiter.company.email}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" /> {recruiter.company.phone}
            </p>
            <div className="flex gap-3 mt-2">
              <a
                href={recruiter.company.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href={recruiter.company.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-400"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href={recruiter.company.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-700"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
            <p className="mt-3">{recruiter.company.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Recruiter Info */}
      <Card>
        <CardHeader>
          <CardTitle>Recruiter Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-medium">{recruiter.recruiter.name}</p>
            <p className="text-muted-foreground">{recruiter.recruiter.title}</p>
          </div>
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" /> {recruiter.recruiter.email}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" /> {recruiter.recruiter.phone}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Linkedin className="h-4 w-4" />{" "}
              <a
                href={recruiter.recruiter.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                LinkedIn Profile
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Activity Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-muted text-center">
            <p className="text-2xl font-bold">{recruiter.stats.jobsPosted}</p>
            <p className="text-sm text-muted-foreground">Jobs Posted</p>
          </div>
          <div className="p-4 rounded-lg bg-muted text-center">
            <p className="text-2xl font-bold">{recruiter.stats.activeJobs}</p>
            <p className="text-sm text-muted-foreground">Active Jobs</p>
          </div>
          <div className="p-4 rounded-lg bg-muted text-center">
            <p className="text-2xl font-bold">{recruiter.stats.applications}</p>
            <p className="text-sm text-muted-foreground">Applications</p>
          </div>
          <div className="p-4 rounded-lg bg-muted text-center">
            <p className="text-2xl font-bold">{recruiter.stats.shortlisted}</p>
            <p className="text-sm text-muted-foreground">Shortlisted</p>
          </div>
        </CardContent>
      </Card>

      {/* Update Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm  flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg shadow-lg bg-white dark:bg-gray-700 w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-xl font-bold dark:text-gray-50">Update Profile</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)} >
                <X className="h-5 w-5 dark:text-gray-50" />
              </Button>
            </div>

            {/* Company Info Form */}
            <h3 className="font-semibold mb-2 dark:text-gray-50">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols gap-4 mb-4">
              <Input
                placeholder="Company Name"
                value={recruiter.company.name}
                onChange={(e) => handleChange("company", "name", e.target.value)}
                className= "border border-border dark:bg-gray-700 dark:text-gray-50 border-gray-400"
              />
              <Input
                placeholder="Industry"
                value={recruiter.company.industry}
                onChange={(e) => handleChange("company", "industry", e.target.value)}
                className= "border border-border dark:bg-gray-700 dark:text-gray-50 border-gray-400"
              />
              <Input
                placeholder="Location"
                value={recruiter.company.location}
                onChange={(e) => handleChange("company", "location", e.target.value)}
                className= "border border-border dark:bg-gray-700 dark:text-gray-50 border-gray-400"
              />
              <Input
                placeholder="Website"
                value={recruiter.company.website}
                onChange={(e) => handleChange("company", "website", e.target.value)}
                className= "border border-border dark:bg-gray-700 dark:text-gray-50 border-gray-400"
              />
              <Input
                placeholder="Email"
                value={recruiter.company.email}
                onChange={(e) => handleChange("company", "email", e.target.value)}
                className= "border border-border dark:bg-gray-700 dark:text-gray-50 border-gray-400"
              />
              <Input
                placeholder="Phone"
                value={recruiter.company.phone}
                onChange={(e) => handleChange("company", "phone", e.target.value)}
                className= "border border-border dark:bg-gray-700 dark:text-gray-50 border-gray-400"
              />
              <Input
                placeholder="LinkedIn"
                value={recruiter.company.socials.linkedin}
                onChange={(e) => handleSocialChange("linkedin", e.target.value)}
                className= "border border-border dark:bg-gray-700 dark:text-gray-50 border-gray-400"
              />
              <Input
                placeholder="Twitter"
                value={recruiter.company.socials.twitter}
                onChange={(e) => handleSocialChange("twitter", e.target.value)}
                className= "border border-border dark:bg-gray-700 dark:text-gray-50 border-gray-400"
              />
              <Input
                placeholder="Facebook"
                value={recruiter.company.socials.facebook}
                onChange={(e) => handleSocialChange("facebook", e.target.value)}
                className= "border border-border dark:bg-gray-700 dark:text-gray-50 border-gray-400"
              />
            </div>
            <Textarea
              rows={3}
              placeholder="About Company"
              value={recruiter.company.description}
              onChange={(e) => handleChange("company", "description", e.target.value)}
              className= "border border-border dark:bg-gray-700 dark:text-gray-50 border-gray-400"
            />

            {/* Recruiter Info Form */}
            <h3 className="font-semibold mt-6 mb-2 dark:text-gray-50">Recruiter Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                placeholder="Recruiter Name"
                value={recruiter.recruiter.name}
                onChange={(e) => handleChange("recruiter", "name", e.target.value)}
                className= "border border-border dark:bg-gray-700 dark:text-gray-50 border-gray-400"
              />
              <Input
                placeholder="Job Title"
                value={recruiter.recruiter.title}
                onChange={(e) => handleChange("recruiter", "title", e.target.value)}
                className= "border border-border dark:bg-gray-700 dark:text-gray-50 border-gray-400"
              />
              <Input
                placeholder="Email"
                value={recruiter.recruiter.email}
                onChange={(e) => handleChange("recruiter", "email", e.target.value)}
                className= "border border-border dark:bg-gray-700 dark:text-gray-50 border-gray-400"
              />
              <Input
                placeholder="Phone"
                value={recruiter.recruiter.phone}
                onChange={(e) => handleChange("recruiter", "phone", e.target.value)}
                className= "border border-border dark:bg-gray-700 dark:text-gray-50 border-gray-400"
              />
              <Input
                placeholder="LinkedIn"
                value={recruiter.recruiter.linkedin}
                onChange={(e) => handleChange("recruiter", "linkedin", e.target.value)}
                className= "border border-border dark:bg-gray-700 dark:text-gray-50 border-gray-400"
              />
            </div>

            {/* Save/Cancel */}
            <div className="flex justify-end gap-3 border-t pt-3">
              <Button variant="outline" onClick={() => setIsEditing(false)} className="dark:text-gray-50">
                Cancel
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSave}
              >
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterProfile;
