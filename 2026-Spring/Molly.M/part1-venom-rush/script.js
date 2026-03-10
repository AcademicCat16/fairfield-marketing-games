const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const comboEl = document.getElementById("combo");
const restartBtn = document.getElementById("restart");
const GRID = 20;
const SIZE = canvas.width / GRID;
// === Scoring / rules knobs ===
const BASE_POINTS = 10;
const COMBO_WINDOW_MS = 2000;
const GOLD_CHANCE = 0.10;
const GOLD_MULT = 3;
// Poison as a separate hazard (not a replacement for food)
const POISON_SPAWN_CHANCE_PER_TICK = 0.06; // chance per update tick to spawn (if none)
const POISON_LIFETIME_TICKS = 80; // disappears after ~80 ticks
const POISON_PENALTY = 20; // points lost on poison hit
const POISON_SHRINK = 2; // segments removed on poison hit
let snake, dir, nextDir, score, best, alive, tickMs, lastTime;
let combo = 1;
let lastEatAt = null;
let food = null; // good food
let poison = null; // poison hazard (or null)
let poisonTTL = 0; // ticks remaining for poison
function randCell() {
return { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
}
function same(a, b) { return a && b && a.x === b.x && a.y === b.y; }
function cellIsOnSnake(c) {
return snake.some(s => same(s, c));
}
function cellIsFree(c) {
if (cellIsOnSnake(c)) return false;
if (same(c, food)) return false;
if (same(c, poison)) return false;
return true;
}
function spawnFood() {
let f;
do { f = randCell(); } while (!cellIsFree(f));
f.isGold = Math.random() < GOLD_CHANCE;
return f;
}
function maybeSpawnPoison() {
if (poison) return; // only one poison at a time
if (Math.random() >= POISON_SPAWN_CHANCE_PER_TICK) return;
let p;
let tries = 0;
do {
p = randCell();
tries++;
if (tries > 200) return; // safety
} while (!cellIsFree(p));
poison = p;
poisonTTL = POISON_LIFETIME_TICKS;
}
function loadBest() {
const v = Number(localStorage.getItem("snake_best") || 0);
return Number.isFinite(v) ? v : 0;
}
function saveBest(v) {
localStorage.setItem("snake_best", String(v));
}
function reset() {
snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
dir = { x: 1, y: 0 };
nextDir = { x: 1, y: 0 };
score = 0;
best = loadBest();
alive = true;
combo = 1;
lastEatAt = null;
tickMs = 110;
scoreEl.textContent = score;
bestEl.textContent = best;
comboEl.textContent = "x1";
poison = null;
poisonTTL = 0;
food = spawnFood();
lastTime = undefined;
requestAnimationFrame(loop);
}
function setDir(nx, ny) {
if (nx === -dir.x && ny === -dir.y) return;
nextDir = { x: nx, y: ny };
}
function die() {
alive = false;
if (score > best) {
best = score;
bestEl.textContent = best;
saveBest(best);
}
}
function clampScore() {
if (score < 0) score = 0;
}
function shrinkSnake(n) {
for (let i = 0; i < n; i++) {
snake.pop();
if (snake.length < 2) {
die();
return;
}
}
}
function update(nowMs) {
if (!alive) return;
dir = nextDir;
const head = snake[0];
const newHead = { x: head.x + dir.x, y: head.y + dir.y };
// Walls deadly (change to wrap-around if you want)
if (newHead.x < 0 || newHead.x >= GRID || newHead.y < 0 || newHead.y >= GRID) {
die();
return;
}
// Self collision
if (snake.some((s, i) => i !== 0 && same(s, newHead))) {
die();
return;
}
snake.unshift(newHead);
// Check poison hit (hazard)
if (same(newHead, poison)) {
// Apply penalty + shrink, then remove poison
score -= POISON_PENALTY;
clampScore();
scoreEl.textContent = score;
combo = 1;
comboEl.textContent = "x1";
lastEatAt = null;
poison = null;
poisonTTL = 0;
shrinkSnake(POISON_SHRINK);
// Still move normally (don’t grow)
snake.pop();
return;
}
// Eat GOOD food
if (same(newHead, food)) {
// combo
if (lastEatAt !== null && (nowMs - lastEatAt) <= COMBO_WINDOW_MS) {
combo = Math.min(combo + 1, 9);
} else {
combo = 1;
}
lastEatAt = nowMs;
const mult = combo * (food.isGold ? GOLD_MULT : 1);
const gained = BASE_POINTS * mult;
score += gained;
scoreEl.textContent = score;
comboEl.textContent = "x" + combo;
if (score > best) {
best = score;
bestEl.textContent = best;
saveBest(best);
}
tickMs = Math.max(55, tickMs - 1.25);
// Respawn food elsewhere (always available)
food = spawnFood();
// (Do NOT pop tail => you grow)
} else {
// normal move
if (lastEatAt !== null && (nowMs - lastEatAt) > COMBO_WINDOW_MS && combo !== 1) {
combo = 1;
comboEl.textContent = "x1";
}
snake.pop();
}
// Poison lifetime + spawn chance
if (poison) {
poisonTTL--;
if (poisonTTL <= 0) {
poison = null;
poisonTTL = 0;
}
}
maybeSpawnPoison();
}
function draw() {
ctx.clearRect(0, 0, canvas.width, canvas.height);
// Good food: red, gold: yellow
ctx.fillStyle = food.isGold ? "#ffd166" : "#ff4d6d";
ctx.fillRect(food.x * SIZE + 3, food.y * SIZE + 3, SIZE - 6, SIZE - 6);
// Poison hazard: purple (different color)
if (poison) {
ctx.fillStyle = "#9b5cff";
ctx.fillRect(poison.x * SIZE + 3, poison.y * SIZE + 3, SIZE - 6, SIZE - 6);
}
// Snake
for (let i = 0; i < snake.length; i++) {
const s = snake[i];
ctx.fillStyle = i === 0 ? "#7c5cff" : "#5cff8a";
ctx.fillRect(s.x * SIZE + 2, s.y * SIZE + 2, SIZE - 4, SIZE - 4);
}
if (!alive) {
ctx.fillStyle = "rgba(0,0,0,.6)";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "#fff";
ctx.font = "bold 26px system-ui";
ctx.textAlign = "center";
ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 10);
ctx.font = "16px system-ui";
ctx.fillText("Press Restart", canvas.width / 2, canvas.height / 2 + 20);
}
}
function loop(t) {
if (lastTime === undefined) lastTime = t;
if (t - lastTime >= tickMs) {
lastTime = t;
update(t);
}
draw();
requestAnimationFrame(loop);
}
// Controls
window.addEventListener("keydown", (e) => {
const k = e.key.toLowerCase();
if (k === "arrowup" || k === "w") setDir(0, -1);
else if (k === "arrowdown" || k === "s") setDir(0, 1);
else if (k === "arrowleft" || k === "a") setDir(-1, 0);
else if (k === "arrowright" || k === "d") setDir(1, 0);
});
let touchStart = null;
window.addEventListener("touchstart", (e) => {
if (!e.touches?.length) return;
touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}, { passive: true });
window.addEventListener("touchend", (e) => {
if (!touchStart) return;
const t = e.changedTouches[0];
const dx = t.clientX - touchStart.x;
const dy = t.clientY - touchStart.y;
touchStart = null;
const ax = Math.abs(dx), ay = Math.abs(dy);
if (Math.max(ax, ay) < 20) return;
if (ax > ay) setDir(dx > 0 ? 1 : -1, 0);
else setDir(0, dy > 0 ? 1 : -1);
}, { passive: true });
restartBtn.addEventListener("click", reset);
reset();
