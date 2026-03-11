// script.js

const GRID_SIZE = 8;
const TOTAL_CARDS = GRID_SIZE * GRID_SIZE;
const TOTAL_PAIRS = TOTAL_CARDS / 2;

const CARD_TYPES = [
  '🍓','🍒','🍭','🧁','🍬','🌸','💖','🎀',
  '🩷','💎','🌈','⭐','🦄','🍰','🫧','🌷',
  '🐰','🐻','🍑','🥛','☁️','🧸','🎈','🪷',
  '🍉','🍇','🍋','🍍','🦋','🐣','🍪','🥰'
];

const INITIAL_MOVES = 25;
const GOAL_SCORE = 3200;
const POINTS_PER_MATCH = 100;

let grid = [];
let selectedCandy = null;
let secondSelectedCandy = null;
let score = 0;
let moves = INITIAL_MOVES;
let gameOver = false;
let isAnimating = false;
let hintsRemaining = 3;
let matchedPairs = 0;

const gameContainer = document.getElementById('gameContainer');
const scoreDisplay = document.getElementById('score');
const movesDisplay = document.getElementById('moves');
const goalDisplay = document.getElementById('goal');

const resetBtn = document.getElementById('resetBtn');
const hintBtn = document.getElementById('hintBtn');

const gameOverModal = document.getElementById('gameOverModal');
const finalScoreDisplay = document.getElementById('finalScore');
const goalScoreDisplay = document.getElementById('goalScore');
const gameOverTitle = document.getElementById('gameOverTitle');
const gameOverMessage2 = document.getElementById('gameOverMessage2');
const playAgainBtn = document.getElementById('playAgainBtn');

const fwCanvas = document.getElementById('fireworksCanvas');
const fwCtx = fwCanvas.getContext('2d');
let fwParticles = [];
let fwAnimating = false;

function resizeFireworksCanvas() {
  const dpr = window.devicePixelRatio || 1;
  fwCanvas.width = Math.floor(window.innerWidth * dpr);
  fwCanvas.height = Math.floor(window.innerHeight * dpr);
  fwCanvas.style.width = window.innerWidth + 'px';
  fwCanvas.style.height = window.innerHeight + 'px';
  fwCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resizeFireworksCanvas);
resizeFireworksCanvas();

function spawnFireworkBurst(x, y, count = 90) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 5;
    fwParticles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 60 + Math.random() * 30,
      age: 0,
      size: 2 + Math.random() * 2.5,
      color: `hsla(${320 + Math.random() * 40}, 95%, ${55 + Math.random() * 20}%, 1)`
    });
  }
}

function triggerFireworks() {
  const bursts = 4 + Math.floor(Math.random() * 3);
  for (let i = 0; i < bursts; i++) {
    const x = 80 + Math.random() * (window.innerWidth - 160);
    const y = 80 + Math.random() * (window.innerHeight * 0.5);
    spawnFireworkBurst(x, y, 80);
  }

  if (!fwAnimating) {
    fwAnimating = true;
    requestAnimationFrame(animateFireworks);
  }
}

