class HomePage extends HTMLElement {
  connectedCallback() {
    this.pendingOrder = null;
    this.pendingOffer = null;

    this.render();
    this.setupConfirmModal();
    loadPlaces();

    const orderBtn = this.querySelector(".order-btn");
    if (orderBtn) {
      orderBtn.addEventListener("click", () => this.prepareOrder());
    }
  }

  render() {
    this.innerHTML = `
      <link rel="stylesheet" href="assets/css/index.css" />
      <style>
        #confirm-modal {
          position: fixed;
          inset: 0;
          display: none;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          z-index: 10000;
          padding: 1rem;
        }
        #confirm-modal.show { display: flex; }
        #confirm-modal .modal-content {
          background: #fff;
          border-radius: 20px;
          width: min(480px, 100%);
          padding: 1.6rem 1.8rem;
          box-shadow: 0 24px 70px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
          text-align: center;
        }
        #confirm-modal h3 {
          margin: 0;
          font-size: 1.3rem;
          color: #111827;
        }
        #confirm-modal p {
          margin: 0;
          color: #374151;
          line-height: 1.45;
        }
        #confirm-modal .modal-actions {
          display: flex;
          justify-content: space-between;
          gap: 0.75rem;
          margin-top: 0.75rem;
        }
        #confirm-modal .btn--gray {
          background: #f9fafb;
          color: #111827;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 0.85rem 1.4rem;
          font-weight: 700;
        }
        #confirm-modal .btn--accent {
          background: var(--color-accent);
          color: #fff;
          border-radius: 12px;
          padding: 0.85rem 1.4rem;
          font-weight: 800;
        }
        #confirm-modal .detail-row {
          text-align: left;
          background: #f9fafb;
          border-radius: 12px;
          padding: 0.85rem 1rem;
          border: 1px solid #eef2f7;
          color: #1f2937;
          line-height: 1.5;
        }
        #confirm-modal .detail-row strong {
          display: inline-block;
          min-width: 4.7rem;
        }
      </style>

      <section class="filter-section">
        <div class="middle-row">
          <div class="ctrl">
            <span><img src="assets/img/map_pin.svg" alt="icon"/></span>
            <select id="fromPlace">
              <option value="" disabled selected hidden>Хаанаас</option>
            </select>
          </div>

          <span><img src="assets/img/arrow.svg" alt="icon"/></span>

          <div class="ctrl">
            <span><img src="assets/img/map_pin.svg" alt="icon"/></span>
            <select id="toPlace">
              <option value="" disabled selected hidden>Хаашаа</option>
            </select>
          </div>

          <date-time-picker></date-time-picker>
        </div>

        <div class="bottom-row">
          <div class="ctrl wide">
            <span><img src="assets/img/fork.svg" alt="icon" /></span>
            <select id="what">
              <option value="" disabled selected hidden>Юуг</option>
            </select>
          </div>
        </div>

        <sh-cart class="cart"></sh-cart>

        <div class="top-row">
          <button class="btn btn--accent order-btn">Захиалах</button>
        </div>
      </section>

      <offers-list id="offers"></offers-list>
      <offer-modal></offer-modal>

      <div id="confirm-modal" class="modal hidden">
        <div class="modal-content">
          <h3>Захиалга баталгаажуулах уу?</h3>
          <p id="confirm-text"></p>
          <div class="modal-actions">
            <button id="cancel-order" class="btn btn--gray">Цуцлах</button>
            <button id="confirm-order" class="btn btn--accent">Баталгаажуулах</button>
          </div>
        </div>
      </div>
    `;
  }

  formatPrice(n) {
    return Number(n || 0).toLocaleString("mn-MN") + "₮";
  }

  formatMeta(ts) {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return "";
    const date = d.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
    const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return `${date} • ${time}`;
  }

  getScheduledAtISO() {
    const picker = this.querySelector("date-time-picker");
    const dateVal = picker?.shadowRoot?.querySelector(".date")?.value;
    const timeVal = picker?.shadowRoot?.querySelector(".time")?.value;

    if (dateVal && timeVal) {
      const iso = new Date(`${dateVal}T${timeVal}:00`);
      if (!isNaN(iso.getTime())) return iso.toISOString();
    }

    const now = new Date();
    return now.toISOString();
  }

  setupConfirmModal() {
    this.confirmModal = this.querySelector("#confirm-modal");
    this.confirmTextEl = this.querySelector("#confirm-text");
    this.cancelBtn = this.querySelector("#cancel-order");
    this.confirmBtn = this.querySelector("#confirm-order");

    if (this.cancelBtn) {
      this.cancelBtn.addEventListener("click", () => this.hideConfirmModal());
    }
    if (this.confirmBtn) {
      this.confirmBtn.addEventListener("click", () => this.confirmOrder());
    }
    if (this.confirmModal) {
      this.confirmModal.addEventListener("click", (e) => {
        if (e.target === this.confirmModal) this.hideConfirmModal();
      });
    }
  }

