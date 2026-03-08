const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;
// Game State
let level = 1;
let player = { x: 50, y: 300, w: 20, h: 20, dy: 0, dx: 0, grounded: false };
let platforms = [{ x: 0, y: 350, w: 120, h: 20, color: '#34495e', life: Infinity }];
let goal = { x: 730, y: 150, w: 40, h: 40 };
let gravity = 0.45;
const colors = { 'r': '#ff4d4d', 'g': '#4dff88', 'b': '#4d94ff' };
// Controls
const keys = {};
window.addEventListener('keydown', (e) => {
const key = e.key.toLowerCase();
keys[key] = true;
// Jump
if (key === ' ' && player.grounded) {
player.dy = -10;
player.grounded = false;
}
// Platform Spawning
if (colors[key]) {
spawnPlatform(colors[key]);
}
});
window.addEventListener('keyup', (e) => {
keys[e.key.toLowerCase()] = false;
});
function spawnPlatform(color) {
const newPlat = {
x: player.x + (player.dx * 10) + 40, // Spawn slightly ahead of movement
y: player.y + 10,
w: 80,
h: 12,
color: color,
life: 180 // Approx 3 seconds at 60fps
};
platforms.push(newPlat);
}
function update() {
// Horizontal Movement
if (keys['arrowleft']) player.dx = -4;
else if (keys['arrowright']) player.dx = 4;
else player.dx = 0;
// Physics
player.dy += gravity;
player.x += player.dx;
player.y += player.dy;
// Floor Boundary
if (player.y > canvas.height) resetPlayer();
if (player.x < 0) player.x = 0;
if (player.x > canvas.width - player.w) player.x = canvas.width - player.w;
// Platform Collisions & Decay
player.grounded = false;
for (let i = platforms.length - 1; i >= 0; i--) {
let plat = platforms[i];
// Collision logic
if (player.x < plat.x + plat.w && player.x + player.w > plat.x &&
player.y + player.h > plat.y && player.y + player.h < plat.y + plat.h + player.dy) {
player.grounded = true;
player.dy = 0;
player.y = plat.y - player.h;
}
// Decay (except first platform)
if (i > 0) {
plat.life--;
if (plat.life <= 0) platforms.splice(i, 1);
}
}
// Goal Check
if (player.x < goal.x + goal.w && player.x + player.w > goal.x &&
player.y < goal.y + goal.h && player.y + player.h > goal.y) {
nextLevel();
}
}
function resetPlayer() {
player.x = 50; player.y = 300; player.dy = 0;
}
function nextLevel() {
level++;
document.getElementById('lvl').innerText = level;
document.getElementById('msg').style.display = 'block';
// Pause for a moment
setTimeout(() => {
document.getElementById('msg').style.display = 'none';
resetPlayer();
platforms = [{ x: 0, y: 350, w: 120, h: 20, color: '#34495e', life: Infinity }];
goal.y = Math.random() * 200 + 100; // Move goal for next level
}, 1500);
}
function draw() {
ctx.clearRect(0, 0, canvas.width, canvas.height);
// Draw Goal (The "Kitchen Exit")
ctx.shadowBlur = 20; ctx.shadowColor = "#f1c40f";
ctx.fillStyle = '#f1c40f';
ctx.fillRect(goal.x, goal.y, goal.w, goal.h);
// Draw Platforms
platforms.forEach(plat => {
ctx.shadowBlur = plat.life === Infinity ? 0 : 10;
ctx.shadowColor = plat.color;
ctx.globalAlpha = plat.life === Infinity ? 1 : plat.life / 180;
ctx.fillStyle = plat.color;
ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
});
ctx.globalAlpha = 1;
// Draw Player
ctx.shadowBlur = 15; ctx.shadowColor = "#00ffcc";
ctx.fillStyle = '#00ffcc';
ctx.fillRect(player.x, player.y, player.w, player.h);
requestAnimationFrame(drawLoop);
}
function drawLoop() {
update();
draw();
}
drawLoop();
