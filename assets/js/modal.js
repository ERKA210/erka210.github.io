document.addEventListener("DOMContentLoaded", () => {

  // ========================
  // Элементүүд
  // ========================
  const fromSel   = document.querySelector("#from");
  const toSel     = document.querySelector("#to");
  const dateSel   = document.querySelector("input[type='date']");
  const timeSel   = document.querySelector("input[type='time']");
  const orderBtn  = document.querySelector(".order-btn");
  const modal     = document.querySelector("#confirm-modal");
  const confirmText = document.querySelector("#confirm-text");
  const cancelBtn = document.querySelector("#cancel-order");
  const confirmBtn = document.querySelector("#confirm-order");

  // ========================
  // Сагснаас бүтээгдэхүүн авах
  // ========================
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

  // ========================
  // Сагс нийт үнэ авах
  // ========================
  function getTotalCartPrice() {
    const totalText = document.querySelector(".total-price").textContent;
    return parseInt(totalText.replace(/[^\d]/g, ""));
  }

  // ========================
  // Захиалах → modal нээх
  // ========================
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

  // ========================
  // Цуцлах
  // ========================
  cancelBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // ========================
  // Баталгаажуулах → Offer List рүү нэмэх
  // ========================
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

    // Offer list UI update
    document.querySelector("#offers").items = offers;

    modal.classList.add("hidden");
    alert("Захиалга амжилттай нэмэгдлээ!");
  });

});