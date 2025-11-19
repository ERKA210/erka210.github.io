class MyDate extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const box = document.createElement("div");
    box.classList.add("box");

    box.innerHTML = `
      <style>
        .box { position: relative; width: 100%; }

        .input {
          width: 100%;
          padding: 0.7rem 1rem;
          border: 1px solid #ddd;
          border-radius: 0.6rem;
          background: #fff;
          cursor: pointer;
          font-size: 1rem;
        }

        .popup {
          position: absolute;
          top: 110%;
          left: 0;
          width: 260px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 0.8rem;
          padding: 1rem;
          display: none;
          z-index: 50;
          box-shadow: 0 8px 28px rgba(0,0,0,0.12);
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .btn {
          padding: 0.2rem 0.6rem;
          background: #f2f2f2;
          border-radius: .4rem;
          cursor: pointer;
        }

        .grid {
          margin-top: .6rem;
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: .3rem;
          text-align: center;
        }

        .day {
          padding: .4rem 0;
          border-radius: .4rem;
          cursor: pointer;
        }

        .day:hover { background: #eee; }

        .selected {
          background: #c90d30;
          color: white;
        }
      </style>

      <div class="input">Огноо сонгох</div>

      <div class="popup">
        <div class="header">
          <div class="btn prev">‹</div>
          <div class="label"></div>
          <div class="btn next">›</div>
        </div>

        <div class="grid"></div>
      </div>
    `;

    this.shadowRoot.appendChild(box);

    this.input = this.shadowRoot.querySelector(".input");
    this.popup = this.shadowRoot.querySelector(".popup");
    this.grid = this.shadowRoot.querySelector(".grid");
    this.label = this.shadowRoot.querySelector(".label");

    this.current = new Date();
    this.selected = null;

    this.render();
  }

  connectedCallback() {
    this.input.addEventListener("click", () => {
      this.popup.style.display = "block";
    });

    document.addEventListener("click", (e) => {
      if (!this.contains(e.target)) this.popup.style.display = "none";
    });

    this.shadowRoot.querySelector(".prev").addEventListener("click", () => {
      this.current.setMonth(this.current.getMonth() - 1);
      this.render();
    });

    this.shadowRoot.querySelector(".next").addEventListener("click", () => {
      this.current.setMonth(this.current.getMonth() + 1);
      this.render();
    });
  }

  render() {
    const y = this.current.getFullYear();
    const m = this.current.getMonth();

    this.label.textContent = `${y} / ${m + 1}`;
    this.grid.innerHTML = "";

    const first = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();

    for (let i = 0; i < first; i++) {
      this.grid.innerHTML += `<div></div>`;
    }

    for (let d = 1; d <= days; d++) {
      const div = document.createElement("div");
      div.classList.add("day");
      div.textContent = d;

      div.onclick = () => {
        this.selected = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        this.input.textContent = this.selected;
        this.popup.style.display = "none";
      };

      this.grid.appendChild(div);
    }
  }
}

customElements.define("my-date", MyDate);
