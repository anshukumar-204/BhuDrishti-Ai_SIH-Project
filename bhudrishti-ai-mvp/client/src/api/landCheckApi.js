import apiClient from "./apiClient";
export const checkLand = (query) =>
  apiClient.get(`/land-check?query=${encodeURIComponent(query)}`);
