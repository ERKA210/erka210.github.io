// assets/components/orders.js
class DOrders extends HTMLElement {
  connectedCallback() {
    const isActive = this.hasAttribute('data-active');
    let header = this.getAttribute('header') || '';
    let detail = this.getAttribute('detail') || '';

    if (isActive) {
      const raw = localStorage.getItem('activeOrder');
      if (raw) {
        try {
          const order = JSON.parse(raw);
          if (order.from && order.to) {
            header = `${order.from} → ${order.to}`;
          }
          if (order.item) {
            detail = `${order.item}`;
          }
        } catch (e) {
          console.error('activeOrder parse алдаа', e);
        }
      }
    }

    this.innerHTML = `
      <article class="order-card">
        <div class="order-info">
          <h3>${header}</h3>
          <p>${detail}</p>
        </div>
        <button class="view-btn"><svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24">
  <title>i</title>
  <g id="Complete">
    <g id="expand">
      <g>
        <polyline id="Right-2" data-name="Right" points="3 17.3 3 21 6.7 21" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
        <line x1="10" y1="14" x2="3.8" y2="20.2" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
        <line x1="14" y1="10" x2="20.2" y2="3.8" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
        <polyline id="Right-3" data-name="Right" points="21 6.7 21 3 17.3 3" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
      </g>
    </g>
  </g>
</svg></button>
      </article>
    `;
  }
}

customElements.define('d-orders', DOrders);
