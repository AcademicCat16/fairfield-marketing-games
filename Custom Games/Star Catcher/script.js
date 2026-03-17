var score    = 0;
var timeLeft = 30;
var running  = false;
var gTimer   = null;
var sTimer   = null;

function startGame() {
  if (running) return;
  running  = true;
  score    = 0;
  timeLeft = 30;

  document.getElementById("score").textContent = 0;
  document.getElementById("time").textContent  = 30;
  document.getElementById("board").innerHTML   = "";
  document.getElementById("msg").style.display = "none";

  clearInterval(gTimer);
  clearInterval(sTimer);

  gTimer = setInterval(function() {
    timeLeft--;
    document.getElementById("time").textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(gTimer);
      clearInterval(sTimer);
      running = false;
      document.getElementById("board").innerHTML = "";
      var m = document.getElementById("msg");
      m.innerHTML = "⭐ Game over! You caught <b>" + score + "</b> star" + (score !== 1 ? "s" : "") + "! ⭐<br><small style='opacity:0.65'>Press Start Game to play again</small>";
      m.style.display = "block";
    }
  }, 1000);

  sTimer = setInterval(function() {
    if (!running) return;
    var board = document.getElementById("board");
    var star  = document.createElement("div");
    star.className   = "star";
    star.textContent = "⭐";
    star.style.left  = Math.floor(Math.random() * 350) + "px";
    star.style.top   = Math.floor(Math.random() * 350) + "px";
    star.onclick = function() {
      if (!running) return;
      score++;
      document.getElementById("score").textContent = score;
      if (star.parentNode) star.parentNode.removeChild(star);
    };
    board.appendChild(star);
    setTimeout(function() {
      if (star.parentNode) star.parentNode.removeChild(star);
    }, 1500);
  }, 800);
}
