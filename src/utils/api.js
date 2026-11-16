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

// True only in the GitHub Pages demo build (`npm run build:pages` loads .env.pages).
export const IS_DEMO = import.meta.env.VITE_DEMO_FALLBACK === "true";

// Demo build with no API URL at all: answer from the bundled demo data without any
// network request, so the static site has no failing /api calls in the console.
const DEMO_OFFLINE = IS_DEMO && !String(import.meta.env.VITE_API_BASE_URL || "").trim();

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

    if (DEMO_OFFLINE) {
      config.adapter = async (requestConfig) => {
        const { getDemoResponse } = await import("./demoApi.js");
        const demo = getDemoResponse(requestConfig);
        if (demo) return { status: 200, statusText: "OK", headers: {}, config: requestConfig, ...demo };
        const error = new Error("This feature requires the backend API (demo build).");
        error.config = requestConfig;
        error.isDemo = true;
        throw error;
      };
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Demo fallback for the GitHub Pages demo build only (`npm run build:pages` loads .env.pages).
// Everywhere else VITE_DEMO_FALLBACK is unset: this block and demoApi.js are dropped at build
// time, so the real site always shows the backend's real responses and errors.
if (IS_DEMO && !DEMO_OFFLINE) {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const { getDemoResponse, isBackendUnavailable } = await import("./demoApi.js");
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
}

export default api;
