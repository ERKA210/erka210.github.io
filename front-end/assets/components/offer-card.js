class OfferCard extends HTMLElement {
  
  static get observedAttributes() {
    return ["thumb", "title", "meta", "price", "sub", "customer", "order-id"];
  }

  connectedCallback() {
    if (this._ready) return;
    this._ready = true;
    
    this.render();
    this.setupEvents();
  }

  attributeChangedCallback() {
    if (this._ready) {
      this.render();
    }
  }

  get data() {
    return {
      thumb: this.getAttribute("thumb") || "assets/img/box.svg",
      title: this.getAttribute("title") || "",
      meta: this.getAttribute("meta") || "",
      price: this.getAttribute("price") || "",
      orderId: this.getAttribute("order-id") || "",
      sub: this.parseJSON(this.getAttribute("sub") || "[]"),
      customer: this.parseJSON(this.getAttribute("customer") || "{}"),
    };
  }

  parseJSON(text) {
    try {
      return JSON.parse(text);
    } catch (error) {
      return text.startsWith("[") ? [] : {};
    }
  }

  render() {
    const cardData = this.data;
    const thumbnailImage = cardData.thumb;
    const cardTitle = cardData.title;
    const cardMeta = cardData.meta;
    const cardPrice = cardData.price;
    
    this.innerHTML = `
      <article class="offer-card" role="button" tabindex="0">
        <div class="offer-thumb">
          <img 
            src="${thumbnailImage}" 
            alt="icon" 
            width="57" 
            height="57" 
            decoding="async"
          />
        </div>
        <div class="offer-info">
          <div class="offer-title">${cardTitle}</div>
          <div class="offer-meta">${cardMeta}</div>
        </div>
        <div class="offer-price">${cardPrice}</div>
      </article>
    `;
  }

  setupEvents() {
    this.addEventListener("click", () => {
      this.sendSelectEvent();
    });

    this.addEventListener("keydown", (event) => {
      const isEnterKey = event.key === "Enter";
      const isSpaceKey = event.key === " ";
      
      if (isEnterKey || isSpaceKey) {
        event.preventDefault(); 
        this.click();
      }
    });
  }

  sendSelectEvent() {
    const cardData = this.data;
    
    const selectEvent = new CustomEvent("offer-select", {
      bubbles: true, 
      detail: cardData 
    });
    
    this.dispatchEvent(selectEvent);
  }
}

if (!customElements.get("offer-card")) {
  customElements.define("offer-card", OfferCard);
}

export { OfferCard };