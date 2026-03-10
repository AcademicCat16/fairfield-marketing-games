const emojis = ["🌱", "🌍", "🌞", "🌳", "🌱", "🌍", "🌞", "🌳"];
let shuffled = emojis.sort(() => 0.5 - Math.random());

const game = document.getElementById("game");
const scoreDisplay = document.getElementById("score");

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let score = 0;

shuffled.forEach(symbol => {
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.value = symbol;
  card.innerText = "";
  card.addEventListener("click", flipCard);
  game.appendChild(card);
});

function flipCard() {
  if (lockBoard || this.classList.contains("flipped") || this.classList.contains("matched")) return;
  this.innerText = this.dataset.value;
  this.classList.add("flipped");
  if (!firstCard) {
    firstCard = this;
  } else {
    secondCard = this;
    checkMatch();
  }
}

function checkMatch() {
  if (firstCard.dataset.value === secondCard.dataset.value) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    score += 10;
    updateScore();
    resetBoard();
  } else {
    score -= 2;
    updateScore();
    lockBoard = true;
    setTimeout(() => {
      firstCard.innerText = "";
      secondCard.innerText = "";
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetBoard();
    }, 800);
  }
}

function updateScore() {
  scoreDisplay.innerText = "Score: " + score;
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}
