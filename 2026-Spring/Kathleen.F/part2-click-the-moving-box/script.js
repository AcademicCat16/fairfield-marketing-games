let score = 0;
let timeLeft = 15;
let gameInterval;
let timerInterval;
const box = document.getElementById("box");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");
function moveBox() {
const maxX = gameArea.clientWidth - box.clientWidth;
const maxY = gameArea.clientHeight - box.clientHeight;
const randomX = Math.floor(Math.random() * maxX);
const randomY = Math.floor(Math.random() * maxY);
box.style.left = randomX + "px";
box.style.top = randomY + "px";
}
function startGame() {
score = 0;
timeLeft = 15;
scoreDisplay.textContent = score;
timeDisplay.textContent = timeLeft;
moveBox();
gameInterval = setInterval(moveBox, 800);
timerInterval = setInterval(() => {
timeLeft--;
timeDisplay.textContent = timeLeft;
if (timeLeft <= 0) {
clearInterval(gameInterval);
clearInterval(timerInterval);
alert("Game Over! Final Score: " + score);
}
}, 1000);
}
box.addEventListener("click", () => {
score++;
scoreDisplay.textContent = score;
moveBox();
});
startBtn.addEventListener("click", startGame);
