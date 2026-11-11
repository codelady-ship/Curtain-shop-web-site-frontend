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

// Demo fallback for the GitHub Pages demo build only (`npm run build:pages` loads .env.pages).
// Everywhere else VITE_DEMO_FALLBACK is unset: this block and demoApi.js are dropped at build
// time, so the real site always shows the backend's real responses and errors.
if (import.meta.env.VITE_DEMO_FALLBACK === "true") {
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
