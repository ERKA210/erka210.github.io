const API = "http://localhost:3000";

class Couriers extends HTMLElement {
  connectedCallback() {
    this.render();
    this.loadCourier();
  }

  async loadCourier() {
    try {
      const cached = localStorage.getItem("activeCourier");
      let courier = cached ? JSON.parse(cached) : null;

      if (!courier) {
        const r = await fetch(`${API}/api/courier/me`);
        if (!r.ok) throw new Error("courier not found");
        courier = await r.json();
        localStorage.setItem("activeCourier", JSON.stringify(courier));
      }

      if (courier) this.setData(courier);
    } catch {
      this.setEmpty();
    }
  }

  render() {
    this.innerHTML = `
      <article class="courier-card">
        <p class="title">Хүргэгчийн мэдээлэл</p>
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

  setData({ name, phone, id, student_id }) {
    const code = student_id || id || "";
    this.innerHTML = `
      <article class="courier-card">
        <p class="title">Хүргэгчийн мэдээлэл</p>
        <div class="delivery">
          <div class="avatar">
            <img src="assets/img/profile.jpg" alt="Хүргэгчийн зураг">
          </div>
          <div class="delivery-info">
            <h3>${this.escape(name || "Хүргэгч")}</h3>
            <p>${phone ? `Утас: ${this.escape(phone)}` : ""}</p>
            <p>${code ? `ID: ${this.escape(code)}` : ""}</p>
          </div>
        </div>
      </article>
    `;
  }

  setEmpty() {
    this.innerHTML = `
      <article class="courier-card">
        <p class="title">Хүргэгчийн мэдээлэл</p>
        <p class="muted">Хүргэгчийн мэдээлэл олдсонгүй.</p>
      </article>
    `;
  }

  escape(s) {
    return String(s || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;");
  }
}

customElements.define("couriers-card", Couriers);
