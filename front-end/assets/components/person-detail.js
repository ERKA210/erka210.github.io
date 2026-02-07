import { escapeAttr } from "../helper/escape-attr.js";

class PersonDetail extends HTMLElement {
    static get observedAttributes() {
        return ["customer"];
    }

    constructor() {
        super();
    }

    connectedCallback() {
        this.title = this.getAttribute("title") ?? "";
        this.type = this.getAttribute("type") ?? "medium";

        if (this.hasAttribute("customer")) {
            try {
                this.orderCustomer = JSON.parse(this.getAttribute("customer"));
            } catch (e) {}
            this.render();
            return;
        }

        this.render();
        window.addEventListener("user-updated", this.loadData);
        this.loadData();
    }

    disconnectedCallback() {
        window.removeEventListener("user-updated", this.loadData);
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (name === "customer" && oldVal !== newVal) {
            try {
                this.orderCustomer = JSON.parse(newVal);
                this.render();
            } catch (e) {}
        }
    }

    adoptedCallback() {
    }

    render() {
        const orderCustomer = this.orderCustomer || null;
        const rawName = orderCustomer?.name || "";
        const name = this.normalizeName(rawName);
        const phone = orderCustomer?.phone || "";
        const displayId = orderCustomer?.studentId || "";
        const avatar = orderCustomer?.avatar || "assets/img/profile.jpg";

        this.innerHTML = `
        <p style="font-weight: bold; font-size: 1rem;">${this.title}</p>
        <div class="delivery ${this.type === "medium" ? "" : "big"}">
          <img src="${escapeAttr(avatar)}" alt="Захиалагчийн зураг">
          <div class="delivery-info">
            <h3>Нэр: ${escapeAttr(name)}</h3>
            <p>Утас: ${escapeAttr(phone)}</p>
            <p>ID: ${escapeAttr(displayId)}</p>
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

    normalizeName(value) {
        const raw = String(value || "").trim();
        const tokens = raw.split(/\s+/).filter((t) => t && t.length > 1);
        return tokens.length ? tokens.join(" ") : raw;
    }

    loadData = async () => {
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
    };
}

window.customElements.define('person-detail', PersonDetail);