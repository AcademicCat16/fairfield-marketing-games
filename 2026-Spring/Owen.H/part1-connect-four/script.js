const grid = document.getElementById("grid")
const result = document.getElementById("result")
const displayCurrentPlayer = document.getElementById("current-player")
const rows = 6
const cols = 7
let board = []
let currentPlayer = "red"
let gameOver = false
// Create board
for (let r = 0; r < rows; r++) {
board[r] = []
for (let c = 0; c < cols; c++) {
board[r][c] = ""
const cell = document.createElement("div")
cell.classList.add("cell")
cell.dataset.row = r
cell.dataset.col = c
grid.appendChild(cell)
}
}
const cells = document.querySelectorAll(".cell")
cells.forEach(cell => {
cell.addEventListener("click", () => {
if (gameOver) return
const col = parseInt(cell.dataset.col)
// Drop piece from bottom up
for (let r = rows - 1; r >= 0; r--) {
if (board[r][col] === "") {
board[r][col] = currentPlayer
updateBoard()
if (checkWin()) {
result.textContent = currentPlayer.toUpperCase() + " WINS!"
gameOver = true
} else {
currentPlayer = currentPlayer === "red" ? "yellow" : "red"
displayCurrentPlayer.textContent =
currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)
}
break
}
}
})
})
function updateBoard() {
cells.forEach(cell => {
const r = cell.dataset.row
const c = cell.dataset.col
cell.classList.remove("red", "yellow")
if (board[r][c]) {
cell.classList.add(board[r][c])
}
})
}
function checkWin() {
for (let r = 0; r < rows; r++) {
for (let c = 0; c < cols; c++) {
if (
checkDirection(r, c, 0, 1) || // horizontal
checkDirection(r, c, 1, 0) || // vertical
checkDirection(r, c, 1, 1) || // diagonal right
checkDirection(r, c, 1, -1) // diagonal left
) {
return true
}
}
}
return false
}
function checkDirection(r, c, dr, dc) {
let count = 0
for (let i = 0; i < 4; i++) {
const row = r + dr * i
const col = c + dc * i
if (
row >= 0 &&
row < rows &&
col >= 0 &&
col < cols &&
board[row][col] === currentPlayer
) {
count++
}
}
return count === 4
}
