class Couriers extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  setData({ name, phone, id }) {
    this.innerHTML = `
      <article>
        <p style="font-weight:bold;font-size:1.5rem;">Хүргэгчийн мэдээлэл</p>
        <div class="delivery">
          <img src="assets/img/profile.jpg" alt="Хүргэгчийн зураг">
          <div class="delivery-info">
            <h3>Нэр: ${name}</h3>
            <p>Утас: ${phone}</p>
            <p>ID: ${id}</p>
          </div>
        </div>
      </article>
    `;
  }

  render() {
    this.innerHTML = `<article><p>Хүргэгчийн мэдээлэл</p></article>`;
  }
}

fetch(`${API}/api/courier/me`)
  .then(r => r.json())
  .then(courier => {
    if (!courier) return;
    const courierCard = document.querySelector("couriers-card");
    courierCard?.setData(courier);
  });
  
customElements.define("couriers-card", Couriers);