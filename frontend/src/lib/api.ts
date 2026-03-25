const configuredApiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

function resolveApiBaseUrl(): string {
  if (configuredApiBaseUrl && configuredApiBaseUrl.length > 0) {
    return configuredApiBaseUrl.replace(/\/$/, "");
  }
  if (typeof window !== "undefined") {
    if (window.location.hostname === "essential-oil-frontend.onrender.com") {
      return "https://essential-oil-app.onrender.com";
    }
  }
  return "http://localhost:3000";
}

export const API_BASE_URL = resolveApiBaseUrl();
