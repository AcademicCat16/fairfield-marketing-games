const app = document.getElementById("app");
const cells = Array.from(document.querySelectorAll(".cell"));
const statusEl = document.getElementById("status");

const resetBtn = document.getElementById("reset");
const newMatchBtn = document.getElementById("newMatch");
const matchSelect = document.getElementById("matchSelect");

const scoreXEl = document.getElementById("scoreX");
const scoreOEl = document.getElementById("scoreO");
const scoreDEl = document.getElementById("scoreD");

const themeBtn = document.getElementById("themeBtn");

let board, current, roundOver;
let scoreX, scoreO, scoreD;
let targetWins; // best-of: first to ceil(n/2)

const wins = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// Scoring rule (edit these if you want different mechanics)
const POINTS = { win: 3, draw: 1, loss: 0 };

function initMatch() {
  scoreX = 0; scoreO = 0; scoreD = 0;

  const bestOf = Number(matchSelect.value);
  targetWins = Math.ceil(bestOf / 2);

  updateScoreboard();
  initRound();
  setStatus(`New match: first to ${targetWins} wins. X starts.`);
}

function initRound() {
  board = Array(9).fill("");
  current = "X";
  roundOver = false;

  cells.forEach(btn => {
    btn.textContent = "";
    btn.disabled = false;
    btn.classList.remove("win");
  });

  setStatus("X's turn");
}

function setStatus(text) {
  statusEl.textContent = text;
}

function updateScoreboard() {
  scoreXEl.textContent = scoreX;
  scoreOEl.textContent = scoreO;
  scoreDEl.textContent = scoreD;
}

function checkWinner() {
  for (const line of wins) {
    const [a,b,c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  if (board.every(v => v)) return { winner: "draw", line: null };
  return null;
}

function lockBoard() {
  cells.forEach(btn => (btn.disabled = true));
}

function highlightLine(line) {
  if (!line) return;
  line.forEach(i => cells[i].classList.add("win"));
}

// Best-of logic: convert points into “wins” too.
// We’ll track wins by counting rounds won separately.
let roundsWonX = 0;
let roundsWonO = 0;

function awardRound(result) {
  if (result === "draw") {
    scoreD += POINTS.draw;
    scoreX += 0; // no change for draw unless you want it
    scoreO += 0;
    updateScoreboard();
    setStatus(`Draw round (+${POINTS.draw} draw pt). Click "Next Round".`);
    return;
  }

  // Winner gets win points; loser gets loss points
  if (result === "X") {
    scoreX += POINTS.win;
    scoreO += POINTS.loss;
    roundsWonX += 1;
  } else {
    scoreO += POINTS.win;
    scoreX += POINTS.loss;
    roundsWonO += 1;
  }

  updateScoreboard();

  // Match end check (best-of)
  if (roundsWonX >= targetWins || roundsWonO >= targetWins) {
    const champ = roundsWonX > roundsWonO ? "X" : "O";
    setStatus(`${champ} wins the MATCH! (Rounds: X ${roundsWonX} - O ${roundsWonO}) Press "New Match".`);
    resetBtn.disabled = true; // next round disabled because match is finished
  } else {
    setStatus(`${result} wins the round (+${POINTS.win} pts). Click "Next Round".`);
  }
}

function handleClick(e) {
  if (roundOver) return;

  const i = Number(e.currentTarget.dataset.i);
  if (board[i]) return;

  board[i] = current;
  e.currentTarget.textContent = current;

  const result = checkWinner();
  if (result) {
    roundOver = true;
    lockBoard();
    if (result.winner !== "draw") highlightLine(result.line);
    awardRound(result.winner);
    return;
  }

  current = current === "X" ? "O" : "X";
  setStatus(`${current}'s turn`);
}

cells.forEach(btn => btn.addEventListener("click", handleClick));

resetBtn.addEventListener("click", () => {
  // if match is over, do nothing
  if (resetBtn.disabled) return;
  initRound();
});

newMatchBtn.addEventListener("click", () => {
  resetBtn.disabled = false;
  roundsWonX = 0;
  roundsWonO = 0;
  initMatch();
});

themeBtn.addEventListener("click", () => {
  app.classList.toggle("dark");
});

// start
initMatch();
