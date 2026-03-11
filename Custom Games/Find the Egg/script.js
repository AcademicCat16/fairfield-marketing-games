const hats = [
  document.getElementById("hat0"),
  document.getElementById("hat1"),
  document.getElementById("hat2")
];

let eggIndex = 0;
let shuffling = false;

// Set starting positions
function setPositions(order = [0, 1, 2]) {
  const positions = [150, 340, 530];
  for (let i = 0; i < hats.length; i++) {
    hats[i].style.left = positions[order[i]] + "px";
  }
}

setPositions();

function startGame() {
  if (shuffling) return;
  document.getElementById("message").textContent = "Watch carefully...";

  // Hide all eggs
  hats.forEach(hat => hat.querySelector(".egg").style.display = "none");

  // Random egg position
  eggIndex = Math.floor(Math.random() * 3);
  hats[eggIndex].querySelector(".egg").style.display = "block";

  setTimeout(() => {
    hats[eggIndex].querySelector(".egg").style.display = "none";
    shuffleHats();
  }, 2000);
}

function shuffleHats() {
  shuffling = true;
  document.getElementById("message").textContent = "Shuffling...";

  let order = [0, 1, 2];
  let shuffleCount = 10;
  let count = 0;

  const interval = setInterval(() => {
    let i = Math.floor(Math.random() * 3);
    let j = Math.floor(Math.random() * 3);
    [order[i], order[j]] = [order[j], order[i]];
    setPositions(order);
    count++;

    if (count >= shuffleCount) {
      clearInterval(interval);
      shuffling = false;
      document.getElementById("message").textContent = "Which hat has the egg?";
      eggIndex = order.indexOf(eggIndex);
    }
  }, 600);
}

function guess(index) {
  if (shuffling) return;

  hats.forEach(hat => hat.querySelector(".egg").style.display = "none");
  hats[eggIndex].querySelector(".egg").style.display = "block";

  if (index === eggIndex) {
    document.getElementById("message").textContent = "✅ Correct! You found the egg!";
  } else {
    document.getElementById("message").textContent = "❌ Wrong! Try again.";
  }
}
