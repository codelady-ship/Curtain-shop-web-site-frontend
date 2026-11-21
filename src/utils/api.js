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
  // Demo build: give up after 8 s so a cold-starting free Render instance falls back to demo
  // data (a timeout has no response, so isBackendUnavailable treats it as unavailable).
  timeout: IS_DEMO ? 8000 : 0,
  headers: {
    "Content-Type": "application/json",
  },
});

// Public "Demo admin" (AdminLogin): "server" = read-only demo account on the real API
// (writes answer 403 + a friendly message), "sandbox" = the API was unreachable, so every
// request is answered in the browser by adminSandbox.js (changes stay in this tab only).
const readStorage = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
const isSandboxMode = () => readStorage("perde_admin_mode") === "sandbox";
const isServerDemoUser = () => {
  try {
    return Boolean(JSON.parse(readStorage("adminUser") || "null")?.demo) && !isSandboxMode();
  } catch {
    return false;
  }
};
const sandboxAdapter = async (requestConfig) => (await import("./adminSandbox.js")).sandboxAdapter(requestConfig);

// Shown as a toast by the admin panel (MainAdminDashboard -> DemoNotice).
export const DEMO_NOTICE_EVENT = "perde:demo-notice";
const announceDemo = (message) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(DEMO_NOTICE_EVENT, { detail: message || "Demo rejimi: dəyişikliklər saxlanılmır." }));
};

api.interceptors.request.use(
  (config) => {
    if (isSandboxMode()) {
      config.adapter = sandboxAdapter;
      return config;
    }

    const token = readStorage("token");
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
// Demo admin: friendly toast for refused demo writes; if the API goes away mid-session
// (Render free instance asleep), continue in the in-browser sandbox instead of failing.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const response = error?.response;
    if (response?.status === 403 && response.data?.demo) {
      announceDemo(response.data.message);
    } else if (isServerDemoUser() && error?.config && (!response || !String(response.headers?.["content-type"] || "").includes("json"))) {
      const { startSandboxSession } = await import("./adminSandbox.js");
      startSandboxSession();
      announceDemo("Server cavab vermir: demo admin brauzerdəki demo rejimində davam edir.");
      return sandboxAdapter(error.config);
    }
    return Promise.reject(error);
  },
);

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
