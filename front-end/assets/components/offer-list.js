import { apiFetch } from "../api_client.js";
import "./offer-card.js";

class OffersList extends HTMLElement {
  connectedCallback() {
    if (this._ready) return;
    this._ready = true;
    this.render();

    this.handleOffersUpdated = () => loadOffers();
    window.addEventListener("offers-updated", this.handleOffersUpdated);
    this.addEventListener("offer-select", this.handleOfferSelect);

    loadOffers();
  }

  disconnectedCallback() {
    if (this.handleOffersUpdated) {
      window.removeEventListener("offers-updated", this.handleOffersUpdated);
    }
    this.removeEventListener("offer-select", this.handleOfferSelect);
  }

  render() {
    this.innerHTML = `
      <section class="offers-container">
        <div class="offers-row"></div>
      </section>
    `;
  }

  set items(list) {
    this.renderItems(list);
  }

  renderItems(list) {
    const row = this.querySelector(".offers-row");
    if (!row) return;
    const items = Array.isArray(list) ? list : [];
    row.innerHTML = items.map(renderOfferCard).join("");
  }

  handleOfferSelect(event) {
    const modal = document.querySelector("offer-modal");
    if (!modal || typeof modal.show !== "function") return;
    modal.show(event.detail);
  }
}

if (!customElements.get("offers-list")) {
  customElements.define("offers-list", OffersList);
}

const DELIVERY_ICONS = {
  single: "assets/img/document.svg",
  medium: "assets/img/tor.svg",
  large: "assets/img/box.svg",
};

const SEED_OFFERS = [
  {
    thumb: "assets/img/box.svg",
    title: "GL burger - 7-р байр 207",
    meta: "11/21/25 • 14:00",
    price: "10,000₮",
    sub: [
      { name: "Бууз", price: "5000₮" },
      { name: "Сүү", price: "2000₮" },
    ],
  },
  {
    thumb: "assets/img/document.svg",
    title: "GL burger - 7-р байр 207",
    meta: "11/21/25 • 14:00",
    price: "10,000₮",
    sub: [
      { name: "Бууз", price: "5000₮" },
      { name: "Сүү", price: "2000₮" },
    ],
  },
  {
    thumb: "assets/img/tor.svg",
    title: "GL burger - 7-р байр 207",
    meta: "11/21/25 • 14:00",
    price: "10,000₮",
    sub: [
      { name: "Бууз", price: "5000₮" },
      { name: "Сүү", price: "2000₮" },
    ],
  },
  {
    thumb: "assets/img/tor.svg",
    title: "GL burger - 7-р байр 207",
    meta: "12/31/25 • 22:20",
    price: "10,000₮",
    sub: [
      { name: "Бууз", price: "5000₮" },
      { name: "Сүү", price: "2000₮" },
    ],
  },
];

function renderOfferCard(item) {
  const thumb = escapeAttr(item.thumb || "assets/img/box.svg");
  const title = escapeAttr(item.title || "");
  const meta = escapeAttr(item.meta || "");
  const price = escapeAttr(item.price || "");
  const orderId = escapeAttr(item.orderId || item.id || "");
  const sub = encodeURIComponent(JSON.stringify(item.sub || []));
  const customer = encodeURIComponent(JSON.stringify(item.customer || {}));

  return `
    <offer-card
      thumb="${thumb}"
      title="${title}"
      meta="${meta}"
      sub="${sub}"
      price="${price}"
      order-id="${orderId}"
      customer="${customer}">
    </offer-card>
  `;
}

