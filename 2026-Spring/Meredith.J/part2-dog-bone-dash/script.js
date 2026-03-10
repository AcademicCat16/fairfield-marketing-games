const canvas = document.getElementById("gameCanvas");
const ctx    = canvas.getContext("2d");

let score    = 0;
let timeLeft = 30;
let gameOver = false;

let dog = { x: 400, y: 250, size: 40, speed: 5 };
let bone = {
  x: Math.random() * 700 + 50,
  y: Math.random() * 400 + 50,
  size: 50  // bigger!
};

const keys = {};
document.addEventListener("keydown", e => { keys[e.key] = true; });
document.addEventListener("keyup",   e => { keys[e.key] = false; });

function drawDog() {
  // shadow
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.beginPath();
  ctx.ellipse(dog.x, dog.y + dog.size - 4, dog.size * 0.8, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  // body
  ctx.fillStyle = "#8B4513";
  ctx.beginPath();
  ctx.arc(dog.x, dog.y, dog.size, 0, Math.PI * 2);
  ctx.fill();
  // highlight
  ctx.fillStyle = "#a0522d";
  ctx.beginPath();
  ctx.arc(dog.x - 8, dog.y - 8, dog.size * 0.45, 0, Math.PI * 2);
  ctx.fill();
  // eyes
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(dog.x - 12, dog.y - 10, 8, 0, Math.PI * 2);
  ctx.arc(dog.x + 12, dog.y - 10, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1a1a1a";
  ctx.beginPath();
  ctx.arc(dog.x - 12, dog.y - 10, 4, 0, Math.PI * 2);
  ctx.arc(dog.x + 12, dog.y - 10, 4, 0, Math.PI * 2);
  ctx.fill();
  // nose
  ctx.fillStyle = "#1a1a1a";
  ctx.beginPath();
  ctx.ellipse(dog.x, dog.y + 8, 7, 5, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawBone() {
  const bx = bone.x;
  const by = bone.y;
  const len = bone.size;
  const kR  = 14;  // knob radius
  const bh  = 10;  // bar half-height

  // drop shadow
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.3)";
  ctx.shadowBlur  = 10;
  ctx.shadowOffsetY = 4;

  ctx.fillStyle = "#F5DEB3"; // warm wheat color
  ctx.strokeStyle = "#c8a96e";
  ctx.lineWidth = 2;

  // center bar
  ctx.beginPath();
  ctx.roundRect(bx - len/2, by - bh, len, bh*2, 4);
  ctx.fill();
  ctx.stroke();

  // four knobs
  const knobs = [
    { x: bx - len/2, y: by - bh },
    { x: bx - len/2, y: by + bh },
    { x: bx + len/2, y: by - bh },
    { x: bx + len/2, y: by + bh },
  ];
  for (const k of knobs) {
    ctx.beginPath();
    ctx.arc(k.x, k.y, kR, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // shine
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.beginPath();
  ctx.ellipse(bx - len/2 - 4, by - bh - 4, 5, 3, -0.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function moveDog() {
  if (keys["ArrowUp"]    && dog.y > dog.size)                  dog.y -= dog.speed;
  if (keys["ArrowDown"]  && dog.y < canvas.height - dog.size)  dog.y += dog.speed;
  if (keys["ArrowLeft"]  && dog.x > dog.size)                  dog.x -= dog.speed;
  if (keys["ArrowRight"] && dog.x < canvas.width - dog.size)   dog.x += dog.speed;
}

function checkCollision() {
  const dx = dog.x - bone.x;
  const dy = dog.y - bone.y;
  if (Math.sqrt(dx*dx + dy*dy) < dog.size + bone.size * 0.6) {
    score++;
    document.getElementById("score").textContent = "Score: " + score;
    bone.x = Math.random() * 700 + 50;
    bone.y = Math.random() * 400 + 50;
  }
}

function drawGameOver() {
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.font = "bold 44px Arial";
  ctx.fillText("Game Over! 🐾", canvas.width/2, canvas.height/2 - 24);
  ctx.font = "26px Arial";
  ctx.fillText("Score: " + score, canvas.width/2, canvas.height/2 + 20);
  ctx.font = "18px Arial";
  ctx.fillStyle = "#ffcc00";
  ctx.fillText("Press R to play again", canvas.width/2, canvas.height/2 + 58);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!gameOver) {
    moveDog();
    drawBone();
    drawDog();
    checkCollision();
  } else {
    drawGameOver();
  }
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", e => {
  if ((e.key === "r" || e.key === "R") && gameOver) {
    score = 0; timeLeft = 30; gameOver = false;
    dog.x = 400; dog.y = 250;
    bone.x = Math.random() * 700 + 50;
    bone.y = Math.random() * 400 + 50;
    document.getElementById("score").textContent = "Score: 0";
    document.getElementById("timer").textContent = "Time: 30";
  }
});

setInterval(() => {
  if (gameOver) return;
  timeLeft--;
  document.getElementById("timer").textContent = "Time: " + timeLeft;
  if (timeLeft <= 0) gameOver = true;
}, 1000);

gameLoop();
