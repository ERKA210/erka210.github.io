class PlacePicker extends HTMLElement {
    constructor() {
        super();
        //implementation
    }

    connectedCallback() {
        //implementation
        this.render()
    }

    disconnectedCallback() {
        //implementation
    }

    render(){
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
          </div>`
    }

    fromSel = this.querySelector("#fromPlace");
    toSel = this.querySelector("#toPlace");

    async loadData(){
        try {
            const fromRes = await apiFetch("/api/from-places");
            const toRes = await apiFetch("/api/to-places");
            if (!fromRes.ok || !toRes.ok) return;
            const [from, to] = await Promise.all([fromRes.json(), toRes.json()]);
            this.fillPlaceSelect(this.fromSel, from, "Хаанаас", (p) => p.name);
            this.fillPlaceSelect(this.toSel, to, "Хаашаа", (p) => p.name);

        } catch {}
    }

}

window.customElements.define('place-picker', PlacePicker);