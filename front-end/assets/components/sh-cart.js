import { escapeAttr} from "../helper/escape-attr.js";
import { escapeHtml } from "../helper/escape-html.js";
import { formatPrice } from "../helper/format-d-ts-p.js";
import { getDeliveryIcon } from "../helper/delivery-icon.js";
import { getDeliveryFee } from "../helper/delivery-fee.js";

class ShCart extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.getElements();
        this.setupEvents();
        this.updateCartTotals();
    }
    render() {
       this.innerHTML = `
       <section>
          <h3>Таны сагс</h3>
          <div class="cart-icon">
            <svg><path opacity="0.4" d="M8.26012 21.9703C9.1827 21.9703 9.93865 22.7536 9.93883 23.7213C9.93883 24.6776 9.18281 25.4615 8.26012 25.4615C7.32644 25.4613 6.57066 24.6775 6.57066 23.7213C6.57084 22.7537 7.32655 21.9704 8.26012 21.9703ZM20.767 21.9703C21.6894 21.9704 22.4455 22.7536 22.4457 23.7213C22.4457 24.6775 21.6896 25.4614 20.767 25.4615C19.8331 25.4615 19.0765 24.6776 19.0765 23.7213C19.0767 22.7536 19.8333 21.9703 20.767 21.9703Z" fill="#C90D30"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M22.4456 7.31518C23.1237 7.31518 23.5684 7.55713 24.0131 8.08714C24.4577 8.61714 24.5356 9.37757 24.4355 10.0677L23.3794 17.626C23.1793 19.0789 21.9787 20.1493 20.5669 20.1493H8.4385C6.95997 20.1493 5.73713 18.9741 5.61485 17.4543L4.5921 4.89445L2.91348 4.59489C2.46881 4.51423 2.15754 4.06488 2.23535 3.60401C2.31317 3.13162 2.74672 2.82053 3.20251 2.88966L5.85386 3.30445C6.23182 3.37473 6.50974 3.69619 6.54309 4.08793L6.75431 6.66881C6.78766 7.03865 7.0767 7.31518 7.43243 7.31518H22.4456ZM15.7089 13.3053H18.7882C19.2551 13.3053 19.622 12.9136 19.622 12.4412C19.622 11.9573 19.2551 11.5771 18.7882 11.5771H15.7089C15.242 11.5771 14.8751 11.9573 14.8751 12.4412C14.8751 12.9136 15.242 13.3053 15.7089 13.3053Z" fill="#C90D30"/>
            </svg>
            <span>0</span>
          </div>

          <div class="cart-content">
            <div></div>
            <div class="delivery-box">
              <p><b>Хүргэлт:</b></p>
              <img src="assets/img/box.svg" alt="delivery" width="57" height="57" decoding="async">
              <p>1500₮</p>
            </div>

            <div class="total-box">
              <p><b>Нийт:</b></p>
              <p class="total-price">0₮</p>
            </div>
          </div>
        </section>
        `;
    }

    getElements() {
        this.totalPriceEl = this.querySelector(".total-price");
        this.deliveryPriceEl = this.querySelector(".delivery-box p:last-child");
        this.cartItemsContainer = this.querySelector(".cart-content div:first-child");
        this.cartBadge = this.querySelector(".cart-icon span");
        this.foodSelect = document.querySelector("#what") || document.querySelector(".bottom-row select");
        this.deliveryImgEl = this.querySelector(".delivery-box img");

        if (!this.cartItemsContainer) {
            const cc = this.querySelector(".cart-content");
            if (cc) {
                const inner = document.createElement("div");
                cc.insertBefore(inner, cc.firstChild);
                this.cartItemsContainer = inner;
            }
        }
    }

    setupEvents() {
        if (this.foodSelect) {
            this.foodSelect.addEventListener("change", (e) => {

            const selectEl = e.target;
            const options = selectEl.selectedOptions;

            if (options.length === 0) {
            return;
            }

            const option = options[0];

            let name = "";

            if (option.dataset.name) {
            name = option.dataset.name;
            } else {
            name = option.textContent;
            }

            if (name.indexOf(" — ") !== -1) {
            name = name.split(" — ")[0];
            }

            let price = 0;

            if (option.dataset.price) {
            price = option.dataset.price;
            }

            let img = "";

            if (option.dataset.img) {
            img = option.dataset.img;
            }

    this.addItemToCart(name, price, img);

    selectEl.selectedIndex = 0;
  });
    }

        if (this.cartItemsContainer) {
        this.cartItemsContainer.addEventListener("click", (e) => {

        const delBtn = e.target.closest("svg.del-btn");
        if (!delBtn) return;

        const box = delBtn.closest(".item-box");
        if (!box) return;

        let qty = 1;
        
        if (box.dataset.qty) {
        //10tiin toollin systemd too bolgno
        qty = parseInt(box.dataset.qty, 10);
        }

        let basePrice = 0;

        if (box.dataset.price) {
        basePrice = parseInt(box.dataset.price, 10);
        }

        if (qty > 1) {
            const newQty = qty - 1;

            box.dataset.qty = String(newQty);

      const b = box.querySelector("b");
      let title = "";
      if (b) title = b.textContent || "";

      const p = box.querySelector("p");
      if (p) {
        const safeTitle = escapeHtml(title);
        p.innerHTML = `<b>${safeTitle}</b><br>${newQty} ширхэг`;
      }

      const priceEl = box.querySelector(".price");
      if (priceEl) {
        const newTotal = basePrice * newQty;
        priceEl.textContent = formatPrice(newTotal);
      }
    } else {
      box.remove();
    }

    this.updateCartTotals();
  });
}
    }

    addItemToCart(name, price, img = '') {
        const boxes = this.cartItemsContainer.querySelectorAll(".item-box");
        let existingBox = null;

        for (let i = 0; i < boxes.length; i++) {
            const box = boxes[i];

            const b = box.querySelector("b");
            if (!b) continue;

            const label = b.textContent ? b.textContent.trim() : "";
            if (label === name) {
            existingBox = box;
            break;
            }
        }

          if (existingBox) {
            let qty = 1;

            if (existingBox.dataset.qty) {
            qty = parseInt(existingBox.dataset.qty, 10);
            }

            const newQty = qty + 1;

            let basePrice = price;
            if (existingBox.dataset.price) {
            const p = parseInt(existingBox.dataset.price, 10);
            }

            existingBox.dataset.qty = String(newQty);
            existingBox.dataset.price = String(basePrice);

            const pEl = existingBox.querySelector("p");
            if (pEl) {
            const safeName = escapeHtml(name);
            pEl.innerHTML = `<b>${safeName}</b><br>${newQty} ширхэг`;
            }

            const priceEl = existingBox.querySelector(".price");
            if (priceEl) {
            priceEl.textContent = formatPrice(basePrice * newQty);
            }

            this.updateCartTotals();
            return;
        }

        const box = document.createElement("div");
        box.className = "item-box";
        box.dataset.qty = "1";
        box.dataset.price = String(price);

        let imgHtml = "";
        if (img !== "") {
            const safeImg = escapeAttr(img);
            const safeAlt = escapeAttr(name);
            imgHtml = `<img class="item-img" src="${safeImg}" alt="${safeAlt}">`;
        }

        const safeName = escapeHtml(name);
        const safePrice = formatPrice(price);

        box.innerHTML =
            imgHtml +
            `<p><b>${safeName}</b><br>1 ширхэг</p>` +
            `<p class="price">${safePrice}</p>` +
            `<svg class="del-btn" viewBox="0 0 20 20" width="18" height="18" role="button" aria-label="remove">
                <path d="M5.5415 15.75C5.10609 15.75 4.73334 15.6031 4.42327 15.3094C4.11321 15.0156 3.95817 14.6625 3.95817 14.25V4.5H3.1665V3H7.12484V2.25H11.8748V3H15.8332V4.5H15.0415V14.25C15.0415 14.6625 14.8865 15.0156 14.5764 15.3094C14.2663 15.6031 13.8936 15.75 13.4582 15.75H5.5415Z" fill="#C7C4CD"/>
            </svg>`;

        this.cartItemsContainer.appendChild(box);

        this.updateCartTotals();
        }

    updateCartTotals() {
    let boxes = [];
    if (this.cartItemsContainer) {
        boxes = this.cartItemsContainer.querySelectorAll(".item-box");
    }

    let itemsTotal = 0;
    let totalQty = 0;
    const items = [];

    for (let i = 0; i < boxes.length; i++) {
        const box = boxes[i];

        let qty = 1;

        if (box.dataset.qty) {
        qty = parseInt(box.dataset.qty, 10);
        } 
        let base = 0;

        if (box.dataset.price) {
        base = parseInt(box.dataset.price, 10);
        } 

        let name = "";
        const b = box.querySelector("b");
        if (b) {
        name = (b.textContent || "").trim();
        }

        itemsTotal = itemsTotal + (base * qty);
        totalQty = totalQty + qty;

        items.push({
        name: name,
        qty: qty,
        price: base,
        unitPrice: base
        });
    }

    const deliveryFee = getDeliveryFee(totalQty);

    let deliveryText = "0₮";
    if (itemsTotal > 0) {
        deliveryText = formatPrice(deliveryFee);
    }
    if (this.deliveryPriceEl) {
        this.deliveryPriceEl.textContent = deliveryText;
    }

    let totalWithDelivery = 0;
    if (itemsTotal > 0) {
        totalWithDelivery = itemsTotal + deliveryFee;
    }
    if (this.totalPriceEl) {
        this.totalPriceEl.textContent = formatPrice(totalWithDelivery);
    }

    if (this.cartBadge) {
        this.cartBadge.textContent = String(totalQty);
    }

    const iconSrc = getDeliveryIcon(totalQty);
    if (this.deliveryImgEl) {
        this.deliveryImgEl.src = iconSrc;
        this.deliveryImgEl.alt = "delivery tier " + totalQty;
    }

    if (totalQty === 0) {
        this.style.display = "none";
    } else {
        this.style.display = "block";
    }

    this.summary = {
        items: items,
        itemsTotal: itemsTotal,
        deliveryFee: deliveryFee,
        total: totalWithDelivery,
        totalQty: totalQty,
        deliveryIcon: iconSrc
    };
    }

    parsePrice(str) {
        return parseInt(String(str || '').replace(/[^\d]/g, ''), 10);
    }

    getSummary() {
        return this.summary;
    }

}

window.customElements.define('sh-cart', ShCart);
