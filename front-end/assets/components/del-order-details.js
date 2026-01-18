class DelOrderDetails extends HTMLElement {
  connectedCallback() {
    this.renderEmpty();
    
    this.handleDeliverySelect = (e) => {
      const data = e.detail || null;
      if (!data) {
        this.renderEmpty();
        return;
      }
      this.render({
        from: data.from || "",
        to: data.to || "",
        createdAt: data.createdAt || "",
      });
    };
    document.addEventListener("delivery-select", this.handleDeliverySelect);
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
        <p><strong>${from}</strong> → <strong>${to}</strong></p>
        <p class="date">${dateText}</p>
        <person-detail title="Захиалагчийн мэдээлэл" type="medium"></person-detail>
      </div>
    `;
  }

  disconnectedCallback() {
    if (this.handleDeliverySelect) {
      document.removeEventListener("delivery-select", this.handleDeliverySelect);
    }
  }
}

customElements.define("del-order-details", DelOrderDetails);
