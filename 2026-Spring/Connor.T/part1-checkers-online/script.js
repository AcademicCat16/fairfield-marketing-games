const board = [
  null, 0, null, 1, null, 2, null, 3,
  4, null, 5, null, 6, null, 7, null,
  null, 8, null, 9, null, 10, null, 11,
  null, null, null, null, null, null, null, null,
  null, null, null, null, null, null, null, null,
  12, null, 13, null, 14, null, 15, null,
  null, 16, null, 17, null, 18, null, 19,
  20, null, 21, null, 22, null, 23, null
];

let findPiece = (pieceId) => board.indexOf(parseInt(pieceId));

const cells        = document.querySelectorAll("td");
let redsPieces     = document.querySelectorAll("p");
let blacksPieces   = document.querySelectorAll("span");
const redLabel     = document.getElementById("red-label");
const blackLabel   = document.getElementById("black-label");
const redScoreEl   = document.getElementById("red-score");
const blackScoreEl = document.getElementById("black-score");
const winMsg       = document.getElementById("win-msg");

let turn = true;
let redScore = 12, blackScore = 12;
let playerPieces;

let selectedPiece = {
  pieceId: -1, indexOfBoardPiece: -1, isKing: false,
  seventhSpace: false, ninthSpace: false, fourteenthSpace: false, eighteenthSpace: false,
  minusSeventhSpace: false, minusNinthSpace: false, minusFourteenthSpace: false, minusEighteenthSpace: false
};

function updateTurnUI() {
  if (turn) {
    redLabel.classList.add("active-red");
    redLabel.classList.remove("active-black");
    redLabel.textContent = "🔴 RED'S TURN";
    blackLabel.classList.remove("active-red", "active-black");
    blackLabel.textContent = "⚫ BLACK";
  } else {
    blackLabel.classList.add("active-black");
    blackLabel.classList.remove("active-red");
    blackLabel.textContent = "⚫ BLACK'S TURN";
    redLabel.classList.remove("active-red", "active-black");
    redLabel.textContent = "🔴 RED";
  }
}

function givePiecesEventListeners() {
  updateTurnUI();
  if (turn) {
    for (let i = 0; i < redsPieces.length; i++)
      redsPieces[i].addEventListener("click", getPlayerPieces);
  } else {
    for (let i = 0; i < blacksPieces.length; i++)
      blacksPieces[i].addEventListener("click", getPlayerPieces);
  }
}

function getPlayerPieces() {
  playerPieces = turn ? redsPieces : blacksPieces;
  removeCellonclick();
  resetBorders();
}

function removeCellonclick() {
  for (let i = 0; i < cells.length; i++) cells[i].removeAttribute("onclick");
}

function resetBorders() {
  for (let i = 0; i < playerPieces.length; i++)
    playerPieces[i].style.outline = "";
  resetSelectedPieceProperties();
  getSelectedPiece();
}

function resetSelectedPieceProperties() {
  selectedPiece.pieceId = -1;
  selectedPiece.indexOfBoardPiece = -1;
  selectedPiece.isKing = false;
  selectedPiece.seventhSpace = selectedPiece.ninthSpace = false;
  selectedPiece.fourteenthSpace = selectedPiece.eighteenthSpace = false;
  selectedPiece.minusSeventhSpace = selectedPiece.minusNinthSpace = false;
  selectedPiece.minusFourteenthSpace = selectedPiece.minusEighteenthSpace = false;
}

function getSelectedPiece() {
  selectedPiece.pieceId = parseInt(event.target.id);
  selectedPiece.indexOfBoardPiece = findPiece(selectedPiece.pieceId);
  isPieceKing();
}

function isPieceKing() {
  selectedPiece.isKing = document.getElementById(selectedPiece.pieceId).classList.contains("king");
  getAvailableSpaces();
}

function getAvailableSpaces() {
  const idx = selectedPiece.indexOfBoardPiece;
  if (board[idx+7] === null && !cells[idx+7]?.classList.contains("noPieceHere")) selectedPiece.seventhSpace = true;
  if (board[idx+9] === null && !cells[idx+9]?.classList.contains("noPieceHere")) selectedPiece.ninthSpace = true;
  if (board[idx-7] === null && !cells[idx-7]?.classList.contains("noPieceHere")) selectedPiece.minusSeventhSpace = true;
  if (board[idx-9] === null && !cells[idx-9]?.classList.contains("noPieceHere")) selectedPiece.minusNinthSpace = true;
  checkAvailableJumpSpaces();
}

function checkAvailableJumpSpaces() {
  const idx = selectedPiece.indexOfBoardPiece;
  if (turn) {
    if (board[idx+14]===null && !cells[idx+14]?.classList.contains("noPieceHere") && board[idx+7]>=12) selectedPiece.fourteenthSpace=true;
    if (board[idx+18]===null && !cells[idx+18]?.classList.contains("noPieceHere") && board[idx+9]>=12) selectedPiece.eighteenthSpace=true;
    if (board[idx-14]===null && !cells[idx-14]?.classList.contains("noPieceHere") && board[idx-7]>=12) selectedPiece.minusFourteenthSpace=true;
    if (board[idx-18]===null && !cells[idx-18]?.classList.contains("noPieceHere") && board[idx-9]>=12) selectedPiece.minusEighteenthSpace=true;
  } else {
    if (board[idx+14]===null && !cells[idx+14]?.classList.contains("noPieceHere") && board[idx+7]<12 && board[idx+7]!==null) selectedPiece.fourteenthSpace=true;
    if (board[idx+18]===null && !cells[idx+18]?.classList.contains("noPieceHere") && board[idx+9]<12 && board[idx+9]!==null) selectedPiece.eighteenthSpace=true;
    if (board[idx-14]===null && !cells[idx-14]?.classList.contains("noPieceHere") && board[idx-7]<12 && board[idx-7]!==null) selectedPiece.minusFourteenthSpace=true;
    if (board[idx-18]===null && !cells[idx-18]?.classList.contains("noPieceHere") && board[idx-9]<12 && board[idx-9]!==null) selectedPiece.minusEighteenthSpace=true;
  }
  checkPieceConditions();
}

