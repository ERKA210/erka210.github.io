class OrderForm extends HTMLElement {
  connectedCallback() {
    const orderBtn = this.querySelector('.order-btn');
    if (!orderBtn) return;

    this._fromSel = this.querySelector('#from');
    this._toSel   = this.querySelector('#to');
    this._whatSel = this.querySelector('#what');

    orderBtn.addEventListener('click', () => this.handleOrder());
  }

  handleOrder() {
    const fromSel = this._fromSel;
    const toSel   = this._toSel;
    const whatSel = this._whatSel;

    if (!fromSel || !toSel || !whatSel) {
      console.warn('OrderForm: select-үүд олдсонгүй');
      return;
    }

    if (!fromSel.value || !toSel.value || !whatSel.value) {
      alert('Хаанаас, хаашаа, юуг гэсэн талбаруудыг бөглөнө үү.');
      return;
    }

    const activeOrder = {
      from: fromSel.options[fromSel.selectedIndex].text,
      to:   toSel.options[toSel.selectedIndex].text,
      item: whatSel.options[whatSel.selectedIndex].text,
      createdAt: new Date().toISOString()
    };

    fetch("/api/active-order", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: activeOrder }),
    }).finally(() => {
      window.location.hash = "#delivery";
    });
  }
}

customElements.define('order-form', OrderForm);
