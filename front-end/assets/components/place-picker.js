import { apiFetch } from "../api_client.js";

class PlacePicker extends HTMLElement {
    constructor() {
        super();
        //implementation
    }

    connectedCallback() {
        //implementation
        this.render();
        this.elements();
        this.loadPlaces();
    }

    disconnectedCallback() {
        //implementation
    }

    render() {
        this.innerHTML = `
         <div class="ctrl">
            <span><img src="assets/img/map_pin.svg" alt="icon" width="16" height="16" /></span>
            <select id="fromPlace">
              <option value="" disabled selected hidden>Хаанаас</option>
            </select>
          </div>

          <span class="arrow-icon"><img src="assets/img/arrow.svg" alt="icon" width="67" height="67" /></span>

          <div class="ctrl">
            <span><img src="assets/img/map_pin.svg" alt="icon" width="16" height="16" /></span>
            <select id="toPlace">
              <option value="" disabled selected hidden>Хаашаа</option>
            </select>
          </div>
          `;
        }
    
    elements() {
    this.fromSel = this.querySelector("#from");
    this.toSel = this.querySelector("#to");
    }
     async loadPlaces() {
    const [fromRes, toRes] = await Promise.all([
      apiFetch("/api/from-places"),
      apiFetch("/api/to-places"),
    ]);

    if (!fromRes.ok || !toRes.ok) return;

    this.fill(this.fromSel, await fromRes.json());
    this.fill(this.toSel, await toRes.json());
  }

    fill(select, items) {
    items.forEach(p => {
      const o = document.createElement("option");
      o.value = p.id;
      o.textContent = p.name;
      select.appendChild(o);
    });
  }

    getValue() {
    return {
      fromId: this.fromSel.value,
      toId: this.toSel.value,
      fromText: this.fromSel.selectedOptions[0]?.textContent || "",
      toText: this.toSel.selectedOptions[0]?.textContent || "",
    };
    }
}

customElements.define('place-picker', PlacePicker);