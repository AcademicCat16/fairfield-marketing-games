const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const restartBtn = document.getElementById("restart");

function resize() {
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  canvas.width = Math.floor(innerWidth * dpr);
  canvas.height = Math.floor(innerHeight * dpr);
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resize);
resize();

// ---------- Game State ----------
let score = 0;
let lives = 3;
let running = true;
let difficultySpeed = 0;

const player = {
  w: 105, h: 18,
  x: innerWidth / 2,
  y: innerHeight - 70,
  vx: 0,
  maxSpeed: 22,
  accel: 2.2,
  friction: 0.85
};

const stars = [];
const particles = [];
let spawnTimer = 0;
let spawnEvery = 55;

// ---------- Input ----------
const keys = new Set();
window.addEventListener("keydown", (e) => keys.add(e.key.toLowerCase()));
window.addEventListener("keyup",   (e) => keys.delete(e.key.toLowerCase()));

let dragging = false;
canvas.addEventListener("pointerdown", (e) => { dragging = true; moveToPointer(e); });
canvas.addEventListener("pointermove", (e) => { if (dragging) moveToPointer(e); });
canvas.addEventListener("pointerup",   () => dragging = false);
function moveToPointer(e) { player.x = e.clientX; }

// ---------- Helpers ----------
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function rand(min, max)     { return min + Math.random() * (max - min); }

function starPath(cx, cy, spikes, outerR, innerR) {
  let rot = Math.PI / 2 * 3;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerR);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR); rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR); rot += step;
  }
  ctx.closePath();
}

function spawnStar() {
  if (stars.length >= 6) return;
  stars.push({
    x: rand(30, innerWidth - 30),
    y: -30,
    r: rand(12, 20),
    baseSpeed: rand(2.2, 3.2),
    vy: 0,
    spin: rand(-0.1, 0.1),
    rot: rand(0, Math.PI * 2)
  });
}

function burst(x, y) {
  for (let i = 0; i < 18; i++) {
    const a = rand(0, Math.PI * 2), sp = rand(2, 5);
    particles.push({ x, y, vx: Math.cos(a)*sp, vy: Math.sin(a)*sp, life: 28 });
  }
}

function reset() {
  score = 0; lives = 3; running = true; difficultySpeed = 0;
  stars.length = 0; particles.length = 0; spawnTimer = 0;
  scoreEl.textContent = score;
  livesEl.textContent = lives;
}
restartBtn.addEventListener("click", reset);

// ---------- Collision ----------
function hit(star, rect) {
  const rx = rect.x - rect.w / 2, ry = rect.y - rect.h / 2;
  const cx = clamp(star.x, rx, rx + rect.w);
  const cy = clamp(star.y, ry, ry + rect.h);
  const dx = star.x - cx, dy = star.y - cy;
  return dx*dx + dy*dy <= star.r * star.r;
}

// ---------- Draw ----------
function drawBackground() {
  const g = ctx.createLinearGradient(0, 0, 0, innerHeight);
  g.addColorStop(0, "#040615");
  g.addColorStop(1, "#071a3a");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, innerWidth, innerHeight);
}

function drawPlayer() {
  const speedRatio = Math.min(1, Math.abs(player.vx) / player.maxSpeed);
  if (Math.abs(player.vx) > 2) {
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = "#2b63ff";
    ctx.fillRect(
      player.x - player.w/2 - player.vx*1.5,
      player.y - player.h/2,
      player.w + player.vx*1.5,
      player.h
    );
    ctx.restore();
  }
  ctx.save();
  ctx.shadowColor = "rgba(90,170,255,0.9)";
  ctx.shadowBlur = 15 + speedRatio * 25;
  ctx.fillStyle = "#2b63ff";
  ctx.fillRect(player.x - player.w/2, player.y - player.h/2, player.w, player.h);
  ctx.restore();
}

function drawStar(s) {
  ctx.save();
  ctx.translate(s.x, s.y); ctx.rotate(s.rot);
  ctx.shadowColor = "rgba(255,215,0,0.9)"; ctx.shadowBlur = 20;
  ctx.fillStyle = "#ffd54a";
  starPath(0, 0, 5, s.r, s.r * 0.5);
  ctx.fill();
  ctx.restore();
}

function drawParticles() {
  for (const p of particles) {
    ctx.globalAlpha = p.life / 28;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// ---------- Update ----------
function update() {
  player.y = innerHeight - 70;
  const left  = keys.has("arrowleft")  || keys.has("a");
  const right = keys.has("arrowright") || keys.has("d");
  if (left)  player.vx -= player.accel;
  if (right) player.vx += player.accel;
  player.vx *= player.friction;
  player.vx = clamp(player.vx, -player.maxSpeed, player.maxSpeed);
  player.x += player.vx;
  player.x = clamp(player.x, player.w/2, innerWidth - player.w/2);

  if (running) difficultySpeed += 0.0006;
  if (running) {
    spawnTimer++;
    if (spawnTimer >= spawnEvery) { spawnTimer = 0; spawnStar(); }
  }

  for (let i = stars.length - 1; i >= 0; i--) {
    const s = stars[i];
    s.vy = s.baseSpeed + difficultySpeed;
    if (running) { s.y += s.vy; s.rot += s.spin; }
    if (running && hit(s, player)) {
      stars.splice(i, 1); score++;
      scoreEl.textContent = score;
      burst(s.x, s.y); continue;
    }
    if (s.y - s.r > innerHeight) {
      stars.splice(i, 1);
      if (running) {
        lives--; livesEl.textContent = lives;
        if (lives <= 0) running = false;
      }
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.life--;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

// ---------- Render ----------
function render() {
  drawBackground();
  drawPlayer();
  for (const s of stars) drawStar(s);
  drawParticles();
  if (!running) {
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, innerWidth, innerHeight);
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.font = "800 44px system-ui";
    ctx.fillText("Game Over", innerWidth/2, innerHeight/2);
  }
}

function loop() { update(); render(); requestAnimationFrame(loop); }
loop();
reset();
