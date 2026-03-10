// ==========================
// PLAYER IMAGES FROM GITHUB
// ==========================
const PLAYER_IMG_URL = "https://raw.githubusercontent.com/rjdolan4/game-assets/main/McDavid%20on%20the%20move.png";
const RIVAL_IMG_URL  = "https://raw.githubusercontent.com/rjdolan4/game-assets/main/Sidney%20Crosby%20on%20the%20ice.png";

// Canvas setup
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const shotsEl = document.getElementById("shots");
const bestEl  = document.getElementById("best");

let score = 0;
let shots = 0;
let best  = Number(localStorage.getItem("hockey_best") || 0);
bestEl.textContent = best;

// Load images (fallback to shapes if they fail)
function loadImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve({ img, ok: true });
    img.onerror = () => resolve({ img: null, ok: false });
    img.src = url;
  });
}

let playerSprite = { img: null, ok: false };
let rivalSprite  = { img: null, ok: false };

// Ice rink dimensions (in canvas coordinates)
const W = canvas.width;
const H = canvas.height;

// Game objects
const rink = {
  padding: 26,
  left: 26,
  top: 26,
  right: W - 26,
  bottom: H - 26,
  centerX: W / 2,
  centerY: H / 2
};

const goal = {
  // Right-side goal
  x: rink.right - 14,
  y: rink.centerY,
  w: 18,
  h: 120
};

const player = {
  x: rink.left + 120,
  y: rink.centerY,
  r: 22,
  speed: 4.2,
  vx: 0,
  vy: 0,
  facing: 0 // radians
};

const rival = {
  x: rink.right - 240,
  y: rink.centerY,
  r: 24,
  speed: 3.2,
  vx: 0,
  vy: 0
};

const puck = {
  x: rink.centerX,
  y: rink.centerY + 90,
  r: 10,
  vx: 0,
  vy: 0,
  friction: 0.988
};

const keys = new Set();

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function dist(ax, ay, bx, by) { return Math.hypot(ax - bx, ay - by); }

function resetPositions() {
  player.x = rink.left + 120;
  player.y = rink.centerY;
  player.vx = player.vy = 0;

  rival.x = rink.right - 240;
  rival.y = rink.centerY;
  rival.vx = rival.vy = 0;

  puck.x = rink.centerX;
  puck.y = rink.centerY + 90;
  puck.vx = puck.vy = 0;
}

function shoot() {
  // Only shoot if close to puck
  const d = dist(player.x, player.y, puck.x, puck.y);
  if (d < player.r + puck.r + 18) {
    const dx = Math.cos(player.facing);
    const dy = Math.sin(player.facing);
    const power = 9.2;

    puck.vx += dx * power;
    puck.vy += dy * power;

    shots++;
    shotsEl.textContent = shots;
  }
}

function handleInput() {
  let ax = 0, ay = 0;
  const up = keys.has("ArrowUp") || keys.has("w");
  const dn = keys.has("ArrowDown") || keys.has("s");
  const lf = keys.has("ArrowLeft") || keys.has("a");
  const rt = keys.has("ArrowRight") || keys.has("d");

  if (up) ay -= 1;
  if (dn) ay += 1;
  if (lf) ax -= 1;
  if (rt) ax += 1;

  const len = Math.hypot(ax, ay) || 1;
  ax /= len; ay /= len;

  player.vx = ax * player.speed;
  player.vy = ay * player.speed;

  if (Math.hypot(player.vx, player.vy) > 0.01) {
    player.facing = Math.atan2(player.vy, player.vx);
  }
}

function keepInRink(obj) {
  obj.x = clamp(obj.x, rink.left + obj.r, rink.right - obj.r);
  obj.y = clamp(obj.y, rink.top + obj.r, rink.bottom - obj.r);
}

