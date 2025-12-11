export const ORDERS = [
  {
    id: "o1",
    title: "GL Burger - 7-р байр 207",
    summary: "3 ширхэг • 10,000₮",
    from: "GL Burger",
    to: "МУИС 7-р байр",
    datetime: "2025.10.08 • 09:36",
    total: "37,000₮",
    items: [
      "XL багц: 10,000₮",
      "M багц: 8,000₮",
      "L багц: 9,000₮"
    ],
    courier: {
      name: "Чигцалмаа",
      phone: "99001234",
      id: "23B1NUM0245",
      avatar: "assets/img/profile.jpg"
    },
    defaultStep: 0
  },
  {
    id: "o2",
    title: "CU - 8-р байр 209",
    summary: "1 ширхэг • 5,000₮",
    from: "CU",
    to: "МУИС 8-р байр",
    datetime: "2025.10.08 • 10:15",
    total: "5,000₮",
    items: [
      "Кола 0.5л: 2,500₮",
      "Чипс: 2,500₮"
    ],
    courier: {
      name: "Бат-Оргил",
      phone: "88112233",
      id: "23B1NUM0312",
      avatar: "assets/img/profile.jpg"
    },
    defaultStep: 1
  }
];

const STEPS_KEY = "deliverySteps";

export function loadSteps() {
  try {
    return JSON.parse(localStorage.getItem(STEPS_KEY)) || {};
  } catch {
    return {};
  }
}

export function saveSteps(steps) {
  localStorage.setItem(STEPS_KEY, JSON.stringify(steps));
}

export function getOrderById(id) {
  return ORDERS.find(o => String(o.id) === String(id)) || ORDERS[0];
}
