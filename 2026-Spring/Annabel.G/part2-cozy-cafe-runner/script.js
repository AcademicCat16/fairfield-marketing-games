const canvas  = document.getElementById("game");
const ctx     = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const goalEl  = document.getElementById("goal");
const W = canvas.width;
const H = canvas.height;

function svgData(svg) {
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

const IMG_SRC = {
  bg: svgData(`
    <svg xmlns="http://www.w3.org/2000/svg" width="520" height="520">
      <defs>
        <pattern id="p" width="52" height="52" patternUnits="userSpaceOnUse">
          <rect width="52" height="52" fill="#0b0b0b"/>
          <rect x="0" y="0" width="52" height="52" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
          <circle cx="26" cy="26" r="2.5" fill="rgba(255,255,255,0.07)"/>
          <path d="M10 42 C16 36, 22 36, 28 42" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="2" stroke-linecap="round"/>
        </pattern>
      </defs>
      <rect width="520" height="520" fill="url(#p)"/>
    </svg>
  `),
  player: svgData(`
    <svg xmlns="http://www.w3.org/2000/svg" width="140" height="140">
      <rect width="140" height="140" fill="none"/>
      <ellipse cx="70" cy="118" rx="26" ry="10" fill="rgba(0,0,0,0.35)"/>
      <circle cx="70" cy="48" r="22" fill="#ffd7c2"/>
      <circle cx="62" cy="46" r="3.4" fill="#3b2a1f"/>
      <circle cx="78" cy="46" r="3.4" fill="#3b2a1f"/>
      <path d="M62 56 C66 60, 74 60, 78 56" fill="none" stroke="#c96d6d" stroke-width="3" stroke-linecap="round"/>
      <path d="M48 45 C50 24, 92 24, 92 46 C92 52, 86 40, 70 38 C58 37, 52 57, 48 45Z" fill="#7a4b2a"/>
      <rect x="52" y="68" width="36" height="44" rx="10" fill="#7fd1c7"/>
      <rect x="56" y="84" width="28" height="22" rx="8" fill="#5bb8ad" opacity="0.9"/>
      <rect x="40" y="76" width="14" height="10" rx="5" fill="#ffd7c2"/>
      <rect x="86" y="76" width="14" height="10" rx="5" fill="#ffd7c2"/>
      <rect x="86" y="66" width="14" height="18" rx="4" fill="#f2f2f2"/>
      <rect x="86" y="74" width="14" height="10" rx="3" fill="#d9a66b"/>
      <rect x="86" y="63" width="14" height="6" rx="3" fill="#e6e6e6"/>
    </svg>
  `),
  coffee: svgData(`
    <svg xmlns="http://www.w3.org/2000/svg" width="90" height="90">
      <rect width="90" height="90" fill="none"/>
      <circle cx="45" cy="48" r="22" fill="#f4c67a"/>
      <circle cx="45" cy="48" r="18" fill="#d7973d"/>
      <rect x="28" y="20" width="34" height="10" rx="5" fill="#f2f2f2"/>
      <circle cx="55" cy="43" r="5" fill="#fff" opacity="0.28"/>
    </svg>
  `),
  spill: svgData(`
    <svg xmlns="http://www.w3.org/2000/svg" width="110" height="110">
      <rect width="110" height="110" fill="none"/>
      <path d="M25 62 C18 46, 26 28, 44 30 C48 18, 74 16, 78 34
               C94 38, 96 60, 82 70 C78 84, 54 92, 42 82
               C28 84, 20 74, 25 62Z"
            fill="#7b3f00" opacity="0.95"/>
      <path d="M34 58 C30 46, 40 36, 50 38" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="4" stroke-linecap="round"/>
    </svg>
  `)
};

const IMGS = {};

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload  = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image."));
    img.src = src;
  });
}

let score = 0, lives = 3;
const goal = 10;
let started = false;
goalEl.textContent = "Goal: " + goal + " coffees";

const keys   = new Set();
const player = { x: W/2, y: H/2, r: 26, speed: 3.3 };
let coffees  = [];
let spills   = [];

function rand(min, max) { return Math.random() * (max - min) + min; }
function dist(a, b)     { return Math.hypot(a.x - b.x, a.y - b.y); }

function spawnCoffee() {
  coffees.push({ x: rand(40, W-40), y: rand(40, H-40), r: 18 });
}

