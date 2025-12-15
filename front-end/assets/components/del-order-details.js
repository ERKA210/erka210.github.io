class DelOrderDetails extends HTMLElement {
  connectedCallback() {
    const raw = localStorage.getItem('activeOrder');
    let from = 'GS25';
    let to = 'МУИС 7-р байр';
    let dateText = '2025.10.08 • 09:36';

    if (raw) {
      try {
        const order = JSON.parse(raw);
        if (order.from) from = order.from;
        if (order.to) to = order.to;
        if (order.createdAt) {
          const dt = new Date(order.createdAt);
          const pad = (n) => n.toString().padStart(2, '0');
          dateText = `${dt.getFullYear()}.${pad(dt.getMonth()+1)}.${pad(dt.getDate())} • ${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
        }
      } catch (e) {
        console.error('DelOrderDetails parse error', e);
      }
    }

    this.innerHTML = `
      <div class="detail-header">
        <p><strong>${from}</strong> → <strong>${to}</strong></p>
        <p class="date">${dateText}</p>
        <person-detail title="Захиалагчийн мэдээлэл" type="medium"></person-detail>
      </div>
    `;
  }
}

customElements.define('del-order-details', DelOrderDetails);
