import apiClient from "./apiClient";
export const getProfile = () => apiClient.get("/users/me");
