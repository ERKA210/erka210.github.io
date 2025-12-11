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
    this.confirmBtn.addEventListener('click', () => this.close());
  }

  show(data) {
    if (!this.modal) return;
    this.thumbEl.src = data.thumb || '';
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
    this.modal.classList.add('open');
  }

  close() {
    if (this.modal) this.modal.classList.remove('open');
  }
}

customElements.define('offer-modal', OfferModal);
