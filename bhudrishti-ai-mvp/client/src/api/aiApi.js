import apiClient from "./apiClient";
export const generateInsight = (parcel) =>
  apiClient.post("/ai/insight", { parcel });
