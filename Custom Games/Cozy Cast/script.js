let score = 0;
let energy = 10;
let gameOver = false;

const scoreDisplay = document.getElementById("score");
const energyDisplay = document.getElementById("energy");
const resultDisplay = document.getElementById("result");
const castBtn = document.getElementById("castBtn");
const restartBtn = document.getElementById("restartBtn");

castBtn.addEventListener("click", function() {
  if (gameOver) return;
  if (energy <= 0) return;

  resultDisplay.textContent = "Casting...";
  energy--;
  energyDisplay.textContent = "Energy: " + energy;

  setTimeout(function() {
    let random = Math.random();

    if (random < 0.5) {
      score += 5;
      resultDisplay.textContent = "🐟 You caught a Small Fish! (+5)";
    } else if (random < 0.8) {
      score += 10;
      resultDisplay.textContent = "🐠 You caught a Big Fish! (+10)";
    } else {
      resultDisplay.textContent = "🗑 You caught an old boot...";
    }

    scoreDisplay.textContent = "Score: " + score;
    checkGameStatus();
  }, 1500);
});

function checkGameStatus() {
  if (score >= 50) {
    resultDisplay.textContent = "🎉 You filled your bucket! You Win!";
    endGame();
  } else if (energy <= 0) {
    resultDisplay.textContent = "💀 You're too tired to fish. Game Over.";
    endGame();
  }
}

function endGame() {
  gameOver = true;
  castBtn.disabled = true;
  restartBtn.style.display = "inline-block";
}

restartBtn.addEventListener("click", function() {
  score = 0;
  energy = 10;
  gameOver = false;

  scoreDisplay.textContent = "Score: 0";
  energyDisplay.textContent = "Energy: 10";
  resultDisplay.textContent = 'Click "Cast Line" to start fishing!';
  castBtn.disabled = false;
  restartBtn.style.display = "none";
});
