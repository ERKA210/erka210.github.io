const words = ["javascript", "hangman", "canvas", "python", "developer", "padding", "margin", "html", "cascading", "width", "height", "color", "center", "left", "right", "display", "button", "body", "head"];
let word = words[Math.floor(Math.random() * words.length)].toUpperCase();
let correctLetters = [];
let wrongLetters = [];
let usedWords = [];
let step = 0;

const wordDiv = document.getElementById('word');
const wrongDiv = document.getElementById('wrong');
const messageDiv = document.getElementById('message');
const restartBtn = document.getElementById('restartBtn');
const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');
const statsDiv = document.getElementById('stats');
const timerDiv = document.getElementById('timer');

let wins = parseInt(localStorage.getItem("wins") || "0");
let losses = parseInt(localStorage.getItem("losses") || "0");

let timer;
let timeLeft = 60;

updateStats();
updateWordDisplay();
updateWrongDisplay();
startTimer();
document.addEventListener("keydown", handleKey);
restartBtn.addEventListener("click", () => location.reload());
saveScore(loadNickname(), score);


function handleKey(e) {
  messageDiv.textContent = "";
  const letter = e.key.toUpperCase();
  if (!letter.match(/^[A-Z]$/)) {
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
}

function updateWrongDisplay() {
  wrongDiv.textContent = "Алдаатай үсгүүд: " + wrongLetters.join(", ");
}

function updateStats() {
  statsDiv.innerHTML = `🎯 Ялалт: ${wins} | 💀 Ялагдал: ${losses}`;
}

function checkGameEnd() {
  const won = word.split("").every(l => correctLetters.includes(l));
  const lost = step >= 4;

  if (won || lost) {
    clearInterval(timer);
    document.removeEventListener("keydown", handleKey);
    restartBtn.style.display = "inline-block";

    setTimeout(() => {
      if (won) {
        wins++;
        localStorage.setItem("wins", wins);
        updateStats();
        nextWord();
      } else {
        alert("💀 Ялагдлаа! Үг: " + word);
        losses++;
        localStorage.setItem("losses", losses);
        updateStats();
      }
    }, 100);
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
  let newWord;
  do {
    newWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
  } while (usedWords.includes(newWord));

  usedWords.push(newWord);
  word = newWord;
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

function saveScore(name, score) {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({ name, score });
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}
