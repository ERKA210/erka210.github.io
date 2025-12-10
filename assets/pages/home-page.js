class HomePage extends HTMLElement {
  connectedCallback() {
    this.pendingOrder = null;
    this.pendingOffer = null;
    this.render();
    this.setupOrderLogic();
    this.setupConfirmModal();
  }

  render() {
    this.innerHTML = `
      <link rel="stylesheet" href="assets/css/index.css" />
      <style>
        #confirm-modal {
          position: fixed;
          inset: 0;
          display: none;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          z-index: 10000;
          padding: 1rem;
        }
        #confirm-modal.show { display: flex; }
        #confirm-modal .modal-content {
          background: #fff;
          border-radius: 20px;
          width: min(480px, 100%);
          padding: 1.6rem 1.8rem;
          box-shadow: 0 24px 70px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
          text-align: center;
        }
        #confirm-modal h3 {
          margin: 0;
          font-size: 1.3rem;
          color: #111827;
        }
        #confirm-modal p {
          margin: 0;
          color: #374151;
          line-height: 1.45;
        }
        #confirm-modal .modal-actions {
          display: flex;
          justify-content: space-between;
          gap: 0.75rem;
          margin-top: 0.75rem;
        }
        #confirm-modal .btn--gray {
          background: #f9fafb;
          color: #111827;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 0.85rem 1.4rem;
          font-weight: 700;
        }
        #confirm-modal .btn--accent {
          background: var(--color-accent);
          color: #fff;
          border-radius: 12px;
          padding: 0.85rem 1.4rem;
          font-weight: 800;
        }
        #confirm-modal .detail-row {
          text-align: left;
          background: #f9fafb;
          border-radius: 12px;
          padding: 0.85rem 1rem;
          border: 1px solid #eef2f7;
          color: #1f2937;
          line-height: 1.5;
        }
        #confirm-modal .detail-row strong {
          display: inline-block;
          min-width: 4.5rem;
        }
      </style>
      <section class="filter-section">
        <div class="middle-row">
          <div class="ctrl">
            <span><img src="assets/img/map_pin.svg" alt="icon"/></span>
            <select id="from">
              <option value="0" selected disabled hidden>Хаанаас</option>
              <option value="1">CU</option>
              <option value="2">GS25</option>
              <option value="3">GL Burger</option>
              <option value="4">Зөгийн үүр зоогийн газар</option>
              <option value="5">Дэлгэрэх</option>
            </select>
          </div>

          <span><img src="assets/img/arrow.svg" alt="icon"/></span>

          <div class="ctrl">
            <span><img src="assets/img/map_pin.svg" alt="icon"/></span>
            <select id="to">
              <option value="" selected disabled hidden>Хаашаа</option>
              <option>МУИС 1-р байр</option>
              <option>МУИС 2-р байр</option>
              <option>МУИС 3-р байр</option>
              <option>МУИС 4-р байр</option>
            </select>
          </div>

          <date-time-picker></date-time-picker>
        </div>

        <div class="bottom-row">
          <div class="ctrl wide">
            <span><img src="assets/img/fork.svg" alt="icon" /></span>
            <select id="what">
              <option value="" selected disabled hidden>Юуг</option>

              <optgroup label="🥘 Идэх юм">
                <option>Кимбаб</option>
                <option>Бургер</option>
                <option>Бууз</option>
                <option>Салад</option>
              </optgroup>

              <optgroup label="🥤 Уух юм">
                <option>Кола 0.5л</option>
                <option>Хар цай</option>
                <option>Кофе</option>
                <option>Жүүс 0.33л</option>
              </optgroup>
            </select>
          </div>
        </div>

        <sh-cart class="cart"></sh-cart>

        <div class="top-row">
          <button class="btn btn--accent order-btn">Захиалах</button>
        </div>
      </section>

      <offers-list id="offers"></offers-list>
      <offer-modal></offer-modal>

      <div id="confirm-modal" class="modal hidden">
        <div class="modal-content">
          <h3>Захиалга баталгаажуулах уу?</h3>
          <p id="confirm-text"></p>
          <div class="modal-actions">
            <button id="cancel-order" class="btn btn--gray">Цуцлах</button>
            <button id="confirm-order" class="btn btn--accent">Баталгаажуулах</button>
          </div>
        </div>
      </div>
    `;
  }

  setupOrderLogic() {
    const orderBtn = this.querySelector('.order-btn');
    if (!orderBtn) return;

    const fromSel = this.querySelector('#from');
    const toSel = this.querySelector('#to');
    const whatSel = this.querySelector('#what');
    const cart = this.querySelector('sh-cart');

    orderBtn.addEventListener('click', () => {
      if (!fromSel.value || !toSel.value) {
        return;
      }

      const activeOrder = {
        from: fromSel.options[fromSel.selectedIndex].text,
        to: toSel.options[toSel.selectedIndex].text,
        item: whatSel.value ? whatSel.options[whatSel.selectedIndex].text : 'Сонгогдоогүй',
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('activeOrder', JSON.stringify(activeOrder));
      localStorage.setItem('orderStep', '0');

      // Cart-ыг offer-рүү харуулах
      const summary = cart && cart.getSummary ? cart.getSummary() : { items: [], total: 0 };
      const subList = summary.items.map((i) => `${i.name} ×${i.qty}`);
      const offer = {
        thumb: 'assets/img/box.svg',
        title: `${activeOrder.from} → ${activeOrder.to}`,
        meta: this.formatDate(new Date()),
        price: summary.total ? this.formatPrice(summary.total) : '0₮',
        sub: subList.join(', ')
      };

      this.pendingOrder = activeOrder;
      this.pendingOffer = offer;
      this.showConfirmModal(activeOrder, summary);
    });
  }

  formatDate(d) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} • ${hh}:${mi}`;
  }

  formatPrice(n) {
    return Number(n || 0).toLocaleString('mn-MN') + '₮';
  }

  setupConfirmModal() {
    this.confirmModal = this.querySelector('#confirm-modal');
    this.confirmTextEl = this.querySelector('#confirm-text');
    this.cancelBtn = this.querySelector('#cancel-order');
    this.confirmBtn = this.querySelector('#confirm-order');
    if (this.cancelBtn) {
      this.cancelBtn.addEventListener('click', () => this.hideConfirmModal());
    }
    if (this.confirmBtn) {
      this.confirmBtn.addEventListener('click', () => this.confirmOrder());
    }
    if (this.confirmModal) {
      this.confirmModal.addEventListener('click', (e) => {
        if (e.target === this.confirmModal) this.hideConfirmModal();
      });
    }
  }

  showConfirmModal(order, summary) {
    if (!this.confirmModal || !this.confirmTextEl) return;
    const items = summary.items?.length
      ? summary.items.map((i) => `• ${i.name} — ${i.qty} ширхэг`).join('<br>')
      : 'Бараа сонгогдоогүй';
    this.confirmTextEl.innerHTML = `
      <div class="detail-row">
        <strong>Хаанаас:</strong> ${order.from}<br>
        <strong>Хаашаа:</strong> ${order.to}<br>
        <strong>Өдөр:</strong> ${order.createdAt.split('T')[0]}<br>
        <strong>Цаг:</strong> ${new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div class="detail-row">
        <strong>Таны хоол:</strong><br>
        ${items}
      </div>
      <div class="detail-row" style="text-align:center;">
        <strong>Нийт үнэ:</strong> ${summary.total ? this.formatPrice(summary.total) : '0₮'}
      </div>
    `;
    this.confirmModal.classList.remove('hidden');
    this.confirmModal.classList.add('show');
  }

  hideConfirmModal() {
    if (!this.confirmModal) return;
    this.confirmModal.classList.remove('show');
    this.pendingOrder = null;
    this.pendingOffer = null;
  }

  confirmOrder() {
    if (!this.pendingOrder || !this.pendingOffer) {
      this.hideConfirmModal();
      return;
    }
    localStorage.setItem('activeOrder', JSON.stringify(this.pendingOrder));
    localStorage.setItem('orderStep', '0');

    const existingOffers = JSON.parse(localStorage.getItem('offers') || '[]');
    existingOffers.unshift(this.pendingOffer);
    localStorage.setItem('offers', JSON.stringify(existingOffers));

    const offersEl = this.querySelector('#offers');
    if (offersEl && 'items' in offersEl) {
      offersEl.items = existingOffers;
    }

    this.hideConfirmModal();
    location.hash = '#delivery';
  }
}

customElements.define('home-page', HomePage);
