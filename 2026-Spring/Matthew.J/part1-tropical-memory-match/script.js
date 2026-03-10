document.addEventListener("DOMContentLoaded", function () {
  // Fixed: emojis were blank in original paste
  const tropicalIcons = ["🌴", "🦜", "🍍", "🐠", "🌺", "🦀", "🐚", "🌊"];

  let firstCard  = null;
  let secondCard = null;
  let lockBoard  = false;
  let moves      = 0;
  let matches    = 0;
  let timer;
  let seconds    = 0;

  const table        = document.querySelector("table");
  const movesDisplay = document.getElementById("moves");
  const timeDisplay  = document.getElementById("time");
  const restartBtn   = document.getElementById("restart");

  function startGame() {
    let cards = [...tropicalIcons, ...tropicalIcons];
    cards.sort(() => Math.random() - 0.5);

    table.innerHTML = "";
    firstCard  = null;
    secondCard = null;
    lockBoard  = false;
    moves      = 0;
    matches    = 0;
    seconds    = 0;

    movesDisplay.textContent = "Moves: 0";
    timeDisplay.textContent  = "Time: 0s";
    clearInterval(timer);
    timer = setInterval(() => {
      seconds++;
      timeDisplay.textContent = "Time: " + seconds + "s";
    }, 1000);

    let index = 0;
    for (let i = 0; i < 4; i++) {
      const row = document.createElement("tr");
      for (let j = 0; j < 4; j++) {
        const cell = document.createElement("td");
        cell.dataset.symbol = cards[index];
        cell.classList.add("facedown");
        cell.addEventListener("click", flipCard);
        row.appendChild(cell);
        index++;
      }
      table.appendChild(row);
    }
  }

  function flipCard() {
    if (lockBoard) return;
    if (this.classList.contains("matched")) return;
    if (!this.classList.contains("facedown")) return;

    // Reveal: remove facedown so the emoji color shows
    this.classList.remove("facedown");
    this.textContent = this.dataset.symbol;

    if (!firstCard) {
      firstCard = this;
      return;
    }

    secondCard = this;
    moves++;
    movesDisplay.textContent = "Moves: " + moves;

    if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
      firstCard.classList.add("matched");
      secondCard.classList.add("matched");
      matches++;
      firstCard  = null;
      secondCard = null;

      if (matches === tropicalIcons.length) {
        clearInterval(timer);
        setTimeout(() => {
          alert("🌴 You won in " + moves + " moves and " + seconds + " seconds!");
        }, 300);
      }
    } else {
      lockBoard = true;
      setTimeout(() => {
        firstCard.textContent = "";
        firstCard.classList.add("facedown");
        secondCard.textContent = "";
        secondCard.classList.add("facedown");
        firstCard  = null;
        secondCard = null;
        lockBoard  = false;
      }, 800);
    }
  }

  restartBtn.addEventListener("click", startGame);
  startGame();
});
