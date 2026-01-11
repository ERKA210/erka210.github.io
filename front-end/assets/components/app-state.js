// assets/components/app-state.js
import { apiFetch } from "../api_client.js";
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
    await apiFetch("/api/active-order", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: null }),
    });
  } catch { }

  //  courier талын delivery steps устгах
  localStorage.removeItem("deliverySteps");

  //  courier delivery cart DB-ээс цэвэрлэх
  try {
    await apiFetch("/api/delivery-cart", {
      method: "DELETE",
    });
  } catch { }


  // local step цэвэрлэх
  localStorage.removeItem("orderStep");

  // UI refresh
  window.dispatchEvent(new Event("order-updated"));
  window.dispatchEvent(new Event("delivery-cart-updated"));
}

// global shortcut (import хийхгүй ашиглахад)
window.NumAppState = { getState, setState, resetToGuest };
