const board = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score");
const restartBtn = document.getElementById("restart");
let score = 0;
let grid = [];
const size = 4;
// Fruit mapping
const fruitMap = {
2: "🍒",
4: "🍓",
8: "🍊",
16: "🍎",
32: "🍍",
64: "🥭",
128: "🍉",
256: "🍇",
512: "🥝",
1024: "🍌",
2048: "🥥"
};
function createBoard() {
board.innerHTML = "";
grid = [];
for (let i = 0; i < size * size; i++) {
grid.push(0);
const tile = document.createElement("div");
tile.classList.add("tile");
board.appendChild(tile);
}
addTile();
addTile();
updateBoard();
}
function addTile() {
let empty = grid
.map((val, idx) => (val === 0 ? idx : null))
.filter(val => val !== null);
if (empty.length === 0) return;
let randomIndex = empty[Math.floor(Math.random() * empty.length)];
grid[randomIndex] = 2;
}
function updateBoard() {
const tiles = document.querySelectorAll(".tile");
tiles.forEach((tile, i) => {
tile.textContent = grid[i] ? fruitMap[grid[i]] : "";
});
scoreDisplay.textContent = score;
}
function slide(row) {
row = row.filter(val => val);
for (let i = 0; i < row.length - 1; i++) {
if (row[i] === row[i + 1]) {
row[i] *= 2;
score += row[i];
row[i + 1] = 0;
}
}
row = row.filter(val => val);
while (row.length < size) {
row.push(0);
}
return row;
}
function moveLeft() {
for (let i = 0; i < size; i++) {
let row = grid.slice(i * size, i * size + size);
row = slide(row);
for (let j = 0; j < size; j++) {
grid[i * size + j] = row[j];
}
}
}
function moveRight() {
for (let i = 0; i < size; i++) {
let row = grid.slice(i * size, i * size + size).reverse();
row = slide(row);
row.reverse();
for (let j = 0; j < size; j++) {
grid[i * size + j] = row[j];
}
}
}
function moveUp() {
for (let i = 0; i < size; i++) {
let col = [];
for (let j = 0; j < size; j++) {
col.push(grid[j * size + i]);
}
col = slide(col);
for (let j = 0; j < size; j++) {
grid[j * size + i] = col[j];
}
}
}
function moveDown() {
for (let i = 0; i < size; i++) {
let col = [];
for (let j = 0; j < size; j++) {
col.push(grid[j * size + i]);
}
col.reverse();
col = slide(col);
col.reverse();
for (let j = 0; j < size; j++) {
grid[j * size + i] = col[j];
}
}
}
document.addEventListener("keydown", e => {
switch (e.key) {
case "ArrowLeft":
moveLeft();
break;
case "ArrowRight":
moveRight();
break;
case "ArrowUp":
moveUp();
break;
case "ArrowDown":
moveDown();
break;
}
addTile();
updateBoard();
});
restartBtn.addEventListener("click", () => {
score = 0;
createBoard();
});
createBoard();document.getElementsByTagName("h1")[0].style.fontSize = "6vw";





