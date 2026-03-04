let deck = [];
let playerHand = [];
let dealerHand = [];
let gameOver = true;
let bank = 1000;
let currentBet = 0;
const suits = ["♠", "♥", "♦", "♣"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
function createDeck() {
 deck = [];
 for (let suit of suits) {
for (let value of values) {
deck.push({ value, suit });
}
 }
}
function shuffleDeck() {
 deck.sort(() => Math.random() - 0.5);
}
function getCardValue(card) {
 if (card.value === "A") return 11;
 if (["K", "Q", "J"].includes(card.value)) return 10;
 return parseInt(card.value);
}
function calculateScore(hand) {
 let score = 0;
 let aces = 0;
 for (let card of hand) {
score += getCardValue(card);
if (card.value === "A") aces++;
 }
 while (score > 21 && aces > 0) {
score -= 10;
 aces--;
 }
 return score;

}
function dealCard(hand) {
 hand.push(deck.pop());
}
function renderHand(hand, elementId, scoreId) {
 const container = document.getElementById(elementId);
 container.innerHTML = "";
 hand.forEach(card => {
let cardDiv = document.createElement("div");
cardDiv.classList.add("card");
if (card.suit === "♥" || card.suit === "♦") {
cardDiv.classList.add("red");
}
cardDiv.innerText = card.value + card.suit;
container.appendChild(cardDiv);
 });
 document.getElementById(scoreId).innerText =
"Score: " + calculateScore(hand);
}
function updateBank() {
 document.getElementById("bank").innerText = bank;
 document.getElementById("bet").innerText = currentBet;
}
function checkWinner() {
 let playerScore = calculateScore(playerHand);
 let dealerScore = calculateScore(dealerHand);
 if (playerScore > 21) {
bank -= currentBet;
 endGame("You Bust! Dealer Wins.");
 } else if (dealerScore > 21 || playerScore > dealerScore) {
bank += currentBet;
 endGame("You Win!");
 } else if (dealerScore > playerScore) {
bank -= currentBet;
 endGame("Dealer Wins!");
 } else {
 endGame("Push (Tie)");
 }
 updateBank();
}
function dealerTurn() {
 while (calculateScore(dealerHand) < 17) {
dealCard(dealerHand);

 }
 renderHand(dealerHand, "dealer-cards", "dealer-score");
 checkWinner();
}
function endGame(message) {
 gameOver = true;
 document.getElementById("result").innerText = message;
}
function startHand() {
 if (currentBet === 0) return;
 gameOver = false;
 playerHand = [];
 dealerHand = [];
 document.getElementById("result").innerText = "";
 createDeck();
 shuffleDeck();
 dealCard(playerHand);
 dealCard(dealerHand);
 dealCard(playerHand);
 dealCard(dealerHand);
 renderHand(playerHand, "player-cards", "player-score");
 renderHand(dealerHand, "dealer-cards", "dealer-score");
}
document.querySelectorAll(".bet-btn").forEach(button => {
 button.addEventListener("click", () => {
if (gameOver && bank >= button.dataset.amount) {
currentBet = parseInt(button.dataset.amount);
updateBank();
startHand();
}
 });
});
document.getElementById("hit").addEventListener("click", () => {
 if (!gameOver) {
dealCard(playerHand);
renderHand(playerHand, "player-cards", "player-score");
if (calculateScore(playerHand) > 21) {
checkWinner();
}
 }
});
document.getElementById("stand").addEventListener("click", () => {
 if (!gameOver) {
dealerTurn();
 }

});
document.getElementById("restart").addEventListener("click", () => {
 if (gameOver) {
currentBet = 0;
updateBank();
document.getElementById("dealer-cards").innerHTML = "";
document.getElementById("player-cards").innerHTML = "";
document.getElementById("dealer-score").innerText = "";
document.getElementById("player-score").innerText = "";
document.getElementById("result").innerText = "";
 }
});
updateBank();
