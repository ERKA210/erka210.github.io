import { formatPrice, formatMetaFromDate } from "../helper/format-d-ts-p";

class ConfirmModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.elements();
    this.events();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          font-family: inherit;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
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
        #confirm-modal .btn {
          border: none;
          background: transparent;
          font: inherit;
          cursor: pointer;
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
          min-width: 4.7rem;
        }
        #confirm-modal .total-price {
          color: var(--color-accent);
        }
        @media (prefers-color-scheme: dark) {
          #confirm-modal .modal-content {
            background: #0f172a;
            color: #e5e7eb;
            border: 1px solid #243040;
            box-shadow: 0 24px 70px rgba(0,0,0,0.45);
          }
          #confirm-modal h3 {
            color: #f9fafb;
          }
          #confirm-modal p {
            color: #9aa4b2;
          }
          #confirm-modal .btn--gray {
            background: #111827;
            color: #e5e7eb;
            border-color: #243040;
          }
          #confirm-modal .detail-row {
            background: #111827;
            border-color: #243040;
            color: #e5e7eb;
          }
        }
      </style>

      <div id="confirm-modal" hidden>
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

  elements() {
    this.modal = this.shadowRoot.querySelector("#confirm-modal");
    this.confirmTextEl = this.shadowRoot.querySelector("#confirm-text");
    this.cancelBtn = this.shadowRoot.querySelector("#cancel-order");
    this.confirmBtn = this.shadowRoot.querySelector("#confirm-order");
  }

  events() {
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

  open(order, summary) {
    // console.log("confirm modal open", order, summary);
    if (!this.modal || !this.confirmTextEl) return;
    //zahialah button focus buyu keyb nii enter ajilldg bsn umnu n
    this._lastFocus = document.activeElement;

    const items = summary?.items?.length
      ? summary.items.map((i) => `• ${i.name} — ${i.qty} ширхэг`).join("<br>")
      : "Бараа сонгогдоогүй";

    // console.log("summary total", summary?.total);
    const totalText = formatPrice(summary.total ?? 0);

    const when = formatMetaFromDate(order.scheduledAt); 
    const [dayText, timeText] = when ? when.split("•") : ["", ""];

    this.confirmTextEl.innerHTML = `
      <div class="detail-row">
        <strong>Хаанаас:</strong> ${order.from}<br>
        <strong>Хаашаа:</strong> ${order.to}<br>
        <strong>Өдөр:</strong> ${dayText || "-"}<br>
        <strong>Цаг:</strong> ${timeText || "-"}
      </div>
      <div class="detail-row">
        <strong>Таны хоол:</strong><br>
        ${items}
      </div>
      <div class="detail-row" style="text-align:center;">
        <strong>Нийт үнэ:</strong> 
        <span class="total-price">${totalText}</span>
      </div>
    `;
    //show class nemeed hidden attribute arilgana
    this.modal.removeAttribute("hidden");
    this.modal.classList.add("show");
    //confirm button enter,space darh uyd ajilldg bolgsn
    if (this.confirmBtn) this.confirmBtn.focus();
  }

  close() {
    if (!this.modal) return;
    if (this._lastFocus) {
      this._lastFocus.focus();
    }
    this.modal.classList.remove("show");
    this.modal.setAttribute("hidden", "");
  }
}

customElements.define("confirm-modal", ConfirmModal);
