// Fixed: DOG_URL was split across two lines in original (caused broken URL)
const DOG_URL = "https://raw.githubusercontent.com/saragrg/game-assets/refs/heads/main/flat-colored-cream-miniature-dachshund-long-hair-flat-coloredcream-miniature-dachshund-long-hair-211763637.webp";

const canvas       = document.getElementById("game");
const ctx          = canvas.getContext("2d");
const flowersPill  = document.getElementById("flowersPill");
const statusPill   = document.getElementById("statusPill");
const restartBtn   = document.getElementById("restartBtn");

const W = canvas.width;
const H = canvas.height;

// --- Input ---
const keys = new Set();
window.addEventListener("keydown", (e) => {
  const k = e.key.toLowerCase();
  if (["arrowup","arrowdown","arrowleft","arrowright","w","a","s","d","shift"].includes(k))
    e.preventDefault();
  keys.add(k);
});
window.addEventListener("keyup", (e) => keys.delete(e.key.toLowerCase()));

// --- Helpers ---
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
function roundRect(x, y, w, h, r) {
  const rr = Math.min(r, w/2, h/2);
  ctx.beginPath();
  ctx.moveTo(x+rr, y);
  ctx.arcTo(x+w, y, x+w, y+h, rr);
  ctx.arcTo(x+w, y+h, x, y+h, rr);
  ctx.arcTo(x, y+h, x, y, rr);
  ctx.arcTo(x, y, x+w, y, rr);
  ctx.closePath();
}

// --- Game objects ---
const player = { x: 60, y: 60, w: 26, h: 18, speed: 2.1, facing: 1 };
const basket  = { x: W - 90, y: H - 70, w: 34, h: 26 };
const obstacles = [
  { x: 245, y: 140, w: 150, h: 90,  type: "water" },
  { x: 120, y: 260, w: 260, h: 14,  type: "fence" },
  { x: 120, y: 260, w: 14,  h: 85,  type: "fence" },
  { x: 366, y: 260, w: 14,  h: 85,  type: "fence" },
];

let flowers   = [];
let collected = 0;
const goal    = 5;
let won       = false;
let ready     = false;

function randomFlower() {
  for (let tries = 0; tries < 500; tries++) {
    const f = {
      x: Math.floor(30 + Math.random() * (W - 60)),
      y: Math.floor(30 + Math.random() * (H - 60)),
      w: 14, h: 14, picked: false
    };
    const padded = { x: f.x-6, y: f.y-6, w: f.w+12, h: f.h+12 };
    if (obstacles.some(o => rectsOverlap(padded, o))) continue;
    if (rectsOverlap(padded, basket)) continue;
    return f;
  }
  return { x: 80, y: 320, w: 14, h: 14, picked: false };
}

function updateHUD(status) {
  flowersPill.textContent = `FLOWERS: ${collected}/${goal}`;
  statusPill.textContent  = `STATUS: ${status}`;
}

function resetGame() {
  player.x  = 60; player.y = 60;
  collected = 0;
  won       = false;
  flowers   = Array.from({length: goal}, () => randomFlower());
  updateHUD(ready ? "exploring" : "loading dog…");
}

function movePlayer() {
  const boost = keys.has("shift") ? 1.45 : 1.0;
  const sp = player.speed * boost;
  let dx = 0, dy = 0;
  if (keys.has("arrowup")    || keys.has("w")) dy -= sp;
  if (keys.has("arrowdown")  || keys.has("s")) dy += sp;
  if (keys.has("arrowleft")  || keys.has("a")) dx -= sp;
  if (keys.has("arrowright") || keys.has("d")) dx += sp;
  if (dx !== 0 && dy !== 0) { dx *= 0.78; dy *= 0.78; }
  if (dx < 0) player.facing = -1;
  if (dx > 0) player.facing =  1;

  const nextX = { ...player, x: player.x + dx };
  if (!obstacles.some(o => rectsOverlap(nextX, o))) player.x = nextX.x;
  const nextY = { ...player, y: player.y + dy };
  if (!obstacles.some(o => rectsOverlap(nextY, o))) player.y = nextY.y;

  player.x = clamp(player.x, 8, W - player.w - 8);
  player.y = clamp(player.y, 8, H - player.h - 8);
}

function checkPickups() {
  for (const f of flowers) {
    if (f.picked) continue;
    if (rectsOverlap(player, f)) {
      f.picked   = true;
      collected += 1;
      updateHUD(collected === goal ? "return to basket" : "collecting");
    }
  }
  if (!won && collected === goal && rectsOverlap(player, basket)) {
    won = true;
    updateHUD("done for the day ✅");
  }
}

