import apiClient from "./apiClient";
export const generateInsight = (parcel) =>
  apiClient.post("/ai/insight", {
    parcelId: parcel.parcelId || parcel.parcel_id,
    locality: parcel.locality,
    landUse: parcel.landUse || parcel.land_use,
    riskLevel: parcel.riskLevel || parcel.risk_level,
    area: parcel.area,
  });

export const askAssistant = (question, parcel) =>
  apiClient.post("/assistant", {
    question,
    parcelId: parcel?.parcelId || parcel?.parcel_id,
  });
