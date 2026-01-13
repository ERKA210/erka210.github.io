function parseJsonAttr(raw, fallback) {
  if (!raw) return fallback;
  try {
    let normalized = raw;
    try {
      normalized = decodeURIComponent(raw);
    } catch {
      normalized = raw;
    }
    return JSON.parse(normalized);
  } catch {
    return fallback;
  }
}

class OfferCard extends HTMLElement {
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
      customer: parseJsonAttr(this.getAttribute("customer"), {}),
    };
  }

  render() {
    const { thumb, title, meta, price } = this.data;
    this.innerHTML = `
      <article class="offer-card" role="button" tabindex="0">
        <div class="offer-thumb">
          <img src="${thumb}" alt="icon" width="57" height="57" decoding="async"/>
        </div>
        <div class="offer-info">
          <div class="offer-title">${title}</div>
          <div class="offer-meta">${meta}</div>
        </div>
        <div class="offer-price">${price}</div>
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
}

if (!customElements.get("offer-card")) {
  customElements.define("offer-card", OfferCard);
}

export { OfferCard };
