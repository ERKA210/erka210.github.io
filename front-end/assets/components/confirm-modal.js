class ConfirmModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.element_avh();
    this.attach();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          font-family: inherit;
        }
        .modal {
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
        .modal.open { display: flex; }
        .modal-content {
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
        h3 {
          margin: 0;
          font-size: 1.3rem;
          color: #111827;
        }
        p {
          margin: 0;
          color: #374151;
          line-height: 1.45;
        }
        .modal-actions {
          display: flex;
          justify-content: space-between;
          gap: 0.75rem;
          margin-top: 0.75rem;
        }
        .btn {
          border: none;
          background: transparent;
          font: inherit;
          cursor: pointer;
        }
        .btn--gray {
          background: #f9fafb;
          color: #111827;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 0.85rem 1.4rem;
          font-weight: 700;
        }
        .btn--accent {
          background: var(--color-accent);
          color: #fff;
          border-radius: 12px;
          padding: 0.85rem 1.4rem;
          font-weight: 800;
        }
        .detail-row {
          text-align: left;
          background: #f9fafb;
          border-radius: 12px;
          padding: 0.85rem 1rem;
          border: 1px solid #eef2f7;
          color: #1f2937;
          line-height: 1.5;
        }
        .detail-row strong {
          display: inline-block;
          min-width: 4.7rem;
        }
      </style>

      <div class="modal" aria-hidden="true">
        <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <h3 id="confirm-title">Захиалга баталгаажуулах уу?</h3>
          <p id="confirm-text"></p>
          <div class="modal-actions">
            <button id="cancel-order" class="btn btn--gray">Цуцлах</button>
            <button id="confirm-order" class="btn btn--accent">Баталгаажуулах</button>
          </div>
        </div>
      </div>
    `;
  }

  element_avh() {
    this.modal = this.shadowRoot.querySelector(".modal");
    this.confirmTextEl = this.shadowRoot.querySelector("#confirm-text");
    this.cancelBtn = this.shadowRoot.querySelector("#cancel-order");
    this.confirmBtn = this.shadowRoot.querySelector("#confirm-order");
  }

  attach() {
    if (this.cancelBtn) {
      this.cancelBtn.addEventListener("click", () => {
        this.close();
        this.dispatchEvent(new Event("cancel"));
      });
    }
    if (this.confirmBtn) {
      this.confirmBtn.addEventListener("click", () => {
        this.dispatchEvent(new Event("confirm"));
      });
    }
    if (this.modal) {
      this.modal.addEventListener("click", (e) => {
        if (e.target === this.modal) {
          this.close();
          this.dispatchEvent(new Event("cancel"));
        }
      });
    }
  }

 buildBaraa(summary) {
    const list = summary?.items || [];
    if (!list.length) return "Бараа сонгогдоогүй";
    return list.map((i) => `• ${i.name} — ${i.qty} ширхэг`).join("<br>");
  }

  buildBatalgaajiltHtml(order, summary) {
    const d = new Date(order.createdAt);
    const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const day = order.createdAt.split("T")[0];
    const total = summary?.total

    return `
      <div class="detail-row">
        <strong>Хаанаас:</strong> ${order.from}<br>
        <strong>Хаашаа:</strong> ${order.to}<br>
        <strong>Өдөр:</strong> ${day}<br>
        <strong>Цаг:</strong> ${time}
      </div>
      <div class="detail-row">
        <strong>Таны хоол:</strong><br>
        ${this.buildBaraa(summary)}
      </div>
      <div class="detail-row" style="text-align:center;">
        <strong>Нийт үнэ:</strong> ${total}
      </div>
    `;
  }

  open(order, summary) {
    const { modal, text } = this.els || {};
    if (!modal || !text || !order) return;
    text.innerHTML = this.buildBatalgaajiltHtml(order, summary || {});
    modal.classList.add("open");
  }

  close() {
    const { modal } = this.els || {};
    if (!modal) return;
    modal.classList.remove("open");
  }
}

customElements.define("confirm-modal", ConfirmModal);
