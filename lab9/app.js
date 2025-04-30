const exchangeArray = [
  { name: 'USD', value: 1 },
  { name: 'EUR', value: 0.88 },
  { name: 'POUND', value: 0.75 },
  { name: 'WON', value: 1433 },
  { name: 'YEN', value: 142 },
  { name: 'YAN', value: 7.31 },
  { name: 'MNT', value: 3537 }
];

const display = document.getElementById('display');
const result = document.getElementById('result');
const fromCurrency = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');
const toggleBtn = document.getElementById("themeToggle");
const body = document.body;

let currentInput = "";
let previousInput = "";
let operation = null;

toggleBtn.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  body.classList.toggle("light-mode");
  toggleBtn.textContent = body.classList.contains("dark-mode") ? "☀️" : "🌙";
});

function populateDropdowns() {
  exchangeArray.forEach(currency => {
    const option1 = document.createElement('option');
    option1.value = currency.name;
    option1.textContent = currency.name;

    const option2 = option1.cloneNode(true);

    fromCurrency.appendChild(option1);
    toCurrency.appendChild(option2);
  });

  fromCurrency.value = 'USD';
  toCurrency.value = 'MNT';
}

function appendNumber(num) {
  if (num === '.' && currentInput.includes('.')) return;
  currentInput += num;
  display.textContent = currentInput;
}


function setOperation(op) {
  if (currentInput === "") return;
  if (previousInput !== "") {
    compute();
  }
  operation = op;
  previousInput = currentInput;
  currentInput = "";
}

function compute() {
  let resultVal;
  const prev = parseFloat(previousInput);
  const current = parseFloat(currentInput);
  if (isNaN(prev) || isNaN(current)) return;

  switch (operation) {
    case '+':
      resultVal = prev + current;
      break;
    case '-':
      resultVal = prev - current;
      break;
    case '*':
      resultVal = prev * current;
      break;
    case '/':
      if (current === 0) {
        display.textContent = "Тэгээр хувааж болохгүй!";
        return;
      }
      resultVal = prev / current;
      break;
    default:
      return;
  }

  display.textContent = resultVal;
  currentInput = resultVal.toString();
  previousInput = "";
  operation = null;
}

function clearDisplay() {
  currentInput = "";
  previousInput = "";
  operation = null;
  display.textContent = "0";
  result.textContent = "Хөрвүүлсэн дүн энд гарна";
}

function convertCurrency() {
  const from = fromCurrency.value;
  const to = toCurrency.value;
  const amount = parseFloat(currentInput);

  if (isNaN(amount)) {
    result.textContent = "Зөв тоо оруулна уу.";
    return;
  }

  const fromRate = exchangeArray.find(c => c.name === from).value;
  const toRate = exchangeArray.find(c => c.name === to).value;

  const converted = (amount / fromRate) * toRate;
  result.textContent = `${amount} ${from} = ${converted.toFixed(2)} ${to}`;
}

populateDropdowns();
