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
        .wrapper {
          display: flex;
          gap: 10px;
        }
        input {
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #ccc;
          font-size: 14px;
          width: 100%;
          font-family: inherit;
        }
      </style>

      <div class="wrapper">
        <input class="date" type="date">
        <input class="time" type="time">
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