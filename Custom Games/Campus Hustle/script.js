var money         = 0;
var clickValue    = 1;
var passiveIncome = 0;

var moneyEl   = document.getElementById("money");
var messageEl = document.getElementById("message");

document.getElementById("grindBtn").addEventListener("click", function() {
  money += clickValue;
  updateDisplay();
});

document.getElementById("coffeeBtn").addEventListener("click", function() {
  if (money >= 50) {
    money -= 50;
    clickValue += 1;
    updateDisplay();
  }
});

document.getElementById("internBtn").addEventListener("click", function() {
  if (money >= 100) {
    money -= 100;
    passiveIncome += 1;
    updateDisplay();
  }
});

document.getElementById("hustleBtn").addEventListener("click", function() {
  if (money >= 200) {
    money -= 200;
    passiveIncome += 2;
    updateDisplay();
  }
});

function updateDisplay() {
  moneyEl.textContent = money;
  if (money >= 10000) {
    messageEl.textContent = "🎓 You win! Campus Hustle complete!";
  }
}

setInterval(function() {
  money += passiveIncome;
  updateDisplay();
}, 1000);
