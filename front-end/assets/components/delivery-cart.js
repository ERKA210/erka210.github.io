class DeliveryCart extends HTMLElement {
  connectedCallback() {
    this.scheduleIdle = this.scheduleIdle?.bind(this) || ((work) => {
      if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(() => work(), { timeout: 1200 });
      } else {
        setTimeout(work, 300);
      }
    });
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleViewportChange = this.handleViewportChange.bind(this);
    this._loaded = false;
    this.handleRouteChange = this.handleRouteChange?.bind(this) || (() => this.onRouteChange());
    this.render();
    this.cacheEls();
    this.addEventListener("click", this.handleClick);
    window.addEventListener("delivery-cart-updated", this.handleUpdate);
    window.addEventListener("hashchange", this.handleRouteChange);
    this.mediaQuery = window.matchMedia("(max-width: 900px)");
    this.mediaQuery.addEventListener("change", this.handleViewportChange);
    this.handleViewportChange();
    this.handleRouteChange();
  }

  disconnectedCallback() {
    window.removeEventListener("delivery-cart-updated", this.handleUpdate);
    window.removeEventListener("hashchange", this.handleRouteChange);
    this.removeEventListener("click", this.handleClick);
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener("change", this.handleViewportChange);
    }
  }

  onRouteChange() {
    if ((location.hash || "#home") !== "#home") return;
    if (this._loaded) return;
    this._loaded = true;
    this.scheduleIdle(() => this.load());
  }

  render() {
    this.innerHTML = `
      <div class="delivery-cart">
        <div class="delivery-cart__header">
          <h3>Хүргэлтийн сагс</h3>
          <span class="delivery-cart__count">0</span>
        </div>
        <div class="delivery-cart__list"></div>
        <p class="delivery-cart__empty">Одоогоор хүргэлт сонгоогүй байна.</p>
        <button class="delivery-cart__go" type="button">Хүргэлт рүү</button>
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
      const layout = this.closest(".offers-layout");
      if (layout) layout.classList.remove("has-cart");
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
      const subText = sub.length
        ? sub.map((s) => s.name).filter(Boolean).join(", ")
        : "Бараа алга";

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
          <button class="delivery-cart__remove" type="button" data-action="remove">−</button>
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
        method: "PATCH",
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
    return Number(n || 0).toLocaleString("mn-MN") + "₮";
  }

  escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  escapeAttr(s) {
    return String(s || "").replace(/"/g, "&quot;");
  }
}

customElements.define("delivery-cart", DeliveryCart);
