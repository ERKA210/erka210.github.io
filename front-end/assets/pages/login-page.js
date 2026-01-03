class LoginPage extends HTMLElement {
  connectedCallback() {
    const API = "http://localhost:3000";
    this.currentMode = "login";
    this.currentRole = "customer";
    this.innerHTML = `
      <link rel="stylesheet" href="assets/css/login.css">
      <div class="card" role="dialog" aria-labelledby="login-title">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <div style="width:18px"></div>
          <strong id="login-title">Бүртгүүлэх</strong>
          <div class="close">✕</div>
        </div>

        <div class="auth-tabs" role="tablist" aria-label="Нэвтрэх эсвэл бүртгүүлэх">
          <button class="tab-btn is-active" type="button" data-mode="login" role="tab" aria-selected="true">
            Нэвтрэх
          </button>
          <button class="tab-btn" type="button" data-mode="register" role="tab" aria-selected="false">
            Бүртгүүлэх
          </button>
        </div>

        <div class="login-tabs-row">
          <div class="subtitle">
            Нэр болон нууц үгээ ашиглан нэвтэрнэ.
          </div>
           <div class="login-tabs register-only" role="tablist" aria-label="Бүртгэлийн төрөл">
            <button class="tab-btn is-active" type="button" data-role="customer" role="tab" aria-selected="true" aria-label="Хэрэглэгчээр">
              Хэрэглэгчээр
            </button>
            <button class="tab-btn" type="button" data-role="courier" role="tab" aria-selected="false" aria-label="Хүргэгчээр">
              Хүргэгчээр
            </button>
          </div>
        </div>

        <div class="auth-layout">
          <form>
          <input class="register-only" type="hidden" name="role" value="customer">
          <div class="form-group register-only">
            <label for="name">Нэр</label>
            <input id="name" name="name" type="text" placeholder="Нэр">
          </div>
          <div class="form-group">
            <label for="phone">Утасны дугаар</label>
            <input id="phone" name="phone" type="tel" placeholder="Утасны дугаар" required>
          </div>
          <div class="form-group register-only">
            <label for="studentId">ID</label>
            <input id="studentId" name="studentId" type="text" placeholder="ID">
          </div>
          <div class="form-group">
            <label for="password">Нууц үг</label>
            <input id="password" name="password" type="password" placeholder="••••••••" required>
          </div>

          <button class="continue-btn" type="submit">Бүртгүүлэх</button>

          <div class="privacy">Нууцлалын бодлого</div>

          <div class="or">эсвэл</div>

          <div class="social">
            <button type="button" class="btn-social">
              <img src="assets/img/num-logo.svg" alt="num-logo">
              SISI-ээр үргэлжлүүлэх
            </button>
          </div>
          </form>

          <div class="payment-section" hidden>
            <h4 class="section-title">Хүргэгчийн төлбөр</h4>
            <p class="section-note">Төлбөрөө сонгоод дараа нь төлнө үү.</p>
            <div class="plan-grid">
              <label class="plan-card">
                <input type="radio" name="paymentPlan" value="monthly" checked>
                <span>Сард 3000₮</span>
              </label>
              <label class="plan-card">
                <input type="radio" name="paymentPlan" value="two-months">
                <span>2 сард 5000₮</span>
              </label>
              <label class="plan-card">
                <input type="radio" name="paymentPlan" value="two-weeks">
                <span>14 хоногт 2000₮</span>
              </label>
            </div>
            <div class="method-grid">
              <label class="method-card">
                <input type="radio" name="paymentMethod" value="card" checked>
                <span>Картаар төлөх</span>
              </label>
              <label class="method-card">
                <input type="radio" name="paymentMethod" value="qpay">
                <span>QPay-р төлөх</span>
              </label>
            </div>
            <div class="payment-details payment-details--card">
              <div class="form-group">
                <label for="cardNumber">Картын дугаар</label>
                <input id="cardNumber" type="text" inputmode="numeric" placeholder="0000 0000 0000 0000">
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="cardExp">Дуусах хугацаа</label>
                  <input id="cardExp" type="text" placeholder="MM/YY">
                </div>
                <div class="form-group">
                  <label for="cardCvv">CVV</label>
                  <input id="cardCvv" type="password" inputmode="numeric" placeholder="***">
                </div>
              </div>
            </div>
            <div class="payment-details payment-details--qpay" hidden>
              <div class="qpay-box">
                <div class="qpay-qr">QR</div>
                <div>
                  <strong>QPay төлбөр</strong>
                  <p>QR код уншуулж төлнө үү.</p>
                </div>
              </div>
            </div>
            <div class="payment-actions">
              <button class="pay-btn" type="button">Төлбөр төлөх</button>
              <p class="pay-status" hidden>Төлбөр төлөгдсөн.</p>
            </div>
          </div>
        </div>
      </div>
    `;

    const form = this.querySelector("form");
    const closeBtn = this.querySelector(".close");
    const roleInput = this.querySelector("input[name='role']");
    const modeTabs = this.querySelectorAll(".auth-tabs .tab-btn");
    const roleTabs = this.querySelectorAll(".login-tabs .tab-btn");
    const loginTabs = this.querySelector(".login-tabs");
    const titleEl = this.querySelector("#login-title");
    const submitBtn = this.querySelector(".continue-btn");
    const subtitleEl = this.querySelector(".subtitle");
    const nameInput = this.querySelector("#name");
    const phoneInput = this.querySelector("#phone");
    const studentInput = this.querySelector("#studentId");
    const registerOnlyBlocks = this.querySelectorAll(".register-only");
    const paymentSection = this.querySelector(".payment-section");
    const paymentMethods = this.querySelectorAll('input[name="paymentMethod"]');
    const payBtn = this.querySelector(".pay-btn");
    const payStatus = this.querySelector(".pay-status");
    const isPaid = () =>
      localStorage.getItem("courierPaid") === "1";


    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        location.hash = "#home";
      });
    }

    modeTabs.forEach((btn) => {
      btn.addEventListener("click", () => {
        const mode = btn.getAttribute("data-mode") || "login";
        this.currentMode = mode;
        modeTabs.forEach((b) => {
          const isActive = b === btn;
          b.classList.toggle("is-active", isActive);
          b.setAttribute("aria-selected", isActive ? "true" : "false");
        });

        const isRegister = mode === "register";
        registerOnlyBlocks.forEach((el) => {
          el.style.display = isRegister ? "" : "none";
        });
        if (isRegister && roleInput) {
          roleInput.value = this.currentRole;
        }
        this.classList.remove("show-payment");
        if (paymentSection) paymentSection.hidden = true;
        if (payStatus) payStatus.hidden = true;
        if (payBtn) payBtn.disabled = false;
        if (nameInput) nameInput.required = isRegister;
        if (studentInput) studentInput.required = false;
        if (phoneInput) phoneInput.required = true;

        if (titleEl) titleEl.textContent = isRegister ? "Бүртгүүлэх" : "Нэвтрэх";
        if (submitBtn) {
          submitBtn.textContent = isRegister
            ? this.currentRole === "courier"
              ? "Хүргэгчээр бүртгүүлэх"
              : "Хэрэглэгчээр бүртгүүлэх"
            : "Нэвтрэх";
        }
        if (subtitleEl) {
          subtitleEl.textContent = isRegister
            ? "Нэр болон нууц үгээ ашиглан нэвтэрнэ."
            : "Утасны дугаар, нууц үгээ оруулна уу.";
        }
      });
    });

    roleTabs.forEach((btn) => {
      btn.addEventListener("click", () => {
        const role = btn.getAttribute("data-role") || "customer";
        this.currentRole = role;
        if (loginTabs) loginTabs.dataset.activeRole = role;
        roleTabs.forEach((b) => {
          const isActive = b === btn;
          b.classList.toggle("is-active", isActive);
          b.setAttribute("aria-selected", isActive ? "true" : "false");
        });
        if (roleInput) roleInput.value = role;
        if (titleEl) titleEl.textContent = "Бүртгүүлэх";
        if (submitBtn) {
          submitBtn.textContent = role === "courier" ? "Хүргэгчээр бүртгүүлэх" : "Хэрэглэгчээр бүртгүүлэх";
        }
        this.classList.remove("show-payment");
        if (paymentSection) paymentSection.hidden = true;
        if (payStatus) payStatus.hidden = true;
        if (payBtn) payBtn.disabled = false;
      });
    });

    const prefillMode = localStorage.getItem("login_prefill_mode");
    const prefillRole = localStorage.getItem("login_prefill_role");
    if (prefillMode) {
      this.currentMode = prefillMode === "register" ? "register" : "login";
      localStorage.removeItem("login_prefill_mode");
    }
    if (prefillRole) {
      this.currentRole = prefillRole === "courier" ? "courier" : "customer";
      localStorage.removeItem("login_prefill_role");
    }

    if (registerOnlyBlocks.length) {
      registerOnlyBlocks.forEach((el) => {
        el.style.display = this.currentMode === "register" ? "" : "none";
      });
    }
    if (loginTabs) loginTabs.dataset.activeRole = this.currentRole;
    if (roleInput) roleInput.value = this.currentRole;
    if (titleEl) titleEl.textContent = this.currentMode === "register" ? "Бүртгүүлэх" : "Нэвтрэх";
    if (submitBtn) {
      submitBtn.textContent =
        this.currentMode === "register"
          ? this.currentRole === "courier"
            ? "Хүргэгчээр бүртгүүлэх"
            : "Хэрэглэгчээр бүртгүүлэх"
          : "Нэвтрэх";
    }
    if (subtitleEl) {
      subtitleEl.textContent =
        this.currentMode === "register"
          ? "Нэр болон нууц үгээ ашиглан нэвтэрнэ."
          : "Утасны дугаар, нууц үгээ оруулна уу.";
    }
    if (nameInput) nameInput.required = this.currentMode === "register";

    if (payBtn) {
      payBtn.addEventListener("click", () => {
        localStorage.setItem("courierPaid", "1"); payBtn.disabled = true;
        if (payStatus) payStatus.hidden = false;
      });
    }

    if (paymentMethods.length && paymentSection) {
      paymentMethods.forEach((input) => {
        input.addEventListener("change", () => {
          const method = this.querySelector('input[name="paymentMethod"]:checked')?.value || "card";
          const card = this.querySelector(".payment-details--card");
          const qpay = this.querySelector(".payment-details--qpay");
          if (card) card.hidden = method !== "card";
          if (qpay) qpay.hidden = method !== "qpay";
        });
      });
    }

    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const password = this.querySelector("#password")?.value?.trim() || "";
        const isRegister = this.currentMode === "register";
        const isCourier = isRegister && (roleInput?.value || "customer") === "courier";
        const name = this.querySelector("#name")?.value?.trim() || "";
        const phone = this.querySelector("#phone")?.value?.trim() || "";
        const studentId = this.querySelector("#studentId")?.value?.trim() || "";
        const roleValue = roleInput?.value || this.currentRole || "customer";
        const role = isRegister && roleValue === "courier" ? "courier" : "customer";
        const fullName = name.trim() || "Зочин хэрэглэгч";

        try {
          const res = await fetch(`${API}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              name: fullName,
              phone,
              studentId,
              role,
              password,
              mode: this.currentMode,
            }),
          });

          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || "Нэвтрэх үед алдаа гарлаа");
          }

          const data = await res.json();

          // ✅ auth state (server role/identity ашиглана)
          const serverRole =
            (data?.user?.role || data?.role || roleValue || role || "customer") === "courier"
              ? "courier"
              : "customer";

          const serverPhone = String(data?.user?.phone || phone || "").trim();
          const serverStudentId = String(data?.user?.student_id || data?.user?.studentId || studentId || "").trim();
          const userKey = (serverStudentId || serverPhone).trim();

          localStorage.setItem("authLoggedIn", "1");
          localStorage.setItem("authRole", serverRole);
          localStorage.setItem("authPhone", serverPhone);
          localStorage.setItem("authStudentId", serverStudentId);
          localStorage.setItem("authUserKey", userKey);

          // ✅ courierPaid-г per-user key-ээс сэргээнэ
          if (serverRole === "courier" && userKey) {
            const paidKey = `courierPaid:${userKey}`;
            const paid = localStorage.getItem(paidKey) === "1" ? "1" : "0";
            localStorage.setItem("courierPaid", paid);
          } else {
            localStorage.setItem("courierPaid", "0");
          }



          // ✅ courierPaid-г default 0 болгож тогтооно (null биш)
          if (role === "courier") {
            if (localStorage.getItem("courierPaid") !== "1") {
              localStorage.setItem("courierPaid", "0");
            }
          } else {
            localStorage.setItem("courierPaid", "0");
          }

          window.dispatchEvent(new Event("user-updated"));

          if (serverRole === "courier") {
            location.hash = localStorage.getItem("courierPaid") === "1" ? "#delivery" : "#pay";
            return;
          }


          // customer
          const hasDraft = localStorage.getItem("pendingOrderDraft");
          location.hash = hasDraft ? "#home" : "#profile";
          return;


        } catch (err) {
          alert(err.message || "Нэвтрэх үед алдаа гарлаа");
        }
      });
    }
  }

  normalizeName(value) {
    const raw = String(value || "").trim();
    if (!raw) return "Зочин хэрэглэгч";
    const tokens = raw.split(/\s+/).filter((t) => t && t.length > 1);
    return tokens.length ? tokens.join(" ") : raw;
  }
}

customElements.define('login-page', LoginPage);
