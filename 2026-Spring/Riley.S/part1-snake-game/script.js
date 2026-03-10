const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let snake = [{ x: 10, y: 10 }];
let velocityX = 0;
let velocityY = 0;
let food = randomFood();
let score = 0;
function gameLoop() {
update();
draw();
}
function update() {
const head = {
x: snake[0].x + velocityX,
y: snake[0].y + velocityY
};
// Wall collision
if (
head.x < 0 || head.x >= tileCount ||
head.y < 0 || head.y >= tileCount
) {
resetGame();
return;
}
// Self collision
for (let part of snake) {
if (part.x === head.x && part.y === head.y) {
resetGame();
return;
}
}
snake.unshift(head);
// Food collision
if (head.x === food.x && head.y === food.y) {
score++;
scoreDisplay.textContent = "Score: " + score;
food = randomFood();
} else {
snake.pop();
}
}
function draw() {
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);
// 🩷 Pink Snake
ctx.fillStyle = "#ff4da6";
for (let part of snake) {
ctx.fillRect(
part.x * gridSize,
part.y * gridSize,
gridSize - 2,
gridSize - 2
);
}
// Food (still red)
ctx.fillStyle = "red";
ctx.fillRect(
food.x * gridSize,
food.y * gridSize,
gridSize - 2,
gridSize - 2
);
}
function randomFood() {
return {
x: Math.floor(Math.random() * tileCount),
y: Math.floor(Math.random() * tileCount)
};
}
function resetGame() {
snake = [{ x: 10, y: 10 }];
velocityX = 0;
velocityY = 0;
score = 0;
scoreDisplay.textContent = "Score: 0";
}
document.addEventListener("keydown", (e) => {
if (e.key === "ArrowUp" && velocityY !== 1) {
velocityX = 0;
velocityY = -1;
}
if (e.key === "ArrowDown" && velocityY !== -1) {
velocityX = 0;
velocityY = 1;
}
if (e.key === "ArrowLeft" && velocityX !== 1) {
velocityX = -1;
velocityY = 0;
}
if (e.key === "ArrowRight" && velocityX !== -1) {
velocityX = 1;
velocityY = 0;
}
});
// Start game
setInterval(gameLoop, 100);
