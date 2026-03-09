const canvas        = document.getElementById("gameCanvas");
const ctx           = canvas.getContext("2d");
const scoreDisplay  = document.getElementById("score");
const statusDisplay = document.getElementById("status");

const bird = {
  x: 50,
  y: canvas.height / 2,
  w: 30,
  h: 30,
  velocity: 0,
  gravity: 0.5,
  jumpPower: -10
};

let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;
let gameStarted = false;

function drawBird() {
  ctx.fillStyle = "#FFD700";
  ctx.beginPath();
  ctx.arc(bird.x + bird.w / 2, bird.y + bird.h / 2, bird.w / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(bird.x + bird.w / 2 + 5, bird.y + bird.h / 2 - 3, 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawPipes() {
  ctx.fillStyle = "#228B22";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
  });
}

function updatePipes() {
  if (frame % 90 === 0) {
    const gap = 130;
    const top = Math.random() * (canvas.height - gap - 100) + 40;
    pipes.push({
      x: canvas.width,
      width: 60,
      top: top,
      bottom: canvas.height - (top + gap)
    });
  }

  pipes.forEach(pipe => { pipe.x -= 3; });

  if (pipes.length && pipes[0].x + pipes[0].width < 0) {
    pipes.shift();
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
  }
}

function detectCollision() {
  for (let pipe of pipes) {
    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.w > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.h > canvas.height - pipe.bottom)
    ) {
      gameOver = true;
    }
  }
  if (bird.y + bird.h >= canvas.height || bird.y <= 0) {
    gameOver = true;
  }
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "left";
  ctx.fillText(`Score: ${score}`, 10, 35);
}

function gameLoop() {
  ctx.fillStyle = "#70c5ce";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawBird();
  drawPipes();
  drawScore();

  if (gameStarted && !gameOver) {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
    updatePipes();
    detectCollision();
    frame++;
  }

  if (gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 30);
    ctx.font = "28px Arial";
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 30);
    statusDisplay.textContent = "Press SPACE to restart";
  } else if (gameStarted) {
    statusDisplay.textContent = "Press SPACE to jump";
  }

  requestAnimationFrame(gameLoop);
}

function handleInput() {
  if (!gameStarted && !gameOver) {
    gameStarted = true;
  } else if (!gameOver) {
    bird.velocity = bird.jumpPower;
  } else {
    pipes = [];
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    frame = 0;
    score = 0;
    gameOver = false;
    gameStarted = false;
    scoreDisplay.textContent = "Score: 0";
    statusDisplay.textContent = "Press SPACE to start";
  }
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.key === " ") {
    e.preventDefault();
    handleInput();
  }
});

canvas.addEventListener("click", handleInput);

gameLoop();
