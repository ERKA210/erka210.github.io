class FromSelect extends HTMLElement {
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
              padding-right: 1.5rem;
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
              
              .ctrl:has(input[type="time"]:focus){
                  border-color: var(--color-accent);
                  box-shadow: 0 0 0 .15rem rgba(201,13,48,.18);
                }
              .ctrl:has(input[type="date"]:focus){
                  border-color: var(--color-accent);
                  box-shadow: 0 0 0 .15rem rgba(201,13,48,.18);
                }


              .ctrl.wide{ 
                flex: 1 1 100%; 
              }

              select {
                accent-color: var(--color-accent); 
              }
        @media (prefers-color-scheme: dark) {
          img {
            filter: brightness(0) invert(1);
          }
        }
      </style>

      <div class="ctrl">
        <span>
          <img src="assets/img/map_pin.svg" alt="icon"/>
        </span>

        <select id="from">
          <option value="0" selected disabled hidden>Хаанаас</option>
          <option value="1">CU</option>
          <option value="2">GS25</option>
          <option value="3">GL Burger</option>
          <option value="4">Зөгийн үүр зоогийн газар</option>
          <option value="5">Дэлгэрэх</option>
        </select>
      </div>
    `;
  }

  addEvent() {
    const select = this.shadowRoot.querySelector("#from");

    select.addEventListener("change", () => {
      this.dispatchEvent(
        new CustomEvent("from-change", {
          detail: select.value,
          bubbles: true
        })
      );
    });
  }

  get value() {
    return this.shadowRoot.querySelector("#from").value;
  }
}

customElements.define("haanaas-select", FromSelect);
