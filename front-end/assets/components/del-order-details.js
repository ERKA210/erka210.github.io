class DelOrderDetails extends HTMLElement {
  connectedCallback() {
    this.render();
    this.loadOrder();
  }

  render(data = {}) {
    const from = data.from || 'GS25';
    const to = data.to || 'МУИС 7-р байр';
    const dateText = data.createdAt || '2025.10.08 • 09:36';
    this.innerHTML = `
      <div class="detail-header">
        <p><strong>${from}</strong> → <strong>${to}</strong></p>
        <p class="date">${dateText}</p>
        <person-detail title="Захиалагчийн мэдээлэл" type="medium"></person-detail>
      </div>
    `;
  }

  async loadOrder() {
    try {
      const res = await fetch("/api/active-order");
      if (!res.ok) return;
      const data = await res.json();
      const order = data?.order;
      if (!order) return;
      let dateText = order.createdAt || '';
      if (order.createdAt) {
        const dt = new Date(order.createdAt);
        const pad = (n) => n.toString().padStart(2, '0');
        dateText = `${dt.getFullYear()}.${pad(dt.getMonth()+1)}.${pad(dt.getDate())} • ${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
      }
      this.render({
        from: order.from,
        to: order.to,
        createdAt: dateText,
      });
    } catch (e) {
      // ignore
    }
  }
}

customElements.define('del-order-details', DelOrderDetails);
