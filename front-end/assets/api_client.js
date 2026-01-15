const API = "http://localhost:3000";

export function apiFetch(path, init = {}) {
  const url = path.startsWith("http") ? path : `${API}${path}`;
  return fetch(url, { credentials: "include", ...init });
}

export { API };
