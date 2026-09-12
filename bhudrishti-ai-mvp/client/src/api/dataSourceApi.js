import apiClient from "./apiClient";

export const getDataSources = (domain) =>
  apiClient.get("/data-sources", { params: domain ? { domain } : undefined });
