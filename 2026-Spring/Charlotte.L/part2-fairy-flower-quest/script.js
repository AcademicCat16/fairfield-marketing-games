const fairy = document.getElementById("fairy");
const game = document.getElementById("game");
const counter = document.getElementById("counter");
const winMessage = document.getElementById("winMessage");
let fairyX = 200;
let fairyY = 200;
let flowersCollected = 0;
function moveFairy() {
fairy.style.left = fairyX + "px";
fairy.style.top = fairyY + "px";
}
document.addEventListener("keydown", (e) => {
if (e.key === "ArrowUp") fairyY -= 20;
if (e.key === "ArrowDown") fairyY += 20;
if (e.key === "ArrowLeft") fairyX -= 20;
if (e.key === "ArrowRight") fairyX += 20;
fairyX = Math.max(0, Math.min(760, fairyX));
fairyY = Math.max(0, Math.min(460, fairyY));
moveFairy();
checkCollision();
});
function createFlower(x, y) {
const flower = document.createElement("div");
flower.classList.add("flower");
flower.textContent = "🌸";
flower.style.left = x + "px";
flower.style.top = y + "px";
game.appendChild(flower);
}
for (let i = 0; i < 10; i++) {
const x = Math.random() * 760;
const y = Math.random() * 460;
createFlower(x, y);
}
function checkCollision() {
const flowers = document.querySelectorAll(".flower");
flowers.forEach((flower) => {
const flowerRect = flower.getBoundingClientRect();
const fairyRect = fairy.getBoundingClientRect();
if (
fairyRect.left < flowerRect.right &&
fairyRect.right > flowerRect.left &&
fairyRect.top < flowerRect.bottom &&
fairyRect.bottom > flowerRect.top
) {
flower.remove();
flowersCollected++;
counter.textContent = `Flowers collected: ${flowersCollected} / 10`;
if (flowersCollected === 10) {
winMessage.classList.remove("hidden");
}
}
});
}
