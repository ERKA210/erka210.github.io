class DeliveryPage extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
    this.applyActiveOrder();
    this.renderDeliveryCart();
    const loggedIn = localStorage.getItem("authLoggedIn");
    const role = localStorage.getItem("authRole");
    const paid = localStorage.getItem("courierPaid");

    if (loggedIn !== "1" || role !== "courier" || paid !== "1") {
      location.hash = "#login";
      return;
    }
    this.handleRouteChange = this.handleRouteChange.bind(this);
    this.applyActiveOrderBound = this.applyActiveOrder.bind(this);
    this.renderDeliveryCartBound = this.renderDeliveryCart.bind(this);
    window.addEventListener('hashchange', this.handleRouteChange);
    window.addEventListener('order-updated', this.applyActiveOrderBound);
    window.addEventListener('delivery-cart-updated', this.renderDeliveryCartBound);
  }

  disconnectedCallback() {
    window.removeEventListener('hashchange', this.handleRouteChange);
    window.removeEventListener('order-updated', this.applyActiveOrderBound);
    window.removeEventListener('delivery-cart-updated', this.renderDeliveryCartBound);
  }

  handleRouteChange() {
    if (location.hash === '#delivery') {
      this.applyActiveOrder();
      this.renderDeliveryCart();
    }
  }

  render() {
    this.innerHTML = `
    <link rel="stylesheet" href="assets/css/delivery.css">
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

  escapeAttr(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
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
      return;
    }

    listEl.innerHTML = items.map((item) => {
      const qty = Number(item.qty || 1);
      const detailParts = [];
      if (item.meta) detailParts.push(item.meta);
      if (qty) detailParts.push(`x${qty}`);
      const detail = detailParts.join(' • ');
      return `
        <d-orders header="${this.escapeAttr(item.title || '')}"
                  detail="${this.escapeAttr(detail)}"></d-orders>
      `;
    }).join('');
  }
}

customElements.define('delivery-page', DeliveryPage);
