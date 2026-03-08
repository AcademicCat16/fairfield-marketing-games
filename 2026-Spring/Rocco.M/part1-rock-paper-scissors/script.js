const pickButtons = document.querySelectorAll(".pick");
const resultEl = document.querySelector(".result");
const userChoiceEl = document.querySelector(".user-choice");
const cpuChoiceEl = document.querySelector(".computer-choice");
const userPointsEl = document.querySelector(".user-points");
const cpuPointsEl = document.querySelector(".computer-points");
const restartBtn = document.getElementById("restart");

const choices = ["rock", "paper", "scissor"];
const emoji = { rock: "✊", paper: "✋", scissor: "✌️" };

let userPoints = 0;
let cpuPoints = 0;
let gameOver = false;

// Decide winner of ONE round
function roundResult(user, cpu) {
  if (user === cpu) return { winner: "tie", text: "Tie round!" };

  const userWins =
    (user === "rock" && cpu === "scissor") ||
    (user === "paper" && cpu === "rock") ||
    (user === "scissor" && cpu === "paper");

  return userWins
    ? { winner: "user", text: `You win! ${user} beats ${cpu}` }
    : { winner: "cpu", text: `You lose! ${cpu} beats ${user}` };
}

function randomCPU() {
  return choices[Math.floor(Math.random() * choices.length)];
}

function updateUI(user, cpu, message) {
  userChoiceEl.textContent = `${emoji[user]} (${user})`;
  cpuChoiceEl.textContent = `${emoji[cpu]} (${cpu})`;
  resultEl.textContent = message;

  userPointsEl.textContent = userPoints;
  cpuPointsEl.textContent = cpuPoints;
}

function checkMatchEnd() {
  // Best of 5 = first to 3
  if (userPoints >= 3) {
    gameOver = true;
    resultEl.textContent = "🏆 Match Over — You won the match!";
  } else if (cpuPoints >= 3) {
    gameOver = true;
    resultEl.textContent = "💀 Match Over — CPU won the match!";
  }

  // Disable buttons if match ended
  if (gameOver) {
    pickButtons.forEach(btn => btn.disabled = true);
  }
}

function play(userChoice) {
  if (gameOver) return;

  const cpuChoice = randomCPU();
  const outcome = roundResult(userChoice, cpuChoice);

  if (outcome.winner === "user") userPoints++;
  if (outcome.winner === "cpu") cpuPoints++;

  updateUI(userChoice, cpuChoice, outcome.text);
  checkMatchEnd();
}

function restart() {
  userPoints = 0;
  cpuPoints = 0;
  gameOver = false;

  userChoiceEl.textContent = "—";
  cpuChoiceEl.textContent = "—";
  userPointsEl.textContent = "0";
  cpuPointsEl.textContent = "0";
  resultEl.textContent = "Pick a move to start!";

  pickButtons.forEach(btn => btn.disabled = false);
}

// Events
pickButtons.forEach(btn => {
  btn.addEventListener("click", () => play(btn.dataset.choice));
});

restartBtn.addEventListener("click", restart);


