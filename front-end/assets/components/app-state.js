import { apiFetch } from "../api_client.js";

const KEY = "appState";
const VALID = new Set(["guest", "customer", "courier"]);

export function getState() {
  const v = localStorage.getItem(KEY);
  return VALID.has(v) ? v : "guest";
}

export function setState(state) {
  const next = VALID.has(state) ? state : "guest";
  const prev = getState();

  localStorage.setItem(KEY, next);

  if (prev !== next) {
    window.dispatchEvent(
      new CustomEvent("app-state-changed", { detail: { prev, next } })
    );
  }

  return next;
}

export async function logout() {
  setState("guest");
  localStorage.setItem("deliveryActive", "0");

  try {
    await apiFetch("/api/active-order", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: null }),
    });
  } catch {}

  localStorage.removeItem("deliverySteps");

  try {
    await apiFetch("/api/delivery-cart", { method: "DELETE" });
  } catch {}

  localStorage.removeItem("orderStep");

  window.dispatchEvent(new Event("order-updated"));
  window.dispatchEvent(new Event("delivery-cart-updated"));
}

window.NumAppState = { getState, setState, logout };