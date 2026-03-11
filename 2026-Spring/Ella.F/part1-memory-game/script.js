const BUNNY = '🐰';

const EMOJI_SETS = {
  easy: [
    '🐶','🐶','🐱','🐱','🐭','🐭','🐹','🐹',
    '🐰','🐰','🦊','🦊','🐻','🐻','🐼','🐼'
  ],
  medium: [
    '🦁','🦁','🐯','🐯','🐸','🐸','🐵','🐵',
    '🐨','🐨','🐷','🐷','🐮','🐮','🐰','🐰'
  ],
  hard: [
    '🐶','🐶','🐱','🐱','🐭','🐭','🐹','🐹','🐰','🐰','🦊','🦊',
    '🐻','🐻','🐼','🐼','🦁','🦁','🐯','🐯','🐸','🐸','🐵','🐵',
    '🐨','🐨','🐷','🐷','🐮','🐮','🐔','🐔','🦄','🦄','🐙','🐙'
  ]
};

// ── State ──
let difficulty    = 'easy';
let gameBoard     = [];
let flipped       = [];
let matched       = [];
let moves         = 0;
let score         = 0;
let isProcessing  = false;
let startTime     = null;
let timerInterval = null;

// ── DOM refs (grabbed after DOMContentLoaded) ──
let elMoves, elMatches, elScore, elTimer, elBoard, elMessage;

// ── Init ──
function initGame() {
  clearInterval(timerInterval);

  gameBoard    = [...EMOJI_SETS[difficulty]].sort(() => Math.random() - 0.5);
  flipped      = [];
  matched      = [];
  moves        = 0;
  score        = 0;
  isProcessing = false;
  startTime    = Date.now();

  elMessage.textContent = '';
  elMessage.classList.remove('win-message');

  // fix the /8 or /18 pair count display
  const pairCount = gameBoard.length / 2;
  elMatches.parentElement.innerHTML =
    `<span id="matches">0</span>/${pairCount}`;
  elMatches = document.getElementById('matches');

  updateStats();
  renderBoard();
  startTimer();
}

// ── Render ──
function renderBoard() {
  const diffClass = difficulty === 'hard' ? 'hard' : '';
  elBoard.className = `game-board ${diffClass}`;
  elBoard.innerHTML = '';

  gameBoard.forEach((emoji, index) => {
    const card = document.createElement('button');
    card.className = 'card';
    card.dataset.index = index;

    const sparkleLayer = document.createElement('span');
    sparkleLayer.className = 'sparkle-layer';
    card.appendChild(sparkleLayer);

    if (matched.includes(index)) {
      card.classList.add('matched');
      card.textContent = emoji;
    } else if (flipped.includes(index)) {
      card.classList.add('flipped');
      card.textContent = emoji;
    } else {
      card.classList.add('covered');
      card.textContent = '?';
    }

    card.addEventListener('click', () => flipCard(index));
    elBoard.appendChild(card);
  });
}

// ── Flip ──
function flipCard(index) {
  if (isProcessing || flipped.includes(index) || matched.includes(index)) return;

  flipped.push(index);
  renderBoard();

  if (flipped.length === 2) {
    isProcessing = true;
    moves++;
    updateStats();
    checkMatch();
  }
}

// ── Match check ──
function checkMatch() {
  const [i1, i2] = flipped;
  const e1 = gameBoard[i1], e2 = gameBoard[i2];

  if (e1 === e2) {
    const isBunny = e1 === BUNNY;
    score += isBunny ? 20 : 10;

    matched.push(i1, i2);
    flipped = [];
    isProcessing = false;

    updateStats();
    renderBoard();
    triggerSparkles([i1, i2], isBunny);

    if (matched.length === gameBoard.length) endGame();
  } else {
    setTimeout(() => {
      flipped = [];
      isProcessing = false;
      renderBoard();
    }, 800);
  }
}

// ── Sparkles ──
function triggerSparkles(indexes, isGold) {
  requestAnimationFrame(() => {
    indexes.forEach(i => {
      const el = elBoard.querySelector(`.card[data-index="${i}"]`);
      if (!el) return;
      el.classList.add('sparkle');
      if (isGold) el.classList.add('gold');
      setTimeout(() => { el.classList.remove('sparkle', 'gold'); }, 650);
    });
  });
}

// ── Stats ──
function updateStats() {
  elMoves.textContent   = moves;
  elMatches.textContent = matched.length / 2;
  elScore.textContent   = score;
}

// ── Timer ──
function startTimer() {
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const m = Math.floor(elapsed / 60);
    const s = elapsed % 60;
    elTimer.textContent = `${m}:${s.toString().padStart(2, '0')}`;
  }, 200);
}

// ── End ──
function endGame() {
  clearInterval(timerInterval);
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const m = Math.floor(elapsed / 60);
  const s = elapsed % 60;
  elMessage.innerHTML =
    `🎉 You won in <strong>${moves}</strong> moves, ` +
    `<strong>${m}:${s.toString().padStart(2,'0')}</strong>, ` +
    `and scored <strong>${score}</strong> points!`;
  elMessage.classList.add('win-message');
}

// ── Difficulty ──
function setDifficulty(level, evt) {
  difficulty = level;
  document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
  if (evt && evt.target) evt.target.classList.add('active');
  initGame();
}

// ── Reset ──
function resetGame() { initGame(); }

// ── Boot ──
window.addEventListener('DOMContentLoaded', () => {
  elMoves   = document.getElementById('moves');
  elMatches = document.getElementById('matches');
  elScore   = document.getElementById('score');
  elTimer   = document.getElementById('timer');
  elBoard   = document.getElementById('gameBoard');
  elMessage = document.getElementById('message');
  initGame();
});
