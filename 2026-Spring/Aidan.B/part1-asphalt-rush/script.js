const canvas = document.getElementById("game");
const ctx    = canvas.getContext("2d");
canvas.width  = 1000;
canvas.height = 600;

const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup",   e => keys[e.key] = false);

const road = { x: 300, width: 400 };

// ── Draw car with canvas shapes instead of images ──
function drawCarShape(x, y, w, h, bodyColor, isAI) {
  // Body
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 6);
  ctx.fill();

  // Roof
  ctx.fillStyle = isAI ? "#cc3333" : "#3399ff";
  ctx.beginPath();
  ctx.roundRect(x + w * 0.2, y + h * 0.15, w * 0.6, h * 0.45, 4);
  ctx.fill();

  // Windshield
  ctx.fillStyle = "rgba(180,230,255,0.7)";
  ctx.beginPath();
  ctx.roundRect(x + w * 0.22, y + h * 0.17, w * 0.56, h * 0.38, 3);
  ctx.fill();

  // Wheels
  ctx.fillStyle = "#111";
  const wr = h * 0.22;
  [[x + w*0.12, y + h*0.08], [x + w*0.12, y + h*0.7],
   [x + w*0.78, y + h*0.08], [x + w*0.78, y + h*0.7]].forEach(([wx, wy]) => {
    ctx.beginPath();
    ctx.ellipse(wx, wy, wr * 0.55, wr, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  // Headlights
  ctx.fillStyle = isAI ? "#ff4444" : "#ffffaa";
  ctx.beginPath();
  ctx.ellipse(x + w * 0.25, isAI ? y + h : y, 6, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + w * 0.75, isAI ? y + h : y, 6, 4, 0, 0, Math.PI * 2);
  ctx.fill();
}

class Car {
  constructor(x, y, speed = 0) {
    this.x = x; this.y = y;
    this.w = 50; this.h = 90;
    this.speed = speed;
  }
  update() {
    if (keys["w"] || keys["ArrowUp"])   this.speed += 0.25;
    if (keys["s"] || keys["ArrowDown"]) this.speed -= 0.25;
    this.speed *= 0.98;
    this.speed = Math.max(-2, Math.min(7, this.speed));
    if (keys["a"] || keys["ArrowLeft"])  this.x -= 4;
    if (keys["d"] || keys["ArrowRight"]) this.x += 4;
    this.x = Math.max(road.x, Math.min(this.x, road.x + road.width - this.w));
    this.y -= this.speed;
  }
  draw() {
    drawCarShape(this.x, this.y, this.w, this.h, "#1a6fbf", false);
  }
}

class AICar extends Car {
  update() {
    this.y += this.speed;
    if (this.y > canvas.height + 150) {
      this.y = -200;
      this.x = road.x + Math.random() * (road.width - this.w);
    }
  }
  draw() {
    drawCarShape(this.x, this.y, this.w, this.h, "#bf1a1a", true);
  }
}

let player, ai, offset = 0;

function drawRoad() {
  ctx.fillStyle = "#333";
  ctx.fillRect(road.x, 0, road.width, canvas.height);

  // Road edges
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 4;
  ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(road.x, 0); ctx.lineTo(road.x, canvas.height); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(road.x + road.width, 0); ctx.lineTo(road.x + road.width, canvas.height); ctx.stroke();

  // Center dashes
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3;
  ctx.setLineDash([25, 25]);
  offset += player.speed * 2;
  for (let i = -50; i < canvas.height + 50; i += 60) {
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, i + (offset % 60));
    ctx.lineTo(canvas.width / 2, i + 30 + (offset % 60));
    ctx.stroke();
  }
  ctx.setLineDash([]);
}

function collision(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x &&
         a.y < b.y + b.h && a.y + a.h > b.y;
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRoad();
  player.update();
  ai.update();
  if (collision(player, ai)) {
    alert("CRASH! 💥");
    player.x = 450; player.y = 480;
    player.speed = 0;
    ai.y = -300;
    ai.x = road.x + Math.random() * (road.width - ai.w);
  }
  player.draw();
  ai.draw();
  requestAnimationFrame(loop);
}

player = new Car(450, 480);
ai     = new AICar(450, -300, 5);
loop();
