class OrdersPage extends HTMLElement {
  connectedCallback() {
    this.render();
    this.applyActiveOrder();
  }

  render() {
    this.innerHTML = `
      <main class="container">
        <section class="orders">
          <h2>Миний захиалга</h2>
          <div class="order-list">
            <div class="order-card">
              <div class="order-info">
                <h3 class="order-title">GL Burger - 7-р байр 207</h3>
                <p>XLбагц: 10000₮</p>
                <p>Mбагц: 8000₮</p>
                <p>Lбагц: 9000₮</p>
                <hr>
                <p class="order-total">Дүн: 37,000₮</p>
              </div>
              <img src="assets/img/tor.svg" alt="hemjee">
            </div>

            <article>
              <p style="font-weight: bold; font-size: 1.5rem;">Хүргэгчийн мэдээлэл</p>
              <div class="delivery">
                <img src="assets/img/profile.jpg" alt="Хүргэгчийн зураг">
                <div class="delivery-info">
                  <h3>Нэр: Чигцалмаа</h3>
                  <p>Утас: 99001234</p>
                  <p>ID: 23B1NUM0245</p>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section class="details">
          <h2>Захиалгын явц</h2>
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

          <rating-stars max="5" color="orange" size="28px"></rating-stars>
          <input type="text" placeholder="Сэтгэгдэл үлдээнэ үү...">
          <button class="submit">Илгээх</button>
        </section>
      </main>
    `;

    const ratingEl = this.querySelector('rating-stars');
    if (ratingEl) {
      ratingEl.addEventListener('rate', e => {
        console.log('Үнэлгээ:', e.detail);
      });
    }

    const stepIndex = parseInt(localStorage.getItem('orderStep')) || 0;
    const steps = this.querySelectorAll('.step');
    steps.forEach((step, idx) => {
      step.classList.remove('active', 'completed');
      if (idx < stepIndex) step.classList.add('completed');
      else if (idx === stepIndex) step.classList.add('active');
    });
  }

  applyActiveOrder() {
    const raw = localStorage.getItem('activeOrder');
    if (!raw) return;

    try {
      const order = JSON.parse(raw);
      const titleEl = this.querySelector('.order-title');
      if (titleEl && order.from && order.to) {
        titleEl.textContent = `${order.from} - ${order.to}`;
      }
      const totalEl = this.querySelector('.order-total');
      if (totalEl && order.item) {
        totalEl.textContent = `Зүйл: ${order.item}`;
      }
    } catch (e) {
      console.error('activeOrder parse error', e);
    }
  }
}

customElements.define('orders-page', OrdersPage);
