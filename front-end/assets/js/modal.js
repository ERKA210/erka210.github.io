document.addEventListener("DOMContentLoaded", () => {
  const picker = document.querySelector("date-time-picker");
  if (!picker) {
    return;
  }

  customElements.whenDefined("date-time-picker").then(() => {
    const fromSel = document.querySelector("#from");
    const toSel = document.querySelector("#to");
    const shadow = picker.shadowRoot;
    if (!fromSel || !toSel || !shadow) {
      return;
    }

    const dateSel = shadow.querySelector("input[type='date']");
    const timeSel = shadow.querySelector("input[type='time']");
    const orderBtn = document.querySelector(".order-btn");
    const modal = document.querySelector("#confirm-modal");
    const confirmText = document.querySelector("#confirm-text");
    const cancelBtn = document.querySelector("#cancel-order");
    const confirmBtn = document.querySelector("#confirm-order");
    if (!dateSel || !timeSel || !orderBtn || !modal || !confirmText || !cancelBtn || !confirmBtn) {
      return;
    }


  function getCartItems() {
    const boxes = document.querySelectorAll(".item-box");
    let items = [];

    boxes.forEach(box => {
      const name = box.querySelector("b").textContent.trim();
      const qtyMatch = box.querySelector("p").innerHTML.match(/(\d+)\s*ширхэг/);
      const qty = qtyMatch ? parseInt(qtyMatch[1]) : 1;
      items.push({ name, qty });
    });

    return items;
  }

  function getTotalCartPrice() {
    const totalText = document.querySelector(".total-price").textContent;
    return parseInt(totalText.replace(/[^\d]/g, ""));
  }

    orderBtn.addEventListener("click", () => {

    const fromSelected = fromSel.selectedIndex > 0;
    const toSelected   = toSel.selectedIndex > 0;
    const hasFood      = document.querySelectorAll(".item-box").length > 0;

    if (!fromSelected || !toSelected || !hasFood) {
      alert("Бүх талбаруудыг бөглөнө үү");
      return;
    }

    const from = fromSel.options[fromSel.selectedIndex].textContent;
    const to   = toSel.options[toSel.selectedIndex].textContent;
    const date = dateSel.value;
    const time = timeSel.value;

    const items = getCartItems();
    const total = getTotalCartPrice();

    let itemsHTML = "";
    items.forEach(i => {
      itemsHTML += `<div>• ${i.name} — ${i.qty} ширхэг</div>`;
    });

    confirmText.innerHTML = `
      <div><b>Хаанаас:</b> ${from}</div>
      <div><b>Хаашаа:</b> ${to}</div>
      <div><b>Өдөр:</b> ${date}</div>
      <div><b>Цаг:</b> ${time}</div>

      <div style="margin-top: 10px;"><b>Таны хоол:</b></div>
      <div class="item-list">${itemsHTML}</div>

      <div style="margin-top: 10px;">
        <b>Нийт үнэ:</b> ${total.toLocaleString("mn-MN")}₮
      </div>
    `;

    modal.classList.remove("hidden");
  });


    cancelBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
    });


    confirmBtn.addEventListener("click", () => {

    const items = getCartItems();
    const itemsText = items.map(i => `${i.name} (${i.qty}ш)`).join(", ");
    const total = getTotalCartPrice();

    const newOrder = {
      thumb: "assets/img/box.svg",
      title: `${fromSel.options[fromSel.selectedIndex].textContent} → ${toSel.options[toSel.selectedIndex].textContent}`,
      meta: `${dateSel.value} • ${timeSel.value}`,
      sub: itemsText,                     // ← бүтээгдэхүүний жагсаалт
      price: total.toLocaleString("mn-MN") + "₮",
    };

    let offers = JSON.parse(localStorage.getItem("offers")) || [];
    offers.unshift(newOrder);
    localStorage.setItem("offers", JSON.stringify(offers));

    document.querySelector("#offers").items = offers;

    modal.classList.add("hidden");
    alert("Захиалга амжилттай нэмэгдлээ!");
    });
  });
});
