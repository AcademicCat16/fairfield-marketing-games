const emojis = ["👾", "🕹️", "💣", "🚀", "🎮", "⚡", "💀", "🔥"];

let firstCard  = null;
let secondCard = null;
let lockBoard  = false;
let matches    = 0;
let moveCount  = 0;
let seconds    = 0;
let timerInterval = null;

const grid       = document.getElementById("grid");
const statusText = document.getElementById("status");
const movesEl    = document.getElementById("moves");
const matchEl    = document.getElementById("matchCount");
const timerEl    = document.getElementById("timer");

function shuffle(arr) {
  return [...arr, ...arr].sort(() => Math.random() - 0.5);
}

function startTimer() {
  clearInterval(timerInterval);
  seconds = 0;
  timerEl.textContent = "0";
  timerInterval = setInterval(() => {
    seconds++;
    timerEl.textContent = seconds;
  }, 1000);
}

function buildGrid() {
  grid.innerHTML = "";
  firstCard = secondCard = null;
  lockBoard = false;
  matches = moveCount = 0;
  movesEl.textContent = "0";
  matchEl.textContent = "0";
  statusText.textContent = "";
  startTimer();

  shuffle(emojis).forEach(symbol => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.symbol = symbol;
    card.textContent = "";
    grid.appendChild(card);
    card.addEventListener("click", () => flipCard(card));
  });
}

function flipCard(card) {
  if (lockBoard || card === firstCard || card.classList.contains("matched")) return;

  card.classList.add("flipped");
  card.textContent = card.dataset.symbol;

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  moveCount++;
  movesEl.textContent = moveCount;
  lockBoard = true;
  checkMatch();
}

function checkMatch() {
  if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
    // Match!
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    matches++;
    matchEl.textContent = matches;
    resetTurn();
    checkWin();
  } else {
    // No match — flash red then flip back
    firstCard.classList.add("wrong");
    secondCard.classList.add("wrong");
    setTimeout(() => {
      firstCard.classList.remove("flipped", "wrong");
      secondCard.classList.remove("flipped", "wrong");
      firstCard.textContent = "";
      secondCard.textContent = "";
      resetTurn();
    }, 700);
  }
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function checkWin() {
  if (matches === emojis.length) {
    clearInterval(timerInterval);
    statusText.textContent = `YOU WIN! ${seconds}s • ${moveCount} moves`;
  }
}

document.getElementById("restartBtn").addEventListener("click", buildGrid);

// Start
buildGrid();