function animateFireworks() {
  fwCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  fwCtx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  fwCtx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  fwParticles = fwParticles.filter(p => p.age < p.life);

  for (const p of fwParticles) {
    p.age++;
    p.vx *= 0.985;
    p.vy *= 0.985;
    p.vy += 0.04;
    p.x += p.vx;
    p.y += p.vy;

    const t = 1 - p.age / p.life;
    fwCtx.globalAlpha = Math.max(0, t);
    fwCtx.fillStyle = p.color;
    fwCtx.beginPath();
    fwCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    fwCtx.fill();
  }

  fwCtx.globalAlpha = 1;

  if (fwParticles.length > 0) {
    requestAnimationFrame(animateFireworks);
  } else {
    fwAnimating = false;
    fwCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}

function initializeGame() {
  grid = [];
  score = 0;
  moves = INITIAL_MOVES;
  gameOver = false;
  isAnimating = false;
  hintsRemaining = 3;
  matchedPairs = 0;
  selectedCandy = null;
  secondSelectedCandy = null;

  hintBtn.textContent = `Hint (${hintsRemaining})`;
  gameOverModal.style.display = 'none';

  createDeck();
  renderGrid();
  updateDisplay();
}

function createDeck() {
  const deck = [...CARD_TYPES, ...CARD_TYPES];
  shuffle(deck);

  grid = deck.map((type, index) => ({
    id: index,
    type,
    flipped: false,
    matched: false,
    revealedByHint: false
  }));
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function renderGrid() {
  gameContainer.innerHTML = '';

  grid.forEach((candy, index) => {
    const el = document.createElement('div');
    el.className = 'candy';
    el.dataset.index = index;

    if (candy === selectedCandy || candy === secondSelectedCandy) {
      el.classList.add('selected');
    }
    if (candy.flipped) el.classList.add('flipped');
    if (candy.matched) el.classList.add('matched');
    if (candy.revealedByHint) el.classList.add('revealed');

    el.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-back"></div>
        <div class="card-face card-front">
          <span class="card-symbol">${candy.type}</span>
        </div>
      </div>
    `;

    el.addEventListener('click', () => selectCandy(index));
    gameContainer.appendChild(el);
  });
}

async function selectCandy(index) {
  if (gameOver || isAnimating) return;

  const candy = grid[index];
  if (candy.matched || candy.flipped || candy.revealedByHint) return;

  if (!selectedCandy) {
    candy.flipped = true;
    selectedCandy = candy;
    renderGrid();
    return;
  }

  if (selectedCandy.id === candy.id) return;

  candy.flipped = true;
  secondSelectedCandy = candy;
  moves--;
  updateDisplay();
  renderGrid();

  isAnimating = true;
  await sleep(550);

  if (selectedCandy.type === secondSelectedCandy.type) {
    selectedCandy.matched = true;
    secondSelectedCandy.matched = true;
    matchedPairs++;
    score += POINTS_PER_MATCH;
    triggerFireworks();
  } else {
    selectedCandy.flipped = false;
    secondSelectedCandy.flipped = false;
  }

  selectedCandy = null;
  secondSelectedCandy = null;

  renderGrid();
  updateDisplay();
  checkGameOver();
  isAnimating = false;
}

function checkGameOver() {
  if (matchedPairs === TOTAL_PAIRS || score >= GOAL_SCORE) {
    gameOver = true;
    showGameOverModal(true);
    return;
  }

  if (moves <= 0) {
    gameOver = true;
    showGameOverModal(false);
  }
}

function showGameOverModal(won) {
  gameOverTitle.textContent = won ? '🎉 You Won! 🎉' : 'Game Over!';
  finalScoreDisplay.textContent = score;
  goalScoreDisplay.textContent = GOAL_SCORE;
  gameOverMessage2.style.display = won ? 'none' : 'block';
  gameOverModal.style.display = 'block';
}

function closeGameOver() {
  gameOverModal.style.display = 'none';
}

window.closeGameOver = closeGameOver;

function updateDisplay() {
  scoreDisplay.textContent = score;
  movesDisplay.textContent = moves;
  goalDisplay.textContent = GOAL_SCORE;
}

hintBtn.addEventListener('click', async () => {
  if (hintsRemaining > 0 && !gameOver && !isAnimating) {
    hintsRemaining--;
    hintBtn.textContent = `Hint (${hintsRemaining})`;
    await hint();
  }
});

async function hint() {
  isAnimating = true;

  const unmatchedMap = new Map();

  for (let i = 0; i < grid.length; i++) {
    const candy = grid[i];
    if (candy.matched) continue;

    if (!unmatchedMap.has(candy.type)) {
      unmatchedMap.set(candy.type, [candy]);
    } else {
      unmatchedMap.get(candy.type).push(candy);
    }
  }

  for (const pair of unmatchedMap.values()) {
    if (pair.length >= 2) {
      const first = pair[0];
      const second = pair[1];

      if (!first.flipped && !first.matched) first.revealedByHint = true;
      if (!second.flipped && !second.matched) second.revealedByHint = true;

      renderGrid();
      await sleep(900);

      first.revealedByHint = false;
      second.revealedByHint = false;

      renderGrid();
      break;
    }
  }

  isAnimating = false;
}

resetBtn.addEventListener('click', initializeGame);
playAgainBtn.addEventListener('click', initializeGame);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

window.addEventListener('click', (event) => {
  if (event.target === gameOverModal) closeGameOver();
});

initializeGame();
