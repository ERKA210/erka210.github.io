class DateTimePicker extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    // 30 sec tutmiin intervald tsag shinechlhd hdglh id huvisgch
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
        :host {
          display: flex;
          gap: 0.5rem;
          flex: 1 1 auto;
        }

        .date-time-picker {
          display: flex;
          gap: 0.5rem;
          width: 100%;
          font-family: var(--font-family);
        }
      
        .wrapper {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0 0.75rem;
          height: 2.75rem;
          border: 0.0625rem solid var(--color-border);
          border-radius: var(--radius);
          transition: all 0.25s ease;
          background: var(--color-bg);
          flex: 1 1 0;
          min-width: 0;
          font-family: var(--font-family);
        }

        input {
          border: none;
          outline: none;
          background: transparent;
          width: 100%;
          font-size: var(--font-size-base, 0.875rem);
          font-family: var(--font-family);
          cursor: pointer;
          color: var(--color-text);
        }

        .wrapper:has(input:focus) {
          border-color: var(--color-accent, #d00);
          box-shadow: 0 0 0 0.15rem rgba(201, 13, 48, 0.18);
        }

        input[type="date"],
        input[type="time"] {
          accent-color: var(--color-accent, #d00);
          background-color: transparent;
        }

        input::-webkit-calendar-picker-indicator {
          cursor: pointer;
        }

        @media (prefers-color-scheme: dark) {
          input[type="date"],
          input[type="time"] {
            color-scheme: dark;
            background-color: var(--color-bg);
          }
        }

        @media (max-width: 54rem) {
          :host {
            gap: 0.5rem;
          }
          
          .date-time-picker {
            gap: 0.5rem;
          }
          
          .wrapper {
            padding: 0 0.625rem;
            gap: 0.375rem;
          }
        }
      </style>
      
      <div class="date-time-picker">
        <div class="wrapper">
          <input class="date" type="date" aria-label="Огноо сонгох">
        </div>
        <div class="wrapper">
          <input class="time" type="time" aria-label="Цаг сонгох">
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
    }, 1000 * 60); 
  }

  get value() {
    const d = this.shadowRoot.querySelector(".date").value;
    const t = this.shadowRoot.querySelector(".time").value;
    return `${d}•${t}`;
  }

  get iso() {
  const d = this.shadowRoot.querySelector(".date").value;
  const t = this.shadowRoot.querySelector(".time").value;
  const dt = new Date(`${d}T${t}:00`);
  return isNaN(dt.getTime()) ? null : dt.toISOString();
}
}

customElements.define("date-time-picker", DateTimePicker);
