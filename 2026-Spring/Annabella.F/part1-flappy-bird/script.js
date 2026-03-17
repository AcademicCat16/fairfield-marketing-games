const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let frames = 0;
let state = "getReady";
let score = 0;
let highScore = 0; // track the highest score
const bird = {
x: 50,
y: 150,
width: 24,
height: 24,
gravity: 0.25,
lift: -4.6,
velocity: 0,
draw() {
ctx.save();
ctx.translate(this.x, this.y);
ctx.rotate(this.velocity / 10);
// Body
ctx.fillStyle = "pink";
ctx.beginPath();
ctx.ellipse(0, 0, 12, 10, 0, 0, Math.PI * 2);
ctx.fill();
// Wing
ctx.fillStyle = "hotpink";
ctx.beginPath();
ctx.ellipse(-2, -5, 5, 2, Math.PI / 4, 0, Math.PI * 2);
ctx.fill();
// Beak
ctx.fillStyle = "orange";
ctx.beginPath();
ctx.moveTo(12, 0);
ctx.lineTo(18, -4);
ctx.lineTo(18, 4);
ctx.closePath();
ctx.fill();
// Eye
ctx.fillStyle = "black";
ctx.beginPath();
ctx.arc(5, -3, 2, 0, Math.PI * 2);
ctx.fill();
ctx.restore();
},
update() {
if (state === "play") {
this.velocity += this.gravity;
this.y += this.velocity;
if (this.y + 12 >= canvas.height) {
this.y = canvas.height - 12;
state = "gameOver";
updateHighScore();
}
if (this.y - 12 <= 0) {
this.y = 12;
this.velocity = 0;
}
}
},
flap() {
this.velocity = this.lift;
}
};
let pipes = [];
function createPipe() {
let top = Math.random() * 200 + 50;
pipes.push({
x: canvas.width,
top: top,
bottom: top + 100,
passed: false
});
}
function drawPipes() {
ctx.fillStyle = "purple";
pipes.forEach(pipe => {
ctx.fillRect(pipe.x, 0, 40, pipe.top);
ctx.fillRect(pipe.x, pipe.bottom, 40, canvas.height - pipe.bottom);
});
}
function updatePipes() {
if (state !== "play") return;
if (frames % 100 === 0) createPipe();
pipes.forEach(pipe => {
pipe.x -= 2;
// Collision
if (
bird.x + 12 > pipe.x &&
bird.x - 12 < pipe.x + 40 &&
(bird.y - 12 < pipe.top || bird.y + 12 > pipe.bottom)
) {
state = "gameOver";
updateHighScore();
}
// Score
if (!pipe.passed && pipe.x + 40 < bird.x) {
pipe.passed = true;
score++;
}
});
// Remove pipes offscreen
pipes = pipes.filter(pipe => pipe.x + 40 > 0);
}
// Update high score if needed
function updateHighScore() {
if (score > highScore) highScore = score;
}
function drawText() {
ctx.fillStyle = "white";
ctx.textAlign = "center";
if (state === "getReady") {
ctx.font = "30px Squada One";
ctx.fillText("Click or Press Space", canvas.width / 2, canvas.height / 2);
}
if (state === "gameOver") {
ctx.font = "30px Squada One";
ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
ctx.font = "20px Squada One";
ctx.fillText("Click or Press Space to Restart", canvas.width / 2, canvas.height / 2 + 40);
ctx.fillText("High Score: " + highScore, canvas.width / 2, canvas.height / 2 + 70);
}
if (state === "play") {
ctx.font = "30px Squada One";
ctx.fillText(score, canvas.width / 2, 50);
}
}
// Input
canvas.addEventListener("click", handleInput);
document.addEventListener("keydown", e => {
if (e.code === "Space") handleInput();
});
function handleInput() {
if (state === "getReady") {
state = "play";
} else if (state === "play") {
bird.flap();
} else if (state === "gameOver") {
state = "getReady";
pipes = [];
bird.y = 150;
bird.velocity = 0;
score = 0;
}
}
// Game loop
function loop() {
ctx.clearRect(0, 0, canvas.width, canvas.height);
bird.update();
updatePipes();
drawPipes();
bird.draw();
drawText();
frames++;
requestAnimationFrame(loop);
}
loop();
