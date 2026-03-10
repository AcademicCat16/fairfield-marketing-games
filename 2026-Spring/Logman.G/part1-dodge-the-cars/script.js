const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Constants
const GRID_SIZE = 40;
const PLAYER_SIZE = 40;
const CAR_WIDTH = 80;
const CAR_HEIGHT = 40;

// Colors
const COLORS = {
    WHITE: '#FFFFFF',
    BLACK: '#000000',
    GREEN: '#228B22',
    RED: '#DC143C',
    YELLOW: '#FFFF00',
    BLUE: '#4169E1',
    GRAY: '#808080',
    DARK_GREEN: '#00B400',
    ORANGE: '#FF8C00',
    PURPLE: '#800080'
};

// Player class
class Player {
    constructor() {
        this.x = canvas.width / 2 - PLAYER_SIZE / 2;
        this.y = canvas.height - GRID_SIZE - PLAYER_SIZE;
        this.width = PLAYER_SIZE;
        this.height = PLAYER_SIZE;
        this.speed = GRID_SIZE;
    }

    update(keys) {
        if (keys['ArrowUp']) this.y -= this.speed;
        if (keys['ArrowDown']) this.y += this.speed;
        if (keys['ArrowLeft']) this.x -= this.speed;
        if (keys['ArrowRight']) this.x += this.speed;

        // Keep player on screen
        this.x = Math.max(0, Math.min(this.x, canvas.width - this.width));
        this.y = Math.max(0, Math.min(this.y, canvas.height - this.height));
    }

