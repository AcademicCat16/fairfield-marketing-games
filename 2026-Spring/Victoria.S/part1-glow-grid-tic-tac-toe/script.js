// ===== DOM Elements =====
const gameCells = document.querySelectorAll('.gamecell');
const resetBtn = document.getElementById('resetBtn');
const turnEl = document.getElementById('turn');
const namesDialog = document.getElementById('namesDialog');
const namesForm = document.getElementById('namesForm');
const name1Input = document.getElementById('name1');
const name2Input = document.getElementById('name2');
const resultDialog = document.getElementById('resultDialog');
const resultText = document.getElementById('resultText');
const playAgainBtn = document.getElementById('playAgainBtn');
const closeResultBtn = document.getElementById('closeResultBtn');

// ===== Game State =====
const WIN_LINES = [
    [0,1,2],[3,4,5],[6,7,8], // Rows
    [0,3,6],[1,4,7],[2,5,8], // Cols
    [0,4,8],[2,4,6]          // Diagonals
];

let players = { p1: {name: 'Player 1', symbol: 'X'}, p2: {name: 'Player 2', symbol: 'O'} };
let board = Array(9).fill(null);
let current = null;
let gameOver = false;

// ===== Functions =====
function setTurnText() {
    if (gameOver) {
        turnEl.textContent = 'Game Over';
    } else {
        turnEl.textContent = `${current.name}'s Turn (${current.symbol})`;
    }
}

function checkResult() {
    for (const [a, b, c] of WIN_LINES) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { winner: board[a] };
        }
    }
    if (!board.includes(null)) return { tie: true };
    return null;
}

function handleMove(e) {
    const cell = e.currentTarget;
    const idx = cell.dataset.position;

    if (gameOver || board[idx]) return;

    // Update Logic
    board[idx] = current.symbol;
    cell.textContent = current.symbol;
    cell.classList.add(current.symbol);

    // Check Win/Tie
    const result = checkResult();
    if (result) {
        gameOver = true;
        if (result.winner) {
            const winnerName = result.winner === players.p1.symbol ? players.p1.name : players.p2.name;
            resultText.textContent = `🎉 ${winnerName} Wins!`;
        } else {
            resultText.textContent = "🤝 It's a Tie!";
        }
        resultDialog.showModal();
        setTurnText();
        return;
    }

    // Switch Turn
    current = (current === players.p1) ? players.p2 : players.p1;
    setTurnText();
}

function resetGame() {
    board = Array(9).fill(null);
    gameOver = false;
    current = players.p1;
    gameCells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('X', 'O');
    });
    setTurnText();
}

// ===== Event Listeners =====
gameCells.forEach(cell => cell.addEventListener('click', handleMove));
resetBtn.addEventListener('click', resetGame);
playAgainBtn.addEventListener('click', () => { resultDialog.close(); resetGame(); });
closeResultBtn.addEventListener('click', () => resultDialog.close());

namesForm.addEventListener('submit', (e) => {
    e.preventDefault();
    players.p1.name = name1Input.value.trim() || 'Player 1';
    players.p2.name = name2Input.value.trim() || 'Player 2';
    namesDialog.close();
    resetGame();
});

// Initialization
window.onload = () => {
    namesDialog.showModal();
};
