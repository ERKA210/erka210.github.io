class ProfilePage extends HTMLElement {
  connectedCallback() {
    this.renderAccessGate();
    this.ensureAuthenticated();
  }

  renderAccessGate() {
    this.innerHTML = `
      <link rel="stylesheet" href="assets/css/profile.css" />
      <section class="profile-page">
        <div class="profile-hero">
          <div class="profile-hero__content">
            <div class="profile-meta">
              <div class="hero-info hero-info--stack">
                <strong>Профайл ачаалж байна...</strong>
                <span class="muted">Нэвтрэлт шалгаж байна</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  async ensureAuthenticated() {
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) {
        this.redirectToLogin();
        return;
      }
      const data = await res.json();
      if (!data?.user?.id) {
        this.redirectToLogin();
        return;
      }
      this.currentUser = data.user;
      this.renderProfile();
    } catch (e) {
      this.redirectToLogin();
    }
  }

  redirectToLogin() {
    this.innerHTML = `
      <link rel="stylesheet" href="assets/css/profile.css" />
      <section class="profile-page">
        <div class="profile-hero">
          <div class="profile-hero__content">
            <div class="profile-meta">
              <div class="hero-info hero-info--stack">
                <strong>Профайл харахын тулд нэвтэрнэ үү.</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
    location.hash = "#login";
  }

  renderProfile() {
    this.profileData = this.loadProfileData();
    const activeOrders = this.getActiveOrders();
    const activeOrdersMarkup = this.buildActiveOrdersMarkup(activeOrders);
    const reviews = this.getReviews();
    const reviewsMarkup = this.buildReviewsMarkup(reviews);
    const reviewsModalMarkup = this.buildReviewsMarkup(reviews);
    const orderHistory = this.getOrderHistory();
    const deliveryHistory = this.getDeliveryHistory();
    const isCourier = this.currentUser?.role === "courier";
    this.innerHTML = `
      <link rel="stylesheet" href="assets/css/profile.css" />
      <section class="profile-page">
        <div class="profile-hero">
          <div class="profile-hero__content">
            <div class="avatar-wrap">
              <img src="${this.profileData.avatar || 'assets/img/profile.jpg'}" alt="Профайл зураг" class="avatar profile-avatar" width="120" height="120" decoding="async" />
            </div>

            <div class="profile-meta">
              <div class="hero-info hero-info--stack">
                <div><span class="label">Нэр:</span><strong class="profile-name">${this.profileData.name}</strong></div>
                <div><span class="label">Утас:</span><strong class="profile-phone">${this.profileData.phone}</strong></div>
                <div><span class="label">ID:</span><strong class="profile-id">${this.profileData.id}</strong></div>
                <div><span class="label">Имэйл:</span><strong class="profile-email">${this.profileData.email}</strong></div>
              </div>

              <div class="hero-actions">
                <button class="btn primary" data-modal-open="ordersModal" id="openOrderBtn">Миний захиалга</button>
                <button class="btn ghost" data-modal-open="deliveryModal" id="openDeliveryBtn">Миний хүргэлт</button>
              </div>
            </div>

            <div class="hero-stats">
              <div class="stat-card">
                <p>Нийт захиалга</p>
                <strong id="orderTotal">0</strong>
              </div>
              ${isCourier ? `
                <div class="stat-card">
                  <p>Дундаж үнэлгээ</p>
                  <div class="stars avg-stars" aria-label="0 од">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                  <small class="avg-rating-text">0 / 5</small>
                </div>
              ` : ""}
            </div>
          </div>
        </div>

        <div class="profile-actions-desktop">
          <button class="action-card" type="button" data-modal-open="ordersModal">
            <span class="action-title">Миний захиалга</span>
            <span class="action-subtitle">Түүх, төлөвийг харах</span>
          </button>
          <button class="action-card" type="button" data-modal-open="deliveryModal">
            <span class="action-title">Миний хүргэлт</span>
            <span class="action-subtitle">Хүргэлтийн мэдээлэл</span>
          </button>
        </div>

        ${isCourier ? `
          <div class="profile-grid">
            <article class="profile-card reviews">
              <header>
                <div>
                  <p class="eyebrow">Сэтгэгдэл</p>
                </div>
                <button class="ghost-btn small open-reviews">Бүгдийг харах</button>
              </header>

              <div class="review-list">${reviewsMarkup}</div>
            </article>
          </div>
        ` : ""}
      </section>

      <div class="modal-backdrop" data-modal="profileModal">
        <div class="modal-card">
          <header class="modal-header">
            <div>
              <p class="eyebrow">Профайл засах</p>
              <h3>Мэдээллээ шинэчлэх</h3>
            </div>
            <button class="icon-btn close-modal" data-close="profileModal">×</button>
          </header>
          <form id="profileForm" class="modal-body">
            <label>
              <span>Нэр</span>
              <input type="text" name="name" required />
            </label>
            <label>
              <span>Утас</span>
              <input type="tel" name="phone" required />
            </label>
            <label>
              <span>Имэйл</span>
              <input type="email" name="email" required />
            </label>
            <label>
              <span>ID</span>
              <input type="text" name="id" />
            </label>
            <label>
              <span>Зураг (URL)</span>
              <input type="url" name="avatar" placeholder="assets/img/profile.jpg" />
            </label>
            <div class="modal-actions">
              <button type="button" class="btn ghost close-modal" data-close="profileModal">Болих</button>
              <button type="submit" class="btn primary">Хадгалах</button>
            </div>
          </form>
        </div>
      </div>

      ${isCourier ? `
        <div class="modal-backdrop" data-modal="reviewsModal">
          <div class="modal-card">
            <header class="modal-header">
              <div>
                <p class="eyebrow">Сэтгэгдлүүд</p>
              </div>
              <button class="icon-btn close-modal" data-close="reviewsModal">×</button>
            </header>
            <div class="modal-body review-list modal-scroll">
              ${reviewsModalMarkup}
            </div>
          </div>
        </div>
      ` : ""}

      <div class="modal-backdrop" data-modal="ordersModal">
        <div class="modal-card">
          <header class="modal-header">
            <div>
              <h3 class="modal-title">Миний захиалга</h3>
            </div>
            <button class="icon-btn close-modal" data-close="ordersModal">×</button>
          </header>
          <div class="modal-body modal-scroll history-list" data-history="orders">
            ${this.buildHistoryMarkup(orderHistory, 'Захиалга байхгүй')}
          </div>
        </div>
      </div>

      <div class="modal-backdrop" data-modal="deliveryModal">
        <div class="modal-card">
          <header class="modal-header">
            <div>
              <h3 class="modal-title">Миний хүргэлт</h3>
            </div>
            <button class="icon-btn close-modal" data-close="deliveryModal">×</button>
          </header>
          <div class="modal-body modal-scroll history-list" data-history="deliveries">
            ${this.buildHistoryMarkup(deliveryHistory, 'Хүргэлт байхгүй')}
          </div>
        </div>
      </div>
      <div class="history">
        <section class="btn-order" id="openOrderBtn">
          Миний захиалга
          <div class="history-inline" data-history="orders">
            ${this.buildHistoryMarkup(orderHistory, 'Захиалга байхгүй')}
          </div>
        </section>
        <section class="btn-delivery" id="openDeliveryBtn">
          Миний хүргэлт
          <div class="history-inline" data-history="deliveries">
            ${this.buildHistoryMarkup(deliveryHistory, 'Хүргэлт байхгүй')}
          </div>
        </section>
      </div>
    `;

    this.bindProfileData();
    this.attachNavigation();
    this.attachModalHandlers();
    this.hydrateProfileFromApi();
    this.loadActiveOrder();
    this.loadOrderStats();
    this.handleReviewsUpdated = this.loadReviews.bind(this);
    window.addEventListener("reviews-updated", this.handleReviewsUpdated);
    this.loadReviews();
    this.loadOrderHistory();
    this.loadDeliveryHistory();
  }

  disconnectedCallback() {
    if (this.handleReviewsUpdated) {
      window.removeEventListener("reviews-updated", this.handleReviewsUpdated);
    }
  }

  loadProfileData() {
    return {
      name: '',
      phone: '',
      email: '',
      id: '',
      avatar: 'assets/img/profile.jpg',
    };
  }

  async hydrateProfileFromApi() {
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) return;
      const data = await res.json();
      const user = data?.user;
      if (!user) return;
      this.profileData = {
        ...this.profileData,
        name: user.name || this.profileData.name,
        phone: user.phone || this.profileData.phone,
        id: user.student_id || this.profileData.id,
        avatar: user.avatar || this.profileData.avatar,
      };
      this.bindProfileData();
    } catch (e) {
      // ignore
    }
  }

  getActiveOrders() {
    return [];
  }

  getReviews() {
    return [];
  }

  getOrderHistory() {
    return [];
  }

  getDeliveryHistory() {
    return [];
  }

  buildActiveOrdersMarkup(orders) {
    if (!orders.length) {
      return '<span class="pill pill--muted">Идэвхтэй захиалга алга</span>';
    }
    return orders.map((order) => {
      const route = [order.from, order.to].filter(Boolean).join(' → ');
      const item = order.item ? ` · ${order.item}` : '';
      return `<span class="pill pill--order">${route || 'Шинэ захиалга'}${item}</span>`;
    }).join('');
  }

  buildReviewsMarkup(list) {
    if (!list.length) {
      return `<p class="muted">Сэтгэгдэл байхгүй</p>`;
    }
    const safeItems = list
      .map((r) => ({ ...r, safeText: this.cleanReviewText(r.text) }))
      .filter((r) => r.safeText);
    if (!safeItems.length) {
      return `<p class="muted">Сэтгэгдэл байхгүй</p>`;
    }
    return safeItems.map((r) => `
      <div class="review">
        <div>
          <p>${r.safeText}</p>
        </div>
        <span class="stars" aria-label="${r.stars} од">${this.toStars(r.stars)}</span>
      </div>
    `).join('');
  }

  escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  cleanReviewText(value) {
    const raw = String(value ?? "").trim();
    if (!raw) return "";
    if (/<[^>]*>/.test(raw)) return "";
    if (/&lt;|&gt;|&#60;|&#62;/i.test(raw)) return "";
    return this.escapeHtml(raw);
  }

  buildHistoryMarkup(list, emptyText) {
    if (!list.length) {
      return `<div class="muted">${emptyText}</div>`;
    }
    return list.map((item, idx) => {
      const icon = this.getHistoryIcon(idx);
      return `
      <div class="history-card">
        <div class="history-icon" aria-hidden="true">
          <img src="${icon}" alt="" width="32" height="32" decoding="async">
        </div>
        <div class="history-info">
          <h4>${item.title}</h4>
          <p class="muted">${item.detail}</p>
        </div>
        <div class="history-price">${item.price || ''}</div>
      </div>
    `;
    }).join('');
  }

  formatPrice(amount) {
    return Number(amount || 0).toLocaleString("mn-MN") + "₮";
  }

  formatHistoryDetail(item) {
    const ts = this.getOrderTimestamp(item);
    if (!ts) return "";
    const dt = new Date(ts);
    return `${dt.toLocaleDateString()} · ${dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }

  async loadOrderHistory() {
    try {
      if (this.currentUser?.role && this.currentUser.role !== "customer") {
        this.updateHistoryUI("orders", [], "Захиалга байхгүй");
        return;
      }
      this.updateHistoryMessage("orders", "Ачааллаж байна...");
      const res = await fetch("/api/orders/history/customer", { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return;
      const items = Array.isArray(data?.items) ? data.items : [];
      const list = items.map((item) => ({
        title: `${item.from_name || ""} → ${item.to_name || ""}`.trim(),
        detail: this.formatHistoryDetail(item),
        price: this.formatPrice(item.total_amount || 0),
      }));
      this.updateHistoryUI("orders", list, "Захиалга байхгүй");
    } catch (e) {
      this.updateHistoryMessage("orders", "Ачааллаж чадсангүй");
    }
  }

  async loadDeliveryHistory() {
    try {
      if (this.currentUser?.role && this.currentUser.role !== "courier") {
        this.updateHistoryUI("deliveries", [], "Хүргэлт байхгүй");
        return;
      }
      this.updateHistoryMessage("deliveries", "Ачааллаж байна...");
      const res = await fetch("/api/orders/history/courier", { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return;
      const items = Array.isArray(data?.items) ? data.items : [];
      const list = items.map((item) => ({
        title: `${item.from_name || ""} → ${item.to_name || ""}`.trim(),
        detail: this.formatHistoryDetail(item),
        price: this.formatPrice(item.total_amount || 0),
      }));
      this.updateHistoryUI("deliveries", list, "Хүргэлт байхгүй");
    } catch (e) {
      this.updateHistoryMessage("deliveries", "Ачааллаж чадсангүй");
    }
  }

  updateHistoryUI(type, list, emptyText) {
    const html = this.buildHistoryMarkup(list, emptyText);
    this.querySelectorAll(`[data-history="${type}"]`).forEach((el) => {
      el.innerHTML = html;
    });
  }

  updateHistoryMessage(type, message) {
    const html = `<div class="muted">${this.escapeHtml(message)}</div>`;
    this.querySelectorAll(`[data-history="${type}"]`).forEach((el) => {
      el.innerHTML = html;
    });
  }

  getHistoryIcon(idx = 0) {
    const icons = [
      'assets/img/document.svg',
      'assets/img/tor.svg',
      'assets/img/box.svg',
    ];
    return icons[idx % icons.length];
  }



  bindProfileData() {
    const { name, phone, email, id, avatar } = this.profileData;
    const nameEls = this.querySelectorAll('.profile-name');
    nameEls.forEach((el) => { el.textContent = name; });

    const phoneEl = this.querySelector('.profile-phone');
    if (phoneEl) {
      phoneEl.textContent = phone;
      const row = phoneEl.closest('div');
      if (row) row.style.display = phone ? '' : 'none';
    }

    const emailEl = this.querySelector('.profile-email');
    if (emailEl) {
      emailEl.textContent = email;
      const row = emailEl.closest('div');
      if (row) row.style.display = email ? '' : 'none';
    }

    const idEl = this.querySelector('.profile-id');
    if (idEl) {
      idEl.textContent = id;
      const row = idEl.closest('div');
      if (row) row.style.display = id ? '' : 'none';
    }

    const avatarEl = this.querySelector('.profile-avatar');
    if (avatarEl) avatarEl.src = avatar || 'assets/img/profile.jpg';

    const form = this.querySelector('#profileForm');
    if (form) {
      form.name.value = name;
      form.phone.value = phone;
      form.email.value = email;
      form.id.value = id;
      form.avatar.value = avatar || '';
    }
  }

  attachNavigation() {
    const navButtons = this.querySelectorAll('[data-nav]');
    navButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-nav');
        if (target) {
          location.hash = target;
        }
      });
    });
  }

  attachModalHandlers() {
    const editBtn = this.querySelector('#editProfileBtn');
    if (editBtn) {
      editBtn.addEventListener('click', () => this.toggleModal('profileModal', true));
    }

    this.querySelectorAll('[data-modal-open]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-modal-open');
        this.toggleModal(id, true);
      });
    });

    const reviewBtn = this.querySelector('.open-reviews');
    if (reviewBtn) {
      reviewBtn.addEventListener('click', () => this.toggleModal('reviewsModal', true));
    }

    this.querySelectorAll('.close-modal').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-close');
        this.toggleModal(id, false);
      });
    });

    this.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          const id = backdrop.getAttribute('data-modal');
          this.toggleModal(id, false);
        }
      });
    });

    const form = this.querySelector('#profileForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.profileData = {
          ...this.profileData,
          name: form.name.value.trim(),
          phone: form.phone.value.trim(),
          email: form.email.value.trim(),
          id: form.id.value.trim(),
          avatar: this.profileData.avatar,
        };
        this.saveProfileToApi();
        this.bindProfileData();
        window.dispatchEvent(new Event('user-updated'));
        this.toggleModal('profileModal', false);
      });
    }
  }

  async loadReviews() {
    try {
      if (this.currentUser?.role !== "courier") {
        this.updateReviewsUI([]);
        return;
      }

      const courierRes = await fetch(`/api/ratings/courier/${this.currentUser.id}`);
      if (!courierRes.ok) return;
      const courierData = await courierRes.json();
      const items = Array.isArray(courierData?.items) ? courierData.items : [];
      const reviews = items.map((r) => ({
        text: r.comment || "",
        stars: r.stars,
      }));
      this.updateReviewsUI(reviews);
      this.updateAverageRating(courierData?.courier?.rating_avg);
    } catch (e) {
      console.error("Load reviews error:", e);
    }
  }

  updateReviewsUI(reviews) {
    const content = this.buildReviewsMarkup(reviews);
    const lists = this.querySelectorAll(".review-list");
    if (lists[0]) lists[0].innerHTML = content;
    if (lists[1]) lists[1].innerHTML = content;
  }

  toStars(value) {
    const count = Math.max(0, Math.min(5, Number(value) || 0));
    return "★★★★★".slice(0, count) + "☆☆☆☆☆".slice(0, 5 - count);
  }

  updateAverageRating(avg) {
    const starsWrap = this.querySelector(".avg-stars");
    const textEl = this.querySelector(".avg-rating-text");
    if (!starsWrap || !textEl) return;

    const safeAvg = Math.max(0, Math.min(5, Number(avg) || 0));
    const filledCount = Math.round(safeAvg);
    const stars = starsWrap.querySelectorAll("span");
    stars.forEach((star, idx) => {
      star.classList.toggle("dim", idx >= filledCount);
    });
    starsWrap.setAttribute("aria-label", `${safeAvg.toFixed(1)} од`);
    textEl.textContent = `${safeAvg.toFixed(1)} / 5`;
  }

  async saveProfileToApi() {
    try {
      await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: this.profileData.name,
          phone: this.profileData.phone,
          studentId: this.profileData.id,
          avatar: this.profileData.avatar,
        }),
      });
    } catch (e) {
      // ignore
    }
  }

  async loadActiveOrder() {
    try {
      const res = await fetch("/api/active-order");
      if (!res.ok) return;
      const data = await res.json();
      const order = data?.order;
      if (!order) return;
      const activeOrdersMarkup = this.buildActiveOrdersMarkup([order]);
      const pillWrap = this.querySelector(".pill");
      if (pillWrap) {
        pillWrap.outerHTML = activeOrdersMarkup;
      }
    } catch (e) {
      // ignore
    }
  }

  async loadOrderStats() {
    const totalEl = this.querySelector("#orderTotal");
    if (!totalEl) return;

    const userId = this.currentUser?.id;
    if (!userId) return;

    try {
      const res = await fetch(`/api/orders?customerId=${encodeURIComponent(userId)}`, {
        credentials: "include",
      });
      const data = await res.json().catch(() => []);
      if (!res.ok || !Array.isArray(data)) return;

      const total = data.length;
      totalEl.textContent = String(total);
    } catch (e) {
      // ignore
    }
  }

  getOrderTimestamp(o) {
    const raw =
      o.scheduled_at ||
      o.scheduledAt ||
      o.created_at ||
      o.createdAt ||
      o.meta ||
      null;
    return this.parseDate(raw);
  }

  parseDate(val) {
    if (!val) return null;
    const parsed = Date.parse(val);
    if (!Number.isNaN(parsed)) return parsed;

    const m = String(val).match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4}).*?(\d{1,2}:\d{2}\s*[AP]M)/i);
    if (m) {
      const [_, mm, dd, yyRaw, time] = m;
      const yy = yyRaw.length === 2 ? `20${yyRaw}` : yyRaw;
      const d = new Date(`${yy}-${mm}-${dd} ${time}`);
      if (!Number.isNaN(d.getTime())) return d.getTime();
    }

    return null;
  }

  toggleModal(id, open) {
    const modal = this.querySelector(`[data-modal="${id}"]`);
    if (!modal) return;
    modal.classList.toggle('open', open);
  }
}

customElements.define('profile-page', ProfilePage);
