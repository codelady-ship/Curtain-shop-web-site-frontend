import axios from "axios";
import { getDemoResponse, isBackendUnavailable } from "./demoApi.js";

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

// Backend down or not deployed (static demo): answer public product reads with demo data.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isBackendUnavailable(error)) {
      const demo = getDemoResponse(error.config);
      if (demo) {
        console.warn(`API unavailable, showing demo data for ${error.config?.url}`);
        return { status: 200, statusText: "OK", headers: {}, config: error.config, ...demo };
      }
    }
    return Promise.reject(error);
  },
);

export default api;
