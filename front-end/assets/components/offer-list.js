import { apiFetch } from "../api_client.js";
import "./offer-card.js";
import { formatPrice, formatMetaFromDate } from "../helper/format-d-ts-p.js";
import { escapeAttr } from "../helper/escape-attr.js";
import { getDeliveryIcon } from "../helper/delivery-icon.js";

class OffersList extends HTMLElement {
  
  connectedCallback() {
    if (this._ready) return;
    this._ready = true;
    this._loaded = false;
    
    this.handleRouteChange = () => { this.onRouteChange();};
    this.renderList();

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

  renderList() {
    this.innerHTML = `
      <section class="offers-container">
        <div class="offers-row"></div>
      </section>
    `;
  }

  set items(offersArray) {
    this.renderItems(offersArray);
  }

  renderItems(offersArray) {
    const rowElement = this.querySelector(".offers-row");
    
    if (!rowElement) return;
 
    rowElement.innerHTML = offersArray.map(createOfferCardHTML).join("");
  }

  handleOfferSelect(event) {
    const modal = document.querySelector("offer-modal");
    if (!modal) {
      console.warn('offer-modal олдсонгүй');
      return;
    }
    
    modal.show(event.detail);
  }

  onRouteChange() {
    const currentHash = location.hash;
    
    if (currentHash !== "#home" && currentHash !== "") return;

    if (this._loaded === true) return;
    this._loaded = true;
    
    const localOffers = readLocalOffers();
    this.renderItems(localOffers);
    
    loadOffers();
  }
}

if (!customElements.get("offers-list")) {
  customElements.define("offers-list", OffersList);
}

function createOfferCardHTML(offer) {
  const thumbnailImage = offer.thumb || "assets/img/document.svg";
  const offerTitle = offer.title || "";
  const offerMeta = offer.meta || "";
  const offerPrice = offer.price || "";
  const orderId = offer.orderId || offer.id || "";
  const subItemsJSON = escapeAttr(JSON.stringify(offer.sub || []));
  const customerJSON = escapeAttr(JSON.stringify(offer.customer || {}));

  return `
    <offer-card
      thumb="${thumbnailImage}"
      title="${offerTitle}"
      meta="${offerMeta}"
      sub="${subItemsJSON}"
      price="${offerPrice}"
      order-id="${orderId}"
      customer="${customerJSON}">
    </offer-card>
  `;
}

function parseMetaDateString(metaString) {
  try {
    const parts = String(metaString).split("•");
    const [datePart, timePart] = parts;
    
    const [month, day, year] = datePart.split("/");

    const [hours, minutes] = timePart.split(":");

    const fullYear = 2000 + Number.parseInt(year, 10);

    return new Date(
      fullYear,
      Number(month) - 1, 
      Number(day),
      Number(hours),
      Number(minutes)
    );
  } catch (error) {
  }
}

function getOrderTimestamp(order) {
  const rawDate = order?.scheduled_at;
  
  if (!rawDate) return null;

  const parsedDate = Date.parse(rawDate);
  if (!isNaN(parsedDate)) return parsedDate;

  const metaDate = parseMetaDateString(rawDate);
  if (metaDate) return metaDate.getTime();

  return null;
}

function isOrderExpired(order) {
  const timestamp = getOrderTimestamp(order);
  
  if (!timestamp) return true; 
  
  return timestamp < Date.now();
}

function buildOrderTitle(order) {
  const fromLocation = order?.from_name || "";
  const toLocation = order?.to_name || "";
  
  return [fromLocation, toLocation]
    .filter(location => location !== "")
    .join(" - ");
}

function convertOrdersToOffers(ordersArray) {
  
  return ordersArray
    .filter((order) => {
      const orderStatus = order?.status;
      
      if (orderStatus === "delivered" || orderStatus === "cancelled") {
        return false;
      }

      if (order?.courier) {
        return false;
      }

      return !isOrderExpired(order);
    })
    .map((order) => {
      const orderItems = order?.items || [];
      
      const totalQuantity = orderItems.reduce(
        (sum, item) => sum + (item?.qty ?? 0), 
        0
      );
      
      const subItems = orderItems.map((item) => ({
        name: `${item?.name || 'Бараа'} x${item?.qty || 1}`,
      }));

      const timestamp = getOrderTimestamp(order);
  
      return {
        orderId: order?.id || "",
        title: buildOrderTitle(order),
        meta: formatMetaFromDate(timestamp),
        price: formatPrice(order?.total_amount),
        thumb: getDeliveryIcon(totalQuantity),
        customer: order?.customer,
        sub: subItems,
      };
    });
}


async function fetchOffersFromServer() {
  try {
    const response = await apiFetch("/api/orders");
    
    if (!response.ok) {
      console.error('Саналууд татахад алдаа:', response.status);
      return [];
    }
    
    const ordersData = await response.json();
    return convertOrdersToOffers(ordersData);
    
  } catch (error) {
  }
}

function readLocalOffers() {
  const offersJSON = localStorage.getItem("offers");
  
  if (!offersJSON) return [];
  
  try {
    return JSON.parse(offersJSON) || [];
  } catch (error) {
  }
}

function getRemovedStorageKey(baseKey) {
  const authKey = localStorage.getItem("authUserKey");
  return authKey ? `${baseKey}:${authKey}` : baseKey;
}

function readRemovedOfferIds() {
  const storageKey = getRemovedStorageKey("removed_offer_ids");
  const removedIdsJSON = localStorage.getItem(storageKey);
  
  if (!removedIdsJSON) return [];
  
  try {
    return JSON.parse(removedIdsJSON) || [];
  } catch (error) {
  }
}

function filterRemovedOffers(offersArray) {
  const removedIds = readRemovedOfferIds();
  
  if (!removedIds.length) return offersArray;

  return offersArray.filter((offer) => {
    const offerId = offer?.orderId ?? offer?.id ?? null;
    
    if (!offerId) return true;
    
    return !removedIds.includes(String(offerId));
  });
}

function filterExpiredOffers(offersArray) {
  return offersArray.filter((offer) => {
    if (!offer?.meta) return true;

    const offerDate = parseMetaDateString(offer.meta);
    
    if (!offerDate) return true;

    return offerDate.getTime() >= Date.now();
  });
}

async function loadOffers() {
  
  let offersArray = [];

  try {
    offersArray = await fetchOffersFromServer();
  } catch (error) {
  }
  
  offersArray = filterExpiredOffers(offersArray);

  offersArray = filterRemovedOffers(offersArray);

  localStorage.setItem("offers", JSON.stringify(offersArray));

  document.querySelectorAll("offers-list").forEach((listElement) => {
    listElement.items = offersArray;
  });
  
}

export { OffersList };