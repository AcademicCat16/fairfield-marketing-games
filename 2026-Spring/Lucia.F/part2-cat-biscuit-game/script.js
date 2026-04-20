const gameContainer = document.querySelector('.game-container');
const cat = document.querySelector('.cat');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const gameOverScreen = document.getElementById('gameOver');
const finalScoreDisplay = document.getElementById('finalScore');

// Game variables
let score = 0;
let timeLeft = 60;
let gameActive = true;
let catX = 370;
let catY = 495;
const catSpeed = 15;
const catSize = 60;
const biscuitSize = 30;
const containerWidth = 800;
const containerHeight = 600;
const eatRange = 60;

// Keyboard input
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ') {
        e.preventDefault();
        eatBiscuit();
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Create biscuits
const biscuits = [];
function createBiscuit() {
    const biscuit = document.createElement('div');
    biscuit.classList.add('biscuit');
    const x = Math.random() * (containerWidth - biscuitSize);
    const y = Math.random() * (containerHeight - 100) + 60;
    biscuit.style.left = x + 'px';
    biscuit.style.top = y + 'px';
    gameContainer.appendChild(biscuit);
    biscuits.push({
        element: biscuit,
        x: x,
        y: y,
        id: Date.now() + Math.random()
    });
}

// Create initial biscuits
for (let i = 0; i < 5; i++) {
    createBiscuit();
}

// Eat biscuit
function eatBiscuit() {
    if (!gameActive) return;

    for (let i = biscuits.length - 1; i >= 0; i--) {
        const biscuit = biscuits[i];
        const distance = Math.hypot(
            catX + catSize / 2 - (biscuit.x + biscuitSize / 2),
            catY + catSize / 2 - (biscuit.y + biscuitSize / 2)
        );

        if (distance < eatRange) {
            biscuit.element.remove();
            biscuits.splice(i, 1);
            score++;
            scoreDisplay.textContent = score;
            createBiscuit();
        }
    }
}

// Update cat position
function updateCat() {
    let newX = catX;
    let newY = catY;
    let moved = false;
    let direction = null;

    if (keys['ArrowLeft'] || keys['a']) {
        newX -= catSpeed;
        direction = 'left';
        moved = true;
    }
    if (keys['ArrowRight'] || keys['d']) {
        newX += catSpeed;
        direction = 'right';
        moved = true;
    }
    if (keys['ArrowUp'] || keys['w']) {
        newY -= catSpeed;
        moved = true;
    }
    if (keys['ArrowDown'] || keys['s']) {
        newY += catSpeed;
        moved = true;
    }

    // Boundary checking
    newX = Math.max(0, Math.min(newX, containerWidth - catSize));
    newY = Math.max(60, Math.min(newY, containerHeight - catSize));

    catX = newX;
    catY = newY;

    // Update cat appearance
    if (direction === 'left') {
        cat.classList.add('left');
        cat.classList.remove('right');
    } else if (direction === 'right') {
        cat.classList.add('right');
        cat.classList.remove('left');
    }

    cat.style.left = catX + 'px';
    cat.style.top = catY + 'px';
}

// Game loop
function gameLoop() {
    if (gameActive) {
        updateCat();
        requestAnimationFrame(gameLoop);
    }
}

// Timer
const timerInterval = setInterval(() => {
    if (timeLeft > 0) {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
    } else {
        endGame();
        clearInterval(timerInterval);
    }
}, 1000);

// End game
function endGame() {
    gameActive = false;
    gameOverScreen.style.display = 'block';
    finalScoreDisplay.textContent = score;
}

// Start game loop
gameLoop();

