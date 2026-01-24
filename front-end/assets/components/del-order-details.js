class DelOrderDetails extends HTMLElement {
  connectedCallback() {
    this.renderEmpty();
    
    this.handleDeliverySelect = async (e) => {
      const data = e.detail || null;
      if (!data) {
        this.renderEmpty();
        return;
      }

      let customer = data.customer;
      if (!customer && data.orderId) {
        try {
          const res = await fetch(`/api/orders/${data.orderId}`);
          if (res.ok) {
            const json = await res.json();
            customer = json.customer || (json.order && json.order.customer);
          }
        } catch (err) {
          // ignore
        }
      }

      this.render({
        from: data.from || "",
        to: data.to || "",
        createdAt: data.createdAt || "",
        customer: customer,
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
    const customer = data.customer;

    if (!from && !to && !dateText) {
      this.renderEmpty();
      return;
    }

    const customerAttr = `customer='${JSON.stringify(customer || null).replace(/'/g, "&#39;")}'`;

    this.innerHTML = `
      <div class="detail-header">
        <p><strong>${from}</strong> → <strong>${to}</strong></p>
        <p class="date">${dateText}</p>
        <person-detail title="Захиалагчийн мэдээлэл" type="medium" ${customerAttr}></person-detail>
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
