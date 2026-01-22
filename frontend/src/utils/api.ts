import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
});

export const triggerAnalysisRecompute = async () => {
  const response = await api.post("/analysis/trigger");
  return response.data;
}