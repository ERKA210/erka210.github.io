class DateTimePicker extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setDefaultValues();
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
        }
      </style>
      
      <div class="wrapper">
        <input class="date" type="date">
        <input class="time" type="time">
      </div>
    `;
  }

  setDefaultValues() {
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

  get value() {
    const d = this.shadowRoot.querySelector(".date").value;
    const t = this.shadowRoot.querySelector(".time").value;
    return `${d} • ${t}`;
  }
}

customElements.define("date-time-picker", DateTimePicker);