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
        </div>
        <div class="offer-price">${this.getAttribute('price') || ''}</div>
      </article>
    `;
    this.addEventListener('click', () => {
      const modal = document.querySelector('offer-modal');
      modal.show({
        thumb: this.getAttribute('thumb'),
        title: this.getAttribute('title'),
        meta: this.getAttribute('meta'),
        sub: this.getAttribute('sub'),
        price: this.getAttribute('price')
      });
    });
  }
}

customElements.define('offer-card', OfferCard);

class OffersList extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="offers-container">
        <div class="offers-row"></div>
      </section>
    `;
  }

  set items(list) {
    const row = this.querySelector('.offers-row');
    row.innerHTML = '';
    let content = '';
    list.forEach(item => {
      content += `<offer-card thumb="${item.thumb}" title="${item.title}" meta="${item.meta}" sub="${item.sub}" price="${item.price}" ></offer-card>`;
    });
    row.innerHTML = content;
  }
}
customElements.define('offers-list', OffersList);

// --- data ---
document.addEventListener('DOMContentLoaded', () => {
  const offers = [
    { thumb: 'assets/img/box.svg', title: 'GL burger - 7-р байр 207', meta: '11/21/25 • 14:00', price: '10,000₮', sub: 'Нэмэлт мэдээлэл' },
    { thumb: 'assets/img/tor.svg', title: 'CU - 8-р байр 209', meta: '11/21/25 • 14:00', price: '5,000₮', sub: 'Нэмэлт мэдээлэл' },
    { thumb: 'assets/img/box.svg', title: 'GL burger - 7-р байр 207', meta: '11/21/25 • 14:00', price: '10,000₮', sub: 'Нэмэлт мэдээлэл' },
    { thumb: 'assets/img/box.svg', title: 'GL burger - 7-р байр 207', meta: '11/21/25 • 14:00', price: '10,000₮', sub: 'Нэмэлт мэдээлэл' },
    { thumb: 'assets/img/box.svg', title: 'GL burger - 7-р байр 207', meta: '11/21/25 • 14:00', price: '10,000₮', sub: 'Нэмэлт мэдээлэл' },
    { thumb: 'assets/img/box.svg', title: 'GL burger - 7-р байр 207', meta: '11/21/25 • 14:00', price: '10,000₮', sub: 'Нэмэлт мэдээлэл' },
  ];

  localStorage.setItem('offers', JSON.stringify(offers));
  const offerList = document.querySelector('#offers');
  if (offerList) {
    offerList.items = offers;
  }
});
