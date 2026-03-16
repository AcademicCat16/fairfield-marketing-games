const gameArea   = document.getElementById("gameArea");
const player     = document.getElementById("player");
const finish     = document.getElementById("finish");
const scoreDisplay        = document.getElementById("score");
const totalFlowersDisplay = document.getElementById("totalFlowers");
const timerDisplay        = document.getElementById("timer");
const messageDisplay      = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");
const startBtn   = document.getElementById("startBtn");

const FLOWER_EMOJIS = ["🌸","🌺","🌼","🌻","💐","🌷"];
const WEED_EMOJIS   = ["🌿","🪴","🍃","🌱"];

const playerSize = 34;
const moveAmount = 18;

let playerX = 20, playerY = 20;
let score = 0;
const totalFlowers = 8;
let timeLeft = 20;
let timer = null;
let gameOver = false;
let gameStarted = false;
let loseInProgress = false;
const flowers = [];
const weeds   = [];

function getGameSize() {
  return {
    w: gameArea.clientWidth  || 700,
    h: gameArea.clientHeight || 500
  };
}

function isColliding(a, b) {
  const shrink = 6;
  return !(
    (a.x + shrink) + (a.size - shrink * 2) < b.x + shrink ||
    (a.x + shrink) > b.x + (b.size - shrink) ||
    (a.y + shrink) + (a.size - shrink * 2) < b.y + shrink ||
    (a.y + shrink) > b.y + (b.size - shrink)
  );
}

function updatePlayerPosition() {
  player.style.left = `${playerX}px`;
  player.style.top  = `${playerY}px`;
}

function createFlower(x, y) {
  const el = document.createElement("div");
  el.classList.add("flower");
  el.style.left     = `${x}px`;
  el.style.top      = `${y}px`;
  el.style.fontSize = "26px";
  el.style.lineHeight = "28px";
  el.style.textAlign  = "center";
  el.textContent = FLOWER_EMOJIS[Math.floor(Math.random() * FLOWER_EMOJIS.length)];
  gameArea.appendChild(el);
  return el;
}

function createWeed(x, y) {
  const el = document.createElement("div");
  el.classList.add("weed");
  el.style.left     = `${x}px`;
  el.style.top      = `${y}px`;
  el.style.fontSize = "30px";
  el.style.lineHeight = "36px";
  el.style.textAlign  = "center";
  el.textContent = WEED_EMOJIS[Math.floor(Math.random() * WEED_EMOJIS.length)];
  gameArea.appendChild(el);
  return el;
}

function clearOldItems() {
  document.querySelectorAll(".flower, .weed").forEach(el => el.remove());
  flowers.length = 0;
  weeds.length   = 0;
}

function randomPosition(size, existing, minDist) {
  const { w, h } = getGameSize();
  let attempts = 0, pos;
  do {
    pos = {
      x: Math.floor(20 + Math.random() * (w - size - 40)),
      y: Math.floor(20 + Math.random() * (h - size - 40))
    };
    attempts++;
  } while (
    attempts < 100 &&
    existing.some(e => Math.hypot(pos.x - e.x, pos.y - e.y) < minDist)
  );
  return pos;
}

function placeFlowers() {
  const placed = [{ x: playerX, y: playerY }];
  for (let i = 0; i < totalFlowers; i++) {
    const pos = randomPosition(28, placed, 55);
    const el  = createFlower(pos.x, pos.y);
    placed.push(pos);
    flowers.push({ element: el, x: pos.x, y: pos.y, size: 28, collected: false });
  }
}

function placeWeeds() {
  const avoid = [
    { x: playerX, y: playerY },
    ...flowers.map(f => ({ x: f.x, y: f.y }))
  ];
  for (let i = 0; i < 6; i++) {
    const pos = randomPosition(36, avoid, 70);
    const el  = createWeed(pos.x, pos.y);
    avoid.push(pos);
    weeds.push({ element: el, x: pos.x, y: pos.y, size: 36 });
  }
}

function updateScore() {
  scoreDisplay.textContent        = score;
  totalFlowersDisplay.textContent = totalFlowers;
}

function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      loseGame("⏰ Time's up! Press Restart.");
    }
  }, 1000);
}

function checkFlowerCollection() {
  flowers.forEach(flower => {
    if (!flower.collected && isColliding(
      { x: playerX, y: playerY, size: playerSize }, flower
    )) {
      flower.collected = true;
      flower.element.remove();
      score++;
      updateScore();
      if (score === totalFlowers) {
        messageDisplay.textContent = "All flowers collected! Head to the gate 🌸";
      }
    }
  });
}

function checkWeedCollision() {
  if (loseInProgress) return;
  for (const weed of weeds) {
    if (isColliding({ x: playerX, y: playerY, size: playerSize }, weed)) {
      loseGame("🌿 You touched a weed! Press Restart.");
      return;
    }
  }
}

function checkWin() {
  const finishBox = {
    x: finish.offsetLeft,
    y: finish.offsetTop,
    size: 44
  };
  if (score === totalFlowers && isColliding(
    { x: playerX, y: playerY, size: playerSize }, finishBox
  )) {
    gameOver    = true;
    gameStarted = false;
    clearInterval(timer);
    messageDisplay.textContent = "🌻 You won the garden game!";
  }
}

function loseGame(text) {
  if (loseInProgress) return;
  loseInProgress = true;
  gameOver    = true;
  gameStarted = false;
  clearInterval(timer);
  messageDisplay.textContent = text;
}

function resetGame() {
  clearInterval(timer);
  gameOver        = false;
  gameStarted     = false;
  loseInProgress  = false;
  playerX         = 20;
  playerY         = 20;
  score           = 0;
  timeLeft        = 20;
  updatePlayerPosition();
  updateScore();
  timerDisplay.textContent   = timeLeft;
  messageDisplay.textContent = "Press Start to begin!";
  clearOldItems();
  placeFlowers();
  placeWeeds();
}

function startGame() {
  if (gameStarted || gameOver) return;
  gameStarted = true;
  messageDisplay.textContent = "Collect all the glowing flowers! 🌸";
  startTimer();
}

document.addEventListener("keydown", (e) => {
  if (!gameStarted || gameOver) return;
  const arrows = ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"];
  if (arrows.includes(e.key)) e.preventDefault();

  const { w, h } = getGameSize();
  if      (e.key === "ArrowUp"    && playerY > 0)              playerY -= moveAmount;
  else if (e.key === "ArrowDown"  && playerY < h - playerSize) playerY += moveAmount;
  else if (e.key === "ArrowLeft"  && playerX > 0)              playerX -= moveAmount;
  else if (e.key === "ArrowRight" && playerX < w - playerSize) playerX += moveAmount;
  else return;

  playerX = Math.max(0, Math.min(w - playerSize, playerX));
  playerY = Math.max(0, Math.min(h - playerSize, playerY));

  updatePlayerPosition();
  checkFlowerCollection();
  checkWeedCollision();
  checkWin();
});

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", resetGame);

// Set finish gate emoji via JS too
finish.textContent = "🚪";

resetGame();
