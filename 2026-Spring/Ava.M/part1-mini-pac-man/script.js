const gameEl    = document.getElementById("game");
const msgEl     = document.getElementById("msg");
const restartBtn = document.getElementById("restart");

// All rows exactly 20 characters — walls (#) and open spaces ( )
const wallMap = [
  "####################",
  "#    #    #    #   #",
  "# ## # ## # ## # # #",
  "#    #    #    #   #",
  "# ## #### #### ## ##",
  "#                  #",
  "## # ## ## ## ## # #",
  "#  #    #    #  #  #",
  "# ## ## # ## ## ## #",
  "#    #    #    #   #",
  "####################"
];

const START_POS = { r: 1, c: 1 };
const GHOST_POS = { r: 9, c: 18 };
const GHOST_SPEED_MS = 350;

let grid, pac, ghost, dotsLeft, gameOver;
let ghostTimer = null;

function inBounds(r, c) {
  return r >= 0 && r < grid.length && c >= 0 && c < grid[0].length;
}

function isWall(r, c) {
  return grid[r][c] === "#";
}

function wrapPosition(r, c) {
  if (r < 0) r = grid.length - 1;
  if (r >= grid.length) r = 0;
  if (c < 0) c = grid[0].length - 1;
  if (c >= grid[0].length) c = 0;
  return { r, c };
}

function floodFillReachable(startR, startC) {
  const q = [{ r: startR, c: startC }];
  const seen = new Set([`${startR},${startC}`]);
  const dirs = [{ dr:-1,dc:0 },{ dr:1,dc:0 },{ dr:0,dc:-1 },{ dr:0,dc:1 }];
  while (q.length) {
    const cur = q.shift();
    for (const d of dirs) {
      let { r: nr, c: nc } = wrapPosition(cur.r + d.dr, cur.c + d.dc);
      const key = `${nr},${nc}`;
      if (seen.has(key) || isWall(nr, nc)) continue;
      seen.add(key);
      q.push({ r: nr, c: nc });
    }
  }
  return seen;
}

function buildLevel() {
  grid = wallMap.map(row => row.split(""));

  // Validate row lengths
  const w = grid[0].length;
  for (let r = 0; r < grid.length; r++) {
    while (grid[r].length < w) grid[r].push("#"); // pad short rows
    if (grid[r].length > w) grid[r] = grid[r].slice(0, w); // trim long rows
  }

  pac   = { r: START_POS.r, c: START_POS.c };
  ghost = { r: GHOST_POS.r, c: GHOST_POS.c, dr: 0, dc: -1 };

  if (grid[pac.r][pac.c]   === "#") grid[pac.r][pac.c]   = " ";
  if (grid[ghost.r][ghost.c] === "#") grid[ghost.r][ghost.c] = " ";

  const reachable = floodFillReachable(pac.r, pac.c);
  dotsLeft = 0;

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      const key = `${r},${c}`;
      if (!reachable.has(key)) continue;
      if (grid[r][c] !== " ") continue;
      if (r === pac.r && c === pac.c) continue;
      if (r === ghost.r && c === ghost.c) continue;
      grid[r][c] = ".";
      dotsLeft++;
    }
  }

  gameOver = false;
  msgEl.textContent = "";
}

function endGame(text) {
  gameOver = true;
  clearInterval(ghostTimer);
  msgEl.textContent = text;
}

function checkCollision() {
  if (pac.r === ghost.r && pac.c === ghost.c) {
    endGame("💥 Game over! The ghost got you.");
  }
}

function draw() {
  gameEl.innerHTML = "";
  for (let r = 0; r < grid.length; r++) {
    const rowEl = document.createElement("div");
    rowEl.className = "row";
    for (let c = 0; c < grid[0].length; c++) {
      const cellEl = document.createElement("div");
      cellEl.className = "cell";
      const ch = grid[r][c];
      if (ch === "#") {
        cellEl.style.backgroundColor = "hotpink";
      } else if (ch === ".") {
        cellEl.textContent = "•";
        cellEl.style.color = "#fff";
      }
      if (r === ghost.r && c === ghost.c) cellEl.textContent = "👻";
      if (r === pac.r   && c === pac.c)   cellEl.textContent = "😋";
      rowEl.appendChild(cellEl);
    }
    gameEl.appendChild(rowEl);
  }
  if (!gameOver) msgEl.textContent = `Dots left: ${dotsLeft}`;
}

function tryMovePac(dr, dc) {
  if (gameOver) return;
  let { r: nr, c: nc } = wrapPosition(pac.r + dr, pac.c + dc);
  if (isWall(nr, nc)) return;
  pac.r = nr; pac.c = nc;
  if (grid[nr][nc] === ".") {
    grid[nr][nc] = " ";
    dotsLeft--;
    if (dotsLeft === 0) endGame("🎉 You win! You ate every dot!");
  }
  checkCollision();
  draw();
}

function moveGhost() {
  if (gameOver) return;
  const dirs = [{ dr:-1,dc:0 },{ dr:1,dc:0 },{ dr:0,dc:-1 },{ dr:0,dc:1 }];
  const canMove = (dr, dc) => {
    const { r: nr, c: nc } = wrapPosition(ghost.r + dr, ghost.c + dc);
    return !isWall(nr, nc);
  };
  if (!canMove(ghost.dr, ghost.dc) || Math.random() < 0.2) {
    const possible = dirs.filter(d => canMove(d.dr, d.dc));
    const pick = possible[Math.floor(Math.random() * possible.length)] || { dr: ghost.dr, dc: ghost.dc };
    ghost.dr = pick.dr; ghost.dc = pick.dc;
  }
  let { r: nr, c: nc } = wrapPosition(ghost.r + ghost.dr, ghost.c + ghost.dc);
  ghost.r = nr; ghost.c = nc;
  checkCollision();
  draw();
}

function start() {
  if (ghostTimer) clearInterval(ghostTimer);
  buildLevel();
  draw();
  ghostTimer = setInterval(moveGhost, GHOST_SPEED_MS);
}

document.addEventListener("keydown", e => {
  const arrows = ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"];
  if (arrows.includes(e.key)) e.preventDefault();
  if (e.key === "ArrowUp")    tryMovePac(-1,  0);
  if (e.key === "ArrowDown")  tryMovePac( 1,  0);
  if (e.key === "ArrowLeft")  tryMovePac( 0, -1);
  if (e.key === "ArrowRight") tryMovePac( 0,  1);
}, { passive: false });

restartBtn.addEventListener("click", start);
start();
