// Simulate saving/fetching profile from localStorage
export const saveProfile = (data) => {
  localStorage.setItem("jobseekerProfile", JSON.stringify(data));
};

export const getProfile = () => {
  const stored = localStorage.getItem("jobseekerProfile");
  return stored ? JSON.parse(stored) : null;
};

export const isProfileComplete = () => {
  const profile = getProfile();
  return profile && profile.name && profile.skills?.length > 0;
};
