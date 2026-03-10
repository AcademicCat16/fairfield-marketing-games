// ── Optional background image URLs ──
const MENU_BG_URL = "";
const GAME_BG_URL = "";

// ── Canvas + UI refs ──
const canvas     = document.getElementById("game");
const ctx        = canvas.getContext("2d", { alpha: false });
const hpVal      = document.getElementById("hpVal");
const ammoVal    = document.getElementById("ammoVal");
const killsVal   = document.getElementById("killsVal");
const timeVal    = document.getElementById("timeVal");
const centerMsg  = document.getElementById("centerMessage");
const menuEl     = document.getElementById("menu");
const pauseEl    = document.getElementById("pauseOverlay");
const overEl     = document.getElementById("gameOverOverlay");
const overTitle  = document.getElementById("gameOverTitle");
const overStats  = document.getElementById("gameOverStats");
const startBtn   = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

// ── Resize ──
function fitCanvas() {
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const w = window.innerWidth, h = window.innerHeight;
  canvas.width  = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width  = w + "px";
  canvas.style.height = h + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", fitCanvas, { passive: true });
fitCanvas();

// ── Asset loading ──
function loadImageSafe(url, cb) {
  if (!url || !url.trim() || url === "PASTE_URL_FOR_IMAGE_1" || url === "PASTE_URL_FOR_IMAGE_2") return cb(null);
  const img = new Image();
  img.onload  = () => cb(img);
  img.onerror = () => cb(null);
  img.src = url;
}
let menuBgImg = null, gameBgImg = null;
loadImageSafe(MENU_BG_URL, img => { menuBgImg = img; });
loadImageSafe(GAME_BG_URL, img => { gameBgImg = img; });

// ── Constants ──
const WORLD = { w: 3000, h: 2000 };
const STORM = { startR: 1400, endR: 320, shrinkSec: 180, dps: 10 };
const ENEMY_CONF  = { speed: 120, hp: 50, spawnEvery: 2.5, maxAlive: 12, killGoal: 15 };
const LOOT_CONF   = { every: 10, amount: 4, heal: 25, ammo: 15, size: 14 };
const BULLET_CONF = { speed: 600, dmg: 25, fireRate: 6 };
const PLAYER_CONF = { r: 18, speed: 260, maxHp: 100, maxAmmo: 90, startAmmo: 30 };

// ── State ──
let state = "menu";
let elapsed = 0, sinceEnemy = 0, sinceLoot = 0, lastShot = 0, kills = 0;
let bullets = [], enemies = [], loots = [], effects = [];
let player = null, cam = { x: 0, y: 0 };
let lastTs = 0;

const input = { up:false, down:false, left:false, right:false, shoot:false, mx:0, my:0, aimAng:0 };

// ── Input ──
const KEYS = {
  ArrowUp:"up", w:"up", ArrowDown:"down", s:"down",
  ArrowLeft:"left", a:"left", ArrowRight:"right", d:"right",
  " ":"shoot"
};

window.addEventListener("keydown", e => {
  if (KEYS[e.key] !== undefined) { input[KEYS[e.key]] = true; e.preventDefault(); }
  if (e.key === "p" || e.key === "P") togglePause();
});
window.addEventListener("keyup", e => {
  if (KEYS[e.key] !== undefined) input[KEYS[e.key]] = false;
});
canvas.addEventListener("mousemove", e => {
  input.mx = e.clientX; input.my = e.clientY;
  updateAim();
});
canvas.addEventListener("mousedown", e => { if (e.button === 0) input.shoot = true; });
canvas.addEventListener("mouseup",   e => { if (e.button === 0) input.shoot = false; });
canvas.addEventListener("touchmove", e => {
  const t = e.touches[0];
  input.mx = t.clientX; input.my = t.clientY;
  updateAim(); e.preventDefault();
}, { passive: false });

function updateAim() {
  if (!player) return;
  const sx = player.x - cam.x, sy = player.y - cam.y;
  input.aimAng = Math.atan2(input.my - sy, input.mx - sx);
}

startBtn.addEventListener("click",   startGame);
restartBtn.addEventListener("click", startGame);

// ── Init / Reset ──
function startGame() {
  menuEl.hidden  = true;
  overEl.hidden  = true;
  pauseEl.hidden = true;
  centerMsg.textContent = "";

  player = {
    x: WORLD.w / 2, y: WORLD.h / 2,
    r: PLAYER_CONF.r, speed: PLAYER_CONF.speed,
    hp: PLAYER_CONF.maxHp, maxHp: PLAYER_CONF.maxHp,
    ammo: PLAYER_CONF.startAmmo, maxAmmo: PLAYER_CONF.maxAmmo,
    angle: 0
  };

  bullets = []; enemies = []; loots = []; effects = [];
  elapsed = 0; sinceEnemy = 0; sinceLoot = 0; lastShot = 0; kills = 0;
  cam = { x: player.x - window.innerWidth/2, y: player.y - window.innerHeight/2 };
  state = "playing";
  lastTs = performance.now();
  requestAnimationFrame(loop);
}

function togglePause() {
  if (state === "playing") { state = "paused"; pauseEl.hidden = false; }
  else if (state === "paused") { state = "playing"; pauseEl.hidden = true; lastTs = performance.now(); requestAnimationFrame(loop); }
}

// ── Helpers ──
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function dist(ax, ay, bx, by) { return Math.hypot(ax-bx, ay-by); }
function randRange(a, b) { return a + Math.random() * (b - a); }

function spawnEnemy() {
  const ang = Math.random() * Math.PI * 2;
  const rad = 600 + Math.random() * 300;
  const x = clamp(player.x + Math.cos(ang) * rad, 20, WORLD.w - 20);
  const y = clamp(player.y + Math.sin(ang) * rad, 20, WORLD.h - 20);
  enemies.push({ x, y, r: 16, hp: ENEMY_CONF.hp, maxHp: ENEMY_CONF.hp, speed: ENEMY_CONF.speed + Math.random() * 40 });
}

function spawnLoot() {
  for (let i = 0; i < LOOT_CONF.amount; i++) {
    const ang = Math.random() * Math.PI * 2;
    const rad = 200 + Math.random() * 400;
    loots.push({
      x: clamp(player.x + Math.cos(ang) * rad, 20, WORLD.w - 20),
      y: clamp(player.y + Math.sin(ang) * rad, 20, WORLD.h - 20),
      type: Math.random() < 0.5 ? "heal" : "ammo",
      r: LOOT_CONF.size / 2
    });
  }
}

function addEffect(x, y, color, count = 6) {
  for (let i = 0; i < count; i++) {
    const ang = Math.random() * Math.PI * 2;
    const spd = 80 + Math.random() * 120;
    effects.push({ x, y, vx: Math.cos(ang)*spd, vy: Math.sin(ang)*spd, life: 1, maxLife: 1, color, r: 3 + Math.random()*3 });
  }
}

// ── Update ──
function update(dt) {
  elapsed += dt;
  sinceEnemy += dt;
  sinceLoot  += dt;
  lastShot   += dt;

  // Movement
  let mx = 0, my = 0;
  if (input.up)    my -= 1;
  if (input.down)  my += 1;
  if (input.left)  mx -= 1;
  if (input.right) mx += 1;
  const mlen = Math.hypot(mx, my) || 1;
  if (mx || my) {
    player.x = clamp(player.x + (mx/mlen) * player.speed * dt, player.r, WORLD.w - player.r);
    player.y = clamp(player.y + (my/mlen) * player.speed * dt, player.r, WORLD.h - player.r);
  }
  player.angle = input.aimAng;

  // Camera
  const tw = window.innerWidth, th = window.innerHeight;
  cam.x += (player.x - tw/2 - cam.x) * 0.12;
  cam.y += (player.y - th/2 - cam.y) * 0.12;
  cam.x = clamp(cam.x, 0, WORLD.w - tw);
  cam.y = clamp(cam.y, 0, WORLD.h - th);

  // Shooting
  if (input.shoot && lastShot >= 1/BULLET_CONF.fireRate && player.ammo > 0) {
    const bx = player.x + Math.cos(player.angle) * (player.r + 4);
    const by = player.y + Math.sin(player.angle) * (player.r + 4);
    bullets.push({ x: bx, y: by, vx: Math.cos(player.angle) * BULLET_CONF.speed, vy: Math.sin(player.angle) * BULLET_CONF.speed, r: 5, life: 1.8 });
    player.ammo--;
    lastShot = 0;
  }

  // Bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt;
    if (b.life <= 0 || b.x < 0 || b.x > WORLD.w || b.y < 0 || b.y > WORLD.h) { bullets.splice(i, 1); continue; }
    for (let j = enemies.length - 1; j >= 0; j--) {
      const e = enemies[j];
      if (dist(b.x, b.y, e.x, e.y) < b.r + e.r) {
        e.hp -= BULLET_CONF.dmg;
        addEffect(b.x, b.y, "#ff7675", 4);
        bullets.splice(i, 1);
        if (e.hp <= 0) { addEffect(e.x, e.y, "#ff4757", 10); enemies.splice(j, 1); kills++; }
        break;
      }
    }
  }

  // Enemies
  if (sinceEnemy >= ENEMY_CONF.spawnEvery && enemies.length < ENEMY_CONF.maxAlive) {
    spawnEnemy(); sinceEnemy = 0;
  }
  for (const e of enemies) {
    const ang = Math.atan2(player.y - e.y, player.x - e.x);
    e.x += Math.cos(ang) * e.speed * dt;
    e.y += Math.sin(ang) * e.speed * dt;
    if (dist(e.x, e.y, player.x, player.y) < e.r + player.r) {
      player.hp -= 15 * dt;
    }
  }

  // Loot
  if (sinceLoot >= LOOT_CONF.every) { spawnLoot(); sinceLoot = 0; }
  for (let i = loots.length - 1; i >= 0; i--) {
    const l = loots[i];
    if (dist(l.x, l.y, player.x, player.y) < l.r + player.r) {
      if (l.type === "heal") { player.hp = Math.min(player.maxHp, player.hp + LOOT_CONF.heal); addEffect(l.x, l.y, "#55efc4", 6); }
      else                   { player.ammo = Math.min(player.maxAmmo, player.ammo + LOOT_CONF.ammo); addEffect(l.x, l.y, "#5dd1ff", 6); }
      loots.splice(i, 1);
    }
  }

  // Storm
  const stormT = clamp(elapsed / STORM.shrinkSec, 0, 1);
  const stormR = STORM.startR + (STORM.endR - STORM.startR) * stormT;
  const cx = WORLD.w / 2, cy = WORLD.h / 2;
  if (dist(player.x, player.y, cx, cy) > stormR) {
    player.hp -= STORM.dps * dt;
    centerMsg.textContent = "⚠️ You are outside the safe zone!";
  } else {
    centerMsg.textContent = "";
  }

  // Effects
  for (let i = effects.length - 1; i >= 0; i--) {
    const p = effects[i];
    p.x += p.vx * dt; p.y += p.vy * dt;
    p.vx *= 0.92; p.vy *= 0.92;
    p.life -= dt * 1.8;
    if (p.life <= 0) effects.splice(i, 1);
  }

  // HUD
  hpVal.textContent    = Math.max(0, Math.round(player.hp));
  ammoVal.textContent  = player.ammo;
  killsVal.textContent = kills;
  const m = Math.floor(elapsed / 60), s = Math.floor(elapsed % 60);
  timeVal.textContent  = `${m}:${s.toString().padStart(2,"0")}`;

  // Win / Lose
  if (player.hp <= 0) endGame(false);
  if (kills >= ENEMY_CONF.killGoal) endGame(true);
}

