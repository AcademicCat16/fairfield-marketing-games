const canvas = document.getElementById("game");
const ctx    = canvas.getContext("2d");

const paddleWidth  = 15;
const paddleHeight = 100;
const paddleSpeed  = 7;

let leftPaddleY  = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
const ballRadius = 12;
let ballSpeedX = 5;
let ballSpeedY = 4;

let leftScore  = 0;
let rightScore = 0;

let upPressed   = false;
let downPressed = false;

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp")   upPressed   = true;
  if (e.key === "ArrowDown") downPressed = true;
});
document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowUp")   upPressed   = false;
  if (e.key === "ArrowDown") downPressed = false;
});

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawText(text, x, y) {
  ctx.fillStyle = "#ff3399";
  ctx.font      = "40px Comic Sans MS";
  ctx.fillText(text, x, y);
}

function movePaddles() {
  if (upPressed   && rightPaddleY > 0)                          rightPaddleY -= paddleSpeed;
  if (downPressed && rightPaddleY < canvas.height - paddleHeight) rightPaddleY += paddleSpeed;

  // AI left paddle
  if (leftPaddleY + paddleHeight / 2 < ballY) leftPaddleY += 4;
  else                                          leftPaddleY -= 4;
}

function moveBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Top & bottom bounce
  if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) ballSpeedY = -ballSpeedY;

  // Left paddle collision
  if (ballX - ballRadius < paddleWidth && ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) {
    ballSpeedX = -ballSpeedX;
  }

  // Right paddle collision
  if (ballX + ballRadius > canvas.width - paddleWidth && ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight) {
    ballSpeedX = -ballSpeedX;
  }

  // Scoring
  if (ballX < 0)            { rightScore++; resetBall(); }
  if (ballX > canvas.width) { leftScore++;  resetBall(); }
}

function resetBall() {
  ballX      = canvas.width / 2;
  ballY      = canvas.height / 2;
  ballSpeedX = -ballSpeedX;
}

function drawNet() {
  for (let i = 0; i < canvas.height; i += 30) {
    drawRect(canvas.width / 2 - 3, i, 6, 15, "#ffb3e6");
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawNet();
  drawRect(0, leftPaddleY, paddleWidth, paddleHeight, "#ff66cc");
  drawRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight, "#ff66cc");
  drawCircle(ballX, ballY, ballRadius, "#ff1493");
  drawText(leftScore,  canvas.width / 4,      60);
  drawText(rightScore, canvas.width * 3 / 4,  60);
  movePaddles();
  moveBall();
  requestAnimationFrame(gameLoop);
}

gameLoop();
