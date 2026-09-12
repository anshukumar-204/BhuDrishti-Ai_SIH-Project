import apiClient from "./apiClient";

export const createProject = (title, description = "") =>
  apiClient.post("/projects", { title, description });

export const getProjects = () => apiClient.get("/projects");

export const getSavedResources = () =>
  apiClient.get("/projects/saved-resources");

export const saveResource = (resourceId) =>
  apiClient.post("/projects/saved-resources", { resourceId });

export const removeSavedResource = (resourceId) =>
  apiClient.delete(`/projects/saved-resources/${resourceId}`);

export const addProjectNote = (projectId, body, visibility = "private") =>
  apiClient.post(`/projects/${projectId}/notes`, { body, visibility });
