class OfferModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.cacheEls();
    this.bindEvents();
  }

  render() {
    this.API = "http://localhost:3000";
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --accent: var(--color-accent, #c90d30);
          --radius: 14px;
          --text: #1f2937;
          --muted: #6b7280;
          font-family: "Roboto", "Poppins", sans-serif;
        }
        .modal {
          position: fixed;
          inset: 0;
          display: none;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(6px);
          z-index: 10000;
          padding: 1rem;
        }
        .modal.open { display: flex; }

        .card {
          background: #fff;
          border-radius: var(--radius);
          width: min(540px, 100%);
          box-shadow: 0 22px 60px rgba(0, 0, 0, 0.18);
          padding: 1.35rem 1.5rem;
          position: relative;
          border: 1px solid rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }

        .title-wrap {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .thumb {
          width: 60px;
          height: 60px;
          border-radius: 14px;
          object-fit: cover;
          background: #f5f6fb;
          box-shadow: inset 0 0 0 1px #eef0f6;
        }

        h2 {
          margin: 0;
          font-size: 1.2rem;
          color: var(--text);
        }

        .meta {
          margin: 0.1rem 0 0;
          color: var(--muted);
          font-size: 0.95rem;
        }

        .close-btn {
          background: transparent;
          border: none;
          font-size: 1.3rem;
          cursor: pointer;
          padding: 0.3rem 0.45rem;
          border-radius: 8px;
          color: var(--muted);
        }
        .close-btn:hover { background: #f3f4f6; }

        .list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }
        .list li {
          background: #f8f9fc;
          border-radius: 10px;
          padding: 0.6rem 0.75rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--text);
          border: 1px solid #eef0f6;
        }
        .list span.price {
          font-weight: 700;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 700;
          font-size: 1rem;
          color: var(--text);
        }
        .price-row .pill {
          background: rgba(201, 13, 48, 0.08);
          color: var(--accent);
          padding: 0.3rem 0.75rem;
          border-radius: 999px;
          font-weight: 800;
        }

        .courier {
          border: 1px solid #eef0f6;
          border-radius: 12px;
          padding: 0.75rem 0.85rem;
          background: #f8f9fc;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 0.7rem;
          align-items: center;
        }
        .courier img {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          object-fit: cover;
          background: #fff;
          border: 1px solid #e5e7eb;
        }
        .courier h4 {
          margin: 0;
          font-size: 1rem;
          color: var(--text);
        }
        .courier p {
          margin: 0.1rem 0 0;
          color: var(--muted);
          font-size: 0.9rem;
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
        }

        button {
          font-weight: 600;
          cursor: pointer;
        }

        .delete {
          background: #fff;
          color: var(--muted);
          border-radius: 10px;
          padding: 0.65rem 1.25rem;
          border: 1px solid #e5e7eb;
        }
        .confirm {
          padding: 0.65rem 1.25rem;
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 700;
          box-shadow: 0 10px 30px rgba(201, 13, 48, 0.25);
          transition: transform 0.15s ease;
        }
        .confirm:hover { transform: translateY(-1px); }

        @media (prefers-color-scheme: dark) {
          :host {
            --text: #e5e7eb;
            --muted: #9aa4b2;
          }

          .card {
            background: #0f172a;
            border-color: #243040;
            box-shadow: 0 22px 60px rgba(0, 0, 0, 0.45);
          }

          .thumb {
            background: #111827;
            box-shadow: inset 0 0 0 1px #243040;
          }

          .close-btn:hover {
            background: #1f2937;
          }

          .list li {
            background: #111827;
            border-color: #243040;
          }

          .courier {
            background: #111827;
            border-color: #243040;
          }

          .courier img {
            background: #0b0f14;
            border-color: #243040;
          }

          .delete {
            background: #111827;
            color: var(--muted);
            border-color: #243040;
          }
        }
      </style>
      <div class="modal">
        <div class="card">
          <header>
            <div class="title-wrap">
              <img class="thumb" id="thumb" alt="">
              <div>
                <h2 id="title"></h2>
                <p class="meta" id="meta"></p>
              </div>
            </div>
            <button class="close-btn" aria-label="Хаах">×</button>
          </header>

          <div>
            <p class="meta" style="margin:0 0 0.4rem;">Барааны жагсаалт</p>
            <ul class="list" id="sub"></ul>
          </div>

          <div class="price-row">
            <span>Нийт үнэ</span>
            <span class="pill" id="price">0₮</span>
          </div>

          <div class="courier" id="courier">
            <img src="assets/img/profile.jpg" alt="courier">
            <div>
              <h4 id="courier-name">Хүргэгч</h4>
              <p id="courier-phone"></p>
              <p id="courier-id"></p>
            </div>
          </div>

          <div class="actions">
            <button class="delete" type="button">Устгах</button>
            <button class="confirm" type="button">Хүргэх</button>
          </div>
        </div>
      </div>
    `;
  }

  cacheEls() {
    this.modal = this.shadowRoot.querySelector('.modal');
    this.card = this.shadowRoot.querySelector('.card');
    this.titleEl = this.shadowRoot.getElementById('title');
    this.metaEl = this.shadowRoot.getElementById('meta');
    this.thumbEl = this.shadowRoot.getElementById('thumb');
    this.subEl = this.shadowRoot.getElementById('sub');
    this.priceEl = this.shadowRoot.getElementById('price');
    this.courierWrap = this.shadowRoot.getElementById('courier');
    this.courierNameEl = this.shadowRoot.getElementById('courier-name');
    this.courierPhoneEl = this.shadowRoot.getElementById('courier-phone');
    this.courierIdEl = this.shadowRoot.getElementById('courier-id');
    this.closeBtn = this.shadowRoot.querySelector('.close-btn');
    this.deleteBtn = this.shadowRoot.querySelector('.delete');
    this.confirmBtn = this.shadowRoot.querySelector('.confirm');
  }

  bindEvents() {
    this.closeBtn.addEventListener('click', () => this.close());
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
    this.deleteBtn.addEventListener('click', () => this.close());
    this.confirmBtn.addEventListener('click', () => this.handleConfirm());
  }

  show(data) {
    if (!this.modal) return;
    this.currentData = data;
    this.thumbEl.src = data.thumb || 'assets/img/box.svg';
    this.thumbEl.alt = data.title || 'offer thumbnail';
    this.titleEl.textContent = data.title || 'Санал';
    this.metaEl.textContent = data.meta || '';
    const sub = Array.isArray(data.sub) ? data.sub : [];
    this.subEl.innerHTML = sub.map((item) => {
      const name = item?.name || '';
      const price = item?.price || '';
      return `<li><span>${name}</span><span class="price">${price}</span></li>`;
    }).join('') || '<li><span>Бараа алга</span><span class="price">-</span></li>';
    this.priceEl.textContent = data.price ? String(data.price) : '0₮';

    this.populateCourier(data);
    this.modal.classList.add('open');
  }

  close() {
    if (this.modal) this.modal.classList.remove('open');
  }

  parseMetaToISO(meta) {
    if (!meta) return null;
    const sanitized = meta.replace('•', '');
    const parsed = Date.parse(sanitized);
    if (!Number.isNaN(parsed)) return new Date(parsed).toISOString();
    return null;
  }

  buildActiveOrder(data) {
    const [fromRaw = '', toRaw = ''] = (data.title || '').split('-').map((s) => s.trim());
    const firstItem = Array.isArray(data.sub) && data.sub.length ? data.sub[0] : null;
    const customerName = this.currentUser?.name || "Чигцалмаа";
    const customerPhone = this.currentUser?.phone || "99001234";
    const customerId = this.currentUser?.student_id || "23b1num0245";
    const customerAvatar = this.currentUser?.avatar || "assets/img/profile.jpg";
    return {
      from: fromRaw,
      to: toRaw,
      item: firstItem?.name || '',
      items: Array.isArray(data.sub) ? data.sub : [],
      total: data.price || '',
      createdAt: this.parseMetaToISO(data.meta) || new Date().toISOString(),
      customer: {
        name: this.normalizeName(customerName),
        phone: customerPhone,
        studentId: customerId,
        avatar: customerAvatar,
      },
    };
  }

  normalizeName(value) {
    const raw = String(value || "").trim();
    if (!raw) return "Чигцалмаа";
    const tokens = raw.split(/\s+/).filter((t) => t && t.length > 1);
    return tokens.length ? tokens.join(" ") : raw;
  }

  async handleConfirm() {
    if (!this.currentData) {
      this.close();
      return;
    }

    await this.fetchCurrentUser();
    const activeOrder = this.buildActiveOrder(this.currentData);
    const added = await this.addToDeliveryCart(this.currentData);
    if (!added) {
      return;
    }
    await this.saveActiveOrder(activeOrder);
    this.removeOfferFromList(this.currentData);

    try {
      const res = await fetch(`${this.API}/api/courier/me`, {
        credentials: "include",
      });

      if (res.ok) {
        const courier = await res.json();
      }
    } catch (e) {
      console.warn('courier fetch failed', e);
    }

    this.close();
    window.dispatchEvent(new Event('order-updated'));
    window.dispatchEvent(new Event('delivery-cart-updated'));
    const cartEl = document.querySelector('delivery-cart');
    if (cartEl && typeof cartEl.load === 'function') {
      cartEl.load();
    }
    if (!document.querySelector('delivery-cart')) {
      location.hash = '#delivery';
    }
  }

  async addToDeliveryCart(data) {
    const title = data.title || '';
    const meta = data.meta || '';
    const price = data.price || '';
    try {
      const res = await fetch("/api/delivery-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          meta,
          price,
          thumb: data.thumb || "assets/img/box.svg",
          sub: Array.isArray(data.sub) ? data.sub : [],
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (String(err.error || "").toLowerCase().includes("unauthorized")) {
          location.hash = "#login";
          return false;
        }
        alert(err.error || "Хүргэлт нэмэхэд алдаа гарлаа");
        return false;
      }
      return true;
    } catch (e) {
      alert("Хүргэлт нэмэхэд алдаа гарлаа");
      return false;
    }
  }

  async saveActiveOrder(order) {
    try {
      await fetch("/api/active-order", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order }),
      });
    } catch (e) {
      // ignore
    }
  }

  async fetchCurrentUser() {
    if (this.currentUser) return this.currentUser;
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) {
        this.currentUser = null;
      } else {
        const data = await res.json();
        this.currentUser = data?.user || null;
      }
    } catch (e) {
      this.currentUser = null;
    }
    return this.currentUser;
  }

  removeOfferFromList(data) {
    const raw = localStorage.getItem('offers');
    if (!raw) return;
    let offers = [];
    try {
      offers = JSON.parse(raw) || [];
    } catch (e) {
      return;
    }
    const key = `${data.title || ''}|${data.meta || ''}|${data.price || ''}`;
    const next = offers.filter((item) => {
      const itemKey = `${item.title || ''}|${item.meta || ''}|${item.price || ''}`;
      return itemKey !== key;
    });
    localStorage.setItem('offers', JSON.stringify(next));
    const offerList = document.querySelector('#offers');
    if (offerList && 'items' in offerList) {
      offerList.items = next;
    }
  }

  async populateCourier(data) {
    if (!this.courierWrap) return;
    let courier = null;
    try {
      const res = await fetch(`${this.API}/api/courier/me`);
      if (res.ok) {
        courier = await res.json();
      }
    } catch (e) {
      courier = null;
    }

    if (courier) {
      this.courierWrap.style.display = 'grid';
      this.courierNameEl.textContent = courier.name || 'Хүргэгч';
      this.courierPhoneEl.textContent = courier.phone ? `Утас: ${courier.phone}` : '';
      this.courierIdEl.textContent = courier.student_id ? `ID: ${courier.student_id}` : '';
    } else {
      this.courierWrap.style.display = 'none';
    }
  }
}

customElements.define('offer-modal', OfferModal);
