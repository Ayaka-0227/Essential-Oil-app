const fallbackApiBaseUrl = "http://localhost:3000";

export const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || fallbackApiBaseUrl).replace(/\/$/, "");

export function apiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${apiBaseUrl}${normalizedPath}`;
}