function formatPrice(amount) {
  return Number(amount || 0).toLocaleString("mn-MN") + "₮";
}

function parsePrice(str) {
    return parseInt(String(str || "").replace(/[^\d]/g, ""), 10) || 0;
  }

function formatMeta(ts) {
  const d = new Date(ts);
  if (isNaN(d.getTime())) return "";
  const date = d.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  });
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return `${date} • ${time}`;
}

function formatMetaFromDate(ts) {
  const d = new Date(ts);
  if (isNaN(d.getTime())) return "";
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${mm}/${dd}/${yy}•${hh}:${min}`;
}

export { formatMeta, formatMetaFromDate, formatPrice, parsePrice };
