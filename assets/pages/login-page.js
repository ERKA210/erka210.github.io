class LoginPage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="card" role="dialog" aria-labelledby="login-title">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <div style="width:18px"></div>
          <strong id="login-title">Нэвтрэх эсвэл бүртгүүлэх</strong>
          <div class="close">✕</div>
        </div>

        <div class="subtitle">
          Бид таны дугаарыг баталгаажуулахын тулд утсаар залгах эсвэл мессеж илгээх болно.
        </div>

        <form onsubmit="event.preventDefault(); alert('Continue clicked')">
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
            <label for="id">ID</label>
            <input id="id" name="id" type="text" placeholder="ID" required>
          </div>

          <button class="continue-btn" type="submit">Нэвтрэх</button>

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
  }
}

customElements.define('login-page', LoginPage);
