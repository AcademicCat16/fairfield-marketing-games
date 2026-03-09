const game      = document.getElementById("game");
const scoreText = document.getElementById("score");
const timeText  = document.getElementById("time");
const overlay   = document.getElementById("overlay");
const message   = document.getElementById("message");

const fruits = ["🍓", "🍇", "🍑", "🍒", "🍎", "🫐"];

let score = 0;
let timeLeft = 30;
let timer;
let spawnLoop;

function startGame() {
  overlay.style.visibility = "hidden";
  score = 0;
  timeLeft = 30;
  scoreText.textContent = score;
  timeText.textContent = timeLeft;

  clearInterval(timer);
  clearInterval(spawnLoop);

  timer = setInterval(() => {
    timeLeft--;
    timeText.textContent = timeLeft;
    if (timeLeft <= 0) endGame(false);
  }, 1000);

  spawnLoop = setInterval(spawnFruit, 500);
}

function spawnFruit() {
  const fruit = document.createElement("div");
  fruit.className = "fruit";
  fruit.textContent = fruits[Math.floor(Math.random() * fruits.length)];
  fruit.style.left = Math.random() * (game.clientWidth  - 60) + "px";
  fruit.style.top  = 80 + Math.random() * (game.clientHeight - 140) + "px";

  fruit.onclick = () => {
    fruit.remove();
    score++;
    scoreText.textContent = score;
    if (score >= 50) endGame(true);
  };

  setTimeout(() => fruit.remove(), 2000);
  game.appendChild(fruit);
}

function endGame(win) {
  clearInterval(timer);
  clearInterval(spawnLoop);
  document.querySelectorAll(".fruit").forEach(f => f.remove());
  overlay.style.visibility = "visible";
  message.textContent = win
    ? "💜 YOU WIN! SO MANY SQUISHED FRUITS! 💜"
    : "⏰ Time's Up! Try Again!";
}

startGame();
