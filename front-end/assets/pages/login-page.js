class LoginPage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <link rel="stylesheet" href="assets/css/login.css">
      <div class="card" role="dialog" aria-labelledby="login-title">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <div style="width:18px"></div>
          <strong id="login-title">Бүртгүүлэх</strong>
          <div class="close">✕</div>
        </div>

        <div class="subtitle">
          Бид таны дугаарыг баталгаажуулахын тулд утсаар залгах эсвэл мессеж илгээх болно.
        </div>

        <form onsubmit="event.preventDefault(); alert('Continue clicked')">
          <div class="form-group">
            <label for="lastname">Овог</label>
            <input id="lastname" name="lastname" type="text" placeholder="Овог" required>
          </div>

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

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        location.hash = "#home";
      });
    }

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = this.querySelector("#name")?.value?.trim() || "Нэргүй";
        const lastName = this.querySelector("#lastname")?.value?.trim() || "";
        const phone = this.querySelector("#phone")?.value?.trim() || "";
        const idVal = this.querySelector("#studentId")?.value?.trim() || "";

        const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        const generatedUuid =
          (crypto.randomUUID && crypto.randomUUID()) ||
          `00000000-0000-4000-8000-${Date.now().toString().padStart(12, "0").slice(-12)}`;

        // Use provided ID only if it matches UUID, otherwise keep it for display and use generated UUID for backend
        const userId = uuidRe.test(idVal) ? idVal : generatedUuid;
        localStorage.setItem("userId", userId);
        if (idVal) {
          localStorage.setItem("userDisplayId", idVal);
        }
        localStorage.setItem("userName", name);
        localStorage.setItem("userLastName", lastName);
        localStorage.setItem("userPhone", phone);
        localStorage.setItem("userRegistered", "1");

        window.dispatchEvent(new Event("user-updated"));

        const hasDraft = localStorage.getItem("pendingOrderDraft");
        location.hash = hasDraft ? "#home" : "#profile";
      });
    }
  }
}

customElements.define('login-page', LoginPage);
