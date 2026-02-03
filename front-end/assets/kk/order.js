// import { apiFetch, API } from "../api_client.js";
// import "../components/my-order.js";

// class OrdersPage extends HTMLElement {
//   constructor() {
//     super();
//     this.selectedOrder = null;
//     this.eventSource = null;
//   }

//   connectedCallback() {
//     window.addEventListener("hashchange", () => this.checkRoute());
//     window.addEventListener("rating-completed", () => this.loadOrders());
//     this.checkRoute();
//   }

//   disconnectedCallback() {
//     window.removeEventListener("hashchange", () => this.checkRoute());
//     window.removeEventListener("rating-completed", () => this.loadOrders());
//     this.closeEventStream();
//   }

//   // Хуудас шалгах
//   checkRoute() {
//     if (location.hash !== "#orders") {
//       this.closeEventStream();
//       return;
//     }

//     this.createHTML();
//     this.setupEvents();
//     this.loadOrders();
//     this.startEventStream();
//   }

//   // HTML үүсгэх
//   createHTML() {
//     this.innerHTML = `
//       <main class="container">
//         <section class="order-side">
//           <!-- Захиалгын жагсаалт -->
//           <section class="orders">
//             <h2>Миний захиалга</h2>
//             <my-order></my-order>
//           </section>

//           <!-- Хүргэгчийн мэдээлэл -->
//           <section class="delivery-info">
//             <courier-card id="courierBox"></courier-card>
//           </section>
//         </section>

//         <!-- Захиалгын явц -->
//         <section class="details">
//           <h2>Захиалгын явц</h2>
//           <order-progress></order-progress>
//           <rating-modal></rating-modal>
//         </section>
//       </main>
//     `;
//   }

//   // Event-үүд холбох
//   setupEvents() {
//     const myOrder = this.querySelector("my-order");
//     if (!myOrder) return;

//     // Захиалга дарах
//     myOrder.addEventListener("click", (e) => {
//       const card = e.target.closest(".order-card");
//       if (!card) return;

//       const orderData = card.getAttribute("data-order");
//       if (!orderData) return;

//       const order = JSON.parse(decodeURIComponent(orderData));
//       this.selectOrder(order);
//     });
//   }

//   // Захиалгууд ачаалах
//   async loadOrders() {
//     const myOrder = this.querySelector("my-order");
//     if (!myOrder) return;

//     myOrder.showLoading();

//     // Хэрэглэгчийн ID авах
//     const userId = await this.getUserId();
//     if (!userId) {
//       location.hash = "#login";
//       return;
//     }

//     try {
//       // Серверээс захиалга авах
//       const response = await apiFetch(`/api/orders?customerId=${userId}`);
//       const orders = await response.json();

//       if (!response.ok) {
//         throw new Error(orders?.error || "Алдаа гарлаа");
//       }

//       // Хугацаа дууссан захиалга шүүх
//       const activeOrders = this.filterActiveOrders(orders);
      
//       // Үнэлгээ өгөөгүй захиалгууд
//       const notRatedOrders = activeOrders.filter(order => 
//         !this.isOrderRated(order.id)
//       );

//       // Хугацаа дууссан бол гарах
//       if (activeOrders.length === 0) {
//         window.NumAppState?.logout("order_expired");
//         return;
//       }

//       // Захиалга харуулах
//       myOrder.renderOrders(notRatedOrders);

//       // Эхний захиалгыг сонгох
//       if (notRatedOrders.length > 0) {
//         this.selectOrder(notRatedOrders[0]);
//       } else {
//         this.selectOrder(null);
//       }
//     } catch (error) {
//       console.error("Захиалга ачаалах алдаа:", error);
//     }
//   }

//   // Хэрэглэгчийн ID авах
//   async getUserId() {
//     try {
//       const response = await apiFetch("/api/auth/me");
//       if (response.ok) {
//         const data = await response.json();
//         return data?.user?.id;
//       }
//     } catch (error) {
//       console.error("Хэрэглэгч авах алдаа:", error);
//     }
//     return null;
//   }

//   // Идэвхтэй захиалгууд шүүх (хугацаа дуусаагүй)
//   filterActiveOrders(orders) {
//     const myOrder = this.querySelector("my-order");
//     if (!myOrder) return [];

//     return orders.filter(order => {
//       const timestamp = myOrder.parseOrderTimestamp(order);
//       return timestamp !== null && timestamp >= Date.now();
//     });
//   }

//   // Үнэлгээ өгсөн эсэхийг шалгах
//   isOrderRated(orderId) {
//     try {
//       const ratedOrders = JSON.parse(
//         localStorage.getItem("ratedOrders") || "[]"
//       );
//       return ratedOrder