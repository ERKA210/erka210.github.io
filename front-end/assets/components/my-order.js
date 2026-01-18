import { escapeHtml } from "../helper/escape-html.js";
import { getDeliveryIcon } from "../helper/delivery-icon.js";
import { formatPrice, formatMetaFromDate } from "../helper/format-d-ts-p.js";

class MyOrder extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <div class="order-list" id="orderList">
          <p class="muted">Захиалга ачааллаж байна...</p>
        </div>
    `;
  }

  showLoading() {
    const listEl = this.querySelector("#orderList");
    if (listEl) {
      listEl.innerHTML = `<p class="muted">Захиалга ачааллаж байна...</p>`;
    }
  }

  showEmpty() {
    const listEl = this.querySelector("#orderList");
    if (listEl) {
      listEl.innerHTML = `<p class="muted">Захиалга алга.</p>`;
    }
  }

  renderOrders(orders) {
    const listEl = this.querySelector("#orderList");
    if (!listEl) return;

    if (!orders.length) {
      this.showEmpty();
      return;
    }

    listEl.innerHTML = orders.map((o) => this.renderOrderCard(o)).join("");
  }

  renderOrderCard(order) {
    const ts = this.parseOrderTimestamp(order) || Date.now();
    const meta = formatMetaFromDate(ts);
    const items = order.items;
    const itemsTxt = items.map(it => `${it.name} ×${it.qty}`).join(" · ");
    const totalQty = items.reduce((sum, it) => sum + (Number(it?.qty) || 0), 0);
    const iconSrc = this.getOfferThumb(order?.id) || getDeliveryIcon(totalQty);

    return `
      <div class="order-card" data-order='${(JSON.stringify(order))}'>
        <div class="order-info">
          <h3 class="order-title">${escapeHtml(order.from_name || "")} - ${escapeHtml(order.to_name || "")}</h3>
          <h4>${escapeHtml(meta)}</h4>
          <p>${escapeHtml(itemsTxt || "Бараа байхгүй")}</p>
          <p class="order-total">Дүн: ${formatPrice(order.total_amount || 0)}</p>
        </div>
        <img src="${iconSrc}" alt="hemjee" width="57" height="57" decoding="async">
      </div>
    `;
  }

  parseOrderTimestamp(order) {
    return this.parseDate(order.scheduled_at);
  }

    parseDate(val) {
    const parsed = Date.parse(val);
    return Number.isNaN(parsed) ? null : parsed;
    }

  getOfferThumb(orderId) {
    if (!orderId) return "";
    try {
      const raw = localStorage.getItem("offers");
      const offers = raw ? JSON.parse(raw) : [];
      const match = Array.isArray(offers) ? offers.find((o) => (o?.orderId || o?.id) === orderId) : null;
      return match?.thumb || "";
    } catch {
      return "";
    }
  }
}

customElements.define("my-order", MyOrder);