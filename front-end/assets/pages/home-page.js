import { apiFetch } from "../api_client.js";

class HomePage extends HTMLElement {
  connectedCallback() {
    this.render();
    this.tohiruulahZahialgaBatalgaajilt();
    loadGazruud();
    this.loadHereglegchDb();

    const orderBtn = this.querySelector(".order-btn");
    if (orderBtn) {
      orderBtn.addEventListener("click", () => this.beldehZahialga());
    }
  }

  render() {
    this.innerHTML = `
      <link rel="stylesheet" href="assets/css/index.css" />
      <section class="filter-section">
        <div class="middle-row">
          <div class="ctrl">
            <span><img src="assets/img/map_pin.svg" alt="icon"/></span>
            <select id="fromPlace">
              <option value="" disabled selected hidden>Хаанаас</option>
            </select>
          </div>

          <span><img src="assets/img/arrow.svg" alt="icon"/></span>

          <div class="ctrl">
            <span><img src="assets/img/map_pin.svg" alt="icon"/></span>
            <select id="toPlace">
              <option value="" disabled selected hidden>Хаашаа</option>
            </select>
          </div>

          <date-time-picker></date-time-picker>
        </div>

        <div class="bottom-row">
          <div class="ctrl wide">
            <span><img src="assets/img/fork.svg" alt="icon" /></span>
            <select id="what">
              <option value="" disabled selected hidden>Юуг</option>
            </select>
          </div>
        </div>

        <sh-cart class="cart"></sh-cart>

        <div class="top-row">
          <button class="btn btn--accent order-btn">Захиалах</button>
        </div>
      </section>

      <div class="offers-layout">
        <div class="offers-panel">
          <offers-list id="offers"></offers-list>
        </div>
        <aside class="delivery-cart-panel">
          <delivery-cart></delivery-cart>
        </aside>
      </div>
      <offer-modal></offer-modal>
      <order-confirm></order-confirm>
    `;
  }

  async loadHereglegchDb() {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      await this.tentsvvlehHereglegchMedeelel(userId);
    } catch (e) {
      console.error("kkkkkk:", e);
    }
  }

  async tentsvvlehHereglegchMedeelel(userId) {
    if (!userId) return;
    const res = await apiFetch(`/api/customers/${userId}`);
    if (!res.ok) return;
    const data = await res.json();
    if (data) {
      if (data.name) localStorage.setItem("userName", data.name);
      if (data.phone) localStorage.setItem("userPhone", data.phone);
      localStorage.setItem("userId", data.id);
      if (data.student_id) {
        localStorage.setItem("userDisplayId", data.student_id);
      }
      window.dispatchEvent(new Event("user-updated"));
    }
  }

  avahTovlogdsonISO() {
    const picker = this.querySelector("date-time-picker");
    const dateVal = picker?.shadowRoot?.querySelector(".date")?.value;
    const timeVal = picker?.shadowRoot?.querySelector(".time")?.value;

    if (dateVal && timeVal) {
      const iso = new Date(`${dateVal}T${timeVal}:00`);
      if (!isNaN(iso.getTime())) return iso.toISOString();
    }

    const now = new Date();
    return now.toISOString();
  }

  tohiruulahZahialgaBatalgaajilt() {
    this.orderConfirm = this.querySelector("order-confirm");
  }

  beldehZahialga() {
    const fromSel = this.querySelector("#fromPlace");
    const toSel = this.querySelector("#toPlace");
    const whatSel = this.querySelector("#what");

    if (!fromSel?.value) {
      alert("Хаанаасаа сонгоно уу");
      return;
    }
    if (!toSel?.value) {
      alert("Хаашаагаа сонгоно уу");
      return;
    }

    const cartEl = this.querySelector("sh-cart");
    const cartSummary = cartEl?.avahTovch() || { totalQty: 0, items: [], total: 0, deliveryFee: 0 };

    const itemOpt = whatSel?.selectedOptions?.[0];
    if (cartSummary.totalQty === 0) {
      if (!itemOpt || !itemOpt.value) {
        alert("Юуг (хоол/бараа) сонгоно уу");
        return;
      }
    }
    const fromOptionText = fromSel.selectedOptions[0].textContent || "";
    const parts = fromOptionText.split(" - ");
    const fromName = parts[0] || fromOptionText;
    const fromDetail = parts[1] || "";

    const scheduledAt = this.avahTovlogdsonISO();

    const items =
      cartSummary.totalQty > 0
        ? cartSummary.items.map((it) => ({
            id: it.key || it.name,
            name: it.name,
            price: Number(it.unitPrice ?? it.price ?? 0),
            qty: it.qty,
          }))
        : [{
            id: itemOpt.value,
            name: (itemOpt.textContent || "").split(" — ")[0],
            price: Number(itemOpt.dataset.price || 0),
            qty: 1,
          }];

    const pendingOrder = {
      fromId: fromSel.value,
      toId: toSel.value,
      from: fromName,
      fromDetail,
      to: toSel.selectedOptions[0].textContent,
      createdAt: scheduledAt,
    };

    const pendingOffer = {
      items,
      total: cartSummary.totalQty > 0 ? cartSummary.total : items.reduce((s, it) => s + (it.price * it.qty), 0),
      deliveryFee: cartSummary.totalQty > 0 ? cartSummary.deliveryFee : 500,
      thumb: cartSummary.deliveryIcon || "assets/img/box.svg"
    };
    if (this.orderConfirm && typeof this.orderConfirm.open === "function") {
      this.orderConfirm.open(pendingOrder, pendingOffer);
      return;
    }
    alert("Order confirm component ачаалагдаагүй байна.");
  }
}

