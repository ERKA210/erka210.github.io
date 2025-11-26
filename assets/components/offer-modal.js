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
      </style>
      <div class="modal">
        <div class="modal-content">
          <span class="close-btn">&times;</span>
          <img id="thumb" src="" alt="thumb"/>
          <h2 id="title"></h2>
          <p id="meta"></p>
          <p id="sub"></p>
          <p id="price"></p>
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
    this.shadowRoot.getElementById('sub').textContent = data.sub || '';
    this.shadowRoot.getElementById('price').textContent = data.price || '';
    this.modal.style.display = 'flex';
  }
}

customElements.define('offer-modal', OfferModal);
