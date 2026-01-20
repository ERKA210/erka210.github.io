export function sanitizeText(value) {
  let text = String(value || "");

  text = text.trim();

  text = text.slice(0, 500);

  text = text.replace(/&/g, "&amp;");
  text = text.replace(/</g, "&lt;");
  text = text.replace(/>/g, "&gt;");
  text = text.replace(/"/g, "&quot;");
  text = text.replace(/'/g, "&#39;");

  return text;
}