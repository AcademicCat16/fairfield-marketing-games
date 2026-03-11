// ===== Frenchie Bacon Maze (CodePen-ready, no images needed) =====

const boardEl = document.getElementById("board");
const levelEl = document.getElementById("level");
const movesEl = document.getElementById("moves");
const toastEl = document.getElementById("toast");

const restartBtn = document.getElementById("restart");
const resetBtn = document.getElementById("reset");

// Emojis
const DOG = "🐶";
const BACON = "🥓";

// 5 levels (all rows same length, each has exactly one P and one G)
const LEVELS = [
  // LEVEL 1 (10 wide)
  {
    grid: [
      "1111111111",
      "1P00000001",
      "1011111101",
      "1000000101",
      "1111100101",
      "1000100101",
      "1010100101",
      "1010111101",
      "10000000G1",
      "1111111111",
    ],
  },

  // LEVEL 2 (12 wide) - fixed
  {
    grid: [
      "111111111111",
      "1P0000000001",
      "101111111101",
      "100000001001",
      "111111001101",
      "100001001001",
      "101101111001",
      "101000000001",
      "101111111101",
      "100000000001",
      "1011111110G1",
      "111111111111",
    ],
  },

  // LEVEL 3 (15 wide)
  {
    grid: [
      "111111111111111",
      "1P0000000000001",
      "101111111111101",
      "101000000000101",
      "101011111110101",
      "101010000010101",
      "101010111010101",
      "101010101010101",
      "101010101010101",
      "101000101000101",
      "101111101111101",
      "100000001000001",
      "111111101011111",
      "1000000010000G1",
      "111111111111111",
    ],
  },

  // LEVEL 4 (18 wide) - fixed (has bacon)
  {
    grid: [
      "111111111111111111",
      "1P00000000000000001",
      "101111111111111101",
      "100000000000001001",
      "101111111111101101",
      "101000000001001001",
      "101011111101111001",
      "101010000100000001",
      "101010111101111101",
      "101010000001000001",
      "1011111111111110G1",
      "111111111111111111",
    ],
  },

  // LEVEL 5 (21 wide) - FIXED (row lengths consistent + bacon included)
  {
    grid: [
      "111111111111111111111",
      "1P00000000000000000001",
      "1011111111111111111101",
      "1010000000000000000101",
      "1010111111111111100101",
      "1010100000000000100101",
      "1010101111111110100101",
      "1010101000000010100101",
      "1010101011111010100101",
      "1010101010001010100101",
      "1010101010111010100101",
      "1010101010100010100101",
      "1010101010101110100101",
      "1010000010100000100001",
      "1011111110111111111101",
      "1000000000000000000G1",
      "111111111111111111111",
    ],
  },
];

let state = {
  level: 0,
  moves: 0,
  grid: [],
  width: 0,
  height: 0,
  player: { x: 0, y: 0 },
  goal: { x: 0, y: 0 },
};

// --- Validation: checks rectangular grids + exactly 1 P + 1 G ---
function validateLevels() {
  LEVELS.forEach((lvl, i) => {
    const rows = lvl.grid;
    const widths = rows.map((r) => r.length);
    const allSame = widths.every((w) => w === widths[0]);

    let pCount = 0,
      gCount = 0;
    rows.forEach((r) => {
      for (const ch of r) {
        if (ch === "P") pCount++;
        if (ch === "G") gCount++;
      }
    });

    const problems = [];
    if (!allSame) problems.push(`row lengths differ: ${widths.join(", ")}`);
    if (pCount !== 1) problems.push(`P count = ${pCount} (should be 1)`);
    if (gCount !== 1) problems.push(`G count = ${gCount} (should be 1)`);

    if (problems.length) {
      console.warn(`Level ${i + 1} problems -> ${problems.join(" | ")}`);
    } else {
      console.log(`Level ${i + 1} OK (width ${widths[0]})`);
    }
  });
}

// --- Game logic ---
function loadLevel() {
  const lines = LEVELS[state.level].grid;
  state.height = lines.length;
  state.width = lines[0].length;
  state.grid = [];
  state.moves = 0;
  toastEl.textContent = "";

  for (let y = 0; y < state.height; y++) {
    const row = lines[y];
    state.grid[y] = [];
    for (let x = 0; x < state.width; x++) {
      const c = row[x];
      if (c === "P") state.player = { x, y };
      if (c === "G") state.goal = { x, y };
      state.grid[y][x] = c === "1" ? 1 : 0;
    }
  }
}

function render() {
  boardEl.style.gridTemplateColumns = `repeat(${state.width}, var(--cell))`;
  boardEl.innerHTML = "";

  for (let y = 0; y < state.height; y++) {
    for (let x = 0; x < state.width; x++) {
      const cell = document.createElement("div");
      cell.className = "cell " + (state.grid[y][x] ? "wall" : "floor");

      if (x === state.goal.x && y === state.goal.y) {
        cell.classList.add("goal");
        cell.textContent = BACON;
      }

      if (x === state.player.x && y === state.player.y) {
        cell.classList.add("player");
        cell.textContent = DOG;
      }

      boardEl.appendChild(cell);
    }
  }

  levelEl.textContent = state.level + 1;
  movesEl.textContent = state.moves;
}

function move(dx, dy) {
  const nx = state.player.x + dx;
  const ny = state.player.y + dy;

  if (ny < 0 || ny >= state.height || nx < 0 || nx >= state.width) return;
  if (state.grid[ny][nx] !== 0) return;

  state.player = { x: nx, y: ny };
  state.moves++;

  if (nx === state.goal.x && ny === state.goal.y) {
    if (state.level === LEVELS.length - 1) {
      toastEl.textContent = `YOU GOT ALL THE BACON 🥓🎉 (Moves: ${state.moves})`;
    } else {
      state.level++;
      loadLevel();
    }
  }

  render();
}

window.addEventListener("keydown", (e) => {
  const k = e.key.toLowerCase();
  if (k === "arrowup" || k === "w") move(0, -1);
  if (k === "arrowdown" || k === "s") move(0, 1);
  if (k === "arrowleft" || k === "a") move(-1, 0);
  if (k === "arrowright" || k === "d") move(1, 0);
});

restartBtn.onclick = () => {
  loadLevel();
  render();
};

resetBtn.onclick = () => {
  state.level = 0;
  loadLevel();
  render();
};

// Start
validateLevels(); // check console for warnings (CodePen "Console" tab)
loadLevel();
render();
