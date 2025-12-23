const normalizeBaseUrl = (url: string) => url.replace(/\/$/, "");

const DEFAULT_PROD_API_BASE = "https://anthonymumbi-production.up.railway.app";

const resolveBaseUrl = () => {
  // Highest priority: explicit env var
  const envBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();
  if (envBase) return normalizeBaseUrl(envBase);

  // Server-side fallback (build-time / SSR): assume production backend
  if (typeof window === "undefined") return DEFAULT_PROD_API_BASE;

  const { hostname, port } = window.location;
  const isLocalHost =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0";

  // LAN dev on Vite preview/dev ports -> point to local backend
  const isLanDevHost =
    /^10\./.test(hostname) ||
    /^192\.168\./.test(hostname) ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname);
  const isVitePort = port === "5173" || port === "4173" || port === "4174";
  if (isVitePort && (isLocalHost || isLanDevHost)) {
    return normalizeBaseUrl(`http://${hostname}:4000`);
  }

  // Localhost default
  if (isLocalHost) {
    return "http://localhost:4000";
  }

  // Deployed default -> Railway
  return DEFAULT_PROD_API_BASE;
};

export const API_BASE_URL = resolveBaseUrl();

export const apiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
