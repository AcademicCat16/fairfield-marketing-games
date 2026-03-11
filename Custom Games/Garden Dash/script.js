const canvas = document.getElementById('gardenCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const msg = document.getElementById('message');
canvas.width = 600;
canvas.height = 400;
let score = 0;
let level = 1;
let gameActive = false;
const player = {
x: 300,
y: 200,
size: 30,
speed: 4,
color: '#74c69d'
};
let pollens = [];
let frosts = [];
function init() {
pollens = Array.from({length: 5}, () => spawnItem());
frosts = Array.from({length: 2}, () => spawnItem());
}
function spawnItem() {
return {
x: Math.random() * (canvas.width - 20),
y: Math.random() * (canvas.height - 20),
size: 15
};
}
const keys = {};
window.addEventListener('keydown', e => {
keys[e.code] = true;
if (!gameActive) {
gameActive = true;
msg.style.opacity = 0;
}
});
window.addEventListener('keyup', e => keys[e.code] = false);
function update() {
if (!gameActive) return;
if (keys['ArrowUp'] && player.y > 0) player.y -= player.speed;
if (keys['ArrowDown'] && player.y < canvas.height - player.size) player.y += player.speed;
if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
if (keys['ArrowRight'] && player.x < canvas.width - player.size) player.x += player.speed;
// Collection logic
pollens.forEach((p, i) => {
if (checkCollision(player, p)) {
pollens[i] = spawnItem();
score++;
scoreEl.innerText = score;
if (score % 10 === 0) {
level++;
levelEl.innerText = level;
frosts.push(spawnItem()); // Increase difficulty
}
}
});
// Obstacle logic
frosts.forEach(f => {
if (checkCollision(player, f)) {
player.x = 300; player.y = 200; // Reset position
score = Math.max(0, score - 2);
scoreEl.innerText = score;
}
});
}
function checkCollision(a, b) {
return a.x < b.x + b.size && a.x + a.size > b.x && a.y < b.y + b.size && a.y + a.size > b.y;
}
function draw() {
ctx.clearRect(0, 0, canvas.width, canvas.height);
// Draw Gardener
ctx.fillStyle = player.color;
ctx.fillRect(player.x, player.y, player.size, player.size);
ctx.fillStyle = '#1b4332'; // Leaf detail
ctx.fillRect(player.x + 10, player.y - 5, 10, 10);
// Draw Pollen
ctx.fillStyle = '#ffb703';
pollens.forEach(p => {
ctx.beginPath();
ctx.arc(p.x + 7, p.y + 7, 7, 0, Math.PI * 2);
ctx.fill();
});
// Draw Frost
ctx.fillStyle = '#caf0f8';
frosts.forEach(f => ctx.fillRect(f.x, f.y, f.size, f.size));
update();
requestAnimationFrame(draw);
}
init();
draw();
