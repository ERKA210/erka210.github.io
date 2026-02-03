// import { apiFetch } from "../api_client.js";

// class LoginPage extends HTMLElement {
//   connectedCallback() {
//     this.mode = "login"; // "login" эсвэл "register"
//     this.role = "customer"; // "customer" эсвэл "courier"
    
//     this.createHTML();
//     this.setupEventListeners();
//     this.loadSavedSettings();
//   }

//   // HTML бүтэц үүсгэх
//   createHTML() {
//     this.innerHTML = `
//       <div class="card">
//         <!-- Толгой хэсэг -->
//         <div class="header">
//           <div style="width:18px"></div>
//           <strong id="title">Нэвтрэх</strong>
//           <div class="close">✕</div>
//         </div>

//         <!-- Нэвтрэх / Бүртгүүлэх таб -->
//         <div class="auth-tabs">
//           <button class="tab-btn is-active" data-mode="login">Нэвтрэх</button>
//           <button class="tab-btn" data-mode="register">Бүртгүүлэх</button>
//         </div>

//         <div class="login-tabs-row">
//           <div class="subtitle">Утасны дугаар, нууц үгээ оруулна уу.</div>
          
//           <!-- Хэрэглэгч / Хүргэгч таб (бүртгэлд л харагдана) -->
//           <div class="login-tabs register-only">
//             <button class="tab-btn is-active" data-role="customer">Хэрэглэгчээр</button>
//             <button class="tab-btn" data-role="courier">Хүргэгчээр</button>
//           </div>
//         </div>

//         <!-- Форм -->
//         <form class="auth-layout">
//           <input class="register-only" type="hidden" name="role" value="customer">
          
//           <div class="form-group register-only">
//             <label for="name">Нэр</label>
//             <input id="name" name="name" type="text" placeholder="Нэр">
//           </div>
          
//           <div class="form-group">
//             <label for="phone">Утасны дугаар</label>
//             <input id="phone" name="phone" type="tel" placeholder="Утасны дугаар" required>
//           </div>
          
//           <div class="form-group register-only">
//             <label for="studentId">ID</label>
//             <input id="studentId" name="studentId" type="text" placeholder="ID">
//           </div>
          
//           <div class="form-group">
//             <label for="password">Нууц үг</label>
//             <input id="password" name="password" type="password" placeholder="••••••••" required>
//           </div>

//           <button class="submit-btn" type="submit">Нэвтрэх</button>

//           <div class="privacy">Нууцлалын бодлого</div>
//           <div class="or">эсвэл</div>

//           <div class="social">
//             <button type="button" class="btn-social">
//               <img src="assets/img/num-logo.svg" alt="num-logo">
//               SISI-ээр үргэлжлүүлэх
//             </button>
//           </div>
//         </form>
//       </div>

//       <!-- Хүргэгчийн дүрс -->
//       <div class="scene">
//         <div class="delivery-man">
//           <div class="head"></div>
//           <div class="body"></div>
//           <div class="arm left"></div>
//           <div class="arm right"></div>
//           <div class="leg left"></div>
//           <div class="leg right"></div>
//           <div class="box">📦</div>
//         </div>
//       </div>
//     `;
//   }

//   // Бүх үйлдлүүдийг холбох
//   setupEventListeners() {
//     // Хаах товч
//     this.querySelector(".close")?.addEventListener("click", () => {
//       location.hash = "#home";
//     });

//     // Нэвтрэх/Бүртгүүлэх таб
//     this.querySelectorAll(".auth-tabs .tab-btn").forEach(btn => {
//       btn.addEventListener("click", () => {
//         const newMode = btn.getAttribute("data-mode");
//         this.switchMode(newMode);
//       });
//     });

//     // Хэрэглэгч/Хүргэгч таб
//     this.querySelectorAll(".login-tabs .tab-btn").forEach(btn => {
//       btn.addEventListener("click", () => {
//         const newRole = btn.getAttribute("data-role");
//         this.switchRole(newRole);
//       });
//     });

//     // Форм илгээх
//     this.querySelector("form")?.addEventListener("submit", (e) => {
//       e.preventDefault();
//       this.handleSubmit();
//     });
//   }

//   // Нэвтрэх/Бүртгүүлэх солих
//   switchMode(newMode) {
//     this.mode = newMode;
//     const isRegister = newMode === "register";

//     // Табуудын идэвхтэй байдал
//     this.querySelectorAll(".auth-tabs .tab-btn").forEach(btn => {
//       const isActive = btn.getAttribute("data-mode") === newMode;
//       btn.classList.toggle("is-active", isActive);
//     });

//     // Бүртгэлд л харагдах хэсгүүд
//     this.querySelectorAll(".register-only").forEach(el => {
//       el.style.display = isRegister ? "" : "none";
//     });

//     // Required талбарууд
//     const nameInput = this.querySelector("#name");
//     if (nameInput) nameInput.required = isRegister;

//     // Текстүүд шинэчлэх
//     this.updateTexts();
//   }

