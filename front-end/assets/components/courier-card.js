import { apiFetch } from "../api_client.js";
import { escapeAttr } from "./escape-attr.js";

class Courier extends HTMLElement {
  connectedCallback() {
    this.setEmpty();
  }

  setData({ name, phone, student_id, id }) {
    console.log("Courier data:", { name, phone, student_id, id });
    
    this.innerHTML = `
      <article class="courier-card">
        <div class="delivery">
          <img src="assets/img/profile.jpg" alt="Хүргэгчийн зураг">
          <div class="courier-info">
            <h3>Нэр: ${escapeAttr(name || "Хүргэгч")}</h3>
            <p>Утас: ${escapeAttr(phone)}</p>
            <p>ID: ${escapeAttr(student_id)}</p>
          </div>
        </div>
      </article>
    `;
  }

  setEmpty() {
    this.innerHTML = `
      <article class="courier-card">
        <p class="muted">Хүргэгч хүлээж аваагүй байна.</p>
      </article>
    `;
  }
  
}

customElements.define("courier-card", Courier);