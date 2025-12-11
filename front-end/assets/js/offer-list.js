class OfferCard extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <article class="offer-card">
        <div class="offer-thumb">
          <img src="${this.getAttribute('thumb') || 'assets/img/box.svg'}" alt="icon"/>
        </div>
        <div class="offer-info">
          <div class="offer-title">${this.getAttribute('title') || ''}</div>
          <div class="offer-meta">${this.getAttribute('meta') || ''}</div>
          <div class="offer-sub">${this.getAttribute('sub') || ''}</div>
        </div>
        <div class="offer-price">${this.getAttribute('price') || ''}</div>
      </article>
    `;

    const card = this.querySelector('.offer-card');
    let startX = 0, currentX = 0, isSwiping = false;

    const start = (x) => {
      startX = x;
      isSwiping = true;
      card.style.transition = 'none';
    };

    const move = (x) => {
      if (!isSwiping) return;
      currentX = x - startX;
      card.style.transform = `translateX(${currentX}px)`;
    };

    const end = () => {
      card.style.transition = '0.3s ease';

      if (currentX < -80) {
        card.style.transform = 'translateX(-100%)';
        card.style.opacity = '0.5';

        const orderData = {
          id: Date.now(),
          title: card.querySelector(".offer-title").textContent,
          items: card.querySelector(".offer-meta").textContent,
          price: card.querySelector(".offer-price").textContent,
          time: new Date().toLocaleString()
        };

        let active = JSON.parse(localStorage.getItem("activeOrders")) || [];
        active.push(orderData);
        localStorage.setItem("activeOrders", JSON.stringify(active));

        setTimeout(() => { window.location.href = "/delivery.html"; }, 200);

      } else if (currentX > 80) {
        card.style.transform = 'translateX(100%)';
        card.style.opacity = '0.5';
        setTimeout(() => card.remove(), 200);
      } else {
        card.style.transform = 'translateX(0)';
      }

      isSwiping = false;
      startX = 0;
      currentX = 0;
    };

    card.addEventListener('touchstart', e => start(e.touches[0].clientX));
    card.addEventListener('touchmove', e => move(e.touches[0].clientX));
    card.addEventListener('touchend', end);

    card.addEventListener('mousedown', e => start(e.clientX));
    document.addEventListener('mousemove', e => isSwiping && move(e.clientX));
    document.addEventListener('mouseup', end);
  }
}
customElements.define('offer-card', OfferCard);


class OffersList extends HTMLElement {
  constructor() {
    super();
    this._items = [];
  }

  connectedCallback() {
    this.render();
  }

  set items(list) {
    this._items = list;
    this.render();  
  }

  render() {
    this.innerHTML = `
      <section class="offers-container">
        <div class="offers-row">
          ${
            this._items.length === 0 
              ? `<p style="text-align:center;opacity:0.6;">Одоогоор offer алга</p>`
              : this._items.map(item => `
                <offer-card 
                  thumb="${item.thumb}" 
                  title="${item.title}" 
                  meta="${item.meta}" 
                  price="${item.price}">
                </offer-card>
              `).join('')
          }
        </div>
      </section>
    `;
  }
}

customElements.define('offers-list', OffersList);


document.addEventListener('DOMContentLoaded', () => {
  let offers = JSON.parse(localStorage.getItem("offers")) || [];

  function parseMeta(meta) {
    if (!meta) return null;

    const [datePart, timePart] = meta.split("•").map(s => s.trim());
    if (!datePart || !timePart) return null;

    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute] = timePart.split(":").map(Number);

    return new Date(year, month - 1, day, hour, minute);
  }

  function isExpired(meta) {
    const d = parseMeta(meta);
    if (!d) return false;
    return d < new Date();
  }

  const validOffers = offers.filter(o => !isExpired(o.meta));

  localStorage.setItem("offers", JSON.stringify(validOffers));

  document.querySelector('#offers').items = validOffers;
});