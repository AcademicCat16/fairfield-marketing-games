let coins = 0;
let correctAnswer = null;
const coinDisplay = document.getElementById("coins");
const questionDisplay = document.getElementById("question");
const answerInput = document.getElementById("answer");
const submitBtn = document.getElementById("submitAnswer");
const newQuestionBtn = document.getElementById("newQuestion");
newQuestionBtn.addEventListener("click", generateQuestion);
submitBtn.addEventListener("click", checkAnswer);
// Generate a random math problem
function generateQuestion() {
let num1 = Math.floor(Math.random() * 10) + 1;
let num2 = Math.floor(Math.random() * 10) + 1;
let operator = ["+", "-", "*"][Math.floor(Math.random() * 3)];
if (operator === "+") correctAnswer = num1 + num2;
if (operator === "-") correctAnswer = num1 - num2;
if (operator === "*") correctAnswer = num1 * num2;
questionDisplay.textContent = `What is ${num1} ${operator} ${num2}?`;
answerInput.value = "";
}
// Check player's answer
function checkAnswer() {
let userAnswer = parseInt(answerInput.value);
if (userAnswer === correctAnswer) {
coins += 2;
coinDisplay.textContent = coins;
alert("Correct! You earned 2 coins 🎉");
} else {
alert("Incorrect! Try again.");
}
generateQuestion();
}
// Buy decoration
function buyItem(itemId, cost) {
if (coins >= cost) {
coins -= cost;
coinDisplay.textContent = coins;
document.getElementById(itemId).classList.remove("hidden");
} else {
alert("Not enough coins!");
}
}