  showConfirmModal(order, summary) {
    if (!this.confirmModal || !this.confirmTextEl) return;

    const items = summary.items?.length
      ? summary.items.map((i) => `• ${i.name} — ${i.qty} ширхэг`).join("<br>")
      : "Бараа сонгогдоогүй";

    const d = new Date(order.createdAt);

    this.confirmTextEl.innerHTML = `
      <div class="detail-row">
        <strong>Хаанаас:</strong> ${order.from}<br>
        <strong>Хаашаа:</strong> ${order.to}<br>
        <strong>Өдөр:</strong> ${order.createdAt.split("T")[0]}<br>
        <strong>Цаг:</strong> ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </div>
      <div class="detail-row">
        <strong>Таны хоол:</strong><br>
        ${items}
      </div>
      <div class="detail-row" style="text-align:center;">
        <strong>Нийт үнэ:</strong> ${summary.total ? this.formatPrice(summary.total) : "0₮"}
      </div>
    `;

    this.confirmModal.classList.remove("hidden");
    this.confirmModal.classList.add("show");
  }

  hideConfirmModal() {
    if (!this.confirmModal) return;
    this.confirmModal.classList.remove("show");
    this.pendingOrder = null;
    this.pendingOffer = null;
  }

  prepareOrder() {
    const fromSel = this.querySelector("#fromPlace");
    const toSel = this.querySelector("#toPlace");
    const whatSel = this.querySelector("#what");

    if (!fromSel?.value) {
      alert("Хаанаасаа сонгоно уу");
      return;
    }
    if (!toSel?.value) {
      alert("Хаашаагаа сонгоно уу");
      return;
    }

    const cartEl = this.querySelector("sh-cart");
    const cartSummary = cartEl?.getSummary() || { totalQty: 0, items: [], total: 0, deliveryFee: 0 };

    const itemOpt = whatSel?.selectedOptions?.[0];
    if (cartSummary.totalQty === 0) {
      if (!itemOpt || !itemOpt.value) {
        alert("Юуг (хоол/бараа) сонгоно уу");
        return;
      }
    }
    const fromOptionText = fromSel.selectedOptions[0].textContent || "";
    const parts = fromOptionText.split(" - ");
    const fromName = parts[0] || fromOptionText;
    const fromDetail = parts[1] || "";

    const scheduledAt = this.getScheduledAtISO();

    const items =
      cartSummary.totalQty > 0
        ? cartSummary.items.map((it) => ({
            id: it.key || it.name,
            name: it.name,
            price: Number(it.unitPrice ?? it.price ?? 0),
            qty: it.qty,
          }))
        : [{
            id: itemOpt.value,
            name: (itemOpt.textContent || "").split(" — ")[0],
            price: Number(itemOpt.dataset.price || 0),
            qty: 1,
          }];

    this.pendingOrder = {
      fromId: fromSel.value,
      toId: toSel.value,
      from: fromName,
      fromDetail,
      to: toSel.selectedOptions[0].textContent,
      createdAt: scheduledAt,
    };

    this.pendingOffer = {
      items,
      total: cartSummary.totalQty > 0 ? cartSummary.total : items.reduce((s, it) => s + (it.price * it.qty), 0),
      deliveryFee: cartSummary.totalQty > 0 ? cartSummary.deliveryFee : 500,
      thumb: cartSummary.deliveryIcon || "assets/img/box.svg"
    };

    this.showConfirmModal(this.pendingOrder, this.pendingOffer);
  }

