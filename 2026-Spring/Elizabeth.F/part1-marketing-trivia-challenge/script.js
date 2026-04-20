let score = 0;

document.getElementById("question").innerHTML =
  "Which platform is best for B2B marketing?<br><br>A: TikTok<br>B: LinkedIn";

function answer(choice) {
  if (choice === "B") {
    score += 10;
    alert("Correct!");
  } else {
    alert("Wrong!");
  }

  document.getElementById("score").innerHTML = "Score: " + score;
}
score += 20;
let points = 0;

function addPoint() {
  points += 1;
  document.getElementById("points").innerHTML = "Points: " + points;

  if (points >= 10) {
    alert("Level Up! You're growing your brand!");
  }
}
