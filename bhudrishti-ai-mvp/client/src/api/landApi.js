import apiClient from "./apiClient";

export const searchLand = (params) =>
  apiClient.get("/lands/search", { params });

export const searchLocation = (query) =>
  apiClient.get("/locations/search", { params: { q: query } });

export const getNearby = (parcelId) =>
  apiClient.get(`/lands/${encodeURIComponent(parcelId)}/nearby`);

export const exportLandData = (format) =>
  apiClient.get(`/lands/export?format=${format}`, {
    responseType: format === "csv" ? "blob" : "json",
  });
