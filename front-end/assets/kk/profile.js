// import { apiFetch } from "../api_client";

// class ProfilePage extends HTMLElement {
//   connectedCallback() {
//     window.addEventListener("hashchange", () => this.checkRoute());
//     window.addEventListener("reviews-updated", () => this.loadReviews());
//     this.checkRoute();
//   }

//   disconnectedCallback() {
//     window.removeEventListener("hashchange", () => this.checkRoute());
//     window.removeEventListener("reviews-updated", () => this.loadReviews());
//   }

//   // Хуудас шалгах
//   async checkRoute() {
//     if (location.hash !== "#profile") return;

//     // Ачааллаж байна гэсэн харуулах
//     this.showLoading();

//     // Нэвтэрсэн эсэхийг шалгах
//     const user = await this.checkAuth();
//     if (!user) {
//       location.hash = "#login";
//       return;
//     }

//     this.currentUser = user;
//     this.renderProfile();
//   }

//   // Ачааллаж байна
//   showLoading() {
//     this.innerHTML = `
//       <section class="profile-page">
//         <div class="profile-hero">
//           <div class="profile-hero__content">
//             <div class="profile-meta">
//               <div class="hero-info hero-info--stack">
//                 <strong>Профайл ачаалж байна...</strong>
//                 <span class="muted">Нэвтрэлт шалгаж байна</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     `;
//   }

//   // Нэвтрэлт шалгах
//   async checkAuth() {
//     try {
//       const response = await fetch("/api/auth/me");
//       if (!response.ok) return null;

//       const data = await response.json();
//       return data?.user?.id ? data.user : null;
//     } catch (error) {
//       return null;
//     }
//   }

//   // Профайл харуулах
//   renderProfile() {
//     const isCourier = this.currentUser?.role === "courier";

//     this.innerHTML = `
//       <section class="profile-page">
//         <!-- Профайлын толгой хэсэг -->
//         <div class="profile-hero">
//           <div class="profile-hero__content">
//             <!-- Зураг -->
//             <div class="avatar-wrap">
//               <img src="assets/img/profile.jpg" alt="Профайл зураг" class="avatar profile-avatar">
//             </div>

//             <!-- Мэдээлэл -->
//             <div class="profile-meta">
//               <div class="hero-info hero-info--stack">
//                 <div><span class="label">Нэр:</span><strong class="profile-name">-</strong></div>
//                 <div><span class="label">Утас:</span><strong class="profile-phone">-</strong></div>
//                 <div><span class="label">ID:</span><strong class="profile-id">-</strong></div>
//                 <div><span class="label">Имэйл:</span><strong class="profile-email">-</strong></div>
//               </div>

//               <!-- Товчлуурууд -->
//               <div class="hero-actions">
//                 <button class="btn primary" data-modal="ordersModal">Миний захиалга</button>
//                 <button class="btn ghost" data-modal="deliveryModal">Миний хүргэлт</button>
//               </div>
//             </div>

//             <!-- Статистик -->
//             <div class="hero-stats">
//               <div class="stat-card">
//                 <p>Нийт захиалга</p>
//                 <strong id="orderTotal">0</strong>
//               </div>
//               ${isCourier ? `
//                 <div class="stat-card">
//                   <p>Дундаж үнэлгээ</p>
//                   <div class="stars avg-stars">
//                     <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
//                   </div>
//                   <small class="avg-rating-text">0 / 5</small>
//                 </div>
//               ` : ""}
//             </div>
//           </div>
//         </div>

//         <!-- Үйлдлүүд (Desktop) -->
//         <div class="profile-actions-desktop">
//           <button class="action-card" data-modal="ordersModal">
//             <span class="action-title">Миний захиалга</span>
//             <span class="action-subtitle">Түүх, төлөвийг харах</span>
//           </button>
//           <button class="action-card" data-modal="deliveryModal">
//             <span class="action-title">Миний хүргэлт</span>
//             <span class="action-subtitle">Хүргэлтийн мэдээлэл</span>
//           </button>
//         </div>

