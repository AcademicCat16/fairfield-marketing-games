const canvas    = document.getElementById("c");
const ctx       = canvas.getContext("2d");
const scoreEl   = document.getElementById("score");
const bestEl    = document.getElementById("best");
const restartBtn = document.getElementById("restart");

// Background image (optional — runs fine without it)
const bg = new Image();
let bgReady = false;
bg.onload  = () => { bgReady = true; };
bg.onerror = () => { bgReady = false; };
bg.src = "bg.png";

const CELL = 18;
const COLS = Math.floor(canvas.width  / CELL);
const ROWS = Math.floor(canvas.height / CELL);

let snake, dir, nextDir, food;
let score = 0;
let best  = 0; // localStorage removed for CodePen
let paused = false;
let dead   = false;
let tickMs = 120;
let last = 0, acc = 0;

bestEl.textContent = best;

function reset() {
  const sx = Math.floor(COLS / 2);
  const sy = Math.floor(ROWS / 2);
  snake   = [{x:sx,y:sy},{x:sx-1,y:sy},{x:sx-2,y:sy}];
  dir     = {x:1,y:0};
  nextDir = {x:1,y:0};
  score   = 0;
  paused  = false;
  dead    = false;
  tickMs  = 120;
  scoreEl.textContent = score;
  spawnFood();
}

function spawnFood() {
  while (true) {
    const x = (Math.random() * COLS) | 0;
    const y = (Math.random() * ROWS) | 0;
    if (!snake.some(s => s.x === x && s.y === y)) { food = {x, y, t:0}; return; }
  }
}

function setDir(d) {
  if (d.x === -dir.x && d.y === -dir.y) return;
  nextDir = d;
}

const keyMap = {
  ArrowUp:{x:0,y:-1}, ArrowDown:{x:0,y:1}, ArrowLeft:{x:-1,y:0}, ArrowRight:{x:1,y:0},
  w:{x:0,y:-1}, a:{x:-1,y:0}, s:{x:0,y:1}, d:{x:1,y:0},
  W:{x:0,y:-1}, A:{x:-1,y:0}, S:{x:0,y:1}, D:{x:1,y:0},
};

window.addEventListener("keydown", (e) => {
  if (e.key === " " || e.code === "Space") { paused = !paused; return; }
  if (e.key === "r" || e.key === "R")      { reset(); return; }
  const d = keyMap[e.key];
  if (d) setDir(d);
});

restartBtn.addEventListener("click", reset);

function step() {
  dir = nextDir;
  const head = snake[0];
  const nh = {x: head.x + dir.x, y: head.y + dir.y};
  if (nh.x < 0 || nh.x >= COLS || nh.y < 0 || nh.y >= ROWS) { dead = true; return; }
  if (snake.some((s,i) => i!==0 && s.x===nh.x && s.y===nh.y)) { dead = true; return; }
  snake.unshift(nh);
  if (nh.x === food.x && nh.y === food.y) {
    score++;
    scoreEl.textContent = score;
    tickMs = Math.max(60, 120 - score * 2);
    if (score > best) { best = score; bestEl.textContent = best; }
    spawnFood();
  } else {
    snake.pop();
  }
}

function drawGrid() {
  ctx.lineWidth = 1;
  for (let x = 0; x <= COLS; x++) {
    ctx.strokeStyle = (x%5===0) ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.06)";
    ctx.beginPath(); ctx.moveTo(x*CELL+0.5, 0); ctx.lineTo(x*CELL+0.5, canvas.height); ctx.stroke();
  }
  for (let y = 0; y <= ROWS; y++) {
    ctx.strokeStyle = (y%5===0) ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.06)";
    ctx.beginPath(); ctx.moveTo(0, y*CELL+0.5); ctx.lineTo(canvas.width, y*CELL+0.5); ctx.stroke();
  }
}

function roundRect(x,y,w,h,r) {
  const rr = Math.min(r, w/2, h/2);
  ctx.beginPath();
  ctx.moveTo(x+rr, y);
  ctx.arcTo(x+w, y,   x+w, y+h, rr);
  ctx.arcTo(x+w, y+h, x,   y+h, rr);
  ctx.arcTo(x,   y+h, x,   y,   rr);
  ctx.arcTo(x,   y,   x+w, y,   rr);
  ctx.closePath();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (bgReady) {
    ctx.globalAlpha = 0.55;
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "rgba(10,14,30,0.55)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
    g.addColorStop(0, "rgb(10,14,30)");
    g.addColorStop(1, "rgb(7,10,20)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  drawGrid();

  // Food glow
  food.t += 0.08;
  const pulse = 0.6 + 0.4 * Math.sin(food.t);
  const fx = food.x * CELL, fy = food.y * CELL;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.fillStyle = `rgba(255,215,0,${0.18 + pulse*0.10})`;
  for (let i = 0; i < 4; i++) {
    const pad = 2 + i*2;
    roundRect(fx+pad, fy+pad, CELL-pad*2, CELL-pad*2, 8);
    ctx.fill();
  }
  ctx.restore();
  ctx.fillStyle = "rgba(255,215,0,1)";
  roundRect(fx+3, fy+3, CELL-6, CELL-6, 8);
  ctx.fill();

  // Snake
  for (let i = 0; i < snake.length; i++) {
    const s  = snake[i];
    const px = s.x * CELL, py = s.y * CELL;
    const t  = snake.length <= 1 ? 0 : i / (snake.length - 1);
    const rC = Math.round(255*(1-t) + 0*t);
    const gC = Math.round(105*(1-t) + 255*t);
    const bC = Math.round(180*(1-t) + 210*t);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = `rgba(${rC},${gC},${bC},0.18)`;
    roundRect(px+1, py+1, CELL-2, CELL-2, 10);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = `rgba(${rC},${gC},${bC},1)`;
    const pad = i === 0 ? 2 : 3;
    roundRect(px+pad, py+pad, CELL-pad*2, CELL-pad*2, i===0 ? 10 : 9);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.10)";
    ctx.stroke();
  }

  // Overlay
  if (paused || dead) {
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign  = "center";
    ctx.fillStyle  = "rgba(255,255,255,0.9)";
    ctx.font       = "700 32px system-ui, -apple-system, Segoe UI, Roboto, Arial";
    ctx.fillText(dead ? "Game Over" : "Paused", canvas.width/2, canvas.height/2 - 10);
    ctx.font      = "500 14px system-ui, -apple-system, Segoe UI, Roboto, Arial";
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.fillText(dead ? "Press R to restart" : "Press Space to resume", canvas.width/2, canvas.height/2 + 18);
    if (dead) {
      ctx.fillStyle = "rgba(255,105,180,0.95)";
      ctx.font      = "700 14px system-ui, -apple-system, Segoe UI, Roboto, Arial";
      ctx.fillText(`Final Score: ${score}`, canvas.width/2, canvas.height/2 + 42);
    }
  }
}

function loop(t) {
  const dt = t - last;
  last = t;
  if (!paused && !dead) {
    acc += dt;
    while (acc >= tickMs) { step(); acc -= tickMs; if (dead) break; }
  }
  draw();
  requestAnimationFrame(loop);
}

reset();
requestAnimationFrame(loop);