function spawnSpill() {
  const edge = Math.floor(Math.random() * 4);
  const s = 30;
  let x, y, vx, vy;
  if (edge === 0) { x = -s;   y = rand(0,H); vx =  rand(1.2,2.4); vy = rand(-1.2,1.2); }
  if (edge === 1) { x = W+s;  y = rand(0,H); vx = -rand(1.2,2.4); vy = rand(-1.2,1.2); }
  if (edge === 2) { x = rand(0,W); y = -s;   vx = rand(-1.2,1.2); vy =  rand(1.2,2.4); }
  if (edge === 3) { x = rand(0,W); y = H+s;  vx = rand(-1.2,1.2); vy = -rand(1.2,2.4); }
  spills.push({ x, y, r: 22, vx, vy });
}

function reset() {
  score = 0; lives = 3; started = false;
  coffees = []; spills = [];
  player.x = W/2; player.y = H/2;
  scoreEl.textContent = "Score: " + score;
  livesEl.textContent = "Lives: " + lives;
  for (let i = 0; i < 3; i++) spawnCoffee();
  for (let i = 0; i < 3; i++) spawnSpill();
}

function drawSprite(img, x, y, size) {
  ctx.drawImage(img, x - size/2, y - size/2, size, size);
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  drawSprite(IMGS.bg, W/2, H/2, Math.max(W, H));
  for (const c of coffees) drawSprite(IMGS.coffee, c.x, c.y, 48);
  for (const s of spills)  drawSprite(IMGS.spill,  s.x, s.y, 60);
  drawSprite(IMGS.player, player.x, player.y, 76);
  if (!started) {
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle  = "#fff";
    ctx.textAlign  = "center";
    ctx.font       = "700 34px system-ui";
    ctx.fillText("Press Space to Start", W/2, H/2 - 12);
    ctx.font       = "16px system-ui";
    ctx.fillText("Collect 10 coffees • Avoid spills", W/2, H/2 + 18);
  }
}

function update() {
  requestAnimationFrame(update);
  if (started) {
    let dx = 0, dy = 0;
    if (keys.has("arrowleft")  || keys.has("a")) dx -= 1;
    if (keys.has("arrowright") || keys.has("d")) dx += 1;
    if (keys.has("arrowup")    || keys.has("w")) dy -= 1;
    if (keys.has("arrowdown")  || keys.has("s")) dy += 1;
    const mag = Math.hypot(dx, dy) || 1;
    player.x += (dx / mag) * player.speed;
    player.y += (dy / mag) * player.speed;
    player.x = Math.max(player.r, Math.min(W - player.r, player.x));
    player.y = Math.max(player.r, Math.min(H - player.r, player.y));

    for (const s of spills) {
      s.x += s.vx; s.y += s.vy;
      if (s.x < -70)   s.x = W + 70;
      if (s.x > W+70)  s.x = -70;
      if (s.y < -70)   s.y = H + 70;
      if (s.y > H+70)  s.y = -70;
      if (dist(player, s) < player.r + s.r) {
        lives--;
        livesEl.textContent = "Lives: " + lives;
        player.x = W/2; player.y = H/2;
        if (lives <= 0) { alert("Game Over! Press R to restart."); started = false; }
      }
    }

    coffees = coffees.filter(c => {
      if (dist(player, c) < player.r + c.r) {
        score++;
        scoreEl.textContent = "Score: " + score;
        if (score >= goal) {
          alert("You win! You collected " + goal + " coffees 🎉 Press R to play again.");
          started = false;
        } else {
          spawnCoffee();
          if (Math.random() < 0.35) spawnSpill();
        }
        return false;
      }
      return true;
    });
  }
  draw();
}

document.addEventListener("keydown", (e) => {
  const k = e.key.toLowerCase();
  keys.add(k);
  if (e.code === "Space") started = true;
  if (k === "r") reset();
});
document.addEventListener("keyup", (e) => keys.delete(e.key.toLowerCase()));

(async function init() {
  reset();
  const [bg, playerImg, coffee, spill] = await Promise.all([
    loadImage(IMG_SRC.bg),
    loadImage(IMG_SRC.player),
    loadImage(IMG_SRC.coffee),
    loadImage(IMG_SRC.spill),
  ]);
  IMGS.bg     = bg;
  IMGS.player = playerImg;
  IMGS.coffee = coffee;
  IMGS.spill  = spill;
  update();
})();
