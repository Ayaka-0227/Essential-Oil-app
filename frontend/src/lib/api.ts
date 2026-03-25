const configuredApiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

function resolveApiBaseUrl(): string {
  if (configuredApiBaseUrl && configuredApiBaseUrl.length > 0) {
    return configuredApiBaseUrl.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    const { hostname } = window.location;

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:3000";
    }

    if (hostname === "essential-oil-frontend.onrender.com") {
      return "https://essential-oil-app.onrender.com";
    }
  }

  return process.env.NODE_ENV === "production"
    ? "https://essential-oil-app.onrender.com"
    : "http://localhost:3000";
}

export const API_BASE_URL = resolveApiBaseUrl();
