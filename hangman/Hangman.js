const words = ["javascript", "hangman", "canvas", "mongolia", "developer"];
let word = words[Math.floor(Math.random() * words.length)].toUpperCase();
let correctLetters = [];
let wrongLetters = [];
let step = 0;
let usedWord = []

const canvas = document.getElementById('hangmanCanvas');
const ctx = canvas.getContext('2d');
const wordDiv = document.getElementById('word');
const wrongDiv = document.getElementById('wrong');
const messageDiv = document.getElementById('message');
const hintBtn = document.getElementById('hintBtn');
const restartBtn = document.getElementById('restartBtn');
const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');
const statsDiv = document.getElementById('stats');
const timerDiv = document.getElementById('timer');

let wins = parseInt(localStorage.getItem("wins") || "0");
let losses = parseInt(localStorage.getItem("losses") || "0");

let timer;
let timeLeft = 60;

// ------------------------- ИНИТ -------------------------
updateStats();
updateWordDisplay();
updateWrongDisplay();
startTimer();
document.addEventListener("keydown", handleKey);
hintBtn.addEventListener("click", giveHint);
restartBtn.addEventListener("click", () => location.reload());

// ------------------------- ҮНДСЭН ФУНКЦ -------------------------

function handleKey(e) {
    messageDiv.textContent = "";
    const letter = e.key.toUpperCase();
    if (!letter.match(/^[A-Z]$/)) {
        messageDiv.textContent = "Зөвхөн нэг үсэг оруулна уу!";
        return;
    }

    if (correctLetters.includes(letter) || wrongLetters.includes(letter)) {
        messageDiv.textContent = "Энэ үсгийг аль хэдийн орсон байна!";
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateWordDisplay();
    updateWrongDisplay();
    messageDiv.textContent = "";
    hintBtn.disabled = false;
    restartBtn.style.display = "none";
    document.addEventListener("keydown", handleKey);
    startTimer();
}

function updateWrongDisplay() {
    wrongDiv.textContent = "Алдаатай үсгүүд: " + wrongLetters.join(", ");
}

function updateStats() {
    statsDiv.innerHTML = `🎯 Ялалт: ${wins} | 💀 Ялагдал: ${losses}`;
}

function checkGameEnd() {
    const won = word.split("").every(l => correctLetters.includes(l));
    const lost = step >= 7;

    if (won || lost) {
        clearInterval(timer);
        document.removeEventListener("keydown", handleKey);
        hintBtn.disabled = true;
        restartBtn.style.display = "inline-block";

        setTimeout(() => {
            if (won) {
                alert("🎉 Яллаа! Үг: " + word);
                wins++;
                localStorage.setItem("wins", wins);
                updateStats();
                nextWord(); // дараагийн үг
            } else {
                alert("💀 Ялагдлаа! Үг: " + word);
                losses++;
                localStorage.setItem("losses", losses);
                updateStats();
            }
        }, 100);
    }
}

function giveHint() {
    const unguessed = word.split("").filter(l => !correctLetters.includes(l));
    if (unguessed.length === 0) return;

    const hint = unguessed[Math.floor(Math.random() * unguessed.length)];
    correctLetters.push(hint);
    updateWordDisplay();
    hintBtn.disabled = true;
    checkGameEnd();
}

// ------------------------- TIMER -------------------------

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
            hintBtn.disabled = true;
            restartBtn.style.display = "inline-block";
            alert("💀 Ялагдлаа! Үг: " + word);
        }
    }, 1000);
}

function nextWord() {
    word = words[Math.floor(Math.random() * words.length)].toUpperCase();
    correctLetters = [];
    wrongLetters = [];
    step = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateWordDisplay();
    updateWrongDisplay();
    messageDiv.textContent = "";
    hintBtn.disabled = false;
    restartBtn.style.display = "none";
    document.addEventListener("keydown", handleKey);
    startTimer();
}

// ------------------------- ЗУРАГЛАЛ -------------------------

function drawNext() {
    switch(step) {
        case 1: drawGallow(); break;
        case 2: drawHead(); break;
        case 3: drawBody(); break;
        case 4: drawLeftArm(); break;
        case 5: drawRightArm(); break;
        case 6: drawLeftLeg(); break;
        case 7: drawRightLeg(); break;
    }
}

function drawGallow() {
    ctx.beginPath();
    ctx.moveTo(10, 240); ctx.lineTo(190, 240);
    ctx.moveTo(50, 240); ctx.lineTo(50, 20);
    ctx.lineTo(130, 20); ctx.lineTo(130, 40);
    ctx.stroke();
}
function drawHead() {
    ctx.beginPath(); ctx.arc(130, 60, 20, 0, Math.PI * 2); ctx.stroke();
}
function drawBody() {
    ctx.beginPath(); ctx.moveTo(130, 80); ctx.lineTo(130, 140); ctx.stroke();
}
function drawLeftArm() {
    ctx.beginPath(); ctx.moveTo(130, 100); ctx.lineTo(100, 120); ctx.stroke();
}
function drawRightArm() {
    ctx.beginPath(); ctx.moveTo(130, 100); ctx.lineTo(160, 120); ctx.stroke();
}
function drawLeftLeg() {
    ctx.beginPath(); ctx.moveTo(130, 140); ctx.lineTo(110, 180); ctx.stroke();
}
function drawRightLeg() {
    ctx.beginPath(); ctx.moveTo(130, 140); ctx.lineTo(150, 180); ctx.stroke();
}