//   // Хэрэглэгч/Хүргэгч солих
//   switchRole(newRole) {
//     this.role = newRole;

//     // Табуудын идэвхтэй байдал
//     this.querySelectorAll(".login-tabs .tab-btn").forEach(btn => {
//       const isActive = btn.getAttribute("data-role") === newRole;
//       btn.classList.toggle("is-active", isActive);
//     });

//     // Hidden input шинэчлэх
//     const roleInput = this.querySelector("input[name='role']");
//     if (roleInput) roleInput.value = newRole;

//     // Текстүүд шинэчлэх
//     this.updateTexts();
//   }

//   // Гарчиг, товчны текст шинэчлэх
//   updateTexts() {
//     const isRegister = this.mode === "register";
//     const isCourier = this.role === "courier";

//     // Гарчиг
//     const title = this.querySelector("#title");
//     if (title) {
//       title.textContent = isRegister ? "Бүртгүүлэх" : "Нэвтрэх";
//     }

//     // Тайлбар
//     const subtitle = this.querySelector(".subtitle");
//     if (subtitle) {
//       subtitle.textContent = isRegister
//         ? "Нэр болон нууц үгээ ашиглан бүртгүүлнэ."
//         : "Утасны дугаар, нууц үгээ оруулна уу.";
//     }

//     // Товч
//     const submitBtn = this.querySelector(".submit-btn");
//     if (submitBtn) {
//       if (isRegister) {
//         submitBtn.textContent = isCourier ? "Хүргэгчээр бүртгүүлэх" : "Хэрэглэгчээр бүртгүүлэх";
//       } else {
//         submitBtn.textContent = "Нэвтрэх";
//       }
//     }
//   }

//   // Хадгалсан тохиргоог ачаалах
//   loadSavedSettings() {
//     const savedMode = localStorage.getItem("login_prefill_mode");
//     const savedRole = localStorage.getItem("login_prefill_role");

//     if (savedMode) {
//       this.switchMode(savedMode);
//       localStorage.removeItem("login_prefill_mode");
//     }

//     if (savedRole) {
//       this.switchRole(savedRole);
//       localStorage.removeItem("login_prefill_role");
//     }
//   }

//   // Форм илгээх
//   async handleSubmit() {
//     const isRegister = this.mode === "register";
    
//     // Утгууд авах
//     const name = this.querySelector("#name")?.value?.trim() || "Зочин хэрэглэгч";
//     const phone = this.querySelector("#phone")?.value?.trim() || "";
//     const studentId = this.querySelector("#studentId")?.value?.trim() || "";
//     const password = this.querySelector("#password")?.value?.trim() || "";
//     const role = isRegister ? this.role : "customer";

//     try {
//       // Серверт илгээх
//       const response = await apiFetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name,
//           phone,
//           studentId,
//           role,
//           password,
//           mode: this.mode,
//         }),
//       });

//       if (!response.ok) {
//         const error = await response.json().catch(() => ({}));
//         throw new Error(error.error || "Алдаа гарлаа");
//       }

//       const data = await response.json();

//       // Мэдээллийг хадгалах
//       this.saveUserData(data, phone, studentId, role);

//       // Дараагийн хуудас руу шилжих
//       const hasDraft = localStorage.getItem("pendingOrderDraft");
//       location.hash = hasDraft ? "#home" : "#profile";

//     } catch (error) {
//       this.handleError(error);
//     }
//   }

//   // Хэрэглэгчийн мэдээллийг хадгалах
//   saveUserData(data, phone, studentId, role) {
//     const serverRole = data?.user?.role || role;
//     const serverPhone = data?.user?.phone || phone;
//     const serverStudentId = data?.user?.student_id || data?.user?.studentId || studentId;
//     const userKey = serverStudentId || serverPhone;

//     localStorage.setItem("authLoggedIn", "1");
//     localStorage.setItem("authRole", serverRole);
//     localStorage.setItem("authPhone", serverPhone);
//     localStorage.setItem("authStudentId", serverStudentId);
//     localStorage.setItem("authUserKey", userKey);

//     // Хүргэгчийн төлбөрийн мэдээлэл
//     if (serverRole === "courier" && userKey) {
//       const paidKey = `courierPaid:${userKey}`;
//       const hasPaid = localStorage.getItem(paidKey) === "1";
//       localStorage.setItem("courierPaid", hasPaid ? "1" : "0");
//     } else {
//       localStorage.setItem("courierPaid", "0");
//     }

//     // Event илгээх
//     window.dispatchEvent(new Event("user-updated"));
//   }

//   // Алдаа харуулах
//   handleError(error) {
//     const message = String(error?.message || "");
    
//     // Давхардсан утас
//     if (message.includes("users_phone_key")) {
//       alert("Энэ утас бүртгэлтэй байна. Нэвтрэх горимоор орно уу.");
//       this.switchMode("login");
//       return;
//     }

//     alert(message || "Алдаа гарлаа");
//   }
// }

// customElements.define('login-page', LoginPage);