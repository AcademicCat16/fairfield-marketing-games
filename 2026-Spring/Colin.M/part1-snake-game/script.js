const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const box = 20;
let delay = 100;
let score = 0;
let highScore = 0;
let snake = [{ x: 300, y: 300 }];
let direction = "STOP";
let food = randomFood();
document.addEventListener("keydown", changeDirection);
function changeDirection(event) {
if (event.key === "w" && direction !== "DOWN") direction = "UP";
if (event.key === "s" && direction !== "UP") direction = "DOWN";
if (event.key === "a" && direction !== "RIGHT") direction = "LEFT";
if (event.key === "d" && direction !== "LEFT") direction = "RIGHT";
}
function randomFood() {
return {
x: Math.floor(Math.random() * 30) * box,
y: Math.floor(Math.random() * 30) * box
};
}
function drawGame() {
ctx.fillStyle = "blue";
ctx.fillRect(0, 0, 600, 600);
// Draw food
ctx.fillStyle = "red";
ctx.beginPath();
ctx.arc(food.x + 10, food.y + 10, 10, 0, Math.PI * 2);
ctx.fill();
// Draw snake
for (let i = 0; i < snake.length; i++) {
ctx.fillStyle = i === 0 ? "black" : "grey";
ctx.fillRect(snake[i].x, snake[i].y, box, box);
}
let headX = snake[0].x;
let headY = snake[0].y;
if (direction === "UP") headY -= box;
if (direction === "DOWN") headY += box;
if (direction === "LEFT") headX -= box;
if (direction === "RIGHT") headX += box;
// Border collision
if (
headX >= 600 || headX < 0 ||
headY >= 600 || headY < 0 ||
selfCollision(headX, headY)
) {
resetGame();
return;
}
// Food collision
if (headX === food.x && headY === food.y) {
score += 10;
if (score > highScore) highScore = score;
food = randomFood();
if (delay > 50) delay -= 2;
} else {
snake.pop();
}
const newHead = { x: headX, y: headY };
snake.unshift(newHead);
document.getElementById("score").innerHTML =
"Score: " + score + " High Score: " + highScore;
}
function selfCollision(x, y) {
for (let i = 1; i < snake.length; i++) {
if (snake[i].x === x && snake[i].y === y) {
return true;
}
}
return false;
}
function resetGame() {
snake = [{ x: 300, y: 300 }];
direction = "STOP";
score = 0;
delay = 100;
}
function gameLoop() {
drawGame();
setTimeout(gameLoop, delay);
}
gameLoop();
