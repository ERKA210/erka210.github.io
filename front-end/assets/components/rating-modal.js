import { apiFetch } from "../api_client.js";

class RatingModal extends HTMLElement {
  constructor() {
    super();
    this.selectedOrder = null;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  disconnectedCallback() {
    document.removeEventListener("click", this.onDocClick);
    document.removeEventListener("order-select", this.onOrderSelect);
    document.removeEventListener("order-status-change", this.onOrderStatusChange);
  }

  setupEventListeners() {
    this.onDocClick = (e) => this.handleBackdropClick(e);
    this.onOrderSelect = (e) => this.handleOrderSelect(e);
    this.onOrderStatusChange = (e) => this.handleOrderStatusChange(e);

    document.addEventListener("click", this.onDocClick);
    document.addEventListener("order-select", this.onOrderSelect);
    document.addEventListener("order-status-change", this.onOrderStatusChange);

    const openBtn = this.querySelector("#openRatingBtn");
    const closeBtn = this.querySelector(".close");
    const submitBtn = this.querySelector("#submitRatingBtn");
    const ratingEl = this.querySelector("rating-stars");

    if (openBtn) {
      openBtn.addEventListener("click", () => this.handleOpenClick());
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.close());
    }

    if (submitBtn) {
      submitBtn.addEventListener("click", () => this.submitRating());
    }

    if (ratingEl) {
      ratingEl.addEventListener("rate", (e) => {
        console.log("Үнэлгээ:", e.detail);
      });
    }
  }

  handleBackdropClick(e) {
    const modal = this.querySelector("#ratingModal");
    if (modal && modal.style.display === "block" && e.target === modal) {
      this.close();
    }
  }

  handleOrderSelect(e) {
    const order = e.detail || null;
    console.log('Order selected:', e.detail);
    this.selectedOrder = order;

    if (order) {
      const status = String(order.status || "").toLowerCase();
      this.updateButtonUI(status);

      if (status === "delivered") {
        localStorage.setItem("pendingRatingOrder", String(order.id));
        this.open();
      }
    } else {
      this.updateButtonUI(null);
    }
  }

  handleOrderStatusChange(e) {
    const data = e.detail || {};
    const status = String(data.status || "").toLowerCase();

    this.updateButtonUI(status);

    if (status === "delivered" && this.selectedOrder?.id) {
      localStorage.setItem("pendingRatingOrder", String(this.selectedOrder.id));
      this.open();
    }
  }

  handleOpenClick() {
    if (!this.selectedOrder?.id) {
      alert("Захиалга сонгоно уу.");
      return;
    }

    const status = String(this.selectedOrder?.status || "").toLowerCase();
    if (status !== "delivered") {
      alert("Хүргэлт дууссаны дараа үнэлгээ өгнө.");
      return;
    }

    this.open();
  }

  render() {
    this.innerHTML = `
      <button id="openRatingBtn" class="submit" style="display:none;">
        Үнэлгээ өгөх
      </button>
      
      <div id="ratingModal" class="modal" style="display:none;">
        <div class="modal-content">
          <span class="close" role="button" aria-label="Хаах">&times;</span>
          <h3>Сэтгэгдэл үлдээнэ үү...</h3>
          <rating-stars></rating-stars>
          <input type="text" id="ratingComment" placeholder="Сэтгэгдэл үлдээнэ үү...">
          <button class="submit" id="submitRatingBtn">Илгээх</button>
        </div>
      </div>
    `;
  }

  updateButtonUI(status) {
    const openBtn = this.querySelector("#openRatingBtn");
    if (!openBtn) return;

    const isDelivered = status === "delivered";
    openBtn.style.display = isDelivered ? "block" : "none";
  }

  async submitRating() {
    const ratingEl = this.querySelector("rating-stars");
    const commentEl = this.querySelector("#ratingComment");

    const rating = Number(ratingEl?.getValue() || 0);
    const comment = commentEl?.value || "";
    const orderId = this.selectedOrder?.id;

    try {
      await this.sendRatingToServer(orderId, rating, comment);
      await this.handleSuccessfulRating(orderId);
    } catch (e) {
      console.error("submitRating error:", e);
      alert(e?.message || "Сэтгэгдэл хадгалахад алдаа гарлаа");
    }
  }

  validateOrder(orderId) {
    if (!orderId) {
      alert("Захиалга сонгоно уу.");
      return false;
    }

    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(orderId)) {
      alert("Энэ захиалгад сэтгэгдэл үлдээх боломжгүй.");
      return false;
    }

    return true;
  }

  async sendRatingToServer(orderId, rating, comment) {
    const res = await apiFetch("/api/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, stars: rating, comment }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Сэтгэгдэл алдаа гарлаа");
    }
  }

  async handleSuccessfulRating(orderId) {
    this.markOrderRated(orderId);
    this.close();
    this.reset();

    localStorage.removeItem("pendingRatingOrder");
    window.dispatchEvent(new Event("reviews-updated"));

    await this.clearDeliveryCart();
    await this.logoutUser();
    this.dispatchUpdates();
  }

  async clearDeliveryCart() {
    try {
      await apiFetch("/api/delivery-cart", { method: "DELETE" });
    } catch {
    }
  }

  async logoutUser() {
    await window.NumAppState?.logout("rating_submitted");
  }

  dispatchUpdates() {
    window.dispatchEvent(new Event("delivery-cart-updated"));
    window.dispatchEvent(new Event("order-updated"));

    if (localStorage.getItem("authLoggedIn") === "1") {
      window.NumAppState?.setState("customer", "rating_submitted");
    }

    window.dispatchEvent(new Event("rating-completed"));
  }

  markOrderRated(orderId) {
    const key = "ratedOrders";
    let ratedOrders = [];

    try {
      ratedOrders = JSON.parse(localStorage.getItem(key) || "[]");
    } catch {}

    const uniqueOrders = new Set(ratedOrders.map(String));
    uniqueOrders.add(String(orderId));

    localStorage.setItem(key, JSON.stringify([...uniqueOrders]));
  }

  open() {
    const modal = this.querySelector("#ratingModal");
    if (modal) modal.style.display = "block";
  }

  close() {
    const modal = this.querySelector("#ratingModal");
    if (modal) modal.style.display = "none";
  }

  reset() {
    const ratingEl = this.querySelector("rating-stars");
    const commentEl = this.querySelector("#ratingComment");

    if (ratingEl) ratingEl.reset();
    if (commentEl) commentEl.value = "";
  }
}

customElements.define('rating-modal', RatingModal);