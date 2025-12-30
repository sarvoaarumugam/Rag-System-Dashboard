import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr()], // Corrected svgr() to call the function
  server: {
    port: 5172, // Set a fixed port (change as needed)
    strictPort: true, // If the port is taken, Vite will fail instead of choosing a new one
    host: "localhost", // Ensure it runs on localhost
  },
  base: "./", // ✅ Ensures assets load correctly in Amplify
});
