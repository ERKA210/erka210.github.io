class Order extends HTMLElement {
    constructor(){
        super();
    }

    connectedCallback(){
        this.header = this.getAttribute("header") ?? "header";
        this.detail = this.getAttribute("detail") ?? "Tailbar baihgui";
        this.render();
    }

    render(){
        this.innerHTML = `
        <div class="order-card">
            <div class="order-info">
                <h3>${this.header}</h3>
                <p>${this.detail}</p>
            </div>
            <button class="view-btn">-></button>
        </div>
        `;
        
    }

    disconnectedCallback(){}

    attributeChangedCallback(name, oldVal, newVal) {
    }

    adoptedCallback() {
    }

}

window.customElements.define('d-orders', Order);