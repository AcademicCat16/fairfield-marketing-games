const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");

let board = Array(9).fill("");
let currentPlayer = "L";
let gameOver = false;

// The game tracks 8 possible winning lines

const WIN_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

function initBoard() {
    boardEl.innerHTML = "";
    board.forEach((val, i) => {
        const cell = document.createElement("div");
        cell.className = "cell";
        if (val) cell.classList.add(val);
        cell.textContent = val;
        cell.addEventListener("click", () => makeMove(i));
        boardEl.appendChild(cell);
    });
}

function makeMove(i) {
    if (gameOver || board[i] !== "") return;

    board[i] = currentPlayer;
    const winData = checkWin();

    if (winData) {
        gameOver = true;
        statusEl.textContent = `💥 ${currentPlayer} WINS!`;
        highlightWin(winData.line);
    } else if (board.every(cell => cell !== "")) {
        gameOver = true;
        statusEl.textContent = "🤝 IT'S A TIE!";
    } else {
        currentPlayer = currentPlayer === "L" ? "W" : "L";
        statusEl.textContent = `Turn: ${currentPlayer}`;
    }
    render();
}

function checkWin() {
    for (let line of WIN_LINES) {
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { winner: board[a], line };
        }
    }
    return null;
}

function highlightWin(line) {
    const cells = document.querySelectorAll('.cell');
    line.forEach(idx => cells[idx].classList.add('win'));
}

function render() {
    const cells = document.querySelectorAll('.cell');
    board.forEach((val, i) => {
        cells[i].textContent = val;
        if (val) cells[i].classList.add(val);
    });
}

function resetGame() {
    board = Array(9).fill("");
    currentPlayer = "L";
    gameOver = false;
    statusEl.textContent = "Turn: L";
    initBoard();
}

// Initial start
resetBtn.addEventListener("click", resetGame);
initBoard();
