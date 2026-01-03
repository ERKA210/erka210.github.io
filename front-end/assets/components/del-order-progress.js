import { ORDERS, getOrderById, loadSteps, saveSteps } from "./delivery-data.js";

const STEP_LABELS = [
  "Захиалга бэлтгэх",
  "Хүргэлтэнд гарсан",
  "Амжилттай хүргэсэн"
];

class DelOrderProgress extends HTMLElement {
  connectedCallback() {
    this.stepsState = loadSteps();
    this.currentId = ORDERS[0]?.id || null;
    this.activeOrder = null;
    this.handleOrderSelect = (e) => {
      this.currentId = e.detail.id;
      this.render();
    };
    this.handleOrderUpdated = this.loadActiveOrder.bind(this);

    this.render();
    this.loadActiveOrder();

    document.addEventListener("order-select", this.handleOrderSelect);
    window.addEventListener("order-updated", this.handleOrderUpdated);
  }

  disconnectedCallback() {
    document.removeEventListener("order-select", this.handleOrderSelect);
    window.removeEventListener("order-updated", this.handleOrderUpdated);
  }

  async loadActiveOrder() {
    try {
      const res = await fetch("/api/active-order");
      if (!res.ok) return;
      const data = await res.json();
      const order = data?.order || null;
      this.activeOrder = order;
      const activeId = order?.orderId || order?.id || null;
      if (activeId) this.currentId = activeId;
      this.render();
    } catch (e) {
      // ignore
    }
  }

  getCurrentStep() {
    const order = this.getCurrentOrder();
    if (!order) return 0;

    const saved = this.stepsState[order.id];
    if (saved === 0 || saved) return saved;
    return order.defaultStep || 0;
  }

  getCurrentOrder() {
    if (this.activeOrder) {
      const id = this.activeOrder.orderId || this.activeOrder.id || null;
      if (id) return { id, defaultStep: 0 };
    }
    return getOrderById(this.currentId);
  }

  isUuid(value) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      String(value || "")
    );
  }

  render() {
    if (this.getAttribute("data-empty") === "1") {
      this.innerHTML = "";
      return;
    }
    const stepIndex = this.getCurrentStep();
    const order = this.getCurrentOrder();

    if (!order) {
      this.innerHTML = "<p>Захиалга олдсонгүй.</p>";
      return;
    }

    this.innerHTML = `
      <div class="order-progress">
        ${STEP_LABELS.map((label, idx) => `
          <div class="step
            ${idx < stepIndex ? "completed" : ""}
            ${idx === stepIndex ? "active" : ""}"
            data-step="${idx}">
            <div class="step-indicator">
              <svg viewBox="0 0 24 24">
                <path d="M12 2C8.962 2 6.5 4.462 6.5 7.5C6.5 11.438 12 18 12 18C12 18 17.5 11.438 17.5 7.5C17.5 4.462 15.038 2 12 2ZM12 9.5C10.895 9.5 10 8.605 10 7.5C10 6.395 10.895 5.5 12 5.5C13.105 5.5 14 6.395 14 7.5C14 8.605 13.105 9.5 12 9.5Z"/>
              </svg>
            </div>
            <div>
              <div class="step-label">${label}</div>
              <p class="step-desc">
                ${idx === 0
        ? "Захиалгыг бэлтгэж дууссаны дараа дараагийн алхам руу шилжинэ."
        : idx === 1
          ? "Хүргэлтэнд гарсан үед дараагийн алхамыг дарна."
          : "Хэрэглэгчид хүлээлгэн өгч дууссан үед төгсөнө."}
              </p>
            </div>
          </div>
        `).join("")}
      </div>
      <button class="next-btn" type="button">Next</button>
    `;

    const nextBtn = this.querySelector(".next-btn");
    nextBtn.addEventListener("click", () => {
      const current = this.getCurrentStep();
      const maxIndex = STEP_LABELS.length - 1;
      const nextIdx = current < maxIndex ? current + 1 : maxIndex;

      this.stepsState[order.id] = nextIdx;
      saveSteps(this.stepsState);

      localStorage.setItem("orderStep", String(nextIdx));
      const orderId = order.id;
      if (this.isUuid(orderId)) {
        this.updateOrderStatus(orderId, nextIdx);
      }
      // ✅ Сүүлийн алхам хүрвэл хүргэлт дууссан гэж үзээд guest рүү буцаана
      if (nextIdx === maxIndex) {
        document.dispatchEvent(new CustomEvent('show-receive-button'));
        window.NumAppState?.resetToGuest("delivery_completed");
      }
      this.render();
    });
  }

  async updateOrderStatus(orderId, stepIndex) {
    const status = stepIndex === 2 ? "delivered" : stepIndex === 1 ? "on_the_way" : "created";
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.warn("status update failed", err?.error || res.status);
      }
    } catch (e) {
      console.warn("status update error", e);
    }
  }
}

customElements.define("del-order-progress", DelOrderProgress);
