class OrderProgress extends HTMLElement {
  connectedCallback() {
    this.renderEmpty();
    
    this.handleOrderSelect = (e) => {
      const order = e.detail || null;
      if (!order) {
        this.renderEmpty();
        return;
      }
      this.updateProgress(order.status);
    };
    
    this.handleOrderStatusChange = (e) => {
      const data = e.detail || {};
      const status = data.status || null;
      if (status) {
        this.updateProgress(status);
      }
    };
    
    document.addEventListener("order-select", this.handleOrderSelect);
    document.addEventListener("order-status-change", this.handleOrderStatusChange);
  }

  renderEmpty() {
    this.innerHTML = `
      <div class="order-progress">
        <div class="step" data-step="0">
          <div class="step-indicator">
            <svg viewBox="0 0 24 24">
              <path d="M12 2C8.962 2 6.5 4.462 6.5 7.5C6.5 11.438 12 18 12 18C12 18 17.5 11.438 17.5 7.5C17.5 4.462 15.038 2 12 2ZM12 9.5C10.895 9.5 10 8.605 10 7.5C10 6.395 10.895 5.5 12 5.5C13.105 5.5 14 6.395 14 7.5C14 8.605 13.105 9.5 12 9.5Z"/>
            </svg>
          </div>
          <div><div class="step-label">Захиалга хүлээн авсан</div></div>
        </div>

        <div class="step" data-step="1">
          <div class="step-indicator">
            <svg viewBox="0 0 24 24">
              <path d="M12 2C8.962 2 6.5 4.462 6.5 7.5C6.5 11.438 12 18 12 18C12 18 17.5 11.438 17.5 7.5C17.5 4.462 15.038 2 12 2ZM12 9.5C10.895 9.5 10 8.605 10 7.5C10 6.395 10.895 5.5 12 5.5C13.105 5.5 14 6.395 14 7.5C14 8.605 13.105 9.5 12 9.5Z"/>
            </svg>
          </div>
          <div><div class="step-label">Хүргэлтэнд гарсан</div></div>
        </div>

        <div class="step" data-step="2">
          <div class="step-indicator">
            <svg viewBox="0 0 24 24">
              <path d="M12 2C8.962 2 6.5 4.462 6.5 7.5C6.5 11.438 12 18 12 18C12 18 17.5 11.438 17.5 7.5C17.5 4.462 15.038 2 12 2ZM12 9.5C10.895 9.5 10 8.605 10 7.5C10 6.395 10.895 5.5 12 5.5C13.105 5.5 14 6.395 14 7.5C14 8.605 13.105 9.5 12 9.5Z"/>
            </svg>
          </div>
          <div><div class="step-label">Амжилттай хүлээн авсан</div></div>
        </div>
      </div>
    `;
  }

  mapStatusToStep(status) {
    switch ((status || "").toLowerCase()) {
      case "delivering":
        return 1;
      case "delivered":
        return 2;
      default:
        return 0;
    }
  }

  updateProgress(status) {
    const stepIndex = this.mapStatusToStep(status);
    
    const steps = this.querySelectorAll('.step');
    steps.forEach((step, idx) => {
      step.classList.remove('active', 'completed');
      if (idx < stepIndex) {
        step.classList.add('completed');
      } else if (idx === stepIndex) {
        step.classList.add('active');
      }
    });
  }

  disconnectedCallback() {
    if (this.handleOrderSelect) {
      document.removeEventListener("order-select", this.handleOrderSelect);
    }
    if (this.handleOrderStatusChange) {
      document.removeEventListener("order-status-change", this.handleOrderStatusChange);
    }
  }
}

customElements.define('order-progress', OrderProgress);