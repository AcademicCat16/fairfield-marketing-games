const canvas = document.getElementById('gameCanvas');

const ctx = canvas.getContext('2d');

const scoreEl = document.getElementById('score');

const statusEl = document.getElementById('status');

const resetBtn = document.getElementById('resetBtn');

const overlay = document.getElementById('overlay');


const SIZE = 20;

const INITIAL_MAP = [

  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],

  [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],

  [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],

  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],

  [1,0,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,0,1],

  [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],

  [1,1,1,1,0,1,1,1,2,1,2,1,1,1,0,1,1,1,1],

  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],

  [1,0,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,0,1],

  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],

  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]

];


let map = [];

let score = 0;

let gameOver = false;

let gameStarted = false;

let pacman, ghosts, gameTimer;


function resetGame() {

  // 1. Reset variables

  map = INITIAL_MAP.map(row => [...row]); // Deep copy map

  score = 0;

  scoreEl.innerText = score;

  gameOver = false;

  statusEl.innerText = "";

  resetBtn.style.display = "none";

  

  pacman = { x: 9, y: 1, nextDir: null, color: '#00ccff' };

  ghosts = [

    { x: 1, y: 9, color: '#FF0000' }, 

    { x: 17, y: 9, color: '#FFB8FF' },

    { x: 9, y: 7, color: '#00FFDE' }

  ];


  // 2. Clear any existing timer and start fresh

  clearTimeout(gameTimer);

  if (gameStarted) runGame(); 

  draw();

}


function draw() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  map.forEach((row, y) => {

    row.forEach((cell, x) => {

      if(cell === 1) {

        ctx.fillStyle = '#1919a6';

        ctx.fillRect(x*SIZE, y*SIZE, SIZE, SIZE);

      } else if(cell === 0) {

        ctx.fillStyle = '#ffb8ae';

        ctx.beginPath();

        ctx.arc(x*SIZE + SIZE/2, y*SIZE + SIZE/2, 2, 0, Math.PI*2);

        ctx.fill();

      }

    });

  });


  ctx.fillStyle = pacman.color;

  ctx.beginPath();

  ctx.arc(pacman.x*SIZE + SIZE/2, pacman.y*SIZE + SIZE/2, SIZE/2 - 2, 0, Math.PI*2);

  ctx.fill();


  ghosts.forEach(g => {

    ctx.fillStyle = g.color;

    ctx.fillRect(g.x*SIZE + 2, g.y*SIZE + 4, SIZE - 4, SIZE - 4);

    ctx.beginPath();

    ctx.arc(g.x*SIZE + SIZE/2, g.y*SIZE + 6, SIZE/2 - 2, 0, Math.PI, true);

    ctx.fill();

  });

}


function updatePacman() {

  let dx = 0, dy = 0;

  if (pacman.nextDir === "ArrowUp") dy = -1;

  else if (pacman.nextDir === "ArrowDown") dy = 1;

  else if (pacman.nextDir === "ArrowLeft") dx = -1;

  else if (pacman.nextDir === "ArrowRight") dx = 1;


  if (map[pacman.y + dy] && map[pacman.y + dy][pacman.x + dx] !== 1) {

    pacman.x += dx;

    pacman.y += dy;

    if (map[pacman.y][pacman.x] === 0) {

      map[pacman.y][pacman.x] = 2;

      score += 10;

      scoreEl.innerText = score;

    }

  }

}


function updateGhosts() {

  ghosts.forEach(g => {

    const dirs = [{x:0,y:-1},{x:0,y:1},{x:-1,y:0},{x:1,y:0}];

    let valid = dirs.filter(d => map[g.y+d.y] && map[g.y+d.y][g.x+d.x] !== 1);

    

    valid.sort((a,b) => {

      let dA = Math.abs((g.x+a.x)-pacman.x) + Math.abs((g.y+a.y)-pacman.y);

      let dB = Math.abs((g.x+b.x)-pacman.x) + Math.abs((g.y+b.y)-pacman.y);

      return dA - dB;

    });


    let move = (Math.random() > 0.25) ? valid[0] : valid[Math.floor(Math.random()*valid.length)];

    if(move) { g.x += move.x; g.y += move.y; }

    

    if (g.x === pacman.x && g.y === pacman.y) {

      gameOver = true;

      statusEl.innerText = "CAUGHT!";

      resetBtn.style.display = "inline-block";

    }

  });

}


document.getElementById('game-wrapper').addEventListener('click', () => {

  if(!gameStarted) {

    gameStarted = true;

    overlay.style.display = 'none';

    resetGame();

  }

});


window.addEventListener('keydown', (e) => {

  if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {

    pacman.nextDir = e.key;

    e.preventDefault();

  }

});


let frameCount = 0;

function runGame() {

  if(gameOver) return;

  

  frameCount++;

  if(frameCount % 2 === 0) updatePacman();

  if(frameCount % 4 === 0) updateGhosts(); // Ghosts are slightly slower

  

  draw();

  gameTimer = setTimeout(runGame, 100);

}


// Initial setup

resetGame();




