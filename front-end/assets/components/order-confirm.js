class OrderConfirm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <style>
        .modal {
          position: fixed;
          top: 0; left: 0; right:0; bottom:0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal.hidden { display: none; }
        .modal-content {
          background: #fff;
          padding: 1.5rem;
          border-radius: 8px;
          width: 90%;
          max-width: 400px;
        }
        .buttons {
          margin-top: 1rem;
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
        }
        button {
          padding: 0.5rem 1rem;
          cursor: pointer;
        }
        #confirm-text {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .card-block {
          background: #f8f9fc;
          border: 1px solid #e6eaf2;
          border-radius: 10px;
          padding: 0.75rem 0.85rem;
          color: #1f2937;
        }
        .card-block strong {
          color: #111827;
        }
        .item-list {
          margin-top: 0.35rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        @media (prefers-color-scheme: dark) {
          .modal-content {
            background: #0f172a;
            color: #e5e7eb;
            border: 1px solid #243040;
            box-shadow: 0 22px 60px rgba(0, 0, 0, 0.45);
          }

          #confirm-text {
            color: #e5e7eb;
          }

          .card-block {
            background: #111827;
            border-color: #243040;
            color: #e5e7eb;
          }

          .card-block strong {
            color: #f9fafb;
          }

          button {
            background: #111827;
            color: #e5e7eb;
            border: 1px solid #243040;
          }

          #confirm-order {
            background: var(--color-accent, #c90d30);
            color: #fff;
            border: none;
          }
        }
      </style>

      <div class="modal hidden">
        <div class="modal-content">
          <div id="confirm-text"></div>
          <div class="buttons">
            <button id="cancel-order">Цуцлах</button>
            <button id="confirm-order">Баталгаажуулах</button>
          </div>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    this.modal = this.shadowRoot.querySelector(".modal");
    this.confirmText = this.shadowRoot.querySelector("#confirm-text");
    this.cancelBtn = this.shadowRoot.querySelector("#cancel-order");
    this.confirmBtn = this.shadowRoot.querySelector("#confirm-order");

    // Cancel button
    this.cancelBtn.addEventListener("click", () => {
      this.modal.classList.add("hidden");
    });

    // Confirm button
    this.confirmBtn.addEventListener("click", () => {
      if (!this.currentOrder) return;

      let offers = JSON.parse(localStorage.getItem("offers")) || [];
      offers.unshift(this.currentOrder);
      localStorage.setItem("offers", JSON.stringify(offers));

      document.querySelector("#offers").items = offers;

      this.modal.classList.add("hidden");
      alert("Захиалга амжилттай нэмэгдлээ!");
    });
  }

  open(orderData) {
    const { from, to, date, time, items, total } = orderData;

    let itemsHTML = items.map(i => `<div>• ${i.name} — ${i.qty} ширхэг</div>`).join("");

    this.confirmText.innerHTML = `
      <div class="card-block">
        <div><b>Хаанаас:</b> ${from}</div>
        <div><b>Хаашаа:</b> ${to}</div>
        <div><b>Өдөр:</b> ${date}</div>
        <div><b>Цаг:</b> ${time}</div>
      </div>

      <div class="card-block">
        <div><b>Таны хоол:</b></div>
        <div class="item-list">${itemsHTML}</div>
      </div>

      <div class="card-block">
        <b>Нийт үнэ:</b> ${total.toLocaleString("mn-MN")}₮
      </div>
    `;

    this.currentOrder = {
      thumb: "assets/img/box.svg",
      title: `${from} → ${to}`,
      meta: `${date} • ${time}`,
      sub: items.map(i => `${i.name} (${i.qty}ш)`).join(", "),
      price: total.toLocaleString("mn-MN") + "₮",
    };

    this.modal.classList.remove("hidden");
  }
}

customElements.define("order-confirm", OrderConfirm);
