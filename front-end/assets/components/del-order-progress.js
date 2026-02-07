import { apiFetch } from "../api_client.js";
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
    this.userSelected = false;

    this.render();
    this.loadActiveOrder();

    document.addEventListener("order-select", this.handleOrderSelect);
    document.addEventListener("delivery-select", this.handleDeliverySelect);
    window.addEventListener("order-updated", this.loadActiveOrder);
  }

  disconnectedCallback() {
    document.removeEventListener("order-select", this.handleOrderSelect);
    document.removeEventListener("delivery-select", this.handleDeliverySelect);
    window.removeEventListener("order-updated", this.loadActiveOrder);
    if (this._ratingTimer) {
      clearInterval(this._ratingTimer);
      this._ratingTimer = null;
    }
  }

  handleDeliverySelect = (e) => {
    const data = e.detail || null;
    const selectedId = data?.orderId || data?.id || null;
    if (!selectedId) return;
    this.userSelected = true;
    this.activeOrder = { id: selectedId };
    this.currentId = selectedId;
    this.render();
  };

  handleOrderSelect = (e) => {
    this.currentId = e.detail.id;
    this.render();
  };

  loadActiveOrder = async () => {
    try {
      const res = await fetch("/api/active-order", { credentials: "include" });
      if (!res.ok) return;
      const data = await res.json();
      const order = data?.order || null;
      if (this.userSelected) return;
      this.activeOrder = order;
      const activeId = order?.orderId || order?.id || null;
      if (activeId) this.currentId = activeId;
      this.render();
    } catch (e) {
      // ignore
    }
  };

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

      if (current >= maxIndex) {
        nextBtn.disabled = true;
        nextBtn.textContent = "Үнэлгээ хүлээж байна";
        nextBtn.style.opacity = "0.6";
        this.startRatingPoll(order.id);
        alert("Захиалагч үнэлгээ өгсний дараа автоматаар дуусна.");
        return;
      }

      const nextIdx = current + 1;

      this.stepsState[order.id] = nextIdx;
      saveSteps(this.stepsState);

      localStorage.setItem("orderStep", String(nextIdx));

      const orderId = order.id;
      if (this.isUuid(orderId)) {
        this.updateOrderStatus(orderId, nextIdx);
      }

      if (nextIdx === maxIndex) {
        localStorage.setItem("deliveryAwaitRating", "1");
        this.startRatingPoll(order.id);
      }

      this.render();
    });
  }

  updateOrderStatus = async (orderId, stepIndex) => {
    const statusMap = {
      1: "delivering",
      2: "delivered",
    };
    const status = statusMap[stepIndex] || "created";
    try {
      const res = await apiFetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        console.warn("status update failed", res.status);
      }
    } catch (e) {
      console.warn("status update error", e);
    }
  };

  startRatingPoll = (orderId) => {
    if (this._ratingTimer) return;

    this._ratingTimer = setInterval(async () => {
      try {
        const meRes = await apiFetch("/api/auth/me");
        if (!meRes.ok) return;
        const me = await meRes.json();
        const courierId = me?.user?.id;
        if (!courierId) return;

        const rRes = await apiFetch(`/api/ratings/courier/${courierId}`);
        if (!rRes.ok) return;
        const data = await rRes.json();
        const items = data?.items || [];

        const rated = items.some(r => String(r.order_id) === String(orderId));
        if (!rated) return;

        clearInterval(this._ratingTimer);
        this._ratingTimer = null;

        delete this.stepsState[orderId];
        saveSteps(this.stepsState);
        localStorage.removeItem("deliveryAwaitRating");

        window.NumAppState?.logout("rating_done");
      } catch (e) {
        // ignore
      }
    }, 3000);
  };
}

customElements.define("del-order-progress", DelOrderProgress);