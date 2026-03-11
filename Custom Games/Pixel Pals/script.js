// ── Title Screen ──
const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');
canvas.width = 800; canvas.height = 600;

class Cloud {
  constructor(x, y, speed) {
    this.x = x; this.y = y; this.speed = speed;
    this.blocks = [{dx:0,dy:0},{dx:20,dy:0},{dx:40,dy:0},{dx:10,dy:10},{dx:30,dy:10},{dx:0,dy:20},{dx:20,dy:20},{dx:40,dy:20}];
  }
  draw() {
    ctx.fillStyle = '#fff'; ctx.strokeStyle = '#000'; ctx.lineWidth = 2;
    this.blocks.forEach(b => { ctx.fillRect(this.x+b.dx,this.y+b.dy,20,20); ctx.strokeRect(this.x+b.dx,this.y+b.dy,20,20); });
  }
  update() { this.x += this.speed; if (this.x > canvas.width+60) { this.x=-80; this.y=Math.random()*150; } }
}

const clouds = [];
for (let i = 0; i < 6; i++) clouds.push(new Cloud(Math.random()*canvas.width, Math.random()*150, 0.5+Math.random()));

const groundHeight = 100; const tileSize = 40;
const tilesX = Math.ceil(canvas.width/tileSize)+2; let groundOffset = 0;
const scenery = [
  {x:150,y:canvas.height-groundHeight-60,width:40,height:60,type:'tree',color:'#006400'},
  {x:350,y:canvas.height-groundHeight-80,width:60,height:80,type:'house',color:'#8B4513'},
  {x:600,y:canvas.height-groundHeight-60,width:40,height:60,type:'tree',color:'#006400'}
];

function drawGround() {
  const groundY = canvas.height - groundHeight;
  for (let i = 0; i < tilesX; i++) {
    const x = i*tileSize - groundOffset;
    ctx.fillStyle='#228B22'; ctx.fillRect(x,groundY,tileSize,groundHeight);
    ctx.fillStyle='#32CD32'; ctx.fillRect(x+5,groundY+5,10,10); ctx.fillRect(x+25,groundY+20,10,10);
  }
  scenery.forEach(obj => {
    const x = obj.x - groundOffset;
    if (x+obj.width<0||x>canvas.width) return;
    ctx.fillStyle=obj.color; ctx.fillRect(x,obj.y,obj.width,obj.height);
    if (obj.type==='tree') { ctx.fillStyle='#228B22'; ctx.fillRect(x+5,obj.y,obj.width-10,obj.height/2); }
    if (obj.type==='house') { ctx.fillStyle='#FFD700'; ctx.fillRect(x+10,obj.y+20,obj.width-20,obj.height-20); }
  });
  groundOffset += 1;
  if (groundOffset >= tileSize) groundOffset = 0;
}

const title = "PIXEL PALS";
const titleBaseY = 50;
let titleOffset    = Array(title.length).fill(0);
let titleDirection = Array(title.length).fill(1);

function drawTitle() {
  ctx.font = "bold 40px 'Press Start 2P'";
  ctx.textAlign = "center"; ctx.textBaseline = "top";
  for (let i = 0; i < title.length; i++) {
    titleOffset[i] += 0.2*titleDirection[i];
    if (titleOffset[i]>5||titleOffset[i]<-5) titleDirection[i]*=-1;
    const x = canvas.width/2-(title.length/2*24)+i*24;
    const y = titleBaseY+titleOffset[i];
    ctx.fillStyle='#32CD32';
    for (let dx=-2;dx<=2;dx++) for (let dy=-2;dy<=2;dy++) if (dx!==0||dy!==0) ctx.fillText(title[i],x+dx,y+dy);
    ctx.fillStyle='#FF69B4'; ctx.fillText(title[i],x,y);
  }
}

class PixelBird {
  constructor() { this.x=-40; this.y=100+Math.random()*200; this.speed=2+Math.random()*2; this.size=20; this.frame=0; }
  draw() {
    ctx.fillStyle='#1E90FF'; ctx.fillRect(this.x,this.y,this.size,this.size/2);
    ctx.fillStyle='#fff'; const wingY=this.y+2+(this.frame%2===0?-2:2); ctx.fillRect(this.x+5,wingY,this.size/2,this.size/4);
    ctx.fillStyle='#000'; ctx.fillRect(this.x+this.size-5,this.y+5,3,3);
    this.frame++;
  }
  update() { this.x += this.speed; }
}

const birds = [];
setInterval(() => { birds.push(new PixelBird()); }, 3000);

