// import { apiFetch } from "../api_client.js";
// import { formatMeta, formatPrice } from "../helper/format-d-ts-p.js";

// class HomePage extends HTMLElement {
//   constructor() {
//     super();
//     this.currentUser = null;
//     this.pendingOrder = null;
//     this.pendingOffer = null;
//     this.isLoaded = false;
//   }

//   connectedCallback() {
//     window.addEventListener("hashchange", () => this.checkRoute());
//     this.checkRoute();
//   }

//   disconnectedCallback() {
//     window.removeEventListener("hashchange", () => this.checkRoute());
//   }

//   // Хуудас шалгах
//   checkRoute() {
//     if (location.hash !== "#home" && location.hash !== "") return;
//     if (this.isLoaded) return;

//     this.isLoaded = true;
//     this.createHTML();
//     this.setupEvents();
//     this.loadData();
//   }

//   // HTML үүсгэх
//   createHTML() {
//     this.innerHTML = `
//       <section class="filter-section">
//         <!-- Хаанаас / Хаашаа -->
//         <div class="middle-row">
//           <div class="ctrl">
//             <span><img src="assets/img/map_pin.svg" alt="icon" width="16" height="16" /></span>
//             <select id="fromPlace">
//               <option value="" disabled selected hidden>Хаанаас</option>
//             </select>
//           </div>

//           <span class="arrow-icon">
//             <img src="assets/img/arrow.svg" alt="icon" width="67" height="67" />
//           </span>

//           <div class="ctrl">
//             <span><img src="assets/img/map_pin.svg" alt="icon" width="16" height="16" /></span>
//             <select id="toPlace">
//               <option value="" disabled selected hidden>Хаашаа</option>
//             </select>
//           </div>

//           <date-time-picker></date-time-picker>
//         </div>

//         <!-- Юуг сонгох -->
//         <div class="bottom-row">
//           <div class="ctrl wide">
//             <span><img src="assets/img/fork.svg" alt="icon" width="40" height="38" /></span>
//             <select id="what">
//               <option value="" disabled selected hidden>Юуг</option>
//             </select>
//           </div>
//         </div>

//         <!-- Сагс -->
//         <sh-cart class="cart"></sh-cart>

//         <!-- Захиалах товч -->
//         <div class="top-row">
//           <button class="btn btn--accent order-btn">Захиалах</button>
//         </div>
//       </section>

//       <!-- Саналууд -->
//       <div class="offers-layout">
//         <div class="offers-panel">
//           <offers-list></offers-list>
//         </div>
//         <aside class="delivery-cart-panel">
//           <delivery-cart></delivery-cart>
//         </aside>
//       </div>

//       <!-- Modalууд -->
//       <offer-modal></offer-modal>
//       <confirm-modal></confirm-modal>
//     `;
//   }

//   // Event-үүд холбох
//   setupEvents() {
//     // Захиалах товч
//     const orderBtn = this.querySelector(".order-btn");
//     orderBtn?.addEventListener("click", () => this.prepareOrder());

//     // Хаанаас сонгох
//     const fromSelect = this.querySelector("#fromPlace");
//     fromSelect?.addEventListener("change", (e) => this.loadMenu(e.target.value));

//     // Баталгаажуулах modal
//     const confirmModal = this.querySelector("confirm-modal");
//     confirmModal?.addEventListener("confirm", () => this.confirmOrder());
//     confirmModal?.addEventListener("cancel", () => this.closeConfirmModal());
//   }

//   // Өгөгдөл ачаалах
//   async loadData() {
//     await this.loadPlaces();
//     await this.checkUser();
//   }

//   // Байршлууд ачаалах
//   async loadPlaces() {
//     try {
//       const [fromResponse, toResponse] = await Promise.all([
//         apiFetch("/api/from-places"),
//         apiFetch("/api/to-places"),
//       ]);

//       if (!fromResponse.ok || !toResponse.ok) return;

//       const [fromPlaces, toPlaces] = await Promise.all([
//         fromResponse.json(),
//         toResponse.json(),
//       ]);

//       // Select-үүдийг дүүргэх
//       this.fillSelect("#fromPlace", fromPlaces, "Хаанаас");
//       this.fillSelect("#toPlace", toPlaces, "Хаашаа");
//     } catch (error) {
//       console.error("Газар ачаалах алдаа:", error);
//     }
//   }

//   // Select дүүргэх
//   fillSelect(selector, places, placeholder) {
//     const select = this.querySelector(selector);
//     if (!select) return;

//     select.innerHTML = `
//       <option value="" disabled selected hidden>${placeholder}</option>
//       ${places.map(place => 
//         `<option value="${place.id}">${place.name}</option>`
//       ).join("")}
//     `;
//   }