async function loadGazruud() {
  const from = await apiFetch(`/api/from-places`).then((r) => r.json());
  const to = await apiFetch(`/api/to-places`).then((r) => r.json());

  const fromSel = document.querySelector("#fromPlace");
  const toSel = document.querySelector("#toPlace");

  fromSel.innerHTML = `<option value="" disabled selected hidden>Хаанаас</option>`;
  toSel.innerHTML = `<option value="" disabled selected hidden>Хаашаа</option>`;

  fromSel.innerHTML += from
    .map(
      (p) =>
        `<option value="${p.id}">${p.name}${p.detail ? " - " + p.detail : ""}</option>`
    )
    .join("");

  toSel.innerHTML += to
    .map((p) => `<option value="${p.id}">${p.name}</option>`)
    .join("");
}

loadGazruud();

document.addEventListener("change", async (e) => {
  if (e.target.id !== "fromPlace") return;

  const placeId = e.target.value;

  const res = await apiFetch(`/api/menus/${placeId}`).then((r) => r.json());

  const whatSel = document.querySelector("#what");
  if (!whatSel) return;

  const items = Array.isArray(res.menu_json) ? res.menu_json : [];

  const foods = items.filter((i) => i.category === "food");
  const drinks = items.filter((i) => i.category === "drink");

  whatSel.innerHTML = `<option value="" disabled selected hidden>Юуг</option>`;

  if (foods.length) {
    const og = document.createElement("optgroup");
    og.label = "Идэх юм";
    foods.forEach((item) => {
      const opt = document.createElement("option");
      opt.value = item.id;
      opt.dataset.price = item.price;
      opt.dataset.name = item.name;
      opt.textContent = `${item.name} — ${item.price}₮`;
      og.appendChild(opt);
    });
    whatSel.appendChild(og);
  }

  if (drinks.length) {
    const og = document.createElement("optgroup");
    og.label = "Уух юм";
    drinks.forEach((item) => {
      const opt = document.createElement("option");
      opt.value = item.id;
      opt.dataset.price = item.price;
      opt.dataset.name = item.name;
      opt.textContent = `${item.name} — ${item.price}₮`;
      og.appendChild(opt);
    });
    whatSel.appendChild(og);
  }

  const others = items.filter((i) => !i.category);
  if (others.length) {
    const og = document.createElement("optgroup");
    og.label = "Бусад";
    others.forEach((item) => {
      const opt = document.createElement("option");
      opt.value = item.id;
      opt.dataset.price = item.price;
      opt.dataset.name = item.name;
      opt.textContent = `${item.name} — ${item.price}₮`;
      og.appendChild(opt);
    });
    whatSel.appendChild(og);
  }
});

customElements.define("home-page", HomePage);
