// Gamified Memory Game
// Adds: score, streak multiplier, win screen, restart button, finance theme

const cardsArray = [
  { name: "☕" },
  { name: "💳" },
  { name: "📈" },
  { name: "🏦" },
  { name: "💼" },
  { name: "📊" },
  { name: "💰" },
  { name: "🗽" },
];

// Duplicate + shuffle
const gameGrid = cardsArray.concat(cardsArray).sort(() => 0.5 - Math.random());

// --- GAME STATE ---
let firstGuess = "";
let secondGuess = "";
let count = 0;
let previousTarget = null;
const delay = 900;

// --- GAMIFICATION STATE ---
let score = 0;
let streak = 0;
let matchesFound = 0;

// --- DOM HOOKS ---
const game = document.getElementById("game");

// Restart button
document.getElementById("restartBtn").addEventListener("click", () => location.reload());

// Scoreboard
const scoreBoard = document.createElement("div");
scoreBoard.id = "scoreBoard";
scoreBoard.textContent = "Score: 0 | Streak: 0";
document.body.insertBefore(scoreBoard, document.getElementById("game"));

function updateScore() {
  scoreBoard.textContent = `Score: ${score} | Streak: ${streak}`;
}

// --- BUILD GRID ---
const grid = document.createElement("section");
grid.setAttribute("class", "grid");
game.appendChild(grid);

gameGrid.forEach((item) => {
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.name = item.name;

  const front = document.createElement("div");
  front.classList.add("front");

  const back = document.createElement("div");
  back.classList.add("back");
  back.textContent = item.name;

  grid.appendChild(card);
  card.appendChild(front);
  card.appendChild(back);
});

// --- MATCH + RESET LOGIC ---
function lockMatched() {
  const selected = document.querySelectorAll(".selected");
  selected.forEach((card) => card.classList.add("match"));

  streak += 1;
  score += 100 * streak;
  matchesFound += 1;
  updateScore();

  if (matchesFound === cardsArray.length) {
    setTimeout(() => {
      alert(`You win!\nFinal Score: ${score}`);
    }, 300);
  }
}

function resetGuesses() {
  firstGuess = "";
  secondGuess = "";
  count = 0;
  previousTarget = null;
  const selected = document.querySelectorAll(".selected");
  selected.forEach((card) => card.classList.remove("selected"));
}

// --- CLICK HANDLER ---
grid.addEventListener("click", (event) => {
  const clicked = event.target;

  if (
    clicked.nodeName === "SECTION" ||
    clicked === previousTarget ||
    !clicked.parentNode ||
    clicked.parentNode.classList.contains("selected") ||
    clicked.parentNode.classList.contains("match")
  ) {
    return;
  }

  if (count < 2) {
    count += 1;
    if (count === 1) {
      firstGuess = clicked.parentNode.dataset.name;
      clicked.parentNode.classList.add("selected");
    } else {
      secondGuess = clicked.parentNode.dataset.name;
      clicked.parentNode.classList.add("selected");
    }

    if (firstGuess && secondGuess) {
      if (firstGuess === secondGuess) {
        setTimeout(lockMatched, delay);
      } else {
        streak = 0;
        updateScore();
      }
      setTimeout(resetGuesses, delay);
    }
    previousTarget = clicked;
  }
});
