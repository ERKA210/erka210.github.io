import { apiFetch } from "../api_client.js";

class OfferModal extends HTMLElement {
  
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.getElements();
    this.setupEvents();
  }

 render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --accent: #c90d30;
          --radius: 14px;
          --text: #1f2937;
          --muted: #6b7280;
          font-family: "Roboto", "Poppins", sans-serif;
        }
        .modal {
          position: fixed;
          inset: 0;
          display: none;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(6px);
          z-index: 10000;
          padding: 1rem;
        }
        .modal.open { display: flex; }

        .card {
          background: #fff;
          border-radius: var(--radius);
          width: min(540px, 100%);
          box-shadow: 0 22px 60px rgba(0, 0, 0, 0.18);
          padding: 1.35rem 1.5rem;
          position: relative;
          border: 1px solid rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }

        .title-wrap {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .thumb {
          width: 60px;
          height: 60px;
          border-radius: 14px;
          object-fit: cover;
          background: #f5f6fb;
          box-shadow: inset 0 0 0 1px #eef0f6;
        }

        h2 {
          margin: 0;
          font-size: 1.2rem;
          color: var(--text);
        }

        .meta {
          margin: 0.1rem 0 0;
          color: var(--muted);
          font-size: 0.95rem;
        }

        .close-btn {
          background: transparent;
          border: none;
          font-size: 1.3rem;
          cursor: pointer;
          padding: 0.3rem 0.45rem;
          border-radius: 8px;
          color: var(--muted);
        }
        .close-btn:hover { background: #f3f4f6; }

        .list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }
        .list li {
          background: #f8f9fc;
          border-radius: 10px;
          padding: 0.6rem 0.75rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--text);
          border: 1px solid #eef0f6;
        }
        .list span.price {
          font-weight: 700;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 700;
          font-size: 1rem;
          color: var(--text);
        }
        .price-row .pill {
          background: rgba(201, 13, 48, 0.08);
          color: var(--accent);
          padding: 0.3rem 0.75rem;
          border-radius: 999px;
          font-weight: 800;
        }

        .courier {
          border: 1px solid #eef0f6;
          border-radius: 12px;
          padding: 0.75rem 0.85rem;
          background: #f8f9fc;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 0.7rem;
          align-items: center;
        }
        .courier img {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          object-fit: cover;
          background: #fff;
          border: 1px solid #e5e7eb;
        }
        .courier h4 {
          margin: 0;
          font-size: 1rem;
          color: var(--text);
        }
        .courier p {
          margin: 0.1rem 0 0;
          color: var(--muted);
          font-size: 0.9rem;
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
        }

        button {
          font-weight: 600;
          cursor: pointer;
        }

        .delete {
          background: #fff;
          color: var(--muted);
          border-radius: 10px;
          padding: 0.65rem 1.25rem;
          border: 1px solid #e5e7eb;
        }
        .confirm {
          padding: 0.65rem 1.25rem;
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 700;
          box-shadow: 0 10px 30px rgba(201, 13, 48, 0.25);
          transition: transform 0.15s ease;
        }
        .confirm:hover { transform: translateY(-1px); }

        @media (prefers-color-scheme: dark) {
          :host {
            --text: #e5e7eb;
            --muted: #9aa4b2;
          }

          .card {
            background: #0f172a;
            border-color: #243040;
            box-shadow: 0 22px 60px rgba(0, 0, 0, 0.45);
          }

          .thumb {
            background: #111827;
            box-shadow: inset 0 0 0 1px #243040;
          }

          .close-btn:hover {
            background: #1f2937;
          }

          .list li {
            background: #111827;
            border-color: #243040;
          }

          .courier {
            background: #111827;
            border-color: #243040;
          }

          .courier img {
            background: #0b0f14;
            border-color: #243040;
          }

          .delete {
            background: #111827;
            color: var(--muted);
            border-color: #243040;
          }
        }
      </style>
      <div class="modal">
        <div class="card">
          <header>
            <div class="title-wrap">
              <img class="thumb" id="thumb" alt="">
              <div>
                <h2 id="title"></h2>
                <p class="meta" id="meta"></p>
              </div>
            </div>
            <button class="close-btn" aria-label="Хаах">×</button>
          </header>

          <div>
            <p class="meta" style="margin:0 0 0.4rem;">Барааны жагсаалт</p>
            <ul class="list" id="sub"></ul>
          </div>

          <div class="price-row">
            <span>Нийт үнэ</span>
            <span class="pill" id="price">0₮</span>
          </div>

          <div>
            <p class="meta" style="margin:0 0 0.4rem;">Захиалагч</p>
            <div class="courier" id="customerCard">
              <img id="customerAvatar" alt="Захиалагчийн зураг" />
              <div>
                <h4 id="customerName"></h4>
                <p id="customerPhone"></p>
                <p id="customerId"></p>
              </div>
            </div>
          </div>

          <div class="actions">
            <button class="delete" type="button">Устгах</button>
            <button class="confirm" type="button" data-role="courier-action">Хүргэх</button>
          </div>
        </div>
      </div>
    `;
  }


  getElements() {
    this.modal = this.shadowRoot.querySelector('.modal');
    this.card = this.shadowRoot.querySelector('.card');
    this.titleEl = this.shadowRoot.getElementById('title');
    this.metaEl = this.shadowRoot.getElementById('meta');
    this.thumbEl = this.shadowRoot.getElementById('thumb');
    this.subEl = this.shadowRoot.getElementById('sub');
    this.priceEl = this.shadowRoot.getElementById('price');
    this.customerCard = this.shadowRoot.getElementById('customerCard');
    this.customerAvatar = this.shadowRoot.getElementById('customerAvatar');
    this.customerName = this.shadowRoot.getElementById('customerName');
    this.customerPhone = this.shadowRoot.getElementById('customerPhone');
    this.customerId = this.shadowRoot.getElementById('customerId');
    this.closeBtn = this.shadowRoot.querySelector('.close-btn');
    this.deleteBtn = this.shadowRoot.querySelector('.delete');
    this.confirmBtn = this.shadowRoot.querySelector('.confirm');
  }

  setupEvents() {
    this.closeBtn.addEventListener('click', () => this.closeModal());
    
    this.modal.addEventListener('click', (event) => {
      if (event.target === this.modal) this.closeModal();
    });
    
    this.deleteBtn.addEventListener('click', () => {
      this.deleteOffer();
    });
    this.confirmBtn.addEventListener('click', () => this.confirmDelivery());
  }
  show(offerData) {
    if (!this.modal) return;
    
    this.currentData = offerData;
    
    this.thumbEl.src = offerData.thumb;
    this.thumbEl.alt = offerData.title;
    
    this.titleEl.textContent = offerData.title;
    this.metaEl.textContent = offerData.meta;
    
    const subItems = offerData.sub;
    console.log(offerData.sub);
    
    if (subItems.length === 0) {
      this.subEl.innerHTML = '<li><span>Бараа алга</span><span class="price">-</span></li>';
    } else {
      this.subEl.innerHTML = subItems.map((item) => {
        const itemName = item?.name;
        const itemPrice = item?.price || "";
        console.log(itemPrice);
        return `<li><span>${itemName}</span><span class="price">${itemPrice}</span></li>`;
      }).join('');
    }
    
    this.priceEl.textContent = offerData.price ? String(offerData.price) : '0₮';

    const customer = offerData?.customer || {};
    const customerName = customer?.name || "";
    const customerPhone = customer?.phone || "";
    const customerId = customer?.student_id || "";
    
    if (this.customerAvatar) {
      this.customerAvatar.src = customer?.avatar || "assets/img/profile.jpg";
      this.customerAvatar.alt = customerName;
    }
    if (this.customerName) this.customerName.textContent = customerName;
    if (this.customerPhone) this.customerPhone.textContent = customerPhone;
    if (this.customerId) this.customerId.textContent = `ID: ${customerId}`;

    this.modal.classList.add('open');
  }

  closeModal() {
    if (this.modal) this.modal.classList.remove('open');
  }

async confirmDelivery() {
  if (!this.currentData) {
    this.closeModal();
    return;
  }

  await this.loadCurrentUser();
  
  const isUserCourier = this.currentUser?.role === "courier";
  
  if (!isUserCourier) {
    localStorage.setItem("login_prefill_role", "courier");
    localStorage.setItem("login_prefill_mode", "register");
    location.hash = "#login";
    return;
  }

  const customer = this.currentData?.customer || {};
  const customerId = customer?.id || customer?.customer_id || null;
  const customerStudentId = customer?.student_id || customer?.studentId || null;
  
  const selfId = this.currentUser?.id || null;
  const selfStudentId = this.currentUser?.student_id || this.currentUser?.studentId || null;
  
  if (
    (customerId && selfId && String(customerId) === String(selfId)) ||
    (customerStudentId && selfStudentId && String(customerStudentId) === String(selfStudentId))
  ) {
    alert("Өөрийн захиалгыг өөрөө хүргэх боломжгүй.");
    return;
  }

  this.removeFromOffersList(this.currentData);

  let orderDetails = null;
  const orderId = this.currentData?.orderId;

  if (orderId) {
    try {
      const response = await apiFetch(`/api/orders/${orderId}/assign-courier`, {
        method: "POST",
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        orderDetails = data?.order || null;
      }
    } catch (error) {
    }
  }

  const addedToCart = await this.addToDeliveryCart(this.currentData);
  
  if (!addedToCart) {
    this.closeModal();
    return;
  }

  const activeOrder = this.buildActiveOrderData(this.currentData, orderDetails);
  await this.saveActiveOrder(activeOrder);
  
  window.NumAppState?.setState("courier", "delivery_started");
  localStorage.setItem("deliveryActive", "1");


  this.removeFromOffersList(this.currentData);

  try {
    const response = await apiFetch("/api/courier/me", {
      credentials: "include",
    });

    if (response.ok) {
      const courier = await response.json();
    }
  } catch (error) {
    console.warn('courier fetch failed', error);
  }

  this.closeModal();

  window.dispatchEvent(new Event('order-updated'));
  window.dispatchEvent(new Event('delivery-cart-updated'));
  window.dispatchEvent(new Event('offers-updated'));

  const cartElement = document.querySelector('delivery-cart');
  if (cartElement && typeof cartElement.load === 'function') {
    cartElement.load();
  }

  const isMobile = window.matchMedia("(max-width: 30rem)").matches;
  
  if (isMobile) {
    location.hash = '#delivery';
  } else {
    console.log('Сагсанд амжилттай нэмэгдлээ');
  }
}

  async deleteOffer() {
    if (!this.currentData) {
      this.closeModal();
      return;
    }

    await this.loadCurrentUser();
    const orderId = this.currentData?.orderId || this.currentData?.id || null;
    const isOwner = this.checkIfOwner(this.currentData);

    if (isOwner && orderId) {
      const deleted = await this.deleteOrderFromServer(orderId);
      if (!deleted) {
        return;
      }
    }

    this.removeFromOffersList(this.currentData);
    window.dispatchEvent(new Event('offers-updated'));
    this.closeModal();
  }

  checkIfOwnOrder(offerData) {
    const customer = offerData?.customer || {};
    const user = this.currentUser || {};
    
    const customerId = customer?.id || customer?.customer_id || null;
    const customerStudentId = customer?.student_id || customer?.studentId || null;
    const userId = user?.id || null;
    const userStudentId = user?.student_id || user?.studentId || null;
    
    if (customerId && userId && String(customerId) === String(userId)) return true;
    if (customerStudentId && userStudentId && String(customerStudentId) === String(userStudentId)) return true;
    
    return false;
  }

  checkIfOwner(offerData) {
    return this.checkIfOwnOrder(offerData);
  }

  async deleteOrderFromServer(orderId) {
    try {
      const response = await apiFetch(`/api/orders/${orderId}`, {
        method: "DELETE",
      });
      
      if (response.status === 401) {
        location.hash = "#login";
        return false;
      }
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        alert(error?.error || "Захиалга устгахад алдаа гарлаа");
        return false;
      }
      
      return true;
    } catch (error) {
      alert("Захиалга устгахад алдаа гарлаа");
      return false;
    }
  }

  async addToDeliveryCart(offerData) {
    const cartItem = {
      title: offerData.title || '',
      meta: offerData.meta || '',
      price: offerData.price || '',
      thumb: offerData.thumb || "assets/img/box.svg",
      sub: Array.isArray(offerData.sub) ? offerData.sub : [],
      orderId: offerData.orderId || offerData.id || null,
    };
    
    try {
      const response = await apiFetch("/api/delivery-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartItem),
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        if (String(error.error || "").toLowerCase().includes("unauthorized")) {
          location.hash = "#login";
          return false;
        }
        alert(error.error || "Хүргэлт нэмэхэд алдаа гарлаа");
        return false;
      }
      
      return true;
    } catch (error) {
      alert("Хүргэлт нэмэхэд алдаа гарлаа");
      return false;
    }
  }

  buildActiveOrderData(offerData, orderDetails) {
    const titleParts = (offerData.title || '').split('-').map((s) => s.trim());
    const fromLocation = titleParts[0] || '';
    const toLocation = titleParts[1] || '';
    
    const firstItem = Array.isArray(offerData.sub) && offerData.sub.length 
      ? offerData.sub[0] 
      : null;
    
    const customer = orderDetails?.customer || offerData?.customer || {};
    
    return {
      orderId: offerData?.orderId || null,
      from: orderDetails?.from_name || fromLocation,
      to: orderDetails?.to_name || toLocation,
      item: firstItem?.name || '',
      items: Array.isArray(offerData.sub) ? offerData.sub : [],
      total: offerData.price || '',
      createdAt: orderDetails?.created_at || new Date().toISOString(),
      customer: {
        name: customer?.name || "Чигцалмаа",
        phone: customer?.phone || "99001234",
        studentId: customer?.studentId || customer?.student_id || "23b1num0245",
        avatar: customer?.avatar || "assets/img/profile.jpg",
      },
    };
  }

  async saveActiveOrder(orderData) {
    try {
      await apiFetch("/api/active-order", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: orderData }),
      });
    } catch (error) {
    }
  }

  async loadCurrentUser() {
    if (this.currentUser) return this.currentUser;
    
    try {
      const response = await apiFetch("/api/auth/me");
      
      if (!response.ok) {
        this.currentUser = null;
      } else {
        const data = await response.json();
        this.currentUser = data?.user || null;
      }
    } catch (error) {
      this.currentUser = null;
    }
    
    return this.currentUser;
  }

  removeFromOffersList(offerData) {
    if (!offerData || typeof offerData !== 'object') return false;

    const offersJSON = localStorage.getItem('offers');
    
    let offersList = [];
    try {
      offersList = offersJSON ? JSON.parse(offersJSON) : [];
    } catch (error) {
      console.error('Offers задлахад алдаа:', error);
      offersList = [];
    }

    const orderId = offerData.orderId || offerData.id || null;
    const offerKey = `${offerData.title || ''}|${offerData.meta || ''}|${offerData.price || ''}`;
    const originalLength = offersList.length;

    const updatedOffers = offersList.filter(item => {
      const itemId = item.orderId || item.id || null;

      if (orderId && itemId && String(itemId) === String(orderId)) {
        return false;
      }
   
      const itemKey = `${item.title || ''}|${item.meta || ''}|${item.price || ''}`;
      return itemKey !== offerKey;
    });

    if (orderId) {
      const removedIdsKey = this.getRemovedStorageKey('removed_offer_ids');
      const removedIdsJSON = localStorage.getItem(removedIdsKey);
      
      let removedIds = [];
      try {
        removedIds = JSON.parse(removedIdsJSON) || [];
      } catch (error) {
        removedIds = [];
      }
      
      const normalizedId = String(orderId);
      if (!removedIds.includes(normalizedId)) {
        removedIds.push(normalizedId);
        localStorage.setItem(removedIdsKey, JSON.stringify(removedIds));
      }
    }

    if (updatedOffers.length === originalLength) {
      return false;
    }

    localStorage.setItem('offers', JSON.stringify(updatedOffers));

    window.dispatchEvent(new CustomEvent('offer-removed', {
      detail: {
        removedOffer: offerData,
        remainingOffers: updatedOffers
      }
    }));

    return true;
  }

  // Хэрэглэгчийн storage key үүсгэх
  getRemovedStorageKey(baseKey) {
    const authKey = localStorage.getItem("authUserKey");
    const userId = this.currentUser?.id || "";
    const suffix = authKey || userId || "";
    return suffix ? `${baseKey}:${suffix}` : baseKey;
  }

  refreshOffersList() {
    window.dispatchEvent(new Event('offers-updated'));
  }

  parseMetaToISO(metaText) {
    if (!metaText) return null;
    const sanitized = metaText.replace('•', '');
    const parsed = Date.parse(sanitized);
    if (!Number.isNaN(parsed)) return new Date(parsed).toISOString();
    return null;
  }

  normalizeName(nameValue) {
    const rawName = String(nameValue || "").trim();
    if (!rawName) return "Чигцалмаа";
    
    const nameTokens = rawName.split(/\s+/).filter((token) => token && token.length > 1);
    return nameTokens.length ? nameTokens.join(" ") : rawName;
  }
}

customElements.define('offer-modal', OfferModal);