//         <!-- Сэтгэгдэл (Хүргэгчид л харагдана) -->
//         ${isCourier ? `
//           <div class="profile-grid">
//             <article class="profile-card reviews">
//               <header>
//                 <p class="eyebrow">Сэтгэгдэл</p>
//                 <button class="ghost-btn small" data-modal="reviewsModal">Бүгдийг харах</button>
//               </header>
//               <div class="review-list"><p class="muted">Сэтгэгдэл байхгүй</p></div>
//             </article>
//           </div>
//         ` : ""}
//       </section>

//       <!-- Профайл засахModal -->
//       <div class="modal-backdrop" data-modal-id="profileModal">
//         <div class="modal-card">
//           <header class="modal-header">
//             <div>
//               <p class="eyebrow">Профайл засах</p>
//               <h3>Мэдээллээ шинэчлэх</h3>
//             </div>
//             <button class="icon-btn close-modal">×</button>
//           </header>
//           <form id="profileForm" class="modal-body">
//             <label><span>Нэр</span><input type="text" name="name" required /></label>
//             <label><span>Утас</span><input type="tel" name="phone" required /></label>
//             <label><span>Имэйл</span><input type="email" name="email" /></label>
//             <label><span>ID</span><input type="text" name="id" /></label>
//             <div class="modal-actions">
//               <button type="button" class="btn ghost close-modal">Болих</button>
//               <button type="submit" class="btn primary">Хадгалах</button>
//             </div>
//           </form>
//         </div>
//       </div>

//       <!-- Захиалгын түүх Modal -->
//       <div class="modal-backdrop" data-modal-id="ordersModal">
//         <div class="modal-card">
//           <header class="modal-header">
//             <h3>Миний захиалга</h3>
//             <button class="icon-btn close-modal">×</button>
//           </header>
//           <div class="modal-body modal-scroll order-history">
//             <div class="muted">Ачааллаж байна...</div>
//           </div>
//         </div>
//       </div>

//       <!-- Хүргэлтийн түүх Modal -->
//       <div class="modal-backdrop" data-modal-id="deliveryModal">
//         <div class="modal-card">
//           <header class="modal-header">
//             <h3>Миний хүргэлт</h3>
//             <button class="icon-btn close-modal">×</button>
//           </header>
//           <div class="modal-body modal-scroll delivery-history">
//             <div class="muted">Ачааллаж байна...</div>
//           </div>
//         </div>
//       </div>

//       <!-- Сэтгэгдлийн Modal (Хүргэгчид л) -->
//       ${isCourier ? `
//         <div class="modal-backdrop" data-modal-id="reviewsModal">
//           <div class="modal-card">
//             <header class="modal-header">
//               <p class="eyebrow">Сэтгэгдлүүд</p>
//               <button class="icon-btn close-modal">×</button>
//             </header>
//             <div class="modal-body modal-scroll review-list">
//               <p class="muted">Сэтгэгдэл байхгүй</p>
//             </div>
//           </div>
//         </div>
//       ` : ""}
//     `;

//     this.setupEvents();
//     this.loadData();
//   }

//   // Event-үүд холбох
//   setupEvents() {
//     // Modal нээх
//     this.querySelectorAll("[data-modal]").forEach(btn => {
//       btn.addEventListener("click", () => {
//         const modalId = btn.getAttribute("data-modal");
//         this.openModal(modalId);
//       });
//     });

//     // Modal хаах
//     this.querySelectorAll(".close-modal").forEach(btn => {
//       btn.addEventListener("click", () => {
//         this.closeAllModals();
//       });
//     });

//     // Modal backdrop дарах
//     this.querySelectorAll(".modal-backdrop").forEach(backdrop => {
//       backdrop.addEventListener("click", (e) => {
//         if (e.target === backdrop) {
//           this.closeAllModals();
//         }
//       });
//     });

//     // Профайл засах форм
//     const form = this.querySelector("#profileForm");
//     form?.addEventListener("submit", (e) => {
//       e.preventDefault();
//       this.saveProfile(form);
//     });
//   }

//   // Өгөгдөл ачаалах
//   async loadData() {
//     await this.loadUserInfo();
//     await this.loadOrderStats();
//     await this.loadOrderHistory();
//     await this.loadDeliveryHistory();
    
