import axios from "axios";
import { getAdminToken } from "./adminToken";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  if (typeof window !== "undefined") {
    const isAdminRequest = config.url?.startsWith("/admin");
    const adminToken = getAdminToken();
    const userToken = window.localStorage.getItem("stylerent.auth.token");
    const token = isAdminRequest ? (adminToken || userToken) : (userToken || adminToken);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
