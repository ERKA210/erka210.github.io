class DeliveryPage extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
    this.applyActiveOrder();
    this.handleRouteChange = this.handleRouteChange.bind(this);
    this.applyActiveOrderBound = this.applyActiveOrder.bind(this);
    window.addEventListener('hashchange', this.handleRouteChange);
    window.addEventListener('order-updated', this.applyActiveOrderBound);
  }

  disconnectedCallback() {
    window.removeEventListener('hashchange', this.handleRouteChange);
    window.removeEventListener('order-updated', this.applyActiveOrderBound);
  }

  handleRouteChange() {
    if (location.hash === '#delivery') {
      this.applyActiveOrder();
    }
  }

  render() {
    this.innerHTML = `
    <link rel="stylesheet" href="assets/css/delivery.css">
      <div class="container">
        <section class="orders">
          <d-orders data-active="true"
                    header="GL Burger - 7-р байр 207"
                    detail="3 ширхэг • 10,000₮"></d-orders>
          <d-orders data-active="true"
                    header="GL Burger - 7-р байр 207"
                    detail="3 ширхэг • 10,000₮"></d-orders>
          <d-orders data-active="true"
                    header="GL Burger - 7-р байр 207"
                    detail="3 ширхэг • 10,000₮"></d-orders>
          <d-orders data-active="true"
                    header="GL Burger - 7-р байр 207"
                    detail="3 ширхэг • 10,000₮"></d-orders>
        </section>

        <section class="details">
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