//   // Цэс ачаалах
//   async loadMenu(placeId) {
//     if (!placeId) return;

//     try {
//       const response = await apiFetch(`/api/menus/${placeId}`);
//       if (!response.ok) return;

//       const data = await response.json();
//       const menuItems = data.menu_json || [];

//       this.fillMenuSelect(menuItems);
//     } catch (error) {
//       console.error("Цэс ачаалах алдаа:", error);
//     }
//   }

//   // Цэсний select дүүргэх
//   fillMenuSelect(items) {
//     const whatSelect = this.querySelector("#what");
//     if (!whatSelect) return;

//     // Категориор ангилах
//     const foods = items.filter(i => i.category === "food");
//     const drinks = items.filter(i => i.category === "drink");
//     const others = items.filter(i => !i.category);

//     // HTML үүсгэх
//     whatSelect.innerHTML = `
//       <option value="" disabled selected hidden>Юуг</option>
//       ${this.createMenuGroup("Идэх юм", foods)}
//       ${this.createMenuGroup("Уух юм", drinks)}
//       ${this.createMenuGroup("Бусад", others)}
//     `;
//   }

//   // Цэсний бүлэг үүсгэх
//   createMenuGroup(label, items) {
//     if (items.length === 0) return "";

//     const options = items.map(item => `
//       <option 
//         value="${item.id}" 
//         data-price="${item.price}" 
//         data-name="${item.name}">
//         ${item.name} — ${item.price}₮
//       </option>
//     `).join("");

//     return `<optgroup label="${label}">${options}</optgroup>`;
//   }

//   // Хэрэглэгч шалгах
//   async checkUser() {
//     const user = await this.getCurrentUser();
//     if (!user?.id) return;

//     try {
//       await this.syncCustomer(user.id);
//     } catch (error) {
//       console.error("Хэрэглэгч синк хийх алдаа:", error);
//     }
//   }

//   // Одоогийн хэрэглэгч авах
//   async getCurrentUser() {
//     if (this.currentUser) return this.currentUser;

//     try {
//       const response = await apiFetch("/api/auth/me");
//       if (!response.ok) return null;

//       const data = await response.json();
//       this.currentUser = data?.user || null;
//       return this.currentUser;
//     } catch (error) {
//       console.error("Хэрэглэгч авах алдаа:", error);
//       return null;
//     }
//   }

//   // Хэрэглэгчийн мэдээлэл синк хийх
//   async syncCustomer(userId) {
//     if (!userId) return;

//     const response = await apiFetch(`/api/customers/${userId}`);
//     if (!response.ok) return;

//     const data = await response.json();
//     if (data) {
//       window.dispatchEvent(new Event("user-updated"));
//     }
//   }

//   // Захиалга бэлтгэх
//   prepareOrder() {
//     const fromSelect = this.querySelector("#fromPlace");
//     const toSelect = this.querySelector("#toPlace");

//     // Шалгалт
//     if (!fromSelect?.value) {
//       alert("Хаанаасаа сонгоно уу");
//       return;
//     }

//     if (!toSelect?.value) {
//       alert("Хаашаагаа сонгоно уу");
//       return;
//     }

//     const cart = this.getCart();
//     if (cart.totalQty === 0) {
//       alert("Юуг (хоол/бараа) сонгоно уу");
//       return;
//     }

//     // Огноо цаг авах
//     const dateTimePicker = this.querySelector("date-time-picker");
//     const scheduledAt = dateTimePicker?.iso;

//     // Захиалгын мэдээлэл бэлтгэх
//     this.pendingOrder = {
//       fromId: fromSelect.value,
//       toId: toSelect.value,
//       from: fromSelect.selectedOptions[0].textContent,
//       to: toSelect.selectedOptions[0].textContent,
//       scheduledAt,
//     };

//     this.pendingOffer = {
//       items: cart.items.map(item => ({
//         id: item.name,
//         name: item.name,
//         price: item.price,
//         qty: item.qty,
//       })),
//       total: cart.total,
//       deliveryFee: cart.deliveryFee || 500,
//       thumb: cart.deliveryIcon || "assets/img/document.svg",
//     };

//     // Modal нээх
//     const confirmModal = this.querySelector("confirm-modal");
//     confirmModal?.open(this.pendingOrder, this.pendingOffer);
//   }

//   // Сагсны мэдээлэл авах
//   getCart() {
//     const cartElement = this.querySelector("sh-cart");
//     return cartElement?.getSummary() || {
//       totalQty: 0,
//       items: [],
//       total: 0,
//       deliveryFee: 0,
//     };
//   }

//   // Захиалга баталгаажуулах
//   async confirmOrder() {
//     if (!this.pendingOrder || !this.pendingOffer) {
//       this.closeConfirmModal();
//       return;
//     }

