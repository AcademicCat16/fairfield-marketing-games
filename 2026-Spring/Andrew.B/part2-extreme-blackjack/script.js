const CARD_BACK =
"https://raw.githubusercontent.com/andrewbinck-cyber/gamea/refs/heads/main/Copilot_20260301_150610.png";
const suits = ["♠", "♥", "♦", "♣"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
let deck = [];
let playerHand = [];
let dealerHand = [];
const dealerCards = document.getElementById("dealer-cards");
const playerCards = document.getElementById("player-cards");
const dealerScore = document.getElementById("dealer-score");
const playerScore = document.getElementById("player-score");
const message = document.getElementById("message");
document.getElementById("hit").onclick = hit;
document.getElementById("stand").onclick = stand;
document.getElementById("restart").onclick = startGame;
startGame();
function createDeck() {
deck = [];
for (let s of suits) {
for (let v of values) {
deck.push({ suit: s, value: v });
}
}
deck.sort(() => Math.random() - 0.5);
}
function startGame() {
createDeck();
playerHand = [drawCard(), drawCard()];
dealerHand = [drawCard(), drawCard()];
message.textContent = "";
updateDisplay(true);
}
function drawCard() {
return deck.pop();
}
function getHandValue(hand) {
let value = 0;
let aces = 0;
hand.forEach(card => {
if (card.value === "A") {
aces++;
value += 11;
} else if (["J", "Q", "K"].includes(card.value)) {
value += 10;
} else {
value += parseInt(card.value);
}
});
while (value > 21 && aces > 0) {
value -= 10;
aces--;
}
return value;
}
function updateDisplay(hideDealerCard = false) {
dealerCards.innerHTML = "";
playerCards.innerHTML = "";
dealerHand.forEach((card, index) => {
const div = document.createElement("div");
div.className = "card";
if (index === 0 && hideDealerCard) {
div.classList.add("hidden-card");
} else {
div.textContent = card.value + card.suit;
}
dealerCards.appendChild(div);
});
playerHand.forEach(card => {
const div = document.createElement("div");
div.className = "card";
div.textContent = card.value + card.suit;
playerCards.appendChild(div);
});
dealerScore.textContent = hideDealerCard
? "Score: ?"
: "Score: " + getHandValue(dealerHand);
playerScore.textContent = "Score: " + getHandValue(playerHand);
}
function hit() {
playerHand.push(drawCard());
updateDisplay(true);
if (getHandValue(playerHand) > 21) {
message.textContent = "You busted! Dealer wins.";
updateDisplay(false);
}
}
function stand() {
while (getHandValue(dealerHand) < 17) {
dealerHand.push(drawCard());
}
updateDisplay(false);
const playerVal = getHandValue(playerHand);
const dealerVal = getHandValue(dealerHand);
if (dealerVal > 21) {
message.textContent = "Dealer busts! You win!";
} else if (playerVal > dealerVal) {
message.textContent = "You win!";
} else if (playerVal < dealerVal) {
message.textContent = "Dealer wins!";
} else {
message.textContent = "It's a tie!";
}
}
