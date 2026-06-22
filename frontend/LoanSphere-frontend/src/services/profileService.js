import api from "../api/axiosConfig";

export const createProfile = (profileData) => {
  return api.post("/api/profile", profileData);
};

export const getProfile = (userId) => {
  return api.get(`/api/profile/user/${userId}`);
};

export const getAllProfiles = () => {
  return api.get("/api/profile/all");
};