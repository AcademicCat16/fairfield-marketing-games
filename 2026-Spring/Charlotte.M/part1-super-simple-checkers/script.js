const board = document.getElementById("board");
const resetBtn = document.getElementById("reset");
const width = 8;
let squares = [];
let selectedPiece = null;
let selectedSquare = null;
function setupBoard() {
board.innerHTML = ""; // Clear board
squares = [];
selectedPiece = null;
selectedSquare = null;
// Create board squares
for (let i = 0; i < width * width; i++) {
const square = document.createElement("div");
square.classList.add("square");
if ((Math.floor(i / width) + i) % 2 === 0) {
square.classList.add("light");
} else {
square.classList.add("dark");
}
square.setAttribute("data-id", i);
square.addEventListener("click", handleClick);
board.appendChild(square);
squares.push(square);
}

// Add red pieces (top)
for (let i = 0; i < 24; i++) {
if (squares[i].classList.contains("dark")) {
addPiece(squares[i], "red");
}
}
// Add black pieces (bottom)
for (let i = 40; i < 64; i++) {
if (squares[i].classList.contains("dark")) {
addPiece(squares[i], "black");
}
}
}
function addPiece(square, color) {
const piece = document.createElement("div");
piece.classList.add("piece", color);
square.appendChild(piece);
}
function handleClick() {
const clickedSquare = this;
const piece = clickedSquare.querySelector(".piece");
// Select piece
if (piece) {
if (selectedSquare) {
selectedSquare.classList.remove("selected");
}
selectedPiece = piece;
selectedSquare = clickedSquare;
clickedSquare.classList.add("selected");
return;
}
// Move piece
if (selectedPiece) {
const fromIndex = parseInt(selectedSquare.dataset.id);
const toIndex = parseInt(clickedSquare.dataset.id);
const difference = toIndex - fromIndex;
// Normal move

if (
difference === 7 ||
difference === 9 ||
difference === -7 ||
difference === -9
) {
if (!clickedSquare.querySelector(".piece")) {
clickedSquare.appendChild(selectedPiece);
}
}
// Jump move
if (
difference === 14 ||
difference === 18 ||
difference === -14 ||
difference === -18
) {
const middleIndex = fromIndex + difference / 2;
const middleSquare = squares[middleIndex];
if (
middleSquare.querySelector(".piece") &&
!clickedSquare.querySelector(".piece")
) {
middleSquare.removeChild(middleSquare.querySelector(".piece"));
clickedSquare.appendChild(selectedPiece);
}
}
selectedSquare.classList.remove("selected");
selectedPiece = null;
selectedSquare = null;
}
}
// Reset button
resetBtn.addEventListener("click", setupBoard);
// Initial board setup
setupBoard();
