import apiClient from "./apiClient";
export const simulatePolicy = (scenario) =>
  apiClient.post("/simulation", scenario);
