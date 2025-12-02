class ProfilePage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div id="page">
        <main></main>
        <div class="profile">
          <img src="assets/img/profile.jpg" alt="profile">
        </div>

        <div class="main-content">
          <div class="profile-container">
            <article class="main-profile">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3>Миний профайл</h3>
                <img src="assets/img/edit_icon.png" alt="edit" style="width: 24px; height: 24px; cursor: pointer;">
              </div>

              <div class="profile-info">
                <p><span>Нэр:</span> Чигцалмаа</p>
                <p><span>Дугаар:</span> 99001234</p>
                <p><span>ID:</span> 23B1NUM0245</p>
              </div>

              <div class="rating">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>

              <div class="actions">
                <button class="btn" id="openOrderBtn">Миний захиалга</button>
                <button class="btn" id="openDeliveryBtn">Миний хүргэлт</button>
              </div>
            </article>
          </div>

          <footer>
            <div class="footer-head">
              <h3 style="color: #c90d30;">Сэтгэгдэл</h3>
              <h4>See more</h4>
            </div>
            <section>
              <!-- энд profile.html дээр байсан review-үүдийг COPY хийж болно -->
              <div><h4>Бат</h4><p>Үнэхээр найдвартай хүргэгч байна.</p><p><span style="color: orange;">★</span><span style="color: orange;">★</span><span style="color: orange;">★</span><span style="color: orange;">★</span><span>★</span></p></div>
              <!-- ... бусдыг нь бас нэмээрэй ... -->
            </section>
          </footer>
        </div>
      </div>
    `;
  }
}

customElements.define('profile-page', ProfilePage);
