var oceanEmoji = [
  { symbol: "🐠", name: "Clownfish" },
  { symbol: "🦈", name: "Shark" },
  { symbol: "🐢", name: "Turtle" },
  { symbol: "🐳", name: "Whale" },
  { symbol: "🐙", name: "Octopus" },
  { symbol: "🦀", name: "Crab" },
  { symbol: "🐡", name: "Blowfish" },
  { symbol: "🦑", name: "Squid" }
];

var tiles        = [];
var flipped      = [];
var matched      = 0;
var score        = 0;
var lockBoard    = false;
var gameStarted  = false;

var startBtn     = document.getElementById("start");
var gameboard    = document.getElementById("gameboard");
var scoreEl      = document.getElementById("score");
var messageEl    = document.getElementById("message");

startBtn.addEventListener("click", startGame);

function shuffle(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
  }
  return array;
}

function startGame() {
  gameboard.innerHTML = "";
  flipped      = [];
  matched      = 0;
  score        = 0;
  lockBoard    = false;
  gameStarted  = true;
  scoreEl.textContent  = "Bubbles Collected: 0";
  messageEl.textContent = "";
  startBtn.textContent  = "Restart Dive";

  // Make pairs and shuffle
  var pairs = [];
  for (var i = 0; i < oceanEmoji.length; i++) {
    pairs.push(oceanEmoji[i]);
    pairs.push(oceanEmoji[i]);
  }
  shuffle(pairs);

  // Build tiles
  for (var k = 0; k < pairs.length; k++) {
    (function(item, idx) {
      var tile = document.createElement("div");
      tile.className   = "gameTile";
      tile.dataset.symbol = item.symbol;
      tile.dataset.index  = idx;
      tile.innerHTML =
        '<div class="tile-inner">' +
          '<div class="tile-front">🌊</div>' +
          '<div class="tile-back">' + item.symbol + '</div>' +
        '</div>';
      tile.addEventListener("click", function() { flipTile(this); });
      gameboard.appendChild(tile);
    })(pairs[k], k);
  }
}

function flipTile(tile) {
  if (lockBoard) return;
  if (tile.classList.contains("flipped")) return;
  if (tile.classList.contains("matched")) return;

  tile.classList.add("flipped");
  flipped.push(tile);

  if (flipped.length === 2) {
    lockBoard = true;
    checkMatch();
  }
}

function checkMatch() {
  var a = flipped[0];
  var b = flipped[1];

  if (a.dataset.symbol === b.dataset.symbol) {
    // Match!
    a.classList.add("matched");
    b.classList.add("matched");
    matched++;
    score += 10;
    scoreEl.textContent = "Bubbles Collected: " + score;
    flipped   = [];
    lockBoard = false;

    if (matched === oceanEmoji.length) {
      messageEl.textContent = "🌊 You explored the whole abyss! Final score: " + score;
      startBtn.textContent  = "Dive Again";
    } else {
      messageEl.textContent = "✨ Match! +" + 10;
      setTimeout(function() { messageEl.textContent = ""; }, 800);
    }
  } else {
    // No match
    score = Math.max(0, score - 2);
    scoreEl.textContent   = "Bubbles Collected: " + score;
    messageEl.textContent = "❌ No match...";
    setTimeout(function() {
      a.classList.remove("flipped");
      b.classList.remove("flipped");
      flipped       = [];
      lockBoard     = false;
      messageEl.textContent = "";
    }, 900);
  }
}
