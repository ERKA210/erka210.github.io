export function getDeliveryFee(totalQty) {

  if (totalQty > 5) return 1500;
  if (totalQty >= 2) return 1000;
  if (totalQty === 1) return 500;
  return 0;
}