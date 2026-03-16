// Select elements
const cells = document.querySelectorAll(".gamecell");
const resetButton = document.querySelector("button");
const turnDisplay = document.getElementById("turnDisplay");
// Game state
let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
// Winning combinations
const winningCombos = [
[0,1,2],
[3,4,5],
[6,7,8],
[0,3,6],
[1,4,7],
[2,5,8],
[0,4,8],
[2,4,6]
];
// Update turn display
function updateTurnDisplay() {
turnDisplay.textContent =
currentPlayer === "X"
? " Hacker's Turn"
: " Firewall's Turn";
}
updateTurnDisplay();
// Handle cell click
function handleClick(e) {
const cell = e.target;
const index = cell.getAttribute("data-position");
if (board[index] !== "" || !gameActive) return;
board[index] = currentPlayer;
cell.textContent = currentPlayer;
// Add cyber styling
if (currentPlayer === "X") {
cell.classList.add("x-symbol");
} else {
cell.classList.add("o-symbol");
}
checkWinner();
}
// Check for winner
function checkWinner() {
for (let combo of winningCombos) {
const [a, b, c] = combo;
if (
board[a] &&
board[a] === board[b] &&
board[a] === board[c]
) {
gameActive = false;
turnDisplay.textContent =
currentPlayer === "X"
? " Hacker Wins!"
: "🛡 Firewall Wins!";
return;
}
}
// Check for tie
if (!board.includes("")) {
gameActive = false;
turnDisplay.textContent = " System Draw!";
return;
}
// Switch player
currentPlayer = currentPlayer === "X" ? "O" : "X";
updateTurnDisplay();
}
// Reset game
function resetGame() {
board = ["", "", "", "", "", "", "", "", ""];
gameActive = true;
currentPlayer = "X";
cells.forEach(cell => {
cell.textContent = "";
cell.classList.remove("x-symbol", "o-symbol");
});
updateTurnDisplay();
}
// Event listeners
cells.forEach(cell => cell.addEventListener("click", handleClick));
resetButton.addEventListener("click", resetGame);
