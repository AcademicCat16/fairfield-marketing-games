const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");
let playerX = window.innerWidth / 2;
let score = 0;
let gameOver = false;
document.addEventListener("keydown", function(e) {
if (e.key === "ArrowLeft") {
playerX -= 20;
}
if (e.key === "ArrowRight") {
playerX += 20;
}
player.style.left = playerX + "px";
});
function createBlock() {
if (gameOver) return;
const block = document.createElement("div");
block.classList.add("block");
block.style.left = Math.random() * window.innerWidth + "px";
document.querySelector(".game").appendChild(block);
let blockY = 0;
const fall = setInterval(function() {
if (gameOver) {
clearInterval(fall);
return;
}
blockY += speed;
block.style.top = blockY + "px";
const playerRect = player.getBoundingClientRect();
const blockRect = block.getBoundingClientRect();
if (
blockRect.bottom > playerRect.top &&
blockRect.top < playerRect.bottom &&
blockRect.left < playerRect.right &&
blockRect.right > playerRect.left
) {
gameOver = true;
alert("Game Over! Final Score: " + score);
}
if (blockY > window.innerHeight) {
block.remove();
score++;
scoreDisplay.textContent = score;if (score % 5 === 0) {
speed += 1;
}
clearInterval(fall);
}
}, 20);
}
setInterval(createBlock, 1000);let speed = 5;
