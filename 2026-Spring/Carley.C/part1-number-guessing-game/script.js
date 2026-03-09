let targetNumber;
let attempts;
const highScoresKey = "guessing_game_scores";
function resetGame() {
targetNumber = Math.floor(Math.random() * 100) + 1;
attempts = 1;
document.getElementById("game-ui").style.display = "block";
document.getElementById("highscore-ui").style.display = "none";
document.getElementById("scores-display").style.display = "none";
document.getElementById("feedback").innerText = "";
document.getElementById("attempts").innerText = "Attempt: 1";
document.getElementById("guessInput").value = "";
}
function makeGuess() {
const guess = parseInt(document.getElementById("guessInput").value);
const feedback = document.getElementById("feedback");
if (isNaN(guess)) return;
if (guess < targetNumber) {
feedback.innerText = "Higher...";
attempts++;
} else if (guess > targetNumber) {
feedback.innerText = "Lower...";
attempts++;
} else {
feedback.innerText = "Correct!";
showHighScoreInput();
}
document.getElementById("attempts").innerText = `Attempt: ${attempts}`;
document.getElementById("guessInput").value = "";
}
function showHighScoreInput() {
document.getElementById("game-ui").style.display = "none";
document.getElementById("highscore-ui").style.display = "block";
document.getElementById("result-msg").innerText = `That took ${attempts} guesses.`;
}
function saveScore() {
const name = document.getElementById("nameInput").value || "Anonymous";
const scores = JSON.parse(localStorage.getItem(highScoresKey)) || [
{ name: "Fred Nurk", score: 5 },
{ name: "Fred", score: 6 }
];
scores.push({ name: name, score: attempts });
scores.sort((a, b) => a.score - b.score);
localStorage.setItem(highScoresKey, JSON.stringify(scores));
displayScores(scores);
}
function displayScores(scores) {
const list = document.getElementById("scoresList");
list.innerHTML = "";
scores.forEach(s => {
const li = document.createElement("li");
li.innerText = `${s.name} ${s.score}`;
list.appendChild(li);
});
document.getElementById("highscore-ui").style.display = "none";
document.getElementById("scores-display").style.display = "block";
}
// Initial Start
resetGame();
