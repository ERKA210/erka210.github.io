class HomePage extends HTMLElement {
  connectedCallback() {
    this.render();
    this.setupOrderLogic();
  }

  render() {
    this.innerHTML = `
      <link rel="stylesheet" href="assets/css/index.css" />
      <section class="filter-section">
        <div class="middle-row">
          <div class="ctrl">
            <span><img src="assets/img/map_pin.svg" alt="icon"/></span>
            <select id="from">
              <option value="0" selected disabled hidden>Хаанаас</option>
              <option value="1">CU</option>
              <option value="2">GS25</option>
              <option value="3">GL Burger</option>
              <option value="4">Зөгийн үүр зоогийн газар</option>
              <option value="5">Дэлгэрэх</option>
            </select>
          </div>

          <span><img src="assets/img/arrow.svg" alt="icon"/></span>

          <div class="ctrl">
            <span><img src="assets/img/map_pin.svg" alt="icon"/></span>
            <select id="to">
              <option value="" selected disabled hidden>Хаашаа</option>
              <option>МУИС 1-р байр</option>
              <option>МУИС 2-р байр</option>
              <option>МУИС 3-р байр</option>
              <option>МУИС 4-р байр</option>
            </select>
          </div>

          <date-time-picker></date-time-picker>
        </div>

        <div class="bottom-row">
          <div class="ctrl wide">
            <span><img src="assets/img/fork.svg" alt="icon" /></span>
            <select id="what">
              <option value="" selected disabled hidden>Юуг</option>

              <optgroup label="🥘 Идэх юм">
                <option>Кимбаб</option>
                <option>Бургер</option>
                <option>Бууз</option>
                <option>Салад</option>
              </optgroup>

              <optgroup label="🥤 Уух юм">
                <option>Кола 0.5л</option>
                <option>Хар цай</option>
                <option>Кофе</option>
                <option>Жүүс 0.33л</option>
              </optgroup>
            </select>
          </div>
        </div>

        <sh-cart class="cart"></sh-cart>

        <div class="top-row">
          <button class="btn btn--accent order-btn">Захиалах</button>
        </div>
      </section>

      <offers-list id="offers"></offers-list>
      <offer-modal></offer-modal>

      <div id="confirm-modal" class="modal hidden">
        <div class="modal-content">
          <h3>Захиалга баталгаажуулах уу?</h3>
          <p id="confirm-text"></p>
          <div class="modal-actions">
            <button id="cancel-order" class="btn btn--gray">Цуцлах</button>
            <button id="confirm-order" class="btn btn--accent">Баталгаажуулах</button>
          </div>
        </div>
      </div>
    `;
  }

  setupOrderLogic() {
    const orderBtn = this.querySelector('.order-btn');
    if (!orderBtn) return;

    const fromSel = this.querySelector('#from');
    const toSel = this.querySelector('#to');
    const whatSel = this.querySelector('#what');

    orderBtn.addEventListener('click', () => {
      if (!fromSel.value || !toSel.value || !whatSel.value) {
        alert('Хаанаас, хаашаа, юуг гэсэн талбаруудыг бөглөнө үү.');
        return;
      }

      const activeOrder = {
        from: fromSel.options[fromSel.selectedIndex].text,
        to: toSel.options[toSel.selectedIndex].text,
        item: whatSel.options[whatSel.selectedIndex].text,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('activeOrder', JSON.stringify(activeOrder));
      localStorage.setItem('orderStep', '0');

      location.hash = '#delivery';
    });
  }
}

customElements.define('home-page', HomePage);