  async confirmOrder() {
    if (!this.pendingOrder || !this.pendingOffer) {
      this.hideConfirmModal();
      return;
    }

    const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    let userId = localStorage.getItem("userId");

    if (!uuidRe.test(userId || "")) {
      const newId = (crypto.randomUUID && crypto.randomUUID()) || `00000000-0000-4000-8000-${Date.now().toString().padStart(12, "0").slice(-12)}`;
      localStorage.setItem("userId", newId);
      userId = newId;
    }

    if (!userId) {
      // Нэвтрээгүй хэрэглэгчийг login хуудас руу чиглүүлнэ
      localStorage.setItem("pendingOrderDraft", JSON.stringify(this.pendingOrder));
      localStorage.setItem("pendingOfferDraft", JSON.stringify(this.pendingOffer));
      this.hideConfirmModal();
      location.hash = "#login";
      return;
    }

    if (!this.pendingOrder.fromId || !this.pendingOrder.toId) {
      alert("Хаанаас/Хаашаа сонгоно уу");
      return;
    }

    if (!Array.isArray(this.pendingOffer.items) || this.pendingOffer.items.length === 0) {
      alert("Сагс хоосон байна");
      return;
    }

    const safeItems = this.pendingOffer.items
      .map((i) => {
        const unitPrice = Number(i.price);
        const qty = Number(i.qty);
        return {
          menuItemKey: i.id,
          name: i.name,
          unitPrice: Number.isFinite(unitPrice) ? unitPrice : 0,
          qty: Number.isFinite(qty) && qty > 0 ? qty : 1,
          options: {},
        };
      })
      .filter((i) => i.qty > 0);

    const payload = {
      customerId: userId || null,
      fromPlaceId: this.pendingOrder.fromId,
      toPlaceId: this.pendingOrder.toId,
      scheduledAt: this.pendingOrder.createdAt,
      deliveryFee: Number.isFinite(this.pendingOffer.deliveryFee) ? this.pendingOffer.deliveryFee : 0,
      items: safeItems,
      customerName: localStorage.getItem("userName") || "Зочин хэрэглэгч",
      customerPhone: localStorage.getItem("userPhone") || "00000000",
      note: this.pendingOrder.fromDetail ? `Pickup: ${this.pendingOrder.fromDetail}` : null,
    };

    try {
      const resp = await fetch(`${API}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        alert(data?.error || "Захиалга үүсгэхэд алдаа гарлаа");
        return;
      }

      localStorage.setItem("activeOrder", JSON.stringify(this.pendingOrder));
      localStorage.setItem("orderStep", "0");

      const existingOffers = JSON.parse(localStorage.getItem("offers") || "[]");
      existingOffers.unshift({
        ...this.pendingOffer,
        orderId: data.orderId,
        meta: this.formatMeta(this.pendingOrder.createdAt),
        from: this.pendingOrder.from,
        fromDetail: this.pendingOrder.fromDetail,
        to: this.pendingOrder.to,
        title: `${this.pendingOrder.from} - ${this.pendingOrder.to}`,
        price: this.formatPrice((data?.total ?? this.pendingOffer.total) || 0),
        thumb: this.pendingOffer.thumb || "assets/img/box.svg",
        sub: this.pendingOffer.items.map((it) => ({
          name: `${it.name} x${it.qty}`,
          price: this.formatPrice(it.price * it.qty)
        }))
      });
      localStorage.setItem("offers", JSON.stringify(existingOffers));

      const offersEl = this.querySelector("#offers");
      if (offersEl && "items" in offersEl) {
        offersEl.items = existingOffers;
      }

      this.hideConfirmModal();

      const offersSection = document.querySelector("#offers");
      if (offersSection && offersSection.scrollIntoView) {
        setTimeout(() => {
          offersSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150); 
      }
    } catch (e) {
      alert("Сервертэй холбогдож чадсангүй");
    }
  }
}

const API = "http://localhost:3000";

async function loadPlaces() {
  const from = await fetch(`${API}/api/from-places`).then((r) => r.json());
  const to = await fetch(`${API}/api/to-places`).then((r) => r.json());

  const fromSel = document.querySelector("#fromPlace");
  const toSel = document.querySelector("#toPlace");

  fromSel.innerHTML = `<option value="" disabled selected hidden>Хаанаас</option>`;
  toSel.innerHTML = `<option value="" disabled selected hidden>Хаашаа</option>`;

  fromSel.innerHTML += from
    .map(
      (p) =>
        `<option value="${p.id}">${p.name}${p.detail ? " - " + p.detail : ""}</option>`
    )
    .join("");

  toSel.innerHTML += to
    .map((p) => `<option value="${p.id}">${p.name}</option>`)
    .join("");
}

loadPlaces();

document.addEventListener("change", async (e) => {
  if (e.target.id !== "fromPlace") return;

  const placeId = e.target.value;

  const res = await fetch(`${API}/api/menus/${placeId}`).then((r) => r.json());

  const whatSel = document.querySelector("#what");
  if (!whatSel) return;

  const items = Array.isArray(res.menu_json) ? res.menu_json : [];

  const foods = items.filter((i) => i.category === "food");
  const drinks = items.filter((i) => i.category === "drink");

  whatSel.innerHTML = `<option value="" disabled selected hidden>Юуг</option>`;

  if (foods.length) {
    const og = document.createElement("optgroup");
    og.label = "🥘 Идэх юм";
    foods.forEach((item) => {
      const opt = document.createElement("option");
      opt.value = item.id;
      opt.dataset.price = item.price;
      opt.dataset.name = item.name;
      opt.textContent = `${item.name} — ${item.price}₮`;
      og.appendChild(opt);
    });
    whatSel.appendChild(og);
  }

  if (drinks.length) {
    const og = document.createElement("optgroup");
    og.label = "🥤 Уух юм";
    drinks.forEach((item) => {
      const opt = document.createElement("option");
      opt.value = item.id;
      opt.dataset.price = item.price;
      opt.dataset.name = item.name;
      opt.textContent = `${item.name} — ${item.price}₮`;
      og.appendChild(opt);
    });
    whatSel.appendChild(og);
  }

  const others = items.filter((i) => !i.category);
  if (others.length) {
    const og = document.createElement("optgroup");
    og.label = "📦 Бусад";
    others.forEach((item) => {
      const opt = document.createElement("option");
      opt.value = item.id;
      opt.dataset.price = item.price;
      opt.dataset.name = item.name;
      opt.textContent = `${item.name} — ${item.price}₮`;
      og.appendChild(opt);
    });
    whatSel.appendChild(og);
  }
});

customElements.define("home-page", HomePage);
