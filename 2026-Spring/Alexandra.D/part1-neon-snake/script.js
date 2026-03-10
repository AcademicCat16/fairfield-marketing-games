const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const grid = 20;
const tile = canvas.width / grid;

let snake, food, dx, dy, score, speed;
let running = false;
let paused = false;

const STORAGE_KEY = "neonSnakeScores";

function init() {
  snake = [{x:10,y:10},{x:9,y:10},{x:8,y:10}];
  dx = 1;
  dy = 0;
  score = 0;
  speed = 8;
  placeFood();
  running = true;
  paused = false;
}

function placeFood() {
  food = {
    x: Math.floor(Math.random()*grid),
    y: Math.floor(Math.random()*grid)
  };
}

function drawCell(x,y,color) {
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = 15;
  ctx.fillStyle = color;
  ctx.fillRect(x*tile+3,y*tile+3,tile-6,tile-6);
  ctx.restore();
}

function update() {
  if (!running || paused) return;

  const head = {x: snake[0].x + dx, y: snake[0].y + dy};

  // wall collision = game over
  if (head.x < 0 || head.y < 0 || head.x >= grid || head.y >= grid ||
      snake.some(s=>s.x===head.x && s.y===head.y)) {
    running = false;
    saveScore();
    renderScores();
    return;
  }

  snake.unshift(head);

  if (head.x===food.x && head.y===food.y) {
    score += 10;
    placeFood();
  } else {
    snake.pop();
  }

  ctx.clearRect(0,0,canvas.width,canvas.height);

  drawCell(food.x,food.y,"#ff0066");
  snake.forEach((s,i)=>{
    drawCell(s.x,s.y,i===0?"#66ffcc":"#00ff99");
  });
}

function gameLoop() {
  update();
  setTimeout(()=>requestAnimationFrame(gameLoop),1000/speed);
}

function startGame() {
  init();
}

function togglePause() {
  paused = !paused;
}

document.addEventListener("keydown",e=>{
  if(e.key==="ArrowUp" && dy===0){dx=0;dy=-1;}
  if(e.key==="ArrowDown" && dy===0){dx=0;dy=1;}
  if(e.key==="ArrowLeft" && dx===0){dx=-1;dy=0;}
  if(e.key==="ArrowRight" && dx===0){dx=1;dy=0;}
});

function saveScore(){
  let scores = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  scores.push(score);
  scores.sort((a,b)=>b-a);
  scores = scores.slice(0,10);
  localStorage.setItem(STORAGE_KEY,JSON.stringify(scores));
}

function renderScores(){
  const list = document.getElementById("scores");
  list.innerHTML="";
  let scores = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  scores.forEach(s=>{
    const li=document.createElement("li");
    li.textContent=s;
    list.appendChild(li);
  });
}

function resetScores(){
  localStorage.removeItem(STORAGE_KEY);
  renderScores();
}

renderScores();
init();
gameLoop();
