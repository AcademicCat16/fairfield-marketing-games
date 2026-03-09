const SIZE = 4;
const gridEl        = document.getElementById("grid");
const tilesEl       = document.getElementById("tiles");
const scoreEl       = document.getElementById("score");
const bestEl        = document.getElementById("best");
const overlayEl     = document.getElementById("overlay");
const overlayTitleEl= document.getElementById("overlayTitle");
const overlayTextEl = document.getElementById("overlayText");
const boardEl       = document.getElementById("board");

let grid = [];
let score = 0;
let best = 0; // localStorage not available in CodePen — stored in memory
let wonShown = false;

bestEl.textContent = best;

// Build static background cells
for (let i = 0; i < SIZE * SIZE; i++) {
  const c = document.createElement("div");
  c.className = "cell";
  gridEl.appendChild(c);
}

function emptyGrid() {
  grid = Array.from({length: SIZE}, () => Array(SIZE).fill(0));
}

function randEmptyCell() {
  const empties = [];
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (grid[r][c] === 0) empties.push([r, c]);
  if (!empties.length) return null;
  return empties[Math.floor(Math.random() * empties.length)];
}

function addRandomTile() {
  const spot = randEmptyCell();
  if (!spot) return false;
  const [r, c] = spot;
  grid[r][c] = Math.random() < 0.9 ? 2 : 4;
  return true;
}

function updateScore(delta) {
  score += delta;
  scoreEl.textContent = score;
  if (score > best) {
    best = score;
    bestEl.textContent = best;
  }
}

function cellToXY(r, c) {
  const styles = getComputedStyle(document.documentElement);
  const cell = parseFloat(styles.getPropertyValue("--cell"));
  const gap  = parseFloat(styles.getPropertyValue("--gap"));
  return { x: c * (cell + gap), y: r * (cell + gap) };
}

function render(animateNew = false) {
  tilesEl.innerHTML = "";
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const v = grid[r][c];
      if (!v) continue;
      const tile = document.createElement("div");
      tile.className = `tile v${v}`;
      tile.textContent = v;
      const {x, y} = cellToXY(r, c);
      tile.style.transform = `translate(${x}px, ${y}px)`;
      if (animateNew) tile.classList.add("new");
      tilesEl.appendChild(tile);
    }
  }
}

function canMove() {
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (grid[r][c] === 0) return true;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const v = grid[r][c];
      if (r + 1 < SIZE && grid[r+1][c] === v) return true;
      if (c + 1 < SIZE && grid[r][c+1] === v) return true;
    }
  }
  return false;
}

function showOverlay(type) {
  if (type === "win") {
    overlayTitleEl.textContent = "You made 2048! 🌊";
    overlayTextEl.textContent  = "Keep going or start fresh.";
  } else {
    overlayTitleEl.textContent = "Game over 🐚";
    overlayTextEl.textContent  = "No more moves. Try again?";
  }
  overlayEl.classList.add("show");
}

function hideOverlay() {
  overlayEl.classList.remove("show");
}

function startGame() {
  hideOverlay();
  wonShown = false;
  score = 0;
  scoreEl.textContent = "0";
  emptyGrid();
  addRandomTile();
  addRandomTile();
  render(true);
}

function rotateLeft(m) {
  const res = Array.from({length: SIZE}, () => Array(SIZE).fill(0));
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      res[SIZE - 1 - c][r] = m[r][c];
  return res;
}

function slideAndMergeRow(row) {
  const vals = row.filter(v => v !== 0);
  let gained = 0;
  for (let i = 0; i < vals.length - 1; i++) {
    if (vals[i] === vals[i + 1]) {
      vals[i] *= 2;
      gained += vals[i];
      vals.splice(i + 1, 1);
    }
  }
  while (vals.length < SIZE) vals.push(0);
  return {row: vals, gained};
}

function move(dir) {
  let rotations = 0;
  if (dir === "up")    rotations = 1;
  if (dir === "right") rotations = 2;
  if (dir === "down")  rotations = 3;

  let m = grid;
  for (let i = 0; i < rotations; i++) m = rotateLeft(m);

  let moved = false;
  let gainedTotal = 0;
  const newM = m.map(r => r.slice());

  for (let r = 0; r < SIZE; r++) {
    const before = newM[r].slice();
    const {row, gained} = slideAndMergeRow(before);
    newM[r] = row;
    gainedTotal += gained;
    if (row.some((v, i) => v !== before[i])) moved = true;
  }

  if (!moved) return false;

  let back = newM;
  for (let i = 0; i < (4 - rotations) % 4; i++) back = rotateLeft(back);

  grid = back;
  updateScore(gainedTotal);
  addRandomTile();
  render();
  checkEndStates();
  return true;
}

function checkEndStates() {
  if (!wonShown) {
    for (let r = 0; r < SIZE; r++)
      for (let c = 0; c < SIZE; c++)
        if (grid[r][c] === 2048) { wonShown = true; showOverlay("win"); return; }
  }
  if (!canMove()) showOverlay("lose");
}

// Keyboard
window.addEventListener("keydown", (e) => {
  if (["ArrowLeft","ArrowUp","ArrowRight","ArrowDown"].includes(e.key)) e.preventDefault();
  if (e.key === "ArrowLeft")  move("left");
  if (e.key === "ArrowUp")    move("up");
  if (e.key === "ArrowRight") move("right");
  if (e.key === "ArrowDown")  move("down");
}, {passive: false});

// Swipe
let startX = 0, startY = 0, tracking = false;

boardEl.addEventListener("touchstart", (e) => {
  if (!e.touches || !e.touches[0]) return;
  tracking = true;
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
}, {passive: true});

boardEl.addEventListener("touchend", (e) => {
  if (!tracking) return;
  tracking = false;
  const t = e.changedTouches && e.changedTouches[0];
  if (!t) return;
  const dx = t.clientX - startX;
  const dy = t.clientY - startY;
  const ax = Math.abs(dx), ay = Math.abs(dy);
  if (Math.max(ax, ay) < 24) return;
  if (ax > ay) { if (dx > 0) move("right"); else move("left"); }
  else         { if (dy > 0) move("down");  else move("up"); }
}, {passive: true});

// Buttons
document.getElementById("newGame").addEventListener("click", startGame);
document.getElementById("retry").addEventListener("click", startGame);

// Start
startGame();
