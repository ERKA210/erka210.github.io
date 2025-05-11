import { initGame } from './game.js';
import { loadNickname } from './storage.js';

const startButton = document.getElementById('startButton');
const nicknameInput = document.getElementById('nicknameInput');
const nicknameModal = document.getElementById('nicknameModal');

startButton.addEventListener('click', () => {
  const nickname = nicknameInput.value.trim();
  if (nickname.length < 2) {
    alert('Нэрээ зөв оруулна уу.');
    return;
  }
  localStorage.setItem('nickname', nickname);
  nicknameModal.classList.add('hidden');
  document.getElementById('gameContainer').classList.remove('hidden');
  initGame();
});

// Хэрвээ өмнө нь cookie/localStorage дээр нэр байгаа бол шууд тоглоом руу
window.addEventListener('DOMContentLoaded', () => {
  const storedName = loadNickname();
  if (storedName) {
    nicknameModal.classList.add('hidden');
    document.getElementById('gameContainer').classList.remove('hidden');
    initGame();
  }
});
// src/game.js
import { getRandomWord } from './wordManager.js';
import { updateWordDisplay, resetUI, updateHangmanImage, showVictory, showDefeat } from './ui.js';
import { createKeyboard, disableKeyboard, enableKeyboard } from './keyboard.js';
import { saveScore, loadNickname } from './storage.js';

let currentWord = '';
let guessedLetters = [];
let wrongGuesses = 0;
let score = 0;
let timer;
let timeLeft = 60;

export function initGame() {
  resetUI();
  score = 0;
  document.getElementById('score').textContent = `Оноо: ${score}`;
  startTimer();
  loadNextWord();
}

function loadNextWord() {
  const { word, question } = getRandomWord();
  currentWord = word.toUpperCase();
  guessedLetters = [];
  wrongGuesses = 0;
  document.getElementById('question').textContent = question;
  updateWordDisplay(currentWord, guessedLetters);
  updateHangmanImage(wrongGuesses);
  createKeyboard(handleGuess);
}

function handleGuess(letter) {
  if (currentWord.includes(letter)) {
    guessedLetters.push(letter);
    updateWordDisplay(currentWord, guessedLetters);
    if (isWordGuessed()) {
      score++;
      document.getElementById('score').textContent = `Оноо: ${score}`;
      loadNextWord();
    }
  } else {
    wrongGuesses++;
    updateHangmanImage(wrongGuesses);
    if (wrongGuesses >= 6) {
      disableKeyboard();
      showDefeat(currentWord);
    }
  }
}

function isWordGuessed() {
  return [...currentWord].every(l => guessedLetters.includes(l));
}

function startTimer() {
  timeLeft = 60;
  document.getElementById('timer').textContent = `Цаг: ${timeLeft}`;
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').textContent = `Цаг: ${timeLeft}`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      endGame();
    }
  }, 1000);
}

document.getElementById('end-game').addEventListener('click', () => {
    const username = localStorage.getItem('nickname');
    const score = calculateScore();
    saveScore(username, score);
    window.location.href = 'leaderboard.html';
});

window.onload = function() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

    const tableBody = document.querySelector('#leaderboard tbody');
    leaderboard.sort((a, b) => b.score - a.score);

    leaderboard.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${item.name}</td><td>${item.score}</td>`;
        tableBody.appendChild(row);
    });
};
    function search(){
        var text = document.getElementById('search').value;
        const tr = document.getElementsByTagName('tr');
        for (let i=1;i<tr.length;i++){
            if(!tr[i].children[1].children[1].innerHTML.toLowerCase().includes(
                text.toLowerCase()
            )){
                tr[i].style.display = 'none';
            }
            else{
                tr[i].style.display = '';
            }
        }
    }
      window.onload = function() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const tbody = document.querySelector("table tbody");

    tbody.innerHTML = '';

    leaderboard.sort((a, b) => b.score - a.score);

    leaderboard.forEach((player, index) => {
      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${index + 1}</td>
        <td><p>${player.name}</p></td>
        <td>${player.score}</td>
        <td>${player.score}</td> 
      `;

      tbody.appendChild(row);
    });
  }