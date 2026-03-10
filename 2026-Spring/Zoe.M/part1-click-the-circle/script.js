const target = document.getElementById("target");
const gameArea = document.getElementById("gameArea");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const message = document.getElementById("message");
const startBtn = document.getElementById("startBtn");
let score = 0;
let timeLeft = 20;
let timer = null;
let playing = false;
function moveTarget() {
const maxX = gameArea.clientWidth - target.clientWidth;
const maxY = gameArea.clientHeight - target.clientHeight;
const x = Math.floor(Math.random() * maxX);
const y = Math.floor(Math.random() * maxY);
target.style.left = x + "px";
target.style.top = y + "px";
}
function startGame() {
if (playing) return;
playing = true;
score = 0;
timeLeft = 20;
scoreEl.textContent = score;
timeEl.textContent = timeLeft;
message.textContent = "GO! Click it!";
target.style.display = "block";
moveTarget();
timer = setInterval(() => {
timeLeft--;
timeEl.textContent = timeLeft;
if (timeLeft <= 0) {
endGame();
}
}, 1000);
}
function endGame() {
playing = false;
clearInterval(timer);
target.style.display = "none";
message.textContent = `Time’s up! Final score: ${score}`;
}
target.addEventListener("click", () => {
if (!playing) return;
score++;
scoreEl.textContent = score;
moveTarget();
});
startBtn.addEventListener("click", startGame);
