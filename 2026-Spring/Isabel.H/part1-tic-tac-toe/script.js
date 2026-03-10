const cells    = document.querySelectorAll(".cell");
const status   = document.getElementById("status");
const restart  = document.getElementById("restart");

let board      = Array(9).fill("");
let current    = "X";
let gameActive = true;

const wins = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // cols
  [0,4,8],[2,4,6]          // diagonals
];

function checkWinner() {
  for (const [a,b,c] of wins) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return board.every(cell => cell) ? "Draw" : null;
}

function handleClick(e) {
  const i = Number(e.target.dataset.index);
  if (!gameActive || board[i]) return;

  board[i] = current;
  e.target.textContent = current;

  const result = checkWinner();
  if (result) {
    status.textContent = result === "Draw" ? "It's a draw!" : `Player ${result} wins! 🎉`;
    gameActive = false;
    return;
  }

  current = current === "X" ? "O" : "X";
  status.textContent = `Player ${current}'s turn`;
}

function resetGame() {
  board      = Array(9).fill("");
  current    = "X";
  gameActive = true;
  status.textContent = "Player X's turn";
  cells.forEach(cell => cell.textContent = "");
}

cells.forEach(cell => cell.addEventListener("click", handleClick));
restart.addEventListener("click", resetGame);
