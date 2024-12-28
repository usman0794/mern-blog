import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        secure: false,
      },
    },
  },
  plugins: [react()],
  optimizeDeps: {
    include: ["@aws-sdk/client-s3"], // Pre-bundle the AWS SDK dependency
  },
  resolve: {
    alias: {
      // Add custom aliases if required
    },
  },
});
