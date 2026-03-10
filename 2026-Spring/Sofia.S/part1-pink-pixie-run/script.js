const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const ui = document.getElementById("ui");
const rows = 20;
const cols = 20;
const tileSize = canvas.width / cols;
let score = 0;
let gameState = "start";
// FULL 20x20 MAP (fills screen)
const map = [
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
[1,2,1,1,2,1,1,1,2,1,1,1,2,1,1,1,2,1,2,1],
[1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
[1,2,1,1,2,1,2,1,1,1,1,2,1,2,1,1,2,1,2,1],
[1,2,2,2,2,1,2,2,2,2,2,2,1,2,2,2,2,1,2,1],
[1,1,1,1,2,1,1,1,0,0,1,1,1,2,1,1,1,1,2,1],
[1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
[1,2,1,1,2,1,1,1,2,1,1,1,2,1,1,1,2,1,2,1],
[1,2,2,1,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,1],
[1,1,2,1,2,1,2,1,1,1,1,2,1,2,1,1,2,1,1,1],
[1,2,2,2,2,1,2,2,2,2,2,2,1,2,2,2,2,2,2,1],
[1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1],
[1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
[1,2,1,1,2,1,1,1,2,1,1,1,2,1,1,1,2,1,2,1],
[1,2,2,1,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,1],
[1,1,2,1,2,1,2,1,1,1,1,2,1,2,1,1,2,1,1,1],
[1,2,2,2,2,1,2,2,2,2,2,2,1,2,2,2,2,2,2,1],
[1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];
const angel = {
x: 1,
y: 1,
dirX: 0,
dirY: 0,
nextX: 0,
nextY: 0
};
const ghosts = [
{x: 10, y: 10, dirX: 1, dirY: 0},
{x: 15, y: 15, dirX: -1, dirY: 0}
];
document.addEventListener("keydown", e => {
if(gameState==="start"){
gameState="play";
}
if(e.key==="ArrowLeft"){angel.nextX=-1;angel.nextY=0;}
if(e.key==="ArrowRight"){angel.nextX=1;angel.nextY=0;}
if(e.key==="ArrowUp"){angel.nextX=0;angel.nextY=-1;}
if(e.key==="ArrowDown"){angel.nextX=0;angel.nextY=1;}
});
function canMove(x,y){
return map[y] && map[y][x] !== 1;
}
// movement timer (fix speed)
let moveTimer = 0;
const moveDelay = 150;
function update(timestamp){
if(gameState!=="play") return;
if(timestamp - moveTimer < moveDelay) return;
moveTimer = timestamp;
if(canMove(angel.x+angel.nextX, angel.y+angel.nextY)){
angel.dirX=angel.nextX;
angel.dirY=angel.nextY;
}
if(canMove(angel.x+angel.dirX, angel.y+angel.dirY)){
angel.x+=angel.dirX;
angel.y+=angel.dirY;
}
if(map[angel.y][angel.x]===2){
map[angel.y][angel.x]=0;
score++;
}
ghosts.forEach(g=>{
if(Math.random()<0.3){
const dirs=[[1,0],[-1,0],[0,1],[0,-1]];
let d=dirs[Math.floor(Math.random()*4)];
if(canMove(g.x+d[0],g.y+d[1])){
g.dirX=d[0];
g.dirY=d[1];
}
}
if(canMove(g.x+g.dirX,g.y+g.dirY)){
g.x+=g.dirX;
g.y+=g.dirY;
}
if(g.x===angel.x && g.y===angel.y){
gameState="gameover";
}
});
}
function drawMap(){
for(let y=0;y<rows;y++){
for(let x=0;x<cols;x++){
if(map[y][x]===1){
ctx.fillStyle="#ffb3d9";
ctx.fillRect(x*tileSize,y*tileSize,tileSize,tileSize);
}
if(map[y][x]===2){
ctx.fillStyle="#ff4da6";
ctx.beginPath();
ctx.arc(x*tileSize+tileSize/2,y*tileSize+tileSize/2,5,0,Math.PI*2);
ctx.fill();
}
}
}
}
function drawAngel(){
let x=angel.x*tileSize+tileSize/2;
let y=angel.y*tileSize+tileSize/2;
ctx.fillStyle="white";
ctx.beginPath();
ctx.arc(x-10,y,8,0,Math.PI*2);
ctx.arc(x+10,y,8,0,Math.PI*2);
ctx.fill();
ctx.fillStyle="#ff66b2";
ctx.beginPath();
ctx.arc(x,y,10,0,Math.PI*2);
ctx.fill();
ctx.strokeStyle="gold";
ctx.beginPath();
ctx.ellipse(x,y-15,8,3,0,0,Math.PI*2);
ctx.stroke();
}
function drawGhost(g){
ctx.fillStyle="#ff99cc";
ctx.beginPath();
ctx.arc(g.x*tileSize+tileSize/2,g.y*tileSize+tileSize/2,10,0,Math.PI*2);
ctx.fill();
}
function drawUI(){
if(gameState==="start"){
ui.innerHTML=" Press Arrow Keys ";
}
else if(gameState==="play"){
ui.innerHTML="Hearts: "+score+" ";
}
else if(gameState==="gameover"){
ui.innerHTML=" Game Over — Refresh";
}
}
function gameLoop(timestamp){
ctx.clearRect(0,0,canvas.width,canvas.height);
update(timestamp);
drawMap();
drawAngel();
ghosts.forEach(drawGhost);
drawUI();
requestAnimationFrame(gameLoop);
}
gameLoop();
