const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');

let gameRunning = false;
let player;
let enemies   = [];
let coins     = [];
let particles = [];
let speed     = 0;
let distance  = 0;
let lives     = 3;
let score     = 0;
let roadOffset = 0;

const keys = {};

// ── Image URLs — kept on single lines ──
const PLAYER_IMG_URL = "https://raw.githubusercontent.com/sophiamaugeri/gameassets/refs/heads/main/Cheerful%20blue%20sports%20car%20character.png";
const ENEMY_IMG_URL  = "https://raw.githubusercontent.com/sophiamaugeri/gameassets/refs/heads/main/ChatGPT%20Image%20Mar%201%2C%202026%2C%2005_15_40%20PM.png";

const playerImg = new Image();
const enemyImg  = new Image();
let playerImgReady = false;
let enemyImgReady  = false;

playerImg.crossOrigin = "anonymous";
enemyImg.crossOrigin  = "anonymous";
playerImg.onload = () => { playerImgReady = true; draw(); };
enemyImg.onload  = () => { enemyImgReady  = true; draw(); };
playerImg.src = PLAYER_IMG_URL;
enemyImg.src  = ENEMY_IMG_URL;

// ── Controls ──
window.addEventListener('keydown', e => { keys[e.key] = true;  if (e.key === ' ') e.preventDefault(); });
window.addEventListener('keyup',   e => { keys[e.key] = false; });

document.getElementById('btnStart').addEventListener('click', startGame);
document.getElementById('btnReset').addEventListener('click', resetGame);

function initPlayer() {
  player = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 110,
    width: 80, height: 60,
    speed: 0, maxSpeed: 8,
    acceleration: 0.2, friction: 0.95
  };
}

function startGame() {
  if (gameRunning) return;
  const msg = document.getElementById('message');
  msg.textContent = '';
  msg.classList.remove('game-over');
  gameRunning = true;
  gameLoop();
}

function resetGame() {
  gameRunning = false;
  initPlayer();
  enemies = []; coins = []; particles = [];
  speed = 0; distance = 0; lives = 3; score = 0; roadOffset = 0;
  const msg = document.getElementById('message');
  msg.textContent = '';
  msg.classList.remove('game-over');
  updateStats();
  draw();
}

function updateStats() {
  document.getElementById('speed').textContent    = Math.round(speed * 10);
  document.getElementById('distance').textContent = Math.round(distance);
  document.getElementById('lives').textContent    = lives;
  document.getElementById('score').textContent    = score;
}

function update() {
  if (!gameRunning) return;

  if (keys['ArrowLeft']  || keys['a'] || keys['A']) player.x = Math.max(60, player.x - 6);
  if (keys['ArrowRight'] || keys['d'] || keys['D']) player.x = Math.min(canvas.width - 60 - player.width, player.x + 6);

  if (keys[' ']) {
    player.speed = Math.min(player.speed + player.acceleration, player.maxSpeed);
  } else {
    player.speed *= player.friction;
    if (player.speed < 0.05) player.speed = 0;
  }

  speed     = player.speed;
  distance += speed;
  roadOffset += speed * 2;
  if (roadOffset > 60) roadOffset -= 60;

  // Spawn enemies
  if (Math.random() < 0.02) {
    enemies.push({
      x: Math.random() * (canvas.width - 120 - 80) + 60,
      y: -120, width: 80, height: 60,
      speed: 2 + Math.random() * 2
    });
  }

  // Update enemies
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    e.y += e.speed + speed;
    if (checkCollision(player, e)) {
      lives--;
      createExplosion(player.x + player.width/2, player.y + player.height/2);
      enemies.splice(i, 1);
      if (lives <= 0) { endGame(); return; }
      continue;
    }
    if (e.y > canvas.height + 150) enemies.splice(i, 1);
  }

  // Spawn coins
  if (Math.random() < 0.01) {
    coins.push({ x: Math.random() * (canvas.width - 180) + 90, y: -30, radius: 15, speed: 1 });
  }

  // Update coins
  for (let i = coins.length - 1; i >= 0; i--) {
    const c = coins[i];
    c.y += c.speed + speed;
    const hit = player.x < c.x + c.radius && player.x + player.width > c.x - c.radius &&
                player.y < c.y + c.radius && player.y + player.height > c.y - c.radius;
    if (hit) { score += 10; createParticles(c.x, c.y, '#FFD700'); coins.splice(i, 1); continue; }
    if (c.y > canvas.height + 50) coins.splice(i, 1);
  }

  // Update particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx; p.y += p.vy; p.life--;
    if (p.life <= 0) particles.splice(i, 1);
  }

  updateStats();
}

function checkCollision(r1, r2) {
  return r1.x < r2.x + r2.width && r1.x + r1.width > r2.x &&
         r1.y < r2.y + r2.height && r1.y + r1.height > r2.y;
}

function createExplosion(x, y) { createParticles(x, y, '#FF4500', 15); }

function createParticles(x, y, color, count = 8) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    particles.push({ x, y, vx: Math.cos(angle)*4, vy: Math.sin(angle)*4, color, life: 30 });
  }
}

function endGame() {
  gameRunning = false;
  const msg = document.getElementById('message');
  msg.textContent = `Game Over! Final Score: ${score}`;
  msg.classList.add('game-over');
}

function drawRoad() {
  ctx.fillStyle = '#87ceeb';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#333';
  ctx.fillRect(50, 0, canvas.width - 100, canvas.height);
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 3;
  ctx.setLineDash([30, 30]);
  for (let i = -roadOffset; i < canvas.height; i += 60) {
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, i);
    ctx.lineTo(canvas.width/2, i + 30);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.fillStyle = '#228B22';
  ctx.fillRect(0, 0, 50, canvas.height);
  ctx.fillRect(canvas.width - 50, 0, 50, canvas.height);
}

function drawCarImage(img, ready, x, y, w, h) {
  if (!ready) {
    ctx.fillStyle = img === playerImg ? '#1565C0' : '#C62828';
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 8);
    ctx.fill();
    return;
  }
  ctx.drawImage(img, x, y, w, h);
}

function draw() {
  drawRoad();
  drawCarImage(playerImg, playerImgReady, player.x, player.y, player.width, player.height);
  enemies.forEach(e => drawCarImage(enemyImg, enemyImgReady, e.x, e.y, e.width, e.height));
  coins.forEach(c => {
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
  particles.forEach(p => {
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.life / 30;
    ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
    ctx.globalAlpha = 1;
  });
}

function gameLoop() {
  update();
  draw();
  if (gameRunning) requestAnimationFrame(gameLoop);
}

initPlayer();
updateStats();
draw();
