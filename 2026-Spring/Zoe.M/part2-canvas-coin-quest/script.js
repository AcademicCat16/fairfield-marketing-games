const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const coinCountEl = document.getElementById("coinCount");
const livesEl = document.getElementById("lives");
const restartBtn = document.getElementById("restartBtn");
const W = canvas.width;
const H = canvas.height;
let keys = {};
let lastTime = 0;
function rand(min, max){ return Math.random() * (max - min) + min; }
function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }
function circleHit(a, b){
const dx = a.x - b.x;
const dy = a.y - b.y;
const r = a.r + b.r;
return (dx*dx + dy*dy) <= (r*r);
}
// --- GAME STATE ---
let game;
function newGame(){
game = {
running: true,
coins: 0,
goal: 10,
lives: 3,
msg: "Collect 10 coins!",
msgTimer: 120,
player: { x: 80, y: H/2, r: 16, speed: 240 },
// coins
coinList: Array.from({length: 10}, () => ({
x: rand(80, W-80),
y: rand(60, H-60),
r: 12
})),
// enemies
enemies: [
{ x: W*0.65, y: H*0.25, r: 16, vx: 140, vy: 120 },
{ x: W*0.75, y: H*0.70, r: 18, vx: -160, vy: 100 },
],
// hit cooldown so you don't lose 3 lives instantly
invuln: 0
};
updateHUD();
}
function updateHUD(){
coinCountEl.textContent = game.coins;
livesEl.textContent = game.lives;
}
// --- INPUT ---
window.addEventListener("keydown", (e) => {
keys[e.key.toLowerCase()] = true;
});
window.addEventListener("keyup", (e) => {
keys[e.key.toLowerCase()] = false;
});
restartBtn.addEventListener("click", () => {
newGame();
});
// --- DRAWING (this is the “image generation”) ---
function drawBackground(){
// simple cozy-ish gradient sky/sea effect
const g = ctx.createLinearGradient(0, 0, 0, H);
g.addColorStop(0, "#0b1a3a");
g.addColorStop(0.55, "#121f46");
g.addColorStop(1, "#0b1020");
ctx.fillStyle = g;
ctx.fillRect(0, 0, W, H);
// stars
ctx.globalAlpha = 0.5;
for(let i=0;i<60;i++){
const x = (i*123) % W;
const y = (i*67) % (H*0.45);
ctx.fillStyle = "white";
ctx.fillRect(x, y, 2, 2);
}
ctx.globalAlpha = 1;
// floor tiles
ctx.fillStyle = "rgba(255,255,255,0.06)";
for(let x=0; x<W; x+=36){
ctx.fillRect(x, H-90, 18, 90);
}
// soft vignette
ctx.globalAlpha = 0.25;
ctx.fillStyle = "black";
ctx.fillRect(0,0,W,12);
ctx.fillRect(0,H-12,W,12);
ctx.fillRect(0,0,12,H);
ctx.fillRect(W-12,0,12,H);
ctx.globalAlpha = 1;
}
function drawPlayer(p){
// body
ctx.beginPath();
ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
ctx.fillStyle = "#7dd3fc";
ctx.fill();
// face
ctx.fillStyle = "#0b1020";
ctx.beginPath();
ctx.arc(p.x - 5, p.y - 3, 2.5, 0, Math.PI*2);
ctx.arc(p.x + 5, p.y - 3, 2.5, 0, Math.PI*2);
ctx.fill();
// tiny smile
ctx.strokeStyle = "#0b1020";
ctx.lineWidth = 2;
ctx.beginPath();
ctx.arc(p.x, p.y+3, 6, 0.15*Math.PI, 0.85*Math.PI);
ctx.stroke();
}
function drawCoin(c){
// coin glow
ctx.globalAlpha = 0.35;
ctx.beginPath();
ctx.arc(c.x, c.y, c.r + 10, 0, Math.PI*2);
ctx.fillStyle = "#fbbf24";
ctx.fill();
ctx.globalAlpha = 1;
// coin
ctx.beginPath();
ctx.arc(c.x, c.y, c.r, 0, Math.PI*2);
ctx.fillStyle = "#f59e0b";
ctx.fill();
// inner ring
ctx.beginPath();
ctx.arc(c.x, c.y, c.r - 4, 0, Math.PI*2);
ctx.strokeStyle = "rgba(0,0,0,.25)";
ctx.lineWidth = 2;
ctx.stroke();
// shine
ctx.beginPath();
ctx.arc(c.x - 4, c.y - 5, 3, 0, Math.PI*2);
ctx.fillStyle = "rgba(255,255,255,.8)";
ctx.fill();
}
function drawEnemy(e){
ctx.beginPath();
ctx.arc(e.x, e.y, e.r, 0, Math.PI*2);
ctx.fillStyle = "#fb7185";
ctx.fill();
// eyes
ctx.fillStyle = "#0b1020";
ctx.beginPath();
ctx.arc(e.x - 5, e.y - 3, 2.5, 0, Math.PI*2);
ctx.arc(e.x + 5, e.y - 3, 2.5, 0, Math.PI*2);
ctx.fill();
// angry brow
ctx.strokeStyle = "#0b1020";
ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(e.x - 10, e.y - 10);
ctx.lineTo(e.x - 1, e.y - 6);
ctx.moveTo(e.x + 10, e.y - 10);
ctx.lineTo(e.x + 1, e.y - 6);
ctx.stroke();
}
function drawText(){
// top message
if(game.msgTimer > 0){
ctx.globalAlpha = clamp(game.msgTimer / 60, 0, 1);
ctx.fillStyle = "rgba(255,255,255,.92)";
ctx.font = "700 18px system-ui";
ctx.fillText(game.msg, 18, 28);
ctx.globalAlpha = 1;
}
// win/lose overlay
if(!game.running){
ctx.globalAlpha = 0.92;
ctx.fillStyle = "rgba(0,0,0,.55)";
ctx.fillRect(0,0,W,H);
ctx.globalAlpha = 1;
ctx.fillStyle = "white";
ctx.font = "800 34px system-ui";
const title = (game.coins >= game.goal) ? "YOU WIN 🎉 " : "GAME OVER";
ctx.fillText(title, W/2 - ctx.measureText(title).width/2, H/2 - 10);
ctx.font = "600 16px system-ui";
const sub = "Click Restart to play again";
ctx.fillText(sub, W/2 - ctx.measureText(sub).width/2, H/2 + 22);
}
}
// --- UPDATE LOOP ---
function update(dt){
if(!game.running) return;
// message timer
if(game.msgTimer > 0) game.msgTimer--;
// player movement
const p = game.player;
const up = keys["arrowup"] || keys["w"];
const down = keys["arrowdown"] || keys["s"];
const left = keys["arrowleft"] || keys["a"];
const right = keys["arrowright"] || keys["d"];
let vx = 0, vy = 0;
if(up) vy -= 1;
if(down) vy += 1;
if(left) vx -= 1;
if(right) vx += 1;
// normalize diagonal
if(vx !== 0 && vy !== 0){
const m = Math.sqrt(2);
vx /= m; vy /= m;
}
p.x = clamp(p.x + vx * p.speed * dt, p.r+10, W - p.r-10);
p.y = clamp(p.y + vy * p.speed * dt, p.r+10, H - p.r-100);
// enemies bounce around
game.enemies.forEach(e => {
e.x += e.vx * dt;
e.y += e.vy * dt;
if(e.x < e.r+10 || e.x > W - e.r-10) e.vx *= -1;
if(e.y < e.r+10 || e.y > H - e.r-100) e.vy *= -1;
e.x = clamp(e.x, e.r+10, W - e.r-10);
e.y = clamp(e.y, e.r+10, H - e.r-100);
});
// collect coins
for(let i = game.coinList.length - 1; i >= 0; i--){
const c = game.coinList[i];
if(circleHit(p, c)){
game.coinList.splice(i, 1);
game.coins++;
game.msg = "Nice! +1 coin";
game.msgTimer = 40;
updateHUD();
// win condition
if(game.coins >= game.goal){
game.running = false;
return;
}
}
}
// hit enemies
if(game.invuln > 0) game.invuln -= dt;
if(game.invuln <= 0){
for(const e of game.enemies){
if(circleHit(p, e)){
game.lives--;
game.invuln = 1.2; // seconds
game.msg = "Ouch! Lost a life";
game.msgTimer = 60;
updateHUD();
// knock player back a bit
p.x = 80;
p.y = H/2;
if(game.lives <= 0){
game.running = false;
return;
}
break;
}
}
}
}
function draw(){
drawBackground();
// coins
game.coinList.forEach(drawCoin);
// enemies
game.enemies.forEach(drawEnemy);
// player (blink if invulnerable)
if(!(game.invuln > 0 && Math.floor(Date.now()/100) % 2 === 0)){
drawPlayer(game.player);
}
drawText();
}
function loop(ts){
const t = ts / 1000;
const dt = Math.min(0.033, t - lastTime);
lastTime = t;
update(dt);
draw();
requestAnimationFrame(loop);
}
// Start
newGame();
requestAnimationFrame(loop);
