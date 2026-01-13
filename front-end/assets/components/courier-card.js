const API = "http://localhost:3000";

class Couriers extends HTMLElement {
  connectedCallback() {
    this.render();
    this.loadCourier();
  }

  async loadCourier() {
    try {
      const me = await fetch(`${API}/api/auth/me`);
      if (me.ok) {
        const payload = await me.json();
        const user = payload?.user || null;
        if (user?.role === "courier") {
          const r = await fetch(`${API}/api/courier/me`);
          if (r.ok) {
            const courier = await r.json();
            if (courier) {
              this.setData(courier);
              return;
            }
          }
        }
        if (user) {
          this.setData(user);
          return;
        }
      }
      this.setEmpty();
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

  setData({ name, phone, courier_id, student_id, studentId, id }) {
    const displayId = courier_id || student_id || studentId || id || "";
    this.innerHTML = `
      <article class="courier-card">
        <div class="delivery">
          <div class="avatar">
            <img src="assets/img/profile.jpg" alt="Хүргэгчийн зураг">
          </div>
          <div class="courier-info">
            <h3>Нэр : ${this.escape(name || "Хүргэгч")}</h3>
            <p>${phone ? `Утас: ${this.escape(phone || "Хүргэгч")}` : ""}</p>
            <p>${displayId ? `ID: ${this.escape(displayId)}` : ""}</p>
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