//     if (this.currentUser?.role === "courier") {
//       await this.loadReviews();
//     }
//   }

//   // Хэрэглэгчийн мэдээлэл ачаалах
//   async loadUserInfo() {
//     try {
//       const response = await fetch("/api/auth/me");
//       if (!response.ok) return;

//       const data = await response.json();
//       const user = data?.user;
//       if (!user) return;

//       // Мэдээлэл харуулах
//       this.updateField(".profile-name", user.name);
//       this.updateField(".profile-phone", user.phone);
//       this.updateField(".profile-id", user.student_id);
//       this.updateField(".profile-email", user.email);
      
//       const avatar = this.querySelector(".profile-avatar");
//       if (avatar && user.avatar) {
//         avatar.src = user.avatar;
//       }

//       // Формд мэдээлэл оруулах
//       const form = this.querySelector("#profileForm");
//       if (form) {
//         form.name.value = user.name || "";
//         form.phone.value = user.phone || "";
//         form.email.value = user.email || "";
//         form.id.value = user.student_id || "";
//       }
//     } catch (error) {
//       console.error("Хэрэглэгчийн мэдээлэл ачаалах алдаа:", error);
//     }
//   }

//   // Захиалгын статистик ачаалах
//   async loadOrderStats() {
//     try {
//       const userId = this.currentUser?.id;
//       if (!userId) return;

//       const response = await fetch(`/api/orders?customerId=${userId}`);
//       if (!response.ok) return;

//       const orders = await response.json();
//       const totalEl = this.querySelector("#orderTotal");
//       if (totalEl) {
//         totalEl.textContent = orders.length;
//       }
//     } catch (error) {
//       console.error("Статистик ачаалах алдаа:", error);
//     }
//   }

//   // Захиалгын түүх ачаалах
//   async loadOrderHistory() {
//     try {
//       const userId = this.currentUser?.id;
//       if (!userId) return;

//       const response = await fetch(`/api/orders?customerId=${userId}`);
//       if (!response.ok) return;

//       const orders = await response.json();
//       const historyHTML = this.createHistoryHTML(orders, "Захиалга байхгүй");
      
//       const container = this.querySelector(".order-history");
//       if (container) {
//         container.innerHTML = historyHTML;
//       }
//     } catch (error) {
//       console.error("Захиалгын түүх ачаалах алдаа:", error);
//     }
//   }

//   // Хүргэлтийн түүх ачаалах
//   async loadDeliveryHistory() {
//     try {
//       if (this.currentUser?.role !== "courier") return;

//       const response = await fetch("/api/orders/history/courier");
//       if (!response.ok) return;

//       const data = await response.json();
//       const orders = data.items || [];
//       const historyHTML = this.createHistoryHTML(orders, "Хүргэлт байхгүй");
      
//       const container = this.querySelector(".delivery-history");
//       if (container) {
//         container.innerHTML = historyHTML;
//       }
//     } catch (error) {
//       console.error("Хүргэлтийн түүх ачаалах алдаа:", error);
//     }
//   }

//   // Сэтгэгдэл ачаалах
//   async loadReviews() {
//     try {
//       const userId = this.currentUser?.id;
//       if (!userId) return;

//       const response = await fetch(`/api/ratings/courier/${userId}`);
//       if (!response.ok) return;

//       const data = await response.json();
//       const reviews = (data.items || []).map(r => ({
//         text: r.comment || "",
//         stars: r.stars
//       }));

//       // Сэтгэгдэл харуулах
//       const reviewHTML = this.createReviewHTML(reviews);
//       this.querySelectorAll(".review-list").forEach(el => {
//         el.innerHTML = reviewHTML;
//       });

//       // Дундаж үнэлгээ шинэчлэх
//       this.updateAverageRating(data?.courier?.rating_avg);
//     } catch (error) {
//       console.error("Сэтгэгдэл ачаалах алдаа:", error);
//     }
//   }

//   // Түүхийн HTML үүсгэх
//   createHistoryHTML(orders, emptyText) {
//     if (!orders.length) {
//       return `<div class="muted">${emptyText}</div>`;
//     }

//     return orders.map((order, index) => {
//       const icons = ['assets/img/document.svg', 'assets/img/tor.svg', 'assets/img/box.svg'];
//       const icon = icons[index % icons.length];
      
