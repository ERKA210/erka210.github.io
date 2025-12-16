const API = "http://localhost:3000";

class OrdersPage extends HTMLElement {
  connectedCallback() {
    this.render();
    this.loadOrders();
    this.bindModal();
    this.bindProgress();
    this.bindClicks();
    this.renderCourierPanel();

    this.onHashChange = () => {
      if ((location.hash || "#").replace("#", "") === "orders") {
        this.renderCourierPanel();
      }
    };
    window.addEventListener("hashchange", this.onHashChange);
  }

  render() {
    this.innerHTML = `
  <link rel="stylesheet" href="assets/css/order.css">
      <main class="container">
        <section class="orders">
          <h2>Миний захиалга</h2>
          <div class="order-list" id="orderList">
            <p class="muted">Захиалга ачааллаж байна...</p>
          </div>
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

          <button id="openModal">Бараа хүлээж авсан</button>

          <div id="ratingModal" class="modal">
            <div class="modal-content">
              <span class="close">&times;</span>
              <h3>Сэтгэгдэл үлдээнэ үү...</h3>
              <rating-stars max="5" color="orange" size="28px"></rating-stars>
              <input type="text" id="comment" placeholder="Сэтгэгдэл үлдээнэ үү...">
              <button class="submit" id="sendBtn">Илгээх</button>
            </div>
          </div>

          <section class="courier-panel" id="courierPanel" hidden>
            <h3>Хүргэгчийн мэдээлэл</h3>
            <div class="courier-box" id="courierBox"></div>
          </section>

        </section>
      </main>
    `;
  }

  async loadOrders() {
    const listEl = this.querySelector("#orderList");
    if (!listEl) return;

    const userId = localStorage.getItem("userId");
    const qs = userId ? `?customerId=${encodeURIComponent(userId)}` : "";

    try {
      const res = await fetch(`${API}/api/orders${qs}`);
      
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Алдаа");

      const filtered = this.filterExpired(data);
      const list = filtered.length ? filtered : (data.length ? data : this.readLocalOffers());
      this.renderOrders(list);
    } catch (e) {
      const fallback = this.readLocalOffers();
      if (fallback.length) {
        this.renderOrders(fallback);
      } else {
        listEl.innerHTML = `<p class="muted">Захиалга уншихад алдаа: ${e.message}</p>`;
      }
    }
  }

  

