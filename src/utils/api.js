import axios from "axios";

const normalizeApiBaseUrl = (value) => {
  const cleaned = String(value || "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/\/+$/g, "");

  if (!cleaned) return "/api";
  if (cleaned === "api") return "/api";
  if (cleaned.startsWith("/")) return cleaned.endsWith("/api") ? cleaned : `${cleaned}/api`;
  if (/^https?:\/\//i.test(cleaned)) return cleaned.endsWith("/api") ? cleaned : `${cleaned}/api`;
  return "/api";
};

const api = axios.create({
  baseURL: normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL),
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
