import { formatPrice, parsePrice } from "../helper/format-d-ts-p.js";
import { escapeAttr } from "../helper/escape-attr.js";
import { escapeHtml } from "../helper/escape-html.js";
import { apiFetch } from "../api_client.js";

class DeliveryCart extends HTMLElement {
  connectedCallback() {
    this.render();
    this.elements();

    this.onClick = (e) => this.handleClick(e);
    this.onUpdated = () => this.load();
    this.onHashChange = () => this.load();
    this.onMediaChange = () => this.onViewportChange();

    this.addEventListener("click", this.onClick);
    window.addEventListener("delivery-cart-updated", this.onUpdated);
    window.addEventListener("hashchange", this.onHashChange);

    this.media = window.matchMedia("(max-width: 54rem)");
    this.media.addEventListener("change", this.onMediaChange);

    this.onViewportChange();
    this.load();
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.onClick);
    window.removeEventListener("delivery-cart-updated", this.onUpdated);
    window.removeEventListener("hashchange", this.onHashChange);
    if (this.media) this.media.removeEventListener("change", this.onMediaChange);
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

  elements() {
    this.listEl = this.querySelector(".delivery-cart__list");
    this.emptyEl = this.querySelector(".delivery-cart__empty");
    this.countEl = this.querySelector(".delivery-cart__count");
    this.goBtn = this.querySelector(".delivery-cart__go");
  }


  load() {
    if ((location.hash || "#home") !== "#home") return;

    if (this.isMobile) {
      this.hideCart();
      return;
    }

    this.fetchItems();
  }

  async fetchItems() {
    try {
      const res = await apiFetch("/api/delivery-cart");
      if (!res.ok) {
        this.items = [];
      } else {
        const data = await res.json();
        this.items = Array.isArray(data?.items) ? data.items : [];
      }
    } catch {
      this.items = [];
    }

    this.renderList();
  }


  renderList() {
    if (!this.listEl) return;

    const items = Array.isArray(this.items) ? this.items : [];
    this.listEl.innerHTML = "";

    if (!items.length) {
      this.hideCart();
      return;
    }

    this.showCart();

    let totalCount = 0;

    items.forEach((item) => {
      const qty = Number(item.qty || 1);
      totalCount += qty;

      const price = parsePrice(item.price);
      const subText = this.buildSubText(item.sub);

      const row = document.createElement("div");
      row.className = "delivery-cart__item";
      row.dataset.id = item.id || "";

      row.innerHTML = `
        <div class="delivery-cart__thumb">
          <img src="${escapeAttr(item.thumb || "assets/img/box.svg")}" alt="" width="57" height="57" decoding="async">
        </div>

        <div class="delivery-cart__info">
          <div class="delivery-cart__title">${escapeHtml(item.title || "")}</div>
          <div class="delivery-cart__meta">${escapeHtml(item.meta || "")}</div>
          <div class="delivery-cart__sub">${escapeHtml(subText)}</div>
        </div>

        <div class="delivery-cart__price">
          <span>${formatPrice(price * qty)}</span>
          <button class="delivery-cart__remove" type="button" data-action="remove">−</button>
          <span class="delivery-cart__qty">x${qty}</span>
        </div>
      `;

      this.listEl.appendChild(row);
    });

    if (this.countEl) this.countEl.textContent = String(totalCount);
  }

  buildSubText(sub) {
    const arr = Array.isArray(sub) ? sub : [];
    const names = arr.map((s) => s?.name).filter(Boolean);
    return names.length ? names.join(", ") : "Бараа алга";
  }


  handleClick(e) {
    if (e.target.closest(".delivery-cart__go")) {
      location.hash = "#delivery";
      return;
    }

    const removeBtn = e.target.closest("[data-action='remove']");
    if (!removeBtn) return;

    const itemEl = removeBtn.closest(".delivery-cart__item");
    const id = itemEl?.dataset?.id;
    if (!id) return;

    this.decrementItem(id);
  }

  onViewportChange() {
    this.isMobile = this.media?.matches === true;
    this.load();
  }

  async decrementItem(id) {
    try {
      const res = await fetch(`/api/delivery-cart/${(id)}`, {
        method: "PATCH",
      });
      if (!res.ok) return;
    } catch {
      return;
    }

    this.load();

    window.dispatchEvent(new Event("delivery-cart-updated"));
  }


  showCart() {
    this.style.display = "block";
    const layout = this.closest(".offers-layout");
    if (layout) layout.classList.add("has-cart");

    if (this.emptyEl) this.emptyEl.style.display = "none";
    if (this.goBtn) this.goBtn.style.display = "inline-flex";
  }

  hideCart() {
    this.style.display = "none";
    const layout = this.closest(".offers-layout");
    if (layout) layout.classList.remove("has-cart");

    if (this.emptyEl) this.emptyEl.style.display = "block";
    if (this.countEl) this.countEl.textContent = "0";
    if (this.goBtn) this.goBtn.style.display = "none";
  }
}

customElements.define("delivery-cart", DeliveryCart);