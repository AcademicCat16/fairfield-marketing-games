const canvas = document.getElementById("gameCanvas");
const ctx    = canvas.getContext("2d");

const paddleWidth  = 15;
const paddleHeight = 100;
const ballRadius   = 8;
const maxScore     = 5;

let playerPaddle = {
  x: 10,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  speed: 6
};

let computerPaddle = {
  x: canvas.width - paddleWidth - 10,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  speed: 5
};

let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: ballRadius,
  dx: 5,
  dy: 5,
  speed: 5
};

let scores = { player: 0, computer: 0 };

// Input
const keys = {};
let mouseY = canvas.height / 2;

window.addEventListener("keydown", (e) => { keys[e.key] = true; });
window.addEventListener("keyup",   (e) => { keys[e.key] = false; });

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseY = e.clientY - rect.top;
});

// Update player paddle (arrow keys + mouse)
function updatePlayerPaddle() {
  if (keys["ArrowUp"])   playerPaddle.y = Math.max(0, playerPaddle.y - playerPaddle.speed);
  if (keys["ArrowDown"]) playerPaddle.y = Math.min(canvas.height - playerPaddle.height, playerPaddle.y + playerPaddle.speed);

  const paddleCenter = playerPaddle.y + playerPaddle.height / 2;
  const difference   = mouseY - paddleCenter;
  if (Math.abs(difference) > 5) {
    if (difference > 0) playerPaddle.y = Math.min(canvas.height - playerPaddle.height, playerPaddle.y + 4);
    else                playerPaddle.y = Math.max(0, playerPaddle.y - 4);
  }
}

// Simple AI
function updateComputerPaddle() {
  const computerCenter = computerPaddle.y + computerPaddle.height / 2;
  const difference     = ball.y - computerCenter;
  if (Math.abs(difference) > 5) {
    if (difference > 0) computerPaddle.y = Math.min(canvas.height - computerPaddle.height, computerPaddle.y + computerPaddle.speed);
    else                computerPaddle.y = Math.max(0, computerPaddle.y - computerPaddle.speed);
  }
}

function updateBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall bounce
  if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvas.height) {
    ball.dy *= -1;
    ball.y = Math.max(ball.radius, Math.min(canvas.height - ball.radius, ball.y));
  }

  // Player paddle collision
  if (
    ball.x - ball.radius <= playerPaddle.x + playerPaddle.width &&
    ball.y >= playerPaddle.y &&
    ball.y <= playerPaddle.y + playerPaddle.height &&
    ball.dx < 0
  ) {
    ball.dx *= -1.05;
    ball.x = playerPaddle.x + playerPaddle.width + ball.radius;
    const hitPos = (ball.y - playerPaddle.y) / playerPaddle.height;
    ball.dy = ball.speed * (hitPos - 0.5) * 2;
  }

  // Computer paddle collision
  if (
    ball.x + ball.radius >= computerPaddle.x &&
    ball.y >= computerPaddle.y &&
    ball.y <= computerPaddle.y + computerPaddle.height &&
    ball.dx > 0
  ) {
    ball.dx *= -1.05;
    ball.x = computerPaddle.x - ball.radius;
    const hitPos = (ball.y - computerPaddle.y) / computerPaddle.height;
    ball.dy = ball.speed * (hitPos - 0.5) * 2;
  }

  // Scoring
  if (ball.x - ball.radius < 0) {
    scores.computer++;
    resetBall();
  } else if (ball.x + ball.radius > canvas.width) {
    scores.player++;
    resetBall();
  }
}

function resetBall() {
  ball.x  = canvas.width / 2;
  ball.y  = canvas.height / 2;
  ball.dx = (Math.random() > 0.5 ? 1 : -1) * 5;
  ball.dy = (Math.random() - 0.5) * 5;
}

function checkGameOver() {
  if (scores.player >= maxScore)   { endGame("🎉 You Win!");        return true; }
  if (scores.computer >= maxScore) { endGame("💻 Computer Wins!"); return true; }
  return false;
}

function endGame(message) {
  document.getElementById("gameOverMessage").textContent = message;
  document.getElementById("gameOverDialog").style.display = "block";
}

function resetGame() {
  scores.player = 0;
  scores.computer = 0;
  resetBall();
  document.getElementById("gameOverDialog").style.display = "none";
  gameLoop();
}

// Draw
function drawPaddle(paddle) {
  ctx.fillStyle   = "#00ff00";
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth   = 2;
  ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
  ctx.fillStyle = "#ff00ff";
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#ffff00";
  ctx.lineWidth   = 2;
  ctx.stroke();
}

function drawCenterLine() {
  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.setLineDash([10, 10]);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);
}

function updateScore() {
  document.getElementById("playerScore").textContent   = scores.player;
  document.getElementById("computerScore").textContent = scores.computer;
}

function gameLoop() {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawCenterLine();
  drawPaddle(playerPaddle);
  drawPaddle(computerPaddle);
  drawBall();

  updatePlayerPaddle();
  updateComputerPaddle();
  updateBall();
  updateScore();

  if (!checkGameOver()) requestAnimationFrame(gameLoop);
}

gameLoop();
