class OfferModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        .modal {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          justify-content: center;
          align-items: center;
          z-index: 10000;
        }
        .modal-content {
          background: #fff;
          padding: 2rem;
          border-radius: 10px;
          max-width: 400px;
          width: 90%;
          position: relative;
        }
        .close-btn {
          position: absolute;
          top: 0.5rem;
          right: 1rem;
          cursor: pointer;
          font-size: 1.5rem;
        }
        img {
          max-width: 100%;
          margin-bottom: 1rem;
        }
        .delete{
          background: #fff;
          color: #484646ff;
          border-radius: 8px;
          padding: 0.625rem 1.25rem;
          border: none;
        }
        .confirm{
            padding: 0.625rem 1.25rem;
            background: var(--color-accent);
            color: #fff;
            border: none;
            border-radius: var(--radius);
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            white-space: nowrap;}
          .information{
          display: flex;
          wrapper; wrap;
          }

      </style>
      <div class="modal">
        <div class="modal-content">
          <span class="close-btn">&times;</span>
          <div class="information">
          <div>
          <h2 id="title"></h2>
          <p id="meta"></p>
          </div>
          <img id="thumb" src="" alt="thumb"/>
          </div>
          <div>Барааны жагсаалт: </div>
          <p id="sub"></p>
          <p id="price"></p>
          <button class="delete">Устгах</button>
          <button class="confirm">Хүргэх</button>
        </div>
      </div>
    `;

    this.modal = this.shadowRoot.querySelector('.modal');
    this.shadowRoot.querySelector('.close-btn').addEventListener('click', () => {
      this.modal.style.display = 'none';
    });
  }

  show(data) {
    this.shadowRoot.getElementById('thumb').src = data.thumb || '';
    this.shadowRoot.getElementById('title').textContent = data.title || '';
    this.shadowRoot.getElementById('meta').textContent = data.meta || '';
    this.shadowRoot.getElementById('sub').innerHTML = data.sub.map(e=>`<div>${e.name}: ${e.price}</div>`).join('') || '',
    this.shadowRoot.getElementById('price').textContent =  `Нийт үнэ: ${data.price}` || '';
    this.modal.style.display = 'flex';
  }
}

customElements.define('offer-modal', OfferModal);
