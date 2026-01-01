class OfferCard extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <article class="offer-card">
        <div class="offer-thumb">
          <img src="${this.getAttribute('thumb') || 'assets/img/box.svg'}" alt="icon"/>
        </div>
        <div class="offer-info">
          <div class="offer-title">${this.getAttribute('title') || ''}</div>
          <div class="offer-meta">${this.getAttribute('meta') || ''}</div>
        </div>
        <div class="offer-price">${this.getAttribute('price') || ''}</div>
      </article>
    `;
    this.addEventListener('click', () => {
      const modal = document.querySelector('offer-modal');
      const subRaw = this.getAttribute('sub');
      const orderId = this.getAttribute('order-id') || '';
      let sub = [];
        try {
          sub = JSON.parse(subRaw);  
        } catch (e) {
          sub = []; 
        }
      modal.show({
        thumb: this.getAttribute('thumb'),
        title: this.getAttribute('title'),
        meta: this.getAttribute('meta'),
        sub,
        price: this.getAttribute('price'),
        orderId
      });
    });
  }
}

customElements.define('offer-card', OfferCard);

class OffersList extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="offers-container">
        <div class="offers-row"></div>
      </section>
    `;
    this.handleOffersUpdated = () => loadOffers();
    loadOffers();
    window.addEventListener("offers-updated", this.handleOffersUpdated);
  }

  disconnectedCallback() {
    if (this.handleOffersUpdated) {
      window.removeEventListener("offers-updated", this.handleOffersUpdated);
    }
  }

  set items(list) {
    const row = this.querySelector('.offers-row');
    row.innerHTML = '';
    
    let content = '';
    list.forEach(item => {
      const thumb = item.thumb || 'assets/img/box.svg';
      const title = item.title || '';
      const meta = item.meta || '';
      const price = item.price || '';
      const orderId = item.orderId || item.id || '';
      content += `<offer-card thumb="${thumb}" title="${title}" meta="${meta}" sub='${JSON.stringify(item.sub || [])}' price="${price}" order-id="${orderId}"></offer-card>`;
    });
    row.innerHTML = content;
  }
}
customElements.define('offers-list', OffersList);

const API = "http://localhost:3000";
const deliveryIcons = {
  single: "assets/img/document.svg",
  medium: "assets/img/tor.svg",
  large: "assets/img/box.svg",
};

const seedOffers = [
  { 
    thumb: 'assets/img/box.svg', 
    title: 'GL burger - 7-р байр 207', 
    meta: '11/21/25 • 14:00', 
    price: '10,000₮', 
    sub: [
      { name: "Бууз", price: "5000₮" },
      { name: "Сүү", price: "2000₮" }
    ] 
  },
  { 
    thumb: 'assets/img/document.svg', 
    title: 'GL burger - 7-р байр 207', 
    meta: '11/21/25 • 14:00', 
    price: '10,000₮', 
    sub: [
      { name: "Бууз", price: "5000₮" },
      { name: "Сүү", price: "2000₮" }
    ] 
  },
  { 
    thumb: 'assets/img/tor.svg', 
    title: 'GL burger - 7-р байр 207', 
    meta: '11/21/25 • 14:00', 
    price: '10,000₮', 
    sub: [
      { name: "Бууз", price: "5000₮" },
      { name: "Сүү", price: "2000₮" }
    ] 
  },
  { 
    thumb: 'assets/img/tor.svg', 
    title: 'GL burger - 7-р байр 207', 
    meta: '12/31/25 • 22:20', 
    price: '10,000₮', 
    sub: [
      { name: "Бууз", price: "5000₮" },
      { name: "Сүү", price: "2000₮" }
    ] 
  },
];

function formatMetaFromDate(ts) {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "";
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${mm}/${dd}/${yy} • ${hh}:${min}`;
}

function parseMetaDate(metaString) {
  try {
    const parts = metaString.split('•');
    if (parts.length < 2) return null;
    
    const datePart = parts[0].trim();
    const timePart = parts[1].trim();
    
    const [month, day, year] = datePart.split('/');
    const [hours, minutes] = timePart.split(':');
    const fullYear = 2000 + parseInt(year, 10);
    
    return new Date(fullYear, month - 1, day, hours, minutes);
  } catch (e) {
    console.error('Error parsing date from meta:', e, metaString);
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
  if (totalQty > 10) return deliveryIcons.large;
  if (totalQty >= 2) return deliveryIcons.medium;
  if (totalQty === 1) return deliveryIcons.single;
  return deliveryIcons.large;
}

function mapOrdersToOffers(orders) {
  return orders
    .filter((order) => {
      const status = String(order?.status || "").toLowerCase();
      if (status === "delivered") return false;
      if (order?.courier) return false;
      return !isOrderExpired(order);
    })
    .map((order) => {
      const ts = parseOrderTimestamp(order);
      const meta = ts ? formatMetaFromDate(ts) : "";
      const items = Array.isArray(order?.items) ? order.items : [];
      const totalQty = items.reduce((sum, it) => sum + (Number(it?.qty) || 0), 0);
      return {
        orderId: order.id,
        title: `${order.from_name || ""} - ${order.to_name || ""}`.trim(),
        meta,
        price: formatPrice(order.total_amount || 0),
        thumb: getDeliveryIcon(totalQty),
        sub: items.map((it) => ({
          name: `${it.name || ""} x${it.qty || 1}`.trim(),
          price: "",
        })),
      };
    });
}

async function fetchOffersFromApi() {
  const res = await fetch(`${API}/api/orders`);
  const data = await res.json().catch(() => []);
  if (!res.ok) {
    throw new Error(data?.error || "Failed to load orders");
  }
  if (!Array.isArray(data)) return [];
  return mapOrdersToOffers(data);
}

function readLocalOffers() {
  const raw = localStorage.getItem('offers');
  if (!raw) return [];
  try {
    return JSON.parse(raw) || [];
  } catch (e) {
    return [];
  }
}

async function loadOffers() {
  let offers = [];
  try {
    offers = await fetchOffersFromApi();
    if (offers.length) {
      localStorage.setItem('offers', JSON.stringify(offers));
    }
  } catch (e) {
    offers = readLocalOffers();
  }

  if (!Array.isArray(offers) || offers.length === 0) {
    offers = seedOffers;
    localStorage.setItem('offers', JSON.stringify(offers));
  } else {
    const nonExpiredOffers = offers.filter((offer) => {
      if (!offer.meta) return true;
      const parsed = parseMetaDate(offer.meta);
      if (!parsed) return true;
      return parsed.getTime() >= Date.now();
    });
    if (nonExpiredOffers.length !== offers.length) {
      offers = nonExpiredOffers;
      localStorage.setItem('offers', JSON.stringify(offers));
    }
  }

  const lists = document.querySelectorAll("offers-list");
  lists.forEach((list) => {
    list.items = offers;
  });
}
