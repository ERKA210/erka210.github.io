import { apiFetch, API } from "../api_client.js";
import "../components/my-order.js";

class OrdersPage extends HTMLElement {
  connectedCallback() {
    this._initialized = false;
    this.selectedOrder = null;
    this.handleRouteChange = this.handleRouteChange?.bind(this) || (() => this.onRouteChange());
    window.addEventListener("hashchange", this.handleRouteChange);
    this.handleRouteChange();
  }

  onRouteChange() {
    if (location.hash !== "#orders") {
      this.cleanup();
      return;
    }

    this.selectedOrder = null;
    if (!this._initialized) {
      this.render();
      this.bindOrderCardClicks();
      this._initialized = true;
    }
    this.loadOrders();
    this.initOrderStream();
    this.bindRatingComplete();
  }

  disconnectedCallback() {
    window.removeEventListener("hashchange", this.handleRouteChange);
    this.cleanup();
  }

  cleanup() {
    if (this.handleRatingComplete) {
      window.removeEventListener("rating-completed", this.handleRatingComplete);
    }

    if (this.orderStream) {
      if (this.handleOrderStatusEvent) {
        this.orderStream.removeEventListener("order-status", this.handleOrderStatusEvent);
      }
      if (this.handleOrderUpdatedEvent) {
        this.orderStream.removeEventListener("order-updated", this.handleOrderUpdatedEvent);
      }
      this.orderStream.close();
      this.orderStream = null;
    }
  }

  render() {
    this.innerHTML = `
      <main class="container">
        <section class="order-side">
        <section class="orders">
          <h2>Миний захиалга</h2>
            <my-order></my-order>
        </section>

          <section class="delivery-info">
            <courier-card id="courierBox"></courier-card>
          </section>
        </section>

        <section class="details">
          <h2>Захиалгын явц</h2>
          <order-progress></order-progress>

          <rating-modal></rating-modal>
        </section>
      </main>
    `;
  }

  async loadOrders() {
    const myOrder = this.querySelector("my-order");
    if (!myOrder) return;

    myOrder.showLoading();

    const userId = await this.getUserId();
    if (!userId) {
      location.hash = "#login";
      return;
    }

    const qs = `?customerId=${encodeURIComponent(userId)}`;

    try {
      const res = await apiFetch(`/api/orders${qs}`);
      const data = await res.json().catch(() => []);
      if (!res.ok) throw new Error(data?.error || "Алдаа");

      const filtered = this.filterExpired(Array.isArray(data) ? data : []);
      const notRated = filtered.filter((o) => !this.isOrderRated(o.id));

      if (Array.isArray(data) && data.length > 0 && filtered.length === 0) {
        window.NumAppState?.logout("order_expired");
      }

      myOrder.renderOrders(notRated);

      // Эхний захиалгыг автоматаар сонгох
      if (notRated.length > 0) {
        this.selectOrder(notRated[0]);
      } else {
        this.selectOrder(null);
      }
    } catch (e) {
      myOrder.showError(e.message);
    }
  }

  async getUserId() {
    try {
      const res = await apiFetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        return data?.user?.id || "";
      }
    } catch {}
    return "";
  }

  filterExpired(orders) {
    return orders.filter((o) => {
      const myOrder = this.querySelector("my-order");
      if (!myOrder) return false;
      const ts = myOrder.parseOrderTimestamp(o);
      return ts !== null && ts >= Date.now();
    });
  }

  isOrderRated(orderId) {
    try {
      const arr = JSON.parse(localStorage.getItem("ratedOrders") || "[]");
      return arr.map(String).includes(String(orderId));
    } catch {
      return false;
    }
  }

  selectOrder(order) {
    this.selectedOrder = order;
    document.dispatchEvent(new CustomEvent("order-select", { detail: order }));
    this.loadCourierForOrder(order);
  }

  bindOrderCardClicks() {
    const myOrder = this.querySelector("my-order");
    if (!myOrder) return;

    myOrder.addEventListener("click", (e) => {
      const card = e.target.closest(".order-card");
      if (!card) return;

      const raw = card.getAttribute("data-order");
      if (!raw) return;

      const order = JSON.parse(decodeURIComponent(raw));
      this.selectOrder(order);
    });
  }

  async loadCourierForOrder(order) {
    const box = this.querySelector("#courierBox");
    if (!box) return;

    if (!order) {
      box.setEmpty?.();
      return;
    }

    const courier = order?.courier || null;
    if (!courier) {
      box.setEmpty?.();
      return;
    }

    try {
      const meRes = await apiFetch("/api/auth/me");
      if (meRes.ok) {
        const { user } = await meRes.json();
        if (user && courier && String(user.id) === String(courier.id)) {
          box.setEmpty?.();
          return;
        }
      }
    } catch {}

    box.setData?.(courier);
  }

  bindRatingComplete() {
    this.handleRatingComplete = () => {
      this.loadOrders();
    };
    window.addEventListener("rating-completed", this.handleRatingComplete);
  }

  initOrderStream() {
    const role = localStorage.getItem("authRole");
    if (role !== "customer" || !window.EventSource || this.orderStream) return;

    this.orderStream = new EventSource(`${API}/api/orders/stream`);

    this.handleOrderStatusEvent = (e) => {
      try {
        const data = JSON.parse(e.data || "{}");
        if (!data.orderId || !data.status) return;

        if (!this.selectedOrder || String(this.selectedOrder.id) === String(data.orderId)) {
          if (this.selectedOrder) this.selectedOrder.status = data.status;
          document.dispatchEvent(new CustomEvent("order-status-change", { detail: { status: data.status } }));
        }
      } catch {}
    };

    this.handleOrderUpdatedEvent = () => {
      this.loadOrders();
    };

    this.orderStream.addEventListener("order-status", this.handleOrderStatusEvent);
    this.orderStream.addEventListener("order-updated", this.handleOrderUpdatedEvent);
  }
}

customElements.define("orders-page", OrdersPage);