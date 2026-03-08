const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
canvas.width = 800;
canvas.height = 500;
// Assets
const imgPlayer1 = new Image();
imgPlayer1.src = "https://raw.githubusercontent.com/ryanvieni-bot/Game-Assets/refs/heads/main/Messi-silueta-1.png";
const imgPlayer2 = new Image();
imgPlayer2.src = "https://raw.githubusercontent.com/ryanvieni-bot/Game-Assets/refs/heads/main/diez4ge-4c38334b-ed48-44a1-930f-ee2822bd97ef.png";
// Game State
const ball = { x: 400, y: 250, radius: 10, speedX: 5, speedY: 5 };
const p1 = { x: 20, y: 200, score: 0 };
const p2 = { x: 720, y: 200, score: 0 };
const keys = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);
function update() {
// Player 1 (W/S)
if (keys['w'] && p1.y > 10) p1.y -= 7;
if (keys['s'] && p1.y < canvas.height - 110) p1.y += 7;
// Player 2 (Arrows)
if (keys['ArrowUp'] && p2.y > 10) p2.y -= 7;
if (keys['ArrowDown'] && p2.y < canvas.height - 110) p2.y += 7;
ball.x += ball.speedX;
ball.y += ball.speedY;
if (ball.y < 10 || ball.y > canvas.height - 10) ball.speedY *= -1;
// Goal Logic
if (ball.x < 0) { p2.score++; resetBall(); }
if (ball.x > canvas.width) { p1.score++; resetBall(); }
// Bounce off players
if (checkHit(ball, p1) || checkHit(ball, p2)) ball.speedX *= -1.1;
scoreEl.innerText = `${p1.score} - ${p2.score}`;
}
function checkHit(b, p) {
return b.x > p.x && b.x < p.x + 60 && b.y > p.y && b.y < p.y + 100;
}
function resetBall() {
ball.x = 400; ball.y = 250;
ball.speedX = ball.speedX > 0 ? -5 : 5;
}
function draw() {
ctx.clearRect(0, 0, canvas.width, canvas.height);
// --- DRAW SOCCER FIELD ---
ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
ctx.lineWidth = 4;
// Center Line & Circle
ctx.beginPath();
ctx.moveTo(400, 0); ctx.lineTo(400, 500);
ctx.stroke();
ctx.beginPath();
ctx.arc(400, 250, 60, 0, Math.PI * 2);
ctx.stroke();
// Penalty Boxes
ctx.strokeRect(0, 125, 80, 250); // Left
ctx.strokeRect(720, 125, 80, 250); // Right
// --- DRAW PLAYERS ---
ctx.drawImage(imgPlayer1, p1.x, p1.y, 60, 100);
ctx.drawImage(imgPlayer2, p2.x, p2.y, 60, 100);
// --- DRAW BALL ---
ctx.fillStyle = "white";
ctx.beginPath();
ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
ctx.fill();
}
function loop() { update(); draw(); requestAnimationFrame(loop); }
loop();
