import { escapeAttr } from "../helper/escape-attr.js";

class DeliveryPage extends HTMLElement {
  constructor() {
    super();
    this.handleRouteChange = this.handleRouteChange.bind(this);
    this.applyActiveOrderBound = this.applyActiveOrder.bind(this);
    this.renderDeliveryCartBound = this.renderDeliveryCart.bind(this);
    this._initialized = false;
  }
  connectedCallback() {
    window.addEventListener('hashchange', this.handleRouteChange);
    this.handleRouteChange();
  }

  disconnectedCallback() {
    window.removeEventListener('hashchange', this.handleRouteChange);
    window.removeEventListener('order-updated', this.applyActiveOrderBound);
    window.removeEventListener('delivery-cart-updated', this.renderDeliveryCartBound);
  }

  handleRouteChange() {
    if (location.hash !== '#delivery') return;

    const loggedIn = localStorage.getItem("authLoggedIn");
    const role = localStorage.getItem("authRole");
    const paid = localStorage.getItem("courierPaid");

    if (loggedIn !== "1") {
      location.hash = "#login";
      return;
    }
    if (role !== "courier") {
      location.hash = "#home";
      return;
    }
    if (paid !== "1") {
      location.hash = "#pay";
      return;
    }

    if (!this._initialized) {
      this.render();
      window.addEventListener('order-updated', this.applyActiveOrderBound);
      window.addEventListener('delivery-cart-updated', this.renderDeliveryCartBound);
      this._initialized = true;
    }

    this.applyActiveOrder();
    this.renderDeliveryCart();
  }

  render() {
    this.innerHTML = `
      <div class="container">
        <section class="orders">
          <h2>Миний хүргэлт</h2>
          <div id="deliveryList" class="order-list"></div>
        </section>

        <section class="details">
          <del-order-details></del-order-details>
        </section>

        <section class="order-step">
          <h2>Захиалгын явц</h2>
          <del-order-progress></del-order-progress>
        </section>
      </div>
    `;
  }

  applyActiveOrder() {
    this.fetchActiveOrder();
  }

  async fetchActiveOrder() {
    try {
      const res = await fetch("/api/active-order");
      if (!res.ok) return;
      const data = await res.json();
      const order = data?.order;
      if (!order) return;
      const first = this.querySelector('d-orders[data-active="true"]');
      if (first && order.from && order.to) {
        first.setAttribute('header', `${order.from} → ${order.to}`);
        if (order.item) {
          first.setAttribute('detail', order.item);
        }
      }
    } catch (e) {
      // ignore
    }
  }

  renderDeliveryCart() {
    const listEl = this.querySelector('#deliveryList');
    if (!listEl) return;
    this.fetchDeliveryItems(listEl);
  }

  attachOrderSelection(items = []) {
    const orderElements = this.querySelectorAll('d-orders');
    if (!orderElements.length) return;

    const byId = new Map(
      items.map((item) => [String(item.id || ""), item])
    );

    orderElements.forEach(orderEl => {
      orderEl.addEventListener('click', () => {
        const itemId = orderEl.getAttribute('data-id');
        const payload = byId.get(String(itemId)) || null;
        this.selectOrder(payload, orderEl);
      });
    });

    const first = orderElements[0];
    const firstId = first?.getAttribute('data-id');
    const firstPayload = byId.get(String(firstId)) || null;
    if (firstPayload) {
      this.selectOrder(firstPayload, first);
    }
  }

  selectOrder(payload, activeEl) {
    if (!payload) return;
    this.querySelectorAll('d-orders').forEach((el) => {
      el.classList.toggle('is-active', el === activeEl);
    });
    const event = new CustomEvent('delivery-select', {
      detail: {
        ...payload,
        id: payload.orderId || payload.id || null,
        orderId: payload.orderId || null,
      },
    });
    document.dispatchEvent(event);
  }


  async fetchDeliveryItems(listEl) {
    let items = [];
    try {
      const res = await fetch("/api/delivery-cart");
      if (res.ok) {
        const data = await res.json();
        items = Array.isArray(data?.items) ? data.items : [];
      }
    } catch (e) {
      items = [];
    }

    if (!items.length) {
      listEl.innerHTML = '<p class="muted">Хүргэлт сонгоогүй байна.</p>';

      // ✅ details + progress доторхийг empty болгож үлдээнэ (section title үлдэнэ)
      const details = this.querySelector("del-order-details");
      const progress = this.querySelector("del-order-progress");
      if (details) details.setAttribute("data-empty", "1");
      if (progress) progress.setAttribute("data-empty", "1");

      return;
    }

    // ✅ items байгаа үед empty mode-г салгана
    const details = this.querySelector("del-order-details");
    const progress = this.querySelector("del-order-progress");
    if (details) details.removeAttribute("data-empty");
    if (progress) progress.removeAttribute("data-empty");


    const normalized = items.map((item) => {
      const qty = Number(item.qty || 1);
      const detailParts = [];
      if (item.meta) detailParts.push(item.meta);
      // console.log(item?.menuItemName);
      if (qty) detailParts.push(`x${qty}`);
      const detail = detailParts.join(' • ');

      const title = String(item.title || "");
      const parts = title.split(" - ");
      const from = parts[0] || title;
      const to = parts.slice(1).join(" - ");
      const orderId = item.order_id || null;

      return {
        ...item,
        detail,
        from,
        to,
        createdAt: item.meta || "",
        orderId,
      };
    });

    listEl.innerHTML = normalized.map((item) => `
        <d-orders
          data-id="${escapeAttr(item.id || '')}"
          data-order-id="${escapeAttr(item.orderId || '')}"
          data-from="${escapeAttr(item.from || '')}"
          data-to="${escapeAttr(item.to || '')}"
          data-created-at="${escapeAttr(item.createdAt || '')}"
          header="${escapeAttr(item.title || '')}"
          detail="${escapeAttr(item.detail || '')}">
        </d-orders>
      `).join('');

    this.attachOrderSelection(normalized);
  }
}

customElements.define('delivery-page', DeliveryPage);