  renderOrders(orders) {
    const listEl = this.querySelector("#orderList");
    if (!listEl) return;

    if (!orders.length) {
      listEl.innerHTML = `<p class="muted">Захиалга алга.</p>`;
      return;
    }

   listEl.innerHTML = orders.map((o) => {
  const ts = this.getOrderTimestamp(o) || Date.now();
  const dt = new Date(ts);
  const meta = `${dt.toLocaleDateString()} • ${dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  const itemsTxt = (o.items || []).map(it => `${it.name} ×${it.qty}`).join(" · ");

  return `
    <div class="order-card" data-order='${encodeURIComponent(JSON.stringify(o))}'>
      <div class="order-info">
        <h3 class="order-title">${o.from_name || ""} - ${o.to_name || ""}</h3>
        <h4>${meta}</h4>
        <p>${itemsTxt || "Бараа байхгүй"}</p>
        <p class="order-total">Дүн: ${this.formatPrice(o.total_amount || 0)}</p>
      </div>
      <img src="assets/img/tor.svg" alt="hemjee">
    </div>
  `;
}).join("");

    // Эхний захиалгын статусыг алхамд тусгана
    this.setProgressFromStatus(orders[0]?.status);
  }

  bindClicks() {
  this.addEventListener("click", (e) => {
    const card = e.target.closest(".order-card");
    if (!card) return;

    const raw = card.getAttribute("data-order");
    if (!raw) return;

    const order = JSON.parse(decodeURIComponent(raw));

    // progress update
    this.setProgressFromStatus(order.status);

    // энд хүсвэл баруун талын хэсэгт нэмэлт detail гаргаж болно
    // жишээ: console.log(order)
  });
}

  // LocalStorage дээрх offers-ээс fallback үүсгэх
  readLocalOffers() {
    try {
      const raw = localStorage.getItem("offers");
      const offers = raw ? JSON.parse(raw) : [];
      return offers.map((o, idx) => {
        const titleParts = (o.title || "").split(" - ");
        return {
          id: o.orderId || `local-${idx}`,
          from_name: o.from || titleParts[0] || "",
          to_name: o.to || titleParts[1] || "",
          total_amount: o.total || this.parsePrice(o.price),
          created_at: o.meta || new Date().toISOString(),
          items: (o.sub || []).map((s) => {
            if (typeof s === "string") return { name: s, qty: 1 };
            return { name: s.name || "", qty: 1 };
          }),
        };
      });
    } catch {
      return [];
    }
  }

  parsePrice(v) {
    return parseInt(String(v || "").replace(/[^\d]/g, ""), 10) || 0;
  }

  formatPrice(v) {
    return Number(v || 0).toLocaleString("mn-MN") + "₮";
  }

  getActiveCourier() {
    try {
      const raw = localStorage.getItem("activeCourier");
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  renderCourierPanel() {
    const panel = this.querySelector("#courierPanel");
    const box = this.querySelector("#courierBox");
    if (!panel || !box) return;

    const courier = this.getActiveCourier();
    if (!courier) {
      panel.hidden = true;
      return;
    }

    const avatar = courier.avatar || "assets/img/profile.jpg";
    const name = courier.name || "Мэдээлэл алга";
    const phone = courier.phone ? `Утас: ${courier.phone}` : "";
    const code = courier.student_id || courier.id || "";
    const idTxt = code ? `ID: ${code}` : "";

    box.innerHTML = `
      <div class="delivery" style="display:flex;gap:12px;align-items:center;padding:12px;border:1px solid #e5e7eb;border-radius:12px;">
        <img src="${avatar}" alt="courier" style="width:56px;height:56px;border-radius:14px;object-fit:cover;">
        <div class="delivery-info">
          <div style="font-weight:700;color:#111827;">${name}</div>
          <div style="color:#374151;">${phone}</div>
          <div style="color:#6b7280;">${idTxt}</div>
        </div>
      </div>
    `;
    panel.hidden = false;
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
    const stepIndex = parseInt(localStorage.getItem('orderStep')) || 0;
    const steps = this.querySelectorAll('.step');
    steps.forEach((step, idx) => {
      step.classList.remove('active', 'completed');
      if (idx < stepIndex) step.classList.add('completed');
      else if (idx === stepIndex) step.classList.add('active');
    });
  }

  disconnectedCallback() {
    if (this.onHashChange) {
      window.removeEventListener("hashchange", this.onHashChange);
    }
  }

  // Одоогоос 24 цагийн өмнөх захиалгыг нуух (фоллбэк: бүгдийг үзүүлнэ)
  filterExpired(orders) {
    const now = Date.now();
    const cutoff = now - 24 * 60 * 60 * 1000;
    return orders.filter((o) => {
      const ts = this.getOrderTimestamp(o);
      if (ts === null) return false;
      return ts >= cutoff;
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
    const t = this.parseDate(raw);
    return t;
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

  bindModal() {
    const modal = this.querySelector("#ratingModal");
    const openBtn = this.querySelector("#openModal");
    const closeBtn = this.querySelector(".close");
    const sendBtn = this.querySelector("#sendBtn");
    const ratingEl = this.querySelector("rating-stars");

    if (openBtn && modal) {
      openBtn.onclick = () => modal.style.display = "block";
    }
    if (closeBtn && modal) {
      closeBtn.onclick = () => modal.style.display = "none";
    }
    window.onclick = (e) => {
      if (e.target === modal) modal.style.display = "none";
    };

    if (sendBtn && modal) {
      sendBtn.onclick = () => {
        const rating = ratingEl?.getAttribute("value");
        const comment = this.querySelector("#comment")?.value || "";
        console.log("Rating:", rating);
        console.log("Comment:", comment);
        modal.style.display = "none";
      };
    }

    if (ratingEl) {
      ratingEl.addEventListener('rate', e => {
        console.log('Үнэлгээ:', e.detail);
      });
    }
  }
}

customElements.define('orders-page', OrdersPage);
