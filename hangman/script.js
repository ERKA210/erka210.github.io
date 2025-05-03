let currentWord = '';
let validWords = [];
let score = 0;
let lettersList = [];

const display = document.getElementById('display');
const result = document.getElementById('result');
const fileInput = document.getElementById('words');

fileInput.addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const text = e.target.result;
      validWords = text.split(/\r?\n/).map(word => word.trim().toUpperCase());
      console.log(validWords);
    };
    reader.readAsText(file);
  }
});

function generateRandomLetters() {
  const numLetters = parseInt(document.getElementById('numLetters').value) || 1;
  const vowels = 'AEIOU';
  const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';

  const numVowels = Math.ceil(numLetters / 3);
  const numConsonants = numLetters - numVowels;

  lettersList = [];

  for (let i = 0; i < numVowels; i++) {
    addRandomLetter(generateRandomLetter('vowel'));
  }

  for (let i = 0; i < numConsonants; i++) {
    addRandomLetter(generateRandomLetter('consonant'));
  }
}

function generateRandomLetter(type) {
  const letterSet = type === 'vowel' ? 'AEIOU' : 'BCDFGHJKLMNPQRSTVWXYZ';
  const randomIndex = Math.floor(Math.random() * letterSet.length);
  return letterSet[randomIndex];
}

function addRandomLetter(newLetter) {
  lettersList.push(newLetter);
  console.log(`Нэмэгдсэн үсэг: ${newLetter}`);
  updateLetterDisplay();  
}

function useLetter(letter) {
  const index = lettersList.indexOf(letter);
  if (index > -1) {
    lettersList.splice(index, 1);
    console.log(`Хасагдсан үсэг: ${letter}`);
  } else {
    console.log(`Үсэг ${letter} ороогүй байна.`);
  }
  updateLetterDisplay();  
}

function checkWord() {
  const upperWord = currentWord.toUpperCase();
  const tempLetters = [...lettersList];
  let canBuild = true;

  for (let letter of upperWord) {
    const index = tempLetters.indexOf(letter);
    if (index > -1) {
      tempLetters.splice(index, 1);
    } else {
      canBuild = false;
      break;
    }
  }

  if (!canBuild) {
    result.textContent = 'Үсгүүд хүрэлцэхгүй байна.';
  } else if (validWords.includes(upperWord)) {
    result.textContent = `Зөв! Оноо авлаа: ${upperWord.length}`;
    updateScore(upperWord.length);
    for (let letter of upperWord) {
      useLetter(letter);
    }
  } else {
    result.textContent = 'Буруу үг.';
  }

  currentWord = '';
  updateDisplay();
}

function pressKey(letter) {
  currentWord += letter;
  updateDisplay();
}

function setOperation(op) {
  if (op === 'backspace') {
    currentWord = currentWord.slice(0, -1);
    updateDisplay();
  } else if (op === 'enter') {
    checkWord();
  }
}

function updateDisplay() {
  display.textContent = currentWord || '_';
}

function updateLetterDisplay() {
  const letterDisplay = document.getElementById('letters-display');
  letterDisplay.textContent = `Available Letters: ${lettersList.join(', ')}`;
}

function updateScore(points) {
  score += points;
  document.getElementById('score').textContent = `Оноо: ${score}`;
}