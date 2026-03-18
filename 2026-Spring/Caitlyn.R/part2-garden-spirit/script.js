let growth = 0;
let power = 1;
let flowers = [];
function waterPlant() {
growth += power;
animateCharacter();
changeDialogue();
updateCharacter();
unlockFlowers();
updateDisplay();
}
function upgrade() {
if (growth >= 10) {
growth -= 10;
power++;
}
updateDisplay();
}
function animateCharacter() {
let char = document.getElementById("character");
char.style.transform = "scale(1.3)";
setTimeout(() => {
char.style.transform = "scale(1)";
}, 200);
}
function changeDialogue() {
let text = document.getElementById("dialogue");
if (growth < 10) {
text.textContent = "The garden is waking up 🌱";
} else if (growth < 30) {
text.textContent = "You're doing great! 🌸";
} else if (growth < 60) {
text.textContent = "So many beautiful flowers! 🌷";
} else {
text.textContent = "The garden is magical now ✨";
}
}
function updateCharacter() {
let char = document.getElementById("character");
if (growth > 50) {
char.textContent = "🦊";
} else if (growth > 20) {
char.textContent = "🐰";
} else {
char.textContent = "🧚";
}
}
function unlockFlowers() {
if (growth >= 5 && !flowers.includes("🌼")) {
flowers.push("🌼");
}
if (growth >= 15 && !flowers.includes("🌷")) {
flowers.push("🌷");
}
if (growth >= 30 && !flowers.includes("🌸")) {
flowers.push("🌸");
}
if (growth >= 50 && !flowers.includes("🌺")) {
flowers.push("🌺");
}
}
function updateDisplay() {
document.getElementById("growth").textContent = growth;
document.getElementById("flowers").textContent = flowers.join(" ");
}
