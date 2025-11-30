class PersonDetail extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.title=this.getAttribute("title") ?? "";
        this.type=this.getAttribute("type") ?? "medium";

        this.innerHTML=`
        <p style="font-weight: bold; font-size: 1rem;">${this.title}</p>
        <div class="delivery ${this.type=="medium" ? "" : "big"}">
          <img src="assets/img/profile.jpg" alt="Хүргэгчийн зураг">
          <div class="delivery-info">
            <h3>Нэр: Чигцалмаа</h3>
            <p>Утас: 99001234</p>
            <p>ID: 23B1NUM0245</p>
          </div>
        </div>`;

        this.querySelector("div.delivery").addEventListener("click", e=>{

          document.querySelector("numd-deliverycard").addDelivery(this)
        })
    }

    disconnectedCallback() {
    }

    attributeChangedCallback(name, oldVal, newVal) {
    }

    adoptedCallback() {
    }

}

window.customElements.define('person-detail', PersonDetail);