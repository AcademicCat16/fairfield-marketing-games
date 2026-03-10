// Function to generate a random number between 1 and 100
function generateNewNumber() {
return Math.floor(Math.random() * 100) + 1;
}
// Initial Game State
let randomNumber = generateNewNumber();
let attempts = 0;
const guessInput = document.getElementById('guessInput');
const guessBtn = document.getElementById('guessBtn');
const message = document.getElementById('message');
const resetBtn = document.getElementById('resetBtn');
// Core Logic: Comparing the guess to the random target
function checkGuess() {
const userGuess = Number(guessInput.value);
attempts++;
if (!guessInput.value || userGuess < 1 || userGuess > 100) {
message.innerText = "Please enter a number (1-100).";
message.style.color = "#f1c40f";
return;
}
if (userGuess === randomNumber) {
message.style.color = "#2ecc71";
message.innerText = `Correct! It took you ${attempts} guesses.`;
endGame();
} else if (userGuess < randomNumber) {
message.style.color = "#e67e22";
message.innerText = "Higher... ↑"; // Feedback algorithm
} else {
message.style.color = "#e67e22";
message.innerText = "Lower... ↓"; // Feedback algorithm
}
guessInput.value = '';
guessInput.focus();
}
function endGame() {
guessBtn.disabled = true;
guessInput.disabled = true;
resetBtn.style.display = "inline-block";
}
// Reset Logic: Generates a FRESH number for the next round
function resetGame() {
randomNumber = generateNewNumber(); // This ensures the number changes!
attempts = 0;
message.innerText = "";
guessBtn.disabled = false;
guessInput.disabled = false;
guessInput.value = '';
resetBtn.style.display = "none";
console.log("Game Reset. New number generated.");
}
// Listeners
guessBtn.addEventListener('click', checkGuess);
resetBtn.addEventListener('click', resetGame);
// Pressing "Enter" works too
guessInput.addEventListener('keypress', (e) => {
if (e.key === 'Enter') checkGuess();
});
