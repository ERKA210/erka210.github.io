document.addEventListener('DOMContentLoaded', function() {
  const foodSelect = document.querySelector('.bottom-row select');
  const cartSection = document.getElementById('cart-section');
  const cartItem = document.getElementById('cart-item');
  const cartPrice = document.getElementById('cart-price');

  const prices = {
    'Кимбаб': 5500,
    'Бургер': 7000,
    'Бууз': 4500,
    'Салад': 4000,
    'Кола 0.5л': 1500,
    'Хар цай': 1000,
    'Кофе': 2000,
    'Жүүс 0.33л': 1800
  };

  foodSelect.addEventListener('change', function() {
    const item = this.value;
    const price = prices[item] || 0;

    cartItem.textContent = 'Бараа: ' + item;
    cartPrice.textContent = 'Үнэ: ' + price + '₮';

    // “hidden” классыг арилгаж харагдуулна
    cartSection.classList.remove('hidden');
  });
});