// import { escapeAttr } from "../helper/escape-attr.js";

// class DeliveryPage extends HTMLElement {
//   constructor() {
//     super();
//     this.isInitialized = false;
//   }

//   connectedCallback() {
//     window.addEventListener('hashchange', () => this.checkAndRender());
//     window.addEventListener('order-updated', () => this.updateActiveOrder());
//     window.addEventListener('delivery-cart-updated', () => this.loadDeliveryList());
//     this.checkAndRender();
//   }

//   disconnectedCallback() {
//     window.removeEventListener('hashchange', () => this.checkAndRender());
//     window.removeEventListener('order-updated', () => this.updateActiveOrder());
//     window.addEventListener('delivery-cart-updated', () => this.loadDeliveryList());
//   }

//   // Хуудас харуулах эрх шалгах
//   checkAndRender() {
//     if (location.hash !== '#delivery') return;

//     // Нэвтэрсэн эсэхийг шалгах
//     const loggedIn = localStorage.getItem("authLoggedIn");
//     const role = localStorage.getItem("authRole");
//     const paid = localStorage.getItem("courierPaid");

//     if (loggedIn !== "1") {
//       location.hash = "#login";
//       return;
//     }

//     if (role !== "courier") {
//       location.hash = "#home";
//       return;
//     }

//     if (paid !== "1") {
//       location.hash = "#pay";
//       return;
//     }

//     // Анхны удаа л HTML үүсгэх
//     if (!this.isInitialized) {
//       this.createHTML();
//       this.isInitialized = true;
//     }

//     this.updateActiveOrder();
//     this.loadDeliveryList();
//   }

//   // HTML бүтэц үүсгэх
//   createHTML() {
//     this.innerHTML = `
//       <div class="container">
//         <!-- Захиалгын жагсаалт -->
//         <section class="orders">
//           <h2>Миний хүргэлт</h2>
//           <div id="deliveryList" class="order-list"></div>
//         </section>

//         <!-- Захиалгын дэлгэрэнгүй -->
//         <section class="details">
//           <del-order-details></del-order-details>
//         </section>

//         <!-- Хүргэлтийн явц -->
//         <section class="order-step">
//           <h2>Захиалгын явц</h2>
//           <del-order-progress></del-order-progress>
//         </section>
//       </div>
//     `;
//   }

//   // Идэвхтэй захиалгыг шинэчлэх
//   async updateActiveOrder() {
//     try {
//       const response = await fetch("/api/active-order");
//       if (!response.ok) return;

//       const data = await response.json();
//       const order = data?.order;
//       if (!order) return;

//       // Эхний захиалгын мэдээллийг шинэчлэх
//       const firstOrder = this.querySelector('d-orders[data-active="true"]');
//       if (firstOrder && order.from && order.to) {
//         firstOrder.setAttribute('header', `${order.from} → ${order.to}`);
//         if (order.item) {
//           firstOrder.setAttribute('detail', order.item);
//         }
//       }
//     } catch (error) {
//       // Алдаа гарвал үл хэрэгсэх
//     }
//   }

//   // Хүргэлтийн жагсаалт татах
//   async loadDeliveryList() {
//     const listElement = this.querySelector('#deliveryList');
//     if (!listElement) return;

//     let items = [];
    
//     try {
//       const response = await fetch("/api/delivery-cart");
//       if (response.ok) {
//         const data = await response.json();
//         items = data.items || [];
//       }
//     } catch (error) {
//       items = [];
//     }

//     // Хоосон жагсаалт
//     if (items.length === 0) {
//       listElement.innerHTML = '<p class="muted">Хүргэлт сонгоогүй байна.</p>';
//       this.setEmptyState(true);
//       return;
//     }

//     this.setEmptyState(false);
    
//     // Өгөгдлийг форматлах
//     const formattedItems = this.formatItems(items);
    
//     // HTML үүсгэх
//     listElement.innerHTML = formattedItems.map(item => `
//       <d-orders
//         data-id="${escapeAttr(item.id || '')}"
//         data-order-id="${escapeAttr(item.orderId || '')}"
//         data-from="${escapeAttr(item.from || '')}"
//         data-to="${escapeAttr(item.to || '')}"
//         data-created-at="${escapeAttr(item.createdAt || '')}"
//         header="${escapeAttr(item.title || '')}"
//         detail="${escapeAttr(item.detail || '')}">
//       </d-orders>
//     `).join('');

//     // Дарах үйлдэл холбох
//     this.setupOrderClicks(formattedItems);
//   }

//   // Хоосон байдлыг тохируулах
//   setEmptyState(isEmpty) {
//     const details = this.querySelector("del-order-details");
//     const progress = this.querySelector("del-order-progress");
    
//     if (isEmpty) {
//       details?.setAttribute("data-empty", "1");
//       progress?.setAttribute("data-empty", "1");
//     } else {
//       details?.removeAttribute("data-empty");
//       progress?.removeAttribute("data-empty");
//     }
//   }

//   // Өгөгдлийг форматлах
//   formatItems(items) {
//     return items.map(item => {
//       const quantity = Number(item.qty || 1);
      
//       // Дэлгэрэнгүй мэдээлэл
//       const detailParts = [];
//       if (item.meta) detailParts.push(item.meta);
//       if (quantity) detailParts.push(`x${quantity}`);
//       const detail = detailParts.join(' • ');

//       // Хаанаас → Хаашаа
//       const title = String(item.title || "");
//       const parts = title.split(" - ");
//       const from = parts[0] || title;
//       const to = parts.slice(1).join(" - ");

//       return {
//         ...item,
//         detail,
//         from,
//         to,
//         createdAt: item.meta || "",
//         orderId: item.order_id || null,
//       };
//     });
//   }

//   // Захиалга дарах үйлдэл холбох
//   setupOrderClicks(items) {
//     const orderElements = this.querySelectorAll('d-orders');
//     if (orderElements.length === 0) return;

//     // ID-аар хайх Map үүсгэх
//     const itemsById = new Map(
//       items.map(item => [String(item.id || ""), item])
//     );

//     // Захиалга бүрт дарах үйлдэл нэмэх
//     orderElements.forEach(orderElement => {
//       orderElement.addEventListener('click', () => {
//         const itemId = orderElement.getAttribute('data-id');
//         const item = itemsById.get(String(itemId));
//         if (item) {
//           this.selectOrder(item, orderElement);
//         }
//       });
//     });

//     // Эхний захиалгыг автоматаар сонгох
//     const firstElement = orderElements[0];
//     const firstId = firstElement?.getAttribute('data-id');
//     const firstItem = itemsById.get(String(firstId));
    
//     if (firstItem) {
//       this.selectOrder(firstItem, firstElement);
//     }
//   }

//   // Захиалга сонгох
//   selectOrder(item, activeElement) {
//     if (!item) return;

//     // Бүх захиалгаас идэвхтэй классыг авах
//     this.querySelectorAll('d-orders').forEach(element => {
//       element.classList.toggle('is-active', element === activeElement);
//     });

//     // Event үүсгэх
//     const event = new CustomEvent('delivery-select', {
//       detail: {
//         ...item,
//         id: item.orderId || item.id || null,
//         orderId: item.orderId || null,
//       },
//     });
    
//     document.dispatchEvent(event);
//   }
// }

// customElements.define('delivery-page', DeliveryPage);