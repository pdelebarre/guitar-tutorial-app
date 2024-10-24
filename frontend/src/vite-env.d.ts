/// <reference types="vite/client" />
declare namespace NodeJS {
  interface ProcessEnv {
    VITE_API_BASE_URL: string;
    VITE_API_PORT: string;
    // Add other environment variables here if needed
  }
}