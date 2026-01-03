const API = "http://localhost:3000";

class OrdersPage extends HTMLElement {
  connectedCallback() {
    this.selectedOrder = null;
    this._onDocClick = this._onDocClick?.bind(this) || ((e) => this.onDocClick(e));
    this.render();
    this.bindModal();
    this.bindClicks();
    this.bindProgress(); 
    this.loadOrders();
    this.initOrderStream();
  }

  disconnectedCallback() {
    document.removeEventListener("click", this._onDocClick);

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

  renderCourier(courier) {
    const box = this.querySelector("#courierBox");
    if (!box) return;
    if (!courier) {
      box.setEmpty?.();
      return;
    }
    box.setData?.(courier);
  }

  async loadCourierForOrder(order) {
    const courier = order?.courier || null;
    this.renderCourier(courier);
  }

  render() {
    this.innerHTML = `
      <link rel="stylesheet" href="assets/css/order.css">
      <main class="container">
        <section class="order-side">
          <section class="orders">
            <h2>Миний захиалга</h2>
            <div class="order-list" id="orderList">
              <p class="muted">Захиалга ачааллаж байна...</p>
            </div>
          </section>

          <section class="delivery-info">
            <couriers-card id="courierBox"></couriers-card>
          </section>
        </section>

        <section class="details">
          <h2>Захиалгын явц</h2>

          <div class="order-progress">
            <div class="step" data-step="0">
              <div class="step-indicator">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2C8.962 2 6.5 4.462 6.5 7.5C6.5 11.438 12 18 12 18C12 18 17.5 11.438 17.5 7.5C17.5 4.462 15.038 2 12 2ZM12 9.5C10.895 9.5 10 8.605 10 7.5C10 6.395 10.895 5.5 12 5.5C13.105 5.5 14 6.395 14 7.5C14 8.605 13.105 9.5 12 9.5Z"/>
                </svg>
              </div>
              <div><div class="step-label">Захиалга хүлээн авсан</div></div>
            </div>

            <div class="step" data-step="1">
              <div class="step-indicator">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2C8.962 2 6.5 4.462 6.5 7.5C6.5 11.438 12 18 12 18C12 18 17.5 11.438 17.5 7.5C17.5 4.462 15.038 2 12 2ZM12 9.5C10.895 9.5 10 8.605 10 7.5C10 6.395 10.895 5.5 12 5.5C13.105 5.5 14 6.395 14 7.5C14 8.605 13.105 9.5 12 9.5Z"/>
                </svg>
              </div>
              <div><div class="step-label">Хүргэлтэнд гарсан</div></div>
            </div>

            <div class="step" data-step="2">
              <div class="step-indicator">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2C8.962 2 6.5 4.462 6.5 7.5C6.5 11.438 12 18 12 18C12 18 17.5 11.438 17.5 7.5C17.5 4.462 15.038 2 12 2ZM12 9.5C10.895 9.5 10 8.605 10 7.5C10 6.395 10.895 5.5 12 5.5C13.105 5.5 14 6.395 14 7.5C14 8.605 13.105 9.5 12 9.5Z"/>
                </svg>
              </div>
              <div><div class="step-label">Амжилттай хүлээн авсан</div></div>
            </div>
          </div>

          <button id="openModal" style="display:none;">Үнэлгээ өгөх</button>

          <div id="ratingModal" class="modal" style="display:none;">
            <div class="modal-content">
              <span class="close" role="button" aria-label="Хаах">&times;</span>
              <h3>Сэтгэгдэл үлдээнэ үү...</h3>
              <rating-stars max="5" color="orange" size="28px"></rating-stars>
              <input type="text" id="comment" placeholder="Сэтгэгдэл үлдээнэ үү...">
              <button class="submit" id="sendBtn">Илгээх</button>
            </div>
          </div>
        </section>
      </main>
    `;
  }

  markOrderRated(orderId) {
    const key = "ratedOrders";
    let arr = [];
    try { arr = JSON.parse(localStorage.getItem(key) || "[]"); } catch {}
    const set = new Set(arr.map(String));
    set.add(String(orderId));
    localStorage.setItem(key, JSON.stringify([...set]));
  }

  isOrderRated(orderId) {
    let arr = [];
    try { arr = JSON.parse(localStorage.getItem("ratedOrders") || "[]"); } catch {}
    return arr.map(String).includes(String(orderId));
  }

  async loadOrders() {
    const listEl = this.querySelector("#orderList");
    if (!listEl) return;

    let userId = "";
    try {
      const resUser = await fetch("/api/auth/me", { credentials: "include" });
      if (resUser.ok) {
        const data = await resUser.json();
        userId = data?.user?.id || "";
      }
    } catch {
      userId = "";
    }

    if (!userId) {
      location.hash = "#login";
      return;
    }

    const qs = `?customerId=${encodeURIComponent(userId)}`;

    try {
      const res = await fetch(`${API}/api/orders${qs}`, { credentials: "include" });
      const data = await res.json().catch(() => ([]));
      if (!res.ok) throw new Error(data?.error || "Алдаа");

      const filtered = this.filterExpired(Array.isArray(data) ? data : []);
      const notRated = filtered.filter((o) => !this.isOrderRated(o.id));

      if (Array.isArray(data) && data.length > 0 && filtered.length === 0) {
        window.NumAppState?.resetToGuest("order_expired");
      }

      this.renderOrders(notRated);
    } catch (e) {
      listEl.innerHTML = `<p class="muted">Захиалга уншихад алдаа: ${this.escapeHtml(e.message)}</p>`;
    }
  }

  renderOrders(orders) {
    const listEl = this.querySelector("#orderList");
    if (!listEl) return;

    if (!orders.length) {
      listEl.innerHTML = `<p class="muted">Захиалга алга.</p>`;
      this.selectedOrder = null;
      this.setProgressFromStatus(null);
      this.syncRatingUI(null);
      this.renderCourier(null);
      return;
    }

    listEl.innerHTML = orders.map((o) => {
      const ts = this.getOrderTimestamp(o) || Date.now();
      const dt = new Date(ts);
      const meta = `${dt.toLocaleDateString()} • ${dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
      const items = Array.isArray(o.items) ? o.items : [];
      const itemsTxt = items.map(it => `${it.name} ×${it.qty}`).join(" · ");
      const totalQty = items.reduce((sum, it) => sum + (Number(it?.qty) || 0), 0);
      const iconSrc = this.getOfferThumb(o?.id) || this.getDeliveryIcon(totalQty);

      return `
        <div class="order-card" data-order='${encodeURIComponent(JSON.stringify(o))}'>
          <div class="order-info">
            <h3 class="order-title">${this.escapeHtml(o.from_name || "")} - ${this.escapeHtml(o.to_name || "")}</h3>
            <h4>${this.escapeHtml(meta)}</h4>
            <p>${this.escapeHtml(itemsTxt || "Бараа байхгүй")}</p>
            <p class="order-total">Дүн: ${this.formatPrice(o.total_amount || 0)}</p>
          </div>
          <img src="${iconSrc}" alt="hemjee" width="57" height="57" decoding="async">
        </div>
      `;
    }).join("");

    this.selectedOrder = orders[0] || null;
    this.setProgressFromStatus(this.selectedOrder?.status);
    this.loadCourierForOrder(this.selectedOrder);

    const st = String(this.selectedOrder?.status || "").toLowerCase();
    this.syncRatingUI(st);

    if (st === "delivered") {
      localStorage.setItem("pendingRatingOrder", String(this.selectedOrder?.id || ""));
      this.openRatingModal();
    }
  }

  bindClicks() {
    this.addEventListener("click", (e) => {
      const card = e.target.closest(".order-card");
      if (!card) return;

      const raw = card.getAttribute("data-order");
      if (!raw) return;

      const order = JSON.parse(decodeURIComponent(raw));
      this.selectedOrder = order;

      this.setProgressFromStatus(order.status);
      this.loadCourierForOrder(order);

      const st = String(order.status || "").toLowerCase();
      this.syncRatingUI(st);
    });
  }

  mapStatusToStep(status) {
    switch ((status || "").toLowerCase()) {
      case "on_the_way":
      case "on-the-way":
        return 1;
      case "delivered":
        return 2;
      default:
        return 0;
    }
  }

  setProgressFromStatus(status) {
    const stepIndex = this.mapStatusToStep(status);
    localStorage.setItem("orderStep", String(stepIndex));
    this.bindProgress();
  }

  bindProgress() {
    const stepIndex = parseInt(localStorage.getItem("orderStep"), 10) || 0;
    const steps = this.querySelectorAll(".step");
    steps.forEach((step, idx) => {
      step.classList.remove("active", "completed");
      if (idx < stepIndex) step.classList.add("completed");
      else if (idx === stepIndex) step.classList.add("active");
    });
  }

  syncRatingUI(status) {
    const openBtn = this.querySelector("#openModal");
    if (!openBtn) return;

    const st = String(status || "").toLowerCase();
    const delivered = st === "delivered";

    openBtn.style.display = delivered ? "block" : "none";

    openBtn.disabled = !delivered;
    openBtn.style.opacity = delivered ? "" : "0.5";
    openBtn.title = delivered ? "" : "Хүргэлт дууссаны дараа үнэлгээ өгнө";
    openBtn.textContent = "Үнэлгээ өгөх";
  }

  openRatingModal() {
    const modal = this.querySelector("#ratingModal");
    if (modal) modal.style.display = "block";
  }

  closeRatingModal() {
    const modal = this.querySelector("#ratingModal");
    if (modal) modal.style.display = "none";
  }

  onDocClick(e) {
    const modal = this.querySelector("#ratingModal");
    if (!modal) return;
    if (modal.style.display !== "block") return;

    const content = modal.querySelector(".modal-content");
    if (!content) return;

    if (e.target === modal) this.closeRatingModal();
  }

  bindModal() {
    const modal = this.querySelector("#ratingModal");
    const openBtn = this.querySelector("#openModal");
    const closeBtn = this.querySelector(".close");
    const sendBtn = this.querySelector("#sendBtn");
    const ratingEl = this.querySelector("rating-stars");

    document.removeEventListener("click", this._onDocClick);
    document.addEventListener("click", this._onDocClick);

    if (openBtn && modal) {
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
        this.openRatingModal();
      };
    }

    if (closeBtn && modal) {
      closeBtn.onclick = () => this.closeRatingModal();
    }

    if (sendBtn && modal) {
      sendBtn.onclick = async () => {
        const rating = Number(ratingEl?.getAttribute("value") || 0);
        const comment = this.querySelector("#comment")?.value || "";
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
          const res = await fetch("/api/ratings", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId, stars: rating, comment }),
          });

          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            alert(err.error || "Сэтгэгдэл хадгалахад алдаа гарлаа");
            return;
          }

          this.markOrderRated(orderId);

          this.closeRatingModal();
          localStorage.removeItem("pendingRatingOrder");
          window.dispatchEvent(new Event("reviews-updated"));

          await window.NumAppState?.resetToGuest("rating_submitted");

          this.loadOrders();
        } catch {
          alert("Сэтгэгдэл хадгалахад алдаа гарлаа");
        }
      };
    }

    if (ratingEl) {
      ratingEl.addEventListener("rate", (e) => {
        console.log("Үнэлгээ:", e.detail);
      });
    }
  }

  initOrderStream() {
    const role = localStorage.getItem("authRole");
    if (role !== "customer") return;
    if (!window.EventSource) return;
    if (this.orderStream) return;

    this.orderStream = new EventSource(`${API}/api/orders/stream`);

    this.handleOrderStatusEvent = (e) => {
      try {
        const data = JSON.parse(e.data || "{}");
        if (!data.orderId || !data.status) return;

        if (!this.selectedOrder || String(this.selectedOrder.id) === String(data.orderId)) {
          if (this.selectedOrder) this.selectedOrder.status = data.status;

          this.setProgressFromStatus(data.status);

          const st = String(data.status).toLowerCase();
          this.syncRatingUI(st);

          if (st === "delivered") {
            localStorage.setItem("pendingRatingOrder", String(data.orderId));
            this.openRatingModal();
          }
        }
      } catch {
        // ignore
      }
    };

    this.handleOrderUpdatedEvent = () => {
      this.loadOrders();
    };

    this.orderStream.addEventListener("order-status", this.handleOrderStatusEvent);
    this.orderStream.addEventListener("order-updated", this.handleOrderUpdatedEvent);
  }

  filterExpired(orders) {
    return orders.filter((o) => {
      const ts = this.getOrderTimestamp(o);
      if (ts === null) return false;
      return ts >= Date.now();
    });
  }

  getOrderTimestamp(o) {
    const raw =
      o.scheduled_at ||
      o.scheduledAt ||
      o.created_at ||
      o.createdAt ||
      o.meta ||
      null;
    return this.parseDate(raw);
  }

  parseDate(val) {
    if (!val) return null;
    const parsed = Date.parse(val);
    if (!Number.isNaN(parsed)) return parsed;

    const m = String(val).match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4}).*?(\d{1,2}:\d{2}\s*[AP]M)/i);
    if (m) {
      const [_, mm, dd, yyRaw, time] = m;
      const yy = yyRaw.length === 2 ? `20${yyRaw}` : yyRaw;
      const d = new Date(`${yy}-${mm}-${dd} ${time}`);
      if (!Number.isNaN(d.getTime())) return d.getTime();
    }
    return null;
  }

  formatPrice(v) {
    return Number(v || 0).toLocaleString("mn-MN") + "₮";
  }

  getOfferThumb(orderId) {
    if (!orderId) return "";
    try {
      const raw = localStorage.getItem("offers");
      const offers = raw ? JSON.parse(raw) : [];
      const match = Array.isArray(offers)
        ? offers.find((o) => (o?.orderId || o?.id) === orderId)
        : null;
      return match?.thumb || "";
    } catch {
      return "";
    }
  }

  getDeliveryIcon(totalQty) {
    if (totalQty > 10) return "assets/img/box.svg";
    if (totalQty >= 2) return "assets/img/tor.svg";
    if (totalQty === 1) return "assets/img/document.svg";
    return "assets/img/box.svg";
  }

  escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
}

customElements.define("orders-page", OrdersPage);
