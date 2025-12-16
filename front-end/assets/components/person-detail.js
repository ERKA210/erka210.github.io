class PersonDetail extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.title=this.getAttribute("title") ?? "";
        this.type=this.getAttribute("type") ?? "medium";

        this.render();

        this.handleUserUpdated = this.render.bind(this);
        window.addEventListener("user-updated", this.handleUserUpdated);
    }

    disconnectedCallback() {
      if (this.handleUserUpdated) {
        window.removeEventListener("user-updated", this.handleUserUpdated);
      }
    }

    attributeChangedCallback(name, oldVal, newVal) {
    }

    adoptedCallback() {
    }

    render() {
      const name = `${localStorage.getItem("userLastName") || ""} ${localStorage.getItem("userName") || "Чигцалмаа"}`.trim();
      const phone = localStorage.getItem("userPhone") || "99001234";
      const displayId = localStorage.getItem("userDisplayId") || "23b1num0245";

      this.innerHTML=`
        <p style="font-weight: bold; font-size: 1rem;">${this.title}</p>
        <div class="delivery ${this.type=="medium" ? "" : "big"}">
          <img src="assets/img/profile.jpg" alt="Хүргэгчийн зураг">
          <div class="delivery-info">
            <h3>Нэр: ${this.escape(name)}</h3>
            <p>Утас: ${this.escape(phone)}</p>
            <p>ID: ${this.escape(displayId)}</p>
          </div>
        </div>`;

      const deliveryBlock = this.querySelector("div.delivery");
      if (deliveryBlock) {
        deliveryBlock.addEventListener("click", () => {
          const card = document.querySelector("numd-deliverycard");
          if (card && typeof card.addDelivery === "function") {
            card.addDelivery(this);
          }
        });
      }
    }

    escape(s) {
      return String(s || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;");
    }
}

window.customElements.define('person-detail', PersonDetail);
