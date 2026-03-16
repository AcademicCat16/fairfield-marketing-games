document.addEventListener("DOMContentLoaded", function() {
  const images = [
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
    "https://images.unsplash.com/photo-1511920170033-f8396924c348",
    "https://images.unsplash.com/photo-1498804103079-a6351b050096",
    "https://images.unsplash.com/photo-1515823064-d6e0c04616a7",
    "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0",
    "https://images.unsplash.com/photo-1505250469679-203ad9ced0cb"
  ];

  let gameImages = [...images, ...images];
  gameImages.sort(() => 0.5 - Math.random());

  const board = document.getElementById("gameBoard");
  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let moves = 0;
  let matches = 0;

  gameImages.forEach(image => {
    const card = document.createElement("div");
    card.classList.add("card");

    const inner = document.createElement("div");
    inner.classList.add("card-inner");

    const back = document.createElement("div");
    back.classList.add("card-back");

    const front = document.createElement("div");
    front.classList.add("card-front");

    const img = document.createElement("img");
    img.src = image;
    front.appendChild(img);

    inner.appendChild(back);
    inner.appendChild(front);
    card.appendChild(inner);
    board.appendChild(card);

    card.addEventListener("click", () => {
      if (lockBoard || card === firstCard) return;
      card.classList.add("flip");

      if (!firstCard) {
        firstCard = card;
        return;
      }

      secondCard = card;
      moves++;
      document.getElementById("moves").innerText = "Moves: " + moves;
      checkMatch();
    });
  });

  function checkMatch() {
    const firstImg  = firstCard.querySelector("img").src;
    const secondImg = secondCard.querySelector("img").src;

    if (firstImg === secondImg) {
      matches++;
      resetBoard();
      if (matches === images.length) {
        setTimeout(() => alert("You completed the café menu! ☕"), 500);
      }
    } else {
      lockBoard = true;
      setTimeout(() => {
        firstCard.classList.remove("flip");
        secondCard.classList.remove("flip");
        resetBoard();
      }, 1000);
    }
  }

  function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
  }
});
