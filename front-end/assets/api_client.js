const API_BASE = "http://localhost:3000";

export function apiFetch(path, init = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  return fetch(url, { credentials: "include", ...init });
}

export { API_BASE };
