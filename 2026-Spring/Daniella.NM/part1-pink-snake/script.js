const canvas     = document.getElementById("game");
const ctx        = canvas.getContext("2d");
const scoreEl    = document.getElementById("score");
const bestEl     = document.getElementById("best");
const overlay    = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlayTitle");
const overlayMsg   = document.getElementById("overlayMsg");
const startBtn   = document.getElementById("startBtn");

const COLS     = 25;
const ROWS     = 25;
const CELL     = canvas.width / COLS;  // 20px

let snake, dir, nextDir, food, score, best, running, animId;
best = 0;

// ── Colors matching the pink Python version ──
const COLOR_HEAD  = "#ff1493";
const COLOR_BODY  = "#ff69b4";
const COLOR_FOOD  = "#ff1493";
const COLOR_BG    = "#fff0f8";
const COLOR_GRID  = "rgba(255,105,180,.08)";

// ── Draw helpers ──
function drawRoundRect(x, y, w, h, r, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y,     x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x,     y + h, r);
  ctx.arcTo(x,     y + h, x,     y,     r);
  ctx.arcTo(x,     y,     x + w, y,     r);
  ctx.closePath();
  if (fill)   { ctx.fillStyle   = fill;   ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
}

function drawGrid() {
  ctx.strokeStyle = COLOR_GRID;
  ctx.lineWidth   = 0.5;
  for (let c = 0; c <= COLS; c++) {
    ctx.beginPath();
    ctx.moveTo(c * CELL, 0);
    ctx.lineTo(c * CELL, canvas.height);
    ctx.stroke();
  }
  for (let r = 0; r <= ROWS; r++) {
    ctx.beginPath();
    ctx.moveTo(0, r * CELL);
    ctx.lineTo(canvas.width, r * CELL);
    ctx.stroke();
  }
}

function drawSnake() {
  snake.forEach((seg, i) => {
    const x = seg.x * CELL + 1;
    const y = seg.y * CELL + 1;
    const s = CELL - 2;
    const color = i === 0 ? COLOR_HEAD : COLOR_BODY;
    drawRoundRect(x, y, s, s, 5, color, null);

    // shine on head
    if (i === 0) {
      ctx.fillStyle = "rgba(255,255,255,.35)";
      ctx.beginPath();
      ctx.ellipse(x + s * 0.3, y + s * 0.28, s * 0.18, s * 0.12, -0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

function drawFood() {
  const x = food.x * CELL + CELL / 2;
  const y = food.y * CELL + CELL / 2;
  const r = CELL / 2 - 2;

  // berry glow
  const glow = ctx.createRadialGradient(x, y, 1, x, y, r + 4);
  glow.addColorStop(0, "rgba(255,20,147,.35)");
  glow.addColorStop(1, "rgba(255,20,147,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, r + 4, 0, Math.PI * 2);
  ctx.fill();

  // berry body
  const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 1, x, y, r);
  grad.addColorStop(0, "#ff69b4");
  grad.addColorStop(1, "#ff1493");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  // shine
  ctx.fillStyle = "rgba(255,255,255,.45)";
  ctx.beginPath();
  ctx.ellipse(x - r * 0.28, y - r * 0.28, r * 0.22, r * 0.14, -0.5, 0, Math.PI * 2);
  ctx.fill();
}

function render() {
  ctx.fillStyle = COLOR_BG;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawFood();
  drawSnake();
}

// ── Game logic ──
function randCell() {
  return {
    x: Math.floor(Math.random() * COLS),
    y: Math.floor(Math.random() * ROWS)
  };
}

function spawnFood() {
  let f;
  do {
    f = randCell();
  } while (snake.some(s => s.x === f.x && s.y === f.y));
  return f;
}

function resetGame() {
  snake   = [{ x: 12, y: 12 }, { x: 11, y: 12 }, { x: 10, y: 12 }];
  dir     = { x: 1, y: 0 };
  nextDir = { x: 1, y: 0 };
  score   = 0;
  scoreEl.textContent = 0;
  food    = spawnFood();
  running = true;
}

let lastTime = 0;
const SPEED = 120; // ms per tick

function gameLoop(ts) {
  if (!running) return;
  animId = requestAnimationFrame(gameLoop);

  if (ts - lastTime < SPEED) { render(); return; }
  lastTime = ts;

  // apply direction
  dir = nextDir;

  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  // wall collision
  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
    endGame(); return;
  }
  // self collision
  if (snake.some(s => s.x === head.x && s.y === head.y)) {
    endGame(); return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = score;
    if (score > best) { best = score; bestEl.textContent = best; }
    food = spawnFood();
  } else {
    snake.pop();
  }

  render();
}

function endGame() {
  running = false;
  cancelAnimationFrame(animId);

  // draw game over on canvas
  ctx.fillStyle = "rgba(255,230,244,.82)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#d6007a";
  ctx.font      = "bold 32px Pacifico, cursive";
  ctx.textAlign = "center";
  ctx.fillText("💔 Game Over 💔", canvas.width / 2, canvas.height / 2 - 20);
  ctx.font      = "bold 18px Nunito, sans-serif";
  ctx.fillStyle = "#c0006e";
  ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 + 18);

  overlayTitle.textContent = "💔 Game Over!";
  overlayMsg.textContent   = "Final Score: " + score;
  startBtn.textContent     = "Press Enter or Click to Restart 🎀";
  overlay.classList.remove("hidden");
}

function startGame() {
  overlay.classList.add("hidden");
  resetGame();
  lastTime = 0;
  requestAnimationFrame(gameLoop);
}

// ── Input ──
window.addEventListener("keydown", (e) => {
  if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) e.preventDefault();

  if (e.key === "Enter" || e.key === " ") {
    if (!overlay.classList.contains("hidden")) { startGame(); return; }
  }
  if (!running) return;

  if ((e.key === "ArrowUp"    || e.key === "w") && dir.y !== 1)  nextDir = { x: 0,  y: -1 };
  if ((e.key === "ArrowDown"  || e.key === "s") && dir.y !== -1) nextDir = { x: 0,  y:  1 };
  if ((e.key === "ArrowLeft"  || e.key === "a") && dir.x !== 1)  nextDir = { x: -1, y:  0 };
  if ((e.key === "ArrowRight" || e.key === "d") && dir.x !== -1) nextDir = { x: 1,  y:  0 };
});

startBtn.addEventListener("click", startGame);

// initial render
ctx.fillStyle = COLOR_BG;
ctx.fillRect(0, 0, canvas.width, canvas.height);
drawGrid();