    draw() {
        // Draw body
        ctx.fillStyle = COLORS.YELLOW;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Draw eyes
        ctx.fillStyle = COLORS.BLUE;
        ctx.beginPath();
        ctx.arc(this.x + 12, this.y + 12, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 28, this.y + 12, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    getRect() {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }
}

// Car class
class Car {
    constructor(y, speed, direction, color = COLORS.RED) {
        this.width = CAR_WIDTH;
        this.height = CAR_HEIGHT;
        this.y = y;
        this.speed = speed * direction;
        this.direction = direction;
        this.color = color;

        if (direction === 1) {
            this.x = -this.width;
        } else {
            this.x = canvas.width;
        }
    }

    update() {
        this.x += this.speed;
    }

    draw() {
        // Draw car body
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Draw windows
        ctx.fillStyle = COLORS.YELLOW;
        ctx.fillRect(this.x + 10, this.y + 5, 15, 10);
        ctx.fillRect(this.x + 55, this.y + 5, 15, 10);
    }

    isOffScreen() {
        return this.x > canvas.width || this.x + this.width < 0;
    }

    getRect() {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }
}

// Game class
class Game {
    constructor() {
        this.player = new Player();
        this.cars = [];
        this.score = 0;
        this.level = 1;
        this.gameOver = false;
        this.spawnTimer = 0;
        this.spawnDelay = 80;
        this.playerStartY = this.player.y;
        this.keys = {};
        this.lastMoveTime = 0;
        this.moveCooldown = 150;
    }

    spawnCars() {
        this.spawnTimer++;

        if (this.spawnTimer > this.spawnDelay) {
            this.spawnTimer = 0;

            const laneY = Math.floor(Math.random() * 10 + 2) * GRID_SIZE;

            if (laneY < this.playerStartY) {
                const direction = Math.random() > 0.5 ? 1 : -1;
                const speedVariation = (Math.random() - 0.5) * 2;
                
                // Vary car colors based on level
                let carColor = COLORS.RED;
                if (this.level >= 3) {
                    const colors = [COLORS.RED, COLORS.ORANGE, COLORS.BLUE];
                    carColor = colors[Math.floor(Math.random() * colors.length)];
                }
                
                const speed = 3 + (this.level - 1) * 0.8 + speedVariation;
                const car = new Car(laneY, speed, direction, carColor);
                this.cars.push(car);
            }
        }
    }

    update(currentTime) {
        // Update player with movement cooldown
        if (currentTime - this.lastMoveTime > this.moveCooldown) {
            const movedX = this.player.x;
            const movedY = this.player.y;

            if (this.keys['ArrowUp']) {
                this.player.y -= GRID_SIZE;
                this.lastMoveTime = currentTime;
            }
            if (this.keys['ArrowDown']) {
                this.player.y += GRID_SIZE;
                this.lastMoveTime = currentTime;
            }
            if (this.keys['ArrowLeft']) {
                this.player.x -= GRID_SIZE;
                this.lastMoveTime = currentTime;
            }
            if (this.keys['ArrowRight']) {
                this.player.x += GRID_SIZE;
                this.lastMoveTime = currentTime;
            }

            // Boundary checking
            this.player.x = Math.max(0, Math.min(this.player.x, canvas.width - PLAYER_SIZE));
            this.player.y = Math.max(0, Math.min(this.player.y, canvas.height - PLAYER_SIZE));
        }

        this.spawnCars();

        // Update cars
        for (let i = this.cars.length - 1; i >= 0; i--) {
            this.cars[i].update();
            if (this.cars[i].isOffScreen()) {
                this.cars.splice(i, 1);
            }
        }

        // Check collisions
        const playerRect = this.player.getRect();
        for (let car of this.cars) {
            const carRect = car.getRect();
            if (this.checkCollision(playerRect, carRect)) {
                this.gameOver = true;
            }
        }

        // Update score
        const newScore = Math.floor((this.playerStartY - this.player.y) / GRID_SIZE);
        if (newScore > this.score) {
            this.score = newScore;
            this.level = 1 + Math.floor(this.score / 50);
            this.spawnDelay = Math.max(30, 80 - this.level * 8);
        }

        // Game over if player reaches top
        if (this.player.y < 0) {
            this.gameOver = true;
        }
    }

    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    draw() {
        // Draw grass
        ctx.fillStyle = COLORS.GREEN;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw lanes
        for (let y = 0; y < canvas.height; y += GRID_SIZE * 2) {
            ctx.fillStyle = COLORS.DARK_GREEN;
            ctx.fillRect(0, y, canvas.width, GRID_SIZE);
        }

        // Draw road
        for (let y = GRID_SIZE * 2; y < canvas.height; y += GRID_SIZE * 3) {
            ctx.fillStyle = COLORS.GRAY;
            ctx.fillRect(0, y, canvas.width, GRID_SIZE * 2);

            // Draw road markings
            ctx.strokeStyle = COLORS.YELLOW;
            ctx.lineWidth = 3;
            ctx.setLineDash([50, 50]);
            ctx.beginPath();
            ctx.moveTo(0, y + GRID_SIZE);
            ctx.lineTo(canvas.width, y + GRID_SIZE);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Draw cars
        for (let car of this.cars) {
            car.draw();
        }

        // Draw player
        this.player.draw();

        // Draw UI
        document.getElementById('score').textContent = `Score: ${this.score}`;
        document.getElementById('level').textContent = `Level: ${this.level}`;
    }

    reset() {
        this.player = new Player();
        this.cars = [];
        this.score = 0;
        this.level = 1;
        this.gameOver = false;
        this.spawnTimer = 0;
        this.spawnDelay = 80;
        this.playerStartY = this.player.y;
        this.lastMoveTime = 0;
        document.getElementById('gameOverScreen').style.display = 'none';
    }
}

// Game instance
let game = new Game();
let lastTime = Date.now();

// Input handling
window.addEventListener('keydown', (e) => {
    game.keys[e.key] = true;
    if (e.key === 'r' || e.key === 'R') {
        if (game.gameOver) {
            game.reset();
        }
    }
});

window.addEventListener('keyup', (e) => {
    game.keys[e.key] = false;
});

// Game loop
function gameLoop() {
    const currentTime = Date.now();
    
    if (!game.gameOver) {
        game.update(currentTime);
    }

    game.draw();

    if (game.gameOver) {
        document.getElementById('gameOverScreen').style.display = 'block';
        document.getElementById('finalScore').textContent = `Final Score: ${game.score}`;
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();
