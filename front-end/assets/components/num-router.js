class NumRouter extends HTMLElement {
  connectedCallback() {
    this._views = Array.from(this.querySelectorAll('[data-route]'));
    this._current = null;
    window.addEventListener('hashchange', () => this.applyRoute());
    this.applyRoute();
  }

  applyRoute() {
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

    prev.hidden = true;
    prev.classList.remove('is-active');

    next.hidden = false;
    next.classList.add('is-active');
  }
}

customElements.define('num-router', NumRouter);