function resolveCircleCollision(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const d = Math.hypot(dx, dy);
  const minD = a.r + b.r;

  if (d > 0 && d < minD) {
    const nx = dx / d;
    const ny = dy / d;
    const overlap = minD - d;

    // Separate
    a.x -= nx * overlap * 0.5;
    a.y -= ny * overlap * 0.5;
    b.x += nx * overlap * 0.5;
    b.y += ny * overlap * 0.5;

    // Simple velocity exchange (light)
    const push = 0.6;
    a.vx -= nx * push; a.vy -= ny * push;
    b.vx += nx * push; b.vy += ny * push;
  }
}

function rivalAI() {
  // Rival tries to guard the goal line and chase the puck when it's near
  const puckNear = dist(puck.x, puck.y, rival.x, rival.y) < 220;

  let targetX = rink.right - 210;
  let targetY = rink.centerY;

  if (puckNear) {
    // Intercept puck
    targetX = puck.x + 20;
    targetY = puck.y;
  } else {
    // Slide up/down with puck line to "shadow"
    targetY = clamp(puck.y, rink.top + 70, rink.bottom - 70);
  }

  const dx = targetX - rival.x;
  const dy = targetY - rival.y;
  const len = Math.hypot(dx, dy) || 1;

  rival.vx = (dx / len) * rival.speed;
  rival.vy = (dy / len) * rival.speed;

  // Slightly slower if very close to target
  if (len < 18) {
    rival.vx *= 0.3;
    rival.vy *= 0.3;
  }
}

function puckPhysics() {
  puck.x += puck.vx;
  puck.y += puck.vy;

  puck.vx *= puck.friction;
  puck.vy *= puck.friction;

  // Bounce off rink bounds
  if (puck.x < rink.left + puck.r) { puck.x = rink.left + puck.r; puck.vx *= -0.9; }
  if (puck.x > rink.right - puck.r) { puck.x = rink.right - puck.r; puck.vx *= -0.9; }
  if (puck.y < rink.top + puck.r) { puck.y = rink.top + puck.r; puck.vy *= -0.9; }
  if (puck.y > rink.bottom - puck.r) { puck.y = rink.bottom - puck.r; puck.vy *= -0.9; }

  // Stop tiny drift
  if (Math.abs(puck.vx) < 0.03) puck.vx = 0;
  if (Math.abs(puck.vy) < 0.03) puck.vy = 0;
}

function checkGoal() {
  // Goal rectangle on the right wall
  const inX = puck.x + puck.r >= goal.x - goal.w && puck.x - puck.r <= goal.x + goal.w;
  const inY = puck.y >= goal.y - goal.h / 2 && puck.y <= goal.y + goal.h / 2;

  if (inX && inY && puck.vx > 0.3) {
    score++;
    scoreEl.textContent = score;

    if (score > best) {
      best = score;
      bestEl.textContent = best;
      localStorage.setItem("hockey_best", String(best));
    }

    // Celebrate + reset puck only
    puck.x = rink.centerX;
    puck.y = rink.centerY;
    puck.vx = -3.8; // kick it back into play
    puck.vy = (Math.random() - 0.5) * 3.2;
  }
}

function drawRink() {
  // Background ice with lines
  ctx.clearRect(0, 0, W, H);

  // Outer rink
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(10, 30, 70, 0.20)";
  ctx.beginPath();
  roundRect(ctx, rink.left, rink.top, rink.right - rink.left, rink.bottom - rink.top, 28);
  ctx.stroke();
  ctx.restore();

  // Center line
  ctx.save();
  ctx.strokeStyle = "rgba(220, 38, 38, 0.25)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(rink.centerX, rink.top);
  ctx.lineTo(rink.centerX, rink.bottom);
  ctx.stroke();
  ctx.restore();

  // Faceoff circle
  ctx.save();
  ctx.strokeStyle = "rgba(37, 99, 235, 0.20)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(rink.centerX, rink.centerY, 62, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Goal crease area
  ctx.save();
  ctx.fillStyle = "rgba(37, 99, 235, 0.10)";
  ctx.beginPath();
  ctx.roundRect(goal.x - 70, goal.y - goal.h/2 - 8, 70, goal.h + 16, 16);
  ctx.fill();
  ctx.restore();

  // Goal frame
  ctx.save();
  ctx.strokeStyle = "rgba(220, 38, 38, 0.65)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.roundRect(goal.x - 14, goal.y - goal.h/2, 16, goal.h, 10);
  ctx.stroke();
  ctx.restore();
}

