const fruits = [
  {
    name: "Apple",
    image: "https://raw.githubusercontent.com/rileysheehan-debug/game-assets/main/Unknown.jpeg"
  },
  {
    name: "Banana",
    image: "https://raw.githubusercontent.com/rileysheehan-debug/game-assets/main/Unknown-1.jpeg"
  },
  {
    name: "Pineapple",
    image: "https://raw.githubusercontent.com/rileysheehan-debug/game-assets/main/Unknown-2.jpeg"
  },
  {
    name: "Orange",
    image: "https://raw.githubusercontent.com/rileysheehan-debug/game-assets/main/Unknown-3.jpeg"
  }
];

let currentFruit;
let score = 0;

function loadNewFruit() {
  const randomIndex = Math.floor(Math.random() * fruits.length);
  currentFruit = fruits[randomIndex];
  document.getElementById("fruitImage").src = currentFruit.image;
  document.getElementById("result").textContent = "";
}

function checkAnswer(answer) {
  const result = document.getElementById("result");
  if (answer === currentFruit.name) {
    result.textContent = "✅ Correct!";
    result.style.color = "green";
    score++;
  } else {
    result.textContent = "❌ Wrong! It was " + currentFruit.name;
    result.style.color = "red";
  }
  document.getElementById("score").textContent = "Score: " + score;
  setTimeout(loadNewFruit, 1500);
}

loadNewFruit();
