const word = "MARRY";
const maxGuesses = 6;
let currentRow = 0;
let currentGuess = "";
const board = document.getElementById("board");
const message = document.getElementById("message");
const keyboard = document.getElementById("keyboard");
const keys = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");

function createBoard() {
  board.innerHTML = "";
  for (let i = 0; i < maxGuesses; i++) {
    for (let j = 0; j < word.length; j++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      tile.id = `tile-${i}-${j}`;
      board.appendChild(tile);
    }
  }
}

function createKeyboard() {
  keyboard.innerHTML = "";
  keys.forEach((key) => {
    const keyButton = document.createElement("button");
    keyButton.textContent = key;
    keyButton.classList.add("key");
    keyButton.id = `key-${key}`;
    keyButton.addEventListener("click", () => handleKeyPress(key));
    keyboard.appendChild(keyButton);
  });
}

document.addEventListener("keydown", (event) => {
  const key = event.key.toUpperCase();
  if (keys.includes(key) || key === "ENTER" || key === "BACKSPACE") {
    handleKeyPress(key);
  }
});

function updateBoard() {
  for (let i = 0; i < word.length; i++) {
    const tile = document.getElementById(`tile-${currentRow}-${i}`);
    tile.textContent = currentGuess[i] || "";
  }
}

function checkGuess() {
  if (currentGuess.length < word.length) {
    message.textContent = "Not enough letters.";
    return;
  }

  const guessArr = currentGuess.split("");
  const wordArr = word.split("");
  const tileUpdates = [];

  for (let i = 0; i < word.length; i++) {
    const tile = document.getElementById(`tile-${currentRow}-${i}`);
    const key = document.getElementById(`key-${currentGuess[i]}`);
    if (guessArr[i] === wordArr[i]) {
      tile.classList.add("correct");
      tileUpdates.push(() => key.classList.add("correct"));
      wordArr[i] = null;
    }
  }

  for (let i = 0; i < word.length; i++) {
    const tile = document.getElementById(`tile-${currentRow}-${i}`);
    const key = document.getElementById(`key-${currentGuess[i]}`);
    if (wordArr.includes(guessArr[i]) && !tile.classList.contains("correct")) {
      tile.classList.add("present");
      tileUpdates.push(() => key.classList.add("present"));
      wordArr[wordArr.indexOf(guessArr[i])] = null;
    } else if (!tile.classList.contains("correct")) {
      tile.classList.add("absent");
      tileUpdates.push(() => key.classList.add("absent"));
    }
  }

  tileUpdates.forEach((update) => update());

  if (currentGuess === word) {
    message.textContent = "You guessed it! Will you marry me?";
    return;
  }

  currentRow++;
  currentGuess = "";

  if (currentRow === maxGuesses) {
    message.textContent = `The word was "${word}".`;
  }
}

function handleKeyPress(key) {
  if (message.textContent || currentRow === maxGuesses) return;

  if (key === "ENTER") {
    if (currentGuess.length === word.length) {
      checkGuess();
    }
  } else if (key === "BACKSPACE") {
    currentGuess = currentGuess.slice(0, -1);
    updateBoard();
  } else if (key.length === 1 && /[A-Z]/.test(key)) {
    if (currentGuess.length < word.length) {
      currentGuess += key;
      updateBoard();
    }
  }
}

createBoard();
createKeyboard();