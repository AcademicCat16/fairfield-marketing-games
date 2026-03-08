const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const statusLabel = document.getElementById('status');
const resetBtn = document.getElementById('reset-btn');
const ROWS = 6;
const COLS = 7;
const SQUARE_SIZE = 70;
const RADIUS = SQUARE_SIZE / 2 - 6;
// Green and Pink Colors
const COLOR_BG = "#1a1a1a";
const COLOR_BOARD = "#2c3e50";
const COLOR_P1 = "#39FF14"; // Green
const COLOR_P2 = "#FF69B4"; // Pink
canvas.width = COLS * SQUARE_SIZE;
canvas.height = (ROWS + 1) * SQUARE_SIZE;
let board = [];
let turn = 0;
let gameOver = false;
function initBoard() {
board = [];
for (let r = 0; r < ROWS; r++) {
board[r] = new Array(COLS).fill(0);
}
}
function drawBoard() {
ctx.fillStyle = COLOR_BG;
ctx.fillRect(0, 0, canvas.width, canvas.height);
for (let c = 0; c < COLS; c++) {
for (let r = 0; r < ROWS; r++) {
ctx.fillStyle = COLOR_BOARD;
ctx.fillRect(c * SQUARE_SIZE, (r + 1) * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
ctx.beginPath();
ctx.arc(
c * SQUARE_SIZE + SQUARE_SIZE / 2,
(r + 1) * SQUARE_SIZE + SQUARE_SIZE / 2,
RADIUS, 0, Math.PI * 2
);
if (board[r][c] === 0) ctx.fillStyle = COLOR_BG;
else if (board[r][c] === 1) ctx.fillStyle = COLOR_P1;
else if (board[r][c] === 2) ctx.fillStyle = COLOR_P2;
ctx.fill();
ctx.closePath();
}
}
}
function getNextOpenRow(col) {
for (let r = ROWS - 1; r >= 0; r--) {
if (board[r][col] === 0) return r;
}
return -1;
}
// Rewritten Win Check to prevent "Infinite Loop" detection
function checkWin(p) {
// 1. Horizontal
for (let r = 0; r < ROWS; r++) {
for (let c = 0; c < COLS - 3; c++) {
if (board[r][c] === p && board[r][c+1] === p && board[r][c+2] === p && board[r][c+3] === p) return true;
}
}
// 2. Vertical
for (let c = 0; c < COLS; c++) {
for (let r = 0; r < ROWS - 3; r++) {
if (board[r][c] === p && board[r+1][c] === p && board[r+2][c] === p && board[r+3][c] === p) return true;
}
}
// 3. Diagonal Up-Right
for (let r = 3; r < ROWS; r++) {
for (let c = 0; c < COLS - 3; c++) {
if (board[r][c] === p && board[r-1][c+1] === p && board[r-2][c+2] === p && board[r-3][c+3] === p) return true;
}
}
// 4. Diagonal Down-Right
for (let r = 0; r < ROWS - 3; r++) {
for (let c = 0; c < COLS - 3; c++) {
if (board[r][c] === p && board[r+1][c+1] === p && board[r+2][c+2] === p && board[r+3][c+3] === p) return true;
}
}
return false;
}
canvas.addEventListener('mousedown', (e) => {
if (gameOver) return;
const rect = canvas.getBoundingClientRect();
const scaleX = canvas.width / rect.width;
const x = (e.clientX - rect.left) * scaleX;
const col = Math.floor(x / SQUARE_SIZE);
if (col >= 0 && col < COLS) {
const row = getNextOpenRow(col);
if (row !== -1) {
const piece = (turn === 0) ? 1 : 2;
board[row][col] = piece;
if (checkWin(piece)) {
statusLabel.innerText = `PLAYER ${piece === 1 ? 'GREEN' : 'PINK'} WINS!`;
statusLabel.style.color = (piece === 1) ? COLOR_P1 : COLOR_P2;
gameOver = true;
} else {
turn = (turn === 0) ? 1 : 0;
statusLabel.innerText = `Player ${turn + 1}'s Turn (${turn === 0 ? 'Green' : 'Pink'})`;
statusLabel.style.color = (turn === 0) ? COLOR_P1 : COLOR_P2;
}
drawBoard();
}
}
});
resetBtn.addEventListener('click', () => {
initBoard();
turn = 0;
gameOver = false;
statusLabel.innerText = "Player 1's Turn (Green)";
statusLabel.style.color = COLOR_P1;
drawBoard();
});
// Initial Start
initBoard();
drawBoard();
