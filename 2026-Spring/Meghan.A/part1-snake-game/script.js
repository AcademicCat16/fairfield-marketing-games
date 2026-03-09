const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");

canvas.focus();

const box = 20;
let snake = [{ x: 300, y: 300 }];
let direction = null;
let food = randomFood();
let score = 0;
let highScore = 0;

// Listen on window so keys work without clicking the canvas first
window.addEventListener("keydown", changeDirection);

function changeDirection(event) {
  const key = event.key.toLowerCase();
  if ((key === "w" || key === "arrowup")    && direction !== "DOWN")  direction = "UP";
  if ((key === "s" || key === "arrowdown")  && direction !== "UP")    direction = "DOWN";
  if ((key === "a" || key === "arrowleft")  && direction !== "RIGHT") direction = "LEFT";
  if ((key === "d" || key === "arrowright") && direction !== "LEFT")  direction = "RIGHT";
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * 30) * box,
    y: Math.floor(Math.random() * 30) * box
  };
}

function draw() {
  // Clear
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 600, 600);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#2e7d32" : "#66bb6a";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw food
  ctx.fillStyle = "#d32f2f";
  ctx.fillRect(food.x, food.y, box, box);

  // Don't move until a direction is chosen
  if (!direction) return;

  let headX = snake[0].x;
  let headY = snake[0].y;
  if (direction === "UP")    headY -= box;
  if (direction === "DOWN")  headY += box;
  if (direction === "LEFT")  headX -= box;
  if (direction === "RIGHT") headX += box;

  // Collision check
  if (
    headX < 0 || headX >= 600 ||
    headY < 0 || headY >= 600 ||
    collision(headX, headY, snake)
  ) {
    resetGame();
    return;
  }

  let newHead = { x: headX, y: headY };

  if (headX === food.x && headY === food.y) {
    score += 10;
    if (score > highScore) highScore = score;
    food = randomFood();
    updateScore();
  } else {
    snake.pop();
  }

  snake.unshift(newHead);
}

function collision(x, y, array) {
  return array.some(segment => segment.x === x && segment.y === y);
}

function updateScore() {
  scoreDisplay.innerText = `Score: ${score} | High Score: ${highScore}`;
}

function resetGame() {
  snake = [{ x: 300, y: 300 }];
  direction = null;
  score = 0;
  updateScore();
}

setInterval(draw, 100);
