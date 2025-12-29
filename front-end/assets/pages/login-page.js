class LoginPage extends HTMLElement {
  connectedCallback() {
    const API = "http://localhost:3000";
    this.currentRole = "customer";
    this.innerHTML = `
      <link rel="stylesheet" href="assets/css/login.css">
      <div class="card" role="dialog" aria-labelledby="login-title">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <div style="width:18px"></div>
          <strong id="login-title">Бүртгүүлэх</strong>
          <div class="close">✕</div>
        </div>

        <div class="login-tabs" role="tablist" aria-label="Бүртгэлийн төрөл">
          <button class="tab-btn is-active" type="button" data-role="customer" role="tab" aria-selected="true">
            Хэрэглэгчээр
          </button>
          <button class="tab-btn" type="button" data-role="courier" role="tab" aria-selected="false">
            Хүргэгчээр
          </button>
        </div>

        <div class="subtitle">
          Бид таны дугаарыг баталгаажуулахын тулд утсаар залгах эсвэл мессеж илгээх болно.
        </div>

        <form onsubmit="event.preventDefault(); alert('Continue clicked')">
          <input type="hidden" name="role" value="customer">
          <div class="form-group">
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

          <div class="form-group">
            <label for="studentId">Оюутны ID</label>
            <input id="studentId" name="studentId" type="text" placeholder="23b1num0245" required>
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
    `;

    const form = this.querySelector("form");
    const closeBtn = this.querySelector(".close");
    const roleInput = this.querySelector("input[name='role']");
    const tabs = this.querySelectorAll(".tab-btn");
    const titleEl = this.querySelector("#login-title");
    const submitBtn = this.querySelector(".continue-btn");

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        location.hash = "#home";
      });
    }

    tabs.forEach((btn) => {
      btn.addEventListener("click", () => {
        const role = btn.getAttribute("data-role") || "customer";
        this.currentRole = role;
        tabs.forEach((b) => {
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

    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = this.querySelector("#name")?.value?.trim() || "Нэргүй";
        const phone = this.querySelector("#phone")?.value?.trim() || "";
        const idVal = this.querySelector("#studentId")?.value?.trim() || "";
        const role = roleInput?.value || "customer";

        const fullName = name.trim() || "Зочин хэрэглэгч";

        try {
          const res = await fetch(`${API}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: fullName,
              phone,
              studentId: idVal,
              role,
            }),
          });

          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || "Нэвтрэх үед алдаа гарлаа");
          }

          const data = await res.json();
          if (data?.token) {
            localStorage.setItem("auth_token", data.token);
          }
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
