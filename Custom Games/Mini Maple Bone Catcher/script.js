const maple          = document.getElementById("maple");
const gameArea       = document.getElementById("gameArea");
const scoreDisplay   = document.getElementById("score");
const livesDisplay   = document.getElementById("lives");
const highScoreDisplay = document.getElementById("highScore");
const finalScore     = document.getElementById("finalScore");
const finalHighScore = document.getElementById("finalHighScore");
const startScreen    = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");

let score = 0;
let lives = 3;
let highScore = 0;
let mapleX = 180;
let gameRunning = false;
let boneInterval;

document.addEventListener("keydown", (e) => {
  if (!gameRunning) return;
  if (e.key === "ArrowLeft") {
    mapleX -= 45;
    if (mapleX < 0) mapleX = 0;
  }
  if (e.key === "ArrowRight") {
    mapleX += 45;
    if (mapleX > 340) mapleX = 340;
  }
  maple.style.left = mapleX + "px";
});

function createBone() {
  const bone = document.createElement("div");
  bone.classList.add("bone");
  bone.innerHTML = "🦴";  // fixed
  bone.style.left = Math.random() * 420 + "px";
  bone.style.top = "0px";
  gameArea.appendChild(bone);

  let boneY = 0;
  const fall = setInterval(() => {
    if (!gameRunning) { clearInterval(fall); bone.remove(); return; }
    boneY += 6;
    bone.style.top = boneY + "px";

    const mapleRect = maple.getBoundingClientRect();
    const boneRect  = bone.getBoundingClientRect();

    if (
      boneRect.bottom >= mapleRect.top &&
      boneRect.left < mapleRect.right &&
      boneRect.right > mapleRect.left
    ) {
      score++;
      scoreDisplay.textContent = score;
      createSparkles(bone.offsetLeft, boneY);
      bone.remove();
      clearInterval(fall);
    }

    if (boneY > 500) {
      lives--;
      livesDisplay.textContent = lives;
      bone.remove();
      clearInterval(fall);
      if (lives === 0) endGame();
    }
  }, 20);
}

function createSparkles(x, y) {
  for (let i = 0; i < 5; i++) {
    const sparkle = document.createElement("div");
    sparkle.classList.add("sparkle");
    sparkle.innerHTML = "✨";  // fixed
    sparkle.style.left = x + Math.random() * 40 + "px";
    sparkle.style.top  = y + Math.random() * 40 + "px";
    gameArea.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 800);
  }
}

function startGame() {
  score = 0;
  lives = 3;
  scoreDisplay.textContent = score;
  livesDisplay.textContent = lives;
  mapleX = 180;
  maple.style.left = mapleX + "px";
  startScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  gameRunning = true;
  boneInterval = setInterval(createBone, 1000);
}

function endGame() {
  gameRunning = false;
  clearInterval(boneInterval);
  if (score > highScore) highScore = score;
  highScoreDisplay.textContent = highScore;
  finalScore.textContent = highScore;
  finalHighScore.textContent = highScore;
  gameOverScreen.classList.remove("hidden");
}

document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("restartBtn").addEventListener("click", startGame);
