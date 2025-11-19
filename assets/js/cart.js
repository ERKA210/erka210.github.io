document.addEventListener("DOMContentLoaded", () => {
  const cart = document.querySelector(".cart");
  if (!cart) return;

  const totalPriceEl = cart.querySelector(".total-price");
  const deliveryPriceEl = cart.querySelector(".delivery-box p:last-child");
  const cartItemsContainer = cart.querySelector(".cart-content > div:first-child");
  const cartBadge = cart.querySelector(".cart-icon span");
  const foodSelect = document.querySelector(".bottom-row select");

  cart.style.display = "none";

  const prices = {
    "Кимбаб": 5500,
    "Бургер": 6500,
    "Бууз": 4000,
    "Салад": 3000,
    "Кола 0.5л": 2500,
    "Хар цай": 1500,
    "Кофе": 3000,
    "Жүүс 0.33л": 2500
  };

  function parsePrice(str) {
    return parseInt(str.replace(/[^\d]/g, ""));
  }
  function formatPrice(num) {
    return num.toLocaleString("mn-MN") + "₮";
  }

  function updateTotal() {
    const items = cart.querySelectorAll(".item-box");
    let total = 0;
    items.forEach((box) => {
      total += parsePrice(box.querySelector(".price").textContent);
    });
    if (deliveryPriceEl) total += parsePrice(deliveryPriceEl.textContent);
    totalPriceEl.textContent = formatPrice(total);
  }

  function updateCount() {
    const count = cart.querySelectorAll(".item-box").length;
    cartBadge.textContent = count;

    if (count === 0) {
      cart.style.display = "none";
    } else {
      cart.style.display = "block";
    }
  }

  function addItemToCart(name, price) {
    const existing = [...cartItemsContainer.querySelectorAll(".item-box")].find(
      (box) => box.querySelector("b").textContent.trim() === name
    );

    if (existing) {
      const qtyEl = existing.querySelector("p");
      const qtyMatch = qtyEl.textContent.match(/(\d+)\s*ширхэг/);
      const qty = qtyMatch ? parseInt(qtyMatch[1]) + 1 : 2;
      qtyEl.innerHTML = `<b>${name}</b><br>${qty} ширхэг`;
      existing.querySelector(".price").textContent = formatPrice(price * qty);
    } else {
      const box = document.createElement("div");
      box.className = "item-box";
      box.innerHTML = `
        <p><b>${name}</b><br>1 ширхэг</p>
        <p class="price">${formatPrice(price)}</p>
        <svg class="del-btn" viewBox="0 0 20 20">
          <path d="M5.5415 15.75C5.10609 15.75 4.73334 15.6031 4.42327 15.3094C4.11321 15.0156 3.95817 14.6625 3.95817 14.25V4.5H3.1665V3H7.12484V2.25H11.8748V3H15.8332V4.5H15.0415V14.25C15.0415 14.6625 14.8865 15.0156 14.5764 15.3094C14.2663 15.6031 13.8936 15.75 13.4582 15.75H5.5415Z" fill="#C7C4CD"/>
        </svg>`;
      cartItemsContainer.appendChild(box);
    }

    updateTotal();
    updateCount();
  }

  foodSelect.addEventListener("change", (e) => {
    const selected = e.target.value;
    if (!selected) return;
    const price = prices[selected] || 0;
    addItemToCart(selected, price);
    e.target.selectedIndex = 0;
  });

  cartItemsContainer.addEventListener("click", (e) => {
    const delBtn = e.target.closest("svg.del-btn");
    if (!delBtn) return;
    delBtn.parentElement.remove();
    updateTotal();
    updateCount();
  });

  updateTotal();
  updateCount();
});