function drawPuck() {
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.85)";
  ctx.beginPath();
  ctx.arc(puck.x, puck.y, puck.r, 0, Math.PI * 2);
  ctx.fill();

  // subtle highlight
  ctx.fillStyle = "rgba(255,255,255,0.20)";
  ctx.beginPath();
  ctx.arc(puck.x - 3, puck.y - 3, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawSpriteOrCircle(entity, sprite, label) {
  const size = entity.r * 3.2; // sprite draw size
  const x = entity.x - size / 2;
  const y = entity.y - size / 2;

  // Shadow
  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.ellipse(entity.x, entity.y + entity.r * 0.9, entity.r * 1.05, entity.r * 0.55, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  if (sprite.ok && sprite.img) {
    ctx.save();
    // Rotate player by facing direction (optional; keep stable for photo-like)
    // ctx.translate(entity.x, entity.y);
    // ctx.rotate(entity.facing);
    // ctx.drawImage(sprite.img, -size/2, -size/2, size, size);
    // ctx.restore();

    ctx.drawImage(sprite.img, x, y, size, size);
    ctx.restore();
  } else {
    // Fallback circle
    ctx.save();
    ctx.fillStyle = "rgba(2, 6, 23, 0.85)";
    ctx.beginPath();
    ctx.arc(entity.x, entity.y, entity.r, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.80)";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(label, entity.x, entity.y + 4);
    ctx.restore();
  }
}

function drawAimLine() {
  // Show where you’re aiming
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.strokeStyle = "rgba(30, 64, 175, 0.9)";
  ctx.lineWidth = 3;

  const len = 56;
  const ax = player.x + Math.cos(player.facing) * len;
  const ay = player.y + Math.sin(player.facing) * len;

  ctx.beginPath();
  ctx.moveTo(player.x, player.y);
  ctx.lineTo(ax, ay);
  ctx.stroke();
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
}

function update() {
  handleInput();
  rivalAI();

  // Move players
  player.x += player.vx;
  player.y += player.vy;
  rival.x += rival.vx;
  rival.y += rival.vy;

  keepInRink(player);
  keepInRink(rival);

  // Collisions: player & rival
  resolveCircleCollision(player, rival);

  // Player can "carry" puck slightly when close
  const dP = dist(player.x, player.y, puck.x, puck.y);
  if (dP < player.r + puck.r + 8 && (Math.abs(puck.vx) + Math.abs(puck.vy) < 8)) {
    // gentle nudge puck with player velocity
    puck.vx += player.vx * 0.15;
    puck.vy += player.vy * 0.15;
  }

  // Rival bumps puck away
  const dR = dist(rival.x, rival.y, puck.x, puck.y);
  if (dR < rival.r + puck.r + 6) {
    const dx = puck.x - rival.x;
    const dy = puck.y - rival.y;
    const len = Math.hypot(dx, dy) || 1;
    puck.vx += (dx / len) * 0.9;
    puck.vy += (dy / len) * 0.9;
  }

  puckPhysics();
  checkGoal();
}

function render() {
  drawRink();
  drawAimLine();
  drawPuck();
  drawSpriteOrCircle(rival, rivalSprite, "RIVAL");
  drawSpriteOrCircle(player, playerSprite, "YOU");
}

function loop() {
  update();
  render();
  requestAnimationFrame(loop);
}

// Controls
window.addEventListener("keydown", (e) => {
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  keys.add(k);

  if (k === " ") {
    e.preventDefault();
    shoot();
  }
  if (k === "r") {
    resetPositions();
  }
});

window.addEventListener("keyup", (e) => {
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  keys.delete(k);
});

// Start
(async function start() {
  playerSprite = await loadImage(PLAYER_IMG_URL);
  rivalSprite  = await loadImage(RIVAL_IMG_URL);
  resetPositions();
  loop();
})();

