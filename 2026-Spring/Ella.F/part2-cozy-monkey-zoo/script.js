const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const visitorsEl = document.getElementById("visitors");
const startOverlay = document.getElementById("startOverlay");
const winOverlay = document.getElementById("winOverlay");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const world = {
width: canvas.width,
height: canvas.height,
score: 0,
visitorsHelped: 0,
goal: 5,
started: false,
won: false,
sparkleTime: 0,
message: "Take a peaceful walk through the zoo."
};
const keys = {};
const player = {
x: 140,
y: 350,
speed: 2.5,
facing: 1,
bob: 0
};
const ponds = [
{ x: 630, y: 120, w: 180, h: 88 },
{ x: 120, y: 110, w: 160, h: 70 }
];
const fences = [
{ x: 40, y: 70, w: 880, h: 12 },
{ x: 40, y: 458, w: 880, h: 12 },
{ x: 40, y: 70, w: 12, h: 400 },
{ x: 908, y: 70, w: 12, h: 400 },
{ x: 355, y: 82, w: 12, h: 120 },
{ x: 355, y: 318, w: 12, h: 140 },
{ x: 595, y: 82, w: 12, h: 100 },
{ x: 595, y: 290, w: 12, h: 168 }
];
const plushies = [
{ x: 120, y: 430, collected: false },
{ x: 290, y: 250, collected: false },
{ x: 510, y: 410, collected: false },
{ x: 700, y: 260, collected: false },
{ x: 850, y: 410, collected: false }
];
const visitors = [
{ x: 220, y: 185, helped: false, pulse: 0 },
{ x: 465, y: 145, helped: false, pulse: 0 },
{ x: 760, y: 380, helped: false, pulse: 0 }
];
const flowers = Array.from({ length: 28 }, (_, i) => ({
x: 70 + (i * 31) % 820,
y: 95 + (i * 53) % 330,
size: 5 + (i % 3)
}));
document.addEventListener("keydown", function (e) {
keys[e.key.toLowerCase()] = true;
if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(e.key.toLowerCase())) {
e.preventDefault();
}
});
document.addEventListener("keyup", function (e) {
keys[e.key.toLowerCase()] = false;
});
startBtn.addEventListener("click", function () {
world.started = true;
startOverlay.style.display = "none";
});
restartBtn.addEventListener("click", function () {
resetGame();
world.started = true;
});
function resetGame() {
world.score = 0;
world.visitorsHelped = 0;
world.won = false;
world.sparkleTime = 0;
world.message = "Take a peaceful walk through the zoo.";
player.x = 140;
player.y = 350;
player.facing = 1;
plushies.forEach(function (p) {
p.collected = false;
});
visitors.forEach(function (v) {
v.helped = false;
v.pulse = 0;
});
updateUI();
winOverlay.style.display = "none";
}
function updateUI() {
scoreEl.textContent = world.score;
visitorsEl.textContent = world.visitorsHelped;
}
function clamp(value, min, max) {
return Math.max(min, Math.min(max, value));
}
function circleRectCollision(cx, cy, radius, rect) {
const closestX = clamp(cx, rect.x, rect.x + rect.w);
const closestY = clamp(cy, rect.y, rect.y + rect.h);
const dx = cx - closestX;
const dy = cy - closestY;
return dx * dx + dy * dy < radius * radius;
}
function movePlayer() {
let dx = 0;
let dy = 0;
if (keys["arrowleft"] || keys["a"]) dx -= player.speed;
if (keys["arrowright"] || keys["d"]) dx += player.speed;
if (keys["arrowup"] || keys["w"]) dy -= player.speed;
if (keys["arrowdown"] || keys["s"]) dy += player.speed;
if (dx !== 0 || dy !== 0) {
const mag = Math.hypot(dx, dy) || 1;
dx = (dx / mag) * player.speed;
dy = (dy / mag) * player.speed;
}
if (dx > 0) player.facing = 1;
if (dx < 0) player.facing = -1;
let nextX = clamp(player.x + dx, 60, world.width - 60);
let nextY = clamp(player.y + dy, 90, world.height - 70);
const hitRadius = 18;
fences.forEach(function (rect) {
if (circleRectCollision(nextX, player.y, hitRadius, rect)) {
nextX = player.x;
}
if (circleRectCollision(player.x, nextY, hitRadius, rect)) {
nextY = player.y;
}
});
ponds.forEach(function (pond) {
if (circleRectCollision(nextX, nextY, hitRadius + 4, pond)) {
nextX = player.x;
nextY = player.y;
}
});
player.x = nextX;
player.y = nextY;
player.bob += (dx !== 0 || dy !== 0) ? 0.16 : 0.05;
}
function updateGame() {
if (!world.started || world.won) return;
movePlayer();
world.sparkleTime += 0.04;
plushies.forEach(function (plush) {
if (!plush.collected) {
const dist = Math.hypot(player.x - plush.x, player.y - plush.y);
if (dist < 34) {
plush.collected = true;
world.score += 1;
world.message = "You found a stuffed monkey friend!";
updateUI();
}
}
});
visitors.forEach(function (visitor) {
visitor.pulse += 0.05;
if (!visitor.helped) {
const dist = Math.hypot(player.x - visitor.x, player.y - visitor.y);
if (dist < 55) {
visitor.helped = true;
world.visitorsHelped += 1;
world.message = "A visitor smiled when they saw your plush monkey.";
updateUI();
}
}
});
if (world.score === world.goal && world.visitorsHelped === visitors.length) {
world.won = true;
winOverlay.style.display = "flex";
}
}
function drawRoundedRect(x, y, w, h, r, fillStyle) {
ctx.fillStyle = fillStyle;
ctx.beginPath();
ctx.moveTo(x + r, y);
ctx.lineTo(x + w - r, y);
ctx.quadraticCurveTo(x + w, y, x + w, y + r);
ctx.lineTo(x + w, y + h - r);
ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
ctx.lineTo(x + r, y + h);
ctx.quadraticCurveTo(x, y + h, x, y + h - r);
ctx.lineTo(x, y + r);
ctx.quadraticCurveTo(x, y, x + r, y);
ctx.closePath();
ctx.fill();
}
function drawTree(x, y) {
ctx.fillStyle = "#7c5636";
ctx.fillRect(x - 8, y + 20, 16, 32);
ctx.fillStyle = "#60ab5a";
ctx.beginPath();
ctx.arc(x, y + 10, 28, 0, Math.PI * 2);
ctx.fill();
ctx.beginPath();
ctx.arc(x - 22, y + 18, 18, 0, Math.PI * 2);
ctx.fill();
ctx.beginPath();
ctx.arc(x + 22, y + 18, 18, 0, Math.PI * 2);
ctx.fill();
}
function drawFlower(x, y, size) {
ctx.fillStyle = "#7dbb62";
ctx.fillRect(x - 1, y, 2, 8);
const petals = ["#ffd6e8", "#fff3a8", "#f8d7ff"];
for (let i = 0; i < 4; i++) {
ctx.fillStyle = petals[(x + i) % petals.length];
ctx.beginPath();
ctx.arc(x + Math.cos(i * Math.PI / 2) * 4, y, size / 2, 0, Math.PI * 2);
ctx.fill();
}
ctx.fillStyle = "#ffcc5c";
ctx.beginPath();
ctx.arc(x, y, size / 2.3, 0, Math.PI * 2);
ctx.fill();
}
function drawSign(x, y, text) {
ctx.fillStyle = "#7c5636";
ctx.fillRect(x, y, 8, 30);
drawRoundedRect(x - 28, y - 24, 92, 28, 10, "#fff3d8");
ctx.fillStyle = "#5c4026";
ctx.font = "12px Arial";
ctx.fillText(text, x - 19, y - 7);
}
function drawStuffedMonkey(x, y, scale, isSmall) {
scale = scale || 1;
isSmall = isSmall || false;
ctx.save();
ctx.translate(x, y);
ctx.scale(scale, scale);
const body = isSmall ? "#ee9b43" : "#f09d48";
const belly = "#ffd39b";
const outline = "#8b5d2f";
ctx.strokeStyle = outline;
ctx.lineWidth = 3;
ctx.fillStyle = body;
ctx.beginPath();
ctx.ellipse(0, 12, 20, 24, 0, 0, Math.PI * 2);
ctx.fill();
ctx.stroke();
ctx.beginPath();
ctx.arc(0, -16, 18, 0, Math.PI * 2);
ctx.fill();
ctx.stroke();
ctx.beginPath();
ctx.arc(-14, -28, 8, 0, Math.PI * 2);
ctx.arc(14, -28, 8, 0, Math.PI * 2);
ctx.fill();
ctx.stroke();
ctx.fillStyle = belly;
ctx.beginPath();
ctx.ellipse(0, 14, 10, 14, 0, 0, Math.PI * 2);
ctx.fill();
ctx.stroke();
ctx.beginPath();
ctx.ellipse(0, -12, 10, 8, 0, 0, Math.PI * 2);
ctx.fill();
ctx.stroke();
ctx.fillStyle = body;
ctx.beginPath();
ctx.ellipse(-19, 8, 6, 15, -0.4, 0, Math.PI * 2);
ctx.ellipse(19, 8, 6, 15, 0.4, 0, Math.PI * 2);
ctx.fill();
ctx.stroke();
ctx.beginPath();
ctx.ellipse(-8, 33, 6, 12, 0.1, 0, Math.PI * 2);
ctx.ellipse(8, 33, 6, 12, -0.1, 0, Math.PI * 2);
ctx.fill();
ctx.stroke();
ctx.fillStyle = "#352113";
ctx.beginPath();
ctx.arc(-5, -18, 2, 0, Math.PI * 2);
ctx.arc(5, -18, 2, 0, Math.PI * 2);
ctx.fill();
ctx.beginPath();
ctx.arc(0, -11, 1.8, 0, Math.PI * 2);
ctx.fill();
ctx.strokeStyle = "#352113";
ctx.lineWidth = 2;
ctx.beginPath();
ctx.arc(0, -9, 4, 0.2, Math.PI - 0.2);
ctx.stroke();
ctx.restore();
}
function drawVisitor(v) {
const bounce = Math.sin(v.pulse) * 1.8;
ctx.save();
ctx.translate(v.x, v.y + bounce);
ctx.fillStyle = v.helped ? "#ffe89d" : "#dce8ff";
ctx.beginPath();
ctx.arc(0, -18, 11, 0, Math.PI * 2);
ctx.fill();
drawRoundedRect(-12, -6, 24, 30, 10, v.helped ? "#ffb870" : "#9db8ff");
ctx.strokeStyle = "#6c4a2a";
ctx.lineWidth = 3;
ctx.beginPath();
ctx.moveTo(-8, 24);
ctx.lineTo(-10, 40);
ctx.moveTo(8, 24);
ctx.lineTo(10, 40);
ctx.moveTo(-12, 2);
ctx.lineTo(-24, 16);
ctx.moveTo(12, 2);
ctx.lineTo(24, 16);
ctx.stroke();
if (v.helped) {
ctx.fillStyle = "#ff8ab1";
ctx.beginPath();
ctx.arc(-20, -28, 5, 0, Math.PI * 2);
ctx.fill();
ctx.beginPath();
ctx.arc(20, -28, 5, 0, Math.PI * 2);
ctx.fill();
}
ctx.restore();
}
function drawPlush(plush) {
if (plush.collected) return;
const bob = Math.sin(world.sparkleTime * 2 + plush.x * 0.02) * 4;
const glow = 12 + Math.sin(world.sparkleTime * 3 + plush.y * 0.02) * 4;
ctx.save();
ctx.translate(plush.x, plush.y + bob);
ctx.fillStyle = "rgba(255, 211, 122, 0.24)";
ctx.beginPath();
ctx.arc(0, 0, 24 + glow * 0.2, 0, Math.PI * 2);
ctx.fill();
drawStuffedMonkey(0, 0, 0.7, true);
ctx.restore();
}
function drawPlayer() {
const bob = Math.sin(player.bob) * 2.5;
ctx.save();
ctx.translate(player.x, player.y + bob);
ctx.scale(player.facing, 1);
ctx.strokeStyle = "#7a5431";
ctx.lineWidth = 5;
ctx.beginPath();
ctx.arc(-18, 8, 18, 1.2, 5.2);
ctx.stroke();
ctx.fillStyle = "#8b5e37";
ctx.strokeStyle = "#5b3b23";
ctx.lineWidth = 3;
ctx.beginPath();
ctx.ellipse(0, 10, 20, 23, 0, 0, Math.PI * 2);
ctx.fill();
ctx.stroke();
ctx.beginPath();
ctx.arc(0, -18, 19, 0, Math.PI * 2);
ctx.fill();
ctx.stroke();
ctx.beginPath();
ctx.arc(-14, -31, 8, 0, Math.PI * 2);
ctx.arc(14, -31, 8, 0, Math.PI * 2);
ctx.fill();
ctx.stroke();
ctx.fillStyle = "#d9af82";
ctx.beginPath();
ctx.ellipse(0, 12, 10, 13, 0, 0, Math.PI * 2);
ctx.fill();
ctx.stroke();
ctx.beginPath();
ctx.ellipse(0, -14, 11, 9, 0, 0, Math.PI * 2);
ctx.fill();
ctx.stroke();
ctx.fillStyle = "#2f2013";
ctx.beginPath();
ctx.arc(-5, -20, 2.1, 0, Math.PI * 2);
ctx.arc(5, -20, 2.1, 0, Math.PI * 2);
ctx.fill();
ctx.beginPath();
ctx.arc(0, -14, 2, 0, Math.PI * 2);
ctx.fill();
ctx.strokeStyle = "#2f2013";
ctx.lineWidth = 2;
ctx.beginPath();
ctx.arc(0, -12, 4.2, 0.2, Math.PI - 0.2);
ctx.stroke();
ctx.strokeStyle = "#5b3b23";
ctx.lineWidth = 5;
ctx.beginPath();
ctx.moveTo(-12, 8);
ctx.lineTo(-24, 22);
ctx.moveTo(12, 8);
ctx.lineTo(20, 16);
ctx.moveTo(-8, 30);
ctx.lineTo(-12, 44);
ctx.moveTo(8, 30);
ctx.lineTo(10, 44);
ctx.stroke();
ctx.save();
ctx.translate(22, 12);
ctx.rotate(-0.12);
drawStuffedMonkey(0, 0, 0.95, false);
ctx.restore();
ctx.restore();
}
function drawBackground() {
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "#98cb73";
ctx.fillRect(0, 220, canvas.width, 320);
drawRoundedRect(65, 250, 830, 72, 36, "#e6c69b");
drawRoundedRect(310, 105, 70, 335, 28, "#e6c69b");
drawRoundedRect(550, 105, 70, 335, 28, "#e6c69b");
ponds.forEach(function (pond) {
drawRoundedRect(pond.x, pond.y, pond.w, pond.h, 40, "#7fd4ef");
drawRoundedRect(pond.x + 10, pond.y + 10, pond.w - 20, pond.h - 20, 34, "#9de6fa");
});
const trees = [
[92, 128], [175, 82], [246, 154], [436, 92], [671, 92],
[820, 150], [848, 96], [745, 455], [130, 470]
];
trees.forEach(function (tree) {
drawTree(tree[0], tree[1]);
});
fences.forEach(function (f) {
ctx.fillStyle = "#9a744f";
ctx.fillRect(f.x, f.y, f.w, f.h);
});
flowers.forEach(function (f) {
drawFlower(f.x, f.y, f.size);
});
drawSign(130, 235, "Monkey Walk");
drawSign(620, 235, "Plush Corner");
drawRoundedRect(16, 12, 370, 52, 18, "rgba(255,250,240,0.9)");
ctx.fillStyle = "#5b4027";
ctx.font = "16px Arial";
ctx.fillText(world.message, 32, 43);
}
function draw() {
drawBackground();
plushies.forEach(drawPlush);
visitors.forEach(drawVisitor);
drawPlayer();
}
function loop() {
updateGame();
draw();
requestAnimationFrame(loop);
}
resetGame();
draw();
loop();
