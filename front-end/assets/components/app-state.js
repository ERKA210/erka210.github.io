// assets/components/app-state.js
const KEY = "appState";
const VALID = new Set(["guest", "customer", "courier"]);

export function getState() {
  const v = localStorage.getItem(KEY);
  return VALID.has(v) ? v : "guest";
}

export function setState(state, reason = "") {
  const next = VALID.has(state) ? state : "guest";
  const prev = getState();
  localStorage.setItem(KEY, next);

  if (prev !== next) {
    window.dispatchEvent(
      new CustomEvent("app-state-changed", { detail: { prev, next, reason } })
    );
  }
  return next;
}

export async function resetToGuest(reason = "") {
  setState("guest", reason);
  localStorage.setItem("deliveryActive", "0");

  // active-order цэвэрлэх
  try {
    await fetch("/api/active-order", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ order: null }),
    });
  } catch {}

  // local step цэвэрлэх
  localStorage.removeItem("orderStep");

  // UI refresh
  window.dispatchEvent(new Event("order-updated"));
  window.dispatchEvent(new Event("delivery-cart-updated"));
}

// global shortcut (import хийхгүй ашиглахад)
window.NumAppState = { getState, setState, resetToGuest };
