const entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export const sanitizeText = (value, { maxLen = 500 } = {}) => {
  const raw = String(value ?? "").trim();
  const sliced = raw.slice(0, maxLen);
  return sliced.replace(/[&<>"']/g, (ch) => entityMap[ch] || ch);
};
