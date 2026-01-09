import { apiFetch } from "../api_client.js";

class HomePage extends HTMLElement {
  connectedCallback() {
    this.currentUser = null;
    this.pendingOrder = null;
    this.pendingOffer = null;

    this.render();
    this.cacheEls();
    this.bindConfirmModal();
    this.bindEvents();

    this.loadPlaces();
    this.hydrateCustomerFromDb();
  }

  disconnectedCallback() {
    if (this.orderBtn && this.handleOrderClick) {
      this.orderBtn.removeEventListener("click", this.handleOrderClick);
    }
    if (this.fromSel && this.handleFromChange) {
      this.fromSel.removeEventListener("change", this.handleFromChange);
    }
    if (this.confirmModal && this.handleConfirm) {
      this.confirmModal.removeEventListener("confirm", this.handleConfirm);
      this.confirmModal.removeEventListener("cancel", this.handleCancel);
    }
  }

  render() {
    this.innerHTML = `
      <link rel="stylesheet" href="assets/css/index.css" />
      <style>
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      </style>

      <section class="filter-section">
        <div class="middle-row">
          <div class="ctrl">
            <span><img src="assets/img/map_pin.svg" alt="icon" width="16" height="16" /></span>
            <label class="sr-only" for="fromPlace">Хаанаас</label>
            <select id="fromPlace">
              <option value="" disabled selected hidden>Хаанаас</option>
            </select>
          </div>

          <span class="arrow-icon"><img src="assets/img/arrow.svg" alt="icon" width="67" height="67" /></span>

          <div class="ctrl">
            <span><img src="assets/img/map_pin.svg" alt="icon" width="16" height="16" /></span>
            <label class="sr-only" for="toPlace">Хаашаа</label>
            <select id="toPlace">
              <option value="" disabled selected hidden>Хаашаа</option>
            </select>
          </div>

          <date-time-picker></date-time-picker>
        </div>

        <div class="bottom-row">
          <div class="ctrl wide">
            <span><img src="assets/img/fork.svg" alt="icon" width="40" height="38" /></span>
            <label class="sr-only" for="what">Юуг</label>
            <select id="what">
              <option value="" disabled selected hidden>Юуг</option>
            </select>
          </div>
        </div>

        <sh-cart class="cart"></sh-cart>

        <div class="top-row">
          <button class="btn btn--accent order-btn" data-role="order-action">Захиалах</button>
        </div>
      </section>

      <div class="offers-layout">
        <div class="offers-panel">
          <offers-list id="offers"></offers-list>
        </div>
        <aside class="delivery-cart-panel">
          <delivery-cart></delivery-cart>
        </aside>
      </div>
      <offer-modal></offer-modal>
      <confirm-modal></confirm-modal>
    `;
  }

  cacheEls() {
    this.fromSel = this.querySelector("#fromPlace");
    this.toSel = this.querySelector("#toPlace");
    this.whatSel = this.querySelector("#what");
    this.orderBtn = this.querySelector(".order-btn");
  }

  bindEvents() {
    this.handleOrderClick = () => this.prepareOrder();
    this.handleFromChange = (e) => this.onFromPlaceChange(e);

    if (this.orderBtn) {
      this.orderBtn.addEventListener("click", this.handleOrderClick);
    }
    if (this.fromSel) {
      this.fromSel.addEventListener("change", this.handleFromChange);
    }
  }

  bindConfirmModal() {
    this.confirmModal = this.querySelector("confirm-modal");
    if (!this.confirmModal) return;
    this.handleConfirm = () => this.confirmOrder();
    this.handleCancel = () => this.hideConfirmModal();
    this.confirmModal.addEventListener("confirm", this.handleConfirm);
    this.confirmModal.addEventListener("cancel", this.handleCancel);
  }

  async hydrateCustomerFromDb() {
    const user = await this.fetchCurrentUser();
    if (!user?.id) return;

    try {
      await this.syncCustomerInfo(user.id);
    } catch (e) {
      console.error("Failed to sync customer info:", e);
    }
  }

  async fetchCurrentUser() {
    if (this.currentUser) return this.currentUser;
    try {
      const res = await apiFetch("/api/auth/me");
      if (!res.ok) return null;
      const data = await res.json();
      this.currentUser = data?.user || null;
      return this.currentUser;
    } catch {
      return null;
    }
  }

