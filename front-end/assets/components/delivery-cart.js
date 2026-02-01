import { formatPrice, parsePrice } from "../helper/format-d-ts-p.js";
import { escapeAttr } from "../helper/escape-attr.js";
import { escapeHtml } from "../helper/escape-html.js";
import { apiFetch } from "../api_client.js";

class DeliveryCart extends HTMLElement {

  connectedCallback() {
    this.render();
    this.getElements();
    this.setupEventListeners();
    this.checkViewportSize();
    this.loadCartItems();
  }
  
  disconnectedCallback() {
    this.removeEventListeners();
  }
  
  render() {
    this.innerHTML = `
      <div class="delivery-cart">
        <div class="delivery-cart__header">
          <h3>Хүргэлтийн сагс</h3>
          <span class="delivery-cart__count">0</span>
        </div>
        
        <div class="delivery-cart__list"></div>
        
        <div class="delivery-cart__empty">
          Одоогоор хүргэлт сонгоогүй байна.
        </div>
        
        <button class="delivery-cart__go">
          Хүргэлт рүү
        </button>
      </div>
    `;
  }
  
  getElements() {
    this.listEl = this.querySelector(".delivery-cart__list");
    this.emptyEl = this.querySelector(".delivery-cart__empty");
    this.countEl = this.querySelector(".delivery-cart__count");
    this.goBtn = this.querySelector(".delivery-cart__go");
  }
  
  setupEventListeners() {
    this.handleClickEvent = (event) => this.onCartClick(event);
    this.addEventListener("click", this.handleClickEvent);
    
    this.handleCartUpdate = () => this.loadCartItems();
    window.addEventListener("delivery-cart-updated", this.handleCartUpdate);
    
    this.handleHashChange = () => this.loadCartItems();
    window.addEventListener("hashchange", this.handleHashChange);
    
    this.mediaQuery = window.matchMedia("(max-width: 54rem)");
    this.handleMediaChange = () => this.checkViewportSize();
    this.mediaQuery.addEventListener("change", this.handleMediaChange);
  }
  
  removeEventListeners() {
    this.removeEventListener("click", this.handleClickEvent);
    window.removeEventListener("delivery-cart-updated", this.handleCartUpdate);
    window.removeEventListener("hashchange", this.handleHashChange);
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener("change", this.handleMediaChange);
    }
  }
  
  checkViewportSize() {
    this.isMobileDevice = this.mediaQuery?.matches === true;
    this.loadCartItems();
  }
  
  loadCartItems() {
    const currentHash = location.hash || "#home";
    if (currentHash !== "#home") {
      return;
    }

    if (this.isMobileDevice) {
      this.hideCartDisplay();
      return;
    }

    this.fetchCartItemsFromServer();
  }
  
  async fetchCartItemsFromServer() {
    try {
      const response = await apiFetch("/api/delivery-cart");
      
      if (!response.ok) {
        this.items = [];
      } else {
        const data = await response.json();
        this.items = data.items || [];
      }
    } catch (error) {
    }
    
    this.displayCartItems();
  }
  
  displayCartItems() {
    if (!this.listEl) return;
    
    const cartItems = this.items || [];
    this.listEl.innerHTML = "";

    if (cartItems.length === 0) {
      this.hideCartDisplay();
      return;
    }
    
    this.showCartDisplay();
    
    let totalItemCount = 0;
    
    cartItems.forEach((item) => {
      const quantity = Number(item.qty || 1);
      totalItemCount += quantity;
      
      const itemPrice = parsePrice(item.price);
      const subtitleText = this.createSubtitleText(item.sub);
      
      const itemElement = document.createElement("div");
      itemElement.className = "delivery-cart__item";
      itemElement.dataset.id = item.id || "";
      
      itemElement.innerHTML = `
        <div class="delivery-cart__thumb">
          <img src="${escapeAttr(item.thumb || "assets/img/box.svg")}" alt="" width="57" height="57" decoding="async">
        </div>

        <div class="delivery-cart__info">
          <div class="delivery-cart__title">${escapeHtml(item.title || "")}</div>
          <div class="delivery-cart__meta">${escapeHtml(item.meta || "")}</div>
          <div class="delivery-cart__sub">${escapeHtml(subtitleText)}</div>
        </div>

        <div class="delivery-cart__price">
          <span>${formatPrice(itemPrice * quantity)}</span>
          <button class="delivery-cart__remove" type="button" data-action="remove">−</button>
          <span class="delivery-cart__qty">x${quantity}</span>
        </div>
      `;
      
      this.listEl.appendChild(itemElement);
    });
    
    if (this.countEl) {
      this.countEl.textContent = String(totalItemCount);
    }
  }
  
  createSubtitleText(subItems) {
    const itemsArray = subItems || [];
    const itemNames = itemsArray.map((s) => s?.name).filter(Boolean);
    
    return itemNames.length > 0 ? itemNames.join(", ") : "Бараа алга";
  }
  
  onCartClick(event) {
    if (event.target.closest(".delivery-cart__go")) {
      location.hash = "#delivery";
      return;
    }
    
    const removeButton = event.target.closest("[data-action='remove']");
    if (!removeButton) return;
    
    const itemElement = removeButton.closest(".delivery-cart__item");
    const itemId = itemElement?.dataset?.id;
    
    if (!itemId) return;
    
    this.removeOneItemFromCart(itemId);
  }
  
  async removeOneItemFromCart(itemId) {
    try {
      const response = await fetch(`/api/delivery-cart/${itemId}`, {
        method: "PATCH",
      });
      
      if (!response.ok) return;
    } catch (error) {
      return;
    }
    
    this.loadCartItems();
    window.dispatchEvent(new Event("delivery-cart-updated"));
  }
  
  showCartDisplay() {
    this.style.display = "block";
    
    const layoutElement = this.closest(".offers-layout");
    if (layoutElement) {
      layoutElement.classList.add("has-cart");
    }
    
    if (this.emptyEl) this.emptyEl.style.display = "none";
    if (this.goBtn) this.goBtn.style.display = "inline-flex";
  }
  
  hideCartDisplay() {
    this.style.display = "none";
    
    const layoutElement = this.closest(".offers-layout");
    if (layoutElement) {
      layoutElement.classList.remove("has-cart");
    }
    
    if (this.emptyEl) this.emptyEl.style.display = "block";
    if (this.countEl) this.countEl.textContent = "0";
    if (this.goBtn) this.goBtn.style.display = "none";
  }
}

customElements.define("delivery-cart", DeliveryCart);