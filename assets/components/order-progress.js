class OrderProgress extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    // ---- Захиалгын идэвхтэй алхам солих функц ----
    setStep(stepNumber) {
        const steps = this.querySelectorAll(".step");

        steps.forEach(step => {
            const stepIndex = parseInt(step.getAttribute("data-step"));
            if (stepIndex <= stepNumber) {
                step.classList.add("active");
            } else {
                step.classList.remove("active");
            }
        });
    }

    // ---- Component template ----
    render() {
        this.innerHTML = `
        <section class="details">
          <h2>Захиалгын явц</h2>

          <div class="order-progress">

            <!-- 1-р алхам -->
            <div class="step active" data-step="0">
              <div class="step-indicator">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2C8.962 2 6.5 4.462 6.5 7.5C6.5 11.438 12 18 12 18C12 18 17.5 11.438 17.5 7.5C17.5 4.462 15.038 2 12 2ZM12 9.5C10.895 9.5 10 8.605 10 7.5C10 6.395 10.895 5.5 12 5.5C13.105 5.5 14 6.395 14 7.5C14 8.605 13.105 9.5 12 9.5Z"/>
                </svg>
              </div>
              <div>
                <div class="step-label">Захиалга хүлээн авсан</div>
              </div>
            </div>

            <!-- 2-р алхам -->
            <div class="step" data-step="1">
              <div class="step-indicator">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2C8.962 2 6.5 4.462 6.5 7.5C6.5 11.438 12 18 12 18C12 18 17.5 11.438 17.5 7.5C17.5 4.462 15.038 2 12 2ZM12 9.5C10.895 9.5 10 8.605 10 7.5C10 6.395 10.895 5.5 12 5.5C13.105 5.5 14 6.395 14 7.5C14 8.605 13.105 9.5 12 9.5Z"/>
                </svg>
              </div>
              <div>
                <div class="step-label">Хүргэлтэнд гарсан</div>
              </div>
            </div>

            <!-- 3-р алхам -->
            <div class="step" data-step="2">
              <div class="step-indicator">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2C8.962 2 6.5 4.462 6.5 7.5C6.5 11.438 12 18 12 18C12 18 17.5 11.438 17.5 7.5C17.5 4.462 15.038 2 12 2ZM12 9.5C10.895 9.5 10 8.605 10 7.5C10 6.395 10.895 5.5 12 5.5C13.105 5.5 14 6.395 14 7.5C14 8.605 13.105 9.5 12 9.5Z"/>
                </svg>
              </div>
              <div>
                <div class="step-label">Амжилттай хүлээн авсан</div>
              </div>
            </div>
          </div>
        </section>`;
    }
}

customElements.define("order-progress", OrderProgress);
