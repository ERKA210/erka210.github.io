export const api = "http://localhost:3000";

export function apiFetch(path, options) {
  if (!path) throw new Error("apiFetch: path is required");
  const normalized = path.startsWith("/")
    ? `${api}${path}`
    : `${api}/${path}`;
  return fetch(normalized, options);
}
