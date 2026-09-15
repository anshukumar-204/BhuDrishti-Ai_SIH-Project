import apiClient from "./apiClient";

export const getDashboard = () => apiClient.get("/dashboard");

export const saveParcel = (parcelId) =>
  apiClient.post("/dashboard/saved-parcels", { parcelId });

export const removeSavedParcel = (parcelId) =>
  apiClient.delete(`/dashboard/saved-parcels/${encodeURIComponent(parcelId)}`);
