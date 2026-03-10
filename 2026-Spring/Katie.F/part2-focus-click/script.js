let score = 10;
const scoreDisplay = document.getElementById("score");
const message = document.getElementById("message");
const button = document.getElementById("focusBtn");

button.addEventListener("click", function() {
  score += 1;
  updateGame();
});

setInterval(function() {
  if (button.disabled) return;
  let randomChance = Math.random();
  if (randomChance > 0.6) {
    score -= 3;
    message.innerText = "Distraction! You lost focus 😵";
    updateGame();
  }
}, 2000);

function updateGame() {
  scoreDisplay.innerText = score;
  if (score <= 0) {
    message.innerText = "You got completely distracted. Game Over!";
    button.disabled = true;
  }
  if (score >= 30) {
    message.innerText = "You stayed focused and finished your work! 🎉";
    button.disabled = true;
  }
}