function escapeAttr(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function formatMetaFromDate(ts) {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "";
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${mm}/${dd}/${yy}  •${hh}:${min}`;
}

function parseMetaDate(metaString) {
  try {
    const parts = metaString.split("•");
    if (parts.length < 2) return null;

    const datePart = parts[0].trim();
    const timePart = parts[1].trim();
    const [month, day, year] = datePart.split("/");
    const [hours, minutes] = timePart.split(":");
    const fullYear = 2000 + Number.parseInt(year, 10);

    return new Date(fullYear, month - 1, day, hours, minutes);
  } catch (e) {
    console.error("Error parsing date from meta:", e, metaString);
    return null;
  }
}

function parseOrderTimestamp(order) {
  const raw =
    order?.scheduled_at ||
    order?.scheduledAt ||
    order?.created_at ||
    order?.createdAt ||
    order?.meta ||
    null;
  if (!raw) return null;
  const parsed = Date.parse(raw);
  if (!Number.isNaN(parsed)) return parsed;
  if (typeof raw === "string") {
    const metaDate = parseMetaDate(raw);
    if (metaDate) return metaDate.getTime();
  }
  return null;
}

function isOrderExpired(order) {
  const ts = parseOrderTimestamp(order);
  if (!ts) return true;
  return ts < Date.now();
}

function formatPrice(amount) {
  return Number(amount || 0).toLocaleString("mn-MN") + "₮";
}

function getDeliveryIcon(totalQty) {
  if (totalQty > 10) return DELIVERY_ICONS.large;
  if (totalQty >= 2) return DELIVERY_ICONS.medium;
  if (totalQty === 1) return DELIVERY_ICONS.single;
  return DELIVERY_ICONS.large;
}

function mapOrdersToOffers(orders) {
  return orders
    .filter((order) => {
      const status = String(order?.status || "").toLowerCase();
      if (status === "delivered" || status === "cancelled" || status === "canceled") return false;
      if (order?.courier) return false;
      return !isOrderExpired(order);
    })
    .map((order) => {
      const ts = parseOrderTimestamp(order);
      const meta = ts ? formatMetaFromDate(ts) : "";
      const items = Array.isArray(order?.items) ? order.items : [];
      const totalQty = items.reduce((sum, it) => sum + (Number(it?.qty) || 0), 0);
      const customer = order?.customer || {};
      return {
        orderId: order.id,
        title: `${order.from_name || ""} - ${order.to_name || ""}`.trim(),
        meta,
        price: formatPrice(order.total_amount || 0),
        thumb: getDeliveryIcon(totalQty),
        customer,
        sub: items.map((it) => ({
          name: `${it.name || ""} x${it.qty || 1}`.trim(),
          price: "",
        })),
      };
    });
}

async function fetchOffersFromApi() {
  const res = await apiFetch("/api/orders");
  const data = await res.json().catch(() => []);
  if (!res.ok) {
    throw new Error(data?.error || "Failed to load orders");
  }
  if (!Array.isArray(data)) return [];
  return mapOrdersToOffers(data);
}

function readLocalOffers() {
  const raw = localStorage.getItem("offers");
  if (!raw) return [];
  try {
    return JSON.parse(raw) || [];
  } catch {
    return [];
  }
}

function getRemovedStorageKey(baseKey) {
  const authKey = localStorage.getItem("authUserKey");
  return authKey ? `${baseKey}:${authKey}` : baseKey;
}

function readRemovedOfferIds() {
  const raw = localStorage.getItem(getRemovedStorageKey("removed_offer_ids"));
  if (!raw) return [];
  try {
    return JSON.parse(raw) || [];
  } catch {
    return [];
  }
}

function readRemovedOfferKeys() {
  const raw = localStorage.getItem(getRemovedStorageKey("removed_offer_keys"));
  if (!raw) return [];
  try {
    return JSON.parse(raw) || [];
  } catch {
    return [];
  }
}

function filterRemovedOffers(offers) {
  const removedIds = readRemovedOfferIds();
  const removedKeys = readRemovedOfferKeys();
  if (!removedIds.length && !removedKeys.length) return offers;
  return offers.filter((offer) => {
    const offerId = offer?.orderId || offer?.id || null;
    if (offerId && removedIds.includes(String(offerId))) return false;
    const key = `${offer?.title || ""}|${offer?.meta || ""}|${offer?.price || ""}`;
    return !removedKeys.includes(key);
  });
}

function filterExpiredOffers(offers) {
  return offers.filter((offer) => {
    if (!offer.meta) return true;
    const parsed = parseMetaDate(offer.meta);
    if (!parsed) return true;
    return parsed.getTime() >= Date.now();
  });
}

async function loadOffers() {
  let offers = [];
  try {
    offers = await fetchOffersFromApi();
    offers = filterRemovedOffers(offers);
    if (offers.length) {
      localStorage.setItem("offers", JSON.stringify(offers));
    }
  } catch {
    offers = filterRemovedOffers(readLocalOffers());
  }

  if (!offers.length) {
    offers = SEED_OFFERS;
  } else {
    offers = filterExpiredOffers(offers);
  }

  offers = filterRemovedOffers(offers);
  localStorage.setItem("offers", JSON.stringify(offers));

  document.querySelectorAll("offers-list").forEach((list) => {
    list.items = offers;
  });
}

export { OffersList };
