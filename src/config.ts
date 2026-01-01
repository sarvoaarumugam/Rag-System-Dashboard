// src/config.ts
/**
 * APP CONFIGURATION
 */

// Backend API URL
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Debug mode
export const DEBUG_LOGS = import.meta.env.VITE_DEBUG_LOGS === "true" || true;

// App settings
export const APP_CONFIG = {
  // App name
  appName: "AI Knowledge Assistant",

  // Default number of RAG chunks to retrieve
  defaultTopK: 3,

  // Max file size for uploads (10MB)
  maxFileSize: 10 * 1024 * 1024,

  // Allowed file types
  allowedFileTypes: [".pdf"],
};

// Helper to log configuration
export function logConfig() {
  if (DEBUG_LOGS) {
    console.log("🔧 App Configuration:");
    console.log("  API Base URL:", API_BASE_URL);
    console.log("  App Name:", APP_CONFIG.appName);
  }
}
