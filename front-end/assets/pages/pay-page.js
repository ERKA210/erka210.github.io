class PayPage extends HTMLElement {
  connectedCallback() {
    this.handleRouteChange = this.handleRouteChange.bind(this);
    window.addEventListener("hashchange", this.handleRouteChange);
    this.handleRouteChange();
  }

  disconnectedCallback() {
    window.removeEventListener("hashchange", this.handleRouteChange);
  }

  handleRouteChange() {
    if (location.hash !== "#pay") return;

    // 🔐 ROLE GUARD (only logged-in courier)
    const loggedIn = localStorage.getItem("authLoggedIn");
    const role = localStorage.getItem("authRole");

    if (loggedIn !== "1" || role !== "courier") {
      location.hash = "#login";
      return;
    }

    // ✅ identify user (login-page дээр authPhone/authStudentId set хийсэн байх ёстой)
    const phone = (localStorage.getItem("authPhone") || "").trim();
    const studentId = (localStorage.getItem("authStudentId") || "").trim(); // login дээр нэмээрэй
    const paidKey = `courierPaid:${studentId || phone}`;

    if (!studentId && !phone) {
      alert("Хэрэглэгчийн мэдээлэл олдсонгүй. Дахин нэвтэрнэ үү.");
      location.hash = "#login";
      return;
    }

    const isPaid = () => localStorage.getItem(paidKey) === "1";

    this.innerHTML = `
      <link rel="stylesheet" href="assets/css/pay.css">
      <div class="pay-wrap">
        <div class="pay-card">
          <div class="pay-head">
            <h2>Хүргэгчийн төлбөр</h2>
            <button class="btn-close" type="button" aria-label="Хаах">✕</button>
          </div>

          <p class="pay-note">Төлбөрөө сонгоод төлбөрөө хийснээр хүргэлтийн хэсэг нээгдэнэ.</p>

          <div class="grid">
            <div class="block">
              <h4>Багц сонгох</h4>
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
            </div>

            <div class="block">
              <h4>Төлбөрийн арга</h4>
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

              <div class="actions">
                <button class="btn-pay" type="button">Төлбөр төлөх</button>
                <button class="btn-go" type="button" hidden>Хүргэлт рүү орох</button>
                <p class="status" hidden>✅ Төлбөр төлөгдсөн.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const closeBtn = this.querySelector(".btn-close");
    const payBtn = this.querySelector(".btn-pay");
    const goBtn = this.querySelector(".btn-go");
    const statusEl = this.querySelector(".status");
    const methodRadios = this.querySelectorAll('input[name="paymentMethod"]');

    const showPaidUI = () => {
      statusEl && (statusEl.hidden = false);
      if (payBtn) {
        payBtn.disabled = true;
        payBtn.textContent = "Төлбөр төлөгдсөн";
      }
      goBtn && (goBtn.hidden = false);
    };

    const showUnpaidUI = () => {
      statusEl && (statusEl.hidden = true);
      if (payBtn) {
        payBtn.disabled = false;
        payBtn.textContent = "Төлбөр төлөх";
      }
      goBtn && (goBtn.hidden = true);
    };

    const syncMethodUI = () => {
      const method = this.querySelector('input[name="paymentMethod"]:checked')?.value || "card";
      const card = this.querySelector(".payment-details--card");
      const qpay = this.querySelector(".payment-details--qpay");
      card && (card.hidden = method !== "card");
      qpay && (qpay.hidden = method !== "qpay");
    };

    closeBtn?.addEventListener("click", () => (location.hash = "#profile"));
    methodRadios.forEach((r) => r.addEventListener("change", syncMethodUI));
    syncMethodUI();

    // ✅ init paid sync for current session (delivery guard uses courierPaid)
    localStorage.setItem("courierPaid", isPaid() ? "1" : "0");
    if (isPaid()) showPaidUI();
    else showUnpaidUI();

    payBtn?.addEventListener("click", () => {
      // mock payment success
      localStorage.setItem(paidKey, "1");     // ✅ per-user
      localStorage.setItem("courierPaid", "1"); // ✅ current session sync
      showPaidUI();
      window.dispatchEvent(new Event("user-updated"));
    });

    goBtn?.addEventListener("click", () => {
      location.hash = "#delivery";
    });
  }
}

customElements.define("pay-page", PayPage);
