let boxes = document.querySelectorAll(".box");

let resetBtn = document.querySelector("#reset-btn");

let newGameBtn = document.querySelector("#new-btn");

let msgContainer = document.querySelector(".msg-container");

let msg = document.querySelector("#msg");

let balloonsContainer = document.querySelector("#balloons");

let moveCount = 0;

let gameOver = false;

const winPatterns = [

 [0,1,2],[3,4,5],[6,7,8],

 [0,3,6],[1,4,7],[2,5,8],

 [0,4,8],[2,4,6]

];

// PLAYER = O

boxes.forEach((box, index) => {

 box.addEventListener("click", () => {

if (box.innerText || gameOver) return;

 box.innerText = "O";

 box.disabled = true;

 moveCount++;

if (checkWinner("O")) {

showWinner("You");

popBalloons();

gameOver = true;

return;

}

if (moveCount === 9) {

showDraw();

return;

}

 setTimeout(aiMove, 500);

 });

});

// AI = X

const aiMove = () => {

 let emptyBoxes = [...boxes].filter(box => box.innerText === "");

 if (emptyBoxes.length === 0 || gameOver) return;

 let choice = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];

 choice.innerText = "X";

 choice.disabled = true;

 moveCount++;

 if (checkWinner("X")) {

 showWinner("Computer");

 gameOver = true;

 } else if (moveCount === 9) {

 showDraw();

 }

};

const checkWinner = (player) => {

 return winPatterns.some(pattern =>

 pattern.every(index => boxes[index].innerText === player)

 );

};

const showWinner = (winner) => {

 msg.innerText = `${winner} won!`;

 msgContainer.classList.remove("hide");

};

const showDraw = () => {

 msg.innerText = "It's a draw!";

 msgContainer.classList.remove("hide");

};

const popBalloons = () => {

 for (let i = 0; i < 8; i++) {

let balloon = document.createElement("div");

 balloon.classList.add("balloon");

 balloon.style.left = Math.random() * 100 + "%";

 balloonsContainer.appendChild(balloon);

 setTimeout(() => balloon.remove(), 3000);

 }

};

const resetGame = () => {

 boxes.forEach(box => {

 box.innerText = "";

 box.disabled = false;

 });

 moveCount = 0;

 gameOver = false;

 msgContainer.classList.add("hide");

 balloonsContainer.innerHTML = "";

};

resetBtn.addEventListener("click", resetGame);

newGameBtn.addEventListener("click", resetGame);