function endGame(won) {
  state = "over";
  overTitle.textContent = won ? "Victory! 🏆" : "Eliminated 💀";
  overStats.textContent = `Eliminations: ${kills} | Time: ${timeVal.textContent}`;
  overEl.hidden = false;
}

// ── Draw ──
function drawWorld() {
  const tw = window.innerWidth, th = window.innerHeight;

  // Background
  if (gameBgImg) {
    ctx.drawImage(gameBgImg, -cam.x % gameBgImg.width, -cam.y % gameBgImg.height,
      gameBgImg.width, gameBgImg.height);
  } else {
    ctx.fillStyle = "#0f1a2e";
    ctx.fillRect(0, 0, tw, th);
    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    const gridSize = 80;
    const ox = (-cam.x % gridSize), oy = (-cam.y % gridSize);
    for (let x = ox; x < tw; x += gridSize) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,th); ctx.stroke(); }
    for (let y = oy; y < th; y += gridSize) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(tw,y); ctx.stroke(); }
  }

  // Storm ring
  const stormT = clamp(elapsed / STORM.shrinkSec, 0, 1);
  const stormR = STORM.startR + (STORM.endR - STORM.startR) * stormT;
  const scx = WORLD.w/2 - cam.x, scy = WORLD.h/2 - cam.y;
  ctx.save();
  ctx.strokeStyle = "rgba(180,60,255,0.55)";
  ctx.lineWidth = 4;
  ctx.shadowColor = "#a855f7"; ctx.shadowBlur = 18;
  ctx.beginPath(); ctx.arc(scx, scy, stormR, 0, Math.PI*2); ctx.stroke();
  ctx.restore();

  // Loot
  for (const l of loots) {
    const lx = l.x - cam.x, ly = l.y - cam.y;
    ctx.save();
    ctx.shadowBlur = 12;
    ctx.shadowColor = l.type === "heal" ? "#55efc4" : "#5dd1ff";
    ctx.fillStyle   = l.type === "heal" ? "#55efc4" : "#5dd1ff";
    ctx.beginPath(); ctx.arc(lx, ly, l.r, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#06101a";
    ctx.font = "bold 11px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(l.type === "heal" ? "+" : "A", lx, ly);
    ctx.restore();
  }

  // Enemies
  for (const e of enemies) {
    const ex = e.x - cam.x, ey = e.y - cam.y;
    ctx.save();
    ctx.shadowBlur = 14; ctx.shadowColor = "#ff7675";
    ctx.fillStyle = "#c0392b";
    ctx.beginPath(); ctx.arc(ex, ey, e.r, 0, Math.PI*2); ctx.fill();
    // HP bar
    const bw = e.r * 2.2, bh = 4;
    const bx = ex - bw/2, by = ey - e.r - 10;
    ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillRect(bx, by, bw, bh);
    ctx.fillStyle = "#ff7675"; ctx.fillRect(bx, by, bw * (e.hp/e.maxHp), bh);
    ctx.restore();
  }

  // Bullets
  ctx.save();
  ctx.fillStyle = "#ffe082";
  ctx.shadowColor = "#ffd740"; ctx.shadowBlur = 10;
  for (const b of bullets) {
    ctx.beginPath(); ctx.arc(b.x - cam.x, b.y - cam.y, b.r, 0, Math.PI*2); ctx.fill();
  }
  ctx.restore();

  // Effects
  for (const p of effects) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x - cam.x, p.y - cam.y, p.r, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  }

  // Player
  const px = player.x - cam.x, py = player.y - cam.y;
  ctx.save();
  ctx.translate(px, py); ctx.rotate(player.angle);
  ctx.shadowBlur = 18; ctx.shadowColor = "#5dd1ff";
  ctx.fillStyle = "#2980b9";
  ctx.beginPath(); ctx.arc(0, 0, player.r, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = "#5dd1ff";
  ctx.beginPath(); ctx.moveTo(player.r, 0); ctx.lineTo(player.r + 12, -5); ctx.lineTo(player.r + 12, 5); ctx.closePath(); ctx.fill();
  // HP bar above player
  ctx.rotate(-player.angle);
  const bw = player.r * 2.5;
  ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillRect(-bw/2, -player.r - 12, bw, 5);
  ctx.fillStyle = player.hp > 50 ? "#55efc4" : "#ff7675";
  ctx.fillRect(-bw/2, -player.r - 12, bw * (player.hp/player.maxHp), 5);
  ctx.restore();
}

function drawMenu() {
  const tw = window.innerWidth, th = window.innerHeight;
  if (menuBgImg) {
    ctx.drawImage(menuBgImg, 0, 0, tw, th);
  } else {
    ctx.fillStyle = "#0b0f1a"; ctx.fillRect(0, 0, tw, th);
  }
}

// ── Loop ──
function loop(ts) {
  if (state !== "playing") return;
  const dt = Math.min((ts - lastTs) / 1000, 0.05);
  lastTs = ts;
  const tw = window.innerWidth, th = window.innerHeight;
  ctx.clearRect(0, 0, tw, th);
  drawWorld();
  update(dt);
  requestAnimationFrame(loop);
}

// Initial draw
(function init() {
  const tw = window.innerWidth, th = window.innerHeight;
  ctx.fillStyle = "#0b0f1a"; ctx.fillRect(0, 0, tw, th);
})();
