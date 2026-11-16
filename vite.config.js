import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages serves the demo under /Curtain-shop-web-site-frontend/ (`npm run build:pages`).
// Every other build (local dev, or a real host such as Vercel, Netlify or nginx) uses "/".
export default defineConfig(({ mode }) => ({
  base: mode === "pages" ? "/Curtain-shop-web-site-frontend/" : "/",
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "INVALID_ANNOTATION") return;
        warn(warning);
      },
    },
  },
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8080",
        changeOrigin: true,
        secure: false,
      },
      "/uploads": {
        target: "http://127.0.0.1:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
}));
