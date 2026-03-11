const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let gameRunning = false;
let player;
let enemies = [];
let coins = [];
let particles = [];
let speed = 0;
let distance = 0;
let lives = 3;
let score = 0;
let roadOiset = 0;
const keys = {};
// --- Controls ---
window.addEventListener('keydown', (e) => {
keys[e.key] = true;
if (e.key === ' ') e.preventDefault();
});
window.addEventListener('keyup', (e) => {
keys[e.key] = false;
});
// Buttons (better than inline onclick in CodePen)
document.getElementById('btnStart').addEventListener('click', startGame);
document.getElementById('btnReset').addEventListener('click', resetGame);
function initPlayer() {
player = {
x: canvas.width / 2 - 25,
y: canvas.height - 100,
width: 50,
height: 70,
speed: 0,
maxSpeed: 8,
acceleration: 0.2,
friction: 0.95
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
enemies = [];
coins = [];
particles = [];
speed = 0;
distance = 0;
lives = 3;
score = 0;
roadOiset = 0;
const msg = document.getElementById('message');
msg.textContent = '';
msg.classList.remove('game-over');
updateStats();
draw();
}
function updateStats() {
document.getElementById('speed').textContent = Math.round(speed * 10);
document.getElementById('distance').textContent = Math.round(distance);
document.getElementById('lives').textContent = lives;
document.getElementById('score').textContent = score;
}
function update() {
if (!gameRunning) return;
// Player movement
if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
player.x = Math.max(80, player.x - 6);
}
if (keys['ArrowRight'] || keys['d'] || keys['D']) {
player.x = Math.min(canvas.width - 130, player.x + 6);
}
// Acceleration
if (keys[' ']) {
player.speed = Math.min(player.speed + player.acceleration, player.maxSpeed);
} else {
player.speed *= player.friction;
if (player.speed < 0.05) player.speed = 0; // stops tiny drifting forever
}
speed = player.speed;
distance += speed;
// Road animation
roadOiset += speed * 2;
if (roadOiset > 60) roadOiset -= 60;
// Spawn enemies (stay inside road)
if (Math.random() < 0.02) {
enemies.push({
x: Math.random() * (canvas.width - 180) + 90,
y: -90,
width: 50,
height: 70,
speed: 2 + Math.random() * 2
});
}
// Update enemies (iterate backwards so splice is safe)
for (let i = enemies.length - 1; i >= 0; i--) {
const enemy = enemies[i];
enemy.y += enemy.speed + speed;
if (checkCollision(player, enemy)) {
lives--;
createExplosion(player.x + 25, player.y + 35);
enemies.splice(i, 1);
if (lives <= 0) {
endGame();
return;
}
continue;
}
if (enemy.y > canvas.height + 100) enemies.splice(i, 1);
}
// Spawn coins (stay inside road)
if (Math.random() < 0.01) {
coins.push({
x: Math.random() * (canvas.width - 180) + 90,
y: -30,
radius: 15,
speed: 1
});
}
// Update coins
for (let i = coins.length - 1; i >= 0; i--) {
const coin = coins[i];
coin.y += coin.speed + speed;
const hit =
player.x < coin.x + coin.radius &&
player.x + player.width > coin.x - coin.radius &&
player.y < coin.y + coin.radius &&
player.y + player.height > coin.y - coin.radius;
if (hit) {
score += 10;
createParticles(coin.x, coin.y, '#FFD700');
coins.splice(i, 1);
continue;
}
if (coin.y > canvas.height + 50) coins.splice(i, 1);
}
// Update particles
for (let i = particles.length - 1; i >= 0; i--) {
const p = particles[i];
p.x += p.vx;
p.y += p.vy;
p.life--;
if (p.life <= 0) particles.splice(i, 1);
}
updateStats();
}
function checkCollision(r1, r2) {
return (
r1.x < r2.x + r2.width &&
r1.x + r1.width > r2.x &&
r1.y < r2.y + r2.height &&
r1.y + r1.height > r2.y
);
}
function createExplosion(x, y) {
createParticles(x, y, '#FF4500', 15);
}
function createParticles(x, y, color, count = 8) {
for (let i = 0; i < count; i++) {
const angle = (Math.PI * 2 * i) / count;
particles.push({
x,
y,
vx: Math.cos(angle) * 4,
vy: Math.sin(angle) * 4,
color,
life: 30
});
}
}
function endGame() {
gameRunning = false;
const msg = document.getElementById('message');
msg.textContent = `Game Over! Final Score: ${score}`;
msg.classList.add('game-over');
}
function draw() {
// Sky
ctx.fillStyle = '#87ceeb';
ctx.fillRect(0, 0, canvas.width, canvas.height);
// Road
ctx.fillStyle = '#333';
ctx.fillRect(50, 0, canvas.width - 100, canvas.height);
// Center dashed line
ctx.strokeStyle = '#FFD700';
ctx.lineWidth = 3;
ctx.setLineDash([30, 30]);
for (let i = -roadOiset; i < canvas.height; i += 60) {
ctx.beginPath();
ctx.moveTo(canvas.width / 2, i);
ctx.lineTo(canvas.width / 2, i + 30);
ctx.stroke();
}
ctx.setLineDash([]);
// Grass
ctx.fillStyle = '#228B22';
ctx.fillRect(0, 0, 50, canvas.height);
ctx.fillRect(canvas.width - 50, 0, 50, canvas.height);
// Player
drawCar(player.x, player.y, player.width, player.height, '#FF6B6B');
// Enemies
enemies.forEach(e => drawCar(e.x, e.y, e.width, e.height, '#DC143C'));
// Coins
coins.forEach(c => {
ctx.fillStyle = '#FFD700';
ctx.beginPath();
ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
ctx.fill();
ctx.strokeStyle = '#FFA500';
ctx.lineWidth = 2;
ctx.stroke();
});
// Particles
particles.forEach(p => {
ctx.fillStyle = p.color;
ctx.globalAlpha = p.life / 30;
ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
ctx.globalAlpha = 1;
});
}
function drawCar(x, y, width, height, color) {
ctx.fillStyle = color;
ctx.fillRect(x, y, width, height);
ctx.fillStyle = '#87CEEB';
ctx.fillRect(x + 8, y + 15, width - 16, 15);
ctx.fillRect(x + 8, y + 35, width - 16, 15);
ctx.fillStyle = '#000';
ctx.fillRect(x + 5, y + 10, 8, 15);
ctx.fillRect(x + width - 13, y + 10, 8, 15);
ctx.fillRect(x + 5, y + height - 25, 8, 15);
ctx.fillRect(x + width - 13, y + height - 25, 8, 15);
}
function gameLoop() {
update();
draw();
if (gameRunning) requestAnimationFrame(gameLoop);
}
// Boot
initPlayer();
updateStats();
draw();