//     // Хэрэглэгч шалгах
//     const user = await this.getCurrentUser();
//     if (!user?.id) {
//       // Нэвтрээгүй бол хадгалаад login руу шилжих
//       localStorage.setItem("pendingOrderDraft", JSON.stringify(this.pendingOrder));
//       localStorage.setItem("pendingOfferDraft", JSON.stringify(this.pendingOffer));
//       this.closeConfirmModal();
//       location.hash = "#login";
//       return;
//     }

//     // Шалгалт
//     if (!this.pendingOrder.fromId || !this.pendingOrder.toId) {
//       alert("Хаанаас/Хаашаа сонгоно уу");
//       return;
//     }

//     if (this.pendingOffer.items.length === 0) {
//       alert("Сагс хоосон байна");
//       return;
//     }

//     // Барааны жагсаалт бэлтгэх
//     const items = this.pendingOffer.items
//       .map(item => ({
//         menuItemKey: item.id,
//         name: item.name,
//         unitPrice: item.price,
//         qty: item.qty,
//       }))
//       .filter(item => item.qty > 0);

//     // Захиалгын өгөгдөл
//     const orderData = {
//       customerId: user.id,
//       fromPlaceId: this.pendingOrder.fromId,
//       toPlaceId: this.pendingOrder.toId,
//       scheduledAt: this.pendingOrder.scheduledAt,
//       deliveryFee: this.pendingOffer.deliveryFee,
//       items,
//       customerName: user.name,
//       customerPhone: user.phone,
//       customerStudentId: user.student_id,
//     };

//     try {
//       // Захиалга үүсгэх
//       const response = await apiFetch("/api/orders", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(orderData),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         alert(data?.error || "Захиалга үүсгэхэд алдаа гарлаа");
//         return;
//       }

//       // Идэвхтэй захиалга хадгалах
//       await this.saveActiveOrder(user);

//       // Төлөв шинэчлэх
//       window.NumAppState?.setState("customer", "order_created");
//       window.dispatchEvent(new Event("order-updated"));

//       // Саналд нэмэх
//       this.addToOffersList(user, data);

//       // Modal хаах
//       this.closeConfirmModal();

//       // Саналууд руу scroll хийх
//       this.scrollToOffers();
//     } catch (error) {
//       console.error("Захиалга үүсгэх алдаа:", error);
//       alert("Сервертэй холбогдож чадсангүй");
//     }
//   }

//   // Идэвхтэй захиалга хадгалах
//   async saveActiveOrder(user) {
//     const activeOrder = {
//       ...this.pendingOrder,
//       customer: {
//         name: user.name,
//         phone: user.phone,
//         studentId: user.student_id,
//       },
//     };

//     try {
//       await apiFetch("/api/active-order", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ order: activeOrder }),
//       });
//     } catch (error) {
//       console.error("Идэвхтэй захиалга хадгалах алдаа:", error);
//     }
//   }

//   // Саналын жагсаалтад нэмэх
//   addToOffersList(user, orderData) {
//     const offers = JSON.parse(localStorage.getItem("offers") || "[]");

//     const newOffer = {
//       ...this.pendingOffer,
//       orderId: orderData.orderId,
//       meta: formatMeta(this.pendingOrder.scheduledAt),
//       from: this.pendingOrder.from,
//       to: this.pendingOrder.to,
//       title: `${this.pendingOrder.from} - ${this.pendingOrder.to}`,
//       price: formatPrice(orderData?.total ?? this.pendingOffer.total),
//       thumb: this.pendingOffer.thumb || "assets/img/box.svg",
//       customer: {
//         name: user.name,
//         phone: user.phone,
//         studentId: user.student_id,
//         avatar: user.avatar || "assets/img/profile.jpg",
//       },
//       sub: this.pendingOffer.items.map(item => ({
//         name: `${item.name} x${item.qty}`,
//         price: formatPrice(item.price * item.qty),
//       })),
//     };

//     offers.unshift(newOffer);
//     localStorage.setItem("offers", JSON.stringify(offers));

//     // Саналын жагсаалт шинэчлэх
//     const offersElement = this.querySelector("offers-list");
//     if (offersElement && "items" in offersElement) {
//       offersElement.items = offers;
//     }

//     window.dispatchEvent(new Event("offers-updated"));
//   }

//   // Саналууд руу scroll хийх
//   scrollToOffers() {
//     const offersElement = this.querySelector("offers-list");
//     setTimeout(() => {
//       offersElement?.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       });
//     }, 150);
//   }

//   // Modal хаах
//   closeConfirmModal() {
//     const confirmModal = this.querySelector("confirm-modal");
//     confirmModal?.close();
//     this.pendingOrder = null;
//     this.pendingOffer = null;
//   }
// }

// customElements.define("home-page", HomePage);