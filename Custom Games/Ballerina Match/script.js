const GRID_SIZE  = 8;
const MOVE_LIMIT = 30;
const COLORS     = ["white", "pink", "red", "black"];
const CLASS_BY_COLOR = { white: "c-white", pink: "c-pink", red: "c-red", black: "c-black" };

const gridEl      = document.getElementById("grid");
const scoreEl     = document.getElementById("score");
const movesLeftEl = document.getElementById("movesLeft");
const toastEl     = document.getElementById("toast");
const dancerEl    = document.getElementById("dancer");

const moveButtons = {
  plie:      document.getElementById("m1"),
  pirouette: document.getElementById("m2"),
  arabesque: document.getElementById("m3"),
  jump:      document.getElementById("m4")
};

let board     = [];
let score     = 0;
let movesLeft = MOVE_LIMIT;
let selected  = null;
let busy      = false;

const T2 = 200, T3 = 500, T4 = 900;
const unlocked = { plie: true, pirouette: false, arabesque: false, jump: false };

function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toastEl.classList.remove("show"), 900);
}

function randColor() { return COLORS[Math.floor(Math.random() * COLORS.length)]; }
function inBounds(r, c) { return r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE; }

function setScore(n) {
  score = Math.max(0, n);
  scoreEl.textContent = score;
  updateUnlocks();
}

function setMovesLeft(n) {
  movesLeft = Math.max(0, n);
  movesLeftEl.textContent = movesLeft;
}

function updateUnlocks() {
  const before = {...unlocked};
  if (score >= T2) unlocked.pirouette = true;
  if (score >= T3) unlocked.arabesque = true;
  if (score >= T4) unlocked.jump      = true;

  Object.entries(moveButtons).forEach(([k, btn]) => {
    const isOpen = unlocked[k];
    btn.disabled = !isOpen;
    btn.classList.toggle("locked", !isOpen);
  });

  if (!before.pirouette && unlocked.pirouette) toast("Unlocked: Pirouette 🩰");
  if (!before.arabesque && unlocked.arabesque) toast("Unlocked: Arabesque 🌀");
  if (!before.jump      && unlocked.jump)      toast("Unlocked: Jeté ✨");
}

function makeEmptyBoard() {
  board = Array.from({length: GRID_SIZE}, () =>
    Array.from({length: GRID_SIZE}, () => ({ color: randColor() }))
  );
}

function getMatches() {
  const toClear = new Set();

  for (let r = 0; r < GRID_SIZE; r++) {
    let runStart = 0;
    for (let c = 1; c <= GRID_SIZE; c++) {
      const prev = board[r][c - 1]?.color;
      const cur  = (c < GRID_SIZE) ? board[r][c]?.color : null;
      if (cur !== prev) {
        if (prev && (c - runStart) >= 3) {
          for (let k = runStart; k < c; k++) toClear.add(`${r},${k}`);
        }
        runStart = c;
      }
    }
  }

  for (let c = 0; c < GRID_SIZE; c++) {
    let runStart = 0;
    for (let r = 1; r <= GRID_SIZE; r++) {
      const prev = board[r - 1]?.[c]?.color;
      const cur  = (r < GRID_SIZE) ? board[r]?.[c]?.color : null;
      if (cur !== prev) {
        if (prev && (r - runStart) >= 3) {
          for (let k = runStart; k < r; k++) toClear.add(`${k},${c}`);
        }
        runStart = r;
      }
    }
  }

  return [...toClear].map(s => s.split(",").map(Number));
}

function pointsForClear(n) {
  if (n <= 0) return 0;
  if (n === 3) return 30;
  if (n === 4) return 60;
  if (n === 5) return 110;
  return 110 + (n - 5) * 25;
}

function clearMatches(matchCells) {
  matchCells.forEach(([r, c]) => { board[r][c].color = null; });
  return pointsForClear(matchCells.length);
}

function collapse() {
  for (let c = 0; c < GRID_SIZE; c++) {
    let write = GRID_SIZE - 1;
    for (let r = GRID_SIZE - 1; r >= 0; r--) {
      const col = board[r][c].color;
      if (col !== null) {
        board[write][c].color = col;
        if (write !== r) board[r][c].color = null;
        write--;
      }
    }
    for (let r = write; r >= 0; r--) { board[r][c].color = randColor(); }
  }
}

function render() {
  gridEl.innerHTML = "";
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const div = document.createElement("div");
      div.className = "tile " + CLASS_BY_COLOR[board[r][c].color];
      div.dataset.r = r;
      div.dataset.c = c;
      if (selected && selected.r === r && selected.c === c) div.classList.add("selected");
      gridEl.appendChild(div);
    }
  }
}

