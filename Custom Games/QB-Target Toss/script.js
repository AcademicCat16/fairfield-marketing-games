// QB Target Toss - original game
// Mechanics: drag-aim throw, hit targets, combo multiplier, levels, wind, local leaderboard.
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const ui = {
time: document.getElementById("time"),
score: document.getElementById("score"),
combo: document.getElementById("combo"),
level: document.getElementById("level"),
wind: document.getElementById("wind"),
startBtn: document.getElementById("startBtn"),
resetBtn: document.getElementById("resetBtn"),
overlay: document.getElementById("overlay"),
endTitle: document.getElementById("endTitle"),
endBody: document.getElementById("endBody"),
playAgain: document.getElementById("playAgain"),
scores: document.getElementById("scores"),
difficulty: document.getElementById("difficulty"),
sound: document.getElementById("sound"),
};
const S = {
running: false,
timeLeft: 45,
score: 0,
combo: 0,
level: 1,
wind: 0,
nextLevelAt: 300,
// aim state
aiming: false,
aimStart: { x: 0, y: 0 },
aimNow: { x: 0, y: 0 },
// entities
qb: { x: 120, y: 390, r: 22 },
ball: null,
targets: [],
lastHitAt: 0,
difficulty: "normal",
};
const audioCtx = (() => {
try { return new (window.AudioContext || window.webkitAudioContext)(); }
catch { return null; }
})();
function beep(freq = 440, duration = 0.08) {
if (!ui.sound.checked || !audioCtx) return;
const o = audioCtx.createOscillator();
const g = audioCtx.createGain();
o.type = "sine";
o.frequency.value = freq;
g.gain.value = 0.05;
o.connect(g);
g.connect(audioCtx.destination);
o.start();
o.stop(audioCtx.currentTime + duration);
}
function rand(min, max) {
return Math.random() * (max - min) + min;
}
function clamp(v, min, max) {
return Math.max(min, Math.min(max, v));
}
function setDifficulty() {
S.difficulty = ui.difficulty.value;
// affects: time, target size, spawn rate, wind
if (S.difficulty === "easy") S.timeLeft = 55;
if (S.difficulty === "normal") S.timeLeft = 45;
if (S.difficulty === "hard") S.timeLeft = 38;
}
function resetGame() {
S.running = false;
setDifficulty();
S.score = 0;
S.combo = 0;
S.level = 1;
S.wind = 0;
S.nextLevelAt = 300;
S.ball = null;
S.targets = [];
ui.startBtn.textContent = "Start";
ui.overlay.classList.add("hidden");
updateHUD();
spawnTargets(3);
draw();
}
function updateHUD() {
ui.time.textContent = Math.max(0, Math.ceil(S.timeLeft));
ui.score.textContent = S.score;
ui.combo.textContent = S.combo;
ui.level.textContent = S.level;
ui.wind.textContent = S.wind.toFixed(1);
}
function startGame() {
if (S.running) return;
S.running = true;
ui.startBtn.textContent = "Running";
S.lastTick = performance.now();
requestAnimationFrame(loop);
}
function endGame() {
S.running = false;
ui.startBtn.textContent = "Start";
saveScore(S.score);
renderScores();
ui.endTitle.textContent = "Time!";
ui.endBody.innerHTML =
`Final score: <b>${S.score}</b><br>` +
`Highest combo: <b>${S.maxCombo || 0}x</b><br>` +
`Level reached: <b>${S.level}</b>`;
ui.overlay.classList.remove("hidden");
}
function levelUpIfNeeded() {
while (S.score >= S.nextLevelAt) {
S.level += 1;
S.nextLevelAt += 300;
// wind scales with level
const base = S.difficulty === "hard" ? 1.3 : (S.difficulty === "easy" ? 0.7 : 1.0);
S.wind = rand(-1.5, 1.5) * base * (1 + (S.level - 1) * 0.12);
// adjust targets: make smaller + add one
spawnTargets(1);
shrinkTargets();
beep(740, 0.10);
}
}
function shrinkTargets() {
for (const t of S.targets) {
t.r = Math.max(14, t.r - 2);
}
}
function spawnTargets(n) {
for (let i = 0; i < n; i++) {
S.targets.push(makeTarget());
}
}
function makeTarget() {
const baseR = S.difficulty === "hard" ? 22 : (S.difficulty === "easy" ? 30 : 26);
const r = baseR - Math.min(10, (S.level - 1) * 1.2);
// place on "field" right side
return {
x: rand(420, 820),
y: rand(150, 390),
r,
// bullseye ring
inner: Math.max(10, r * 0.45),
vx: rand(-0.35, 0.35),
vy: rand(-0.25, 0.25),
alive: true,
};
}
// Physics-ish throw
function throwBall(fromX, fromY, toX, toY) {
const dx = fromX - toX;
const dy = fromY - toY;
// power based on drag distance
const power = clamp(Math.hypot(dx, dy), 20, 220);
// direction opposite of drag
const angle = Math.atan2(dy, dx);
// velocity
const speedBase = S.difficulty === "hard" ? 11.5 : (S.difficulty === "easy" ? 9.5 : 10.5);
const speed = (power / 220) * speedBase + 5.5;
const vx = Math.cos(angle) * speed;
const vy = Math.sin(angle) * speed;
S.ball = {
x: fromX,
y: fromY,
r: 10,
vx,
vy,
spin: rand(-0.15, 0.15),
alive: true,
};
beep(520, 0.06);
}
function updateBall(dt) {
if (!S.ball || !S.ball.alive) return;
const b = S.ball;
// wind pushes horizontally
b.vx += S.wind * 0.02;
// gravity
b.vy += 9.8 * 0.07 * (dt / 16.7);
// move
b.x += b.vx * (dt / 16.7) * 6;
b.y += b.vy * (dt / 16.7) * 6;
// bounds: if off screen, kill ball + drop combo
if (b.x < -40 || b.x > canvas.width + 40 || b.y > canvas.height + 60 || b.y < -60) {
b.alive = false;
S.ball = null;
// miss resets combo
S.combo = 0;
updateHUD();
beep(220, 0.08);
}
}
function updateTargets(dt) {
for (const t of S.targets) {
if (!t.alive) continue;
t.x += t.vx * (dt / 16.7) * 6;
t.y += t.vy * (dt / 16.7) * 6;
// bounce inside target region
if (t.x < 420 + t.r || t.x > 840 - t.r) t.vx *= -1;
if (t.y < 140 + t.r || t.y > 410 - t.r) t.vy *= -1;
}
}
function checkHits() {
if (!S.ball || !S.ball.alive) return;
const b = S.ball;
for (const t of S.targets) {
if (!t.alive) continue;
const d = Math.hypot(b.x - t.x, b.y - t.y);
if (d <= b.r + t.r) {
// hit!
t.alive = false;
S.ball.alive = false;
S.ball = null;
const bullseye = d <= t.inner;
const base = bullseye ? 150 : 90;
// combo build
S.combo += 1;
S.maxCombo = Math.max(S.maxCombo || 0, S.combo);
// scoring multiplier
const mult = 1 + Math.min(2.5, S.combo * 0.18);
const gained = Math.round(base * mult);
S.score += gained;
S.lastHitAt = performance.now();
// replace target
S.targets.push(makeTarget());
levelUpIfNeeded();
updateHUD();
beep(bullseye ? 880 : 660, 0.08);
break;
}
}
}
function drawField() {
// yard lines
ctx.save();
ctx.globalAlpha = 0.22;
ctx.fillStyle = "#ffffff";
for (let x = 0; x < canvas.width; x += 80) {
ctx.fillRect(x, 270, 4, 250);
}
ctx.restore();
// end zone-ish
ctx.save();
ctx.globalAlpha = 0.18;
ctx.fillStyle = "#0b1020";
ctx.fillRect(0, 350, 300, 170);
ctx.restore();
}
function drawQB() {
const q = S.qb;
ctx.save();
ctx.fillStyle = "#0b1020";
ctx.globalAlpha = 0.25;
ctx.beginPath();
ctx.ellipse(q.x + 10, q.y + 18, q.r * 1.15, q.r * 0.55, 0, 0, Math.PI * 2);
ctx.fill();
ctx.globalAlpha = 1;
ctx.fillStyle = "#18243b";
ctx.beginPath();
ctx.arc(q.x, q.y, q.r, 0, Math.PI * 2);
ctx.fill();
ctx.fillStyle = "#ffd54a";
ctx.beginPath();
ctx.arc(q.x - 6, q.y - 4, 5, 0, Math.PI * 2);
ctx.fill();
ctx.fillStyle = "#ffffff";
ctx.font = "bold 12px Arial";
ctx.fillText("QB", q.x - 10, q.y + 4);
ctx.restore();
}
function drawBall() {
if (!S.ball) return;
const b = S.ball;
ctx.save();
ctx.fillStyle = "#7a3b10";
ctx.beginPath();
ctx.ellipse(b.x, b.y, 13, 9, (b.spin || 0), 0, Math.PI * 2);
ctx.fill();
ctx.strokeStyle = "rgba(255,255,255,0.7)";
ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(b.x - 6, b.y);
ctx.lineTo(b.x + 6, b.y);
ctx.stroke();
ctx.restore();
}
function drawTargets() {
for (const t of S.targets) {
if (!t.alive) continue;
// outer
ctx.save();
ctx.fillStyle = "rgba(255,255,255,0.18)";
ctx.beginPath();
ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
ctx.fill();
// ring
ctx.strokeStyle = "rgba(0,0,0,0.25)";
ctx.lineWidth = 3;
ctx.beginPath();
ctx.arc(t.x, t.y, t.inner, 0, Math.PI * 2);
ctx.stroke();
// center
ctx.fillStyle = "rgba(255, 213, 74, 0.9)";
ctx.beginPath();
ctx.arc(t.x, t.y, Math.max(5, t.inner * 0.45), 0, Math.PI * 2);
ctx.fill();
ctx.restore();
}
}
function drawAimLine() {
if (!S.aiming) return;
const q = S.qb;
const dx = q.x - S.aimNow.x;
const dy = q.y - S.aimNow.y;
const p = clamp(Math.hypot(dx, dy), 20, 220);
ctx.save();
ctx.globalAlpha = 0.85;
ctx.strokeStyle = "rgba(255,255,255,0.85)";
ctx.lineWidth = 3;
ctx.beginPath();
ctx.moveTo(q.x, q.y);
ctx.lineTo(q.x + (dx / (p || 1)) * (p * 0.9), q.y + (dy / (p || 1)) * (p * 0.9));
ctx.stroke();
// power meter dot
ctx.fillStyle = "#ffd54a";
ctx.beginPath();
ctx.arc(q.x + (dx / (p || 1)) * (p * 0.9), q.y + (dy / (p || 1)) * (p * 0.9), 6, 0, Math.PI * 2);
ctx.fill();
// power label
ctx.fillStyle = "rgba(0,0,0,0.55)";
ctx.fillRect(18, 18, 150, 30);
ctx.fillStyle = "white";
ctx.font = "bold 14px Arial";
ctx.fillText(`Power: ${Math.round((p / 220) * 100)}%`, 28, 38);
ctx.restore();
}
function drawComboToast() {
const now = performance.now();
const age = now - (S.lastHitAt || 0);
if (age > 900 || S.combo <= 0) return;
ctx.save();
ctx.globalAlpha = 1 - age / 900;
ctx.fillStyle = "rgba(0,0,0,0.4)";
ctx.fillRect(18, 58, 220, 34);
ctx.fillStyle = "#ffd54a";
ctx.font = "bold 16px Arial";
ctx.fillText(`Nice! Combo ${S.combo}x`, 28, 80);
ctx.restore();
}
function draw() {
ctx.clearRect(0, 0, canvas.width, canvas.height);
drawField();
drawTargets();
drawQB();
drawBall();
drawAimLine();
drawComboToast();
}
function loop(now) {
if (!S.running) return;
const dt = now - S.lastTick;
S.lastTick = now;
// countdown
S.timeLeft -= dt / 1000;
if (S.timeLeft <= 0) {
S.timeLeft = 0;
updateHUD();
draw();
endGame();
return;
}
updateBall(dt);
updateTargets(dt);
checkHits();
updateHUD();
draw();
requestAnimationFrame(loop);
}
// Input
function getMousePos(e) {
const rect = canvas.getBoundingClientRect();
const scaleX = canvas.width / rect.width;
const scaleY = canvas.height / rect.height;
return {
x: (e.clientX - rect.left) * scaleX,
y: (e.clientY - rect.top) * scaleY,
};
}
canvas.addEventListener("mousedown", (e) => {
if (!S.running) return;
if (S.ball) return; // one ball at a time
const m = getMousePos(e);
const q = S.qb;
const d = Math.hypot(m.x - q.x, m.y - q.y);
if (d <= q.r + 18) {
S.aiming = true;
S.aimStart = { ...m };
S.aimNow = { ...m };
}
});
canvas.addEventListener("mousemove", (e) => {
if (!S.aiming) return;
S.aimNow = getMousePos(e);
draw();
});
canvas.addEventListener("mouseup", (e) => {
if (!S.aiming) return;
S.aiming = false;
const m = getMousePos(e);
const q = S.qb;
throwBall(q.x, q.y, m.x, m.y);
});
canvas.addEventListener("mouseleave", () => {
S.aiming = false;
});
// UI
ui.startBtn.addEventListener("click", async () => {
// unlock audio on some browsers
if (audioCtx && audioCtx.state === "suspended") {
try { await audioCtx.resume(); } catch {}
}
if (!S.running) startGame();
});
ui.resetBtn.addEventListener("click", () => resetGame());
ui.playAgain.addEventListener("click", () => {
ui.overlay.classList.add("hidden");
resetGame();
startGame();
});
ui.difficulty.addEventListener("change", () => {
const wasRunning = S.running;
resetGame();
if (wasRunning) startGame();
});
// Leaderboard
const LS_KEY = "qb_toss_scores_v1";
function loadScores() {
try {
const raw = localStorage.getItem(LS_KEY);
const parsed = raw ? JSON.parse(raw) : [];
return Array.isArray(parsed) ? parsed : [];
} catch {
return [];
}
}
function saveScore(s) {
const scores = loadScores();
scores.push({ score: s, date: new Date().toISOString() });
scores.sort((a, b) => b.score - a.score);
const top10 = scores.slice(0, 10);
localStorage.setItem(LS_KEY, JSON.stringify(top10));
}
function renderScores() {
const scores = loadScores();
ui.scores.innerHTML = "";
if (!scores.length) {
const li = document.createElement("li");
li.textContent = "No scores yet — play a round!";
ui.scores.appendChild(li);
return;
}
for (const s of scores) {
const li = document.createElement("li");
const d = new Date(s.date);
li.textContent = `${s.score} — ${d.toLocaleDateString()}`;
ui.scores.appendChild(li);
}
}
// Init
renderScores();
resetGame();
draw();
