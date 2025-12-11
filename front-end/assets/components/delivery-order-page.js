class DeliveryOrderPage extends HTMLElement {
      connectedCallback() {
        this.innerHTML = `
        <section class="orders">
          <offers-list id="offers"></offers-list>

          <h2>Миний захиалга</h2>
          <sh-cart></sh-cart>

          <couriers-card></couriers-card>
        </section>

        <order-progress id="progress"></order-progress>

        <rating-stars max="5" color="orange" size="28px"></rating-stars>
      `;

        // Rating event
        this.querySelector('rating-stars').addEventListener('rate', e => {
          console.log("Үнэлгээ:", e.detail);
        });
      }
    }