const symbols = [
  "⭐","🔥","⚡","💎","🌙","🎵","🍀","👑",
  "🤿","😎","😸","👽","👯"
];

let firstCard, secondCard, lock, moves, matches;

function startGame() {
  const game   = document.getElementById("game");
  const winMsg = document.getElementById("winMsg");

  game.innerHTML  = "";
  winMsg.style.display = "none";
  winMsg.textContent   = "";

  let cards = [...symbols, ...symbols];
  cards.sort(() => Math.random() - 0.5);

  firstCard = null;
  secondCard = null;
  lock    = false;
  moves   = 0;
  matches = 0;

  document.getElementById("moves").textContent = moves;

  cards.forEach(symbol => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.symbol = symbol;

    card.onclick = () => {
      if (lock || card.classList.contains("flipped") || card.classList.contains("matched")) return;

      card.classList.add("flipped");
      card.textContent = symbol;

      if (!firstCard) {
        firstCard = card;
        return;
      }

      secondCard = card;
      lock = true;
      moves++;
      document.getElementById("moves").textContent = moves;

      if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        matches++;

        if (matches === symbols.length) {
          setTimeout(() => {
            winMsg.textContent = `🎉 You won in ${moves} moves!`;
            winMsg.style.display = "block";
          }, 300);
        }

        resetTurn();
      } else {
        setTimeout(() => {
          firstCard.classList.remove("flipped");
          secondCard.classList.remove("flipped");
          firstCard.textContent  = "";
          secondCard.textContent = "";
          resetTurn();
        }, 800);
      }
    };

    game.appendChild(card);
  });
}

function resetTurn() {
  firstCard  = null;
  secondCard = null;
  lock       = false;
}

startGame();
