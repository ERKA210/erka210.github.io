class DeliveryPage extends HTMLElement {
  connectedCallback() {
    this.render();
    this.applyActiveOrder();
  }

  render() {
    this.innerHTML = `
      <div class="container">
        <section class="orders">
          <h2>Миний идэвхтэй хүргэлт</h2>
          <d-orders data-active="true"
                    header="GL Burger - 7-р байр 207"
                    detail="3 ширхэг • 10,000₮"></d-orders>
        </section>

        <section class="details">
          <h2>Захиалгын дэлгэрэнгүй</h2>
          <del-order-details></del-order-details>
        </section>

        <section class="order-step">
          <h2>Захиалгын явц</h2>
          <del-order-progress></del-order-progress>
        </section>
      </div>
    `;
  }

  applyActiveOrder() {
    const raw = localStorage.getItem('activeOrder');
    if (!raw) return;

    try {
      const order = JSON.parse(raw);
      const first = this.querySelector('d-orders[data-active="true"]');
      if (first && order.from && order.to) {
        first.setAttribute('header', `${order.from} → ${order.to}`);
        if (order.item) {
          first.setAttribute('detail', order.item);
        }
      }
    } catch (e) {
      console.error('activeOrder parse error', e);
    }
  }
}

customElements.define('delivery-page', DeliveryPage);
