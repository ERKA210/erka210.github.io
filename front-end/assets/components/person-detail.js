class PersonDetail extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.title=this.getAttribute("title") ?? "";
        this.type=this.getAttribute("type") ?? "medium";

        this.render();

        this.handleUserUpdated = this.loadData.bind(this);
        window.addEventListener("user-updated", this.handleUserUpdated);
        this.loadData();
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
      const orderCustomer = this.orderCustomer || null;
      const rawName = orderCustomer?.name || "Чигцалмаа";
      const name = this.normalizeName(rawName);
      const phone = orderCustomer?.phone || "99001234";
      const displayId = orderCustomer?.studentId || "23b1num0245";
      const avatar = orderCustomer?.avatar || "assets/img/profile.jpg";

      this.innerHTML=`
        <p style="font-weight: bold; font-size: 1rem;">${this.title}</p>
        <div class="delivery ${this.type=="medium" ? "" : "big"}">
          <img src="${this.escape(avatar)}" alt="Захиалагчийн зураг">
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

    normalizeName(value) {
      const raw = String(value || "").trim();
      if (!raw) return "Чигцалмаа";
      const tokens = raw.split(/\s+/).filter((t) => t && t.length > 1);
      return tokens.length ? tokens.join(" ") : raw;
    }

    async loadData() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          this.currentUser = data?.user || null;
        } else {
          this.currentUser = null;
        }
      } catch (e) {
        this.currentUser = null;
      }

      try {
        const res = await fetch("/api/active-order");
        if (res.ok) {
          const data = await res.json();
          this.orderCustomer = data?.order?.customer || null;
        } else {
          this.orderCustomer = null;
        }
      } catch (e) {
        this.orderCustomer = null;
      }

      this.render();
    }
}

window.customElements.define('person-detail', PersonDetail);
