const GRID_SIZE = 8;
const board = document.getElementById('game-board');
const scoreDisp = document.getElementById('score-value');
const timeDisp = document.getElementById('time-value');
let player = { x: 0, y: 0 }, food = { x: 5, y: 5 };
let score = 0, time = 30, active = false, timer;
// Create the grid tiles
for (let i = 0; i < 64; i++) {
const t = document.createElement('div');
t.className = 'tile';
board.appendChild(t);
}
const tiles = document.querySelectorAll('.tile');
function draw() {
tiles.forEach(t => t.classList.remove('player', 'item'));
const playerIdx = player.y * 8 + player.x;
const foodIdx = food.y * 8 + food.x;
tiles[playerIdx].classList.add('player');
tiles[foodIdx].classList.add('item');
}
function startGame() {
if (active) return;
active = true; score = 0; time = 30;
scoreDisp.innerText = score;
timeDisp.innerText = time;
timer = setInterval(() => {
time--;
timeDisp.innerText = time;
if (time <= 0) {
clearInterval(timer);
active = false;
alert(`Game Over! Score: ${score}`);
}
}, 1000);
spawnFood();
draw();
}
function spawnFood() {
food = {
x: Math.floor(Math.random() * 8),
y: Math.floor(Math.random() * 8)
};
}
window.addEventListener('keydown', e => {
if (!active) return;
if (e.key === 'ArrowUp' && player.y > 0) player.y--;
if (e.key === 'ArrowDown' && player.y < 7) player.y++;
if (e.key === 'ArrowLeft' && player.x > 0) player.x--;
if (e.key === 'ArrowRight' && player.x < 7) player.x++;
if (player.x === food.x && player.y === food.y) {
score++;
scoreDisp.innerText = score;
spawnFood();
}
draw();
});
draw();
