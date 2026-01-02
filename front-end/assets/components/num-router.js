class NumRouter extends HTMLElement {
  connectedCallback() {
    this._views = Array.from(this.querySelectorAll('[data-route]'));
    this._current = null;
    this._durationMs = 240;
    this._loadedRoutes = new Set();
    window.addEventListener('hashchange', () => this.applyRoute());
    this.applyRoute();
  }

  async applyRoute() {
    const hash = (location.hash || '#home').replace('#', '') || 'home';
    const role = localStorage.getItem("authRole");
    const paid = localStorage.getItem("courierPaid");
    const loggedIn = localStorage.getItem("authLoggedIn");
    const appState = localStorage.getItem("appState") || "guest";

    if (appState === "courier" && hash === "orders") {
      alert("Хүргэлт хийж байх үед захиалгын хэсэгт орох боломжгүй");
      location.hash = "#home";
      return;
    }

    if (appState === "customer" && hash === "delivery") {
      alert("Захиалга өгсөн үед хүргэлтийн хэсэгт орох боломжгүй");
      location.hash = "#home";
      return;
    }

    if (hash === "delivery") {
      if (loggedIn !== "1") {
        alert("Энэ хэсэг зөвхөн хүргэгчид нээлттэй");
        location.hash = "#login";
        return;
      }
      if (role !== "courier") {
        alert("Энэ хэсэг зөвхөн хүргэгчид нээлттэй");
        location.hash = "#home";
        return;
      }
      if (paid !== "1") {
        alert("Төлбөр төлсний дараа хүргэлтийн хэсэг нээгдэнэ");
        location.hash = "#pay";
        return;
      }
    }

    await this.loadRoute(hash);

    const next = this._views.find((section) => section.dataset.route === hash);
    if (!next) {
      return;
    }

    if (!this._current) {
      this._views.forEach((section) => {
        const isActive = section === next;
        section.hidden = !isActive;
        section.classList.toggle('is-active', isActive);
        section.classList.remove('is-leaving');
      });
      this._current = next;
      return;
    }

    if (this._current === next) {
      return;
    }

    const prev = this._current;
    this._current = next;

    prev.hidden = false;
    prev.classList.remove('is-active');
    prev.classList.add('is-leaving');

    next.hidden = false;
    next.classList.remove('is-leaving');
    next.classList.remove('is-active');

    requestAnimationFrame(() => {
      next.classList.add('is-active');
    });

    clearTimeout(this._leaveTimer);
    this._leaveTimer = setTimeout(() => {
      prev.hidden = true;
      prev.classList.remove('is-leaving');
    }, this._durationMs);
  }

  async loadRoute(route) {
    if (this._loadedRoutes.has(route)) return;
    const loaders = {
      home: () => Promise.all([
        import('../pages/home-page.js'),
        import('./date-time-picker.js'),
        import('./sh-cart.js'),
        import('./offer-list.js'),
        import('./delivery-cart.js'),
        import('./offer-modal.js'),
      ]),
      delivery: () => Promise.all([
        import('../pages/delivery-page.js'),
        import('./d-orders.js'),
        import('./del-order-details.js'),
        import('./del-order-progress.js'),
        import('./person-detail.js'),
      ]),
      orders: () => Promise.all([
        import('../pages/orders-page.js'),
        import('./courier-card.js'),
        import('./rating.js'),
      ]),
      profile: () => import('../pages/profile-page.js'),
      pay: () => import('../pages/pay-page.js'),
      login: () => import('../pages/login-page.js'),
    };
    const loader = loaders[route];
    if (!loader) return;
    try {
      await loader();
      this._loadedRoutes.add(route);
    } catch (e) {
      console.error("Route load failed:", route, e);
    }
  }
}

customElements.define('num-router', NumRouter);