// --- Draw ---
function drawBackground() {
  ctx.fillStyle = "rgba(124,247,198,.10)";
  ctx.fillRect(0, 0, W, H);
  const g = ctx.createRadialGradient(W/2, H/2, 40, W/2, H/2, 420);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,.22)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "rgba(255,207,92,.10)";
  for (let y = 40; y < H; y += 50)
    for (let x = 40; x < W; x += 60)
      ctx.fillRect(x, y, 18, 10);
}

function drawObstacles() {
  for (const o of obstacles) {
    if (o.type === "water") {
      ctx.fillStyle = "rgba(90,176,255,.35)";
      roundRect(o.x, o.y, o.w, o.h, 16); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.18)";
      ctx.fillRect(o.x+20,  o.y+18, 18, 6);
      ctx.fillRect(o.x+70,  o.y+48, 14, 5);
      ctx.fillRect(o.x+110, o.y+28, 16, 6);
    } else {
      ctx.fillStyle = "rgba(255,255,255,.20)";
      roundRect(o.x, o.y, o.w, o.h, 8); ctx.fill();
    }
  }
}

function drawBasket() {
  ctx.fillStyle = "rgba(255,207,92,.25)";
  roundRect(basket.x, basket.y, basket.w, basket.h, 10); ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,.20)";
  ctx.fillRect(basket.x+6, basket.y+8, basket.w-12, 4);
}

function drawFlowers() {
  for (const f of flowers) {
    if (f.picked) continue;
    ctx.fillStyle = "rgba(124,247,198,.55)";
    ctx.fillRect(f.x+6, f.y+7, 2, 7);
    ctx.fillStyle = "rgba(255,107,139,.65)";
    roundRect(f.x+2, f.y+1, 10, 10, 5); ctx.fill();
    ctx.fillStyle = "rgba(255,207,92,.85)";
    ctx.fillRect(f.x+6, f.y+5, 2, 2);
  }
}

// --- Dog sprite ---
const dogImg = new Image();
dogImg.crossOrigin = "anonymous";
dogImg.src = DOG_URL;
dogImg.onload  = () => { ready = true; updateHUD("exploring"); };
dogImg.onerror = () => { ready = true; updateHUD("exploring (image failed, using fallback)"); };

function drawPlayer() {
  const drawW = 80, drawH = 44;
  const cx = player.x + player.w / 2;
  const cy = player.y + player.h / 2;
  const dx = cx - drawW / 2;
  const dy = cy - drawH / 2 - 10;

  if (dogImg.complete && dogImg.naturalWidth > 0) {
    ctx.save();
    if (player.facing === -1) {
      ctx.translate(dx + drawW, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(dogImg, 0, dy, drawW, drawH);
    } else {
      ctx.drawImage(dogImg, dx, dy, drawW, drawH);
    }
    ctx.restore();
  } else {
    ctx.fillStyle = "rgba(245,247,255,.75)";
    roundRect(player.x, player.y, player.w, player.h, 7);
    ctx.fill();
  }
}

function drawWinBanner() {
  if (!won) return;
  ctx.fillStyle = "rgba(0,0,0,.35)";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "rgba(15,23,48,.92)";
  roundRect(120, 140, 400, 120, 18); ctx.fill();
  ctx.fillStyle = "#f5f7fb";
  ctx.font = "900 26px ui-sans-serif, system-ui, Segoe UI, Roboto, Arial";
  ctx.textAlign = "center";
  // Fixed: these strings were split across two lines in original (syntax error)
  ctx.fillText("Cozy day complete 🌸", W/2, 188);
  ctx.fillStyle = "rgba(184,192,255,.95)";
  ctx.font = "700 14px ui-sans-serif, system-ui, Segoe UI, Roboto, Arial";
  ctx.fillText("You collected all flowers and returned them safely.", W/2, 214);
  ctx.fillText("Press Restart to play again.", W/2, 238);
}

function frame() {
  if (ready && !won) {
    movePlayer();
    checkPickups();
  }
  drawBackground();
  drawObstacles();
  drawBasket();
  drawFlowers();
  drawPlayer();
  drawWinBanner();
  requestAnimationFrame(frame);
}

restartBtn.addEventListener("click", resetGame);
resetGame();
requestAnimationFrame(frame);
