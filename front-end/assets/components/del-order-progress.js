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

    this.render();

    document.addEventListener("order-select", (e) => {
      this.currentId = e.detail.id;
      this.render();
    });
  }

  getCurrentStep() {
    const order = getOrderById(this.currentId);
    if (!order) return 0;

    const saved = this.stepsState[order.id];
    if (saved === 0 || saved) return saved;
    return order.defaultStep || 0;
  }

  render() {
    if (this.getAttribute("data-empty") === "1") {
      this.innerHTML = "";
      return;
    }
    const stepIndex = this.getCurrentStep();
    const order = getOrderById(this.currentId);

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

      this.render();
    });
  }
}

customElements.define("del-order-progress", DelOrderProgress);
