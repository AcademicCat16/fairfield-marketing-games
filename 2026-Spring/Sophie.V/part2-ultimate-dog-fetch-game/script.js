const gameContainer = document.querySelector('.game-container');
const dog = document.getElementById('dog');
const ball = document.getElementById('ball');
const scoreDisplay = document.getElementById('score');
const comboDisplay = document.getElementById('combo');
const timeDisplay = document.getElementById('time');
const instructions = document.getElementById('instructions');
const gameOverScreen = document.getElementById('gameOver');

let score = 0, combo = 0, maxCombo = 0, totalCatches = 0;
let gameActive = false, gameTime = 30;
let ballDragging = false;
let ballX, ballY, isSpecialBall = false;
let dogX = 320, dogY = 410; // Home position
let obstacles = [];

function startGame() {
    instructions.style.display = 'none';
    gameOverScreen.style.display = 'none';
    gameActive = true;
    score = 0; combo = 0; totalCatches = 0; maxCombo = 0; gameTime = 30;
    
    // Clear old obstacles
    document.querySelectorAll('.obstacle').forEach(o => o.remove());
    spawnObstacles();
    resetBall();
    startTimer();
}

function startTimer() {
    const timer = setInterval(() => {
        if (!gameActive) { clearInterval(timer); return; }
        gameTime--;
        timeDisplay.textContent = gameTime;
        if (gameTime <= 0) endGame();
    }, 1000);
}

function spawnObstacles() {
    obstacles = [];
    for (let i = 0; i < 3; i++) {
        const obs = {
            x: 100 + Math.random() * 450,
            y: 150 + Math.random() * 150,
            width: 80, height: 40
        };
        const obsEl = document.createElement('div');
        obsEl.className = 'obstacle';
        obsEl.style.left = obs.x + 'px';
        obsEl.style.top = obs.y + 'px';
        obsEl.style.width = obs.width + 'px';
        obsEl.style.height = obs.height + 'px';
        gameContainer.appendChild(obsEl);
        obstacles.push(obs);
    }
}

function resetBall() {
    ballX = Math.random() * (gameContainer.offsetWidth - 30);
    ballY = 50 + Math.random() * 100;
    isSpecialBall = Math.random() < 0.33;
    ball.classList.toggle('special-ball', isSpecialBall);
    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';
}

ball.addEventListener('mousedown', () => { if(gameActive) ballDragging = true; });

document.addEventListener('mousemove', (e) => {
    if (!ballDragging || !gameActive) return;
    const rect = gameContainer.getBoundingClientRect();
    ballX = e.clientX - rect.left - 12;
    ballY = e.clientY - rect.top - 12;
    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';
});

document.addEventListener('mouseup', () => {
    if (ballDragging) {
        ballDragging = false;
        throwBall();
    }
});

function throwBall() {
    const homeX = 320, homeY = 410;
    const pathClear = checkPathClear(ballX + 12, ballY + 12, homeX + 30, homeY + 30);
    const duration = Math.hypot(homeX - ballX, homeY - ballY) * 2;

    animateDog(ballX, ballY, duration, () => {
        if (pathClear) {
            totalCatches++;
            const pts = isSpecialBall ? 5 : 1;
            combo++;
            score += pts * combo;
            if (combo > maxCombo) maxCombo = combo;
            showComboText(ballX, ballY, `+${pts * combo}`);
        } else {
            combo = 0;
            showComboText(ballX, ballY, "Blocked! 🛑");
        }
        
        scoreDisplay.textContent = score;
        comboDisplay.textContent = combo;

        setTimeout(() => {
            animateDog(homeX, homeY, 500, resetBall);
        }, 200);
    });
}

function checkPathClear(x1, y1, x2, y2) {
    for (let obs of obstacles) {
        // Check center of the path for simple blocking
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;
        if (mx > obs.x && mx < obs.x + obs.width && my > obs.y && my < obs.y + obs.height) return false;
    }
    return true;
}

function animateDog(tx, ty, dur, cb) {
    const startX = dogX, startY = dogY;
    const startTime = performance.now();
    const isMovingLeft = tx < dogX;

    function frame(now) {
        const elapsed = now - startTime;
        const p = Math.min(elapsed / dur, 1);
        dogX = startX + (tx - startX) * p;
        dogY = startY + (ty - startY) * p;
        dog.style.left = dogX + 'px';
        dog.style.top = dogY + 'px';
        dog.style.transform = `scaleX(${isMovingLeft ? -1 : 1})`;
        if (p < 1) requestAnimationFrame(frame);
        else if (cb) cb();
    }
    requestAnimationFrame(frame);
}

function showComboText(x, y, txt) {
    const el = document.createElement('div');
    el.className = 'combo-text';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.textContent = txt;
    gameContainer.appendChild(el);
    setTimeout(() => el.remove(), 1000);
}

function endGame() {
    gameActive = false;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('maxCombo').textContent = maxCombo;
    document.getElementById('totalCatches').textContent = totalCatches;
    gameOverScreen.style.display = 'flex';
}

// Initial Position
dog.style.left = dogX + 'px';
dog.style.top = dogY + 'px';
instructions.style.display = 'flex';
