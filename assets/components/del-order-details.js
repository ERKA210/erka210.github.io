import { ORDERS, getOrderById } from "./delivery-data.js";

class DelOrderDetails extends HTMLElement {
  connectedCallback() {
    this.currentId = ORDERS[0]?.id || null;
    this.render();

      document.addEventListener("order-select", (e) => {
      this.currentId = e.detail.id;
      this.render();
    });
  }

  render() {
    const order = getOrderById(this.currentId);
    if (!order) {
      this.innerHTML = "<p>Захиалга олдсонгүй.</p>";
      return;
    }

    this.innerHTML = `
      <div class="detail-header">
        <p><strong>${order.from}</strong> → <strong>${order.to}</strong></p>
        <p class="date">${order.datetime}</p>
      </div>

      <p style="font-weight:bold; font-size:1.1rem; margin-bottom:8px;">
        Захиалгын мэдээлэл
      </p>
      <ul style="padding-left:1.2rem; margin-bottom:10px; font-size:14px;">
        ${order.items.map(it => `<li>${it}</li>`).join("")}
      </ul>
      <p style="font-weight:bold; margin-bottom:15px;">
        Нийт дүн: ${order.total}
      </p>

      <p style="font-weight:bold; font-size:1.1rem;">
        Хүргэгчийн мэдээлэл
      </p>
      <div class="delivery">
        <img src="${order.courier.avatar}" alt="Хүргэгчийн зураг">
        <div class="delivery-info">
          <h3>Нэр: ${order.courier.name}</h3>
          <p>Утас: ${order.courier.phone}</p>
          <p>ID: ${order.courier.id}</p>
        </div>
      </div>
    `;
  }
}

customElements.define("del-order-details", DelOrderDetails);
