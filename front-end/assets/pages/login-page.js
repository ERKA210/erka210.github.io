import { apiFetch } from "../api_client.js";

class LoginPage extends HTMLElement {
  connectedCallback() {
    this.currentMode = "login";
    this.currentRole = "customer";
    this.innerHTML = `
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
        <form class="auth-layout">
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
      </div>
  <div class="scene">
    <div class="delivery-man">
      <div class="head"></div>
      <div class="body"></div>

      <div class="arm left"></div>
      <div class="arm right"></div>

      <div class="leg left"></div>
      <div class="leg right"></div>

      <div class="box">📦</div>
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
          const res = await apiFetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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
            console.warn("login failed", res.status);
          }

          const data = await res.json();

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

          if (serverRole === "courier" && userKey) {
            const paidKey = `courierPaid:${userKey}`;
            const paid = localStorage.getItem(paidKey) === "1" ? "1" : "0";
            localStorage.setItem("courierPaid", paid);
          } else {
            localStorage.setItem("courierPaid", "0");
          }



          if (role === "courier") {
            if (localStorage.getItem("courierPaid") !== "1") {
              localStorage.setItem("courierPaid", "0");
            }
          } else {
            localStorage.setItem("courierPaid", "0");
          }

          window.dispatchEvent(new Event("user-updated"));



          // customer
          const hasDraft = localStorage.getItem("pendingOrderDraft");
          location.hash = hasDraft ? "#home" : "#profile";
          return;


        } catch (err) {
          const msg = String(err?.message || "");
          if (msg.includes("users_phone_key")) {
            alert("Энэ утас бүртгэлтэй байна. Нэвтрэх горимоор орно уу.");
            const loginTab = this.querySelector('.auth-tabs .tab-btn[data-mode="login"]');
            if (loginTab) loginTab.click();
            return;
          }
          alert(msg || "Нэвтрэх үед алдаа гарлаа");
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
