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
      const subRaw = this.getAttribute('sub');
      let sub = [];
        try {
          sub = JSON.parse(subRaw);  
        } catch (e) {
          sub = []; 
        }
      modal.show({
        thumb: this.getAttribute('thumb'),
        title: this.getAttribute('title'),
        meta: this.getAttribute('meta'),
        sub,
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
      const thumb = item.thumb || 'assets/img/box.svg';
      const title = item.title || '';
      const meta = item.meta || '';
      const price = item.price || '';
      content += `<offer-card thumb="${thumb}" title="${title}" meta="${meta}" sub='${JSON.stringify(item.sub || [])}' price="${price}" ></offer-card>`;
    });
    row.innerHTML = content;
  }
}
customElements.define('offers-list', OffersList);

// Helper function to parse date from meta string
function parseMetaDate(metaString) {
  // Format: "11/21/25 • 14:00"
  try {
    const parts = metaString.split('•');
    if (parts.length < 2) return null;
    
    const datePart = parts[0].trim(); // "11/21/25"
    const timePart = parts[1].trim(); // "14:00"
    
    const [month, day, year] = datePart.split('/');
    const [hours, minutes] = timePart.split(':');
    
    // Convert 2-digit year to 4-digit year (assuming 2000s)
    const fullYear = 2000 + parseInt(year, 10);
    
    return new Date(fullYear, month - 1, day, hours, minutes);
  } catch (e) {
    console.error('Error parsing date from meta:', e, metaString);
    return null;
  }
}

// Helper function to check if offer is expired
function isOfferExpired(offer) {
  if (!offer.meta) return true; // No expiration date means expired
  
  const expirationDate = parseMetaDate(offer.meta);
  if (!expirationDate) return true; // Invalid date means expired
  
  const currentDate = new Date();
  
  // Compare expiration date with current date
  return expirationDate < currentDate;
}

// --- data ---
document.addEventListener('DOMContentLoaded', () => {
  
  const seedOffers = [
    { 
      thumb: 'assets/img/box.svg', 
      title: 'GL burger - 7-р байр 207', 
      meta: '11/21/25 • 14:00', 
      price: '10,000₮', 
      sub: [
        { name: "Бууз", price: "5000₮" },
        { name: "Сүү", price: "2000₮" }
      ] 
    },
    { 
      thumb: 'assets/img/document.svg', 
      title: 'GL burger - 7-р байр 207', 
      meta: '11/21/25 • 14:00', 
      price: '10,000₮', 
      sub: [
        { name: "Бууз", price: "5000₮" },
        { name: "Сүү", price: "2000₮" }
      ] 
    },
    { 
      thumb: 'assets/img/tor.svg', 
      title: 'GL burger - 7-р байр 207', 
      meta: '11/21/25 • 14:00', 
      price: '10,000₮', 
      sub: [
        { name: "Бууз", price: "5000₮" },
        { name: "Сүү", price: "2000₮" }
      ] 
    },
    { 
      thumb: 'assets/img/tor.svg', 
      title: 'GL burger - 7-р байр 207', 
      meta: '12/31/25 • 22:00', 
      price: '10,000₮', 
      sub: [
        { name: "Бууз", price: "5000₮" },
        { name: "Сүү", price: "2000₮" }
      ] 
    },
  ];

  let offers = [];
  const stored = localStorage.getItem('offers');
  
  if (stored) {
    try {
      offers = JSON.parse(stored) || [];
    } catch (e) {
      offers = [];
    }
  }
  
  // If no stored offers or empty, use seed offers
  if (!Array.isArray(offers) || offers.length === 0) {
    offers = seedOffers;
    localStorage.setItem('offers', JSON.stringify(offers));
  }
  
  // Filter out expired offers
  const nonExpiredOffers = offers.filter(offer => !isOfferExpired(offer));
  
  // If some offers were expired, update localStorage with non-expired offers
  if (nonExpiredOffers.length !== offers.length) {
    localStorage.setItem('offers', JSON.stringify(nonExpiredOffers));
  }
  
  // Display only non-expired offers
  const offerList = document.querySelector('#offers');
  if (offerList) {
    offerList.items = nonExpiredOffers;
  }
});