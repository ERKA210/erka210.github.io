class PayPage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="pay">
        <main class="container">
          <section class="orders">
            <h2>Миний захиалга</h2>
            <div class="order-list">
              <div class="order-card">
                <div class="order-info">
                  <h3>GL Burger - 7-р байр 207</h3>
                  <p>XL багц</p>
                  <p>M багц</p>
                  <p>L багц</p>
                  <hr>
                  <p><b>Дүн: 10,000₮</b></p>
                </div>
                <img src="assets/img/tor.svg" alt="hemjee" width="60">
              </div>
            </div>
          </section>
        </main>

        <article>
          <h2>Төлбөр төлөх</h2>
          <div class="bank-options">
            <a href="https://www.khanbank.com/" target="_blank">
              <img src="assets/img/Khan Bank_Logo_0.svg" alt="Хаан банк">
            </a>
            <a href="https://www.golomtbank.com/" target="_blank">
              <img src="assets/img/golomtbank.svg" alt="Голомт банк">
            </a>
            <a href="https://www.tdbm.mn/" target="_blank">
              <img src="assets/img/TDB logo white.png" alt="TDB банк">
            </a>
            <a href="https://www.statebank.mn/" target="_blank">
              <img src="assets/img/Turiinbank.png" alt="Төрийн банк">
            </a>
          </div>
        </article>
      </div>
    `;
  }
}

customElements.define('pay-page', PayPage);