//       const title = `${order.from_name || ""} → ${order.to_name || ""}`;
//       const date = this.formatDate(order.created_at || order.scheduled_at);
//       const price = this.formatPrice(order.total_amount);

//       return `
//         <div class="history-card">
//           <div class="history-icon">
//             <img src="${icon}" alt="" width="32" height="32">
//           </div>
//           <div class="history-info">
//             <h4>${title}</h4>
//             <p class="muted">${date}</p>
//           </div>
//           <div class="history-price">${price}</div>
//         </div>
//       `;
//     }).join("");
//   }

//   // Сэтгэгдлийн HTML үүсгэх
//   createReviewHTML(reviews) {
//     if (!reviews.length) {
//       return `<p class="muted">Сэтгэгдэл байхгүй</p>`;
//     }

//     return reviews.map(review => {
//       const stars = this.createStars(review.stars);
//       const text = this.escapeHTML(review.text);
      
//       return `
//         <div class="review">
//           <div><p>${text}</p></div>
//           <span class="stars">${stars}</span>
//         </div>
//       `;
//     }).join("");
//   }

//   // Од үүсгэх
//   createStars(count) {
//     const filled = Math.max(0, Math.min(5, Number(count) || 0));
//     return "★".repeat(filled) + "☆".repeat(5 - filled);
//   }

//   // Дундаж үнэлгээ шинэчлэх
//   updateAverageRating(avg) {
//     const rating = Math.max(0, Math.min(5, Number(avg) || 0));
//     const filled = Math.round(rating);

//     const starsEl = this.querySelector(".avg-stars");
//     const textEl = this.querySelector(".avg-rating-text");
    
//     if (starsEl) {
//       const stars = starsEl.querySelectorAll("span");
//       stars.forEach((star, i) => {
//         star.classList.toggle("dim", i >= filled);
//       });
//     }

//     if (textEl) {
//       textEl.textContent = `${rating.toFixed(1)} / 5`;
//     }
//   }

//   // Профайл хадгалах
//   async saveProfile(form) {
//     try {
//       await fetch("/api/auth/me", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: form.name.value.trim(),
//           phone: form.phone.value.trim(),
//           studentId: form.id.value.trim(),
//         }),
//       });

//       // Мэдээлэл шинэчлэх
//       this.updateField(".profile-name", form.name.value);
//       this.updateField(".profile-phone", form.phone.value);
//       this.updateField(".profile-id", form.id.value);

//       window.dispatchEvent(new Event("user-updated"));
//       this.closeAllModals();
//     } catch (error) {
//       alert("Хадгалах үед алдаа гарлаа");
//     }
//   }

//   // Талбар шинэчлэх
//   updateField(selector, value) {
//     const elements = this.querySelectorAll(selector);
//     elements.forEach(el => {
//       el.textContent = value || "-";
//       const row = el.closest("div");
//       if (row) row.style.display = value ? "" : "none";
//     });
//   }

//   // Огноо форматлах
//   formatDate(dateString) {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     return `${date.toLocaleDateString()} · ${date.toLocaleTimeString([], { 
//       hour: "2-digit", 
//       minute: "2-digit" 
//     })}`;
//   }

//   // Үнэ форматлах
//   formatPrice(amount) {
//     return Number(amount || 0).toLocaleString("mn-MN") + "₮";
//   }

//   // HTML escape
//   escapeHTML(text) {
//     return String(text || "")
//       .replace(/&/g, "&amp;")
//       .replace(/</g, "&lt;")
//       .replace(/>/g, "&gt;")
//       .replace(/"/g, "&quot;")
//       .replace(/'/g, "&#39;");
//   }

//   // Modal нээх
//   openModal(modalId) {
//     const modal = this.querySelector(`[data-modal-id="${modalId}"]`);
//     if (modal) {
//       modal.classList.add("open");
//     }
//   }

//   // Modal хаах
//   closeAllModals() {
//     this.querySelectorAll(".modal-backdrop").forEach(modal => {
//       modal.classList.remove("open");
//     });
//   }
// }

// customElements.define("profile-page", ProfilePage);