function animate() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  clouds.forEach(c => { c.update(); c.draw(); });
  drawGround(); drawTitle();
  for (let i=birds.length-1;i>=0;i--) { const b=birds[i]; b.update(); b.draw(); if (b.x>canvas.width+50) birds.splice(i,1); }
  requestAnimationFrame(animate);
}
animate();

// ── Map Screen ──
const mapScreen  = document.getElementById('mapScreen');
const mapCanvas  = document.getElementById('mapCanvas');
const mapCtx     = mapCanvas.getContext('2d');
const returnBtn  = document.getElementById('returnMainBtn');

let player = { x:400, y:300, size:20, color:'#1E90FF', speed:3.5 };
let pixelPals=[]; let splashes=[]; let score=0; let highScore=0; let timeLeft=60;
let keys={}; let ripplePhase=0; let spawnInterval; let timerInterval;

const pond   = {x:140,y:110,width:120,height:80};
const trees  = [{x:150,y:350,width:20,height:40},{x:600,y:100,width:20,height:40},{x:400,y:250,width:20,height:40}];
const houses = [{x:500,y:450,width:50,height:50},{x:700,y:200,width:50,height:50}];
const collidable = [...trees,...houses,pond];

const pixelPalTypes = [
  {color:'#FF69B4',shape:'square',points:1},
  {color:'#FFD700',shape:'star',points:1},
  {color:'#00FFFF',shape:'circle',points:1},
  {color:'#32CD32',shape:'frog',points:1},
  {color:'#FFD700',shape:'circle',points:5,rare:true}
];

function getValidPosition(size) {
  let x,y,valid;
  do {
    x=Math.random()*(mapCanvas.width-size); y=Math.random()*(mapCanvas.height-size);
    const rect={x,y,width:size,height:size};
    valid=!collidable.some(obj=>rect.x+rect.width>obj.x&&rect.x<obj.x+obj.width&&rect.y+rect.height>obj.y&&rect.y<obj.y+obj.height);
  } while(!valid);
  return {x,y};
}

function spawnPixelPal() {
  const type=pixelPalTypes[Math.floor(Math.random()*pixelPalTypes.length)];
  const pos=getValidPosition(15);
  pixelPals.push({x:pos.x,y:pos.y,size:15,color:type.color,shape:type.shape,frame:0,bob:Math.random()*3,points:type.points,rare:type.rare||false});
}

function drawPixelPal(p) {
  let bobOffset=Math.sin(p.bob+ripplePhase)*2;
  const dx=p.x-200,dy=p.y-150;
  if (Math.sqrt(dx*dx+dy*dy)<70) { bobOffset-=Math.sin(ripplePhase*2)*5; splashes.push({x:p.x,y:p.y+bobOffset,lifetime:20,color:p.color}); }
  mapCtx.fillStyle=p.color;
  switch(p.shape) {
    case 'square': mapCtx.fillRect(p.x,p.y+bobOffset,p.size,p.size); break;
    case 'circle': mapCtx.beginPath(); mapCtx.arc(p.x+p.size/2,p.y+bobOffset+p.size/2,p.size/2,0,Math.PI*2); mapCtx.fill(); break;
    case 'star':   mapCtx.fillRect(p.x,p.y+bobOffset,p.size,p.size/2); mapCtx.fillRect(p.x+p.size/4,p.y+bobOffset-3,p.size/2,p.size/2); break;
    case 'frog':   mapCtx.fillRect(p.x,p.y+bobOffset,p.size,p.size-4); mapCtx.fillStyle='black'; mapCtx.fillRect(p.x+4,p.y+2+bobOffset,2,2); break;
  }
  if (p.shape==='star') { mapCtx.fillStyle='white'; if (p.frame%20<10) mapCtx.fillRect(p.x+3,p.y+3+bobOffset,2,2); }
  p.frame++;
}

function drawSplashes() {
  for (let i=splashes.length-1;i>=0;i--) { const s=splashes[i]; mapCtx.fillStyle=s.color; mapCtx.fillRect(s.x,s.y,4,4); s.lifetime--; if(s.lifetime<=0)splashes.splice(i,1); }
}

