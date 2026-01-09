import { apiFetch } from "../api_client.js";

class OrderConfirm extends HTMLElement {
  constructor() {
    super();
    this.pendingOrder = null;
    this.pendingOffer = null;
    this.confirmModal = null;
    this.handleConfirm = () => this.batalgaajuulahZahialga();
    this.handleCancel = () => this.hideBatalgaajiltModal();
  }

  connectedCallback() {
    this.bindModal();
    this.attach();
  }

  attach() {
    if (!this.confirmModal) return;
    this.confirmModal.addEventListener("confirm", this.handleConfirm);
    this.confirmModal.addEventListener("cancel", this.handleCancel);
  }

  disconnectedCallback() {
    this.detach();
  }

  detach() {
    if (!this.confirmModal) return;
    this.confirmModal.removeEventListener("confirm", this.handleConfirm);
    this.confirmModal.removeEventListener("cancel", this.handleCancel);
  }

  bindModal() {
    const root = this.closest("home-page") || document;
    this.confirmModal = root.querySelector("confirm-modal");
  }

  formatUne(n) {
    return Number(n || 0).toLocaleString("mn-MN") + "₮";
  }

  formatTovch(ts) {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return "";
    const date = d.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
    const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return `${date} • ${time}`;
  }

  open(order, summary) {
    if (!this.confirmModal) this.bindModal();
    if (!this.confirmModal || typeof this.confirmModal.open !== "function") return;
    this.pendingOrder = order || null;
    this.pendingOffer = summary || null;
    this.confirmModal.open(order, summary);
  }

  hideBatalgaajiltModal() {
    if (!this.confirmModal) return;
    this.confirmModal.close();
    this.pendingOrder = null;
    this.pendingOffer = null;
  }

  async tentsvvlehHereglegchMedeelel(userId) {
    if (!userId) return;
    const res = await apiFetch(`/api/customers/${userId}`);
    if (!res.ok) return;
    const data = await res.json();
    if (data) {
      if (data.name) localStorage.setItem("userName", data.name);
      if (data.phone) localStorage.setItem("userPhone", data.phone);
      localStorage.setItem("userId", data.id);
      if (data.student_id) {
        localStorage.setItem("userDisplayId", data.student_id);
      }
      window.dispatchEvent(new Event("user-updated"));
    }
  }

  async batalgaajuulahZahialga() {
    if (!this.pendingOrder || !this.pendingOffer) {
      this.hideBatalgaajiltModal();
      return;
    }

    const { userId, registered } = this.readNevtrelt();
    if (!registered || !this.shalgahUuid(userId)) {
      localStorage.setItem("pendingOrderDraft", JSON.stringify(this.pendingOrder));
      localStorage.setItem("pendingOfferDraft", JSON.stringify(this.pendingOffer));
      this.hideBatalgaajiltModal();
      location.hash = "#login";
      return;
    }

    if (!this.pendingOrder.fromId || !this.pendingOrder.toId) {
      alert("Хаанаас/Хаашаа сонгоно уу");
      return;
    }

    if (!Array.isArray(this.pendingOffer.items) || this.pendingOffer.items.length === 0) {
      alert("Сагс хоосон байна");
      return;
    }

    const safeItems = this.pendingOffer.items
      .map((i) => {
        const unitPrice = Number(i.price);
        const qty = Number(i.qty);
        return {
          menuItemKey: i.id,
          name: i.name,
          unitPrice: Number.isFinite(unitPrice) ? unitPrice : 0,
          qty: Number.isFinite(qty) && qty > 0 ? qty : 1,
          options: {},
        };
      })
      .filter((i) => i.qty > 0);

    const payload = this.buildIlgeehData(userId, safeItems);

    try {
      const resp = await apiFetch(`/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        alert(data?.error || "Захиалга үүсгэхэд алдаа гарлаа");
        return;
      }

      if (data?.customerId) {
        localStorage.setItem("userId", data.customerId);
        this.tentsvvlehHereglegchMedeelel(data.customerId);
      }

      this.writeIdevhteiZahialga();
      this.saveSanal(data);
      this.hideBatalgaajiltModal();
      this.guilgehSanalRuu();
    } catch (e) {
      alert("Сервертэй холбогдож чадсангүй");
    }
  }

  readNevtrelt() {
    return {
      userId: localStorage.getItem("userId"),
      registered: localStorage.getItem("userRegistered") === "1",
    };
  }

  shalgahUuid(value) {
    const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRe.test(value || "");
  }

  buildIlgeehData(userId, safeItems) {
    return {
      customerId: userId || null,
      fromPlaceId: this.pendingOrder.fromId,
      toPlaceId: this.pendingOrder.toId,
      scheduledAt: this.pendingOrder.createdAt,
      deliveryFee: Number.isFinite(this.pendingOffer.deliveryFee) ? this.pendingOffer.deliveryFee : 0,
      items: safeItems,
      customerName: `${localStorage.getItem("userLastName") || ""} ${localStorage.getItem("userName") || "Зочин хэрэглэгч"}`.trim(),
      customerPhone: localStorage.getItem("userPhone") || "00000000",
      customerStudentId: localStorage.getItem("userDisplayId") || "",
      note: this.pendingOrder.fromDetail ? `Pickup: ${this.pendingOrder.fromDetail}` : null,
    };
  }

  writeIdevhteiZahialga() {
    localStorage.setItem("activeOrder", JSON.stringify(this.pendingOrder));
    localStorage.setItem("orderStep", "0");
    window.dispatchEvent(new Event("order-updated"));
  }

  saveSanal(data) {
    const existingOffers = JSON.parse(localStorage.getItem("offers") || "[]");
    existingOffers.unshift({
      ...this.pendingOffer,
      orderId: data.orderId,
      meta: this.formatTovch(this.pendingOrder.createdAt),
      from: this.pendingOrder.from,
      fromDetail: this.pendingOrder.fromDetail,
      to: this.pendingOrder.to,
      title: `${this.pendingOrder.from} - ${this.pendingOrder.to}`,
      price: this.formatUne((data?.total ?? this.pendingOffer.total) || 0),
      thumb: this.pendingOffer.thumb || "assets/img/box.svg",
      sub: this.pendingOffer.items.map((it) => ({
        name: `${it.name} x${it.qty}`,
        price: this.formatUne(it.price * it.qty)
      }))
    });
    localStorage.setItem("offers", JSON.stringify(existingOffers));

    const offersEl = document.querySelector("#offers");
    if (offersEl && "items" in offersEl) {
      offersEl.items = existingOffers;
    }
  }

  guilgehSanalRuu() {
    const offersSection = document.querySelector("#offers");
    if (!offersSection || !offersSection.scrollIntoView) return;
    setTimeout(() => {
      offersSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  }
}

customElements.define("order-confirm", OrderConfirm);
