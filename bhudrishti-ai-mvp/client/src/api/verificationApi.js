import apiClient from "./apiClient";
export const verifyDocument = (payload) =>
  apiClient.post("/verification/verify", payload);
