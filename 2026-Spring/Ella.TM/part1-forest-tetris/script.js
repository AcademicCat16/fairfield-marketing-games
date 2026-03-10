const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");
const COLS = 10;
const ROWS = 20;
const BLOCK = 30;
context.scale(BLOCK, BLOCK);
const colors = [
null,
"#2D6A4F",
"#40916C",
"#74C69D",
"#6D4C41",
"#5D4037",
"#FFB703",
"#90CAF9"
];
function createMatrix(w, h) {
const matrix = [];
while (h--) matrix.push(new Array(w).fill(0));
return matrix;
}
function createPiece(type) {
if (type === "T") {
return [
[0, 1, 0],
[1, 1, 1],
[0, 0, 0]
];
} else if (type === "O") {
return [
[2, 2],
[2, 2]
];
} else if (type === "L") {
return [
[0, 0, 3],
[3, 3, 3],
[0, 0, 0]
];
} else if (type === "J") {
return [
[4, 0, 0],
[4, 4, 4],
[0, 0, 0]
];
} else if (type === "I") {
return [
[0, 5, 0, 0],
[0, 5, 0, 0],
[0, 5, 0, 0],
[0, 5, 0, 0]
];
} else if (type === "S") {
return [
[0, 6, 6],
[6, 6, 0],
[0, 0, 0]
];
} else if (type === "Z") {
return [
[7, 7, 0],
[0, 7, 7],
[0, 0, 0]
];
}
}
function collide(arena, player) {
const [m, o] = [player.matrix, player.pos];
for (let y = 0; y < m.length; ++y) {
for (let x = 0; x < m[y].length; ++x) {
if (m[y][x] !== 0 &&
(arena[y + o.y] &&
arena[y + o.y][x + o.x]) !== 0) {
return true;
}
}
}
return false;
}
function merge(arena, player) {
player.matrix.forEach((row, y) => {
row.forEach((value, x) => {
if (value !== 0) {
arena[y + player.pos.y][x + player.pos.x] = value;
}
});
});
}
function rotate(matrix) {
for (let y = 0; y < matrix.length; ++y) {
for (let x = 0; x < y; ++x) {
[matrix[x][y], matrix[y][x]] =
[matrix[y][x], matrix[x][y]];
}
}
matrix.forEach(row => row.reverse());
}
function playerDrop() {
player.pos.y++;
if (collide(arena, player)) {
player.pos.y--;
merge(arena, player);
playerReset();
arenaSweep();
}
dropCounter = 0;
}
function playerMove(dir) {
player.pos.x += dir;
if (collide(arena, player)) {
player.pos.x -= dir;
}
}
function playerRotate() {
rotate(player.matrix);
if (collide(arena, player)) {
rotate(player.matrix);
rotate(player.matrix);
rotate(player.matrix);
}
}
function playerReset() {
const pieces = "TJLOSZI";
player.matrix = createPiece(
pieces[Math.floor(Math.random() * pieces.length)]
);
player.pos.y = 0;
player.pos.x =
(arena[0].length / 2 | 0) -
(player.matrix[0].length / 2 | 0);
if (collide(arena, player)) {
arena.forEach(row => row.fill(0));
}
}
function arenaSweep() {
outer: for (let y = arena.length - 1; y >= 0; --y) {
for (let x = 0; x < arena[y].length; ++x) {
if (arena[y][x] === 0) continue outer;
}
const row = arena.splice(y, 1)[0].fill(0);
arena.unshift(row);
++y;
}
}
function drawMatrix(matrix, offset) {
matrix.forEach((row, y) => {
row.forEach((value, x) => {
if (value !== 0) {
context.fillStyle = colors[value];
context.fillRect(
x + offset.x,
y + offset.y,
1,
1
);
}
});
});
}
function draw() {
context.fillStyle = "#F1FAEE";
context.fillRect(0, 0, canvas.width, canvas.height);
drawMatrix(arena, {x:0, y:0});
drawMatrix(player.matrix, player.pos);
}
let dropCounter = 0;
let dropInterval = 700;
let lastTime = 0;
function update(time = 0) {
const delta = time - lastTime;
lastTime = time;
dropCounter += delta;
if (dropCounter > dropInterval) {
playerDrop();
}
draw();
requestAnimationFrame(update);
}
document.addEventListener("keydown", event => {
if (event.key === "ArrowLeft") playerMove(-1);
if (event.key === "ArrowRight") playerMove(1);
if (event.key === "ArrowDown") playerDrop();
if (event.key === "ArrowUp") playerRotate();
});
const arena = createMatrix(COLS, ROWS);
const player = {
pos: {x: 0, y: 0},
matrix: null
};
playerReset();
update();
