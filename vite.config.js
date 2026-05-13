// vite.config.js
import { defineConfig } from 'vite'; // <--- This is the missing piece!
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8080", // localhost əvəzinə IP yaz
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api') // ehtiyac olsa
      },
    },
  },
});