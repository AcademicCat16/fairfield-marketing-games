var symbols = ["🏀", "🏈", "⚽", "🎾", "🏐", "⚾", "🥊", "🏓"];
var cards = [];
var board       = document.getElementById("game-board");
var scoreDisplay  = document.getElementById("score");
var turnsDisplay  = document.getElementById("turns");
var timerDisplay  = document.getElementById("timer");
var messageDisplay= document.getElementById("message");
var restartBtn    = document.getElementById("restart-btn");

var flippedCards  = [];
var matchedPairs  = 0;
var score         = 0;
var turns         = 0;
var timeLeft      = 60;
var lockBoard     = false;
var timer         = null;

function shuffle(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function startGame() {
  clearInterval(timer);
  board.innerHTML    = "";
  cards              = symbols.concat(symbols);
  shuffle(cards);
  flippedCards       = [];
  matchedPairs       = 0;
  score              = 0;
  turns              = 0;
  timeLeft           = 60;
  lockBoard          = false;
  scoreDisplay.textContent   = score;
  turnsDisplay.textContent   = turns;
  timerDisplay.textContent   = timeLeft;
  messageDisplay.textContent = "";

  cards.forEach(function(symbol) {
    var card = document.createElement("div");
    card.classList.add("card");
    card.dataset.symbol = symbol;
    card.innerHTML =
      '<div class="card-inner">' +
        '<div class="card-front">?</div>' +
        '<div class="card-back">' + symbol + '</div>' +
      '</div>';
    card.addEventListener("click", flipCard);
    board.appendChild(card);
  });

  timer = setInterval(function() {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      lockBoard = true;
      messageDisplay.textContent = "Time's up! Game over.";
    }
  }, 1000);
}

function flipCard() {
  if (lockBoard ||
      this.classList.contains("flipped") ||
      this.classList.contains("matched")) {
    return;
  }
  this.classList.add("flipped");
  flippedCards.push(this);
  if (flippedCards.length === 2) {
    turns++;
    turnsDisplay.textContent = turns;
    checkMatch();
  }
}

function checkMatch() {
  lockBoard = true;
  var card1 = flippedCards[0];
  var card2 = flippedCards[1];

  if (card1.dataset.symbol === card2.dataset.symbol) {
    card1.classList.add("matched");
    card2.classList.add("matched");
    flippedCards = [];
    matchedPairs++;
    score += 10;
    scoreDisplay.textContent = score;
    lockBoard = false;
    if (matchedPairs === symbols.length) {
      clearInterval(timer);
      messageDisplay.textContent = "You won the game! 🎉";
    }
  } else {
    score -= 2;
    scoreDisplay.textContent = score;
    setTimeout(function() {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      flippedCards = [];
      lockBoard = false;
    }, 800);
  }
}

restartBtn.addEventListener("click", startGame);
startGame();
