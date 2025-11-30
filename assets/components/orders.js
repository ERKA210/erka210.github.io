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
            <button class="view-btn"><svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24">
  <title>i</title>
  <g id="Complete">
    <g id="expand">
      <g>
        <polyline id="Right-2" data-name="Right" points="3 17.3 3 21 6.7 21" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
        <line x1="10" y1="14" x2="3.8" y2="20.2" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
        <line x1="14" y1="10" x2="20.2" y2="3.8" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
        <polyline id="Right-3" data-name="Right" points="21 6.7 21 3 17.3 3" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
      </g>
    </g>
  </g>
</svg></button>
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