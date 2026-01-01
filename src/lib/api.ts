const normalizeBaseUrl = (url: string) => url.replace(/\/$/, "");

const PRODUCTION_FALLBACK_BASE_URL =
  "https://anthonymumbi-production.up.railway.app";

const getDefaultBaseUrl = (envBaseUrl?: string | null) => {
  if (envBaseUrl) return envBaseUrl;
  if (typeof window === "undefined") return "http://localhost:4000";

  const { hostname, origin, port } = window.location;
  const isLocalHost =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0";

  // When using Vite dev/preview over LAN (e.g., 192.168.x.x:5173),
  // point the API to the dev server port instead of the UI port.
  const isLanDevHost =
    /^10\./.test(hostname) ||
    /^192\.168\./.test(hostname) ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname);
  const isVitePort = port === "5173" || port === "4173" || port === "4174";
  if (isVitePort && (isLocalHost || isLanDevHost)) {
    return `http://${hostname}:4000`;
  }

  if (isLocalHost) {
    return "http://localhost:4000";
  }

  // When deployed without an explicit API base URL, default to the
  // hosted backend instead of the current origin (which is static).
  return PRODUCTION_FALLBACK_BASE_URL;
};

const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)
  ?.trim();

export const API_BASE_URL = normalizeBaseUrl(getDefaultBaseUrl(rawBaseUrl));

export const apiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
