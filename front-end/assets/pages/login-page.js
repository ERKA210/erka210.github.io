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

        <div class="subtitle">
          Бид таны дугаарыг баталгаажуулахын тулд утсаар залгах эсвэл мессеж илгээх болно.
        </div>

        <div class="auth-layout">
          <form>
          <div class="register-only">
            <div class="login-tabs" role="tablist" aria-label="Бүртгэлийн төрөл">
              <button class="tab-btn is-active" type="button" data-role="customer" role="tab" aria-selected="true">
                Хэрэглэгчээр
              </button>
              <button class="tab-btn" type="button" data-role="courier" role="tab" aria-selected="false">
                Хүргэгчээр
              </button>
            </div>
            <input type="hidden" name="role" value="customer">
          </div>
          <div class="form-group register-only">
            <label for="name">Нэр</label>
            <input id="name" name="name" type="text" placeholder="Нэр" required>
          </div>

          <div class="form-group">
            <label for="phone">Утасны дугаар</label>
            <div class="phone-wrap">
              <div class="country">
                <select name="country">
                  <option value="+976">Монгол (+976)</option>
                </select>
              </div>
              <input id="phone" class="phone" type="tel" name="phone" required placeholder="Phone number">
            </div>
          </div>

          <div class="form-group register-only">
            <label for="studentId">Оюутны ID</label>
            <input id="studentId" name="studentId" type="text" placeholder="23b1num0245" required>
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
    const titleEl = this.querySelector("#login-title");
    const submitBtn = this.querySelector(".continue-btn");
    const subtitleEl = this.querySelector(".subtitle");
    const nameInput = this.querySelector("#name");
    const studentInput = this.querySelector("#studentId");
    const registerOnlyBlocks = this.querySelectorAll(".register-only");
    const paymentSection = this.querySelector(".payment-section");
    const paymentMethods = this.querySelectorAll('input[name="paymentMethod"]');
    const payBtn = this.querySelector(".pay-btn");
    const payStatus = this.querySelector(".pay-status");
    const isPaid = () => localStorage.getItem("courier_payment_paid") === "true";

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
        this.classList.remove("show-payment");
        if (paymentSection) paymentSection.hidden = true;
        if (payStatus) payStatus.hidden = true;
        if (payBtn) payBtn.disabled = false;
        if (nameInput) nameInput.required = isRegister;
        if (studentInput) studentInput.required = isRegister;

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
            ? "Бид таны дугаарыг баталгаажуулахын тулд утсаар залгах эсвэл мессеж илгээх болно."
            : "Утасны дугаар, нууц үгээ оруулна уу.";
        }
      });
    });

    roleTabs.forEach((btn) => {
      btn.addEventListener("click", () => {
        const role = btn.getAttribute("data-role") || "customer";
        this.currentRole = role;
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

    if (registerOnlyBlocks.length) {
      registerOnlyBlocks.forEach((el) => {
        el.style.display = "none";
      });
    }
    if (titleEl) titleEl.textContent = "Нэвтрэх";
    if (submitBtn) submitBtn.textContent = "Нэвтрэх";
    if (subtitleEl) subtitleEl.textContent = "Утасны дугаар, нууц үгээ оруулна уу.";

    if (payBtn) {
      payBtn.addEventListener("click", () => {
        localStorage.setItem("courier_payment_paid", "true");
        payBtn.disabled = true;
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
        const phone = this.querySelector("#phone")?.value?.trim() || "";
        const password = this.querySelector("#password")?.value?.trim() || "";
        const isRegister = this.currentMode === "register";
        const isCourier = isRegister && (roleInput?.value || "customer") === "courier";
        const name = isRegister ? this.querySelector("#name")?.value?.trim() || "Нэргүй" : "Нэргүй";
        const idVal = isRegister ? this.querySelector("#studentId")?.value?.trim() || "" : "";
        const role = isRegister ? roleInput?.value || "customer" : "customer";

        if (isCourier && paymentSection) {
          if (paymentSection.hidden) {
            paymentSection.hidden = false;
            this.classList.add("show-payment");
            if (paymentMethods.length) {
              paymentMethods[0].dispatchEvent(new Event("change"));
            }
          }
          if (isPaid()) {
            if (payStatus) payStatus.hidden = false;
            if (payBtn) payBtn.disabled = true;
          } else {
            return;
          }
        }

        const fullName = name.trim() || "Зочин хэрэглэгч";

        try {
          const res = await fetch(`${API}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              name: fullName,
              phone,
              studentId: idVal,
              role,
              password,
            }),
          });

          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || "Нэвтрэх үед алдаа гарлаа");
          }

          const data = await res.json();
          window.dispatchEvent(new Event("user-updated"));

          const hasDraft = localStorage.getItem("pendingOrderDraft");
          location.hash = hasDraft ? "#home" : "#profile";
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
