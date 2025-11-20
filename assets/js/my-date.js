class DateTimePicker extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._timer = null;
  }

  connectedCallback() {
    this.render();
    this.updateToNow();     
    this.startAutoUpdate(); 
  }

  disconnectedCallback() {
    clearInterval(this._timer); 
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
      @import url(/assets/css/style.css);
        :root {
          display: block;
          width: 100%;
        }
        .date-time-picker {
          display: flex;
          gap: 10px;
          width: 100%;
        }
        .wrapper {
          display: flex;
          gap: 10px;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 8px;
          transition: .25s;
          background: #fff;
          width: 100%;
        }

        input {
          border: none;
          outline: none;
          background: transparent;
          width: 100%;
          font-size: var(--font-size-base, 14px);
        }

        /* Focus эффект — wrapper хүрээ өнгө сольдог */
        .wrapper:has(input:focus) {
          border-color: var(--color-accent, #d00);
          box-shadow: 0 0 0 0.15rem rgba(201, 13, 48, 0.18);
        }

        input[type="date"],
        input[type="time"] {
          accent-color: var(--color-accent, #d00);
        }


        .wrapper.wide {
          flex: 1 1 100%;
        }
      </style>
      <div class="date-time-picker">
      <div class="wrapper">
        <input class="date" type="date">
       </div>
      <div class="wrapper">
        <input class="time" type="time">
      </div>
      </div>
     
      
    `;
  }

  updateToNow() {
    const dateEl = this.shadowRoot.querySelector(".date");
    const timeEl = this.shadowRoot.querySelector(".time");

    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");

    const hh = String(now.getHours()).padStart(2, "0");
    const mins = String(now.getMinutes()).padStart(2, "0");

    dateEl.value = `${yyyy}-${mm}-${dd}`;
    timeEl.value = `${hh}:${mins}`;
  }

  startAutoUpdate() {
    this._timer = setInterval(() => {
      this.updateToNow();
    }, 1000 * 30); 
  }

  get value() {
    const d = this.shadowRoot.querySelector(".date").value;
    const t = this.shadowRoot.querySelector(".time").value;
    return `${d} • ${t}`;
  }
}

customElements.define("date-time-picker", DateTimePicker);