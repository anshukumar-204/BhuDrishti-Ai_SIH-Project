import apiClient from "./apiClient";

export const analyzeLand = (latitude, longitude) =>
  apiClient.get("/land-intelligence/analyze", {
    params: { lat: latitude, lng: longitude },
  });
