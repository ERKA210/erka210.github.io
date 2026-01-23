import { apiFetch } from "../api_client.js";

class RatingModal extends HTMLElement {
  constructor() {
    super();
    this.selectedOrder = null;
  }

  connectedCallback() {
    this.render();
    this.bindEvents();

    this.handleOrderSelect = (e) => {
      const order = e.detail || null;
      console.log('Order selected:', e.detail);
      this.selectedOrder = order;
      
      // Захиалга сонгогдоход статус шалгаад button харуулах
      if (order) {
        const status = String(order.status || "").toLowerCase();
        this.updateButtonUI(status);
        
        // Хэрэв delivered бол modal нээх
        if (status === "delivered") {
          localStorage.setItem("pendingRatingOrder", String(order.id));
          this.open();
        }
      } else {
        this.updateButtonUI(null);
      }
    };

    this.handleOrderStatusChange = (e) => {
      const data = e.detail || {};
      const status = String(data.status || "").toLowerCase();
      
      this.updateButtonUI(status);
      
      if (status === "delivered" && this.selectedOrder?.id) {
        localStorage.setItem("pendingRatingOrder", String(this.selectedOrder.id));
        this.open();
      }
    };

    document.addEventListener("order-select", this.handleOrderSelect);
    document.addEventListener("order-status-change", this.handleOrderStatusChange);
  }

  render() {
    this.innerHTML = `
      <button id="openRatingBtn" class="submit" style="display:none;">Үнэлгээ өгөх</button>
      <div id="ratingModal" class="modal" style="display:none;">
        <div class="modal-content">
          <span class="close" role="button" aria-label="Хаах">&times;</span>
          <h3>Сэтгэгдэл үлдээнэ үү...</h3>
          <rating-stars max="5" color="orange" size="28px"></rating-stars>
          <input type="text" id="ratingComment" placeholder="Сэтгэгдэл үлдээнэ үү...">
          <button class="submit" id="submitRatingBtn">Илгээх</button>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const modal = this.querySelector("#ratingModal");
    const openBtn = this.querySelector("#openRatingBtn");
    const closeBtn = this.querySelector(".close");
    const submitBtn = this.querySelector("#submitRatingBtn");
    const ratingEl = this.querySelector("rating-stars");

    // Modal backdrop click
    this._onDocClick = (e) => {
      if (modal && modal.style.display === "block" && e.target === modal) {
        this.close();
      }
    };
    document.addEventListener("click", this._onDocClick);

    // Open button
    if (openBtn) {
      openBtn.onclick = () => {
        if (!this.selectedOrder?.id) {
          alert("Захиалга сонгоно уу.");
          return;
        }
        const st = String(this.selectedOrder?.status || "").toLowerCase();
        if (st !== "delivered") {
          alert("Хүргэлт дууссаны дараа үнэлгээ өгнө.");
          return;
        }
        this.open();
      };
    }

    // Close button
    if (closeBtn) {
      closeBtn.onclick = () => this.close();
    }

    // Submit button
    if (submitBtn) {
      submitBtn.onclick = () => this.submitRating();
    }

    // Rating change
    if (ratingEl) {
      ratingEl.addEventListener("rate", (e) => {
        console.log("Үнэлгээ:", e.detail);
      });
    }
  }

  updateButtonUI(status) {
    const openBtn = this.querySelector("#openRatingBtn");
    if (!openBtn) return;

    const delivered = status === "delivered";
    openBtn.style.display = delivered ? "block" : "none";
  }

  async submitRating() {
    const ratingEl = this.querySelector("rating-stars");
    const commentEl = this.querySelector("#ratingComment");
    
    const rating = Number(ratingEl?.getValue() || 0);
    const comment = commentEl?.value || "";
    const orderId = this.selectedOrder?.id;

    if (!orderId) {
      alert("Захиалга сонгоно уу.");
      return;
    }

    const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRe.test(orderId)) {
      alert("Энэ захиалгад сэтгэгдэл үлдээх боломжгүй.");
      return;
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      alert("Үнэлгээ сонгоно уу.");
      return;
    }

    try {
      const res = await apiFetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, stars: rating, comment }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error || "Сэтгэгдэл  алдаа гарлаа");
        return;
      }

      this.markOrderRated(orderId);
      this.close();
      this.reset();
      
      localStorage.removeItem("pendingRatingOrder");
      window.dispatchEvent(new Event("reviews-updated"));

      try {
        await apiFetch("/api/delivery-cart", { method: "DELETE" });
      } catch {
        // ignore
      }

      await window.NumAppState?.logout("rating_submitted");
      window.dispatchEvent(new Event("delivery-cart-updated"));
      window.dispatchEvent(new Event("order-updated"));
      
      if (localStorage.getItem("authLoggedIn") === "1") {
        window.NumAppState?.setState("customer", "rating_submitted");
      }

      // Reload orders
      window.dispatchEvent(new Event("rating-completed"));
    } catch (e) {
  console.error("submitRating error:", e);
  alert((e && e.message) ? e.message : "Сэтгэгдэл хадгалахад алдаа гарлаа");
}
  }

  markOrderRated(orderId) {
    const key = "ratedOrders";
    let arr = [];
    try { 
      arr = JSON.parse(localStorage.getItem(key) || "[]"); 
    } catch {}
    const set = new Set(arr.map(String));
    set.add(String(orderId));
    localStorage.setItem(key, JSON.stringify([...set]));
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

  disconnectedCallback() {
    if (this._onDocClick) {
      document.removeEventListener("click", this._onDocClick);
    }
    if (this.handleOrderSelect) {
      document.removeEventListener("order-select", this.handleOrderSelect);
    }
    if (this.handleOrderStatusChange) {
      document.removeEventListener("order-status-change", this.handleOrderStatusChange);
    }
  }
}

customElements.define('rating-modal', RatingModal);