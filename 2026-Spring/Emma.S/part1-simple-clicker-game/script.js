var score        = 0;
var scoreDisplay = document.getElementById("score");
var button       = document.getElementById("clickBtn");

button.addEventListener("click", function() {
  score++;
  scoreDisplay.textContent = "Score: " + score;
});
