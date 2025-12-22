const normalizeBaseUrl = (url: string) => url.replace(/\/$/, "");

const getDefaultBaseUrl = () => {
  if (typeof window === "undefined") return "http://localhost:4000";

  const { hostname, origin } = window.location;
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:4000";
  }

  return origin;
};

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;

export const API_BASE_URL = normalizeBaseUrl(
  rawBaseUrl?.trim() || getDefaultBaseUrl()
);

export const apiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
