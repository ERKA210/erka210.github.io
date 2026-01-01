class DelOrderDetails extends HTMLElement {
  connectedCallback() {
    // ✅ эхлээд хоосон байдалтай
    this.renderEmpty();
    this.loadOrder();
  }

  renderEmpty() {
    // зөвхөн component доторх хоосорно (section үлдэнэ)
    this.innerHTML = "";
  }

  render(data = {}) {
    const from = data.from || "";
    const to = data.to || "";
    const dateText = data.createdAt || "";

    // хэрэв өгөгдөлгүй бол хоосон байлгана
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

  async loadOrder() {
    // ✅ delivery-page empty mode асаасан бол юм харуулахгүй
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
        dateText = `${dt.getFullYear()}.${pad(dt.getMonth() + 1)}.${pad(dt.getDate())} • ${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
      }

      this.render({ from: order.from, to: order.to, createdAt: dateText });
    } catch (e) {
      this.renderEmpty();
    }
  }
}

customElements.define("del-order-details", DelOrderDetails);
