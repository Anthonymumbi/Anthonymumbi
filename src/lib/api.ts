const normalizeBaseUrl = (url: string) => url.replace(/\/$/, "");

const DEFAULT_PROD_API_BASE = "https://anthonymumbi-production.up.railway.app";

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

  // Deployed default -> Railway
  return DEFAULT_PROD_API_BASE;
};

export const API_BASE_URL = resolveBaseUrl();

export const apiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
