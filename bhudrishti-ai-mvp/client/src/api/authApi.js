import apiClient from "./apiClient";
export const login = (credentials) =>
  apiClient.post("/auth/login", credentials);
export const register = (credentials) =>
  apiClient.post("/auth/register", credentials);
export const getCurrentUser = () => apiClient.get("/auth/me");
