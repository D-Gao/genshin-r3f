import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [react(), glsl()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 500, // Optional: Increase the chunk size warning limit
  },
});
