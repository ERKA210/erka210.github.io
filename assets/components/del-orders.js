import { ORDERS } from "./delivery-data.js";

class DelOrders extends HTMLElement {
  connectedCallback() {
    this.selectedId = ORDERS[0]?.id || null;
    this.render();
  }

  render() {
    this.innerHTML = `
      <div class="order-list">
        ${ORDERS.map(order => `
          <div class="order-card" data-id="${order.id}">
            <div class="order-info">
              <h3>${order.title}</h3>
              <p>${order.summary}</p>
            </div>
            <button class="view-btn" type="button">Дэлгэрэнгүй</button>
          </div>
        `).join("")}
      </div>
    `;

    this.updateActive();

    this.querySelectorAll(".order-card").forEach(card => {
      card.addEventListener("click", () => {
        const id = card.getAttribute("data-id");
        this.selectedId = id;
        this.updateActive();

        // Бусад component-д сонгогдсон захиалгыг мэдэгдэх
        this.dispatchEvent(new CustomEvent("order-select", {
          detail: { id },
          bubbles: true,
          composed: true
        }));
      });
    });
  }

  updateActive() {
    this.querySelectorAll(".order-card").forEach(card => {
      const id = card.getAttribute("data-id");
      card.classList.toggle("is-active", id === this.selectedId);
    });
  }
}

customElements.define("del-orders", DelOrders);
