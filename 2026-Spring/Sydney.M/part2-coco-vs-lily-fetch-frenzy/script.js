const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
let dog1 = { x: 100, y: 200, size: 80, speed: 4 };
let dog2 = { x: 500, y: 200, size: 80, speed: 1.6 };
let treat = { x: 350, y: 200, size: 20 };
let score1 = 0;
let score2 = 0;
let timeLeft = 30;
let gameRunning = false;
let keys = {};
let animationTick = 0;
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);
startBtn.addEventListener("click", startGame);
function startGame() {
score1 = 0;
score2 = 0;
timeLeft = 30;
dog1.x = 100;
dog1.y = 200;
dog2.x = 500;
dog2.y = 200;
document.getElementById("score1").textContent = score1;
document.getElementById("score2").textContent = score2;
document.getElementById("timer").textContent = timeLeft;
gameRunning = true;
spawnTreat();
update();
countdown();
}
function spawnTreat() {
treat.x = Math.random() * (canvas.width - treat.size);
treat.y = Math.random() * (canvas.height - treat.size);
}
function moveDog1() {
if (keys["ArrowUp"]) dog1.y -= dog1.speed;
if (keys["ArrowDown"]) dog1.y += dog1.speed;
if (keys["ArrowLeft"]) dog1.x -= dog1.speed;
if (keys["ArrowRight"]) dog1.x += dog1.speed;
}
function moveDog2() {
if (dog2.x < treat.x) dog2.x += dog2.speed;
if (dog2.x > treat.x) dog2.x -= dog2.speed;
if (dog2.y < treat.y) dog2.y += dog2.speed;
if (dog2.y > treat.y) dog2.y -= dog2.speed;
}
function checkCollision(dog) {
return (
dog.x < treat.x + treat.size &&
dog.x + dog.size > treat.x &&
dog.y < treat.y + treat.size &&
dog.y + dog.size > treat.y
);
}
function drawGrass() {
ctx.fillStyle = "#8ecf6b";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "rgba(0,0,0,0.05)";
for (let i = 0; i < 120; i++) {
ctx.fillRect(
Math.random() * canvas.width,
Math.random() * canvas.height,
2,
2
);
}
}
function drawShadow(x, y, size) {
ctx.fillStyle = "rgba(0,0,0,0.2)";
ctx.beginPath();
ctx.ellipse(x + size/2, y + size - 5, size/3, size/6, 0, 0, Math.PI * 2);
ctx.fill();
}
function drawCoco(x, y, size) {
const bounce = Math.sin(animationTick / 5) * 3;
ctx.save();
ctx.translate(x + size/2, y + size/2 + bounce);
ctx.fillStyle = "#8B4513";
ctx.beginPath();
ctx.ellipse(0, 8, size/2, size/3, 0, 0, Math.PI * 2);
ctx.fill();
ctx.beginPath();
ctx.arc(0, -size/4, size/3, 0, Math.PI * 2);
ctx.fill();
ctx.beginPath();
ctx.arc(-size/4, -size/2.5, size/6, 0, Math.PI * 2);
ctx.fill();
ctx.beginPath();
ctx.arc(size/4, -size/2.5, size/6, 0, Math.PI * 2);
ctx.fill();
ctx.fillStyle = "white";
ctx.beginPath();
ctx.arc(-size/10, -size/4, size/12, 0, Math.PI * 2);
ctx.arc(size/10, -size/4, size/12, 0, Math.PI * 2);
ctx.fill();
ctx.fillStyle = "black";
ctx.beginPath();
ctx.arc(-size/10, -size/4, size/20, 0, Math.PI * 2);
ctx.arc(size/10, -size/4, size/20, 0, Math.PI * 2);
ctx.fill();
ctx.beginPath();
ctx.arc(0, -size/6, size/18, 0, Math.PI * 2);
ctx.fill();
ctx.fillStyle = "red";
ctx.fillRect(-size/4, 0, size/2, size/10);
ctx.restore();
}
function drawLily(x, y, size) {
const bounce = Math.sin(animationTick / 5) * 3;
ctx.save();
ctx.translate(x + size/2, y + size/2 + bounce);
ctx.fillStyle = "#222";
ctx.beginPath();
ctx.ellipse(0, 8, size/2, size/3, 0, 0, Math.PI * 2);
ctx.fill();
ctx.beginPath();
ctx.arc(0, -size/4, size/3, 0, Math.PI * 2);
ctx.fill();
// Ears
ctx.beginPath();
ctx.arc(-size/4, -size/2.5, size/6, 0, Math.PI * 2);
ctx.fill();
ctx.beginPath();
ctx.arc(size/4, -size/2.5, size/6, 0, Math.PI * 2);
ctx.fill();
// Eyes
ctx.fillStyle = "white";
ctx.beginPath();
ctx.arc(-size/10, -size/4, size/12, 0, Math.PI * 2);
ctx.arc(size/10, -size/4, size/12, 0, Math.PI * 2);
ctx.fill();
ctx.fillStyle = "black";
ctx.beginPath();
ctx.arc(-size/10, -size/4, size/20, 0, Math.PI * 2);
ctx.arc(size/10, -size/4, size/20, 0, Math.PI * 2);
ctx.fill();
// Nose
ctx.beginPath();
ctx.arc(0, -size/6, size/18, 0, Math.PI * 2);
ctx.fill();
// Collar
ctx.fillStyle = "purple";
ctx.fillRect(-size/4, 0, size/2, size/10);
ctx.restore();
}
// 🦴 Bone Treat
function drawTreat() {
ctx.fillStyle = "#7b4f2c";
ctx.beginPath();
ctx.arc(treat.x - 5, treat.y, 6, 0, Math.PI * 2);
ctx.arc(treat.x + 5, treat.y, 6, 0, Math.PI * 2);
ctx.fill();
ctx.fillRect(treat.x - 5, treat.y - 4, 10, 8);
}
function draw() {
ctx.clearRect(0, 0, canvas.width, canvas.height);
drawGrass();
drawTreat();
drawShadow(dog1.x, dog1.y, dog1.size);
drawShadow(dog2.x, dog2.y, dog2.size);
drawCoco(dog1.x, dog1.y, dog1.size);
drawLily(dog2.x, dog2.y, dog2.size);
}
function update() {
if (!gameRunning) return;
animationTick++;
moveDog1();
moveDog2();
if (checkCollision(dog1)) {
score1++;
document.getElementById("score1").textContent = score1;
spawnTreat();
}
if (checkCollision(dog2)) {
score2++;
document.getElementById("score2").textContent = score2;
spawnTreat();
}
draw();
requestAnimationFrame(update);
}
function countdown() {
let timerInterval = setInterval(() => {
if (!gameRunning) {
clearInterval(timerInterval);
return;
}
timeLeft--;
document.getElementById("timer").textContent = timeLeft;
if (timeLeft <= 0) {
gameRunning = false;
clearInterval(timerInterval);
alert(
score1 > score2
? "Coco Wins! 🐶 "
: score2 > score1
? "Lily Wins! 😈 "
: "It's a Tie!"
);
}
}, 1000);
}
