document.addEventListener("DOMContentLoaded", function() {
/* ================= SCREEN CONTROL ================= */
const screens = {
menu: document.getElementById("menuScreen"),
custom: document.getElementById("customScreen"),
tracks: document.getElementById("trackSelect"),
game: document.getElementById("gameScreen")
};
function show(screen){
Object.values(screens).forEach(s=>s.classList.add("hidden"));
screen.classList.remove("hidden");
}
/* ================= MENU BACKGROUND ================= */
const menuCanvas = document.getElementById("menuCanvas");
const mctx = menuCanvas.getContext("2d");
function resizeMenu(){ menuCanvas.width = window.innerWidth; menuCanvas.height = window.innerHeight; }
resizeMenu();
window.addEventListener("resize", resizeMenu);
// Horizontal moving cars
let bgCars=[];
function initBG(){
bgCars=[];
const rows = 3;
const colors = ["red","cyan","yellow","green","orange"];
for(let row=0; row<rows; row++){
let y = 50 + row*(menuCanvas.height/rows*0.6);
let speedBase = 1 + row*0.5;
for(let i=0; i<5; i++){
bgCars.push({
x: Math.random()*menuCanvas.width,
y: y + Math.random()*30,
speed: speedBase + Math.random()*0.5,
color: colors[i%colors.length]
});
}
}
}
function animateBG(){
mctx.clearRect(0,0,menuCanvas.width,menuCanvas.height);
bgCars.forEach(car=>{
car.x += car.speed;
if(car.x > menuCanvas.width+20) car.x = -20;
mctx.fillStyle=car.color;
mctx.fillRect(car.x-10, car.y-5, 20, 10);
});
requestAnimationFrame(animateBG);
}
initBG();
animateBG();
/* ================= GAME CANVAS ================= */
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
function resizeGame(){ canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
resizeGame(); window.addEventListener("resize", resizeGame);
let selectedTrack=0;
let isNight=false;
let player, ai, keys={}, running=false, startTime=0;
let countdownValue=3, countdownActive=false;
/* ================= BOOST ================= */
let boostReady=true;
document.addEventListener("keydown", e=>{
keys[e.key.toLowerCase()] = true;
if(e.code === "Space" && boostReady && player){
player.speed += 0.02;
boostReady=false;
setTimeout(()=>{ boostReady=true; }, 5000);
}
});
document.addEventListener("keyup", e=>keys[e.key.toLowerCase()] = false);
/* ================= CREATE CAR ================= */
function createCar(color,isAI=false){
return {
theta:-Math.PI/2,
speed:0,
maxSpeed:parseFloat(document.getElementById("carSpeed").value),
lap:0,
color,
model:document.getElementById("carModel").value,
isAI,
finished:false,
boostReady:true
};
}
/* ================= TRACK DATA ================= */
const trackData = [
{ type:"circle", cx:canvas.width/2, cy:canvas.height/2, rOuter:300, rInner:200, laps:3, obstacles:"cones", obstacleCount:6 },
{ type:"circle", cx:canvas.width/2, cy:canvas.height/2, rOuter:300, rInner:200, laps:3, obstacles:"oil", obstacleCount:8 },
{ type:"circle", cx:canvas.width/2, cy:canvas.height/2, rOuter:300, rInner:200, laps:3, obstacles:"mixed", obstacleCount:10 }
];
/* ================= OBSTACLES ================= */
let obstacles=[];
function generateObstacles(){
obstacles=[];
let track = trackData[selectedTrack];
for(let i=0;i<track.obstacleCount;i++){
let theta = Math.random()*Math.PI*2;
let r=(track.rInner+track.rOuter)/2;
let type = track.obstacles==="mixed" ? (i%2===0 ? "cones" : "oil") : track.obstacles;
obstacles.push({x:track.cx+r*Math.cos(theta), y:track.cy+r*Math.sin(theta), type});
}
}
function drawObstacles(){
obstacles.forEach(o=>{
if(o.type==="cones"){ ctx.fillStyle="orange"; ctx.fillRect(o.x-5,o.y-5,10,10); }
if(o.type==="oil"){ ctx.fillStyle="black"; ctx.beginPath(); ctx.ellipse(o.x,o.y,10,5,0,0,Math.PI*2); ctx.fill(); }
});
}
function checkObstacleCollision(car){
let pos=getCarXY(car);
obstacles.forEach(o=>{
let dx=pos.x-o.x, dy=pos.y-o.y;
if(Math.sqrt(dx*dx+dy*dy)<15){
if(o.type==="cones") car.speed*=0.7;
if(o.type==="oil") car.speed*=0.5;
}
});
}
/* ================= CAR POSITION ================= */
function getCarXY(car){
let track = trackData[selectedTrack];
let r=(track.rInner+track.rOuter)/2;
let x=track.cx + r*Math.cos(car.theta);
let y=track.cy + r*Math.sin(car.theta);
return {x,y};
}
/* ================= UPDATE ================= */
function updateCar(car){
if(!car.isAI){ if(keys["w"]) car.speed+=0.0008; if(keys["s"]) car.speed-=0.0008; }
else {
car.speed+=0.0006;
if(car.boostReady && Math.random()<0.001){ car.speed += 0.02; car.boostReady=false; setTimeout(()=>{car.boostReady=true;},5000);}
}
car.speed*=0.995; car.speed=Math.max(-0.02,Math.min(car.maxSpeed,car.speed));
car.theta+=car.speed;
checkObstacleCollision(car);
checkFinish(car);
if(car.theta>=Math.PI*2){ car.theta-=Math.PI*2; car.lap++;
if(!car.isAI) document.getElementById("laps").innerText="Lap: "+car.lap+"/"+trackData[selectedTrack].laps;
}
}
/* ================= FINISH LINE ================= */
function checkFinish(car){
if(!car.finished && car.theta>Math.PI*2-0.02 && car.lap>=trackData[selectedTrack].laps-1){
car.finished=true;
raceEnd();
}
}
/* ================= DRAW ================= */
function drawTrack(){
let track = trackData[selectedTrack];
ctx.fillStyle="#555";
ctx.beginPath(); ctx.arc(track.cx,track.cy,track.rOuter,0,Math.PI*2); ctx.fill();
ctx.fillStyle=isNight?"#000":"#87ceeb";
ctx.beginPath(); ctx.arc(track.cx,track.cy,track.rInner,0,Math.PI*2); ctx.fill();
ctx.strokeStyle="white"; ctx.lineWidth=4;
ctx.beginPath(); ctx.moveTo(track.cx+track.rInner,track.cy);
ctx.lineTo(track.cx+track.rOuter,track.cy); ctx.stroke();
}
function drawCar(car){
let pos=getCarXY(car);
ctx.save();
ctx.translate(pos.x,pos.y);
ctx.rotate(car.theta+Math.PI/2);
ctx.fillStyle=car.color;
if(car.model==="truck") ctx.fillRect(-20,-10,40,20);
else if(car.model==="formula") ctx.fillRect(-25,-6,50,12);
else ctx.fillRect(-15,-8,30,16);
if(keys[" "]){ ctx.fillStyle="rgba(255,255,0,0.5)"; ctx.fillRect(-15,-5,30,5); }
ctx.restore();
}
function drawObstaclesAll(){ drawObstacles(); }
/* ================= HUD ================= */
function drawHUD(){
if(player) document.getElementById("timer").innerText=((Date.now()-startTime)/1000).toFixed(2);
ctx.fillStyle="white"; ctx.font="14px monospace";
ctx.fillText("W/S: Accelerate/Brake", canvas.width-180, 20);
ctx.fillText("Space: Boost", canvas.width-180, 40);
let x=20, y=canvas.height-80;
ctx.fillStyle="white"; ctx.font="16px monospace";
ctx.fillText("Boost", x-10, y+8);
ctx.fillStyle=boostReady?"red":"gray";
ctx.fillRect(x+50, y, 50, 10);
}
/* ================= GAME LOOP ================= */
function loop(){
if(!running) return;
let time = (Date.now()/10000)%2;
ctx.fillStyle = `rgb(${135*(1-time)},${206*(1-time)},${235*(1-time)})`;
ctx.fillRect(0,0,canvas.width,canvas.height);
drawTrack();
drawObstaclesAll();
updateCar(player);
updateCar(ai);
drawCar(player);
drawCar(ai);
drawHUD();
if(countdownActive){
ctx.fillStyle="white";
ctx.font="80px monospace";
ctx.textAlign="center"; ctx.textBaseline="middle";
ctx.fillText(countdownValue>0 ? countdownValue : "GO!", canvas.width/2, canvas.height/2);
}
requestAnimationFrame(loop);
}
/* ================= RACE END ================= */
function raceEnd(){
running=false;
alert("Race Finished! Time: "+((Date.now()-startTime)/1000).toFixed(2)+"s");
}
/* ================= START RACE ================= */
function startRace(){
show(screens.game);
player=createCar(document.getElementById("carColor").value,false);
ai=createCar("cyan",true);
generateObstacles();
countdownValue=3;
countdownActive=true;
let countdownInterval = setInterval(()=>{
countdownValue--;
if(countdownValue<0){
countdownActive=false;
clearInterval(countdownInterval);
startTime=Date.now();
document.getElementById("laps").innerText="Lap: 0/"+trackData[selectedTrack].laps;
running=true;
loop();
}
}, 1000);
}
/* ================= BUTTONS ================= */
document.getElementById("startBtn").onclick=()=>show(screens.tracks);
document.getElementById("customBtn").onclick=()=>show(screens.custom);
document.getElementById("saveCarBtn").onclick=()=>show(screens.menu);
document.querySelectorAll(".trackOption").forEach((btn,i)=>{
btn.textContent = `Track ${["One","Two","Three"][i]}`;
btn.style.transition="0.2s";
btn.onmouseenter=()=>{ btn.style.background="red"; btn.style.color="white"; };
btn.onmouseleave=()=>{ btn.style.background="white"; btn.style.color="red"; };
btn.onclick=()=>{ selectedTrack=i; startRace(); };
});
document.getElementById("backTrackBtn").onclick=()=>{ running=false; show(screens.tracks); };
document.getElementById("backMenuBtn").onclick=()=>{ running=false; show(screens.menu); };
/* ================= ROTATING CAR PREVIEW ================= */
const previewCanvas = document.createElement("canvas");
previewCanvas.width = 200;
previewCanvas.height = 100;
document.getElementById("customScreen").appendChild(previewCanvas);
const pctx = previewCanvas.getContext("2d");
let previewTheta = 0;
function drawCarPreview() {
pctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
let carColor = document.getElementById("carColor").value;
let carModel = document.getElementById("carModel").value;
pctx.save();
pctx.translate(previewCanvas.width/2, previewCanvas.height/2);
pctx.rotate(previewTheta);
pctx.fillStyle = carColor;
if(carModel === "truck") pctx.fillRect(-20,-10,40,20);
else if(carModel === "formula") pctx.fillRect(-25,-6,50,12);
else pctx.fillRect(-15,-8,30,16);
pctx.restore();
previewTheta += 0.02;
requestAnimationFrame(drawCarPreview);
}
document.getElementById("carColor").addEventListener("input", ()=>{ previewTheta=0; });
document.getElementById("carModel").addEventListener("change", ()=>{ previewTheta=0; });
drawCarPreview();
});
