const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("start-btn");
const menu = document.getElementById("menu");
const statusText = document.getElementById("status-text");
canvas.width = 400;
canvas.height = 500;
let player = { x: 180, y: 440, w: 40, h: 40, color: "#007bff" };
let enemies = [];
let score = 0;
let highScore = 0;
let gameActive = false;
let keys = {};
// Handle Input
window.addEventListener("keydown", e => keys[e.code] = true);
window.addEventListener("keyup", e => keys[e.code] = false);
function spawnEnemy() {
if (!gameActive) return;
enemies.push({
x: Math.random() * (canvas.width - 30),
y: -30,
w: 30,
h: 30
});
// Randomize next spawn time
setTimeout(spawnEnemy, Math.max(300, 1000 - (score * 10)));
}
function gameLoop() {
if (!gameActive) return;
// 1. Move Player
if (keys["ArrowLeft"] && player.x > 0) player.x -= 7;
if (keys["ArrowRight"] && player.x < canvas.width - player.w) player.x += 7;
// 2. Clear Screen
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);
// 3. Draw Player (The Blue Block)
ctx.fillStyle = player.color;
ctx.fillRect(player.x, player.y, player.w, player.h);
// 4. Update & Draw Enemies (Red Blocks)
for (let i = enemies.length - 1; i >= 0; i--) {
enemies[i].y += 5 + (score / 20); // Get faster
ctx.fillStyle = "#ff4444";
ctx.fillRect(enemies[i].x, enemies[i].y, enemies[i].w, enemies[i].h);
// Collision Detection
if (player.x < enemies[i].x + 30 && player.x + 40 > enemies[i].x &&
player.y < enemies[i].y + 30 && player.y + 40 > enemies[i].y) {
gameOver();
}
// Score points for dodging
if (enemies[i].y > canvas.height) {
enemies.splice(i, 1);
score++;
document.getElementById("score").innerText = "SCORE: " + score;
}
}
requestAnimationFrame(gameLoop);
}
function gameOver() {
gameActive = false;
menu.style.display = "block";
statusText.innerText = "GAME OVER";
startBtn.innerText = "RETRY";
if (score > highScore) {
highScore = score;
document.getElementById("high-score").innerText = "HI-SCORE: " + highScore;
}
}
startBtn.addEventListener("click", () => {
score = 0;
enemies = [];
player.x = 180;
document.getElementById("score").innerText = "SCORE: 0";
menu.style.display = "none";
gameActive = true;
spawnEnemy();
gameLoop();
});
