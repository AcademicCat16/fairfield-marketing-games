const characters = [
"🧽","🧽",
"⭐","⭐",
"🦑","🦑",
"🦀","🦀",
"🐌","🐌",
"🍍","🍍"
];
const game = document.getElementById("game");
const status = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const strikesText = document.getElementById("strikes");
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;
let strikes = 0;
function startGame() {
game.innerHTML = "";
status.textContent = "";
matches = 0;
strikes = 0;
strikesText.textContent = "Strikes: 0 / 3";
firstCard = null;
secondCard = null;
lockBoard = false;
const shuffled = [...characters].sort(() => 0.5 - Math.random());
shuffled.forEach(symbol => {
const card = document.createElement("div");
card.classList.add("card");
card.dataset.symbol = symbol;
card.textContent = "";
card.addEventListener("click", flipCard);
game.appendChild(card);
});
}
function flipCard() {
if (lockBoard || this === firstCard) return;
this.textContent = this.dataset.symbol;
if (!firstCard) {
firstCard = this;
return;
}
secondCard = this;
checkMatch();
}
function checkMatch() {
if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
matches++;
resetTurn();
if (matches === characters.length / 2) {
status.textContent = "You found all the matches! 🎉";
}
} else {
strikes++;
strikesText.textContent = `Strikes: ${strikes} / 3`;
if (strikes >= 3) {
status.textContent = "Game Over! Too many strikes 😢";
lockBoard = true;
return;
}
lockBoard = true;
setTimeout(() => {
firstCard.textContent = "";
secondCard.textContent = "";
resetTurn();
}, 800);
}
}
function resetTurn() {
[firstCard, secondCard] = [null, null];
lockBoard = false;
}
restartBtn.addEventListener("click", startGame);
startGame();
