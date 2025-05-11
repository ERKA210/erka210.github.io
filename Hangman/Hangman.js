const words = [
  { word: "Алгоритм", meaning: "Өгөгдлийн боловсруулалтыг шийдэхийн тулд ашигладаг тодорхой журам." },
  { word: "Бинар", meaning: "2-ртын тооллын систем" }
  { word: "Сүлжээ", meaning: "Олон компьютер, төхөөрөмжийг холбож ажиллуулах систем." }
  { word: "Компилятор", meaning: "Програмыг бичсэн кодоос машинд ойлгомжтой хэл рүү хөрвүүлэгч програм." }
  { word: "Дебаг", meaning: "Алдаа олж засварлах үйл явц." }
  { word: "Синтакс", meaning: "Програмчлалын хэлний дүрэм, үгсийн харилцан холбоо." }
  { word: "Программчлал", meaning: "Компьютерийг зааварлах хэл ашиглан код бичих үйл явц." }
  { word: "Функц", meaning: "Програмчлалд тодорхой үүрэг гүйцэтгэдэг бие даасан хэсэг." }
  { word: "Программ", meaning: "Компьютерийн үйл ажиллагааг удирдах кодын цогц." }
  { word: "Төхөөрөмж", meaning: "Компьютерийн бүх физик эд ангиуд." }
  { word: "Шифрлэл", meaning: "Мэдээллийг хамгаалах зорилгоор өөрчлөх үйл явц." }
  { word: "Пиксел", meaning: "Дижитал дүрсийг бүрдүүлдэг жижиг цэг." }
  { word: "Өгөгдлийн сан", meaning: "Мэдээллийг хадгалах, удирдах систем." }
  { word: "Сервер", meaning: "Сүлжээнд холбогдсон бусад төхөөрөмжүүдэд үйлчилдэг компьютер." }
  { word: "Код", meaning: "Програмыг бичихэд хэрэглэдэг зааварчилгаа." }
  { word: "Үйлдлийн систем", meaning: "Компьютерийн үндсэн програм, хэрэглэгчийн хөтөч." }
  { word: "Галын хана", meaning: "Мэдээллийн аюулгүй байдлыг хамгаалах технологи." }
];

let current = words[Math.floor(Math.random() * words.length)];
let word = current.word.toUpperCase();

let correctLetters = [];
let wrongLetters = [];
let usedWords = [];
let step = 0;

const meaningDiv = document.getElementById('meaning');
meaningDiv.textContent = `${current.meaning}`;
const wordDiv = document.getElementById('word');
const wrongDiv = document.getElementById('wrong');
const messageDiv = document.getElementById('message');
const restartBtn = document.getElementById('restartBtn');
const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');
const statsDiv = document.getElementById('stats');
const timerDiv = document.getElementById('timer');

let nickname = localStorage.getItem("nickname") || prompt("Тоглогчийн нэр оруулна уу:");
localStorage.setItem("nickname", nickname);

const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
let player = leaderboard.find(entry => entry.name === nickname);
let wins = 0;
let losses = 0;

if (!player) {
  wins = 0;
  losses = 0;
  leaderboard.push({ name: nickname, wins: 0, losses: 0 });
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
} else {
  wins = player.wins;
  losses = player.losses;
}

updateStats();
updateWordDisplay();
updateWrongDisplay();
startTimer();
document.addEventListener("keydown", handleKey);
restartBtn.addEventListener("click", () => location.reload());

function handleKey(e) {
  messageDiv.textContent = "";
  const letter = e.key.toUpperCase();
  if (!letter.match(/^[А-ЯЁӨҮ]{1}$/i)) {
    messageDiv.textContent = "Зөвхөн нэг үсэг оруулна уу!";
    return;
  }
  if (correctLetters.includes(letter) || wrongLetters.includes(letter)) {
    messageDiv.textContent = "Энэ үсгийг аль хэдийн оруулсан байна!";
    return;
  }
  if (word.includes(letter)) {
    correctLetters.push(letter);
    correctSound.play();
    updateWordDisplay();
  } else {
    wrongLetters.push(letter);
    step++;
    drawNext();
    wrongSound.play();
    updateWrongDisplay();
  }
  checkGameEnd();
}

function updateWordDisplay() {
  wordDiv.textContent = word
    .split("")
    .map(l => (correctLetters.includes(l) ? l : "_"))
    .join(" ");
  meaningDiv.textContent = ` ${current.meaning}`;
}

function updateWrongDisplay() {
  wrongDiv.textContent = "Алдаатай үсгүүд: " + wrongLetters.join(", ");
}

function updateStats() {
  statsDiv.innerHTML = `🎯 Ялалт: ${wins} | 💀 Ялагдал: ${losses} | Тоглогч: ${nickname}`;
}

function checkGameEnd() {
  const won = word.split("").every(l => correctLetters.includes(l));
  const lost = step >= 4;

  if (won) {
    wins++;
    localStorage.setItem("wins", wins);
    updateStats();
    saveScore(nickname, "wins");
    document.removeEventListener("keydown", handleKey);
    restartBtn.style.display = "inline-block";
    nextWord();
  }

  if (lost) {
    losses++;
    localStorage.setItem("losses", losses);
    updateStats();
    saveScore(nickname, "losses");
    messageDiv.textContent = "💀 Ялагдлаа!";
    alert("💀 Ялагдлаа! Үг: " + word);
    document.removeEventListener("keydown", handleKey);
    restartBtn.style.display = "inline-block";
  }
}


function drawNext() {
  const parts = ["head", "body", "leg-left", "leg-right"];
  if (step <= parts.length) {
    const partId = parts[step - 1];
    const partElement = document.getElementById(partId);
    if (partElement) {
      partElement.style.display = "block";
    }
  }
}

function startTimer() {
  clearInterval(timer);
  timeLeft = 60;
  timerDiv.textContent = `⏱ Үлдсэн хугацаа: ${timeLeft} сек`;
  timer = setInterval(() => {
    timeLeft--;
    timerDiv.textContent = `⏱ Үлдсэн хугацаа: ${timeLeft} сек`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      messageDiv.textContent = "⏰ Хугацаа дууслаа!";
      losses++;
      localStorage.setItem("losses", losses);
      updateStats();
      saveScore(nickname, "losses");
      document.removeEventListener("keydown", handleKey);
      restartBtn.style.display = "inline-block";
      alert("💀 Ялагдлаа! Үг: " + word);
    }
  }, 1000);
}

function nextWord() {
  if (usedWords.length === words.length) {
    alert("👏 Та бүх үгсийг таалаа! Тоглоом дахин эхэлнэ.");
    usedWords = [];
  }
  let newWordObj;
  do {
    newWordObj = words[Math.floor(Math.random() * words.length)];
  } while (usedWords.includes(newWordObj.word));

  usedWords.push(newWordObj.word);
  current = newWordObj;
  word = current.word.toUpperCase();
  correctLetters = [];
  wrongLetters = [];
  step = 0;
  document.querySelectorAll("#head, #body, #leg-left, #leg-right").forEach(el => el.style.display = "none");
  updateWordDisplay();
  updateWrongDisplay();
  messageDiv.textContent = "";
  restartBtn.style.display = "none";
  document.addEventListener("keydown", handleKey);
}

function saveScore(name, scoreType) {
  const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

  const player = leaderboard.find(entry => entry.name === name);
  if (player) {
    player[scoreType]++;
  } else {
    const newPlayer = { name, wins: 0, losses: 0 };
    newPlayer[scoreType] = 1;
    leaderboard.push(newPlayer);
  }

  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}
