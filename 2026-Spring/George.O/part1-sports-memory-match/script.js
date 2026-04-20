var SPORTS_EMOJIS = ['⚽','🏀','🎾','🏈','⚾','🏐','🎱','🏓'];
var cards         = [];
var flipped       = [];
var matched       = 0;
var moves         = 0;
var lock          = false;
var timerInterval = null;
var seconds       = 0;
var timerStarted  = false;

var movesEl     = document.getElementById('moves');
var matchEl     = document.getElementById('matchCount');
var timerEl     = document.getElementById('timer');
var gridEl      = document.getElementById('grid');
var winBanner   = document.getElementById('winBanner');
var winMsg      = document.getElementById('winMsg');
var newGameBtn  = document.getElementById('newGameBtn');
var playAgainBtn= document.getElementById('playAgainBtn');

newGameBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', function() {
  winBanner.classList.remove('show');
  initGame();
});

function shuffle(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}

function initGame() {
  clearInterval(timerInterval);
  timerInterval  = null;
  seconds        = 0;
  moves          = 0;
  matched        = 0;
  flipped        = [];
  lock           = false;
  timerStarted   = false;

  movesEl.textContent  = '0';
  matchEl.textContent  = '0/8';
  timerEl.textContent  = '0s';

  var deck = shuffle(SPORTS_EMOJIS.concat(SPORTS_EMOJIS));
  gridEl.innerHTML = '';
  cards = [];

  for (var i = 0; i < deck.length; i++) {
    (function(emoji, idx) {
      var card = document.createElement('div');
      card.className = 'card';
      card.dataset.emoji = emoji;
      card.dataset.index = idx;
      card.innerHTML =
        '<div class="card-inner">' +
          '<div class="card-front">?</div>' +
          '<div class="card-back">' + emoji + '</div>' +
        '</div>';
      card.addEventListener('click', function() { flipCard(card); });
      gridEl.appendChild(card);
      cards.push(card);
    })(deck[i], i);
  }
}

function flipCard(card) {
  if (lock) return;
  if (card.classList.contains('flipped')) return;
  if (card.classList.contains('matched')) return;

  if (!timerStarted) {
    timerStarted = true;
    timerInterval = setInterval(function() {
      seconds++;
      timerEl.textContent = seconds + 's';
    }, 1000);
  }

  card.classList.add('flipped');
  flipped.push(card);

  if (flipped.length === 2) {
    moves++;
    movesEl.textContent = moves;
    lock = true;
    setTimeout(checkMatch, 750);
  }
}

function checkMatch() {
  var a = flipped[0];
  var b = flipped[1];

  if (a.dataset.emoji === b.dataset.emoji) {
    a.classList.add('matched');
    b.classList.add('matched');
    matched++;
    matchEl.textContent = matched + '/8';

    if (matched === 8) {
      clearInterval(timerInterval);
      setTimeout(function() {
        winMsg.textContent = moves + ' moves in ' + seconds + ' seconds — great game, George!';
        winBanner.classList.add('show');
      }, 500);
    }
  } else {
    a.classList.remove('flipped');
    b.classList.remove('flipped');
  }

  flipped = [];
  lock    = false;
}

initGame();