  async syncCustomerInfo(userId) {
    if (!userId) return;
    const res = await apiFetch(`/api/customers/${userId}`);
    if (!res.ok) return;
    const data = await res.json();
    if (data) {
      window.dispatchEvent(new Event("user-updated"));
    }
  }

  async loadPlaces() {
    try {
      const [fromRes, toRes] = await Promise.all([
        apiFetch("/api/from-places"),
        apiFetch("/api/to-places"),
      ]);
      if (!fromRes.ok || !toRes.ok) return;

      const [from, to] = await Promise.all([fromRes.json(), toRes.json()]);
      this.fillPlaceSelect(this.fromSel, from, "Хаанаас", (p) =>
        `${p.name}${p.detail ? " - " + p.detail : ""}`
      );
      this.fillPlaceSelect(this.toSel, to, "Хаашаа", (p) => p.name);
    } catch (e) {
      console.warn("Failed to load places:", e);
    }
  }

  fillPlaceSelect(select, items, placeholder, labelFn) {
    if (!select) return;
    const list = Array.isArray(items) ? items : [];
    select.innerHTML = `<option value="" disabled selected hidden>${placeholder}</option>`;
    select.innerHTML += list
      .map((p) => `<option value="${p.id}">${labelFn(p)}</option>`)
      .join("");
  }

  async onFromPlaceChange(e) {
    const placeId = e?.target?.value;
    if (!placeId || !this.whatSel) return;

    try {
      const res = await apiFetch(`/api/menus/${placeId}`);
      if (!res.ok) return;
      const data = await res.json();
      const items = Array.isArray(data?.menu_json) ? data.menu_json : [];

      this.populateMenuSelect(items);
    } catch (err) {
      console.warn("Failed to load menu:", err);
    }
  }

  populateMenuSelect(items) {
    if (!this.whatSel) return;
    const foods = items.filter((i) => i.category === "food");
    const drinks = items.filter((i) => i.category === "drink");
    const others = items.filter((i) => !i.category);

    this.whatSel.innerHTML = `<option value="" disabled selected hidden>Юуг</option>`;
    this.appendMenuGroup("Идэх юм", foods);
    this.appendMenuGroup("Уух юм", drinks);
    this.appendMenuGroup("Бусад", others);
  }

  appendMenuGroup(label, items) {
    if (!items.length || !this.whatSel) return;
    const group = document.createElement("optgroup");
    group.label = label;
    items.forEach((item) => {
      const opt = document.createElement("option");
      opt.value = item.id;
      opt.dataset.price = item.price;
      opt.dataset.name = item.name;
      opt.textContent = `${item.name} — ${item.price}₮`;
      group.appendChild(opt);
    });
    this.whatSel.appendChild(group);
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

    return new Date().toISOString();
  }

  hideConfirmModal() {
    if (this.confirmModal && typeof this.confirmModal.close === "function") {
      this.confirmModal.close();
    }
    this.pendingOrder = null;
    this.pendingOffer = null;
  }

  prepareOrder() {
    if (!this.fromSel || !this.toSel || !this.whatSel) return;

    if (!this.fromSel.value) {
      alert("Хаанаасаа сонгоно уу");
      return;
    }
    if (!this.toSel.value) {
      alert("Хаашаагаа сонгоно уу");
      return;
    }

    const cartSummary = this.getCartSummary();
    const itemOpt = this.whatSel.selectedOptions?.[0];

    if (cartSummary.totalQty === 0 && (!itemOpt || !itemOpt.value)) {
      alert("Юуг (хоол/бараа) сонгоно уу");
      return;
    }

    const { fromName, fromDetail } = this.parseFromPlace(this.fromSel);
    const scheduledAt = this.getScheduledAtISO();
    const items = cartSummary.totalQty > 0
      ? this.buildItemsFromCart(cartSummary)
      : this.buildSingleItem(itemOpt);

    this.pendingOrder = {
      fromId: this.fromSel.value,
      toId: this.toSel.value,
      from: fromName,
      fromDetail,
      to: this.toSel.selectedOptions[0].textContent,
      createdAt: scheduledAt,
    };

    this.pendingOffer = {
      items,
      total: cartSummary.totalQty > 0
        ? cartSummary.total
        : items.reduce((sum, it) => sum + (it.price * it.qty), 0),
      deliveryFee: cartSummary.totalQty > 0 ? cartSummary.deliveryFee : 500,
      thumb: cartSummary.deliveryIcon || "assets/img/box.svg",
    };

    if (this.confirmModal && typeof this.confirmModal.open === "function") {
      this.confirmModal.open(this.pendingOrder, this.pendingOffer);
    }
  }

