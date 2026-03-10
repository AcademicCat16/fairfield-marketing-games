const canvas        = document.getElementById("gameCanvas");
const ctx           = canvas.getContext("2d");
const scoreElement  = document.getElementById("scoreBoard");

const gridSize  = 20;
const tileCount = canvas.width / gridSize;

let score = 0;
let dx = 0;
let dy = 0;

let snake = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 }
];

let foodX = 5;
let foodY = 5;

function drawGame() {
  updateSnakePosition();
  if (checkGameOver()) {
    alert(`Game Over! Your score: ${score}`);
    resetGame();
    return;
  }
  clearCanvas();
  checkFoodCollision();
  drawFood();
  drawSnake();
  setTimeout(drawGame, 100);
}

function clearCanvas() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  snake.forEach((part, index) => {
    ctx.fillStyle = index === 0 ? "#8BC34A" : "#4CAF50";
    ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
  });
}

function updateSnakePosition() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  if (dx !== 0 || dy !== 0) {
    snake.unshift(head);
    snake.pop();
  }
}

function drawFood() {
  ctx.fillStyle = "#FF5252";
  ctx.fillRect(foodX * gridSize, foodY * gridSize, gridSize - 2, gridSize - 2);
}

function checkFoodCollision() {
  if (snake[0].x === foodX && snake[0].y === foodY) {
    score += 10;
    scoreElement.innerText = `Score: ${score}`;
    generateFood();
    snake.push({});
  }
}

function generateFood() {
  foodX = Math.floor(Math.random() * tileCount);
  foodY = Math.floor(Math.random() * tileCount);
}

function checkGameOver() {
  const head = snake[0];
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) return true;
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) return true;
  }
  return false;
}

function resetGame() {
  score = 0;
  scoreElement.innerText = "Score: 0";
  snake = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
  dx = 0;
  dy = 0;
  generateFood();
  drawGame();
}

document.addEventListener("keydown", (event) => {
  const k = event.key;
  if (k === "ArrowUp"    && dy !== 1)  { dx = 0;  dy = -1; }
  if (k === "ArrowDown"  && dy !== -1) { dx = 0;  dy =  1; }
  if (k === "ArrowLeft"  && dx !== 1)  { dx = -1; dy =  0; }
  if (k === "ArrowRight" && dx !== -1) { dx =  1; dy =  0; }
});

generateFood();
drawGame();