function swap(a, b) {
  const tmp = board[a.r][a.c].color;
  board[a.r][a.c].color = board[b.r][b.c].color;
  board[b.r][b.c].color = tmp;
}

function adjacent(a, b) {
  return (Math.abs(a.r - b.r) + Math.abs(a.c - b.c)) === 1;
}

function wait(ms) { return new Promise(res => setTimeout(res, ms)); }

async function resolveBoard() {
  let totalEarned = 0;
  while (true) {
    const matches = getMatches();
    if (!matches.length) break;
    totalEarned += clearMatches(matches);
    render();
    await wait(160);
    collapse();
    render();
    await wait(160);
  }
  if (totalEarned > 0) {
    setScore(score + totalEarned);
    toast(`Nice! +${totalEarned} points`);
  }
}

async function trySwapAndResolve(a, b) {
  if (busy) return;
  if (movesLeft <= 0) {
    toast("Out of moves — start a New Game!");
    selected = null;
    render();
    return;
  }
  busy = true;
  swap(a, b);
  render();

  const matches = getMatches();
  if (!matches.length) {
    await wait(120);
    swap(a, b);
    selected = null;
    render();
    busy = false;
    toast("No match — try a different swap");
    return;
  }

  setMovesLeft(movesLeft - 1);
  selected = null;
  render();
  await resolveBoard();
  busy = false;
  if (movesLeft <= 0) toast("Show's over! New Game to keep playing.");
}

function removeAllMoveClasses() {
  dancerEl.classList.remove("move-plie", "move-pirouette", "move-arabesque", "move-jump");
}

function dance(move) {
  if (!unlocked[move]) { toast("That step is locked — score more points!"); return; }
  const cls = { plie: "move-plie", pirouette: "move-pirouette", arabesque: "move-arabesque", jump: "move-jump" }[move];
  if (!cls) return;
  removeAllMoveClasses();
  void dancerEl.offsetWidth;
  dancerEl.classList.add(cls);
}

// Click handling
gridEl.addEventListener("click", (e) => {
  const tile = e.target.closest(".tile");
  if (!tile || busy) return;
  const cur = { r: Number(tile.dataset.r), c: Number(tile.dataset.c) };

  if (!selected) { selected = cur; render(); return; }
  if (selected.r === cur.r && selected.c === cur.c) { selected = null; render(); return; }
  if (!adjacent(selected, cur)) { selected = cur; render(); return; }
  trySwapAndResolve(selected, cur);
});

// Touch swipe
let touchStart = null;
gridEl.addEventListener("touchstart", (e) => {
  const t = e.touches?.[0];
  const tile = e.target.closest(".tile");
  if (!t || !tile || busy) return;
  touchStart = { x: t.clientX, y: t.clientY, r: Number(tile.dataset.r), c: Number(tile.dataset.c) };
}, {passive: true});

gridEl.addEventListener("touchend", (e) => {
  const t = e.changedTouches?.[0];
  if (!t || !touchStart || busy) return;
  const dx = t.clientX - touchStart.x;
  const dy = t.clientY - touchStart.y;
  const ax = Math.abs(dx), ay = Math.abs(dy);
  const threshold = 18;
  if (Math.max(ax, ay) < threshold) { touchStart = null; return; }
  let dr = 0, dc = 0;
  if (ax > ay) dc = dx > 0 ? 1 : -1;
  else         dr = dy > 0 ? 1 : -1;
  const a = { r: touchStart.r, c: touchStart.c };
  const b = { r: a.r + dr, c: a.c + dc };
  touchStart = null;
  if (!inBounds(b.r, b.c)) return;
  trySwapAndResolve(a, b);
}, {passive: true});

// Dance buttons
document.querySelectorAll("[data-move]").forEach(btn => {
  btn.addEventListener("click", () => dance(btn.dataset.move));
});

// Keyboard shortcuts
window.addEventListener("keydown", (e) => {
  if (e.key === "1") dance("plie");
  if (e.key === "2") dance("pirouette");
  if (e.key === "3") dance("arabesque");
  if (e.key === "4") dance("jump");
});

// New game
async function removeInitialMatches() {
  for (let i = 0; i < 10; i++) {
    const matches = getMatches();
    if (!matches.length) break;
    matches.forEach(([r, c]) => { board[r][c].color = randColor(); });
  }
}

async function newGame() {
  busy = true;
  selected = null;
  setScore(0);
  setMovesLeft(MOVE_LIMIT);
  unlocked.pirouette = false;
  unlocked.arabesque = false;
  unlocked.jump      = false;
  updateUnlocks();
  makeEmptyBoard();
  await removeInitialMatches();
  render();
  toast("New game — match 3 to unlock steps!");
  busy = false;
}

document.getElementById("newGame").addEventListener("click", newGame);

newGame();
