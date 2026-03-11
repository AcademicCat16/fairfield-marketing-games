const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const timeDisplay = document.getElementById('time');
const overlay = document.getElementById('overlay');
const statusText = document.getElementById('status'); // Connects to the HTML <h1>
canvas.width = 800;
canvas.height = 500;
// --- CHARACTER DRAWING CODE ---
function drawKitty(x, y, size, isEvil) {
ctx.save();
ctx.translate(x, y);
const scale = size / 100;
ctx.scale(scale, scale);
if (isEvil) { ctx.shadowBlur = 20; ctx.shadowColor = "red"; }
ctx.fillStyle = isEvil ? "#333" : "white";
ctx.strokeStyle = "black";
ctx.lineWidth = 2;
ctx.beginPath();
ctx.ellipse(50, 50, 45, 35, 0, 0, Math.PI * 2);
ctx.fill(); ctx.stroke();
ctx.beginPath();
ctx.moveTo(15, 25); ctx.lineTo(10, 5); ctx.lineTo(35, 20);
ctx.moveTo(85, 25); ctx.lineTo(90, 5); ctx.lineTo(65, 20);
ctx.fill(); ctx.stroke();
ctx.fillStyle = isEvil ? "red" : "black";
ctx.beginPath();
ctx.arc(30, 50, 5, 0, Math.PI * 2);
ctx.arc(70, 50, 5, 0, Math.PI * 2);
ctx.fill();
ctx.fillStyle = "yellow";
ctx.beginPath(); ctx.ellipse(50, 60, 6, 4, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
ctx.fillStyle = isEvil ? "#900" : "#ff0066";
ctx.beginPath(); ctx.arc(80, 20, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
ctx.restore();
}
// --- GAME LOGIC ---
let player, boss, exitPortal, keys, gameActive, startTime;
function init() {
player = { x: 50, y: 220, size: 60, speed: 7 };
boss = { x: 700, y: 220, size: 80, speed: 2.8 };
exitPortal = { x: 740, y: 180, width: 50, height: 140 };
keys = {};
gameActive = true;
startTime = Date.now();
overlay.style.display = 'none';
}
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);
function update() {
if (!gameActive) return;
if (keys['ArrowUp']) player.y -= player.speed;
if (keys['ArrowDown']) player.y += player.speed;
if (keys['ArrowLeft']) player.x -= player.speed;
if (keys['ArrowRight']) player.x += player.speed;
// Chase Logic
let dx = player.x - boss.x;
let dy = player.y - boss.y;
let angle = Math.atan2(dy, dx);
boss.x += Math.cos(angle) * boss.speed;
boss.y += Math.sin(angle) * boss.speed;
// LOSE CONDITION
if (Math.hypot(dx, dy) < 50) {
gameActive = false;
statusText.innerText = "CAUGHT BY EVIL KITTY!";
statusText.style.color = "red";
overlay.style.display = 'flex';
}
// WIN CONDITION
if (player.x + player.size > exitPortal.x &&
player.y < exitPortal.y + exitPortal.height &&
player.y + player.size > exitPortal.y) {
gameActive = false;
statusText.innerText = "YOU ESCAPED EVIL KITTY!";
statusText.style.color = "#ff69b4"; // Pink for win
overlay.style.display = 'flex';
}
timeDisplay.innerText = Math.floor((Date.now() - startTime) / 1000);
}
function draw() {
ctx.clearRect(0, 0, canvas.width, canvas.height);
// Background Forest
ctx.fillStyle = "rgba(0,0,0,0.15)";
for(let i=0; i<8; i++) ctx.fillRect(i*115 + 20, 0, 30, 500);
// Draw Gold Exit
ctx.fillStyle = "#ffd700";
ctx.shadowBlur = 20; ctx.shadowColor = "yellow";
ctx.fillRect(exitPortal.x, exitPortal.y, exitPortal.width, exitPortal.height);
ctx.shadowBlur = 0;
drawKitty(player.x, player.y, player.size, false);
drawKitty(boss.x, boss.y, boss.size, true);
if (gameActive) {
requestAnimationFrame(draw);
update();
}
}
// This function is called by the button in the HTML
function resetGame() {
init();
draw();
}
// Launch the game for the first time
init();
draw();
