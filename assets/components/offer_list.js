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
            let content='';
            list.forEach(item => {
              content+=`<offer-card thumb="${item.thumb}" title="${item.title}" meta="${item.meta}" price="${item.price}"></offer-card>`;
            });
            row.innerHTML = content;
          }
        }
customElements.define('offers-list', OffersList);

// --- data ---
        document.addEventListener('DOMContentLoaded', ()=>{
          const offers = [
            { thumb: 'assets/img/box.svg', title: 'GL burger · 7-р байр 207', meta: '2.6км • 20мин', price: '10,000₮' },
            { thumb: 'assets/img/tor.svg', title: 'CU - 8-р байр 209', meta: '3.2км • 25мин', price: '5,000₮' },
            { thumb: 'assets/img/tor.svg', title: 'GL burger - 7-р байр 209', meta: '2.4км • 22мин', price: '10,000₮' },
            { thumb: 'assets/img/box.svg', title: 'CU - 9-р байр 209', meta: '3.8км • 28мин', price: '5,000₮' },
            { thumb: 'assets/img/box.svg', title: 'CU - 9-р байр 209', meta: '3.8км • 28мин', price: '5,000₮' },
            { thumb: 'assets/img/box.svg', title: 'CU - 9-р байр 209', meta: '3.8км • 28мин', price: '5,000₮' },
            { thumb: 'assets/img/box.svg', title: 'CU - 9-р байр 209', meta: '3.8км • 28мин', price: '5,000₮' },
            { thumb: 'assets/img/box.svg', title: 'CU - 9-р байр 209', meta: '3.8км • 28мин', price: '5,000₮' },
          ];
          localStorage.setItem('offers', JSON.stringify(offers));
          document.querySelector('#offers').items = offers;
});