function drawMap() {
  mapCtx.clearRect(0,0,mapCanvas.width,mapCanvas.height);
  mapCtx.fillStyle='#228B22'; mapCtx.fillRect(0,0,mapCanvas.width,mapCanvas.height);
  mapCtx.fillStyle='#C2B280'; mapCtx.fillRect(100,0,60,mapCanvas.height); mapCtx.fillRect(0,400,mapCanvas.width,80);
  mapCtx.fillStyle='#66ccff'; mapCtx.beginPath(); mapCtx.ellipse(200,150,60,40,0,0,Math.PI*2); mapCtx.fill();
  mapCtx.strokeStyle='rgba(255,255,255,0.5)'; mapCtx.lineWidth=1;
  for (let i=0;i<3;i++) { mapCtx.beginPath(); mapCtx.ellipse(200,150,60-i*5,40-i*3,0,0,Math.PI*2); mapCtx.stroke(); }
  ripplePhase+=0.05;
  trees.forEach(t=>{ mapCtx.fillStyle='#8B4513'; mapCtx.fillRect(t.x,t.y,t.width,t.height); mapCtx.fillStyle='#006400'; mapCtx.fillRect(t.x-10,t.y-20,40,40); });
  houses.forEach(h=>{ mapCtx.fillStyle='#8B4513'; mapCtx.fillRect(h.x,h.y,h.width,h.height); mapCtx.fillStyle='#FFD700'; mapCtx.fillRect(h.x+10,h.y+10,30,30); });
  pixelPals.forEach(p=>drawPixelPal(p));
  drawSplashes();
  drawPlayerAsPerson();
  mapCtx.fillStyle='white'; mapCtx.font="16px 'Press Start 2P'";
  mapCtx.fillText('Score: '+score,10,20);
  mapCtx.fillText('High Score: '+highScore,10,40);
  mapCtx.fillText('Time: '+timeLeft,mapCanvas.width-140,20);
}

function drawPlayerAsPerson() {
  const x=player.x,y=player.y,s=player.size;
  mapCtx.fillStyle='#000080'; mapCtx.fillRect(x+2,y+s-4,4,4); mapCtx.fillRect(x+s-6,y+s-4,4,4);
  mapCtx.fillStyle=player.color; mapCtx.fillRect(x+3,y+6,s-6,s-10);
  mapCtx.fillStyle='#1E90FF'; mapCtx.fillRect(x,y+6,3,s-10); mapCtx.fillRect(x+s-3,y+6,3,s-10);
  mapCtx.fillStyle='#FFE0BD'; mapCtx.beginPath(); mapCtx.arc(x+s/2,y+4,4,0,Math.PI*2); mapCtx.fill();
  mapCtx.fillStyle='black'; mapCtx.fillRect(x+s/2-2,y+3,1.5,1.5); mapCtx.fillRect(x+s/2+1,y+3,1.5,1.5);
}

function isColliding(rect) {
  return collidable.some(obj=>rect.x+rect.width>obj.x&&rect.x<obj.x+obj.width&&rect.y+rect.height>obj.y&&rect.y<obj.y+obj.height);
}

function updatePlayer() {
  let nextX=player.x, nextY=player.y;
  if (keys['w']||keys['arrowup'])    nextY-=player.speed;
  if (keys['s']||keys['arrowdown'])  nextY+=player.speed;
  if (keys['a']||keys['arrowleft'])  nextX-=player.speed;
  if (keys['d']||keys['arrowright']) nextX+=player.speed;
  const futureRect={x:nextX,y:nextY,width:player.size,height:player.size};
  if (!isColliding(futureRect)) { player.x=nextX; player.y=nextY; }
  for (let i=pixelPals.length-1;i>=0;i--) {
    const p=pixelPals[i];
    const dx=player.x-p.x, dy=player.y-p.y;
    if (Math.sqrt(dx*dx+dy*dy)<(player.size+p.size)/2) {
      pixelPals.splice(i,1); score+=p.points;
      if (score>highScore) highScore=score;
      if (p.rare) { player.speed=6; timeLeft+=5; setTimeout(()=>{player.speed=3.5;},3000); }
    }
  }
}

function gameLoop() { updatePlayer(); drawMap(); if (timeLeft>0) requestAnimationFrame(gameLoop); }

function startGameTimer() {
  timerInterval=setInterval(()=>{
    timeLeft--;
    if (timeLeft<=0) {
      clearInterval(timerInterval); clearInterval(spawnInterval);
      alert('Time is up! Your score: '+score);
      mapScreen.style.display='none';
      document.getElementById('menu').style.display='block';
    }
  },1000);
}

function startSpawning() { spawnInterval=setInterval(()=>{if(timeLeft>0)spawnPixelPal();},2000); }

document.addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;});
document.addEventListener('keyup',  e=>{keys[e.key.toLowerCase()]=false;});

function startGame() {
  document.getElementById('menu').style.display='none';
  mapScreen.style.display='block';
  player={x:400,y:300,size:20,color:'#1E90FF',speed:3.5};
  score=0; timeLeft=60; pixelPals=[];
  startGameTimer(); startSpawning();
  requestAnimationFrame(gameLoop);
}

document.getElementById('startBtn').addEventListener('click', startGame);
returnBtn.addEventListener('click', ()=>{
  mapScreen.style.display='none';
  document.getElementById('menu').style.display='block';
  clearInterval(spawnInterval); clearInterval(timerInterval);
});