  getCartSummary() {
    const cartEl = this.querySelector("sh-cart");
    return cartEl?.getSummary() || { totalQty: 0, items: [], total: 0, deliveryFee: 0 };
  }

  parseFromPlace(select) {
    const raw = select.selectedOptions[0].textContent || "";
    const parts = raw.split(" - ");
    return {
      fromName: parts[0] || raw,
      fromDetail: parts[1] || "",
    };
  }

  buildItemsFromCart(cartSummary) {
    return cartSummary.items.map((it) => ({
      id: it.key || it.name,
      name: it.name,
      price: Number(it.unitPrice ?? it.price ?? 0),
      qty: it.qty,
    }));
  }

  buildSingleItem(itemOpt) {
    if (!itemOpt) return [];
    return [{
      id: itemOpt.value,
      name: (itemOpt.textContent || "").split(" — ")[0],
      price: Number(itemOpt.dataset.price || 0),
      qty: 1,
    }];
  }

  async confirmOrder() {
    if (!this.pendingOrder || !this.pendingOffer) {
      this.hideConfirmModal();
      return;
    }

    const user = await this.fetchCurrentUser();
    if (!user?.id) {
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
      customerId: user.id,
      fromPlaceId: this.pendingOrder.fromId,
      toPlaceId: this.pendingOrder.toId,
      scheduledAt: this.pendingOrder.createdAt,
      deliveryFee: Number.isFinite(this.pendingOffer.deliveryFee) ? this.pendingOffer.deliveryFee : 0,
      items: safeItems,
      customerName: user.name || "Зочин хэрэглэгч",
      customerPhone: user.phone || "00000000",
      customerStudentId: user.student_id || "",
      note: this.pendingOrder.fromDetail ? `Pickup: ${this.pendingOrder.fromDetail}` : null,
    };

    try {
      const resp = await apiFetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        alert(data?.error || "Захиалга үүсгэхэд алдаа гарлаа");
        return;
      }

      if (data?.customerId) {
        this.syncCustomerInfo(data.customerId);
      }

      const activeOrder = {
        ...this.pendingOrder,
        customer: {
          name: user.name || "Зочин хэрэглэгч",
          phone: user.phone || "00000000",
          studentId: user.student_id || "",
        },
      };

      try {
        await apiFetch("/api/active-order", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: activeOrder }),
        });
      } catch {
        // ignore
      }

      window.NumAppState?.setState("customer", "order_created");
      window.dispatchEvent(new Event("order-updated"));

      this.addOfferToLocalList(user, data);
      this.hideConfirmModal();
      this.scrollOffersIntoView();
    } catch {
      alert("Сервертэй холбогдож чадсангүй");
    }
  }

  addOfferToLocalList(user, data) {
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
      customer: {
        name: user.name || "Зочин хэрэглэгч",
        phone: user.phone || "00000000",
        studentId: user.student_id || "",
        avatar: user.avatar || "assets/img/profile.jpg",
      },
      sub: this.pendingOffer.items.map((it) => ({
        name: `${it.name} x${it.qty}`,
        price: this.formatPrice(it.price * it.qty),
      })),
    });

    localStorage.setItem("offers", JSON.stringify(existingOffers));
    const offersEl = this.querySelector("#offers");
    if (offersEl && "items" in offersEl) {
      offersEl.items = existingOffers;
    }
    window.dispatchEvent(new Event("offers-updated"));
  }

  scrollOffersIntoView() {
    const offersSection = document.querySelector("#offers");
    if (!offersSection || !offersSection.scrollIntoView) return;
    setTimeout(() => {
      offersSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  }
}

customElements.define("home-page", HomePage);