function checkPieceConditions() {
  if (!selectedPiece.isKing) {
    if (turn) {
      selectedPiece.minusSeventhSpace = selectedPiece.minusNinthSpace = false;
      selectedPiece.minusFourteenthSpace = selectedPiece.minusEighteenthSpace = false;
    } else {
      selectedPiece.seventhSpace = selectedPiece.ninthSpace = false;
      selectedPiece.fourteenthSpace = selectedPiece.eighteenthSpace = false;
    }
  }
  givePieceBorder();
}

function givePieceBorder() {
  const canMove = selectedPiece.seventhSpace || selectedPiece.ninthSpace ||
    selectedPiece.fourteenthSpace || selectedPiece.eighteenthSpace ||
    selectedPiece.minusSeventhSpace || selectedPiece.minusNinthSpace ||
    selectedPiece.minusFourteenthSpace || selectedPiece.minusEighteenthSpace;
  if (canMove) {
    document.getElementById(selectedPiece.pieceId).style.outline = "3px solid #4ade80";
    document.getElementById(selectedPiece.pieceId).style.outlineOffset = "2px";
    giveCellsClick();
  }
}

function giveCellsClick() {
  const idx = selectedPiece.indexOfBoardPiece;
  if (selectedPiece.seventhSpace)         cells[idx+7].setAttribute("onclick","makeMove(7)");
  if (selectedPiece.ninthSpace)           cells[idx+9].setAttribute("onclick","makeMove(9)");
  if (selectedPiece.fourteenthSpace)      cells[idx+14].setAttribute("onclick","makeMove(14)");
  if (selectedPiece.eighteenthSpace)      cells[idx+18].setAttribute("onclick","makeMove(18)");
  if (selectedPiece.minusSeventhSpace)    cells[idx-7].setAttribute("onclick","makeMove(-7)");
  if (selectedPiece.minusNinthSpace)      cells[idx-9].setAttribute("onclick","makeMove(-9)");
  if (selectedPiece.minusFourteenthSpace) cells[idx-14].setAttribute("onclick","makeMove(-14)");
  if (selectedPiece.minusEighteenthSpace) cells[idx-18].setAttribute("onclick","makeMove(-18)");
}

function makeMove(number) {
  document.getElementById(selectedPiece.pieceId).remove();
  cells[selectedPiece.indexOfBoardPiece].innerHTML = "";
  const newIdx = selectedPiece.indexOfBoardPiece + number;
  if (turn) {
    cells[newIdx].innerHTML = `<p class="${selectedPiece.isKing ? 'red-piece king' : 'red-piece'}" id="${selectedPiece.pieceId}"></p>`;
    redsPieces = document.querySelectorAll("p");
  } else {
    cells[newIdx].innerHTML = `<span class="${selectedPiece.isKing ? 'black-piece king' : 'black-piece'}" id="${selectedPiece.pieceId}"></span>`;
    blacksPieces = document.querySelectorAll("span");
  }
  const oldIdx = selectedPiece.indexOfBoardPiece;
  if (Math.abs(number) === 14 || Math.abs(number) === 18) {
    changeData(oldIdx, newIdx, oldIdx + number / 2);
  } else {
    changeData(oldIdx, newIdx);
  }
}

function changeData(oldIdx, newIdx, removeIdx) {
  board[oldIdx] = null;
  board[newIdx] = parseInt(selectedPiece.pieceId);
  if (turn && selectedPiece.pieceId < 12 && newIdx >= 57)
    document.getElementById(selectedPiece.pieceId).classList.add("king");
  if (!turn && selectedPiece.pieceId >= 12 && newIdx <= 7)
    document.getElementById(selectedPiece.pieceId).classList.add("king");
  if (removeIdx !== undefined) {
    board[removeIdx] = null;
    cells[removeIdx].innerHTML = "";
    if (turn) { blackScore--; blackScoreEl.textContent = blackScore; }
    else       { redScore--;   redScoreEl.textContent   = redScore; }
  }
  resetSelectedPieceProperties();
  removeCellonclick();
  removeEventListeners();
}

function removeEventListeners() {
  if (turn) {
    for (let i = 0; i < redsPieces.length; i++)
      redsPieces[i].removeEventListener("click", getPlayerPieces);
  } else {
    for (let i = 0; i < blacksPieces.length; i++)
      blacksPieces[i].removeEventListener("click", getPlayerPieces);
  }
  checkForWin();
}

function checkForWin() {
  if (blackScore === 0) {
    winMsg.textContent = "🔴 RED WINS!";
    winMsg.className = "win-msg red-win";
    winMsg.style.display = "block";
    return;
  }
  if (redScore === 0) {
    winMsg.textContent = "⚫ BLACK WINS!";
    winMsg.className = "win-msg black-win";
    winMsg.style.display = "block";
    return;
  }
  changePlayer();
}

function changePlayer() {
  turn = !turn;
  givePiecesEventListeners();
}

givePiecesEventListeners();
