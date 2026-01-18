import { apiFetch } from "../api_client.js";
import { formatMeta, formatPrice } from "../helper/format-d-ts-p.js";

class HomePage extends HTMLElement {
  connectedCallback() {
    /* nevtersn herglgch */
    this.currentUser = null;
    /* batalgaajuulhaas umnh zahialgiin medeellig hdglna */
    this.pendingOrder = null;
    /* batalgaajuulh modald hrgdh sags iin delgerngui*/
    this.pendingOffer = null;
    /* home ru orsn data neg udaa acaalna */
    this._loaded = false;

    this.handleRouteChange = () => this.onRouteChange();
    window.addEventListener("hashchange", this.handleRouteChange);

    this.render();
    this.Element_qs();
    this.confirmModal_events();
    this.events();
    this.handleRouteChange();
  }

  disconnectedCallback() {
    window.removeEventListener("hashchange", this.handleRouteChange);
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

  onRouteChange() {
    if (location.hash !== "#home" && location.hash !== "") return;
    if (this._loaded === true) return;
    // console.log(this._loaded);
    this._loaded = true;
    // console.log(this._loaded);
      this.load_places();
      this.check_customer();
  }

  render() {
    this.innerHTML = `

      <section class="filter-section">
        <div class="middle-row">
          <div class="ctrl">
            <span><img src="assets/img/map_pin.svg" alt="icon" width="16" height="16" /></span>
            <select id="fromPlace">
              <option value="" disabled selected hidden>Хаанаас</option>
            </select>
          </div>

          <span class="arrow-icon"><img src="assets/img/arrow.svg" alt="icon" width="67" height="67" /></span>

          <div class="ctrl">
            <span><img src="assets/img/map_pin.svg" alt="icon" width="16" height="16" /></span>
            <select id="toPlace">
              <option value="" disabled selected hidden>Хаашаа</option>
            </select>
          </div>

          <date-time-picker></date-time-picker>
        </div>

        <div class="bottom-row">
          <div class="ctrl wide">
            <span><img src="assets/img/fork.svg" alt="icon" width="40" height="38" /></span>
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
          <offers-list></offers-list>
        </div>
        <aside class="delivery-cart-panel">
          <delivery-cart></delivery-cart>
        </aside>
      </div>
      <offer-modal></offer-modal>
      <confirm-modal></confirm-modal>
    `;
  }

  Element_qs() {
    this.fromSel = this.querySelector("#fromPlace");
    this.toSel = this.querySelector("#toPlace");
    this.whatSel = this.querySelector("#what");
    this.orderBtn = this.querySelector(".order-btn");
  }

  events() {
    this.handleOrderClick = () => this.prepareOrder();
    this.handleFromChange = (e) => this.onFromPlaceChange(e);

    if (this.orderBtn) {
      this.orderBtn.addEventListener("click", this.handleOrderClick);
    }
    if (this.fromSel) {
      this.fromSel.addEventListener("change", this.handleFromChange);
    }
  }

  confirmModal_events() {
    this.confirmModal = this.querySelector("confirm-modal");
    if (!this.confirmModal) return;
    this.handleConfirm = () => this.confirmOrder();
    this.handleCancel = () => this.hideConfirmModal();
    this.confirmModal.addEventListener("confirm", this.handleConfirm);
    this.confirmModal.addEventListener("cancel", this.handleCancel);
  }

  async check_customer() {
    const user = await this.fetchCurrentUser();
    if (!user?.id) return;

    try {
      await this.syncCustomerInfo(user.id);
      // console.log(user.id);
    } catch (e) {
      console.error("herglegch shlghd aldaa grla", e);
    }
  }

  async fetchCurrentUser() {
    if (this.currentUser !== null) return this.currentUser;
    // console.log(this.currentUser);
    try {
      const res = await apiFetch("/api/auth/me");
      if (!res.ok) return null;
      // console.log(res);
      const data = await res.json();
      // console.log(data);
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

  async load_places() {
    try {
      const [fromRes, toRes] = await Promise.all([
        apiFetch("/api/from-places"),
        apiFetch("/api/to-places"),
      ]);
      if (!fromRes.ok || !toRes.ok) return;

      const [from, to] = await Promise.all([fromRes.json(), toRes.json()]);
      this.fillPlaceSelect(this.fromSel, from, "Хаанаас", (p) => p.name);
      this.fillPlaceSelect(this.toSel, to, "Хаашаа", (p) => p.name);
    } catch (e) {
      console.warn("gzr acaalh aldaa:", e);
    }
  }

  fillPlaceSelect(select, items, placeholder, labelFn) {
    if (!select) return;
    const list = items || [];
    // console.log(list, "ll");
    select.innerHTML = `<option value="" disabled selected hidden>${placeholder}</option>`;
    select.innerHTML += list
      .map((p) => `<option value="${p.id}">${labelFn(p)}</option>`)
      .join("");
  }

  async onFromPlaceChange(e) {
    const placeId = e?.target?.value;
    // console.log(placeId, "pp");
    if (!placeId || !this.whatSel) return;

    try {
      const res = await apiFetch(`/api/menus/${placeId}`);
      if (!res.ok) return;
      const data = await res.json();
      const items = data.menu_json || [];

      this.fromMenuSelect(items);
    } catch (err) {
      console.warn("menu acaalh aldaa:", err);
    }
  }

  fromMenuSelect(items) {
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
    if (items.length===0 || !this.whatSel) return;
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

  getScheduledAtISO() {
    const dateTimePicker = this.querySelector("date-time-picker");
    return dateTimePicker?.iso;
  }

  hideConfirmModal() {
    if (this.confirmModal?.close) {
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

    if (cartSummary.totalQty === 0) {
      alert("Юуг (хоол/бараа) сонгоно уу");
      return;
    }

    const scheduledAt = this.getScheduledAtISO();

    const items = this.buildItemsFromCart(cartSummary);
    // console.log(cartSummary.items, "ii");


    this.pendingOrder = {
      fromId: this.fromSel.value,
      toId: this.toSel.value,
      from: this.fromSel.selectedOptions[0].textContent,
      to: this.toSel.selectedOptions[0].textContent,
      scheduledAt: scheduledAt,
    };

    this.pendingOffer = {
      items,
      total: cartSummary.total,
      deliveryFee: cartSummary.totalQty > 0 ? cartSummary.deliveryFee : 500,
      thumb: cartSummary.deliveryIcon || "assets/img/document.svg",
    };

    if (this.confirmModal?.open) {
      this.confirmModal.open(this.pendingOrder, this.pendingOffer);
    }
  }

  getCartSummary() {
    const cartEl = this.querySelector("sh-cart");
    return cartEl?.getSummary() || { totalQty: 0, items: [], total: 0, deliveryFee: 0 };
  }

  buildItemsFromCart(cartSummary) {
    return cartSummary.items.map((it) => ({
      id: it.name,
      name: it.name,
      price: it.price,
      qty: it.qty,
    }));
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

    if (this.pendingOffer.items.length === 0) {
      alert("Сагс хоосон байна");
      return;
    }

    const safeItems = this.pendingOffer.items
      .map((i) => {
        return {
          menuItemKey: i.id,
          name: i.name,
          unitPrice: i.price,
          qty: i.qty,
        };
      })
      .filter((i) => i.qty > 0);

    const payload = {
      customerId: user.id,
      fromPlaceId: this.pendingOrder.fromId,
      toPlaceId: this.pendingOrder.toId,
      scheduledAt: this.pendingOrder.scheduledAt,
      deliveryFee: this.pendingOffer.deliveryFee,
      items: safeItems,
      customerName: user.name,
      customerPhone: user.phone,
      customerStudentId: user.student_id,
    };

    try {
      const resp = await apiFetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await resp.json();
      if (!resp.ok) {
        alert(data?.error || "Захиалга үүсгэхэд алдаа гарлаа");
        return;
      }

      const activeOrder = {
        ...this.pendingOrder,
        customer: {
          name: user.name,
          phone: user.phone,
          studentId: user.student_id,
        },
      };

      // console.log(activeOrder, "aa");

      try {
        await apiFetch("/api/active-order", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: activeOrder }),
        });
      } catch {
        
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
      meta: formatMeta(this.pendingOrder.scheduledAt),
      from: this.pendingOrder.from,
      to: this.pendingOrder.to,
      title: `${this.pendingOrder.from} - ${this.pendingOrder.to}`,
      price: formatPrice((data?.total ?? this.pendingOffer.total) || 0),
      thumb: this.pendingOffer.thumb || "assets/img/box.svg",
      customer: {
        name: user.name,
        phone: user.phone,
        studentId: user.student_id,
        avatar: user.avatar || "assets/img/profile.jpg",
      },
      sub: this.pendingOffer.items.map((it) => ({
        name: `${it.name} x${it.qty}`,
        price: formatPrice(it.price * it.qty),
      })),
    });

    localStorage.setItem("offers", JSON.stringify(existingOffers));
    const offersEl = this.querySelector("offers-list");
    if ("items" in offersEl) {
      offersEl.items = existingOffers;
    }
    window.dispatchEvent(new Event("offers-updated"));
  }

  scrollOffersIntoView() {
    const offersSection = document.querySelector("offers-list");
    setTimeout(() => {
      offersSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  }
}

customElements.define("home-page", HomePage);
