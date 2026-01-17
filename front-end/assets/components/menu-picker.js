import { apiFetch } from "../api_client.js";

class MenuPicker extends HTMLElement {
  connectedCallback() {
    this.render();
    this.elements();
  }

  render() {
    this.innerHTML = `
      <div class="ctrl wide">
        <select id="menu">
          <option value="" disabled selected hidden>Юуг</option>
        </select>
      </div>
    `;
  }

  elements() {
    this.menuSel = this.querySelector("#menu");
  }

  async loadMenu(fromPlaceId) {
    if (!fromPlaceId) return;

    const res = await apiFetch(`/api/menus/${fromPlaceId}`);
    if (!res.ok) return;

    const items = (await res.json()).menu_json || [];
    this.menuSel.innerHTML =
      `<option value="" disabled selected hidden>Юуг</option>` +
      items.map(i =>
        `<option value="${i.id}" data-price="${i.price}">
          ${i.name} — ${i.price}₮
        </option>`
      ).join("");
  }

  getValue() {
    const opt = this.menuSel.selectedOptions[0];
    return opt ? {
      id: opt.value,
      name: opt.textContent,
      price: Number(opt.dataset.price || 0)
    } : null;
  }
}

customElements.define("menu-picker", MenuPicker);