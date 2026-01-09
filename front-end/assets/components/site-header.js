class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.render = this.render.bind(this);
    this.updateActive = this.updateActive.bind(this);
    this.handleDocClick = this.handleDocClick.bind(this);
    this.handleUserUpdated = this.handleUserUpdated.bind(this);
    this.handleAppStateChanged = this.handleAppStateChanged.bind(this);
    this.loadUser = this.loadUser.bind(this);

    this.render();

    window.addEventListener('hashchange', this.updateActive);
    window.addEventListener('user-updated', this.handleUserUpdated);
    window.addEventListener('app-state-changed', this.handleAppStateChanged);
    this.loadUser();
    this.updateActive();
  }

  disconnectedCallback() {
    window.removeEventListener('hashchange', this.updateActive);
    window.removeEventListener('user-updated', this.handleUserUpdated);
    window.removeEventListener('app-state-changed', this.handleAppStateChanged);
    document.removeEventListener('click', this.handleDocClick);
  }

  getAppState() {
    const state = localStorage.getItem("appState");
    if (state === "customer" || state === "courier") return state;
    const role = localStorage.getItem("authRole");
    if (role === "customer" || role === "courier") return role;
    return "guest";
  }

  getNavLinks() {
    const state = this.getAppState();
    const links = [];

    if (state === "customer") {
      links.push({ href: "#home", label: "Нүүр", icon: "home" });
      links.push({ href: "#orders", label: "Захиалга", icon: "orders" });
    }
    if (state === "courier") {
      links.push({ href: "#home", label: "Нүүр", icon: "home" });
      links.push({ href: "#delivery", label: "Хүргэлт", icon: "delivery" });
    }
    if (state !== "guest") {
      links.push({ href: "#profile", label: "Профайл", icon: "profile" });
    }

    return links;
  }

  renderNavLinks() {
    const links = this.getNavLinks();
    return links.map((link) => `
      <a href="${link.href}">
        ${this.getIcon(link.icon)}
        <span>${link.label}</span>
      </a>
    `).join("");
  }

  getIcon(name) {
    switch (name) {
      case "orders":
        return `
          <svg width="27" height="28" viewBox="0 0 27 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.4" d="M8.26012 21.9703C9.1827 21.9703 9.93865 22.7536 9.93883 23.7213C9.93883 24.6776 9.18281 25.4615 8.26012 25.4615C7.32644 25.4613 6.57066 24.6775 6.57066 23.7213C6.57084 22.7537 7.32655 21.9704 8.26012 21.9703ZM20.767 21.9703C21.6894 21.9704 22.4455 22.7536 22.4457 23.7213C22.4457 24.6775 21.6896 25.4614 20.767 25.4615C19.8331 25.4615 19.0765 24.6776 19.0765 23.7213C19.0767 22.7536 19.8333 21.9703 20.767 21.9703Z" fill="#B8BABF"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M22.4456 7.31518C23.1237 7.31518 23.5684 7.55713 24.0131 8.08714C24.4577 8.61714 24.5356 9.37757 24.4355 10.0677L23.3794 17.626C23.1793 19.0789 21.9787 20.1493 20.5669 20.1493H8.4385C6.95997 20.1493 5.73713 18.9741 5.61485 17.4543L4.5921 4.89445L2.91348 4.59489C2.46881 4.51423 2.15754 4.06488 2.23535 3.60401C2.31317 3.13162 2.74672 2.82053 3.20251 2.88966L5.85386 3.30445C6.23182 3.37473 6.50974 3.69619 6.54309 4.08793L6.75431 6.66881C6.78766 7.03865 7.0767 7.31518 7.43243 7.31518H22.4456ZM15.7089 13.3053H18.7882C19.2551 13.3053 19.622 12.9136 19.622 12.4412C19.622 11.9573 19.2551 11.5771 18.7882 11.5771H15.7089C15.242 11.5771 14.8751 11.9573 14.8751 12.4412C14.8751 12.9136 15.242 13.3053 15.7089 13.3053Z" fill="#B8BABF"/>
          </svg>
        `;
      case "delivery":
        return `
          <svg width="32" height="28" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.4385 0C23.7214 0 23.9933 0.132431 24.1934 0.368164C24.3933 0.603844 24.5058 0.923595 24.5059 1.25684V3.77051H27.7051C27.9137 3.77053 28.1178 3.84327 28.292 3.97852C28.4662 4.11392 28.6033 4.30714 28.6855 4.5332L31.8857 13.332C31.9426 13.4884 31.9716 13.657 31.9717 13.8271V22.626C31.9717 22.9594 31.8592 23.2789 31.6592 23.5146C31.4592 23.7503 31.1881 23.8828 30.9053 23.8828H28.6201C28.3881 24.9616 27.8576 25.9191 27.1123 26.6025C26.3672 27.2857 25.4499 27.6561 24.5059 27.6562C23.5616 27.6562 22.6437 27.2859 21.8984 26.6025C21.1531 25.9191 20.6227 24.9616 20.3906 23.8828H13.6875C13.4279 25.0676 12.8105 26.1003 11.9512 26.7871C11.0917 27.4739 10.0487 27.7685 9.01855 27.6143C7.98863 27.46 7.04187 26.8681 6.35547 25.9502C5.66899 25.0319 5.29004 23.8498 5.29004 22.626C5.29004 21.4022 5.66899 20.22 6.35547 19.3018C7.04187 18.3838 7.98864 17.7919 9.01855 17.6377C10.0487 17.4835 11.0917 17.778 11.9512 18.4648C12.8105 19.1517 13.4279 20.1843 13.6875 21.3691H20.3906C20.533 20.7285 20.781 20.1268 21.1211 19.5996C21.4612 19.0725 21.8864 18.6299 22.3721 18.2969V2.51367H6.37207V0H23.4385Z" fill="#C4C4C4"/>
          </svg>
        `;
      case "profile":
        return `
          <svg width="27" height="28" viewBox="0 0 27 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.3403 17.4831C18.1633 17.4831 22.2338 18.2955 22.2338 21.4294C22.2338 24.5644 18.1366 25.3483 13.3403 25.3483C8.51842 25.3483 4.44703 24.5357 4.44672 21.402C4.44672 18.2669 8.54382 17.4831 13.3403 17.4831ZM13.3403 2.30438C16.6075 2.30447 19.225 5.01714 19.225 8.40106C19.2248 11.7848 16.6074 14.4977 13.3403 14.4977C10.0742 14.4977 7.45476 11.7848 7.45453 8.40106C7.45453 5.01708 10.0741 2.30438 13.3403 2.30438Z" fill="#B8BABF"/>
          </svg>
        `;
      case "home":
      default:
        return `
          <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M26.0821 10.6965L14.9138 0.573094C14.9084 0.568518 14.9032 0.563588 14.8985 0.55834C14.4873 0.199078 13.9515 0 13.3956 0C12.8398 0 12.304 0.199078 11.8928 0.55834L11.8775 0.573094L0.72175 10.6965C0.494193 10.8975 0.31255 11.1417 0.188313 11.4137C0.0640769 11.6856 -4.69666e-05 11.9794 2.58096e-08 12.2764V24.6758C2.58096e-08 25.2449 0.235331 25.7907 0.654222 26.1932C1.07311 26.5956 1.64125 26.8217 2.23366 26.8217H8.93462C9.52702 26.8217 10.0952 26.5956 10.5141 26.1932C10.9329 25.7907 11.1683 25.2449 11.1683 24.6758V18.238H15.6356V24.6758C15.6356 25.2449 15.8709 25.7907 16.2898 26.1932C16.7087 26.5956 17.2768 26.8217 17.8692 26.8217H24.5702C25.1626 26.8217 25.7307 26.5956 26.1496 26.1932C26.5685 25.7907 26.8039 25.2449 26.8039 24.6758V12.2764C26.8039 11.9794 26.7398 11.6856 26.6156 11.4137C26.4913 11.1417 26.3097 10.8975 26.0821 10.6965ZM24.5702 24.6758H17.8692V18.238C17.8692 17.6689 17.6339 17.1231 17.215 16.7206C16.7961 16.3182 16.228 16.0921 15.6356 16.0921H11.1683C10.5759 16.0921 10.0077 16.3182 9.58884 16.7206C9.16995 17.1231 8.93462 17.6689 8.93462 18.238V24.6758H2.23366V12.2764L2.24901 12.263L13.4019 2.14364L24.5562 12.2603L24.5716 12.2737L24.5702 24.6758Z" fill="#A6A6A6"/>
          </svg>
        `;
    }
  }

  render() {
    const isAuthed = Boolean(this.currentUser);

    document.removeEventListener("click", this.handleDocClick);

    const logoPng = "assets/img/logo_light_last.png";
    const logoWebp = "assets/img/logo_light_last.webp";

    this.innerHTML = `
      <header class="site-top">
        <div class="brand">
          <picture>
            <source srcset="${logoWebp}" type="image/webp" />
            <img src="${logoPng}" alt="Logo" class="brand-logo" width="250" height="74" decoding="async" />
          </picture>
        </div>

        <nav class="top-menu">
          ${this.renderNavLinks()}
        </nav>

        <div class="header-actions">
          ${isAuthed
        ? `
                <div class="avatar-menu">
                  <button class="avatar-btn" type="button" aria-label="Профайл цэс нээх"></button>
                  <div class="avatar-dropdown" role="menu" aria-label="Профайл цэс">
                    <button class="avatar-action avatar-logout" type="button" role="menuitem">Гарах</button>
                  </div>
                </div>
                <button class="logout-btn" type="button">Гарах</button>
              `
        : `<button class="login-btn" type="button">Нэвтрэх</button>`
      }
        </div>
      </header>
    `;

    const loginBtn = this.querySelector(".login-btn");
    if (loginBtn) {
      loginBtn.addEventListener("click", () => {
        location.hash = "#login";
      });
    }

    if (window.matchMedia) {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const logo = this.querySelector(".brand-logo");
      if (logo) {
        const updateLogo = () => {
          logo.src = logoPng;
        };
        updateLogo(media);
        if (media.addEventListener) {
          media.addEventListener("change", updateLogo);
        } else {
          media.addListener(updateLogo);
        }
      }
    }

    const avatarBtn = this.querySelector(".avatar-btn");
    if (avatarBtn) {
      avatarBtn.innerHTML = `<img src="assets/img/profile.jpg" alt="Профайл" width="40" height="40" decoding="async">`;
      avatarBtn.addEventListener("click", () => {
        location.hash = "#profile";
      });
    }

    const profileAction = this.querySelector(".avatar-action");
    if (profileAction) {
      profileAction.addEventListener("click", () => {
        location.hash = "#profile";
      });
    }

    const logoutHandlers = this.querySelectorAll(".avatar-logout, .logout-btn");
    logoutHandlers.forEach((logoutBtn) => {
      logoutBtn.addEventListener("click", async () => {
        try {
          await fetch("/api/auth/logout", { method: "POST" });
        } catch (e) {
          // ignore
        }
        localStorage.removeItem("auth_token");

        localStorage.removeItem("authLoggedIn");
        localStorage.removeItem("authRole");
        localStorage.removeItem("authPhone");
        localStorage.removeItem("authStudentId");
        localStorage.removeItem("courierPaid");
        localStorage.removeItem("courier_payment_paid");
        localStorage.removeItem("appState");
        localStorage.removeItem("deliveryActive");

        localStorage.setItem("courierPaid", "0");

        this.currentUser = null;
        window.dispatchEvent(new Event("user-updated"));
        location.hash = "#home";

      });
    });
  }

  handleDocClick(e) {
    if (!this.contains(e.target)) {
      this.classList.remove("profile-open");
    }
  }

  handleUserUpdated() {
    this.loadUser();
  }

  handleAppStateChanged() {
    this.render();
    this.updateActive();
  }

  async loadUser() {
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) {
        this.currentUser = null;
      } else {
        const data = await res.json();
        this.currentUser = data?.user || null;
      }
    } catch (e) {
      this.currentUser = null;
    }
    this.render();
    this.updateActive();
  }

  updateActive() {
    if (!location.hash) {
      history.replaceState(null, '', '#home');
    }

    const current = location.hash || '#home';
    const allowed = this.getNavLinks().map((link) => link.href);
    if (!allowed.length) return;
    if (!allowed.includes(current)) {
      location.hash = "#home";
      return;
    }

    this.querySelectorAll('.top-menu a').forEach(a => {
      const href = a.getAttribute('href');
      a.classList.toggle('is-active', href === current);
    });

  }
}

customElements.define('site-header', SiteHeader);
