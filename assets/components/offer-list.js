class OfferModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        dialog {
          border: none;
          border-radius: 10px;
          padding: 1.5rem;
          max-width: 400px;
          width: 90%;
        }

        dialog::backdrop {
          background: rgba(0,0,0,0.5);
        }

        .modal-content {
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
          max-width: 100px;
          margin-left: 1rem;
        }

        .information {
          display: flex;
          gap: 1rem;
        }

        .delete{
          background: #fff;
          color: #484646ff;
          border-radius: 8px;
          padding: 0.625rem 1.25rem;
          border: 1px solid #ccc;
          cursor: pointer;
        }

        .confirm{
          padding: 0.625rem 1.25rem;
          background: var(--color-accent, #007aff);
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
        }
      </style>

      <dialog>
        <div class="modal-content">
          <span class="close-btn">&times;</span>

          <div class="information">
            <div>
              <h2 id="title"></h2>
              <p id="meta"></p>
            </div>
            <img id="thumb" src="" alt="thumb"/>
          </div>

          <div>Барааны жагсаалт:</div>
          <p id="sub"></p>
          <p id="price"></p>

          <button class="delete">Устгах</button>
          <button class="confirm">Хүргэх</button>
        </div>
      </dialog>
    `;

    this.dialog = this.shadowRoot.querySelector("dialog");

    // Close button
    this.shadowRoot.querySelector(".close-btn").addEventListener("click", () => {
      this.dialog.close();
    });
  }

  show(data) {
    this.shadowRoot.getElementById("thumb").src = data.thumb || "";
    this.shadowRoot.getElementById("title").textContent = data.title || "";
    this.shadowRoot.getElementById("meta").textContent = data.meta || "";

    this.shadowRoot.getElementById("sub").innerHTML =
      (data.sub || [])
        .map(e => `<div>${e.name}: ${e.price}</div>`)
        .join("");

    this.shadowRoot.getElementById("price").textContent =
      `Нийт үнэ: ${data.price}`;

    this.dialog.showModal();
  }
}

customElements.define("offer-modal", OfferModal);