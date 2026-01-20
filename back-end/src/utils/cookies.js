export function getCookie(req, name) {
  const header = req.headers.cookie;
  if (!header) return null;

  for (const raw of header.split(";")) {
    const part = raw.trim();
    if (!part) continue;

    const [key, ...rest] = part.split("=");
    if (key !== name) continue;

    return rest.join("=");
  }
  return null;
}