const API = "http://localhost:3000";

class Couriers extends HTMLElement {
  connectedCallback() {
    this.render();
    this.loadCourier();
  }

  async loadCourier() {
    try {
      const r = await fetch(`${API}/api/courier/me`);
      if (!r.ok) throw new Error("courier not found");
      const courier = await r.json();

      if (courier) this.setData(courier);
    } catch {
      this.setEmpty();
    }
  }

  render() {
    this.innerHTML = `
      <article class="courier-card">
        <div class="delivery loading">
          <div class="avatar skeleton"></div>
          <div class="delivery-info">
            <div class="line skeleton"></div>
            <div class="line skeleton short"></div>
            <div class="line skeleton short"></div>
          </div>
        </div>
      </article>
    `;
  }

  setData({ name, phone, courier_id}) {
    const displayId = courier_id || this.generateDisplayId(name, phone);
    
    this.innerHTML = `
      <article class="courier-card">
        <div class="delivery">
          <div class="avatar">
            <img src="assets/img/profile.jpg" alt="Хүргэгчийн зураг">
          </div>
          <div class="courier-info">
            <h3>Нэр : ${this.escape(name || "Хүргэгч")}</h3>
            <p>${phone ? `Утас: ${this.escape(phone)}` : ""}</p>
            <p>${displayId ? `Хүргэгчийн ID: ${this.escape(displayId)}` : ""}</p>
            ${courier_id ? `<p class="small-text">Бүртгэлийн дугаар: ${this.escape(courier_id)}</p>` : ''}
          </div>
        </div>
      </article>
    `;
  }

  setEmpty() {
    this.innerHTML = `
      <article class="courier-card">
        <p class="muted">Хүргэгчийн мэдээлэл олдсонгүй.</p>
      </article>
    `;
  }

  escape(s) {
    return String(s || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;");
  }

  generateDisplayId(name, phone) {
    if (!name || !phone) return '';
    const namePart = name.substring(0, 3).toUpperCase();
    const phonePart = phone.substring(phone.length - 4);
    return `${namePart}${phonePart}`;
  }
}

customElements.define("couriers-card", Couriers);