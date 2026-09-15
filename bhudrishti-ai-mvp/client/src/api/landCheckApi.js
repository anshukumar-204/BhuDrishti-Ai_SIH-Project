import apiClient from "./apiClient";
export const checkLand = (query) =>
  apiClient.get(`/land-check?query=${encodeURIComponent(query)}`);

export const getNearbyFeatures = ({ latitude, longitude, radiusKm = 2 }) =>
  apiClient.get("/geospatial/nearby", {
    params: { lat: latitude, lng: longitude, radius: radiusKm },
  });
