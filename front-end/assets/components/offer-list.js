import { apiFetch } from "../api_client.js";
import "./offer-card.js";
import { formatPrice, formatMetaFromDate } from "./format-d-ts-p.js";
import { escapeAttr } from "./escape-attr.js";

class OffersList extends HTMLElement {
  connectedCallback() {
    if (this._ready) return;
    this._ready = true;
    this._loaded = false;
    this.handleRouteChange = this.handleRouteChange?.bind(this) || (() => this.onRouteChange());
    this.render();

    this.handleOffersUpdated = () => loadOffers();
    window.addEventListener("offers-updated", this.handleOffersUpdated);
    window.addEventListener("hashchange", this.handleRouteChange);
    this.addEventListener("offer-select", this.handleOfferSelect);

    this.handleRouteChange();
  }

  disconnectedCallback() {
    if (this.handleOffersUpdated) {
      window.removeEventListener("offers-updated", this.handleOffersUpdated);
    }
    window.removeEventListener("hashchange", this.handleRouteChange);
    this.removeEventListener("offer-select", this.handleOfferSelect);
  }

  render() {
    this.innerHTML = `
      <section class="offers-container">
        <div class="offers-row"></div>
      </section>
    `;
  }

  set items(items) {
    this.renderItems(items);
  }

  renderItems(items) {
    const row = this.querySelector(".offers-row");
    row.innerHTML = items.map(renderOfferCard).join("");
  }

  handleOfferSelect(event) {
    const modal = document.querySelector("offer-modal");
    if (!modal) return;
    modal.show(event.detail);
  }

  onRouteChange() {
    if (location.hash !== "#home" && location.hash !== "") return;
    if (this._loaded === true) return;
    this._loaded = true;
    //localstorage dahi offer local object n
    const local = readLocalOffers();
    // console.log("local offers", local);
    this.renderItems(local);
    loadOffers();
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
  const thumb = item.thumb || "assets/img/document.svg";
  const title = item.title || "";
  const meta = item.meta || "";
  const price = item.price || "";
  const orderId = item.orderId || item.id || "";
  const sub = escapeAttr(JSON.stringify(item.sub || []));
  const customer = escapeAttr(JSON.stringify(item.customer || {}));
  // console.log("rendering offer card", item);

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


function parseMetaDate(metaString) {
  try {
    const parts = String(metaString).split("•");

    // console.log("parsing meta date", metaString, parts);

    const [datePart, timePart] = parts;
    const [month, day, year] = datePart.split("/");
    const [hours, minutes] = timePart.split(":");
    const fullYear = 2000 + Number.parseInt(year, 10);


    return new Date(fullYear, Number(month) - 1, Number(day), Number(hours), Number(minutes));
  } catch (e) {
    console.error("date error shu:", e, metaString);
  }
}

function parseOrderTimestamp(order) {
  const raw =order?.scheduled_at;
  if (!raw) return null;

  const parsed = Date.parse(raw);
  if (!isNaN(parsed)) return parsed;

  const metaDate = parseMetaDate(raw);
  if (metaDate) return metaDate.getTime();

  return null;
}

function isOrderExpired(order) {
  const ts = parseOrderTimestamp(order);
  if (!ts) return true;
  return ts < Date.now();
}

function getDeliveryIcon(totalQty) {
  if (totalQty > 5) return DELIVERY_ICONS.large;
  if (totalQty >= 2) return DELIVERY_ICONS.medium;
  if (totalQty === 1) return DELIVERY_ICONS.single;
  return DELIVERY_ICONS.large;
}

function buildOrderTitle(order) {
  const from = order?.from_name || "";
  const to = order?.to_name || "";
  return [from, to].filter(v => v !== "").join(" - ");
}

function mapOrdersToOffers(orders) {
  const list = orders;
  // console.log(list, "ll")

  return list
    .filter((order) => {
     const status = order?.status;
    // console.log(status, "ss")
      if (status === "delivered" || status === "cancelled") return false;
      if (order?.courier) return false;
      return !isOrderExpired(order);
    })
    .map((order) => {
      
      const items = order?.items;
      const totalQty = items.reduce((sum, it) => sum + (it?.qty??0), 0);
      // console.log("qty too bnu", totalQty); 
      const sub = items.map((it) => ({
        name: `${it?.name} x${it?.qty}`,
      }));

      const ts = parseOrderTimestamp(order);
  
      return {
        orderId: order?.id || "",
        title: buildOrderTitle(order),
        meta: formatMetaFromDate(ts),
        price: formatPrice(order?.total_amount),
        thumb: getDeliveryIcon(totalQty),
        customer: order?.customer,
        sub,
      };
    });
}

async function fetchOffersFromApi() {
  const res = await apiFetch("/api/orders");
  if (!res.ok) return [];
  const data = await res.json();
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
    if (!offer?.meta) return true;
    const parsed = parseMetaDate(offer.meta);
    if (!parsed) return true;
    return parsed.getTime() >= Date.now();
  });
}

async function loadOffers() {
  let offers = [];
  try {
    offers = await fetchOffersFromApi();
  } catch {
    offers = readLocalOffers();
  }

  if (!offers.length) offers = SEED_OFFERS;

  offers = filterExpiredOffers(offers);
  offers = filterRemovedOffers(offers);
  localStorage.setItem("offers", JSON.stringify(offers));

  document.querySelectorAll("offers-list").forEach((list) => {
    list.items = offers;
  });
}

export { OffersList };
