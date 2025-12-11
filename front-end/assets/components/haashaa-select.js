class ToSelect extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }
    
    connectedCallback() {
        this.render();
        this.addEvent();
    }
    render() {
        this.shadowRoot.innerHTML = `
      <style>
        @import url(/assets/css/style.css);
        .ctrl{
          position: relative;
          display:flex; 
          align-items:center; 
          gap:0.5rem;
          height: 2.75rem;                 
          padding: 0 0.75rem; 
          width: 100%;            
          min-width: 10rem;                
          border: 0.0625rem solid var(--color-border);
          border-radius: var(--radius);
          background:#fff;
          flex: 1 1 10rem;
        }

          .ctrl select{
              width: 100%;
              height: 100%;
              border: none;
              outline: none;
              background: transparent;
              border-radius: var(--radius);
              font-size: var(--font-size-base);
              cursor: pointer;

          }
            .ctrl:has(select:focus) {
                border-color: var(--color-accent);
                box-shadow: 0 0 0 .15rem rgba(201, 13, 48, .18);
              }
            .ctrl select:invalid { color: var(--color-muted); }
            .ctrl select::-ms-expand { display: none; }
            .ctrl input{
              border:none; 
              outline:none; 
              background:transparent;
              width:100%;   
              height:100%; 
              font-size: var(--font-size-base);
            }   
            select,
              input[type="date"],
              input[type="time"] {
                accent-color: var(--color-accent);
                
              }
      </style>
      <div class="ctrl">    
      <span>
      <img src="assets/img/map_pin.svg" alt="icon"/>
      </span>
        <select id="to" >
          <option value="0" selected disabled hidden>Хаашаа</option>
          <option value="location1">МУИС 1-р байр</option>
          <option value="location2">МУИС 2-р байр</option>
          <option value="location3">МУИС 3-р байр</option>
          <option value="location4">МУИС 4-р байр</option>
          <option value="location5">МУИС 5-р байр</option>
          <option value="location6">МУИС 6-р байр</option>
          <option value="location7">МУИС 7-р байр</option>
          <option value="location8">МУИС 8-р байр</option>
          <option value="location10">МУИС 10-р байр</option>
        </select>
      </div>
    `;
    }

    addEvent() {
        const selectElement = this.shadowRoot.querySelector("select");
        selectElement.addEventListener("change", (event) => {
            const selectedValue = event.target.value;
            this.dispatchEvent(new CustomEvent("location-changed", {
                detail: { location: selectedValue },
                bubbles: true,
                composed: true
            }));
        });
    }
}

customElements.define("haashaa-select", ToSelect);