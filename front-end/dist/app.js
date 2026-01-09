(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // front-end/assets/api_client.js
  function apiFetch(path, init = {}) {
    const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
    return fetch(url, { credentials: "include", ...init });
  }
  var API_BASE;
  var init_api_client = __esm({
    "front-end/assets/api_client.js"() {
      API_BASE = "http://localhost:3000";
    }
  });

  // front-end/assets/pages/home-page.js
  var home_page_exports = {};
  var HomePage;
  var init_home_page = __esm({
    "front-end/assets/pages/home-page.js"() {
      init_api_client();
      HomePage = class extends HTMLElement {
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
            <label class="sr-only" for="fromPlace">\u0425\u0430\u0430\u043D\u0430\u0430\u0441</label>
            <select id="fromPlace">
              <option value="" disabled selected hidden>\u0425\u0430\u0430\u043D\u0430\u0430\u0441</option>
            </select>
          </div>

          <span class="arrow-icon"><img src="assets/img/arrow.svg" alt="icon" width="67" height="67" /></span>

          <div class="ctrl">
            <span><img src="assets/img/map_pin.svg" alt="icon" width="16" height="16" /></span>
            <label class="sr-only" for="toPlace">\u0425\u0430\u0430\u0448\u0430\u0430</label>
            <select id="toPlace">
              <option value="" disabled selected hidden>\u0425\u0430\u0430\u0448\u0430\u0430</option>
            </select>
          </div>

          <date-time-picker></date-time-picker>
        </div>

        <div class="bottom-row">
          <div class="ctrl wide">
            <span><img src="assets/img/fork.svg" alt="icon" width="40" height="38" /></span>
            <label class="sr-only" for="what">\u042E\u0443\u0433</label>
            <select id="what">
              <option value="" disabled selected hidden>\u042E\u0443\u0433</option>
            </select>
          </div>
        </div>

        <sh-cart class="cart"></sh-cart>

        <div class="top-row">
          <button class="btn btn--accent order-btn" data-role="order-action">\u0417\u0430\u0445\u0438\u0430\u043B\u0430\u0445</button>
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
              apiFetch("/api/to-places")
            ]);
            if (!fromRes.ok || !toRes.ok) return;
            const [from, to] = await Promise.all([fromRes.json(), toRes.json()]);
            this.fillPlaceSelect(
              this.fromSel,
              from,
              "\u0425\u0430\u0430\u043D\u0430\u0430\u0441",
              (p) => `${p.name}${p.detail ? " - " + p.detail : ""}`
            );
            this.fillPlaceSelect(this.toSel, to, "\u0425\u0430\u0430\u0448\u0430\u0430", (p) => p.name);
          } catch (e) {
            console.warn("Failed to load places:", e);
          }
        }
        fillPlaceSelect(select, items, placeholder, labelFn) {
          if (!select) return;
          const list = Array.isArray(items) ? items : [];
          select.innerHTML = `<option value="" disabled selected hidden>${placeholder}</option>`;
          select.innerHTML += list.map((p) => `<option value="${p.id}">${labelFn(p)}</option>`).join("");
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
          this.whatSel.innerHTML = `<option value="" disabled selected hidden>\u042E\u0443\u0433</option>`;
          this.appendMenuGroup("\u0418\u0434\u044D\u0445 \u044E\u043C", foods);
          this.appendMenuGroup("\u0423\u0443\u0445 \u044E\u043C", drinks);
          this.appendMenuGroup("\u0411\u0443\u0441\u0430\u0434", others);
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
            opt.textContent = `${item.name} \u2014 ${item.price}\u20AE`;
            group.appendChild(opt);
          });
          this.whatSel.appendChild(group);
        }
        formatPrice(n) {
          return Number(n || 0).toLocaleString("mn-MN") + "\u20AE";
        }
        formatMeta(ts) {
          const d = new Date(ts);
          if (isNaN(d.getTime())) return "";
          const date = d.toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "2-digit"
          });
          const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          return `${date} \u2022 ${time}`;
        }
        getScheduledAtISO() {
          const picker = this.querySelector("date-time-picker");
          const dateVal = picker?.shadowRoot?.querySelector(".date")?.value;
          const timeVal = picker?.shadowRoot?.querySelector(".time")?.value;
          if (dateVal && timeVal) {
            const iso = /* @__PURE__ */ new Date(`${dateVal}T${timeVal}:00`);
            if (!isNaN(iso.getTime())) return iso.toISOString();
          }
          return (/* @__PURE__ */ new Date()).toISOString();
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
            alert("\u0425\u0430\u0430\u043D\u0430\u0430\u0441\u0430\u0430 \u0441\u043E\u043D\u0433\u043E\u043D\u043E \u0443\u0443");
            return;
          }
          if (!this.toSel.value) {
            alert("\u0425\u0430\u0430\u0448\u0430\u0430\u0433\u0430\u0430 \u0441\u043E\u043D\u0433\u043E\u043D\u043E \u0443\u0443");
            return;
          }
          const cartSummary = this.getCartSummary();
          const itemOpt = this.whatSel.selectedOptions?.[0];
          if (cartSummary.totalQty === 0 && (!itemOpt || !itemOpt.value)) {
            alert("\u042E\u0443\u0433 (\u0445\u043E\u043E\u043B/\u0431\u0430\u0440\u0430\u0430) \u0441\u043E\u043D\u0433\u043E\u043D\u043E \u0443\u0443");
            return;
          }
          const { fromName, fromDetail } = this.parseFromPlace(this.fromSel);
          const scheduledAt = this.getScheduledAtISO();
          const items = cartSummary.totalQty > 0 ? this.buildItemsFromCart(cartSummary) : this.buildSingleItem(itemOpt);
          this.pendingOrder = {
            fromId: this.fromSel.value,
            toId: this.toSel.value,
            from: fromName,
            fromDetail,
            to: this.toSel.selectedOptions[0].textContent,
            createdAt: scheduledAt
          };
          this.pendingOffer = {
            items,
            total: cartSummary.totalQty > 0 ? cartSummary.total : items.reduce((sum, it) => sum + it.price * it.qty, 0),
            deliveryFee: cartSummary.totalQty > 0 ? cartSummary.deliveryFee : 500,
            thumb: cartSummary.deliveryIcon || "assets/img/box.svg"
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
            fromDetail: parts[1] || ""
          };
        }
        buildItemsFromCart(cartSummary) {
          return cartSummary.items.map((it) => ({
            id: it.key || it.name,
            name: it.name,
            price: Number(it.unitPrice ?? it.price ?? 0),
            qty: it.qty
          }));
        }
        buildSingleItem(itemOpt) {
          if (!itemOpt) return [];
          return [{
            id: itemOpt.value,
            name: (itemOpt.textContent || "").split(" \u2014 ")[0],
            price: Number(itemOpt.dataset.price || 0),
            qty: 1
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
            alert("\u0425\u0430\u0430\u043D\u0430\u0430\u0441/\u0425\u0430\u0430\u0448\u0430\u0430 \u0441\u043E\u043D\u0433\u043E\u043D\u043E \u0443\u0443");
            return;
          }
          if (!Array.isArray(this.pendingOffer.items) || this.pendingOffer.items.length === 0) {
            alert("\u0421\u0430\u0433\u0441 \u0445\u043E\u043E\u0441\u043E\u043D \u0431\u0430\u0439\u043D\u0430");
            return;
          }
          const safeItems = this.pendingOffer.items.map((i) => {
            const unitPrice = Number(i.price);
            const qty = Number(i.qty);
            return {
              menuItemKey: i.id,
              name: i.name,
              unitPrice: Number.isFinite(unitPrice) ? unitPrice : 0,
              qty: Number.isFinite(qty) && qty > 0 ? qty : 1,
              options: {}
            };
          }).filter((i) => i.qty > 0);
          const payload = {
            customerId: user.id,
            fromPlaceId: this.pendingOrder.fromId,
            toPlaceId: this.pendingOrder.toId,
            scheduledAt: this.pendingOrder.createdAt,
            deliveryFee: Number.isFinite(this.pendingOffer.deliveryFee) ? this.pendingOffer.deliveryFee : 0,
            items: safeItems,
            customerName: user.name || "\u0417\u043E\u0447\u0438\u043D \u0445\u044D\u0440\u044D\u0433\u043B\u044D\u0433\u0447",
            customerPhone: user.phone || "00000000",
            customerStudentId: user.student_id || "",
            note: this.pendingOrder.fromDetail ? `Pickup: ${this.pendingOrder.fromDetail}` : null
          };
          try {
            const resp = await apiFetch("/api/orders", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            });
            const data = await resp.json().catch(() => ({}));
            if (!resp.ok) {
              alert(data?.error || "\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u04AF\u04AF\u0441\u0433\u044D\u0445\u044D\u0434 \u0430\u043B\u0434\u0430\u0430 \u0433\u0430\u0440\u043B\u0430\u0430");
              return;
            }
            if (data?.customerId) {
              this.syncCustomerInfo(data.customerId);
            }
            const activeOrder = {
              ...this.pendingOrder,
              customer: {
                name: user.name || "\u0417\u043E\u0447\u0438\u043D \u0445\u044D\u0440\u044D\u0433\u043B\u044D\u0433\u0447",
                phone: user.phone || "00000000",
                studentId: user.student_id || ""
              }
            };
            try {
              await apiFetch("/api/active-order", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order: activeOrder })
              });
            } catch {
            }
            window.NumAppState?.setState("customer", "order_created");
            window.dispatchEvent(new Event("order-updated"));
            this.addOfferToLocalList(user, data);
            this.hideConfirmModal();
            this.scrollOffersIntoView();
          } catch {
            alert("\u0421\u0435\u0440\u0432\u0435\u0440\u0442\u044D\u0439 \u0445\u043E\u043B\u0431\u043E\u0433\u0434\u043E\u0436 \u0447\u0430\u0434\u0441\u0430\u043D\u0433\u04AF\u0439");
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
              name: user.name || "\u0417\u043E\u0447\u0438\u043D \u0445\u044D\u0440\u044D\u0433\u043B\u044D\u0433\u0447",
              phone: user.phone || "00000000",
              studentId: user.student_id || "",
              avatar: user.avatar || "assets/img/profile.jpg"
            },
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
          window.dispatchEvent(new Event("offers-updated"));
        }
        scrollOffersIntoView() {
          const offersSection = document.querySelector("#offers");
          if (!offersSection || !offersSection.scrollIntoView) return;
          setTimeout(() => {
            offersSection.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 150);
        }
      };
      customElements.define("home-page", HomePage);
    }
  });

  // front-end/assets/components/date-time-picker.js
  var date_time_picker_exports = {};
  var DateTimePicker;
  var init_date_time_picker = __esm({
    "front-end/assets/components/date-time-picker.js"() {
      DateTimePicker = class extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: "open" });
          this._timer = null;
        }
        connectedCallback() {
          this.render();
          this.updateToNow();
          this.startAutoUpdate();
        }
        disconnectedCallback() {
          clearInterval(this._timer);
        }
        render() {
          this.shadowRoot.innerHTML = `
      <style>
        @import url(/assets/css/style.css);

        :host {
          display: flex;
          gap: 0.5rem;
          flex: 1 1 auto;
        }

        .date-time-picker {
          display: flex;
          gap: 0.5rem;
          width: 100%;
          font-family: var(--font-family);
        }
      
        .wrapper {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0 0.75rem;
          height: 2.75rem;
          border: 0.0625rem solid var(--color-border);
          border-radius: var(--radius);
          transition: all 0.25s ease;
          background: var(--color-bg);
          flex: 1 1 0;
          min-width: 0;
          font-family: var(--font-family);
        }

        input {
          border: none;
          outline: none;
          background: transparent;
          width: 100%;
          font-size: var(--font-size-base, 0.875rem);
          font-family: var(--font-family);
          cursor: pointer;
          color: var(--color-text);
        }

        .wrapper:has(input:focus) {
          border-color: var(--color-accent, #d00);
          box-shadow: 0 0 0 0.15rem rgba(201, 13, 48, 0.18);
        }

        input[type="date"],
        input[type="time"] {
          accent-color: var(--color-accent, #d00);
          background-color: transparent;
        }

        input::-webkit-calendar-picker-indicator {
          cursor: pointer;
        }

        @media (prefers-color-scheme: dark) {
          input[type="date"],
          input[type="time"] {
            color-scheme: dark;
            background-color: var(--color-bg);
          }
        }

        @media (max-width: 54rem) {
          :host {
            gap: 0.5rem;
          }
          
          .date-time-picker {
            gap: 0.5rem;
          }
          
          .wrapper {
            padding: 0 0.625rem;
            gap: 0.375rem;
          }
        }
      </style>
      
      <div class="date-time-picker">
        <div class="wrapper">
          <input class="date" type="date" aria-label="\u041E\u0433\u043D\u043E\u043E \u0441\u043E\u043D\u0433\u043E\u0445">
        </div>
        <div class="wrapper">
          <input class="time" type="time" aria-label="\u0426\u0430\u0433 \u0441\u043E\u043D\u0433\u043E\u0445">
        </div>
      </div>
    `;
        }
        updateToNow() {
          const dateEl = this.shadowRoot.querySelector(".date");
          const timeEl = this.shadowRoot.querySelector(".time");
          const now = /* @__PURE__ */ new Date();
          const yyyy = now.getFullYear();
          const mm = String(now.getMonth() + 1).padStart(2, "0");
          const dd = String(now.getDate()).padStart(2, "0");
          const hh = String(now.getHours()).padStart(2, "0");
          const mins = String(now.getMinutes()).padStart(2, "0");
          dateEl.value = `${yyyy}-${mm}-${dd}`;
          timeEl.value = `${hh}:${mins}`;
        }
        startAutoUpdate() {
          this._timer = setInterval(() => {
            this.updateToNow();
          }, 1e3 * 30);
        }
        get value() {
          const d = this.shadowRoot.querySelector(".date").value;
          const t = this.shadowRoot.querySelector(".time").value;
          return `${d} \u2022 ${t}`;
        }
      };
      customElements.define("date-time-picker", DateTimePicker);
    }
  });

  // front-end/assets/components/sh-cart.js
  var sh_cart_exports = {};
  var ShCart;
  var init_sh_cart = __esm({
    "front-end/assets/components/sh-cart.js"() {
      ShCart = class extends HTMLElement {
        constructor() {
          super();
          this.prices = {
            "\u041A\u0438\u043C\u0431\u0430\u0431": 5500,
            "\u0411\u0443\u0440\u0433\u0435\u0440": 6500,
            "\u0411\u0443\u0443\u0437": 4e3,
            "\u0421\u0430\u043B\u0430\u0434": 3e3,
            "\u041A\u043E\u043B\u0430 0.5\u043B": 2500,
            "\u0425\u0430\u0440 \u0446\u0430\u0439": 1500,
            "\u041A\u043E\u0444\u0435": 3e3,
            "\u0416\u04AF\u04AF\u0441 0.33\u043B": 2500
          };
          this.deliveryIcons = {
            single: "assets/img/document.svg",
            medium: "assets/img/tor.svg",
            large: "assets/img/box.svg"
          };
        }
        connectedCallback() {
          this.render();
          this.initializeElements();
          this.setupEventListeners();
          this.updateTotalsAndCount();
        }
        render() {
          this.innerHTML = `
          <h3>\u0422\u0430\u043D\u044B \u0441\u0430\u0433\u0441</h3>
          <div class="cart-icon">
            <svg><path opacity="0.4" d="M8.26012 21.9703C9.1827 21.9703 9.93865 22.7536 9.93883 23.7213C9.93883 24.6776 9.18281 25.4615 8.26012 25.4615C7.32644 25.4613 6.57066 24.6775 6.57066 23.7213C6.57084 22.7537 7.32655 21.9704 8.26012 21.9703ZM20.767 21.9703C21.6894 21.9704 22.4455 22.7536 22.4457 23.7213C22.4457 24.6775 21.6896 25.4614 20.767 25.4615C19.8331 25.4615 19.0765 24.6776 19.0765 23.7213C19.0767 22.7536 19.8333 21.9703 20.767 21.9703Z" fill="#C90D30"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M22.4456 7.31518C23.1237 7.31518 23.5684 7.55713 24.0131 8.08714C24.4577 8.61714 24.5356 9.37757 24.4355 10.0677L23.3794 17.626C23.1793 19.0789 21.9787 20.1493 20.5669 20.1493H8.4385C6.95997 20.1493 5.73713 18.9741 5.61485 17.4543L4.5921 4.89445L2.91348 4.59489C2.46881 4.51423 2.15754 4.06488 2.23535 3.60401C2.31317 3.13162 2.74672 2.82053 3.20251 2.88966L5.85386 3.30445C6.23182 3.37473 6.50974 3.69619 6.54309 4.08793L6.75431 6.66881C6.78766 7.03865 7.0767 7.31518 7.43243 7.31518H22.4456ZM15.7089 13.3053H18.7882C19.2551 13.3053 19.622 12.9136 19.622 12.4412C19.622 11.9573 19.2551 11.5771 18.7882 11.5771H15.7089C15.242 11.5771 14.8751 11.9573 14.8751 12.4412C14.8751 12.9136 15.242 13.3053 15.7089 13.3053Z" fill="#C90D30"/>
            </svg>
            <span>0</span>
          </div>

          <div class="cart-content">
            <div></div>
            <div class="delivery-box">
              <p><b>\u0425\u04AF\u0440\u0433\u044D\u043B\u0442:</b></p>
              <img src="assets/img/box.svg" alt="delivery" width="57" height="57" decoding="async">
              <p>1500\u20AE</p>
            </div>

            <div class="total-box">
              <p><b>\u041D\u0438\u0439\u0442:</b></p>
              <p class="total-price">0\u20AE</p>
            </div>
          </div>
        `;
        }
        initializeElements() {
          this.totalPriceEl = this.querySelector(".total-price");
          this.deliveryPriceEl = this.querySelector(".delivery-box p:last-child");
          this.cartItemsContainer = this.querySelector(".cart-content > div:first-child");
          this.cartBadge = this.querySelector(".cart-icon span");
          this.foodSelect = document.querySelector("#what") || document.querySelector(".bottom-row select");
          this.deliveryImgEl = this.querySelector(".delivery-box img");
          if (!this.cartItemsContainer) {
            const cc = this.querySelector(".cart-content");
            if (cc) {
              const inner = document.createElement("div");
              cc.insertBefore(inner, cc.firstChild);
              this.cartItemsContainer = inner;
            }
          }
        }
        setupEventListeners() {
          if (this.foodSelect) {
            this.foodSelect.addEventListener("change", (e) => {
              const opt = e.target.selectedOptions?.[0];
              if (!opt) return;
              const name = (opt.dataset.name || opt.textContent || "").split(" \u2014 ")[0].trim();
              const price = Number(opt.dataset.price || 0);
              const img = e.target.selectedOptions && e.target.selectedOptions[0].dataset.img ? e.target.selectedOptions[0].dataset.img : "";
              this.addItemToCart(name, price, img);
              e.target.selectedIndex = 0;
            });
          }
          if (this.cartItemsContainer) {
            this.cartItemsContainer.addEventListener("click", (e) => {
              const delBtn = e.target.closest("svg.del-btn");
              if (!delBtn) return;
              const box = delBtn.closest(".item-box");
              if (!box) return;
              const qty = parseInt(box.dataset.qty || (box.querySelector("p")?.textContent.match(/(\d+)/) || [0, 1])[1], 10) || 1;
              const base = parseInt(box.dataset.price || this.parsePrice(box.querySelector(".price").textContent) / Math.max(qty, 1), 10) || 0;
              if (qty > 1) {
                const newQty = qty - 1;
                box.dataset.qty = String(newQty);
                box.querySelector("p").innerHTML = `<b>${this.escapeHtml(box.querySelector("b").textContent)}</b><br>${newQty} \u0448\u0438\u0440\u0445\u044D\u0433`;
                box.querySelector(".price").textContent = this.formatPrice(base * newQty);
              } else {
                box.remove();
              }
              this.updateTotalsAndCount();
            });
          }
        }
        addItemToCart(name, price, img = "") {
          if (!name) return;
          const existing = [...this.cartItemsContainer.querySelectorAll(".item-box")].find(
            (box) => box.querySelector("b") && box.querySelector("b").textContent.trim() === name
          );
          if (existing) {
            const qty = parseInt(existing.dataset.qty || (existing.querySelector("p")?.textContent.match(/(\d+)/) || [0, 1])[1], 10) || 1;
            const newQty = qty + 1;
            existing.dataset.qty = String(newQty);
            existing.querySelector("p").innerHTML = `<b>${this.escapeHtml(name)}</b><br>${newQty} \u0448\u0438\u0440\u0445\u044D\u0433`;
            const base = parseInt(existing.dataset.price || price, 10) || price;
            existing.dataset.price = String(base);
            existing.querySelector(".price").textContent = this.formatPrice(base * newQty);
          } else {
            const box = document.createElement("div");
            box.className = "item-box";
            box.dataset.qty = "1";
            box.dataset.price = String(price);
            const imgHtml = img ? `<img class="item-img" src="${this.escapeAttr(img)}" alt="${this.escapeAttr(name)}">` : "";
            box.innerHTML = `
                ${imgHtml}
                <p><b>${this.escapeHtml(name)}</b><br>1 \u0448\u0438\u0440\u0445\u044D\u0433</p>
                <p class="price">${this.formatPrice(price)}</p>
                <svg class="del-btn" viewBox="0 0 20 20" width="18" height="18" role="button" aria-label="remove">
                    <path d="M5.5415 15.75C5.10609 15.75 4.73334 15.6031 4.42327 15.3094C4.11321 15.0156 3.95817 14.6625 3.95817 14.25V4.5H3.1665V3H7.12484V2.25H11.8748V3H15.8332V4.5H15.0415V14.25C15.0415 14.6625 14.8865 15.0156 14.5764 15.3094C14.2663 15.6031 13.8936 15.75 13.4582 15.75H5.5415Z" fill="#C7C4CD"/>
                </svg>`;
            this.cartItemsContainer.appendChild(box);
          }
          this.updateTotalsAndCount();
        }
        updateTotalsAndCount() {
          const boxes = [...this.cartItemsContainer ? this.cartItemsContainer.querySelectorAll(".item-box") : []];
          let itemsTotal = 0;
          let totalQty = 0;
          const items = [];
          boxes.forEach((box) => {
            const qty = parseInt(box.dataset.qty || (box.querySelector("p")?.textContent.match(/(\d+)/) || [0, 1])[1], 10) || 1;
            const base = parseInt(box.dataset.price || this.parsePrice(box.querySelector(".price").textContent) / Math.max(qty, 1), 10) || 0;
            itemsTotal += base * qty;
            totalQty += qty;
            const name = box.querySelector("b")?.textContent?.trim() || "";
            items.push({ name, qty, price: base, unitPrice: base });
          });
          let deliveryFee = 0;
          let iconSrc = "assets/img/box.svg";
          if (totalQty > 10) {
            deliveryFee = 1500;
            iconSrc = this.deliveryIcons.large;
          } else if (totalQty >= 2) {
            deliveryFee = 1e3;
            iconSrc = this.deliveryIcons.medium;
          } else if (totalQty === 1) {
            deliveryFee = 500;
            iconSrc = this.deliveryIcons.single;
          } else {
            deliveryFee = 0;
            iconSrc = "assets/img/box.svg";
          }
          const deliveryText = itemsTotal > 0 ? this.formatPrice(deliveryFee) : "0\u20AE";
          if (this.deliveryPriceEl) this.deliveryPriceEl.textContent = deliveryText;
          const totalWithDelivery = itemsTotal > 0 ? itemsTotal + deliveryFee : 0;
          if (this.totalPriceEl) this.totalPriceEl.textContent = this.formatPrice(totalWithDelivery);
          if (this.cartBadge) this.cartBadge.textContent = String(totalQty);
          if (this.deliveryImgEl) {
            this.deliveryImgEl.src = itemsTotal > 0 ? iconSrc : "assets/img/box.svg";
            this.deliveryImgEl.alt = `delivery tier ${totalQty}`;
          }
          this.style.display = totalQty === 0 ? "none" : "block";
          this.summary = {
            items,
            itemsTotal,
            deliveryFee,
            total: totalWithDelivery,
            totalQty,
            deliveryIcon: iconSrc
          };
        }
        parsePrice(str) {
          return parseInt(String(str || "").replace(/[^\d]/g, ""), 10) || 0;
        }
        formatPrice(n) {
          return Number(n).toLocaleString("mn-MN") + "\u20AE";
        }
        getSummary() {
          return this.summary || { items: [], itemsTotal: 0, deliveryFee: 0, total: 0, totalQty: 0 };
        }
        escapeAttr(s) {
          return String(s || "").replace(/"/g, "&quot;").replace(/</g, "&lt;");
        }
        escapeHtml(s) {
          return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        }
      };
      window.customElements.define("sh-cart", ShCart);
    }
  });

  // front-end/assets/components/offer-card.js
  function parseJsonAttr(raw, fallback) {
    if (!raw) return fallback;
    try {
      const decoded = decodeURIComponent(raw);
      return JSON.parse(decoded);
    } catch {
      return fallback;
    }
  }
  function escapeHtml(value) {
    return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }
  var OfferCard;
  var init_offer_card = __esm({
    "front-end/assets/components/offer-card.js"() {
      OfferCard = class extends HTMLElement {
        static get observedAttributes() {
          return ["thumb", "title", "meta", "price", "sub", "customer", "order-id"];
        }
        connectedCallback() {
          if (this._ready) return;
          this._ready = true;
          this.render();
          this.attach();
        }
        attributeChangedCallback() {
          if (this._ready) this.render();
        }
        get data() {
          return {
            thumb: this.getAttribute("thumb") || "assets/img/box.svg",
            title: this.getAttribute("title") || "",
            meta: this.getAttribute("meta") || "",
            price: this.getAttribute("price") || "",
            orderId: this.getAttribute("order-id") || "",
            sub: parseJsonAttr(this.getAttribute("sub"), []),
            customer: parseJsonAttr(this.getAttribute("customer"), {})
          };
        }
        render() {
          const { thumb, title, meta, price } = this.data;
          this.innerHTML = `
      <article class="offer-card" role="button" tabindex="0">
        <div class="offer-thumb">
          <img src="${escapeHtml(thumb)}" alt="icon" width="57" height="57" decoding="async"/>
        </div>
        <div class="offer-info">
          <div class="offer-title">${escapeHtml(title)}</div>
          <div class="offer-meta">${escapeHtml(meta)}</div>
        </div>
        <div class="offer-price">${escapeHtml(price)}</div>
      </article>
    `;
        }
        attach() {
          this.addEventListener("click", () => {
            const detail = this.data;
            this.dispatchEvent(new CustomEvent("offer-select", { bubbles: true, detail }));
          });
          this.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              this.click();
            }
          });
        }
      };
      if (!customElements.get("offer-card")) {
        customElements.define("offer-card", OfferCard);
      }
    }
  });

  // front-end/assets/components/offer-list.js
  var offer_list_exports = {};
  __export(offer_list_exports, {
    OffersList: () => OffersList
  });
  function renderOfferCard(item) {
    const thumb = escapeAttr(item.thumb || "assets/img/box.svg");
    const title = escapeAttr(item.title || "");
    const meta = escapeAttr(item.meta || "");
    const price = escapeAttr(item.price || "");
    const orderId = escapeAttr(item.orderId || item.id || "");
    const sub = encodeURIComponent(JSON.stringify(item.sub || []));
    const customer = encodeURIComponent(JSON.stringify(item.customer || {}));
    return `
    <offer-card
      thumb="${thumb}"
      title="${title}"
      meta="${meta}"
      sub="${sub}"
      price="${price}"
      order-id="${orderId}"
      customer="${customer}">
    </offer-card>
  `;
  }
  function escapeAttr(value) {
    return String(value ?? "").replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  }
  function formatMetaFromDate(ts) {
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return "";
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yy = String(d.getFullYear()).slice(-2);
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${mm}/${dd}/${yy}  \u2022${hh}:${min}`;
  }
  function parseMetaDate(metaString) {
    try {
      const parts = metaString.split("\u2022");
      if (parts.length < 2) return null;
      const datePart = parts[0].trim();
      const timePart = parts[1].trim();
      const [month, day, year] = datePart.split("/");
      const [hours, minutes] = timePart.split(":");
      const fullYear = 2e3 + Number.parseInt(year, 10);
      return new Date(fullYear, month - 1, day, hours, minutes);
    } catch (e) {
      console.error("Error parsing date from meta:", e, metaString);
      return null;
    }
  }
  function parseOrderTimestamp(order) {
    const raw = order?.scheduled_at || order?.scheduledAt || order?.created_at || order?.createdAt || order?.meta || null;
    if (!raw) return null;
    const parsed = Date.parse(raw);
    if (!Number.isNaN(parsed)) return parsed;
    if (typeof raw === "string") {
      const metaDate = parseMetaDate(raw);
      if (metaDate) return metaDate.getTime();
    }
    return null;
  }
  function isOrderExpired(order) {
    const ts = parseOrderTimestamp(order);
    if (!ts) return true;
    return ts < Date.now();
  }
  function formatPrice(amount) {
    return Number(amount || 0).toLocaleString("mn-MN") + "\u20AE";
  }
  function getDeliveryIcon(totalQty) {
    if (totalQty > 10) return DELIVERY_ICONS.large;
    if (totalQty >= 2) return DELIVERY_ICONS.medium;
    if (totalQty === 1) return DELIVERY_ICONS.single;
    return DELIVERY_ICONS.large;
  }
  function mapOrdersToOffers(orders) {
    return orders.filter((order) => {
      const status = String(order?.status || "").toLowerCase();
      if (status === "delivered" || status === "cancelled" || status === "canceled") return false;
      if (order?.courier) return false;
      return !isOrderExpired(order);
    }).map((order) => {
      const ts = parseOrderTimestamp(order);
      const meta = ts ? formatMetaFromDate(ts) : "";
      const items = Array.isArray(order?.items) ? order.items : [];
      const totalQty = items.reduce((sum, it) => sum + (Number(it?.qty) || 0), 0);
      const customer = order?.customer || {};
      return {
        orderId: order.id,
        title: `${order.from_name || ""} - ${order.to_name || ""}`.trim(),
        meta,
        price: formatPrice(order.total_amount || 0),
        thumb: getDeliveryIcon(totalQty),
        customer,
        sub: items.map((it) => ({
          name: `${it.name || ""} x${it.qty || 1}`.trim(),
          price: ""
        }))
      };
    });
  }
  async function fetchOffersFromApi() {
    const res = await apiFetch("/api/orders");
    const data = await res.json().catch(() => []);
    if (!res.ok) {
      throw new Error(data?.error || "Failed to load orders");
    }
    if (!Array.isArray(data)) return [];
    return mapOrdersToOffers(data);
  }
  function readLocalOffers() {
    const raw = localStorage.getItem("offers");
    if (!raw) return [];
    try {
      return JSON.parse(raw) || [];
    } catch {
      return [];
    }
  }
  function getRemovedStorageKey(baseKey) {
    const authKey = localStorage.getItem("authUserKey");
    return authKey ? `${baseKey}:${authKey}` : baseKey;
  }
  function readRemovedOfferIds() {
    const raw = localStorage.getItem(getRemovedStorageKey("removed_offer_ids"));
    if (!raw) return [];
    try {
      return JSON.parse(raw) || [];
    } catch {
      return [];
    }
  }
  function readRemovedOfferKeys() {
    const raw = localStorage.getItem(getRemovedStorageKey("removed_offer_keys"));
    if (!raw) return [];
    try {
      return JSON.parse(raw) || [];
    } catch {
      return [];
    }
  }
  function filterRemovedOffers(offers) {
    const removedIds = readRemovedOfferIds();
    const removedKeys = readRemovedOfferKeys();
    if (!removedIds.length && !removedKeys.length) return offers;
    return offers.filter((offer) => {
      const offerId = offer?.orderId || offer?.id || null;
      if (offerId && removedIds.includes(String(offerId))) return false;
      const key = `${offer?.title || ""}|${offer?.meta || ""}|${offer?.price || ""}`;
      return !removedKeys.includes(key);
    });
  }
  function filterExpiredOffers(offers) {
    return offers.filter((offer) => {
      if (!offer.meta) return true;
      const parsed = parseMetaDate(offer.meta);
      if (!parsed) return true;
      return parsed.getTime() >= Date.now();
    });
  }
  async function loadOffers() {
    let offers = [];
    try {
      offers = await fetchOffersFromApi();
      offers = filterRemovedOffers(offers);
      if (offers.length) {
        localStorage.setItem("offers", JSON.stringify(offers));
      }
    } catch {
      offers = filterRemovedOffers(readLocalOffers());
    }
    if (!offers.length) {
      offers = SEED_OFFERS;
    } else {
      offers = filterExpiredOffers(offers);
    }
    offers = filterRemovedOffers(offers);
    localStorage.setItem("offers", JSON.stringify(offers));
    document.querySelectorAll("offers-list").forEach((list) => {
      list.items = offers;
    });
  }
  var OffersList, DELIVERY_ICONS, SEED_OFFERS;
  var init_offer_list = __esm({
    "front-end/assets/components/offer-list.js"() {
      init_api_client();
      init_offer_card();
      OffersList = class extends HTMLElement {
        connectedCallback() {
          if (this._ready) return;
          this._ready = true;
          this.render();
          this.handleOffersUpdated = () => loadOffers();
          window.addEventListener("offers-updated", this.handleOffersUpdated);
          this.addEventListener("offer-select", this.handleOfferSelect);
          loadOffers();
        }
        disconnectedCallback() {
          if (this.handleOffersUpdated) {
            window.removeEventListener("offers-updated", this.handleOffersUpdated);
          }
          this.removeEventListener("offer-select", this.handleOfferSelect);
        }
        render() {
          this.innerHTML = `
      <section class="offers-container">
        <div class="offers-row"></div>
      </section>
    `;
        }
        set items(list) {
          this.renderItems(list);
        }
        renderItems(list) {
          const row = this.querySelector(".offers-row");
          if (!row) return;
          const items = Array.isArray(list) ? list : [];
          row.innerHTML = items.map(renderOfferCard).join("");
        }
        handleOfferSelect(event) {
          const modal = document.querySelector("offer-modal");
          if (!modal || typeof modal.show !== "function") return;
          modal.show(event.detail);
        }
      };
      if (!customElements.get("offers-list")) {
        customElements.define("offers-list", OffersList);
      }
      DELIVERY_ICONS = {
        single: "assets/img/document.svg",
        medium: "assets/img/tor.svg",
        large: "assets/img/box.svg"
      };
      SEED_OFFERS = [
        {
          thumb: "assets/img/box.svg",
          title: "GL burger - 7-\u0440 \u0431\u0430\u0439\u0440 207",
          meta: "11/21/25 \u2022 14:00",
          price: "10,000\u20AE",
          sub: [
            { name: "\u0411\u0443\u0443\u0437", price: "5000\u20AE" },
            { name: "\u0421\u04AF\u04AF", price: "2000\u20AE" }
          ]
        },
        {
          thumb: "assets/img/document.svg",
          title: "GL burger - 7-\u0440 \u0431\u0430\u0439\u0440 207",
          meta: "11/21/25 \u2022 14:00",
          price: "10,000\u20AE",
          sub: [
            { name: "\u0411\u0443\u0443\u0437", price: "5000\u20AE" },
            { name: "\u0421\u04AF\u04AF", price: "2000\u20AE" }
          ]
        },
        {
          thumb: "assets/img/tor.svg",
          title: "GL burger - 7-\u0440 \u0431\u0430\u0439\u0440 207",
          meta: "11/21/25 \u2022 14:00",
          price: "10,000\u20AE",
          sub: [
            { name: "\u0411\u0443\u0443\u0437", price: "5000\u20AE" },
            { name: "\u0421\u04AF\u04AF", price: "2000\u20AE" }
          ]
        },
        {
          thumb: "assets/img/tor.svg",
          title: "GL burger - 7-\u0440 \u0431\u0430\u0439\u0440 207",
          meta: "12/31/25 \u2022 22:20",
          price: "10,000\u20AE",
          sub: [
            { name: "\u0411\u0443\u0443\u0437", price: "5000\u20AE" },
            { name: "\u0421\u04AF\u04AF", price: "2000\u20AE" }
          ]
        }
      ];
    }
  });

  // front-end/assets/components/delivery-cart.js
  var delivery_cart_exports = {};
  var DeliveryCart;
  var init_delivery_cart = __esm({
    "front-end/assets/components/delivery-cart.js"() {
      DeliveryCart = class extends HTMLElement {
        connectedCallback() {
          this.handleUpdate = this.handleUpdate.bind(this);
          this.handleClick = this.handleClick.bind(this);
          this.handleViewportChange = this.handleViewportChange.bind(this);
          this.render();
          this.cacheEls();
          this.addEventListener("click", this.handleClick);
          window.addEventListener("delivery-cart-updated", this.handleUpdate);
          this.mediaQuery = window.matchMedia("(max-width: 900px)");
          this.mediaQuery.addEventListener("change", this.handleViewportChange);
          this.handleViewportChange();
          this.load();
        }
        disconnectedCallback() {
          window.removeEventListener("delivery-cart-updated", this.handleUpdate);
          this.removeEventListener("click", this.handleClick);
          if (this.mediaQuery) {
            this.mediaQuery.removeEventListener("change", this.handleViewportChange);
          }
        }
        render() {
          this.innerHTML = `
      <div class="delivery-cart">
        <div class="delivery-cart__header">
          <h3>\u0425\u04AF\u0440\u0433\u044D\u043B\u0442\u0438\u0439\u043D \u0441\u0430\u0433\u0441</h3>
          <span class="delivery-cart__count">0</span>
        </div>
        <div class="delivery-cart__list"></div>
        <p class="delivery-cart__empty">\u041E\u0434\u043E\u043E\u0433\u043E\u043E\u0440 \u0445\u04AF\u0440\u0433\u044D\u043B\u0442 \u0441\u043E\u043D\u0433\u043E\u043E\u0433\u04AF\u0439 \u0431\u0430\u0439\u043D\u0430.</p>
        <button class="delivery-cart__go" type="button">\u0425\u04AF\u0440\u0433\u044D\u043B\u0442 \u0440\u04AF\u04AF</button>
      </div>
    `;
        }
        cacheEls() {
          this.listEl = this.querySelector(".delivery-cart__list");
          this.emptyEl = this.querySelector(".delivery-cart__empty");
          this.countEl = this.querySelector(".delivery-cart__count");
          this.goBtn = this.querySelector(".delivery-cart__go");
        }
        load() {
          if (this.isHiddenOnMobile) {
            return;
          }
          this.fetchItems();
        }
        async fetchItems() {
          try {
            const res = await fetch("/api/delivery-cart");
            if (!res.ok) {
              this.items = [];
            } else {
              const data = await res.json();
              this.items = Array.isArray(data?.items) ? data.items : [];
            }
          } catch (e) {
            this.items = [];
          }
          this.renderList();
        }
        renderList() {
          if (!this.listEl) return;
          if (this.isHiddenOnMobile) {
            this.style.display = "none";
            const layout2 = this.closest(".offers-layout");
            if (layout2) layout2.classList.remove("has-cart");
            return;
          }
          const items = Array.isArray(this.items) ? this.items : [];
          this.listEl.innerHTML = "";
          const layout = this.closest(".offers-layout");
          if (!items.length) {
            this.style.display = "none";
            if (layout) layout.classList.remove("has-cart");
            if (this.emptyEl) this.emptyEl.style.display = "block";
            if (this.countEl) this.countEl.textContent = "0";
            if (this.goBtn) this.goBtn.style.display = "none";
            return;
          }
          this.style.display = "block";
          if (layout) layout.classList.add("has-cart");
          if (this.emptyEl) this.emptyEl.style.display = "none";
          if (this.goBtn) this.goBtn.style.display = "inline-flex";
          let count = 0;
          items.forEach((item) => {
            const qty = Number(item.qty || 1);
            const price = this.parsePrice(item.price);
            count += qty;
            const sub = Array.isArray(item.sub) ? item.sub : [];
            const subText = sub.length ? sub.map((s) => s.name).filter(Boolean).join(", ") : "\u0411\u0430\u0440\u0430\u0430 \u0430\u043B\u0433\u0430";
            const row = document.createElement("div");
            row.className = "delivery-cart__item";
            row.dataset.id = item.id || "";
            row.innerHTML = `
        <div class="delivery-cart__thumb">
          <img src="${this.escapeAttr(item.thumb || "assets/img/box.svg")}" alt="" width="57" height="57" decoding="async">
        </div>
        <div class="delivery-cart__info">
          <div class="delivery-cart__title">${this.escapeHtml(item.title || "")}</div>
          <div class="delivery-cart__meta">${this.escapeHtml(item.meta || "")}</div>
          <div class="delivery-cart__sub">${this.escapeHtml(subText)}</div>
        </div>
        <div class="delivery-cart__price">
          <span>${this.formatPrice(price * qty)}</span>
          <button class="delivery-cart__remove" type="button" data-action="remove">\u2212</button>
          <span class="delivery-cart__qty">x${qty}</span>
        </div>
      `;
            this.listEl.appendChild(row);
          });
          if (this.countEl) this.countEl.textContent = String(count);
        }
        handleClick(e) {
          const goBtn = e.target.closest(".delivery-cart__go");
          if (goBtn) {
            location.hash = "#delivery";
            return;
          }
          const btn = e.target.closest("[data-action='remove']");
          if (!btn) return;
          const itemEl = btn.closest(".delivery-cart__item");
          const id = itemEl?.dataset?.id;
          if (!id) return;
          this.decrementItem(id);
        }
        handleUpdate() {
          this.load();
        }
        handleViewportChange() {
          this.isHiddenOnMobile = this.mediaQuery?.matches;
          if (this.isHiddenOnMobile) {
            this.style.display = "none";
            const layout = this.closest(".offers-layout");
            if (layout) layout.classList.remove("has-cart");
            return;
          }
          this.load();
        }
        async decrementItem(id) {
          try {
            const res = await fetch(`/api/delivery-cart/${encodeURIComponent(id)}`, {
              method: "PATCH"
            });
            if (!res.ok) {
              return;
            }
          } catch (e) {
            return;
          }
          this.load();
          window.dispatchEvent(new Event("delivery-cart-updated"));
        }
        parsePrice(str) {
          return parseInt(String(str || "").replace(/[^\d]/g, ""), 10) || 0;
        }
        formatPrice(n) {
          return Number(n || 0).toLocaleString("mn-MN") + "\u20AE";
        }
        escapeHtml(s) {
          return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        }
        escapeAttr(s) {
          return String(s || "").replace(/"/g, "&quot;");
        }
      };
      customElements.define("delivery-cart", DeliveryCart);
    }
  });

  // front-end/assets/components/offer-modal.js
  var offer_modal_exports = {};
  var OfferModal;
  var init_offer_modal = __esm({
    "front-end/assets/components/offer-modal.js"() {
      OfferModal = class extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          this.render();
          this.cacheEls();
          this.bindEvents();
        }
        render() {
          this.API = "http://localhost:3000";
          this.shadowRoot.innerHTML = `
      <style>
        :host {
          --accent: var(--color-accent, #c90d30);
          --radius: 14px;
          --text: #1f2937;
          --muted: #6b7280;
          font-family: "Roboto", "Poppins", sans-serif;
        }
        .modal {
          position: fixed;
          inset: 0;
          display: none;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(6px);
          z-index: 10000;
          padding: 1rem;
        }
        .modal.open { display: flex; }

        .card {
          background: #fff;
          border-radius: var(--radius);
          width: min(540px, 100%);
          box-shadow: 0 22px 60px rgba(0, 0, 0, 0.18);
          padding: 1.35rem 1.5rem;
          position: relative;
          border: 1px solid rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }

        .title-wrap {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .thumb {
          width: 60px;
          height: 60px;
          border-radius: 14px;
          object-fit: cover;
          background: #f5f6fb;
          box-shadow: inset 0 0 0 1px #eef0f6;
        }

        h2 {
          margin: 0;
          font-size: 1.2rem;
          color: var(--text);
        }

        .meta {
          margin: 0.1rem 0 0;
          color: var(--muted);
          font-size: 0.95rem;
        }

        .close-btn {
          background: transparent;
          border: none;
          font-size: 1.3rem;
          cursor: pointer;
          padding: 0.3rem 0.45rem;
          border-radius: 8px;
          color: var(--muted);
        }
        .close-btn:hover { background: #f3f4f6; }

        .list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }
        .list li {
          background: #f8f9fc;
          border-radius: 10px;
          padding: 0.6rem 0.75rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--text);
          border: 1px solid #eef0f6;
        }
        .list span.price {
          font-weight: 700;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 700;
          font-size: 1rem;
          color: var(--text);
        }
        .price-row .pill {
          background: rgba(201, 13, 48, 0.08);
          color: var(--accent);
          padding: 0.3rem 0.75rem;
          border-radius: 999px;
          font-weight: 800;
        }

        .courier {
          border: 1px solid #eef0f6;
          border-radius: 12px;
          padding: 0.75rem 0.85rem;
          background: #f8f9fc;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 0.7rem;
          align-items: center;
        }
        .courier img {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          object-fit: cover;
          background: #fff;
          border: 1px solid #e5e7eb;
        }
        .courier h4 {
          margin: 0;
          font-size: 1rem;
          color: var(--text);
        }
        .courier p {
          margin: 0.1rem 0 0;
          color: var(--muted);
          font-size: 0.9rem;
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
        }

        button {
          font-weight: 600;
          cursor: pointer;
        }

        .delete {
          background: #fff;
          color: var(--muted);
          border-radius: 10px;
          padding: 0.65rem 1.25rem;
          border: 1px solid #e5e7eb;
        }
        .confirm {
          padding: 0.65rem 1.25rem;
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 700;
          box-shadow: 0 10px 30px rgba(201, 13, 48, 0.25);
          transition: transform 0.15s ease;
        }
        .confirm:hover { transform: translateY(-1px); }

        @media (prefers-color-scheme: dark) {
          :host {
            --text: #e5e7eb;
            --muted: #9aa4b2;
          }

          .card {
            background: #0f172a;
            border-color: #243040;
            box-shadow: 0 22px 60px rgba(0, 0, 0, 0.45);
          }

          .thumb {
            background: #111827;
            box-shadow: inset 0 0 0 1px #243040;
          }

          .close-btn:hover {
            background: #1f2937;
          }

          .list li {
            background: #111827;
            border-color: #243040;
          }

          .courier {
            background: #111827;
            border-color: #243040;
          }

          .courier img {
            background: #0b0f14;
            border-color: #243040;
          }

          .delete {
            background: #111827;
            color: var(--muted);
            border-color: #243040;
          }
        }
      </style>
      <div class="modal">
        <div class="card">
          <header>
            <div class="title-wrap">
              <img class="thumb" id="thumb" alt="">
              <div>
                <h2 id="title"></h2>
                <p class="meta" id="meta"></p>
              </div>
            </div>
            <button class="close-btn" aria-label="\u0425\u0430\u0430\u0445">\xD7</button>
          </header>

          <div>
            <p class="meta" style="margin:0 0 0.4rem;">\u0411\u0430\u0440\u0430\u0430\u043D\u044B \u0436\u0430\u0433\u0441\u0430\u0430\u043B\u0442</p>
            <ul class="list" id="sub"></ul>
          </div>

          <div class="price-row">
            <span>\u041D\u0438\u0439\u0442 \u04AF\u043D\u044D</span>
            <span class="pill" id="price">0\u20AE</span>
          </div>

          <div>
            <p class="meta" style="margin:0 0 0.4rem;">\u0417\u0430\u0445\u0438\u0430\u043B\u0430\u0433\u0447</p>
            <div class="courier" id="customerCard">
              <img id="customerAvatar" alt="\u0417\u0430\u0445\u0438\u0430\u043B\u0430\u0433\u0447\u0438\u0439\u043D \u0437\u0443\u0440\u0430\u0433" />
              <div>
                <h4 id="customerName"></h4>
                <p id="customerPhone"></p>
                <p id="customerId"></p>
              </div>
            </div>
          </div>

          <div class="actions">
            <button class="delete" type="button">\u0423\u0441\u0442\u0433\u0430\u0445</button>
            <button class="confirm" type="button" data-role="courier-action">\u0425\u04AF\u0440\u0433\u044D\u0445</button>
          </div>
        </div>
      </div>
    `;
        }
        cacheEls() {
          this.modal = this.shadowRoot.querySelector(".modal");
          this.card = this.shadowRoot.querySelector(".card");
          this.titleEl = this.shadowRoot.getElementById("title");
          this.metaEl = this.shadowRoot.getElementById("meta");
          this.thumbEl = this.shadowRoot.getElementById("thumb");
          this.subEl = this.shadowRoot.getElementById("sub");
          this.priceEl = this.shadowRoot.getElementById("price");
          this.customerCard = this.shadowRoot.getElementById("customerCard");
          this.customerAvatar = this.shadowRoot.getElementById("customerAvatar");
          this.customerName = this.shadowRoot.getElementById("customerName");
          this.customerPhone = this.shadowRoot.getElementById("customerPhone");
          this.customerId = this.shadowRoot.getElementById("customerId");
          this.closeBtn = this.shadowRoot.querySelector(".close-btn");
          this.deleteBtn = this.shadowRoot.querySelector(".delete");
          this.confirmBtn = this.shadowRoot.querySelector(".confirm");
        }
        bindEvents() {
          this.closeBtn.addEventListener("click", () => this.close());
          this.modal.addEventListener("click", (e) => {
            if (e.target === this.modal) this.close();
          });
          this.deleteBtn.addEventListener("click", () => {
            this.handleDelete();
          });
          this.confirmBtn.addEventListener("click", () => this.handleConfirm());
        }
        // Offers жагсаалтыг шинэчлэх туслах арга
        refreshOffersList() {
          window.dispatchEvent(new Event("offers-updated"));
        }
        show(data) {
          if (!this.modal) return;
          this.currentData = data;
          this.thumbEl.src = data.thumb || "assets/img/box.svg";
          this.thumbEl.alt = data.title || "offer thumbnail";
          this.titleEl.textContent = data.title || "\u0421\u0430\u043D\u0430\u043B";
          this.metaEl.textContent = data.meta || "";
          const sub = Array.isArray(data.sub) ? data.sub : [];
          this.subEl.innerHTML = sub.map((item) => {
            const name = item?.name || "";
            const price = item?.price || "";
            return `<li><span>${name}</span><span class="price">${price}</span></li>`;
          }).join("") || '<li><span>\u0411\u0430\u0440\u0430\u0430 \u0430\u043B\u0433\u0430</span><span class="price">-</span></li>';
          this.priceEl.textContent = data.price ? String(data.price) : "0\u20AE";
          const customer = data?.customer || {};
          const customerName = customer?.name || "\u0422\u043E\u0434\u043E\u0440\u0445\u043E\u0439\u0433\u04AF\u0439";
          const customerPhone = customer?.phone || "\u0423\u0442\u0430\u0441\u0433\u04AF\u0439";
          const customerId = customer?.student_id || customer?.studentId || "ID \u0431\u0430\u0439\u0445\u0433\u04AF\u0439";
          if (this.customerCard) {
            this.customerCard.style.display = customerName || customerPhone || customerId ? "" : "none";
          }
          if (this.customerAvatar) {
            this.customerAvatar.src = customer?.avatar || "assets/img/profile.jpg";
            this.customerAvatar.alt = customerName;
          }
          if (this.customerName) this.customerName.textContent = customerName;
          if (this.customerPhone) this.customerPhone.textContent = customerPhone;
          if (this.customerId) this.customerId.textContent = `ID: ${customerId}`;
          this.modal.classList.add("open");
        }
        close() {
          if (this.modal) this.modal.classList.remove("open");
        }
        parseMetaToISO(meta) {
          if (!meta) return null;
          const sanitized = meta.replace("\u2022", "");
          const parsed = Date.parse(sanitized);
          if (!Number.isNaN(parsed)) return new Date(parsed).toISOString();
          return null;
        }
        buildActiveOrder(data, orderDetail) {
          const [fromRaw = "", toRaw = ""] = (data.title || "").split("-").map((s) => s.trim());
          const firstItem = Array.isArray(data.sub) && data.sub.length ? data.sub[0] : null;
          const customer = orderDetail?.customer || data?.customer || null;
          const customerName = customer?.name || "\u0427\u0438\u0433\u0446\u0430\u043B\u043C\u0430\u0430";
          const customerPhone = customer?.phone || "99001234";
          const customerId = customer?.studentId || "23b1num0245";
          const customerAvatar = customer?.avatar || "assets/img/profile.jpg";
          const from = orderDetail?.from_name || fromRaw;
          const to = orderDetail?.to_name || toRaw;
          const createdAt = orderDetail?.created_at || this.parseMetaToISO(data.meta) || (/* @__PURE__ */ new Date()).toISOString();
          return {
            orderId: data?.orderId || null,
            from,
            to,
            item: firstItem?.name || "",
            items: Array.isArray(data.sub) ? data.sub : [],
            total: data.price || "",
            createdAt,
            customer: {
              name: this.normalizeName(customerName),
              phone: customerPhone,
              studentId: customerId,
              avatar: customerAvatar
            }
          };
        }
        normalizeName(value) {
          const raw = String(value || "").trim();
          if (!raw) return "\u0427\u0438\u0433\u0446\u0430\u043B\u043C\u0430\u0430";
          const tokens = raw.split(/\s+/).filter((t) => t && t.length > 1);
          return tokens.length ? tokens.join(" ") : raw;
        }
        async handleConfirm() {
          if (!this.currentData) {
            this.close();
            return;
          }
          await this.fetchCurrentUser();
          const isCourier = this.currentUser?.role === "courier";
          if (!isCourier) {
            localStorage.setItem("login_prefill_role", "courier");
            localStorage.setItem("login_prefill_mode", "register");
            location.hash = "#login";
            return;
          }
          const customer = this.currentData?.customer || {};
          const customerId = customer?.id || customer?.customer_id || null;
          const customerStudentId = customer?.student_id || customer?.studentId || null;
          const selfId = this.currentUser?.id || null;
          const selfStudentId = this.currentUser?.student_id || this.currentUser?.studentId || null;
          if (customerId && selfId && String(customerId) === String(selfId) || customerStudentId && selfStudentId && String(customerStudentId) === String(selfStudentId)) {
            alert("\u04E8\u04E9\u0440\u0438\u0439\u043D \u0437\u0430\u0445\u0438\u0430\u043B\u0433\u044B\u0433 \u04E9\u04E9\u0440\u04E9\u04E9 \u0445\u04AF\u0440\u0433\u044D\u0445 \u0431\u043E\u043B\u043E\u043C\u0436\u0433\u04AF\u0439.");
            return;
          }
          let orderDetail = null;
          const orderId = this.currentData?.orderId;
          this.removeOfferFromList(this.currentData);
          if (orderId) {
            try {
              const assignRes = await fetch(`${this.API}/api/orders/${encodeURIComponent(orderId)}/assign-courier`, {
                method: "POST",
                credentials: "include"
              });
              if (assignRes.ok) {
                const payload = await assignRes.json();
                orderDetail = payload?.order || null;
              }
            } catch (e) {
            }
          }
          const activeOrder = this.buildActiveOrder(this.currentData, orderDetail);
          const added = await this.addToDeliveryCart(this.currentData);
          if (!added) {
            this.close();
            return;
          }
          await this.saveActiveOrder(activeOrder);
          window.NumAppState?.setState("courier", "delivery_started");
          localStorage.setItem("deliveryActive", "1");
          this.removeOfferFromList(this.currentData);
          try {
            const res = await fetch(`${this.API}/api/courier/me`, {
              credentials: "include"
            });
            if (res.ok) {
              const courier = await res.json();
            }
          } catch (e) {
            console.warn("courier fetch failed", e);
          }
          this.close();
          window.dispatchEvent(new Event("order-updated"));
          window.dispatchEvent(new Event("delivery-cart-updated"));
          window.dispatchEvent(new Event("offers-updated"));
          const cartEl = document.querySelector("delivery-cart");
          if (cartEl && typeof cartEl.load === "function") {
            cartEl.load();
          }
          if (!document.querySelector("delivery-cart")) {
            location.hash = "#delivery";
          }
        }
        async handleDelete() {
          if (!this.currentData) {
            this.close();
            return;
          }
          await this.fetchCurrentUser();
          const orderId = this.currentData?.orderId || this.currentData?.id || null;
          const isOwner = this.isOwnerOfOrder(this.currentData);
          if (isOwner && orderId) {
            const cancelled = await this.cancelOrderOnServer(orderId);
            if (!cancelled) {
              return;
            }
          }
          this.removeOfferFromList(this.currentData);
          this.refreshOffersList();
          this.close();
        }
        isOwnerOfOrder(data) {
          const customer = data?.customer || {};
          const user = this.currentUser || {};
          const customerId = customer?.id || customer?.customer_id || null;
          const customerStudentId = customer?.student_id || customer?.studentId || null;
          const userId = user?.id || null;
          const userStudentId = user?.student_id || user?.studentId || null;
          if (customerId && userId && String(customerId) === String(userId)) return true;
          if (customerStudentId && userStudentId && String(customerStudentId) === String(userStudentId)) return true;
          return false;
        }
        async cancelOrderOnServer(orderId) {
          try {
            const res = await fetch(`${this.API}/api/orders/${encodeURIComponent(orderId)}`, {
              method: "DELETE",
              credentials: "include"
            });
            if (res.status === 401) {
              location.hash = "#login";
              return false;
            }
            if (!res.ok) {
              const err = await res.json().catch(() => ({}));
              alert(err?.error || "\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0443\u0441\u0442\u0433\u0430\u0445\u0430\u0434 \u0430\u043B\u0434\u0430\u0430 \u0433\u0430\u0440\u043B\u0430\u0430");
              return false;
            }
            return true;
          } catch (e) {
            alert("\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0443\u0441\u0442\u0433\u0430\u0445\u0430\u0434 \u0430\u043B\u0434\u0430\u0430 \u0433\u0430\u0440\u043B\u0430\u0430");
            return false;
          }
        }
        async addToDeliveryCart(data) {
          const title = data.title || "";
          const meta = data.meta || "";
          const price = data.price || "";
          try {
            const res = await fetch(`${this.API}/api/delivery-cart`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title,
                meta,
                price,
                thumb: data.thumb || "assets/img/box.svg",
                sub: Array.isArray(data.sub) ? data.sub : []
              })
            });
            if (!res.ok) {
              const err = await res.json().catch(() => ({}));
              if (String(err.error || "").toLowerCase().includes("unauthorized")) {
                location.hash = "#login";
                return false;
              }
              alert(err.error || "\u0425\u04AF\u0440\u0433\u044D\u043B\u0442 \u043D\u044D\u043C\u044D\u0445\u044D\u0434 \u0430\u043B\u0434\u0430\u0430 \u0433\u0430\u0440\u043B\u0430\u0430");
              return false;
            }
            return true;
          } catch (e) {
            alert("\u0425\u04AF\u0440\u0433\u044D\u043B\u0442 \u043D\u044D\u043C\u044D\u0445\u044D\u0434 \u0430\u043B\u0434\u0430\u0430 \u0433\u0430\u0440\u043B\u0430\u0430");
            return false;
          }
        }
        async saveActiveOrder(order) {
          try {
            await fetch(`${this.API}/api/active-order`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ order })
            });
          } catch (e) {
          }
        }
        async fetchCurrentUser() {
          if (this.currentUser) return this.currentUser;
          try {
            const res = await fetch(`${this.API}/api/auth/me`, {
              credentials: "include"
            });
            if (!res.ok) {
              this.currentUser = null;
            } else {
              const data = await res.json();
              this.currentUser = data?.user || null;
            }
          } catch (e) {
            this.currentUser = null;
          }
          return this.currentUser;
        }
        getRemovedStorageKey(baseKey) {
          const authKey = localStorage.getItem("authUserKey");
          const userId = this.currentUser?.id || "";
          const suffix = authKey || userId || "";
          return suffix ? `${baseKey}:${suffix}` : baseKey;
        }
        removeOfferFromList(data) {
          if (!data || typeof data !== "object") return false;
          const raw = localStorage.getItem("offers");
          let offers = [];
          try {
            offers = raw ? JSON.parse(raw) || [] : [];
          } catch (e) {
            console.error("Failed to parse offers from localStorage:", e);
            offers = [];
          }
          const orderId = data.orderId || data.id || null;
          const key = `${data.title || ""}|${data.meta || ""}|${data.price || ""}`;
          const originalLength = offers.length;
          const next = offers.filter((item) => {
            const itemId = item.orderId || item.id || null;
            if (orderId && itemId && String(itemId) === String(orderId)) {
              return false;
            }
            const itemKey = `${item.title || ""}|${item.meta || ""}|${item.price || ""}`;
            return itemKey !== key;
          });
          if (orderId) {
            const removedIdsKey = this.getRemovedStorageKey("removed_offer_ids");
            const removedIdsRaw = localStorage.getItem(removedIdsKey);
            let removedIds = [];
            try {
              removedIds = JSON.parse(removedIdsRaw) || [];
            } catch (e) {
              removedIds = [];
            }
            const normalizedId = String(orderId);
            if (!removedIds.includes(normalizedId)) {
              removedIds.push(normalizedId);
              localStorage.setItem(removedIdsKey, JSON.stringify(removedIds));
            }
          } else if (key) {
            const removedKeysKey = this.getRemovedStorageKey("removed_offer_keys");
            const removedKeysRaw = localStorage.getItem(removedKeysKey);
            let removedKeys = [];
            try {
              removedKeys = JSON.parse(removedKeysRaw) || [];
            } catch (e) {
              removedKeys = [];
            }
            if (!removedKeys.includes(key)) {
              removedKeys.push(key);
              localStorage.setItem(removedKeysKey, JSON.stringify(removedKeys));
            }
          }
          if (next.length === originalLength) {
            return false;
          }
          localStorage.setItem("offers", JSON.stringify(next));
          window.dispatchEvent(new CustomEvent("offer-removed", {
            detail: {
              removedOffer: data,
              remainingOffers: next
            }
          }));
          return true;
        }
        async populateCourier(data) {
        }
      };
      customElements.define("offer-modal", OfferModal);
    }
  });

  // front-end/assets/components/confirm-modal.js
  var confirm_modal_exports = {};
  var ConfirmModal;
  var init_confirm_modal = __esm({
    "front-end/assets/components/confirm-modal.js"() {
      ConfirmModal = class extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          this.render();
          this.cacheEls();
          this.bindEvents();
        }
        render() {
          this.shadowRoot.innerHTML = `
      <style>
        :host {
          font-family: inherit;
        }
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
        #confirm-modal .btn {
          border: none;
          background: transparent;
          font: inherit;
          cursor: pointer;
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
        @media (prefers-color-scheme: dark) {
          #confirm-modal .modal-content {
            background: #0f172a;
            color: #e5e7eb;
            border: 1px solid #243040;
            box-shadow: 0 24px 70px rgba(0,0,0,0.45);
          }
          #confirm-modal h3 {
            color: #f9fafb;
          }
          #confirm-modal p {
            color: #9aa4b2;
          }
          #confirm-modal .btn--gray {
            background: #111827;
            color: #e5e7eb;
            border-color: #243040;
          }
          #confirm-modal .detail-row {
            background: #111827;
            border-color: #243040;
            color: #e5e7eb;
          }
        }
      </style>

      <div id="confirm-modal" aria-hidden="true">
        <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <h3 id="confirm-title">\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0431\u0430\u0442\u0430\u043B\u0433\u0430\u0430\u0436\u0443\u0443\u043B\u0430\u0445 \u0443\u0443?</h3>
          <p id="confirm-text"></p>
          <div class="modal-actions">
            <button id="cancel-order" class="btn btn--gray">\u0426\u0443\u0446\u043B\u0430\u0445</button>
            <button id="confirm-order" class="btn btn--accent">\u0411\u0430\u0442\u0430\u043B\u0433\u0430\u0430\u0436\u0443\u0443\u043B\u0430\u0445</button>
          </div>
        </div>
      </div>
    `;
        }
        cacheEls() {
          this.modal = this.shadowRoot.querySelector("#confirm-modal");
          this.confirmTextEl = this.shadowRoot.querySelector("#confirm-text");
          this.cancelBtn = this.shadowRoot.querySelector("#cancel-order");
          this.confirmBtn = this.shadowRoot.querySelector("#confirm-order");
        }
        bindEvents() {
          if (this.cancelBtn) {
            this.cancelBtn.addEventListener("click", () => {
              this.close();
              this.dispatchEvent(new Event("cancel"));
            });
          }
          if (this.confirmBtn) {
            this.confirmBtn.addEventListener("click", () => {
              this.dispatchEvent(new Event("confirm"));
            });
          }
          if (this.modal) {
            this.modal.addEventListener("click", (e) => {
              if (e.target === this.modal) {
                this.close();
                this.dispatchEvent(new Event("cancel"));
              }
            });
          }
        }
        formatPrice(n) {
          return Number(n || 0).toLocaleString("mn-MN") + "\u20AE";
        }
        open(order, summary) {
          if (!this.modal || !this.confirmTextEl) return;
          const items = summary?.items?.length ? summary.items.map((i) => `\u2022 ${i.name} \u2014 ${i.qty} \u0448\u0438\u0440\u0445\u044D\u0433`).join("<br>") : "\u0411\u0430\u0440\u0430\u0430 \u0441\u043E\u043D\u0433\u043E\u0433\u0434\u043E\u043E\u0433\u04AF\u0439";
          const d = new Date(order.createdAt);
          const totalRaw = summary?.total;
          const totalText = Number.isFinite(Number(totalRaw)) ? this.formatPrice(Number(totalRaw)) : totalRaw || "0\u20AE";
          this.confirmTextEl.innerHTML = `
      <div class="detail-row">
        <strong>\u0425\u0430\u0430\u043D\u0430\u0430\u0441:</strong> ${order.from}<br>
        <strong>\u0425\u0430\u0430\u0448\u0430\u0430:</strong> ${order.to}<br>
        <strong>\u04E8\u0434\u04E9\u0440:</strong> ${order.createdAt.split("T")[0]}<br>
        <strong>\u0426\u0430\u0433:</strong> ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </div>
      <div class="detail-row">
        <strong>\u0422\u0430\u043D\u044B \u0445\u043E\u043E\u043B:</strong><br>
        ${items}
      </div>
      <div class="detail-row" style="text-align:center;">
        <strong>\u041D\u0438\u0439\u0442 \u04AF\u043D\u044D:</strong> ${totalText}
      </div>
    `;
          this.modal.setAttribute("aria-hidden", "false");
          this.modal.classList.add("show");
          if (this.confirmBtn) this.confirmBtn.focus();
        }
        close() {
          if (!this.modal) return;
          this.modal.classList.remove("show");
          this.modal.setAttribute("aria-hidden", "true");
        }
      };
      customElements.define("confirm-modal", ConfirmModal);
    }
  });

  // front-end/assets/components/order-confirm.js
  var order_confirm_exports = {};
  var OrderConfirm;
  var init_order_confirm = __esm({
    "front-end/assets/components/order-confirm.js"() {
      init_api_client();
      OrderConfirm = class extends HTMLElement {
        constructor() {
          super();
          this.pendingOrder = null;
          this.pendingOffer = null;
          this.confirmModal = null;
          this.handleConfirm = () => this.batalgaajuulahZahialga();
          this.handleCancel = () => this.hideBatalgaajiltModal();
        }
        connectedCallback() {
          this.bindModal();
          this.attach();
        }
        attach() {
          if (!this.confirmModal) return;
          this.confirmModal.addEventListener("confirm", this.handleConfirm);
          this.confirmModal.addEventListener("cancel", this.handleCancel);
        }
        disconnectedCallback() {
          this.detach();
        }
        detach() {
          if (!this.confirmModal) return;
          this.confirmModal.removeEventListener("confirm", this.handleConfirm);
          this.confirmModal.removeEventListener("cancel", this.handleCancel);
        }
        bindModal() {
          const root = this.closest("home-page") || document;
          this.confirmModal = root.querySelector("confirm-modal");
        }
        formatUne(n) {
          return Number(n || 0).toLocaleString("mn-MN") + "\u20AE";
        }
        formatTovch(ts) {
          const d = new Date(ts);
          if (isNaN(d.getTime())) return "";
          const date = d.toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "2-digit"
          });
          const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          return `${date} \u2022 ${time}`;
        }
        open(order, summary) {
          if (!this.confirmModal) this.bindModal();
          if (!this.confirmModal || typeof this.confirmModal.open !== "function") return;
          this.pendingOrder = order || null;
          this.pendingOffer = summary || null;
          this.confirmModal.open(order, summary);
        }
        hideBatalgaajiltModal() {
          if (!this.confirmModal) return;
          this.confirmModal.close();
          this.pendingOrder = null;
          this.pendingOffer = null;
        }
        async tentsvvlehHereglegchMedeelel(userId) {
          if (!userId) return;
          const res = await apiFetch(`/api/customers/${userId}`);
          if (!res.ok) return;
          const data = await res.json();
          if (data) {
            if (data.name) localStorage.setItem("userName", data.name);
            if (data.phone) localStorage.setItem("userPhone", data.phone);
            localStorage.setItem("userId", data.id);
            if (data.student_id) {
              localStorage.setItem("userDisplayId", data.student_id);
            }
            window.dispatchEvent(new Event("user-updated"));
          }
        }
        async batalgaajuulahZahialga() {
          if (!this.pendingOrder || !this.pendingOffer) {
            this.hideBatalgaajiltModal();
            return;
          }
          const { userId, registered } = this.readNevtrelt();
          if (!registered || !this.shalgahUuid(userId)) {
            localStorage.setItem("pendingOrderDraft", JSON.stringify(this.pendingOrder));
            localStorage.setItem("pendingOfferDraft", JSON.stringify(this.pendingOffer));
            this.hideBatalgaajiltModal();
            location.hash = "#login";
            return;
          }
          if (!this.pendingOrder.fromId || !this.pendingOrder.toId) {
            alert("\u0425\u0430\u0430\u043D\u0430\u0430\u0441/\u0425\u0430\u0430\u0448\u0430\u0430 \u0441\u043E\u043D\u0433\u043E\u043D\u043E \u0443\u0443");
            return;
          }
          if (!Array.isArray(this.pendingOffer.items) || this.pendingOffer.items.length === 0) {
            alert("\u0421\u0430\u0433\u0441 \u0445\u043E\u043E\u0441\u043E\u043D \u0431\u0430\u0439\u043D\u0430");
            return;
          }
          const safeItems = this.pendingOffer.items.map((i) => {
            const unitPrice = Number(i.price);
            const qty = Number(i.qty);
            return {
              menuItemKey: i.id,
              name: i.name,
              unitPrice: Number.isFinite(unitPrice) ? unitPrice : 0,
              qty: Number.isFinite(qty) && qty > 0 ? qty : 1,
              options: {}
            };
          }).filter((i) => i.qty > 0);
          const payload = this.buildIlgeehData(userId, safeItems);
          try {
            const resp = await apiFetch(`/api/orders`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            });
            const data = await resp.json().catch(() => ({}));
            if (!resp.ok) {
              alert(data?.error || "\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u04AF\u04AF\u0441\u0433\u044D\u0445\u044D\u0434 \u0430\u043B\u0434\u0430\u0430 \u0433\u0430\u0440\u043B\u0430\u0430");
              return;
            }
            if (data?.customerId) {
              localStorage.setItem("userId", data.customerId);
              this.tentsvvlehHereglegchMedeelel(data.customerId);
            }
            this.writeIdevhteiZahialga();
            this.saveSanal(data);
            this.hideBatalgaajiltModal();
            this.guilgehSanalRuu();
          } catch (e) {
            alert("\u0421\u0435\u0440\u0432\u0435\u0440\u0442\u044D\u0439 \u0445\u043E\u043B\u0431\u043E\u0433\u0434\u043E\u0436 \u0447\u0430\u0434\u0441\u0430\u043D\u0433\u04AF\u0439");
          }
        }
        readNevtrelt() {
          return {
            userId: localStorage.getItem("userId"),
            registered: localStorage.getItem("userRegistered") === "1"
          };
        }
        shalgahUuid(value) {
          const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
          return uuidRe.test(value || "");
        }
        buildIlgeehData(userId, safeItems) {
          return {
            customerId: userId || null,
            fromPlaceId: this.pendingOrder.fromId,
            toPlaceId: this.pendingOrder.toId,
            scheduledAt: this.pendingOrder.createdAt,
            deliveryFee: Number.isFinite(this.pendingOffer.deliveryFee) ? this.pendingOffer.deliveryFee : 0,
            items: safeItems,
            customerName: `${localStorage.getItem("userLastName") || ""} ${localStorage.getItem("userName") || "\u0417\u043E\u0447\u0438\u043D \u0445\u044D\u0440\u044D\u0433\u043B\u044D\u0433\u0447"}`.trim(),
            customerPhone: localStorage.getItem("userPhone") || "00000000",
            customerStudentId: localStorage.getItem("userDisplayId") || "",
            note: this.pendingOrder.fromDetail ? `Pickup: ${this.pendingOrder.fromDetail}` : null
          };
        }
        writeIdevhteiZahialga() {
          localStorage.setItem("activeOrder", JSON.stringify(this.pendingOrder));
          localStorage.setItem("orderStep", "0");
          window.dispatchEvent(new Event("order-updated"));
        }
        saveSanal(data) {
          const existingOffers = JSON.parse(localStorage.getItem("offers") || "[]");
          existingOffers.unshift({
            ...this.pendingOffer,
            orderId: data.orderId,
            meta: this.formatTovch(this.pendingOrder.createdAt),
            from: this.pendingOrder.from,
            fromDetail: this.pendingOrder.fromDetail,
            to: this.pendingOrder.to,
            title: `${this.pendingOrder.from} - ${this.pendingOrder.to}`,
            price: this.formatUne((data?.total ?? this.pendingOffer.total) || 0),
            thumb: this.pendingOffer.thumb || "assets/img/box.svg",
            sub: this.pendingOffer.items.map((it) => ({
              name: `${it.name} x${it.qty}`,
              price: this.formatUne(it.price * it.qty)
            }))
          });
          localStorage.setItem("offers", JSON.stringify(existingOffers));
          const offersEl = document.querySelector("#offers");
          if (offersEl && "items" in offersEl) {
            offersEl.items = existingOffers;
          }
        }
        guilgehSanalRuu() {
          const offersSection = document.querySelector("#offers");
          if (!offersSection || !offersSection.scrollIntoView) return;
          setTimeout(() => {
            offersSection.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 150);
        }
      };
      customElements.define("order-confirm", OrderConfirm);
    }
  });

  // front-end/assets/pages/delivery-page.js
  var delivery_page_exports = {};
  var DeliveryPage;
  var init_delivery_page = __esm({
    "front-end/assets/pages/delivery-page.js"() {
      DeliveryPage = class extends HTMLElement {
        constructor() {
          super();
          this.handleRouteChange = this.handleRouteChange.bind(this);
          this.applyActiveOrderBound = this.applyActiveOrder.bind(this);
          this.renderDeliveryCartBound = this.renderDeliveryCart.bind(this);
          this._initialized = false;
        }
        connectedCallback() {
          window.addEventListener("hashchange", this.handleRouteChange);
          this.handleRouteChange();
        }
        disconnectedCallback() {
          window.removeEventListener("hashchange", this.handleRouteChange);
          window.removeEventListener("order-updated", this.applyActiveOrderBound);
          window.removeEventListener("delivery-cart-updated", this.renderDeliveryCartBound);
        }
        handleRouteChange() {
          if (location.hash !== "#delivery") return;
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
            window.addEventListener("order-updated", this.applyActiveOrderBound);
            window.addEventListener("delivery-cart-updated", this.renderDeliveryCartBound);
            this._initialized = true;
          }
          this.applyActiveOrder();
          this.renderDeliveryCart();
        }
        render() {
          this.innerHTML = `
    <link rel="stylesheet" href="assets/css/delivery.css">
      <div class="container">
        <section class="orders">
          <h2>\u041C\u0438\u043D\u0438\u0439 \u0445\u04AF\u0440\u0433\u044D\u043B\u0442</h2>
          <div id="deliveryList" class="order-list"></div>
        </section>

        <section class="details">
          <del-order-details></del-order-details>
        </section>

        <section class="order-step">
          <h2>\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u044B\u043D \u044F\u0432\u0446</h2>
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
              first.setAttribute("header", `${order.from} \u2192 ${order.to}`);
              if (order.item) {
                first.setAttribute("detail", order.item);
              }
            }
          } catch (e) {
          }
        }
        renderDeliveryCart() {
          const listEl = this.querySelector("#deliveryList");
          if (!listEl) return;
          this.fetchDeliveryItems(listEl);
        }
        attachOrderSelection() {
          const orderElements = this.querySelectorAll("d-orders");
          orderElements.forEach((orderEl) => {
            orderEl.addEventListener("click", () => {
              const orderId = orderEl.getAttribute("data-id");
              this.selectOrder(orderId);
            });
          });
        }
        selectOrder(orderId) {
          const event = new CustomEvent("order-select", { detail: { id: orderId } });
          document.dispatchEvent(event);
        }
        escapeAttr(value) {
          return String(value || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
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
            listEl.innerHTML = '<p class="muted">\u0425\u04AF\u0440\u0433\u044D\u043B\u0442 \u0441\u043E\u043D\u0433\u043E\u043E\u0433\u04AF\u0439 \u0431\u0430\u0439\u043D\u0430.</p>';
            const details2 = this.querySelector("del-order-details");
            const progress2 = this.querySelector("del-order-progress");
            if (details2) details2.setAttribute("data-empty", "1");
            if (progress2) progress2.setAttribute("data-empty", "1");
            return;
          }
          const details = this.querySelector("del-order-details");
          const progress = this.querySelector("del-order-progress");
          if (details) details.removeAttribute("data-empty");
          if (progress) progress.removeAttribute("data-empty");
          listEl.innerHTML = items.map((item) => {
            const qty = Number(item.qty || 1);
            const detailParts = [];
            if (item.meta) detailParts.push(item.meta);
            if (qty) detailParts.push(`x${qty}`);
            const detail = detailParts.join(" \u2022 ");
            return `
        <d-orders header="${this.escapeAttr(item.title || "")}"
                  detail="${this.escapeAttr(detail)}"></d-orders>
      `;
          }).join("");
        }
      };
      customElements.define("delivery-page", DeliveryPage);
    }
  });

  // front-end/assets/components/d-orders.js
  var d_orders_exports = {};
  var DOrders;
  var init_d_orders = __esm({
    "front-end/assets/components/d-orders.js"() {
      DOrders = class extends HTMLElement {
        connectedCallback() {
          const isActive = this.hasAttribute("data-active");
          let header = this.getAttribute("header") || "";
          let detail = this.getAttribute("detail") || "";
          this.innerHTML = `
      <article class="order-card">
        <div class="order-info">
          <h3>${header}</h3>
          <p>${detail}</p>
        </div>
        <button class="view-btn"><svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24">
  <title>i</title>
  <g id="Complete">
    <g id="expand">
      <g>
        <polyline id="Right-2" data-name="Right" points="3 17.3 3 21 6.7 21" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
        <line x1="10" y1="14" x2="3.8" y2="20.2" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
        <line x1="14" y1="10" x2="20.2" y2="3.8" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
        <polyline id="Right-3" data-name="Right" points="21 6.7 21 3 17.3 3" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
      </g>
    </g>
  </g>
</svg></button>
      </article>
    `;
          if (isActive) {
            this.loadActiveOrder();
          }
        }
        async loadActiveOrder() {
          try {
            const res = await fetch("/api/active-order");
            if (!res.ok) return;
            const data = await res.json();
            const order = data?.order;
            if (!order) return;
            const header = order.from && order.to ? `${order.from} \u2192 ${order.to}` : "";
            const detail = order.item || "";
            const titleEl = this.querySelector(".order-info h3");
            const detailEl = this.querySelector(".order-info p");
            if (titleEl) titleEl.textContent = header;
            if (detailEl) detailEl.textContent = detail;
          } catch (e) {
          }
        }
      };
      customElements.define("d-orders", DOrders);
    }
  });

  // front-end/assets/components/del-order-details.js
  var del_order_details_exports = {};
  var DelOrderDetails;
  var init_del_order_details = __esm({
    "front-end/assets/components/del-order-details.js"() {
      DelOrderDetails = class extends HTMLElement {
        connectedCallback() {
          this.renderEmpty();
          this.loadOrder();
        }
        renderEmpty() {
          this.innerHTML = "";
        }
        render(data = {}) {
          const from = data.from || "";
          const to = data.to || "";
          const dateText = data.createdAt || "";
          if (!from && !to && !dateText) {
            this.renderEmpty();
            return;
          }
          this.innerHTML = `
      <div class="detail-header">
        <p><strong>${from}</strong> \u2192 <strong>${to}</strong></p>
        <p class="date">${dateText}</p>
        <person-detail title="\u0417\u0430\u0445\u0438\u0430\u043B\u0430\u0433\u0447\u0438\u0439\u043D \u043C\u044D\u0434\u044D\u044D\u043B\u044D\u043B" type="medium"></person-detail>
      </div>
    `;
        }
        async loadOrder() {
          if (this.getAttribute("data-empty") === "1") {
            this.renderEmpty();
            return;
          }
          try {
            const res = await fetch("/api/active-order");
            if (!res.ok) {
              this.renderEmpty();
              return;
            }
            const data = await res.json();
            const order = data?.order;
            if (!order) {
              this.renderEmpty();
              return;
            }
            let dateText = order.createdAt || "";
            if (order.createdAt) {
              const dt = new Date(order.createdAt);
              const pad = (n) => n.toString().padStart(2, "0");
              dateText = `${dt.getFullYear()}.${pad(dt.getMonth() + 1)}.${pad(dt.getDate())} \u2022 ${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
            }
            this.render({ from: order.from, to: order.to, createdAt: dateText });
          } catch (e) {
            this.renderEmpty();
          }
        }
      };
      customElements.define("del-order-details", DelOrderDetails);
    }
  });

  // front-end/assets/components/delivery-data.js
  function loadSteps() {
    try {
      return JSON.parse(localStorage.getItem(STEPS_KEY)) || {};
    } catch {
      return {};
    }
  }
  function saveSteps(steps) {
    localStorage.setItem(STEPS_KEY, JSON.stringify(steps));
  }
  function getOrderById(id) {
    return ORDERS.find((o) => String(o.id) === String(id)) || ORDERS[0];
  }
  var ORDERS, STEPS_KEY;
  var init_delivery_data = __esm({
    "front-end/assets/components/delivery-data.js"() {
      ORDERS = [
        {
          id: "o1",
          title: "GL Burger - 7-\u0440 \u0431\u0430\u0439\u0440 207",
          summary: "3 \u0448\u0438\u0440\u0445\u044D\u0433 \u2022 10,000\u20AE",
          from: "GL Burger",
          to: "\u041C\u0423\u0418\u0421 7-\u0440 \u0431\u0430\u0439\u0440",
          datetime: "2025.10.08 \u2022 09:36",
          total: "37,000\u20AE",
          items: [
            "XL \u0431\u0430\u0433\u0446: 10,000\u20AE",
            "M \u0431\u0430\u0433\u0446: 8,000\u20AE",
            "L \u0431\u0430\u0433\u0446: 9,000\u20AE"
          ],
          courier: {
            name: "\u0427\u0438\u0433\u0446\u0430\u043B\u043C\u0430\u0430",
            phone: "99001234",
            id: "23B1NUM0245",
            avatar: "assets/img/profile.jpg"
          },
          defaultStep: 0
        },
        {
          id: "o2",
          title: "CU - 8-\u0440 \u0431\u0430\u0439\u0440 209",
          summary: "1 \u0448\u0438\u0440\u0445\u044D\u0433 \u2022 5,000\u20AE",
          from: "CU",
          to: "\u041C\u0423\u0418\u0421 8-\u0440 \u0431\u0430\u0439\u0440",
          datetime: "2025.10.08 \u2022 10:15",
          total: "5,000\u20AE",
          items: [
            "\u041A\u043E\u043B\u0430 0.5\u043B: 2,500\u20AE",
            "\u0427\u0438\u043F\u0441: 2,500\u20AE"
          ],
          courier: {
            name: "\u0411\u0430\u0442-\u041E\u0440\u0433\u0438\u043B",
            phone: "88112233",
            id: "23B1NUM0312",
            avatar: "assets/img/profile.jpg"
          },
          defaultStep: 1
        }
      ];
      STEPS_KEY = "deliverySteps";
    }
  });

  // front-end/assets/components/del-order-progress.js
  var del_order_progress_exports = {};
  var STEP_LABELS, DelOrderProgress;
  var init_del_order_progress = __esm({
    "front-end/assets/components/del-order-progress.js"() {
      init_delivery_data();
      STEP_LABELS = [
        "\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0431\u044D\u043B\u0442\u0433\u044D\u0445",
        "\u0425\u04AF\u0440\u0433\u044D\u043B\u0442\u044D\u043D\u0434 \u0433\u0430\u0440\u0441\u0430\u043D",
        "\u0410\u043C\u0436\u0438\u043B\u0442\u0442\u0430\u0439 \u0445\u04AF\u0440\u0433\u044D\u0441\u044D\u043D"
      ];
      DelOrderProgress = class extends HTMLElement {
        connectedCallback() {
          this.stepsState = loadSteps();
          this.currentId = ORDERS[0]?.id || null;
          this.activeOrder = null;
          this.handleOrderSelect = (e) => {
            this.currentId = e.detail.id;
            this.render();
          };
          this.handleOrderUpdated = this.loadActiveOrder.bind(this);
          this.render();
          this.loadActiveOrder();
          document.addEventListener("order-select", this.handleOrderSelect);
          window.addEventListener("order-updated", this.handleOrderUpdated);
        }
        disconnectedCallback() {
          document.removeEventListener("order-select", this.handleOrderSelect);
          window.removeEventListener("order-updated", this.handleOrderUpdated);
          if (this._ratingTimer) {
            clearInterval(this._ratingTimer);
            this._ratingTimer = null;
          }
        }
        async loadActiveOrder() {
          try {
            const res = await fetch("/api/active-order", { credentials: "include" });
            if (!res.ok) return;
            const data = await res.json();
            const order = data?.order || null;
            this.activeOrder = order;
            const activeId = order?.orderId || order?.id || null;
            if (activeId) this.currentId = activeId;
            this.render();
          } catch (e) {
          }
        }
        getCurrentStep() {
          const order = this.getCurrentOrder();
          if (!order) return 0;
          const saved = this.stepsState[order.id];
          if (saved === 0 || saved) return saved;
          return order.defaultStep || 0;
        }
        getCurrentOrder() {
          if (this.activeOrder) {
            const id = this.activeOrder.orderId || this.activeOrder.id || null;
            if (id) return { id, defaultStep: 0 };
          }
          return getOrderById(this.currentId);
        }
        isUuid(value) {
          return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            String(value || "")
          );
        }
        render() {
          if (this.getAttribute("data-empty") === "1") {
            this.innerHTML = "";
            return;
          }
          const stepIndex = this.getCurrentStep();
          const order = this.getCurrentOrder();
          if (!order) {
            this.innerHTML = "<p>\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u043E\u043B\u0434\u0441\u043E\u043D\u0433\u04AF\u0439.</p>";
            return;
          }
          this.innerHTML = `
      <div class="order-progress">
        ${STEP_LABELS.map((label, idx) => `
          <div class="step
            ${idx < stepIndex ? "completed" : ""}
            ${idx === stepIndex ? "active" : ""}"
            data-step="${idx}">
            <div class="step-indicator">
              <svg viewBox="0 0 24 24">
                <path d="M12 2C8.962 2 6.5 4.462 6.5 7.5C6.5 11.438 12 18 12 18C12 18 17.5 11.438 17.5 7.5C17.5 4.462 15.038 2 12 2ZM12 9.5C10.895 9.5 10 8.605 10 7.5C10 6.395 10.895 5.5 12 5.5C13.105 5.5 14 6.395 14 7.5C14 8.605 13.105 9.5 12 9.5Z"/>
              </svg>
            </div>
            <div>
              <div class="step-label">${label}</div>
              <p class="step-desc">
                ${idx === 0 ? "\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u044B\u0433 \u0431\u044D\u043B\u0442\u0433\u044D\u0436 \u0434\u0443\u0443\u0441\u0441\u0430\u043D\u044B \u0434\u0430\u0440\u0430\u0430 \u0434\u0430\u0440\u0430\u0430\u0433\u0438\u0439\u043D \u0430\u043B\u0445\u0430\u043C \u0440\u0443\u0443 \u0448\u0438\u043B\u0436\u0438\u043D\u044D." : idx === 1 ? "\u0425\u04AF\u0440\u0433\u044D\u043B\u0442\u044D\u043D\u0434 \u0433\u0430\u0440\u0441\u0430\u043D \u04AF\u0435\u0434 \u0434\u0430\u0440\u0430\u0430\u0433\u0438\u0439\u043D \u0430\u043B\u0445\u0430\u043C\u044B\u0433 \u0434\u0430\u0440\u043D\u0430." : "\u0425\u044D\u0440\u044D\u0433\u043B\u044D\u0433\u0447\u0438\u0434 \u0445\u04AF\u043B\u044D\u044D\u043B\u0433\u044D\u043D \u04E9\u0433\u0447 \u0434\u0443\u0443\u0441\u0441\u0430\u043D \u04AF\u0435\u0434 \u0442\u04E9\u0433\u0441\u04E9\u043D\u04E9."}
              </p>
            </div>
          </div>
        `).join("")}
      </div>
      <button class="next-btn" type="button">Next</button>
    `;
          const nextBtn = this.querySelector(".next-btn");
          nextBtn.addEventListener("click", () => {
            const current = this.getCurrentStep();
            const maxIndex = STEP_LABELS.length - 1;
            if (current >= maxIndex) {
              nextBtn.disabled = true;
              nextBtn.textContent = "\u04AE\u043D\u044D\u043B\u0433\u044D\u044D \u0445\u04AF\u043B\u044D\u044D\u0436 \u0431\u0430\u0439\u043D\u0430";
              nextBtn.style.opacity = "0.6";
              this.startRatingPoll(order.id);
              alert("\u0417\u0430\u0445\u0438\u0430\u043B\u0430\u0433\u0447 \u04AF\u043D\u044D\u043B\u0433\u044D\u044D \u04E9\u0433\u0441\u043D\u0438\u0439 \u0434\u0430\u0440\u0430\u0430 \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0430\u0430\u0440 \u0434\u0443\u0443\u0441\u043D\u0430.");
              return;
            }
            const nextIdx = current + 1;
            this.stepsState[order.id] = nextIdx;
            saveSteps(this.stepsState);
            localStorage.setItem("orderStep", String(nextIdx));
            const orderId = order.id;
            if (this.isUuid(orderId)) {
              this.updateOrderStatus(orderId, nextIdx);
            }
            if (nextIdx === maxIndex) {
              localStorage.setItem("deliveryAwaitRating", "1");
              this.startRatingPoll(order.id);
            }
            this.render();
          });
        }
        async updateOrderStatus(orderId, stepIndex) {
          const statusMap = {
            1: "delivering",
            2: "delivered"
          };
          const status = statusMap[stepIndex] || "created";
          try {
            const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/status`, {
              method: "PATCH",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status })
            });
            if (!res.ok) {
              const err = await res.json().catch(() => ({}));
              console.warn("status update failed", err?.error || res.status);
            }
          } catch (e) {
            console.warn("status update error", e);
          }
        }
        startRatingPoll(orderId) {
          if (this._ratingTimer) return;
          this._ratingTimer = setInterval(async () => {
            try {
              const meRes = await fetch("/api/auth/me", { credentials: "include" });
              if (!meRes.ok) return;
              const me = await meRes.json();
              const courierId = me?.user?.id;
              if (!courierId) return;
              const rRes = await fetch(`/api/ratings/courier/${encodeURIComponent(courierId)}`, {
                credentials: "include"
              });
              if (!rRes.ok) return;
              const data = await rRes.json();
              const items = data?.items || [];
              const rated = items.some((r) => String(r.order_id) === String(orderId));
              if (!rated) return;
              clearInterval(this._ratingTimer);
              this._ratingTimer = null;
              delete this.stepsState[orderId];
              saveSteps(this.stepsState);
              localStorage.removeItem("deliveryAwaitRating");
              window.NumAppState?.resetToGuest("rating_done");
            } catch {
            }
          }, 3e3);
        }
      };
      customElements.define("del-order-progress", DelOrderProgress);
    }
  });

  // front-end/assets/components/person-detail.js
  var person_detail_exports = {};
  var PersonDetail;
  var init_person_detail = __esm({
    "front-end/assets/components/person-detail.js"() {
      PersonDetail = class extends HTMLElement {
        constructor() {
          super();
        }
        connectedCallback() {
          this.title = this.getAttribute("title") ?? "";
          this.type = this.getAttribute("type") ?? "medium";
          this.render();
          this.handleUserUpdated = this.loadData.bind(this);
          window.addEventListener("user-updated", this.handleUserUpdated);
          this.loadData();
        }
        disconnectedCallback() {
          if (this.handleUserUpdated) {
            window.removeEventListener("user-updated", this.handleUserUpdated);
          }
        }
        attributeChangedCallback(name, oldVal, newVal) {
        }
        adoptedCallback() {
        }
        render() {
          const orderCustomer = this.orderCustomer || null;
          const rawName = orderCustomer?.name || "\u0427\u0438\u0433\u0446\u0430\u043B\u043C\u0430\u0430";
          const name = this.normalizeName(rawName);
          const phone = orderCustomer?.phone || "99001234";
          const displayId = orderCustomer?.studentId || "23b1num0245";
          const avatar = orderCustomer?.avatar || "assets/img/profile.jpg";
          this.innerHTML = `
        <p style="font-weight: bold; font-size: 1rem;">${this.title}</p>
        <div class="delivery ${this.type == "medium" ? "" : "big"}">
          <img src="${this.escape(avatar)}" alt="\u0417\u0430\u0445\u0438\u0430\u043B\u0430\u0433\u0447\u0438\u0439\u043D \u0437\u0443\u0440\u0430\u0433">
          <div class="delivery-info">
            <h3>\u041D\u044D\u0440: ${this.escape(name)}</h3>
            <p>\u0423\u0442\u0430\u0441: ${this.escape(phone)}</p>
            <p>ID: ${this.escape(displayId)}</p>
          </div>
        </div>`;
          const deliveryBlock = this.querySelector("div.delivery");
          if (deliveryBlock) {
            deliveryBlock.addEventListener("click", () => {
              const card = document.querySelector("numd-deliverycard");
              if (card && typeof card.addDelivery === "function") {
                card.addDelivery(this);
              }
            });
          }
        }
        escape(s) {
          return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");
        }
        normalizeName(value) {
          const raw = String(value || "").trim();
          if (!raw) return "\u0427\u0438\u0433\u0446\u0430\u043B\u043C\u0430\u0430";
          const tokens = raw.split(/\s+/).filter((t) => t && t.length > 1);
          return tokens.length ? tokens.join(" ") : raw;
        }
        async loadData() {
          try {
            const res = await fetch("/api/auth/me");
            if (res.ok) {
              const data = await res.json();
              this.currentUser = data?.user || null;
            } else {
              this.currentUser = null;
            }
          } catch (e) {
            this.currentUser = null;
          }
          try {
            const res = await fetch("/api/active-order");
            if (res.ok) {
              const data = await res.json();
              this.orderCustomer = data?.order?.customer || null;
            } else {
              this.orderCustomer = null;
            }
          } catch (e) {
            this.orderCustomer = null;
          }
          this.render();
        }
      };
      window.customElements.define("person-detail", PersonDetail);
    }
  });

  // front-end/assets/pages/orders-page.js
  var orders_page_exports = {};
  var API, OrdersPage;
  var init_orders_page = __esm({
    "front-end/assets/pages/orders-page.js"() {
      API = "http://localhost:3000";
      OrdersPage = class extends HTMLElement {
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
            <h2>\u041C\u0438\u043D\u0438\u0439 \u0437\u0430\u0445\u0438\u0430\u043B\u0433\u0430</h2>
            <div class="order-list" id="orderList">
              <p class="muted">\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0430\u0447\u0430\u0430\u043B\u043B\u0430\u0436 \u0431\u0430\u0439\u043D\u0430...</p>
            </div>
          </section>

          <section class="delivery-info">
            <couriers-card id="courierBox"></couriers-card>
          </section>
        </section>

        <section class="details">
          <h2>\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u044B\u043D \u044F\u0432\u0446</h2>

          <div class="order-progress">
            <div class="step" data-step="0">
              <div class="step-indicator">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2C8.962 2 6.5 4.462 6.5 7.5C6.5 11.438 12 18 12 18C12 18 17.5 11.438 17.5 7.5C17.5 4.462 15.038 2 12 2ZM12 9.5C10.895 9.5 10 8.605 10 7.5C10 6.395 10.895 5.5 12 5.5C13.105 5.5 14 6.395 14 7.5C14 8.605 13.105 9.5 12 9.5Z"/>
                </svg>
              </div>
              <div><div class="step-label">\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0445\u04AF\u043B\u044D\u044D\u043D \u0430\u0432\u0441\u0430\u043D</div></div>
            </div>

            <div class="step" data-step="1">
              <div class="step-indicator">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2C8.962 2 6.5 4.462 6.5 7.5C6.5 11.438 12 18 12 18C12 18 17.5 11.438 17.5 7.5C17.5 4.462 15.038 2 12 2ZM12 9.5C10.895 9.5 10 8.605 10 7.5C10 6.395 10.895 5.5 12 5.5C13.105 5.5 14 6.395 14 7.5C14 8.605 13.105 9.5 12 9.5Z"/>
                </svg>
              </div>
              <div><div class="step-label">\u0425\u04AF\u0440\u0433\u044D\u043B\u0442\u044D\u043D\u0434 \u0433\u0430\u0440\u0441\u0430\u043D</div></div>
            </div>

            <div class="step" data-step="2">
              <div class="step-indicator">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2C8.962 2 6.5 4.462 6.5 7.5C6.5 11.438 12 18 12 18C12 18 17.5 11.438 17.5 7.5C17.5 4.462 15.038 2 12 2ZM12 9.5C10.895 9.5 10 8.605 10 7.5C10 6.395 10.895 5.5 12 5.5C13.105 5.5 14 6.395 14 7.5C14 8.605 13.105 9.5 12 9.5Z"/>
                </svg>
              </div>
              <div><div class="step-label">\u0410\u043C\u0436\u0438\u043B\u0442\u0442\u0430\u0439 \u0445\u04AF\u043B\u044D\u044D\u043D \u0430\u0432\u0441\u0430\u043D</div></div>
            </div>
          </div>

          <button id="openModal" style="display:none;">\u04AE\u043D\u044D\u043B\u0433\u044D\u044D \u04E9\u0433\u04E9\u0445</button>

          <div id="ratingModal" class="modal" style="display:none;">
            <div class="modal-content">
              <span class="close" role="button" aria-label="\u0425\u0430\u0430\u0445">&times;</span>
              <h3>\u0421\u044D\u0442\u0433\u044D\u0433\u0434\u044D\u043B \u04AF\u043B\u0434\u044D\u044D\u043D\u044D \u04AF\u04AF...</h3>
              <rating-stars max="5" color="orange" size="28px"></rating-stars>
              <input type="text" id="comment" placeholder="\u0421\u044D\u0442\u0433\u044D\u0433\u0434\u044D\u043B \u04AF\u043B\u0434\u044D\u044D\u043D\u044D \u04AF\u04AF...">
              <button class="submit" id="sendBtn">\u0418\u043B\u0433\u044D\u044D\u0445</button>
            </div>
          </div>
        </section>
      </main>
    `;
        }
        markOrderRated(orderId) {
          const key = "ratedOrders";
          let arr = [];
          try {
            arr = JSON.parse(localStorage.getItem(key) || "[]");
          } catch {
          }
          const set = new Set(arr.map(String));
          set.add(String(orderId));
          localStorage.setItem(key, JSON.stringify([...set]));
        }
        isOrderRated(orderId) {
          let arr = [];
          try {
            arr = JSON.parse(localStorage.getItem("ratedOrders") || "[]");
          } catch {
          }
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
            const data = await res.json().catch(() => []);
            if (!res.ok) throw new Error(data?.error || "\u0410\u043B\u0434\u0430\u0430");
            const filtered = this.filterExpired(Array.isArray(data) ? data : []);
            const notRated = filtered.filter((o) => !this.isOrderRated(o.id));
            if (Array.isArray(data) && data.length > 0 && filtered.length === 0) {
              window.NumAppState?.resetToGuest("order_expired");
            }
            this.renderOrders(notRated);
          } catch (e) {
            listEl.innerHTML = `<p class="muted">\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0443\u043D\u0448\u0438\u0445\u0430\u0434 \u0430\u043B\u0434\u0430\u0430: ${this.escapeHtml(e.message)}</p>`;
          }
        }
        renderOrders(orders) {
          const listEl = this.querySelector("#orderList");
          if (!listEl) return;
          if (!orders.length) {
            listEl.innerHTML = `<p class="muted">\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0430\u043B\u0433\u0430.</p>`;
            this.selectedOrder = null;
            this.setProgressFromStatus(null);
            this.syncRatingUI(null);
            this.renderCourier(null);
            return;
          }
          listEl.innerHTML = orders.map((o) => {
            const ts = this.getOrderTimestamp(o) || Date.now();
            const dt = new Date(ts);
            const meta = `${dt.toLocaleDateString()} \u2022 ${dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
            const items = Array.isArray(o.items) ? o.items : [];
            const itemsTxt = items.map((it) => `${it.name} \xD7${it.qty}`).join(" \xB7 ");
            const totalQty = items.reduce((sum, it) => sum + (Number(it?.qty) || 0), 0);
            const iconSrc = this.getOfferThumb(o?.id) || this.getDeliveryIcon(totalQty);
            return `
        <div class="order-card" data-order='${encodeURIComponent(JSON.stringify(o))}'>
          <div class="order-info">
            <h3 class="order-title">${this.escapeHtml(o.from_name || "")} - ${this.escapeHtml(o.to_name || "")}</h3>
            <h4>${this.escapeHtml(meta)}</h4>
            <p>${this.escapeHtml(itemsTxt || "\u0411\u0430\u0440\u0430\u0430 \u0431\u0430\u0439\u0445\u0433\u04AF\u0439")}</p>
            <p class="order-total">\u0414\u04AF\u043D: ${this.formatPrice(o.total_amount || 0)}</p>
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
            case "delivering":
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
          openBtn.title = delivered ? "" : "\u0425\u04AF\u0440\u0433\u044D\u043B\u0442 \u0434\u0443\u0443\u0441\u0441\u0430\u043D\u044B \u0434\u0430\u0440\u0430\u0430 \u04AF\u043D\u044D\u043B\u0433\u044D\u044D \u04E9\u0433\u043D\u04E9";
          openBtn.textContent = "\u04AE\u043D\u044D\u043B\u0433\u044D\u044D \u04E9\u0433\u04E9\u0445";
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
                alert("\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0441\u043E\u043D\u0433\u043E\u043D\u043E \u0443\u0443.");
                return;
              }
              const st = String(this.selectedOrder?.status || "").toLowerCase();
              if (st !== "delivered") {
                alert("\u0425\u04AF\u0440\u0433\u044D\u043B\u0442 \u0434\u0443\u0443\u0441\u0441\u0430\u043D\u044B \u0434\u0430\u0440\u0430\u0430 \u04AF\u043D\u044D\u043B\u0433\u044D\u044D \u04E9\u0433\u043D\u04E9.");
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
                alert("\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0441\u043E\u043D\u0433\u043E\u043D\u043E \u0443\u0443.");
                return;
              }
              const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
              if (!uuidRe.test(orderId)) {
                alert("\u042D\u043D\u044D \u0437\u0430\u0445\u0438\u0430\u043B\u0433\u0430\u0434 \u0441\u044D\u0442\u0433\u044D\u0433\u0434\u044D\u043B \u04AF\u043B\u0434\u044D\u044D\u0445 \u0431\u043E\u043B\u043E\u043C\u0436\u0433\u04AF\u0439.");
                return;
              }
              if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
                alert("\u04AE\u043D\u044D\u043B\u0433\u044D\u044D \u0441\u043E\u043D\u0433\u043E\u043D\u043E \u0443\u0443.");
                return;
              }
              try {
                const res = await fetch("/api/ratings", {
                  method: "POST",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ orderId, stars: rating, comment })
                });
                if (!res.ok) {
                  const err = await res.json().catch(() => ({}));
                  alert(err.error || "\u0421\u044D\u0442\u0433\u044D\u0433\u0434\u044D\u043B \u0445\u0430\u0434\u0433\u0430\u043B\u0430\u0445\u0430\u0434 \u0430\u043B\u0434\u0430\u0430 \u0433\u0430\u0440\u043B\u0430\u0430");
                  return;
                }
                this.markOrderRated(orderId);
                this.closeRatingModal();
                localStorage.removeItem("pendingRatingOrder");
                window.dispatchEvent(new Event("reviews-updated"));
                await window.NumAppState?.resetToGuest("rating_submitted");
                this.loadOrders();
              } catch {
                alert("\u0421\u044D\u0442\u0433\u044D\u0433\u0434\u044D\u043B \u0445\u0430\u0434\u0433\u0430\u043B\u0430\u0445\u0430\u0434 \u0430\u043B\u0434\u0430\u0430 \u0433\u0430\u0440\u043B\u0430\u0430");
              }
            };
          }
          if (ratingEl) {
            ratingEl.addEventListener("rate", (e) => {
              console.log("\u04AE\u043D\u044D\u043B\u0433\u044D\u044D:", e.detail);
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
          const raw = o.scheduled_at || o.scheduledAt || o.created_at || o.createdAt || o.meta || null;
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
            const d = /* @__PURE__ */ new Date(`${yy}-${mm}-${dd} ${time}`);
            if (!Number.isNaN(d.getTime())) return d.getTime();
          }
          return null;
        }
        formatPrice(v) {
          return Number(v || 0).toLocaleString("mn-MN") + "\u20AE";
        }
        getOfferThumb(orderId) {
          if (!orderId) return "";
          try {
            const raw = localStorage.getItem("offers");
            const offers = raw ? JSON.parse(raw) : [];
            const match = Array.isArray(offers) ? offers.find((o) => (o?.orderId || o?.id) === orderId) : null;
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
          return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#39;");
        }
      };
      customElements.define("orders-page", OrdersPage);
    }
  });

  // front-end/assets/components/courier-card.js
  var courier_card_exports = {};
  var API2, Couriers;
  var init_courier_card = __esm({
    "front-end/assets/components/courier-card.js"() {
      API2 = "http://localhost:3000";
      Couriers = class extends HTMLElement {
        connectedCallback() {
          this.render();
          this.loadCourier();
        }
        async loadCourier() {
          try {
            const r = await fetch(`${API2}/api/courier/me`);
            if (!r.ok) throw new Error("courier not found");
            const courier = await r.json();
            if (courier) this.setData(courier);
          } catch {
            this.setEmpty();
          }
        }
        render() {
          this.innerHTML = `
      <article class="courier-card">
        <div class="delivery loading">
          <div class="avatar skeleton"></div>
          <div class="delivery-info">
            <div class="line skeleton"></div>
            <div class="line skeleton short"></div>
            <div class="line skeleton short"></div>
          </div>
        </div>
      </article>
    `;
        }
        setData({ name, phone, courier_id }) {
          this.innerHTML = `
      <article class="courier-card">
        <div class="delivery">
          <div class="avatar">
            <img src="assets/img/profile.jpg" alt="\u0425\u04AF\u0440\u0433\u044D\u0433\u0447\u0438\u0439\u043D \u0437\u0443\u0440\u0430\u0433">
          </div>
          <div class="courier-info">
            <h3>\u041D\u044D\u0440 : ${this.escape(name || "\u0425\u04AF\u0440\u0433\u044D\u0433\u0447")}</h3>
            <p>${phone ? `\u0423\u0442\u0430\u0441: ${this.escape(phone || "\u0425\u04AF\u0440\u0433\u044D\u0433\u0447")}` : ""}</p>
            <p>${courier_id ? `\u0425\u04AF\u0440\u0433\u044D\u0433\u0447\u0438\u0439\u043D ID: ${this.escape(courier_id || "\u0425\u04AF\u0440\u0433\u044D\u0433\u0447")}` : ""}</p>
          </div>
        </div>
      </article>
    `;
        }
        setEmpty() {
          this.innerHTML = `
      <article class="courier-card">
        <p class="muted">\u0425\u04AF\u0440\u0433\u044D\u0433\u0447\u0438\u0439\u043D \u043C\u044D\u0434\u044D\u044D\u043B\u044D\u043B \u043E\u043B\u0434\u0441\u043E\u043D\u0433\u04AF\u0439.</p>
      </article>
    `;
        }
        escape(s) {
          return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");
        }
        generateDisplayId(name, phone) {
          if (!name || !phone) return "";
          const namePart = name.substring(0, 3).toUpperCase();
          const phonePart = phone.substring(phone.length - 4);
          return `${namePart}${phonePart}`;
        }
      };
      customElements.define("couriers-card", Couriers);
    }
  });

  // front-end/assets/components/rating.js
  var rating_exports = {};
  var RatingStars;
  var init_rating = __esm({
    "front-end/assets/components/rating.js"() {
      RatingStars = class extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: "open" });
          this.value = 0;
        }
        connectedCallback() {
          const max = parseInt(this.getAttribute("max")) || 5;
          const color = this.getAttribute("color") || "gold";
          const size = this.getAttribute("size") || "26px";
          const style = document.createElement("style");
          style.textContent = `
      .rating {
        display: flex;
        gap: 5px;
        cursor: pointer;
        justify-content: center;
      }
      .star {
        font-size: ${size};
        color: #ccc;
        transition: color 0.25s;
      }
      .star.filled {
        color: ${color};
      }
    `;
          const container = document.createElement("div");
          container.classList.add("rating");
          for (let i = 1; i <= max; i++) {
            const span = document.createElement("span");
            span.textContent = "\u2605";
            span.classList.add("star");
            span.addEventListener("mouseover", () => this.updateStars(i));
            span.addEventListener("mouseout", () => this.updateStars(this.value));
            span.addEventListener("click", () => {
              this.value = i;
              this.setAttribute("value", i);
              this.dispatchEvent(new CustomEvent("rate", { detail: i }));
            });
            container.appendChild(span);
          }
          this.shadowRoot.append(style, container);
        }
        updateStars(count) {
          const stars = this.shadowRoot.querySelectorAll(".star");
          stars.forEach((s, idx) => {
            s.classList.toggle("filled", idx < count);
          });
        }
      };
      customElements.define("rating-stars", RatingStars);
    }
  });

  // front-end/assets/pages/profile-page.js
  var profile_page_exports = {};
  var ProfilePage;
  var init_profile_page = __esm({
    "front-end/assets/pages/profile-page.js"() {
      ProfilePage = class extends HTMLElement {
        connectedCallback() {
          this.renderAccessGate();
          this.ensureAuthenticated();
        }
        renderAccessGate() {
          this.innerHTML = `
      <link rel="stylesheet" href="assets/css/profile.css" />
      <section class="profile-page">
        <div class="profile-hero">
          <div class="profile-hero__content">
            <div class="profile-meta">
              <div class="hero-info hero-info--stack">
                <strong>\u041F\u0440\u043E\u0444\u0430\u0439\u043B \u0430\u0447\u0430\u0430\u043B\u0436 \u0431\u0430\u0439\u043D\u0430...</strong>
                <span class="muted">\u041D\u044D\u0432\u0442\u0440\u044D\u043B\u0442 \u0448\u0430\u043B\u0433\u0430\u0436 \u0431\u0430\u0439\u043D\u0430</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
        }
        async ensureAuthenticated() {
          try {
            const res = await fetch("/api/auth/me");
            if (!res.ok) {
              this.redirectToLogin();
              return;
            }
            const data = await res.json();
            if (!data?.user?.id) {
              this.redirectToLogin();
              return;
            }
            this.currentUser = data.user;
            this.renderProfile();
          } catch (e) {
            this.redirectToLogin();
          }
        }
        redirectToLogin() {
          this.innerHTML = `
      <link rel="stylesheet" href="assets/css/profile.css" />
      <section class="profile-page">
        <div class="profile-hero">
          <div class="profile-hero__content">
            <div class="profile-meta">
              <div class="hero-info hero-info--stack">
                <strong>\u041F\u0440\u043E\u0444\u0430\u0439\u043B \u0445\u0430\u0440\u0430\u0445\u044B\u043D \u0442\u0443\u043B\u0434 \u043D\u044D\u0432\u0442\u044D\u0440\u043D\u044D \u04AF\u04AF.</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
          location.hash = "#login";
        }
        renderProfile() {
          this.profileData = this.loadProfileData();
          const activeOrders = this.getActiveOrders();
          const activeOrdersMarkup = this.buildActiveOrdersMarkup(activeOrders);
          const reviews = this.getReviews();
          const reviewsMarkup = this.buildReviewsMarkup(reviews);
          const reviewsModalMarkup = this.buildReviewsMarkup(reviews);
          const orderHistory = this.getOrderHistory();
          const deliveryHistory = this.getDeliveryHistory();
          this.innerHTML = `
      <link rel="stylesheet" href="assets/css/profile.css" />
      <section class="profile-page">
        <div class="profile-hero">
          <div class="profile-hero__content">
            <div class="avatar-wrap">
              <img src="${this.profileData.avatar || "assets/img/profile.jpg"}" alt="\u041F\u0440\u043E\u0444\u0430\u0439\u043B \u0437\u0443\u0440\u0430\u0433" class="avatar profile-avatar" width="120" height="120" decoding="async" />
            </div>

            <div class="profile-meta">
              <div class="hero-info hero-info--stack">
                <div><span class="label">\u041D\u044D\u0440:</span><strong class="profile-name">${this.profileData.name}</strong></div>
                <div><span class="label">\u0423\u0442\u0430\u0441:</span><strong class="profile-phone">${this.profileData.phone}</strong></div>
                <div><span class="label">ID:</span><strong class="profile-id">${this.profileData.id}</strong></div>
                <div><span class="label">\u0418\u043C\u044D\u0439\u043B:</span><strong class="profile-email">${this.profileData.email}</strong></div>
              </div>

              <div class="hero-actions">
                <button class="btn primary" data-modal-open="ordersModal" id="openOrderBtn">\u041C\u0438\u043D\u0438\u0439 \u0437\u0430\u0445\u0438\u0430\u043B\u0433\u0430</button>
                <button class="btn ghost" data-modal-open="deliveryModal" id="openDeliveryBtn">\u041C\u0438\u043D\u0438\u0439 \u0445\u04AF\u0440\u0433\u044D\u043B\u0442</button>
              </div>
            </div>

            <div class="hero-stats">
              <div class="stat-card">
                <p>\u041D\u0438\u0439\u0442 \u0437\u0430\u0445\u0438\u0430\u043B\u0433\u0430</p>
                <strong id="orderTotal">0</strong>
              </div>
              <div class="stat-card">
                <p>\u0414\u0443\u043D\u0434\u0430\u0436 \u04AF\u043D\u044D\u043B\u0433\u044D\u044D</p>
                <div class="stars avg-stars" aria-label="0 \u043E\u0434">
                  <span>\u2605</span><span>\u2605</span><span>\u2605</span><span>\u2605</span><span>\u2605</span>
                </div>
                <small class="avg-rating-text">0 / 5</small>
              </div>
            </div>
          </div>
        </div>

        <div class="profile-actions-desktop">
          <button class="action-card" type="button" data-modal-open="ordersModal">
            <span class="action-title">\u041C\u0438\u043D\u0438\u0439 \u0437\u0430\u0445\u0438\u0430\u043B\u0433\u0430</span>
            <span class="action-subtitle">\u0422\u04AF\u04AF\u0445, \u0442\u04E9\u043B\u04E9\u0432\u0438\u0439\u0433 \u0445\u0430\u0440\u0430\u0445</span>
          </button>
          <button class="action-card" type="button" data-modal-open="deliveryModal">
            <span class="action-title">\u041C\u0438\u043D\u0438\u0439 \u0445\u04AF\u0440\u0433\u044D\u043B\u0442</span>
            <span class="action-subtitle">\u0425\u04AF\u0440\u0433\u044D\u043B\u0442\u0438\u0439\u043D \u043C\u044D\u0434\u044D\u044D\u043B\u044D\u043B</span>
          </button>
        </div>

        <div class="profile-grid">
          <article class="profile-card reviews">
            <header>
              <div>
                <p class="eyebrow">\u0421\u044D\u0442\u0433\u044D\u0433\u0434\u044D\u043B</p>
              </div>
              <button class="ghost-btn small open-reviews">\u0411\u04AF\u0433\u0434\u0438\u0439\u0433 \u0445\u0430\u0440\u0430\u0445</button>
            </header>

            <div class="review-list">${reviewsMarkup}</div>
          </article>
        </div>
      </section>

      <div class="modal-backdrop" data-modal="profileModal">
        <div class="modal-card">
          <header class="modal-header">
            <div>
              <p class="eyebrow">\u041F\u0440\u043E\u0444\u0430\u0439\u043B \u0437\u0430\u0441\u0430\u0445</p>
              <h3>\u041C\u044D\u0434\u044D\u044D\u043B\u043B\u044D\u044D \u0448\u0438\u043D\u044D\u0447\u043B\u044D\u0445</h3>
            </div>
            <button class="icon-btn close-modal" data-close="profileModal">\xD7</button>
          </header>
          <form id="profileForm" class="modal-body">
            <label>
              <span>\u041D\u044D\u0440</span>
              <input type="text" name="name" required />
            </label>
            <label>
              <span>\u0423\u0442\u0430\u0441</span>
              <input type="tel" name="phone" required />
            </label>
            <label>
              <span>\u0418\u043C\u044D\u0439\u043B</span>
              <input type="email" name="email" required />
            </label>
            <label>
              <span>ID</span>
              <input type="text" name="id" />
            </label>
            <label>
              <span>\u0417\u0443\u0440\u0430\u0433 (URL)</span>
              <input type="url" name="avatar" placeholder="assets/img/profile.jpg" />
            </label>
            <div class="modal-actions">
              <button type="button" class="btn ghost close-modal" data-close="profileModal">\u0411\u043E\u043B\u0438\u0445</button>
              <button type="submit" class="btn primary">\u0425\u0430\u0434\u0433\u0430\u043B\u0430\u0445</button>
            </div>
          </form>
        </div>
      </div>

      <div class="modal-backdrop" data-modal="reviewsModal">
        <div class="modal-card">
          <header class="modal-header">
            <div>
              <p class="eyebrow">\u0421\u044D\u0442\u0433\u044D\u0433\u0434\u043B\u04AF\u04AF\u0434</p>
            </div>
            <button class="icon-btn close-modal" data-close="reviewsModal">\xD7</button>
          </header>
          <div class="modal-body review-list modal-scroll">
            ${reviewsModalMarkup}
          </div>
        </div>
      </div>

      <div class="modal-backdrop" data-modal="ordersModal">
        <div class="modal-card">
          <header class="modal-header">
            <div>
              <h3 class="modal-title">\u041C\u0438\u043D\u0438\u0439 \u0437\u0430\u0445\u0438\u0430\u043B\u0433\u0430</h3>
            </div>
            <button class="icon-btn close-modal" data-close="ordersModal">\xD7</button>
          </header>
          <div class="modal-body modal-scroll history-list" data-history="orders">
            ${this.buildHistoryMarkup(orderHistory, "\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0431\u0430\u0439\u0445\u0433\u04AF\u0439")}
          </div>
        </div>
      </div>

      <div class="modal-backdrop" data-modal="deliveryModal">
        <div class="modal-card">
          <header class="modal-header">
            <div>
              <h3 class="modal-title">\u041C\u0438\u043D\u0438\u0439 \u0445\u04AF\u0440\u0433\u044D\u043B\u0442</h3>
            </div>
            <button class="icon-btn close-modal" data-close="deliveryModal">\xD7</button>
          </header>
          <div class="modal-body modal-scroll history-list" data-history="deliveries">
            ${this.buildHistoryMarkup(deliveryHistory, "\u0425\u04AF\u0440\u0433\u044D\u043B\u0442 \u0431\u0430\u0439\u0445\u0433\u04AF\u0439")}
          </div>
        </div>
      </div>
      <div class="history">
        <section class="btn-order" id="openOrderBtn">
          \u041C\u0438\u043D\u0438\u0439 \u0437\u0430\u0445\u0438\u0430\u043B\u0433\u0430
          <div class="history-inline" data-history="orders">
            ${this.buildHistoryMarkup(orderHistory, "\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0431\u0430\u0439\u0445\u0433\u04AF\u0439")}
          </div>
        </section>
        <section class="btn-delivery" id="openDeliveryBtn">
          \u041C\u0438\u043D\u0438\u0439 \u0445\u04AF\u0440\u0433\u044D\u043B\u0442
          <div class="history-inline" data-history="deliveries">
            ${this.buildHistoryMarkup(deliveryHistory, "\u0425\u04AF\u0440\u0433\u044D\u043B\u0442 \u0431\u0430\u0439\u0445\u0433\u04AF\u0439")}
          </div>
        </section>
      </div>
    `;
          this.bindProfileData();
          this.attachNavigation();
          this.attachModalHandlers();
          this.hydrateProfileFromApi();
          this.loadActiveOrder();
          this.loadOrderStats();
          this.handleReviewsUpdated = this.loadReviews.bind(this);
          window.addEventListener("reviews-updated", this.handleReviewsUpdated);
          this.loadReviews();
          this.loadOrderHistory();
          this.loadDeliveryHistory();
        }
        disconnectedCallback() {
          if (this.handleReviewsUpdated) {
            window.removeEventListener("reviews-updated", this.handleReviewsUpdated);
          }
        }
        loadProfileData() {
          return {
            name: "",
            phone: "",
            email: "",
            id: "",
            avatar: "assets/img/profile.jpg"
          };
        }
        async hydrateProfileFromApi() {
          try {
            const res = await fetch("/api/auth/me");
            if (!res.ok) return;
            const data = await res.json();
            const user = data?.user;
            if (!user) return;
            this.profileData = {
              ...this.profileData,
              name: user.name || this.profileData.name,
              phone: user.phone || this.profileData.phone,
              id: user.student_id || this.profileData.id,
              avatar: user.avatar || this.profileData.avatar
            };
            this.bindProfileData();
          } catch (e) {
          }
        }
        getActiveOrders() {
          return [];
        }
        getReviews() {
          return [];
        }
        getOrderHistory() {
          return [];
        }
        getDeliveryHistory() {
          return [];
        }
        buildActiveOrdersMarkup(orders) {
          if (!orders.length) {
            return '<span class="pill pill--muted">\u0418\u0434\u044D\u0432\u0445\u0442\u044D\u0439 \u0437\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0430\u043B\u0433\u0430</span>';
          }
          return orders.map((order) => {
            const route = [order.from, order.to].filter(Boolean).join(" \u2192 ");
            const item = order.item ? ` \xB7 ${order.item}` : "";
            return `<span class="pill pill--order">${route || "\u0428\u0438\u043D\u044D \u0437\u0430\u0445\u0438\u0430\u043B\u0433\u0430"}${item}</span>`;
          }).join("");
        }
        buildReviewsMarkup(list) {
          if (!list.length) {
            return `<p class="muted">\u0421\u044D\u0442\u0433\u044D\u0433\u0434\u044D\u043B \u0431\u0430\u0439\u0445\u0433\u04AF\u0439</p>`;
          }
          const safeItems = list.map((r) => ({ ...r, safeText: this.cleanReviewText(r.text) })).filter((r) => r.safeText);
          if (!safeItems.length) {
            return `<p class="muted">\u0421\u044D\u0442\u0433\u044D\u0433\u0434\u044D\u043B \u0431\u0430\u0439\u0445\u0433\u04AF\u0439</p>`;
          }
          return safeItems.map((r) => `
      <div class="review">
        <div>
          <p>${r.safeText}</p>
        </div>
        <span class="stars" aria-label="${r.stars} \u043E\u0434">${this.toStars(r.stars)}</span>
      </div>
    `).join("");
        }
        escapeHtml(value) {
          return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#39;");
        }
        cleanReviewText(value) {
          const raw = String(value ?? "").trim();
          if (!raw) return "";
          if (/<[^>]*>/.test(raw)) return "";
          if (/&lt;|&gt;|&#60;|&#62;/i.test(raw)) return "";
          return this.escapeHtml(raw);
        }
        buildHistoryMarkup(list, emptyText) {
          if (!list.length) {
            return `<div class="muted">${emptyText}</div>`;
          }
          return list.map((item, idx) => {
            const icon = this.getHistoryIcon(idx);
            return `
      <div class="history-card">
        <div class="history-icon" aria-hidden="true">
          <img src="${icon}" alt="" width="32" height="32" decoding="async">
        </div>
        <div class="history-info">
          <h4>${item.title}</h4>
          <p class="muted">${item.detail}</p>
        </div>
        <div class="history-price">${item.price || ""}</div>
      </div>
    `;
          }).join("");
        }
        formatPrice(amount) {
          return Number(amount || 0).toLocaleString("mn-MN") + "\u20AE";
        }
        formatHistoryDetail(item) {
          const ts = this.getOrderTimestamp(item);
          if (!ts) return "";
          const dt = new Date(ts);
          return `${dt.toLocaleDateString()} \xB7 ${dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
        }
        async loadOrderHistory() {
          try {
            if (this.currentUser?.role && this.currentUser.role !== "customer") {
              this.updateHistoryUI("orders", [], "\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0431\u0430\u0439\u0445\u0433\u04AF\u0439");
              return;
            }
            this.updateHistoryMessage("orders", "\u0410\u0447\u0430\u0430\u043B\u043B\u0430\u0436 \u0431\u0430\u0439\u043D\u0430...");
            const res = await fetch("/api/orders/history/customer", { credentials: "include" });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) return;
            const items = Array.isArray(data?.items) ? data.items : [];
            const list = items.map((item) => ({
              title: `${item.from_name || ""} \u2192 ${item.to_name || ""}`.trim(),
              detail: this.formatHistoryDetail(item),
              price: this.formatPrice(item.total_amount || 0)
            }));
            this.updateHistoryUI("orders", list, "\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0431\u0430\u0439\u0445\u0433\u04AF\u0439");
          } catch (e) {
            this.updateHistoryMessage("orders", "\u0410\u0447\u0430\u0430\u043B\u043B\u0430\u0436 \u0447\u0430\u0434\u0441\u0430\u043D\u0433\u04AF\u0439");
          }
        }
        async loadDeliveryHistory() {
          try {
            if (this.currentUser?.role && this.currentUser.role !== "courier") {
              this.updateHistoryUI("deliveries", [], "\u0425\u04AF\u0440\u0433\u044D\u043B\u0442 \u0431\u0430\u0439\u0445\u0433\u04AF\u0439");
              return;
            }
            this.updateHistoryMessage("deliveries", "\u0410\u0447\u0430\u0430\u043B\u043B\u0430\u0436 \u0431\u0430\u0439\u043D\u0430...");
            const res = await fetch("/api/orders/history/courier", { credentials: "include" });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) return;
            const items = Array.isArray(data?.items) ? data.items : [];
            const list = items.map((item) => ({
              title: `${item.from_name || ""} \u2192 ${item.to_name || ""}`.trim(),
              detail: this.formatHistoryDetail(item),
              price: this.formatPrice(item.total_amount || 0)
            }));
            this.updateHistoryUI("deliveries", list, "\u0425\u04AF\u0440\u0433\u044D\u043B\u0442 \u0431\u0430\u0439\u0445\u0433\u04AF\u0439");
          } catch (e) {
            this.updateHistoryMessage("deliveries", "\u0410\u0447\u0430\u0430\u043B\u043B\u0430\u0436 \u0447\u0430\u0434\u0441\u0430\u043D\u0433\u04AF\u0439");
          }
        }
        updateHistoryUI(type, list, emptyText) {
          const html = this.buildHistoryMarkup(list, emptyText);
          this.querySelectorAll(`[data-history="${type}"]`).forEach((el) => {
            el.innerHTML = html;
          });
        }
        updateHistoryMessage(type, message) {
          const html = `<div class="muted">${this.escapeHtml(message)}</div>`;
          this.querySelectorAll(`[data-history="${type}"]`).forEach((el) => {
            el.innerHTML = html;
          });
        }
        getHistoryIcon(idx = 0) {
          const icons = [
            "assets/img/document.svg",
            "assets/img/tor.svg",
            "assets/img/box.svg"
          ];
          return icons[idx % icons.length];
        }
        bindProfileData() {
          const { name, phone, email, id, avatar } = this.profileData;
          const nameEls = this.querySelectorAll(".profile-name");
          nameEls.forEach((el) => {
            el.textContent = name;
          });
          const phoneEl = this.querySelector(".profile-phone");
          if (phoneEl) {
            phoneEl.textContent = phone;
            const row = phoneEl.closest("div");
            if (row) row.style.display = phone ? "" : "none";
          }
          const emailEl = this.querySelector(".profile-email");
          if (emailEl) {
            emailEl.textContent = email;
            const row = emailEl.closest("div");
            if (row) row.style.display = email ? "" : "none";
          }
          const idEl = this.querySelector(".profile-id");
          if (idEl) {
            idEl.textContent = id;
            const row = idEl.closest("div");
            if (row) row.style.display = id ? "" : "none";
          }
          const avatarEl = this.querySelector(".profile-avatar");
          if (avatarEl) avatarEl.src = avatar || "assets/img/profile.jpg";
          const form = this.querySelector("#profileForm");
          if (form) {
            form.name.value = name;
            form.phone.value = phone;
            form.email.value = email;
            form.id.value = id;
            form.avatar.value = avatar || "";
          }
        }
        attachNavigation() {
          const navButtons = this.querySelectorAll("[data-nav]");
          navButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
              const target = btn.getAttribute("data-nav");
              if (target) {
                location.hash = target;
              }
            });
          });
        }
        attachModalHandlers() {
          const editBtn = this.querySelector("#editProfileBtn");
          if (editBtn) {
            editBtn.addEventListener("click", () => this.toggleModal("profileModal", true));
          }
          this.querySelectorAll("[data-modal-open]").forEach((btn) => {
            btn.addEventListener("click", () => {
              const id = btn.getAttribute("data-modal-open");
              this.toggleModal(id, true);
            });
          });
          const reviewBtn = this.querySelector(".open-reviews");
          if (reviewBtn) {
            reviewBtn.addEventListener("click", () => this.toggleModal("reviewsModal", true));
          }
          this.querySelectorAll(".close-modal").forEach((btn) => {
            btn.addEventListener("click", () => {
              const id = btn.getAttribute("data-close");
              this.toggleModal(id, false);
            });
          });
          this.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
            backdrop.addEventListener("click", (e) => {
              if (e.target === backdrop) {
                const id = backdrop.getAttribute("data-modal");
                this.toggleModal(id, false);
              }
            });
          });
          const form = this.querySelector("#profileForm");
          if (form) {
            form.addEventListener("submit", (e) => {
              e.preventDefault();
              this.profileData = {
                ...this.profileData,
                name: form.name.value.trim(),
                phone: form.phone.value.trim(),
                email: form.email.value.trim(),
                id: form.id.value.trim(),
                avatar: this.profileData.avatar
              };
              this.saveProfileToApi();
              this.bindProfileData();
              window.dispatchEvent(new Event("user-updated"));
              this.toggleModal("profileModal", false);
            });
          }
        }
        async loadReviews() {
          try {
            if (this.currentUser?.role === "courier") {
              const courierRes = await fetch(`/api/ratings/courier/${this.currentUser.id}`);
              if (!courierRes.ok) return;
              const courierData = await courierRes.json();
              const items2 = Array.isArray(courierData?.items) ? courierData.items : [];
              const reviews2 = items2.map((r) => ({
                text: r.comment || "",
                stars: r.stars
              }));
              this.updateReviewsUI(reviews2);
              this.updateAverageRating(courierData?.courier?.rating_avg);
              return;
            }
            const res = await fetch("/api/ratings/me");
            if (!res.ok) return;
            const data = await res.json();
            const items = Array.isArray(data?.items) ? data.items : [];
            const reviews = items.map((r) => ({
              text: r.comment || "",
              stars: r.stars
            }));
            this.updateReviewsUI(reviews);
          } catch (e) {
            console.error("Load reviews error:", e);
          }
        }
        updateReviewsUI(reviews) {
          const content = this.buildReviewsMarkup(reviews);
          const lists = this.querySelectorAll(".review-list");
          if (lists[0]) lists[0].innerHTML = content;
          if (lists[1]) lists[1].innerHTML = content;
        }
        toStars(value) {
          const count = Math.max(0, Math.min(5, Number(value) || 0));
          return "\u2605\u2605\u2605\u2605\u2605".slice(0, count) + "\u2606\u2606\u2606\u2606\u2606".slice(0, 5 - count);
        }
        updateAverageRating(avg) {
          const starsWrap = this.querySelector(".avg-stars");
          const textEl = this.querySelector(".avg-rating-text");
          if (!starsWrap || !textEl) return;
          const safeAvg = Math.max(0, Math.min(5, Number(avg) || 0));
          const filledCount = Math.round(safeAvg);
          const stars = starsWrap.querySelectorAll("span");
          stars.forEach((star, idx) => {
            star.classList.toggle("dim", idx >= filledCount);
          });
          starsWrap.setAttribute("aria-label", `${safeAvg.toFixed(1)} \u043E\u0434`);
          textEl.textContent = `${safeAvg.toFixed(1)} / 5`;
        }
        async saveProfileToApi() {
          try {
            await fetch("/api/auth/me", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: this.profileData.name,
                phone: this.profileData.phone,
                studentId: this.profileData.id,
                avatar: this.profileData.avatar
              })
            });
          } catch (e) {
          }
        }
        async loadActiveOrder() {
          try {
            const res = await fetch("/api/active-order");
            if (!res.ok) return;
            const data = await res.json();
            const order = data?.order;
            if (!order) return;
            const activeOrdersMarkup = this.buildActiveOrdersMarkup([order]);
            const pillWrap = this.querySelector(".pill");
            if (pillWrap) {
              pillWrap.outerHTML = activeOrdersMarkup;
            }
          } catch (e) {
          }
        }
        async loadOrderStats() {
          const totalEl = this.querySelector("#orderTotal");
          if (!totalEl) return;
          const userId = this.currentUser?.id;
          if (!userId) return;
          try {
            const res = await fetch(`/api/orders?customerId=${encodeURIComponent(userId)}`, {
              credentials: "include"
            });
            const data = await res.json().catch(() => []);
            if (!res.ok || !Array.isArray(data)) return;
            const total = data.length;
            totalEl.textContent = String(total);
          } catch (e) {
          }
        }
        getOrderTimestamp(o) {
          const raw = o.scheduled_at || o.scheduledAt || o.created_at || o.createdAt || o.meta || null;
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
            const d = /* @__PURE__ */ new Date(`${yy}-${mm}-${dd} ${time}`);
            if (!Number.isNaN(d.getTime())) return d.getTime();
          }
          return null;
        }
        toggleModal(id, open) {
          const modal = this.querySelector(`[data-modal="${id}"]`);
          if (!modal) return;
          modal.classList.toggle("open", open);
        }
      };
      customElements.define("profile-page", ProfilePage);
    }
  });

  // front-end/assets/pages/pay-page.js
  var pay_page_exports = {};
  var PayPage;
  var init_pay_page = __esm({
    "front-end/assets/pages/pay-page.js"() {
      PayPage = class extends HTMLElement {
        connectedCallback() {
          this.handleRouteChange = this.handleRouteChange.bind(this);
          window.addEventListener("hashchange", this.handleRouteChange);
          this.handleRouteChange();
        }
        disconnectedCallback() {
          window.removeEventListener("hashchange", this.handleRouteChange);
        }
        async handleRouteChange() {
          if (location.hash !== "#pay") return;
          const loggedIn = localStorage.getItem("authLoggedIn");
          const role = localStorage.getItem("authRole");
          if (loggedIn !== "1" || role !== "courier") {
            location.hash = "#login";
            return;
          }
          let phone = (localStorage.getItem("authPhone") || "").trim();
          let studentId = (localStorage.getItem("authStudentId") || "").trim();
          let userId = (localStorage.getItem("authUserKey") || "").trim();
          if (!phone && !studentId) {
            try {
              const meRes = await fetch("/api/auth/me", { credentials: "include" });
              if (meRes.ok) {
                const data = await meRes.json();
                const user = data?.user || {};
                phone = String(user.phone || "").trim();
                studentId = String(user.student_id || user.studentId || "").trim();
                userId = String(user.id || userId || "").trim();
              }
            } catch {
            }
          }
          const keySeed = studentId || phone || userId || "courier";
          const paidKey = `courierPaid:${keySeed}`;
          const isPaid = () => localStorage.getItem(paidKey) === "1";
          this.innerHTML = `
      <link rel="stylesheet" href="assets/css/pay.css">
      <div class="pay-wrap">
        <div class="pay-card">
          <div class="pay-head">
            <h2>\u0425\u04AF\u0440\u0433\u044D\u0433\u0447\u0438\u0439\u043D \u0442\u04E9\u043B\u0431\u04E9\u0440</h2>
            <button class="btn-close" type="button" aria-label="\u0425\u0430\u0430\u0445">\u2715</button>
          </div>

          <p class="pay-note">\u0422\u04E9\u043B\u0431\u04E9\u0440\u04E9\u04E9 \u0441\u043E\u043D\u0433\u043E\u043E\u0434 \u0442\u04E9\u043B\u0431\u04E9\u0440\u04E9\u04E9 \u0445\u0438\u0439\u0441\u043D\u044D\u044D\u0440 \u0445\u04AF\u0440\u0433\u044D\u043B\u0442\u0438\u0439\u043D \u0445\u044D\u0441\u044D\u0433 \u043D\u044D\u044D\u0433\u0434\u044D\u043D\u044D.</p>

          <div class="grid">
            <div class="block">
              <h4>\u0411\u0430\u0433\u0446 \u0441\u043E\u043D\u0433\u043E\u0445</h4>
              <div class="plan-grid">
                <label class="plan-card">
                  <input type="radio" name="paymentPlan" value="monthly" checked>
                  <span>\u0421\u0430\u0440\u0434 3000\u20AE</span>
                </label>
                <label class="plan-card">
                  <input type="radio" name="paymentPlan" value="two-months">
                  <span>2 \u0441\u0430\u0440\u0434 5000\u20AE</span>
                </label>
                <label class="plan-card">
                  <input type="radio" name="paymentPlan" value="two-weeks">
                  <span>14 \u0445\u043E\u043D\u043E\u0433\u0442 2000\u20AE</span>
                </label>
              </div>
            </div>

            <div class="block">
              <h4>\u0422\u04E9\u043B\u0431\u04E9\u0440\u0438\u0439\u043D \u0430\u0440\u0433\u0430</h4>
              <div class="method-grid">
                <label class="method-card">
                  <input type="radio" name="paymentMethod" value="card" checked>
                  <span>\u041A\u0430\u0440\u0442\u0430\u0430\u0440 \u0442\u04E9\u043B\u04E9\u0445</span>
                </label>
                <label class="method-card">
                  <input type="radio" name="paymentMethod" value="qpay">
                  <span>QPay-\u0440 \u0442\u04E9\u043B\u04E9\u0445</span>
                </label>
              </div>

              <div class="payment-details payment-details--card">
                <div class="form-group">
                  <label for="cardNumber">\u041A\u0430\u0440\u0442\u044B\u043D \u0434\u0443\u0433\u0430\u0430\u0440</label>
                  <input id="cardNumber" type="text" inputmode="numeric" placeholder="0000 0000 0000 0000">
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="cardExp">\u0414\u0443\u0443\u0441\u0430\u0445 \u0445\u0443\u0433\u0430\u0446\u0430\u0430</label>
                    <input id="cardExp" type="text" placeholder="MM/YY">
                  </div>
                  <div class="form-group">
                    <label for="cardCvv">CVV</label>
                    <input id="cardCvv" type="password" inputmode="numeric" placeholder="***">
                  </div>
                </div>
              </div>

              <div class="payment-details payment-details--qpay" hidden>
                <div class="qpay-box">
                  <div class="qpay-qr">QR</div>
                  <div>
                    <strong>QPay \u0442\u04E9\u043B\u0431\u04E9\u0440</strong>
                    <p>QR \u043A\u043E\u0434 \u0443\u043D\u0448\u0443\u0443\u043B\u0436 \u0442\u04E9\u043B\u043D\u04E9 \u04AF\u04AF.</p>
                  </div>
                </div>
              </div>

              <div class="actions">
                <button class="btn-pay" type="button">\u0422\u04E9\u043B\u0431\u04E9\u0440 \u0442\u04E9\u043B\u04E9\u0445</button>
                <button class="btn-go" type="button" hidden>\u0425\u04AF\u0440\u0433\u044D\u043B\u0442 \u0440\u04AF\u04AF \u043E\u0440\u043E\u0445</button>
                <p class="status" hidden>\u2705 \u0422\u04E9\u043B\u0431\u04E9\u0440 \u0442\u04E9\u043B\u04E9\u0433\u0434\u0441\u04E9\u043D.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
          const closeBtn = this.querySelector(".btn-close");
          const payBtn = this.querySelector(".btn-pay");
          const goBtn = this.querySelector(".btn-go");
          const statusEl = this.querySelector(".status");
          const methodRadios = this.querySelectorAll('input[name="paymentMethod"]');
          const showPaidUI = () => {
            statusEl && (statusEl.hidden = false);
            if (payBtn) {
              payBtn.disabled = true;
              payBtn.textContent = "\u0422\u04E9\u043B\u0431\u04E9\u0440 \u0442\u04E9\u043B\u04E9\u0433\u0434\u0441\u04E9\u043D";
            }
            goBtn && (goBtn.hidden = false);
          };
          const showUnpaidUI = () => {
            statusEl && (statusEl.hidden = true);
            if (payBtn) {
              payBtn.disabled = false;
              payBtn.textContent = "\u0422\u04E9\u043B\u0431\u04E9\u0440 \u0442\u04E9\u043B\u04E9\u0445";
            }
            goBtn && (goBtn.hidden = true);
          };
          const syncMethodUI = () => {
            const method = this.querySelector('input[name="paymentMethod"]:checked')?.value || "card";
            const card = this.querySelector(".payment-details--card");
            const qpay = this.querySelector(".payment-details--qpay");
            card && (card.hidden = method !== "card");
            qpay && (qpay.hidden = method !== "qpay");
          };
          closeBtn?.addEventListener("click", () => location.hash = "#profile");
          methodRadios.forEach((r) => r.addEventListener("change", syncMethodUI));
          syncMethodUI();
          localStorage.setItem("courierPaid", isPaid() ? "1" : "0");
          if (isPaid()) showPaidUI();
          else showUnpaidUI();
          payBtn?.addEventListener("click", () => {
            localStorage.setItem(paidKey, "1");
            localStorage.setItem("courierPaid", "1");
            showPaidUI();
            window.dispatchEvent(new Event("user-updated"));
          });
          goBtn?.addEventListener("click", () => {
            location.hash = "#delivery";
          });
        }
      };
      customElements.define("pay-page", PayPage);
    }
  });

  // front-end/assets/pages/login-page.js
  var login_page_exports = {};
  var LoginPage;
  var init_login_page = __esm({
    "front-end/assets/pages/login-page.js"() {
      LoginPage = class extends HTMLElement {
        connectedCallback() {
          const API3 = "http://localhost:3000";
          this.currentMode = "login";
          this.currentRole = "customer";
          this.innerHTML = `
      <link rel="stylesheet" href="assets/css/login.css">
      <div class="card" role="dialog" aria-labelledby="login-title">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <div style="width:18px"></div>
          <strong id="login-title">\u0411\u04AF\u0440\u0442\u0433\u04AF\u04AF\u043B\u044D\u0445</strong>
          
          <div class="close">\u2715</div>
        </div>

        <div class="auth-tabs" role="tablist" aria-label="\u041D\u044D\u0432\u0442\u0440\u044D\u0445 \u044D\u0441\u0432\u044D\u043B \u0431\u04AF\u0440\u0442\u0433\u04AF\u04AF\u043B\u044D\u0445">
          <button class="tab-btn is-active" type="button" data-mode="login" role="tab" aria-selected="true">
            \u041D\u044D\u0432\u0442\u0440\u044D\u0445
          </button>
          <button class="tab-btn" type="button" data-mode="register" role="tab" aria-selected="false">
            \u0411\u04AF\u0440\u0442\u0433\u04AF\u04AF\u043B\u044D\u0445
          </button>
        </div>

        <div class="login-tabs-row">
          <div class="subtitle">
            \u041D\u044D\u0440 \u0431\u043E\u043B\u043E\u043D \u043D\u0443\u0443\u0446 \u04AF\u0433\u044D\u044D \u0430\u0448\u0438\u0433\u043B\u0430\u043D \u043D\u044D\u0432\u0442\u044D\u0440\u043D\u044D.
          </div>
           <div class="login-tabs register-only" role="tablist" aria-label="\u0411\u04AF\u0440\u0442\u0433\u044D\u043B\u0438\u0439\u043D \u0442\u04E9\u0440\u04E9\u043B">
            <button class="tab-btn is-active" type="button" data-role="customer" role="tab" aria-selected="true" aria-label="\u0425\u044D\u0440\u044D\u0433\u043B\u044D\u0433\u0447\u044D\u044D\u0440">
              \u0425\u044D\u0440\u044D\u0433\u043B\u044D\u0433\u0447\u044D\u044D\u0440
            </button>
            <button class="tab-btn" type="button" data-role="courier" role="tab" aria-selected="false" aria-label="\u0425\u04AF\u0440\u0433\u044D\u0433\u0447\u044D\u044D\u0440">
              \u0425\u04AF\u0440\u0433\u044D\u0433\u0447\u044D\u044D\u0440
            </button>
          </div>
        </div>

        <div class="auth-layout">
          <form>
          <input class="register-only" type="hidden" name="role" value="customer">
          <div class="form-group register-only">
            <label for="name">\u041D\u044D\u0440</label>
            <input id="name" name="name" type="text" placeholder="\u041D\u044D\u0440">
          </div>
          <div class="form-group">
            <label for="phone">\u0423\u0442\u0430\u0441\u043D\u044B \u0434\u0443\u0433\u0430\u0430\u0440</label>
            <input id="phone" name="phone" type="tel" placeholder="\u0423\u0442\u0430\u0441\u043D\u044B \u0434\u0443\u0433\u0430\u0430\u0440" required>
          </div>
          <div class="form-group register-only">
            <label for="studentId">ID</label>
            <input id="studentId" name="studentId" type="text" placeholder="ID">
          </div>
          <div class="form-group">
            <label for="password">\u041D\u0443\u0443\u0446 \u04AF\u0433</label>
            <input id="password" name="password" type="password" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" required>
          </div>

          <button class="continue-btn" type="submit">\u0411\u04AF\u0440\u0442\u0433\u04AF\u04AF\u043B\u044D\u0445</button>

          <div class="privacy">\u041D\u0443\u0443\u0446\u043B\u0430\u043B\u044B\u043D \u0431\u043E\u0434\u043B\u043E\u0433\u043E</div>

          <div class="or">\u044D\u0441\u0432\u044D\u043B</div>

          <div class="social">
            <button type="button" class="btn-social">
              <img src="assets/img/num-logo.svg" alt="num-logo">
              SISI-\u044D\u044D\u0440 \u04AF\u0440\u0433\u044D\u043B\u0436\u043B\u04AF\u04AF\u043B\u044D\u0445
            </button>
          </div>
          </form>

          <div class="payment-section" hidden>
            <h4 class="section-title">\u0425\u04AF\u0440\u0433\u044D\u0433\u0447\u0438\u0439\u043D \u0442\u04E9\u043B\u0431\u04E9\u0440</h4>
            <p class="section-note">\u0422\u04E9\u043B\u0431\u04E9\u0440\u04E9\u04E9 \u0441\u043E\u043D\u0433\u043E\u043E\u0434 \u0434\u0430\u0440\u0430\u0430 \u043D\u044C \u0442\u04E9\u043B\u043D\u04E9 \u04AF\u04AF.</p>
            <div class="plan-grid">
              <label class="plan-card">
                <input type="radio" name="paymentPlan" value="monthly" checked>
                <span>\u0421\u0430\u0440\u0434 3000\u20AE</span>
              </label>
              <label class="plan-card">
                <input type="radio" name="paymentPlan" value="two-months">
                <span>2 \u0441\u0430\u0440\u0434 5000\u20AE</span>
              </label>
              <label class="plan-card">
                <input type="radio" name="paymentPlan" value="two-weeks">
                <span>14 \u0445\u043E\u043D\u043E\u0433\u0442 2000\u20AE</span>
              </label>
            </div>
            <div class="method-grid">
              <label class="method-card">
                <input type="radio" name="paymentMethod" value="card" checked>
                <span>\u041A\u0430\u0440\u0442\u0430\u0430\u0440 \u0442\u04E9\u043B\u04E9\u0445</span>
              </label>
              <label class="method-card">
                <input type="radio" name="paymentMethod" value="qpay">
                <span>QPay-\u0440 \u0442\u04E9\u043B\u04E9\u0445</span>
              </label>
            </div>
            <div class="payment-details payment-details--card">
              <div class="form-group">
                <label for="cardNumber">\u041A\u0430\u0440\u0442\u044B\u043D \u0434\u0443\u0433\u0430\u0430\u0440</label>
                <input id="cardNumber" type="text" inputmode="numeric" placeholder="0000 0000 0000 0000">
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="cardExp">\u0414\u0443\u0443\u0441\u0430\u0445 \u0445\u0443\u0433\u0430\u0446\u0430\u0430</label>
                  <input id="cardExp" type="text" placeholder="MM/YY">
                </div>
                <div class="form-group">
                  <label for="cardCvv">CVV</label>
                  <input id="cardCvv" type="password" inputmode="numeric" placeholder="***">
                </div>
              </div>
            </div>
            <div class="payment-details payment-details--qpay" hidden>
              <div class="qpay-box">
                <div class="qpay-qr">QR</div>
                <div>
                  <strong>QPay \u0442\u04E9\u043B\u0431\u04E9\u0440</strong>
                  <p>QR \u043A\u043E\u0434 \u0443\u043D\u0448\u0443\u0443\u043B\u0436 \u0442\u04E9\u043B\u043D\u04E9 \u04AF\u04AF.</p>
                </div>
              </div>
            </div>
            <div class="payment-actions">
              <button class="pay-btn" type="button">\u0422\u04E9\u043B\u0431\u04E9\u0440 \u0442\u04E9\u043B\u04E9\u0445</button>
              <p class="pay-status" hidden>\u0422\u04E9\u043B\u0431\u04E9\u0440 \u0442\u04E9\u043B\u04E9\u0433\u0434\u0441\u04E9\u043D.</p>
            </div>
          </div>
        </div>
      </div>
  <div class="scene">
    <div class="delivery-man">
      <div class="head"></div>
      <div class="body"></div>

      <div class="arm left"></div>
      <div class="arm right"></div>

      <div class="leg left"></div>
      <div class="leg right"></div>

      <div class="box">\u{1F4E6}</div>
    </div>
  </div>
    `;
          const form = this.querySelector("form");
          const closeBtn = this.querySelector(".close");
          const roleInput = this.querySelector("input[name='role']");
          const modeTabs = this.querySelectorAll(".auth-tabs .tab-btn");
          const roleTabs = this.querySelectorAll(".login-tabs .tab-btn");
          const loginTabs = this.querySelector(".login-tabs");
          const titleEl = this.querySelector("#login-title");
          const submitBtn = this.querySelector(".continue-btn");
          const subtitleEl = this.querySelector(".subtitle");
          const nameInput = this.querySelector("#name");
          const phoneInput = this.querySelector("#phone");
          const studentInput = this.querySelector("#studentId");
          const registerOnlyBlocks = this.querySelectorAll(".register-only");
          const paymentSection = this.querySelector(".payment-section");
          const paymentMethods = this.querySelectorAll('input[name="paymentMethod"]');
          const payBtn = this.querySelector(".pay-btn");
          const payStatus = this.querySelector(".pay-status");
          const isPaid = () => localStorage.getItem("courierPaid") === "1";
          if (closeBtn) {
            closeBtn.addEventListener("click", () => {
              location.hash = "#home";
            });
          }
          modeTabs.forEach((btn) => {
            btn.addEventListener("click", () => {
              const mode = btn.getAttribute("data-mode") || "login";
              this.currentMode = mode;
              modeTabs.forEach((b) => {
                const isActive = b === btn;
                b.classList.toggle("is-active", isActive);
                b.setAttribute("aria-selected", isActive ? "true" : "false");
              });
              const isRegister = mode === "register";
              registerOnlyBlocks.forEach((el) => {
                el.style.display = isRegister ? "" : "none";
              });
              if (isRegister && roleInput) {
                roleInput.value = this.currentRole;
              }
              this.classList.remove("show-payment");
              if (paymentSection) paymentSection.hidden = true;
              if (payStatus) payStatus.hidden = true;
              if (payBtn) payBtn.disabled = false;
              if (nameInput) nameInput.required = isRegister;
              if (studentInput) studentInput.required = false;
              if (phoneInput) phoneInput.required = true;
              if (titleEl) titleEl.textContent = isRegister ? "\u0411\u04AF\u0440\u0442\u0433\u04AF\u04AF\u043B\u044D\u0445" : "\u041D\u044D\u0432\u0442\u0440\u044D\u0445";
              if (submitBtn) {
                submitBtn.textContent = isRegister ? this.currentRole === "courier" ? "\u0425\u04AF\u0440\u0433\u044D\u0433\u0447\u044D\u044D\u0440 \u0431\u04AF\u0440\u0442\u0433\u04AF\u04AF\u043B\u044D\u0445" : "\u0425\u044D\u0440\u044D\u0433\u043B\u044D\u0433\u0447\u044D\u044D\u0440 \u0431\u04AF\u0440\u0442\u0433\u04AF\u04AF\u043B\u044D\u0445" : "\u041D\u044D\u0432\u0442\u0440\u044D\u0445";
              }
              if (subtitleEl) {
                subtitleEl.textContent = isRegister ? "\u041D\u044D\u0440 \u0431\u043E\u043B\u043E\u043D \u043D\u0443\u0443\u0446 \u04AF\u0433\u044D\u044D \u0430\u0448\u0438\u0433\u043B\u0430\u043D \u043D\u044D\u0432\u0442\u044D\u0440\u043D\u044D." : "\u0423\u0442\u0430\u0441\u043D\u044B \u0434\u0443\u0433\u0430\u0430\u0440, \u043D\u0443\u0443\u0446 \u04AF\u0433\u044D\u044D \u043E\u0440\u0443\u0443\u043B\u043D\u0430 \u0443\u0443.";
              }
            });
          });
          roleTabs.forEach((btn) => {
            btn.addEventListener("click", () => {
              const role = btn.getAttribute("data-role") || "customer";
              this.currentRole = role;
              if (loginTabs) loginTabs.dataset.activeRole = role;
              roleTabs.forEach((b) => {
                const isActive = b === btn;
                b.classList.toggle("is-active", isActive);
                b.setAttribute("aria-selected", isActive ? "true" : "false");
              });
              if (roleInput) roleInput.value = role;
              if (titleEl) titleEl.textContent = "\u0411\u04AF\u0440\u0442\u0433\u04AF\u04AF\u043B\u044D\u0445";
              if (submitBtn) {
                submitBtn.textContent = role === "courier" ? "\u0425\u04AF\u0440\u0433\u044D\u0433\u0447\u044D\u044D\u0440 \u0431\u04AF\u0440\u0442\u0433\u04AF\u04AF\u043B\u044D\u0445" : "\u0425\u044D\u0440\u044D\u0433\u043B\u044D\u0433\u0447\u044D\u044D\u0440 \u0431\u04AF\u0440\u0442\u0433\u04AF\u04AF\u043B\u044D\u0445";
              }
              this.classList.remove("show-payment");
              if (paymentSection) paymentSection.hidden = true;
              if (payStatus) payStatus.hidden = true;
              if (payBtn) payBtn.disabled = false;
            });
          });
          const prefillMode = localStorage.getItem("login_prefill_mode");
          const prefillRole = localStorage.getItem("login_prefill_role");
          if (prefillMode) {
            this.currentMode = prefillMode === "register" ? "register" : "login";
            localStorage.removeItem("login_prefill_mode");
          }
          if (prefillRole) {
            this.currentRole = prefillRole === "courier" ? "courier" : "customer";
            localStorage.removeItem("login_prefill_role");
          }
          if (registerOnlyBlocks.length) {
            registerOnlyBlocks.forEach((el) => {
              el.style.display = this.currentMode === "register" ? "" : "none";
            });
          }
          if (loginTabs) loginTabs.dataset.activeRole = this.currentRole;
          if (roleInput) roleInput.value = this.currentRole;
          if (titleEl) titleEl.textContent = this.currentMode === "register" ? "\u0411\u04AF\u0440\u0442\u0433\u04AF\u04AF\u043B\u044D\u0445" : "\u041D\u044D\u0432\u0442\u0440\u044D\u0445";
          if (submitBtn) {
            submitBtn.textContent = this.currentMode === "register" ? this.currentRole === "courier" ? "\u0425\u04AF\u0440\u0433\u044D\u0433\u0447\u044D\u044D\u0440 \u0431\u04AF\u0440\u0442\u0433\u04AF\u04AF\u043B\u044D\u0445" : "\u0425\u044D\u0440\u044D\u0433\u043B\u044D\u0433\u0447\u044D\u044D\u0440 \u0431\u04AF\u0440\u0442\u0433\u04AF\u04AF\u043B\u044D\u0445" : "\u041D\u044D\u0432\u0442\u0440\u044D\u0445";
          }
          if (subtitleEl) {
            subtitleEl.textContent = this.currentMode === "register" ? "\u041D\u044D\u0440 \u0431\u043E\u043B\u043E\u043D \u043D\u0443\u0443\u0446 \u04AF\u0433\u044D\u044D \u0430\u0448\u0438\u0433\u043B\u0430\u043D \u043D\u044D\u0432\u0442\u044D\u0440\u043D\u044D." : "\u0423\u0442\u0430\u0441\u043D\u044B \u0434\u0443\u0433\u0430\u0430\u0440, \u043D\u0443\u0443\u0446 \u04AF\u0433\u044D\u044D \u043E\u0440\u0443\u0443\u043B\u043D\u0430 \u0443\u0443.";
          }
          if (nameInput) nameInput.required = this.currentMode === "register";
          if (payBtn) {
            payBtn.addEventListener("click", () => {
              localStorage.setItem("courierPaid", "1");
              payBtn.disabled = true;
              if (payStatus) payStatus.hidden = false;
            });
          }
          if (paymentMethods.length && paymentSection) {
            paymentMethods.forEach((input) => {
              input.addEventListener("change", () => {
                const method = this.querySelector('input[name="paymentMethod"]:checked')?.value || "card";
                const card = this.querySelector(".payment-details--card");
                const qpay = this.querySelector(".payment-details--qpay");
                if (card) card.hidden = method !== "card";
                if (qpay) qpay.hidden = method !== "qpay";
              });
            });
          }
          if (form) {
            form.addEventListener("submit", async (e) => {
              e.preventDefault();
              const password = this.querySelector("#password")?.value?.trim() || "";
              const isRegister = this.currentMode === "register";
              const isCourier = isRegister && (roleInput?.value || "customer") === "courier";
              const name = this.querySelector("#name")?.value?.trim() || "";
              const phone = this.querySelector("#phone")?.value?.trim() || "";
              const studentId = this.querySelector("#studentId")?.value?.trim() || "";
              const roleValue = roleInput?.value || this.currentRole || "customer";
              const role = isRegister && roleValue === "courier" ? "courier" : "customer";
              const fullName = name.trim() || "\u0417\u043E\u0447\u0438\u043D \u0445\u044D\u0440\u044D\u0433\u043B\u044D\u0433\u0447";
              try {
                const res = await fetch(`${API3}/api/auth/login`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                  body: JSON.stringify({
                    name: fullName,
                    phone,
                    studentId,
                    role,
                    password,
                    mode: this.currentMode
                  })
                });
                if (!res.ok) {
                  const err = await res.json().catch(() => ({}));
                  throw new Error(err.error || "\u041D\u044D\u0432\u0442\u0440\u044D\u0445 \u04AF\u0435\u0434 \u0430\u043B\u0434\u0430\u0430 \u0433\u0430\u0440\u043B\u0430\u0430");
                }
                const data = await res.json();
                const serverRole = (data?.user?.role || data?.role || roleValue || role || "customer") === "courier" ? "courier" : "customer";
                const serverPhone = String(data?.user?.phone || phone || "").trim();
                const serverStudentId = String(data?.user?.student_id || data?.user?.studentId || studentId || "").trim();
                const userKey = (serverStudentId || serverPhone).trim();
                localStorage.setItem("authLoggedIn", "1");
                localStorage.setItem("authRole", serverRole);
                localStorage.setItem("authPhone", serverPhone);
                localStorage.setItem("authStudentId", serverStudentId);
                localStorage.setItem("authUserKey", userKey);
                if (serverRole === "courier" && userKey) {
                  const paidKey = `courierPaid:${userKey}`;
                  const paid = localStorage.getItem(paidKey) === "1" ? "1" : "0";
                  localStorage.setItem("courierPaid", paid);
                } else {
                  localStorage.setItem("courierPaid", "0");
                }
                if (role === "courier") {
                  if (localStorage.getItem("courierPaid") !== "1") {
                    localStorage.setItem("courierPaid", "0");
                  }
                } else {
                  localStorage.setItem("courierPaid", "0");
                }
                window.dispatchEvent(new Event("user-updated"));
                const hasDraft = localStorage.getItem("pendingOrderDraft");
                location.hash = hasDraft ? "#home" : "#profile";
                return;
              } catch (err) {
                const msg = String(err?.message || "");
                if (msg.includes("users_phone_key")) {
                  alert("\u042D\u043D\u044D \u0443\u0442\u0430\u0441 \u0431\u04AF\u0440\u0442\u0433\u044D\u043B\u0442\u044D\u0439 \u0431\u0430\u0439\u043D\u0430. \u041D\u044D\u0432\u0442\u0440\u044D\u0445 \u0433\u043E\u0440\u0438\u043C\u043E\u043E\u0440 \u043E\u0440\u043D\u043E \u0443\u0443.");
                  const loginTab = this.querySelector('.auth-tabs .tab-btn[data-mode="login"]');
                  if (loginTab) loginTab.click();
                  return;
                }
                alert(msg || "\u041D\u044D\u0432\u0442\u0440\u044D\u0445 \u04AF\u0435\u0434 \u0430\u043B\u0434\u0430\u0430 \u0433\u0430\u0440\u043B\u0430\u0430");
              }
            });
          }
        }
        normalizeName(value) {
          const raw = String(value || "").trim();
          if (!raw) return "\u0417\u043E\u0447\u0438\u043D \u0445\u044D\u0440\u044D\u0433\u043B\u044D\u0433\u0447";
          const tokens = raw.split(/\s+/).filter((t) => t && t.length > 1);
          return tokens.length ? tokens.join(" ") : raw;
        }
      };
      customElements.define("login-page", LoginPage);
    }
  });

  // front-end/assets/js/api.js
  var originalFetch = window.fetch.bind(window);
  window.fetch = (input, init = {}) => {
    if (!init.headers) init.headers = {};
    const headers = new Headers(init.headers);
    return originalFetch(input, { credentials: "include", ...init, headers });
  };

  // front-end/assets/components/site-header.js
  var SiteHeader = class extends HTMLElement {
    connectedCallback() {
      this.render = this.render.bind(this);
      this.updateActive = this.updateActive.bind(this);
      this.handleDocClick = this.handleDocClick.bind(this);
      this.handleUserUpdated = this.handleUserUpdated.bind(this);
      this.handleAppStateChanged = this.handleAppStateChanged.bind(this);
      this.loadUser = this.loadUser.bind(this);
      this.render();
      window.addEventListener("hashchange", this.updateActive);
      window.addEventListener("user-updated", this.handleUserUpdated);
      window.addEventListener("app-state-changed", this.handleAppStateChanged);
      this.loadUser();
      this.updateActive();
    }
    disconnectedCallback() {
      window.removeEventListener("hashchange", this.updateActive);
      window.removeEventListener("user-updated", this.handleUserUpdated);
      window.removeEventListener("app-state-changed", this.handleAppStateChanged);
      document.removeEventListener("click", this.handleDocClick);
    }
    getAppState() {
      const state = localStorage.getItem("appState");
      if (state === "customer" || state === "courier") return state;
      const role = localStorage.getItem("authRole");
      if (role === "customer" || role === "courier") return role;
      return "guest";
    }
    getNavLinks() {
      const state = this.getAppState();
      const links = [];
      if (state === "customer") {
        links.push({ href: "#home", label: "\u041D\u04AF\u04AF\u0440", icon: "home" });
        links.push({ href: "#orders", label: "\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430", icon: "orders" });
      }
      if (state === "courier") {
        links.push({ href: "#home", label: "\u041D\u04AF\u04AF\u0440", icon: "home" });
        links.push({ href: "#delivery", label: "\u0425\u04AF\u0440\u0433\u044D\u043B\u0442", icon: "delivery" });
      }
      if (state !== "guest") {
        links.push({ href: "#profile", label: "\u041F\u0440\u043E\u0444\u0430\u0439\u043B", icon: "profile" });
      }
      return links;
    }
    renderNavLinks() {
      const links = this.getNavLinks();
      return links.map((link) => `
      <a href="${link.href}">
        ${this.getIcon(link.icon)}
        <span>${link.label}</span>
      </a>
    `).join("");
    }
    getIcon(name) {
      switch (name) {
        case "orders":
          return `
          <svg width="27" height="28" viewBox="0 0 27 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.4" d="M8.26012 21.9703C9.1827 21.9703 9.93865 22.7536 9.93883 23.7213C9.93883 24.6776 9.18281 25.4615 8.26012 25.4615C7.32644 25.4613 6.57066 24.6775 6.57066 23.7213C6.57084 22.7537 7.32655 21.9704 8.26012 21.9703ZM20.767 21.9703C21.6894 21.9704 22.4455 22.7536 22.4457 23.7213C22.4457 24.6775 21.6896 25.4614 20.767 25.4615C19.8331 25.4615 19.0765 24.6776 19.0765 23.7213C19.0767 22.7536 19.8333 21.9703 20.767 21.9703Z" fill="#B8BABF"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M22.4456 7.31518C23.1237 7.31518 23.5684 7.55713 24.0131 8.08714C24.4577 8.61714 24.5356 9.37757 24.4355 10.0677L23.3794 17.626C23.1793 19.0789 21.9787 20.1493 20.5669 20.1493H8.4385C6.95997 20.1493 5.73713 18.9741 5.61485 17.4543L4.5921 4.89445L2.91348 4.59489C2.46881 4.51423 2.15754 4.06488 2.23535 3.60401C2.31317 3.13162 2.74672 2.82053 3.20251 2.88966L5.85386 3.30445C6.23182 3.37473 6.50974 3.69619 6.54309 4.08793L6.75431 6.66881C6.78766 7.03865 7.0767 7.31518 7.43243 7.31518H22.4456ZM15.7089 13.3053H18.7882C19.2551 13.3053 19.622 12.9136 19.622 12.4412C19.622 11.9573 19.2551 11.5771 18.7882 11.5771H15.7089C15.242 11.5771 14.8751 11.9573 14.8751 12.4412C14.8751 12.9136 15.242 13.3053 15.7089 13.3053Z" fill="#B8BABF"/>
          </svg>
        `;
        case "delivery":
          return `
          <svg width="32" height="28" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.4385 0C23.7214 0 23.9933 0.132431 24.1934 0.368164C24.3933 0.603844 24.5058 0.923595 24.5059 1.25684V3.77051H27.7051C27.9137 3.77053 28.1178 3.84327 28.292 3.97852C28.4662 4.11392 28.6033 4.30714 28.6855 4.5332L31.8857 13.332C31.9426 13.4884 31.9716 13.657 31.9717 13.8271V22.626C31.9717 22.9594 31.8592 23.2789 31.6592 23.5146C31.4592 23.7503 31.1881 23.8828 30.9053 23.8828H28.6201C28.3881 24.9616 27.8576 25.9191 27.1123 26.6025C26.3672 27.2857 25.4499 27.6561 24.5059 27.6562C23.5616 27.6562 22.6437 27.2859 21.8984 26.6025C21.1531 25.9191 20.6227 24.9616 20.3906 23.8828H13.6875C13.4279 25.0676 12.8105 26.1003 11.9512 26.7871C11.0917 27.4739 10.0487 27.7685 9.01855 27.6143C7.98863 27.46 7.04187 26.8681 6.35547 25.9502C5.66899 25.0319 5.29004 23.8498 5.29004 22.626C5.29004 21.4022 5.66899 20.22 6.35547 19.3018C7.04187 18.3838 7.98864 17.7919 9.01855 17.6377C10.0487 17.4835 11.0917 17.778 11.9512 18.4648C12.8105 19.1517 13.4279 20.1843 13.6875 21.3691H20.3906C20.533 20.7285 20.781 20.1268 21.1211 19.5996C21.4612 19.0725 21.8864 18.6299 22.3721 18.2969V2.51367H6.37207V0H23.4385Z" fill="#C4C4C4"/>
          </svg>
        `;
        case "profile":
          return `
          <svg width="27" height="28" viewBox="0 0 27 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.3403 17.4831C18.1633 17.4831 22.2338 18.2955 22.2338 21.4294C22.2338 24.5644 18.1366 25.3483 13.3403 25.3483C8.51842 25.3483 4.44703 24.5357 4.44672 21.402C4.44672 18.2669 8.54382 17.4831 13.3403 17.4831ZM13.3403 2.30438C16.6075 2.30447 19.225 5.01714 19.225 8.40106C19.2248 11.7848 16.6074 14.4977 13.3403 14.4977C10.0742 14.4977 7.45476 11.7848 7.45453 8.40106C7.45453 5.01708 10.0741 2.30438 13.3403 2.30438Z" fill="#B8BABF"/>
          </svg>
        `;
        case "home":
        default:
          return `
          <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M26.0821 10.6965L14.9138 0.573094C14.9084 0.568518 14.9032 0.563588 14.8985 0.55834C14.4873 0.199078 13.9515 0 13.3956 0C12.8398 0 12.304 0.199078 11.8928 0.55834L11.8775 0.573094L0.72175 10.6965C0.494193 10.8975 0.31255 11.1417 0.188313 11.4137C0.0640769 11.6856 -4.69666e-05 11.9794 2.58096e-08 12.2764V24.6758C2.58096e-08 25.2449 0.235331 25.7907 0.654222 26.1932C1.07311 26.5956 1.64125 26.8217 2.23366 26.8217H8.93462C9.52702 26.8217 10.0952 26.5956 10.5141 26.1932C10.9329 25.7907 11.1683 25.2449 11.1683 24.6758V18.238H15.6356V24.6758C15.6356 25.2449 15.8709 25.7907 16.2898 26.1932C16.7087 26.5956 17.2768 26.8217 17.8692 26.8217H24.5702C25.1626 26.8217 25.7307 26.5956 26.1496 26.1932C26.5685 25.7907 26.8039 25.2449 26.8039 24.6758V12.2764C26.8039 11.9794 26.7398 11.6856 26.6156 11.4137C26.4913 11.1417 26.3097 10.8975 26.0821 10.6965ZM24.5702 24.6758H17.8692V18.238C17.8692 17.6689 17.6339 17.1231 17.215 16.7206C16.7961 16.3182 16.228 16.0921 15.6356 16.0921H11.1683C10.5759 16.0921 10.0077 16.3182 9.58884 16.7206C9.16995 17.1231 8.93462 17.6689 8.93462 18.238V24.6758H2.23366V12.2764L2.24901 12.263L13.4019 2.14364L24.5562 12.2603L24.5716 12.2737L24.5702 24.6758Z" fill="#A6A6A6"/>
          </svg>
        `;
      }
    }
    render() {
      const isAuthed = Boolean(this.currentUser);
      document.removeEventListener("click", this.handleDocClick);
      const logoPng = "assets/img/logo_light_last.png";
      const logoWebp = "assets/img/logo_light_last.webp";
      this.innerHTML = `
      <header class="site-top">
        <div class="brand">
          <picture>
            <source srcset="${logoWebp}" type="image/webp" />
            <img src="${logoPng}" alt="Logo" class="brand-logo" width="250" height="74" decoding="async" />
          </picture>
        </div>

        <nav class="top-menu">
          ${this.renderNavLinks()}
        </nav>

        <div class="header-actions">
          ${isAuthed ? `
                <div class="avatar-menu">
                  <button class="avatar-btn" type="button" aria-label="\u041F\u0440\u043E\u0444\u0430\u0439\u043B \u0446\u044D\u0441 \u043D\u044D\u044D\u0445"></button>
                  <div class="avatar-dropdown" role="menu" aria-label="\u041F\u0440\u043E\u0444\u0430\u0439\u043B \u0446\u044D\u0441">
                    <button class="avatar-action avatar-logout" type="button" role="menuitem">\u0413\u0430\u0440\u0430\u0445</button>
                  </div>
                </div>
                <button class="logout-btn" type="button">\u0413\u0430\u0440\u0430\u0445</button>
              ` : `<button class="login-btn" type="button">\u041D\u044D\u0432\u0442\u0440\u044D\u0445</button>`}
        </div>
      </header>
    `;
      const loginBtn = this.querySelector(".login-btn");
      if (loginBtn) {
        loginBtn.addEventListener("click", () => {
          location.hash = "#login";
        });
      }
      if (window.matchMedia) {
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const logo = this.querySelector(".brand-logo");
        if (logo) {
          const updateLogo = () => {
            logo.src = logoPng;
          };
          updateLogo(media);
          if (media.addEventListener) {
            media.addEventListener("change", updateLogo);
          } else {
            media.addListener(updateLogo);
          }
        }
      }
      const avatarBtn = this.querySelector(".avatar-btn");
      if (avatarBtn) {
        avatarBtn.innerHTML = `<img src="assets/img/profile.jpg" alt="\u041F\u0440\u043E\u0444\u0430\u0439\u043B" width="40" height="40" decoding="async">`;
        avatarBtn.addEventListener("click", () => {
          location.hash = "#profile";
        });
      }
      const profileAction = this.querySelector(".avatar-action");
      if (profileAction) {
        profileAction.addEventListener("click", () => {
          location.hash = "#profile";
        });
      }
      const logoutHandlers = this.querySelectorAll(".avatar-logout, .logout-btn");
      logoutHandlers.forEach((logoutBtn) => {
        logoutBtn.addEventListener("click", async () => {
          try {
            await fetch("/api/auth/logout", { method: "POST" });
          } catch (e) {
          }
          localStorage.removeItem("auth_token");
          localStorage.removeItem("authLoggedIn");
          localStorage.removeItem("authRole");
          localStorage.removeItem("authPhone");
          localStorage.removeItem("authStudentId");
          localStorage.removeItem("courierPaid");
          localStorage.removeItem("courier_payment_paid");
          localStorage.removeItem("appState");
          localStorage.removeItem("deliveryActive");
          localStorage.setItem("courierPaid", "0");
          this.currentUser = null;
          window.dispatchEvent(new Event("user-updated"));
          location.hash = "#home";
        });
      });
    }
    handleDocClick(e) {
      if (!this.contains(e.target)) {
        this.classList.remove("profile-open");
      }
    }
    handleUserUpdated() {
      this.loadUser();
    }
    handleAppStateChanged() {
      this.render();
      this.updateActive();
    }
    async loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          this.currentUser = null;
        } else {
          const data = await res.json();
          this.currentUser = data?.user || null;
        }
      } catch (e) {
        this.currentUser = null;
      }
      this.render();
      this.updateActive();
    }
    updateActive() {
      if (!location.hash) {
        history.replaceState(null, "", "#home");
      }
      const current = location.hash || "#home";
      const allowed = new Set(this.getNavLinks().map((link) => link.href));
      allowed.add("#pay");
      allowed.add("#login");
      if (!allowed.length) return;
      if (!allowed.has(current)) {
        location.hash = "#home";
        return;
      }
      this.querySelectorAll(".top-menu a").forEach((a) => {
        const href = a.getAttribute("href");
        a.classList.toggle("is-active", href === current);
      });
    }
  };
  customElements.define("site-header", SiteHeader);

  // front-end/assets/components/num-router.js
  var NumRouter = class extends HTMLElement {
    connectedCallback() {
      this._views = Array.from(this.querySelectorAll("[data-route]"));
      this._current = null;
      this._loadedRoutes = /* @__PURE__ */ new Set();
      window.addEventListener("hashchange", () => this.applyRoute());
      this.applyRoute();
    }
    async applyRoute() {
      const hash = (location.hash || "#home").replace("#", "") || "home";
      const role = localStorage.getItem("authRole");
      const paid = localStorage.getItem("courierPaid");
      const loggedIn = localStorage.getItem("authLoggedIn");
      const appState = localStorage.getItem("appState") || "guest";
      if (appState === "courier" && hash === "orders") {
        alert("\u0425\u04AF\u0440\u0433\u044D\u043B\u0442 \u0445\u0438\u0439\u0436 \u0431\u0430\u0439\u0445 \u04AF\u0435\u0434 \u0437\u0430\u0445\u0438\u0430\u043B\u0433\u044B\u043D \u0445\u044D\u0441\u044D\u0433\u0442 \u043E\u0440\u043E\u0445 \u0431\u043E\u043B\u043E\u043C\u0436\u0433\u04AF\u0439");
        location.hash = "#home";
        return;
      }
      if (appState === "customer" && hash === "delivery") {
        alert("\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u04E9\u0433\u0441\u04E9\u043D \u04AF\u0435\u0434 \u0445\u04AF\u0440\u0433\u044D\u043B\u0442\u0438\u0439\u043D \u0445\u044D\u0441\u044D\u0433\u0442 \u043E\u0440\u043E\u0445 \u0431\u043E\u043B\u043E\u043C\u0436\u0433\u04AF\u0439");
        location.hash = "#home";
        return;
      }
      if (hash === "delivery") {
        if (loggedIn !== "1") {
          alert("\u042D\u043D\u044D \u0445\u044D\u0441\u044D\u0433 \u0437\u04E9\u0432\u0445\u04E9\u043D \u0445\u04AF\u0440\u0433\u044D\u0433\u0447\u0438\u0434 \u043D\u044D\u044D\u043B\u0442\u0442\u044D\u0439");
          location.hash = "#login";
          return;
        }
        if (role !== "courier") {
          alert("\u042D\u043D\u044D \u0445\u044D\u0441\u044D\u0433 \u0437\u04E9\u0432\u0445\u04E9\u043D \u0445\u04AF\u0440\u0433\u044D\u0433\u0447\u0438\u0434 \u043D\u044D\u044D\u043B\u0442\u0442\u044D\u0439");
          location.hash = "#home";
          return;
        }
        if (paid !== "1") {
          alert("\u0422\u04E9\u043B\u0431\u04E9\u0440 \u0442\u04E9\u043B\u0441\u043D\u0438\u0439 \u0434\u0430\u0440\u0430\u0430 \u0445\u04AF\u0440\u0433\u044D\u043B\u0442\u0438\u0439\u043D \u0445\u044D\u0441\u044D\u0433 \u043D\u044D\u044D\u0433\u0434\u044D\u043D\u044D");
          location.hash = "#pay";
          return;
        }
      }
      await this.loadRoute(hash);
      const next = this._views.find((section) => section.dataset.route === hash);
      if (!next) {
        return;
      }
      if (!this._current) {
        this._views.forEach((section) => {
          const isActive = section === next;
          section.hidden = !isActive;
          section.classList.toggle("is-active", isActive);
          section.classList.remove("is-leaving");
        });
        this._current = next;
        return;
      }
      if (this._current === next) {
        return;
      }
      const prev = this._current;
      this._current = next;
      prev.hidden = true;
      prev.classList.remove("is-active");
      next.hidden = false;
      next.classList.add("is-active");
    }
    async loadRoute(route) {
      if (this._loadedRoutes.has(route)) return;
      const loaders = {
        home: () => Promise.all([
          Promise.resolve().then(() => (init_home_page(), home_page_exports)),
          Promise.resolve().then(() => (init_date_time_picker(), date_time_picker_exports)),
          Promise.resolve().then(() => (init_sh_cart(), sh_cart_exports)),
          Promise.resolve().then(() => (init_offer_list(), offer_list_exports)),
          Promise.resolve().then(() => (init_delivery_cart(), delivery_cart_exports)),
          Promise.resolve().then(() => (init_offer_modal(), offer_modal_exports)),
          Promise.resolve().then(() => (init_confirm_modal(), confirm_modal_exports)),
          Promise.resolve().then(() => (init_order_confirm(), order_confirm_exports))
        ]),
        delivery: () => Promise.all([
          Promise.resolve().then(() => (init_delivery_page(), delivery_page_exports)),
          Promise.resolve().then(() => (init_d_orders(), d_orders_exports)),
          Promise.resolve().then(() => (init_del_order_details(), del_order_details_exports)),
          Promise.resolve().then(() => (init_del_order_progress(), del_order_progress_exports)),
          Promise.resolve().then(() => (init_person_detail(), person_detail_exports))
        ]),
        orders: () => Promise.all([
          Promise.resolve().then(() => (init_orders_page(), orders_page_exports)),
          Promise.resolve().then(() => (init_courier_card(), courier_card_exports)),
          Promise.resolve().then(() => (init_rating(), rating_exports))
        ]),
        profile: () => Promise.resolve().then(() => (init_profile_page(), profile_page_exports)),
        pay: () => Promise.resolve().then(() => (init_pay_page(), pay_page_exports)),
        login: () => Promise.resolve().then(() => (init_login_page(), login_page_exports))
      };
      const loader = loaders[route];
      if (!loader) return;
      try {
        await loader();
        this._loadedRoutes.add(route);
      } catch (e) {
        console.error("Route load failed:", route, e);
      }
    }
  };
  customElements.define("num-router", NumRouter);

  // front-end/assets/components/state-ui.js
  function getState() {
    return localStorage.getItem("appState") || "guest";
  }
  function applyStateUI(root = document) {
    const state = getState();
    const role = localStorage.getItem("authRole") || "";
    const deliveryActive = localStorage.getItem("deliveryActive") === "1";
    root.querySelectorAll('[data-role="order-action"]').forEach((el) => {
      const blocked = state === "courier" && deliveryActive;
      if ("disabled" in el) el.disabled = blocked;
      el.style.pointerEvents = blocked ? "none" : "";
      el.style.opacity = blocked ? "0.5" : "";
      el.title = blocked ? "\u0425\u04AF\u0440\u0433\u044D\u043B\u0442 \u0445\u0438\u0439\u0436 \u0431\u0430\u0439\u0445 \u04AF\u0435\u0434 \u0437\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u04E9\u0433\u04E9\u0445 \u0431\u043E\u043B\u043E\u043C\u0436\u0433\u04AF\u0439" : "";
    });
    root.querySelectorAll('[data-role="courier-action"]').forEach((el) => {
      const blocked = role !== "courier";
      if ("disabled" in el) el.disabled = blocked;
      el.style.pointerEvents = blocked ? "none" : "";
      el.style.opacity = blocked ? "0.5" : "";
      el.title = blocked ? "\u0425\u04AF\u0440\u0433\u044D\u0433\u0447\u044D\u044D\u0440 \u043D\u044D\u0432\u0442\u044D\u0440\u0441\u043D\u0438\u0439 \u0434\u0430\u0440\u0430\u0430 \u0445\u04AF\u0440\u0433\u044D\u043B\u0442 \u0430\u0432\u0430\u0445 \u0431\u043E\u043B\u043E\u043C\u0436\u0442\u043E\u0439" : "";
    });
    root.querySelectorAll("[data-show-in]").forEach((el) => {
      const allowed = String(el.getAttribute("data-show-in") || "").split(",").map((s) => s.trim()).filter(Boolean);
      el.style.display = allowed.includes(state) ? "" : "none";
    });
    root.querySelectorAll("[data-appstate-label]").forEach((el) => {
      el.textContent = state.toUpperCase();
    });
    return state;
  }
  window.addEventListener("app-state-changed", () => applyStateUI(document));
  window.addEventListener("DOMContentLoaded", () => applyStateUI(document));

  // front-end/assets/components/app-state.js
  var KEY = "appState";
  var VALID = /* @__PURE__ */ new Set(["guest", "customer", "courier"]);
  function getState2() {
    const v = localStorage.getItem(KEY);
    return VALID.has(v) ? v : "guest";
  }
  function setState(state, reason = "") {
    const next = VALID.has(state) ? state : "guest";
    const prev = getState2();
    localStorage.setItem(KEY, next);
    if (prev !== next) {
      window.dispatchEvent(
        new CustomEvent("app-state-changed", { detail: { prev, next, reason } })
      );
    }
    return next;
  }
  async function resetToGuest(reason = "") {
    setState("guest", reason);
    localStorage.setItem("deliveryActive", "0");
    try {
      await fetch("/api/active-order", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ order: null })
      });
    } catch {
    }
    localStorage.removeItem("deliverySteps");
    try {
      await fetch("/api/delivery-cart", {
        method: "DELETE",
        credentials: "include"
      });
    } catch {
    }
    localStorage.removeItem("orderStep");
    window.dispatchEvent(new Event("order-updated"));
    window.dispatchEvent(new Event("delivery-cart-updated"));
  }
  window.NumAppState = { getState: getState2, setState, resetToGuest };
})();
//# sourceMappingURL=app.js.map
