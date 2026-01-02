// assets/components/state-ui.js
function getState() {
  return localStorage.getItem("appState") || "guest";
}

/**
 * Rule:
 * - courier -> block ordering UI
 * - customer -> block courier accept UI
 */
export function applyStateUI(root = document) {
  const state = getState();
  const role = localStorage.getItem("authRole") || "";
  const deliveryActive = localStorage.getItem("deliveryActive") === "1";

  // 1) Order related (place order / checkout)
  // Add data-role="order-action" to buttons/sections you want blocked while courier
  root.querySelectorAll('[data-role="order-action"]').forEach((el) => {
    const blocked = state === "courier" && deliveryActive;
    if ("disabled" in el) el.disabled = blocked;
    el.style.pointerEvents = blocked ? "none" : "";
    el.style.opacity = blocked ? "0.5" : "";
    el.title = blocked ? "Хүргэлт хийж байх үед захиалга өгөх боломжгүй" : "";
  });

  // 2) Courier accept related (accept offer buttons etc.)
  // Add data-role="courier-action" to accept buttons you want blocked while customer
  root.querySelectorAll('[data-role="courier-action"]').forEach((el) => {
    const blocked = role !== "courier";
    if ("disabled" in el) el.disabled = blocked;
    el.style.pointerEvents = blocked ? "none" : "";
    el.style.opacity = blocked ? "0.5" : "";
    el.title = blocked ? "Хүргэгчээр нэвтэрсний дараа хүргэлт авах боломжтой" : "";
  });

  // 3) Optional: hide/show whole sections
  // data-show-in="guest|customer|courier"   (comma allowed)
  root.querySelectorAll("[data-show-in]").forEach((el) => {
    const allowed = String(el.getAttribute("data-show-in") || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    el.style.display = allowed.includes(state) ? "" : "none";
  });

  // 4) Optional: tiny badge somewhere
  root.querySelectorAll("[data-appstate-label]").forEach((el) => {
    el.textContent = state.toUpperCase();
  });

  return state;
}

// Auto re-apply when state changes
window.addEventListener("app-state-changed", () => applyStateUI(document));
window.addEventListener("DOMContentLoaded", () => applyStateUI(document));
