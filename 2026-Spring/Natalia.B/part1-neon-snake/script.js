// Neon Snake (theme + visuals + scoring/rules updated)
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
// HUD elements
const scoreEl = document.getElementById("score");
const highEl = document.getElementById("high");
const comboEl = document.getElementById("combo");
// Grid
const SIZE = 600;
const STEP = 20;
const GRID = SIZE / STEP;
// RULE TOGGLE:
// true = wrap through walls (new rule)
// false = hitting wall resets (classic)
const WRAP_WALLS = true;
// Game state
let direction = "stop";
let nextDirection = "stop";
let head, segments, food;
let score = 0;
let highScore = 0;
// Speed (faster over time)
let delay = 110; // ms start
const MIN_DELAY = 40; // cap speed
// NEW scoring mechanics
let combo = 1;
let lastEatTime = 0;
const COMBO_WINDOW_MS = 2000; // eat again within 2s to increase combo
let loopId = null;
// ---------- Helpers ----------
function randInt(max) {
return Math.floor(Math.random() * max);
}
function randomFoodAvoidSnake() {
// avoid spawning food inside snake
while (true) {
const f = { x: randInt(GRID), y: randInt(GRID) };
const onHead = (f.x === head.x && f.y === head.y);
const onBody = segments.some(s => s.x === f.x && s.y === f.y);
if (!onHead && !onBody) return f;
}
}
function setDirection(d) {
// prevent 180-degree turns
if (direction === "up" && d === "down") return;
if (direction === "down" && d === "up") return;
if (direction === "left" && d === "right") return;
if (direction === "right" && d === "left") return;
nextDirection = d;
// Start moving if stopped
if (direction === "stop") direction = d;
}
window.addEventListener("keydown", (e) => {
const k = e.key.toLowerCase();
if (k === "w" || k === "arrowup") setDirection("up");
if (k === "s" || k === "arrowdown") setDirection("down");
if (k === "a" || k === "arrowleft") setDirection("left");
if (k === "d" || k === "arrowright") setDirection("right");
});
// ---------- Game core ----------
function resetGame() {
head = { x: Math.floor(GRID / 2), y: Math.floor(GRID / 2) };
segments = [];
direction = "stop";
nextDirection = "stop";
score = 0;
combo = 1;
lastEatTime = 0;
delay = 110;
food = { x: randInt(GRID), y: randInt(GRID) }; // temp
food = randomFoodAvoidSnake();
updateHud();
}
function updateHud() {
scoreEl.textContent = score;
highEl.textContent = highScore;
comboEl.textContent = `x${combo}`;
}
function moveHead() {
if (direction === "stop") return;
if (direction === "up") head.y -= 1;
if (direction === "down") head.y += 1;
if (direction === "left") head.x -= 1;
if (direction === "right") head.x += 1;
if (WRAP_WALLS) {
// NEW rule: wrap-through borders
head.x = (head.x + GRID) % GRID;
head.y = (head.y + GRID) % GRID;
}
}
function hitBorderClassic() {
return head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID;
}
function hitBody() {
return segments.some(s => s.x === head.x && s.y === head.y);
}
function eatFood() {
return head.x === food.x && head.y === food.y;
}
function tick() {
if (nextDirection !== "stop") direction = nextDirection;
// move body: tail follows
if (segments.length > 0) {
for (let i = segments.length - 1; i > 0; i--) {
segments[i].x = segments[i - 1].x;
segments[i].y = segments[i - 1].y;
}
segments[0].x = head.x;
segments[0].y = head.y;
}
// move head
moveHead();
// If not wrapping, wall hit ends run
if (!WRAP_WALLS && hitBorderClassic()) {
if (score > highScore) highScore = score;
resetGame();
render();
scheduleNextTick();
return;
}
// body collision ends run
if (hitBody()) {
if (score > highScore) highScore = score;
resetGame();
render();
scheduleNextTick();
return;
}
// food
if (eatFood()) {
// grow
segments.push({ x: head.x, y: head.y });
// NEW scoring: combo if fast
const now = performance.now();
if (now - lastEatTime <= COMBO_WINDOW_MS) combo += 1;
else combo = 1;
lastEatTime = now;
// points scale with combo
score += 10 * combo;
if (score > highScore) highScore = score;
// speed up a bit each food
delay = Math.max(MIN_DELAY, delay - 3);
// respawn food safely
food = randomFoodAvoidSnake();
updateHud();
}
render();
scheduleNextTick();
}
function scheduleNextTick() {
clearTimeout(loopId);
loopId = setTimeout(tick, delay);
}
// ---------- Rendering (new visuals) ----------
function drawBackgroundGrid() {
ctx.save();
ctx.globalAlpha = 1;
// subtle grid lines
ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--grid").trim() || "rgba(120,180,255,0.06)";
for (let i = 0; i <= GRID; i++) {
ctx.beginPath();
ctx.moveTo(i * STEP, 0);
ctx.lineTo(i * STEP, SIZE);
ctx.stroke();
ctx.beginPath();
ctx.moveTo(0, i * STEP);
ctx.lineTo(SIZE, i * STEP);
ctx.stroke();
}
ctx.restore();
}
function roundRect(x, y, w, h, r) {
const rr = Math.min(r, w / 2, h / 2);
ctx.beginPath();
ctx.moveTo(x + rr, y);
ctx.arcTo(x + w, y, x + w, y + h, rr);
ctx.arcTo(x + w, y + h, x, y + h, rr);
ctx.arcTo(x, y + h, x, y, rr);
ctx.arcTo(x, y, x + w, y, rr);
ctx.closePath();
}
function drawSnakeCell(x, y) {
const px = x * STEP;
const py = y * STEP;
// glow
ctx.save();
ctx.shadowColor = "rgba(52,255,189,0.35)";
ctx.shadowBlur = 14;
ctx.fillStyle = "#34ffbd";
roundRect(px + 2, py + 2, STEP - 4, STEP - 4, 7);
ctx.fill();
ctx.restore();
}
function drawFood(x, y) {
const cx = x * STEP + STEP / 2;
const cy = y * STEP + STEP / 2;
ctx.save();
ctx.shadowColor = "rgba(255,59,107,0.45)";
ctx.shadowBlur = 18;
ctx.fillStyle = "#ff3b6b";
ctx.beginPath();
ctx.arc(cx, cy, STEP / 2 - 3, 0, Math.PI * 2);
ctx.fill();
ctx.restore();
}
function render() {
ctx.clearRect(0, 0, SIZE, SIZE);
drawBackgroundGrid();
// food
drawFood(food.x, food.y);
// body
for (const s of segments) drawSnakeCell(s.x, s.y);
// head (slightly brighter)
drawSnakeCell(head.x, head.y);
}
// Start
resetGame();
render();
scheduleNextTick();
