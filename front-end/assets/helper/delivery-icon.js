function getDeliveryIcon(totalQty) {
    if (totalQty > 5) return "assets/img/box.svg";
    if (totalQty >= 2) return "assets/img/tor.svg";
    if (totalQty === 1) return "assets/img/document.svg";
    return "assets/img/document.svg";
  }

export { getDeliveryIcon };