const API = "http://localhost:3000";

class Couriers extends HTMLElement {
  connectedCallback() {
    this.render();

    fetch(`${API}/api/courier/me`)
      .then(r => r.json())
      .then(courier => {
        if (!courier) return;
        this.setData(courier); 
      })
      .catch(() => {});
  }

  setData({ name, phone, id, student_id }) {
    const code = student_id || id || "";
    this.innerHTML = `
      <article>
        <p style="font-weight:bold;font-size:1.5rem;">Хүргэгчийн мэдээлэл</p>
        <div class="delivery">
          <img src="assets/img/profile.jpg" alt="Хүргэгчийн зураг">
          <div class="delivery-info">
            <h3>Нэр: ${name}</h3>
            <p>Утас: ${phone}</p>
            <p>ID: ${code}</p>
          </div>
        </div>
      </article>
    `;
  }

  render() {
    this.innerHTML = `<article><p>Хүргэгчийн мэдээлэл</p></article>`;
  }
}

customElements.define("couriers-card", Couriers);
