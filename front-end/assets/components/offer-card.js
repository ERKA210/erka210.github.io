class OfferCard extends HTMLElement {
  connectedCallback() {
    this.render();
    this.setup();
  }

  static get observedAttributes() {
    return ["thumb", "title", "meta", "price"];
  }

  attributeChangedCallback() {
    // attribute өөрчлөгдвөл дахин зурна
    if (this.isConnected) this.render();
  }

  render() {
    const thumb = this.getAttribute("thumb") || "assets/img/box.svg";
    const title = this.getAttribute("title") || "";
    const meta = this.getAttribute("meta") || "";
    const price = this.getAttribute("price") || "";

    this.innerHTML = `
      <article class="offer-card" role="button" tabindex="0">
        <div class="offer-thumb">
          <img src="${this.escapeAttr(thumb)}" alt="icon"/>
        </div>

        <div class="offer-info">
          <div class="offer-title">${this.escapeHtml(title)}</div>
          <div class="offer-meta">${this.escapeHtml(meta)}</div>
        </div>

        <div class="offer-price">${this.escapeHtml(price)}</div>
      </article>
    `;
  }

  setup() {
    const card = this.querySelector(".offer-card");
    if (!card) return;

    // click хийхэд offer-select event дэгдээнэ (OfferList/Modal чинь ашиглаж болно)
    card.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("offer-select", {
          bubbles: true,
          detail: {
            thumb: this.getAttribute("thumb"),
            title: this.getAttribute("title"),
            meta: this.getAttribute("meta"),
            price: this.getAttribute("price"),
            // хүсвэл orderId гэх мэт data-* нэмээд дамжуулж болно
            orderId: this.getAttribute("orderid") || this.getAttribute("orderId"),
          },
        })
      );
    });

    // keyboard accessibility (Enter/Space)
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.click();
      }
    });
  }

  escapeHtml(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  escapeAttr(s) {
    return this.escapeHtml(s);
  }
}

customElements.define("offer-card", OfferCard);