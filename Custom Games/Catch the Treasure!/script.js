let score = 0;
const box = document.getElementById("box");
const scoreDisplay = document.getElementById("score");
box.addEventListener("click", function() {
score++;
scoreDisplay.textContent = score;
});function moveBox() {
const x = Math.random() * 300;
const y = Math.random() * 300;
box.style.position = "absolute";
box.style.left = x + "px";
box.style.top = y + "px";
}
box.addEventListener("click", function() {
score++;
scoreDisplay.textContent = score;
moveBox();
});let timeLeft = 15;
const timer = document.createElement("p");
timer.textContent = "Time: " + timeLeft;
document.querySelector(".game").appendChild(timer);
const countdown = setInterval(function() {
timeLeft--;
timer.textContent = "Time: " + timeLeft;
if (timeLeft <= 0) {
clearInterval(countdown);
alert("Game Over! Final Score: " + score);
}
}, 1000);
