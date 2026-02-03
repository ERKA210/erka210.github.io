// import { apiFetch } from "../api_client";

// class PayPage extends HTMLElement {
//   connectedCallback() {
//     // Хуудас солигдох бүрт шалгах
//     window.addEventListener("hashchange", () => this.render());
//     this.render();
//   }

//   disconnectedCallback() {
//     window.removeEventListener("hashchange", this.render);
//   }

//   async render() {
//     // #pay хуудас биш бол гарах
//     if (location.hash !== "#pay") return;

//     // Нэвтэрсэн эсэхийг шалгах
//     const loggedIn = localStorage.getItem("authLoggedIn");
//     const role = localStorage.getItem("authRole");

//     // Courier биш бол login руу шилжүүлэх
//     if (loggedIn !== "1" || role !== "courier") {
//       location.hash = "#login";
//       return;
//     }

//     // Хэрэглэгчийн мэдээлэл авах
//     const userInfo = await this.getUserInfo();
//     const hasPaid = this.checkPaymentStatus(userInfo);

//     // HTML-ийг үүсгэх
//     this.innerHTML = this.createHTML();

//     // Товчлууруудыг холбох
//     this.setupButtons(hasPaid, userInfo);
//   }

//   // Хэрэглэгчийн мэдээлэл авах
//   async getUserInfo() {
//     let phone = localStorage.getItem("authPhone") || "";
//     let studentId = localStorage.getItem("authStudentId") || "";
//     let userId = localStorage.getItem("authUserKey") || "";

//     // Хэрэв мэдээлэл байхгүй бол серверээс авах
//     if (!phone && !studentId) {
//       try {
//         const response = await apiFetch("/api/auth/me");
//         if (response.ok) {
//           const data = await response.json();
//           const user = data?.user || {};
//           phone = user.phone || "";
//           studentId = user.student_id || user.studentId || "";
//           userId = user.id || userId || "";
//         }
//       } catch (error) {
//         // Алдаа гарвал анхны утгуудаар үлдэх
//       }
//     }

//     return { phone, studentId, userId };
//   }

//   // Төлбөр төлсөн эсэхийг шалгах
//   checkPaymentStatus(userInfo) {
//     const key = userInfo.studentId || userInfo.phone || userInfo.userId || "courier";
//     const storageKey = `courierPaid:${key}`;
//     return localStorage.getItem(storageKey) === "1";
//   }

//   // HTML бүтэц үүсгэх
//   createHTML() {
//     return `
//       <div class="pay-wrap">
//         <div class="pay-card">
//           <div class="pay-head">
//             <h2>Хүргэгчийн төлбөр</h2>
//             <button class="btn-close">✕</button>
//           </div>

//           <p class="pay-note">Төлбөрөө сонгоод төлбөрөө хийснээр хүргэлтийн хэсэг нээгдэнэ.</p>

//           <div class="grid">
//             <!-- Багц сонгох -->
//             <div class="block">
//               <h4>Багц сонгох</h4>
//               <div class="plan-grid">
//                 <label class="plan-card">
//                   <input type="radio" name="plan" value="monthly" checked>
//                   <span>Сард 3000₮</span>
//                 </label>
//                 <label class="plan-card">
//                   <input type="radio" name="plan" value="two-months">
//                   <span>2 сард 5000₮</span>
//                 </label>
//                 <label class="plan-card">
//                   <input type="radio" name="plan" value="two-weeks">
//                   <span>14 хоногт 2000₮</span>
//                 </label>
//               </div>
//             </div>

//             <!-- Төлбөрийн арга -->
//             <div class="block">
//               <h4>Төлбөрийн арга</h4>
//               <div class="method-grid">
//                 <label class="method-card">
//                   <input type="radio" name="method" value="card" checked>
//                   <span>Картаар төлөх</span>
//                 </label>
//                 <label class="method-card">
//                   <input type="radio" name="method" value="qpay">
//                   <span>QPay-р төлөх</span>
//                 </label>
//               </div>

//               <!-- Картын мэдээлэл -->
//               <div class="payment-card">
//                 <input type="text" placeholder="0000 0000 0000 0000" class="card-number">
//                 <div class="form-row">
//                   <input type="text" placeholder="MM/YY" class="card-exp">
//                   <input type="password" placeholder="***" class="card-cvv">
//                 </div>
//               </div>

//               <!-- QPay -->
//               <div class="payment-qpay" hidden>
//                 <div class="qpay-box">
//                   <div class="qpay-qr">QR</div>
//                   <p>QR код уншуулж төлнө үү.</p>
//                 </div>
//               </div>

//               <!-- Товчлуур -->
//               <div class="actions">
//                 <button class="btn-pay">Төлбөр төлөх</button>
//                 <button class="btn-go" hidden>Хүргэлт рүү орох</button>
//                 <p class="status" hidden>✅ Төлбөр төлөгдсөн</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     `;
//   }

//   // Товчлууруудыг холбох
//   setupButtons(hasPaid, userInfo) {
//     const closeBtn = this.querySelector(".btn-close");
//     const payBtn = this.querySelector(".btn-pay");
//     const goBtn = this.querySelector(".btn-go");
//     const statusEl = this.querySelector(".status");
//     const methodRadios = this.querySelectorAll('input[name="method"]');

//     // Хаах товч
//     closeBtn.addEventListener("click", () => {
//       location.hash = "#profile";
//     });

//     // Төлбөрийн арга солих
//     methodRadios.forEach(radio => {
//       radio.addEventListener("change", () => {
//         const isCard = this.querySelector('input[name="method"]:checked').value === "card";
//         this.querySelector(".payment-card").hidden = !isCard;
//         this.querySelector(".payment-qpay").hidden = isCard;
//       });
//     });

//     // Төлбөр төлсөн эсэхээр харуулах
//     if (hasPaid) {
//       statusEl.hidden = false;
//       payBtn.disabled = true;
//       payBtn.textContent = "Төлбөр төлөгдсөн";
//       goBtn.hidden = false;
//     }

//     // Төлбөр төлөх товч
//     payBtn.addEventListener("click", () => {
//       const key = userInfo.studentId || userInfo.phone || userInfo.userId || "courier";
//       localStorage.setItem(`courierPaid:${key}`, "1");
//       localStorage.setItem("courierPaid", "1");
      
//       // UI шинэчлэх
//       statusEl.hidden = false;
//       payBtn.disabled = true;
//       payBtn.textContent = "Төлбөр төлөгдсөн";
//       goBtn.hidden = false;
      
//       window.dispatchEvent(new Event("user-updated"));
//     });

//     // Хүргэлт рүү очих товч
//     goBtn.addEventListener("click", () => {
//       location.hash = "#delivery";
//     });
//   }
// }

// customElements.define("pay-page", PayPage);