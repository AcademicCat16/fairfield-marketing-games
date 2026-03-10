const canvas = document.getElementById("game");
const ctx    = canvas.getContext("2d");

const tileSize = 25;
const rows     = 20;
const cols     = 20;
let score      = 0;

let pacman = {
  x: 10 * tileSize,
  y: 10 * tileSize,
  radius: 10,
  dx: 0,
  dy: 0,
  speed: 2,
  mouthOpen: 0
};

let ghost = {
  x: 5 * tileSize,
  y: 5 * tileSize,
  size: 20,
  dx: 2,
  dy: 0
};

let pellets = [];
for (let r = 1; r < rows - 1; r++) {
  for (let c = 1; c < cols - 1; c++) {
    pellets.push({
      x: c * tileSize + tileSize / 2,
      y: r * tileSize + tileSize / 2,
      eaten: false
    });
  }
}

function drawMaze() {
  ctx.strokeStyle = "#00ffff";
  ctx.lineWidth   = 3;
  ctx.shadowBlur  = 15;
  ctx.shadowColor = "#00ffff";
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
  ctx.shadowBlur  = 0;
}

function drawPacman() {
  pacman.mouthOpen += 0.1;
  const angle    = Math.abs(Math.sin(pacman.mouthOpen)) * 0.4;
  const gradient = ctx.createRadialGradient(
    pacman.x, pacman.y, 5,
    pacman.x, pacman.y, pacman.radius
  );
  gradient.addColorStop(0, "#fff176");
  gradient.addColorStop(1, "#fbc02d");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(pacman.x, pacman.y);
  ctx.arc(pacman.x, pacman.y, pacman.radius, angle, Math.PI * 2 - angle);
  ctx.closePath();
  ctx.fill();
}

function drawGhost() {
  ctx.fillStyle   = "#ff4081";
  ctx.shadowBlur  = 20;
  ctx.shadowColor = "#ff4081";
  ctx.beginPath();
  ctx.arc(ghost.x, ghost.y, ghost.size / 2, Math.PI, 0);
  ctx.lineTo(ghost.x + ghost.size / 2, ghost.y + ghost.size / 2);
  ctx.lineTo(ghost.x - ghost.size / 2, ghost.y + ghost.size / 2);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawPellets() {
  pellets.forEach(p => {
    if (!p.eaten) {
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

function update() {
  pacman.x += pacman.dx;
  pacman.y += pacman.dy;

  // Wrap pacman around edges
  if (pacman.x < 0)              pacman.x = canvas.width;
  if (pacman.x > canvas.width)   pacman.x = 0;
  if (pacman.y < 0)              pacman.y = canvas.height;
  if (pacman.y > canvas.height)  pacman.y = 0;

  ghost.x += ghost.dx;
  ghost.y += ghost.dy;
  if (ghost.x <= 0 || ghost.x >= canvas.width) ghost.dx *= -1;

  pellets.forEach(p => {
    if (!p.eaten && Math.hypot(pacman.x - p.x, pacman.y - p.y) < pacman.radius) {
      p.eaten = true;
      score  += 10;
      document.getElementById("score").innerText = "Score: " + score;
    }
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMaze();
  drawPellets();
  drawPacman();
  drawGhost();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp")    { pacman.dx = 0;             pacman.dy = -pacman.speed; }
  if (e.key === "ArrowDown")  { pacman.dx = 0;             pacman.dy =  pacman.speed; }
  if (e.key === "ArrowLeft")  { pacman.dx = -pacman.speed; pacman.dy = 0; }
  if (e.key === "ArrowRight") { pacman.dx =  pacman.speed; pacman.dy = 0; }
});

loop();
