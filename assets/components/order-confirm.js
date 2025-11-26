class OrderForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        s
      </style>

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

    this.initElements();
    this.addListeners();
  }

  initElements() {
    this.fromSel = this.shadowRoot.querySelector("#from");
    this.toSel = this.shadowRoot.querySelector("#to");
    const dtPicker = this.shadowRoot.querySelector("date-time-picker").shadowRoot;
    this.dateSel = dtPicker.querySelector("input[type='date']");
    this.timeSel = dtPicker.querySelector("input[type='time']");
    this.orderBtn = this.shadowRoot.querySelector(".order-btn");
    this.modal = this.shadowRoot.querySelector("#confirm-modal");
    this.confirmText = this.shadowRoot.querySelector("#confirm-text");
    this.cancelBtn = this.shadowRoot.querySelector("#cancel-order");
    this.confirmBtn = this.shadowRoot.querySelector("#confirm-order");
  }

  addListeners() {
    this.orderBtn.addEventListener("click", () => this.showConfirmModal());
    this.cancelBtn.addEventListener("click", () => this.modal.classList.add("hidden"));
    this.confirmBtn.addEventListener("click", () => this.addOrder());
  }

  getCartItems() {
    const boxes = document.querySelectorAll(".item-box");
    let items = [];
    boxes.forEach(box => {
      const name = box.querySelector("b").textContent.trim();
      const qtyMatch = box.querySelector("p").innerHTML.match(/(\d+)\s*ширхэг/);
      const qty = qtyMatch ? parseInt(qtyMatch[1]) : 1;
      items.push({ name, qty });
    });
    return items;
  }

  getTotalCartPrice() {
    const totalText = document.querySelector(".total-price").textContent;
    return parseInt(totalText.replace(/[^\d]/g, ""));
  }

  showConfirmModal() {
    const fromSelected = this.fromSel.selectedIndex > 0;
    const toSelected = this.toSel.selectedIndex > 0;
    const hasFood = document.querySelectorAll(".item-box").length > 0;

    if (!fromSelected || !toSelected || !hasFood) {
      alert("Бүх талбаруудыг бөглөнө үү");
      return;
    }

    const from = this.fromSel.options[this.fromSel.selectedIndex].textContent;
    const to = this.toSel.options[this.toSel.selectedIndex].textContent;
    const date = this.dateSel.value;
    const time = this.timeSel.value;

    const items = this.getCartItems();
    const total = this.getTotalCartPrice();

    let itemsHTML = "";
    items.forEach(i => {
      itemsHTML += `<div>• ${i.name} — ${i.qty} ширхэг</div>`;
    });

    this.confirmText.innerHTML = `
      <div><b>Хаанаас:</b> ${from}</div>
      <div><b>Хаашаа:</b> ${to}</div>
      <div><b>Өдөр:</b> ${date}</div>
      <div><b>Цаг:</b> ${time}</div>

      <div style="margin-top: 10px;"><b>Таны хоол:</b></div>
      <div class="item-list">${itemsHTML}</div>

      <div style="margin-top: 10px;">
        <b>Нийт үнэ:</b> ${total.toLocaleString("mn-MN")}₮
      </div>
    `;

    this.modal.classList.remove("hidden");
  }

  addOrder() {
    const items = this.getCartItems();
    const itemsText = items.map(i => `${i.name} (${i.qty}ш)`).join(", ");
    const total = this.getTotalCartPrice();

    const newOrder = {
      thumb: "assets/img/box.svg",
      title: `${this.fromSel.options[this.fromSel.selectedIndex].textContent} → ${this.toSel.options[this.toSel.selectedIndex].textContent}`,
      meta: `${this.dateSel.value} • ${this.timeSel.value}`,
      sub: itemsText,
      price: total.toLocaleString("mn-MN") + "₮",
    };

    let offers = JSON.parse(localStorage.getItem("offers")) || [];
    offers.unshift(newOrder);
    localStorage.setItem("offers", JSON.stringify(offers));

    document.querySelector("#offers").items = offers;

    this.modal.classList.add("hidden");
    alert("Захиалга амжилттай нэмэгдлээ!");
  }
}

customElements.define("order-form", OrderForm);
