let size = 16;
let totalBombs = 40;
let board = [];
let firstClick = true;
let timerId = null;
let elapsedTime = 0;
let bombCount = 0;
let hitBomb = false;
let winner = false;
const boardEl = document.getElementById("board");
const colors = [
"", "blue", "green", "red", "navy",
"maroon", "teal", "black", "gray"
];
/* ---------- EVENT LISTENERS ---------- */
document.querySelectorAll("[data-size]").forEach(btn => {
btn.addEventListener("click", () => {
size = parseInt(btn.dataset.size);
totalBombs = size === 9 ? 10 : size === 16 ? 40 : 160;
init();
});
});
document.getElementById("custom-start").addEventListener("click", () => {
const newSize = parseInt(document.getElementById("custom-size").value);
const newBombs = parseInt(document.getElementById("custom-bombs").value);
if (!newSize || !newBombs || newBombs >= newSize * newSize) return;
size = newSize;
totalBombs = newBombs;
init();
});
document.getElementById("reset").addEventListener("click", init);
/* ---------- INIT ---------- */
function init() {
board = [];
firstClick = true;
elapsedTime = 0;
hitBomb = false;
winner = false;
clearInterval(timerId);
timerId = null;
document.getElementById("timer").textContent = "000";
buildBoard();
}
/* ---------- BUILD BOARD ---------- */
function buildBoard() {
boardEl.innerHTML = "";
for (let r = 0; r < size; r++) {
const row = [];
const tr = document.createElement("tr");
for (let c = 0; c < size; c++) {
const td = document.createElement("td");
td.dataset.row = r;
td.dataset.col = c;
td.addEventListener("click", handleClick);
td.addEventListener("contextmenu", e => {
e.preventDefault();
handleFlag(td);
});
tr.appendChild(td);
row.push(new Cell(r, c));
}
board.push(row);
boardEl.appendChild(tr);
}
bombCount = totalBombs;
updateBombCounter();
}
/* ---------- CLICK HANDLING ---------- */
function handleClick(e) {
if (winner || hitBomb) return;
const td = e.target;
const r = parseInt(td.dataset.row);
const c = parseInt(td.dataset.col);
const cell = board[r][c];
if (firstClick) {
placeBombsSafe(r, c);
calculateAdj();
startTimer();
firstClick = false;
}
if (cell.flagged) return;
hitBomb = cell.reveal();
render();
if (hitBomb) {
td.style.animation = "shake 0.3s";
document.getElementById("reset").textContent = "😵";
clearInterval(timerId);
}
winner = checkWin();
if (winner) {
document.getElementById("reset").textContent = "😎";
clearInterval(timerId);
}
}
function handleFlag(td) {
const r = td.dataset.row;
const c = td.dataset.col;
const cell = board[r][c];
if (cell.revealed) return;
cell.flagged = !cell.flagged;
bombCount += cell.flagged ? -1 : 1;
render();
updateBombCounter();
}
/* ---------- BOMB LOGIC ---------- */
function placeBombsSafe(fr, fc) {
let bombs = totalBombs;
while (bombs > 0) {
let r = Math.floor(Math.random() * size);
let c = Math.floor(Math.random() * size);
let cell = board[r][c];
let firstCell = (r === fr && c === fc);
let adjacent = board[fr][fc].getAdjCells().includes(cell);
if (!cell.bomb && !firstCell && !adjacent) {
cell.bomb = true;
bombs--;
}
}
}
function calculateAdj() {
board.flat().forEach(cell => cell.calcAdjBombs());
}
/* ---------- TIMER ---------- */
function startTimer() {
timerId = setInterval(() => {
elapsedTime++;
document.getElementById("timer").textContent =
elapsedTime.toString().padStart(3, "0");
}, 1000);
}
/* ---------- RENDER ---------- */
function render() {
board.flat().forEach(cell => {
const td = document.querySelector(
`[data-row='${cell.row}'][data-col='${cell.col}']`
);
td.classList.remove("revealed");
if (cell.flagged) {
td.textContent = "🚩";
} else if (cell.revealed) {
td.classList.add("revealed");
if (cell.bomb) {
td.textContent = "💣";
} else if (cell.adjBombs > 0) {
td.style.color = colors[cell.adjBombs] || "purple";
td.textContent = cell.adjBombs;
} else {
td.textContent = "";
}
} else {
td.textContent = "";
}
});
}
function updateBombCounter() {
document.getElementById("bomb-counter").textContent =
bombCount.toString().padStart(3, "0");
}
/* ---------- WIN CHECK ---------- */
function checkWin() {
return board.flat().every(cell =>
cell.bomb ? true : cell.revealed
);
}
/* ---------- CELL CLASS ---------- */
class Cell {
constructor(row, col) {
this.row = row;
this.col = col;
this.bomb = false;
this.revealed = false;
this.flagged = false;
// 15% chance of being a "super tile"
this.superTile = Math.random() < 0.15;
}
getAdjCells() {
let adj = [];
let radius = this.superTile ? 2 : 1;
for (let r = -radius; r <= radius; r++) {
for (let c = -radius; c <= radius; c++) {
if (r === 0 && c === 0) continue;
let newRow = this.row + r;
let newCol = this.col + c;
if (
newRow >= 0 && newRow < size &&
newCol >= 0 && newCol < size
) {
adj.push(board[newRow][newCol]);
}
}
}
return adj;
}
calcAdjBombs() {
this.adjBombs = this.getAdjCells()
.reduce((acc, cell) => acc + (cell.bomb ? 1 : 0), 0);
}
reveal() {
if (this.revealed) return false;
this.revealed = true;
if (this.bomb) return true;
if (this.adjBombs === 0) {
this.getAdjCells().forEach(cell => {
if (!cell.revealed) cell.reveal();
});
}
return false;
}
}
/* ---------- START GAME ---------- */
init();
