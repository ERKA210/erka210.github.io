class ShCart extends HTMLElement {
    constructor() {
        super();
        this.prices = {
            "Кимбаб": 5500,
            "Бургер": 6500,
            "Бууз": 4000,
            "Салад": 3000,
            "Кола 0.5л": 2500,
            "Хар цай": 1500,
            "Кофе": 3000,
            "Жүүс 0.33л": 2500
        };

        this.deliveryIcons = {
            single: 'assets/img/document.svg',  
            medium: 'assets/img/tor.svg',       
            large: 'assets/img/box.svg'         
        };
    }

    connectedCallback() {
        this.render();
        this.initializeElements();
        this.setupEventListeners();
        this.updateTotalsAndCount();
    }
    render() {
       this.innerHTML = `
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
              <img src="assets/img/box.svg" alt="delivery">
              <p>1500₮</p>
            </div>

            <div class="total-box">
              <p><b>Нийт:</b></p>
              <p class="total-price">0₮</p>
            </div>
          </div>
        `;
    }

    initializeElements() {
        this.totalPriceEl = this.querySelector(".total-price");
        this.deliveryPriceEl = this.querySelector(".delivery-box p:last-child");
        this.cartItemsContainer = this.querySelector(".cart-content > div:first-child");
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

    setupEventListeners() {
        if (this.foodSelect) {
            this.foodSelect.addEventListener("change", (e) => {
                const name = e.target.value;
                if (!name) return;
                const price = this.prices[name] || 0;
                const img = e.target.selectedOptions && e.target.selectedOptions[0].dataset.img ? e.target.selectedOptions[0].dataset.img : '';
                this.addItemToCart(name, price, img);
                e.target.selectedIndex = 0;
            });
        }

        if (this.cartItemsContainer) {
            this.cartItemsContainer.addEventListener("click", (e) => {
                const delBtn = e.target.closest("svg.del-btn");
                if (!delBtn) return;
                const box = delBtn.closest(".item-box");
                if (!box) return;
                const qty = parseInt(box.dataset.qty || (box.querySelector("p")?.textContent.match(/(\d+)/)||[0,1])[1], 10) || 1;
                const base = parseInt(box.dataset.price || this.parsePrice(box.querySelector(".price").textContent) / Math.max(qty,1), 10) || 0;
                if (qty > 1) {
                    const newQty = qty - 1;
                    box.dataset.qty = String(newQty);
                    box.querySelector("p").innerHTML = `<b>${this.escapeHtml(box.querySelector("b").textContent)}</b><br>${newQty} ширхэг`;
                    box.querySelector(".price").textContent = this.formatPrice(base * newQty);
                } else {
                    box.remove();
                }
                this.updateTotalsAndCount();
            });
        }
    }

    addItemToCart(name, price, img = '') {
        if (!name) return;
        const existing = [...this.cartItemsContainer.querySelectorAll(".item-box")].find(
            (box) => box.querySelector("b") && box.querySelector("b").textContent.trim() === name
        );

        if (existing) {
            const qty = parseInt(existing.dataset.qty || (existing.querySelector("p")?.textContent.match(/(\d+)/)||[0,1])[1], 10) || 1;
            const newQty = qty + 1;
            existing.dataset.qty = String(newQty);
            existing.querySelector("p").innerHTML = `<b>${this.escapeHtml(name)}</b><br>${newQty} ширхэг`;
            const base = parseInt(existing.dataset.price || price, 10) || price;
            existing.dataset.price = String(base);
            existing.querySelector(".price").textContent = this.formatPrice(base * newQty);
        } else {
            const box = document.createElement("div");
            box.className = "item-box";
            box.dataset.qty = "1";
            box.dataset.price = String(price);
            const imgHtml = img ? `<img class="item-img" src="${this.escapeAttr(img)}" alt="${this.escapeAttr(name)}">` : '';
            box.innerHTML = `
                ${imgHtml}
                <p><b>${this.escapeHtml(name)}</b><br>1 ширхэг</p>
                <p class="price">${this.formatPrice(price)}</p>
                <svg class="del-btn" viewBox="0 0 20 20" width="18" height="18" role="button" aria-label="remove">
                    <path d="M5.5415 15.75C5.10609 15.75 4.73334 15.6031 4.42327 15.3094C4.11321 15.0156 3.95817 14.6625 3.95817 14.25V4.5H3.1665V3H7.12484V2.25H11.8748V3H15.8332V4.5H15.0415V14.25C15.0415 14.6625 14.8865 15.0156 14.5764 15.3094C14.2663 15.6031 13.8936 15.75 13.4582 15.75H5.5415Z" fill="#C7C4CD"/>
                </svg>`;
            this.cartItemsContainer.appendChild(box);
        }

        this.updateTotalsAndCount();
    }

    updateTotalsAndCount() {
        const boxes = [...(this.cartItemsContainer ? this.cartItemsContainer.querySelectorAll(".item-box") : [])];
        let itemsTotal = 0;
        let totalQty = 0;

        boxes.forEach(box => {
            const qty = parseInt(box.dataset.qty || (box.querySelector("p")?.textContent.match(/(\d+)/)||[0,1])[1], 10) || 1;
            const base = parseInt(box.dataset.price || (this.parsePrice(box.querySelector(".price").textContent) / Math.max(qty,1)), 10) || 0;
            itemsTotal += base * qty;
            totalQty += qty;
        });

        let deliveryFee = 0;
        let iconSrc = 'assets/img/box.svg';
        if (totalQty > 10) {
            deliveryFee = 1500;
            iconSrc = this.deliveryIcons.large;
        } else if (totalQty >= 2) {
            deliveryFee = 1000;
            iconSrc = this.deliveryIcons.medium;
        } else if (totalQty === 1) {
            deliveryFee = 500;
            iconSrc = this.deliveryIcons.single;
        } else {
            deliveryFee = 0;
            iconSrc = 'assets/img/box.svg';
        }

        const deliveryText = itemsTotal > 0 ? this.formatPrice(deliveryFee) : '0₮';
        if (this.deliveryPriceEl) this.deliveryPriceEl.textContent = deliveryText;

        const totalWithDelivery = itemsTotal > 0 ? itemsTotal + deliveryFee : 0;
        if (this.totalPriceEl) this.totalPriceEl.textContent = this.formatPrice(totalWithDelivery);

        if (this.cartBadge) this.cartBadge.textContent = String(totalQty);

        if (this.deliveryImgEl) {
            this.deliveryImgEl.src = itemsTotal > 0 ? iconSrc : 'assets/img/box.svg';
            this.deliveryImgEl.alt = `delivery tier ${totalQty}`;
        }

        this.style.display = totalQty === 0 ? "none" : "block";
    }

    parsePrice(str) {
        return parseInt(String(str || '').replace(/[^\d]/g, ''), 10) || 0;
    }

    formatPrice(n) {
        return Number(n).toLocaleString('mn-MN') + '₮';
    }

    escapeAttr(s) {
        return String(s || '').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    }

    escapeHtml(s) {
        return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
}

window.customElements.define('sh-cart', ShCart);