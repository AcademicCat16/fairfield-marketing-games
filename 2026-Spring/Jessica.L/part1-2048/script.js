const size = 4;
let board = [];
const gameEl = document.getElementById("game");

// Build the 16 cells in JS instead of hardcoding them in HTML
function buildGrid() {
  gameEl.innerHTML = "";
  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    gameEl.appendChild(cell);
  }
}

function getCells() {
  return document.querySelectorAll(".cell");
}

function init() {
  buildGrid();
  board = Array(size * size).fill(0);
  addRandomTile();
  addRandomTile();
  updateBoard();
}

function addRandomTile() {
  const empty = board
    .map((val, i) => (val === 0 ? i : null))
    .filter(val => val !== null);
  if (empty.length === 0) return;
  const randomIndex = empty[Math.floor(Math.random() * empty.length)];
  board[randomIndex] = Math.random() < 0.9 ? 2 : 4;
}

function updateBoard() {
  const cells = getCells();
  board.forEach((value, i) => {
    cells[i].textContent = value === 0 ? "" : value;
    cells[i].className = "cell";
    if (value) cells[i].classList.add("tile-" + value);
    if (value > 2048) cells[i].classList.add("tile-super");
  });
}

function slide(row) {
  row = row.filter(val => val);
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
    }
  }
  row = row.filter(val => val);
  while (row.length < size) row.push(0);
  return row;
}

function moveLeft() {
  for (let r = 0; r < size; r++) {
    let row = board.slice(r * size, r * size + size);
    row = slide(row);
    for (let c = 0; c < size; c++) {
      board[r * size + c] = row[c];
    }
  }
}

function rotateBoard() {
  const newBoard = Array(size * size).fill(0);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      newBoard[c * size + (size - r - 1)] = board[r * size + c];
    }
  }
  board = newBoard;
}

document.addEventListener("keydown", e => {
  const before = JSON.stringify(board);

  if (e.key === "ArrowLeft")  { moveLeft(); }
  if (e.key === "ArrowRight") { rotateBoard(); rotateBoard(); moveLeft(); rotateBoard(); rotateBoard(); }
  if (e.key === "ArrowUp")    { rotateBoard(); rotateBoard(); rotateBoard(); moveLeft(); rotateBoard(); }
  if (e.key === "ArrowDown")  { rotateBoard(); moveLeft(); rotateBoard(); rotateBoard(); rotateBoard(); }

  if (JSON.stringify(board) !== before) {
    addRandomTile();
    updateBoard();
  }
});

init();
