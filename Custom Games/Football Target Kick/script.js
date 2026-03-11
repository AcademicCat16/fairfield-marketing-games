const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const shotsEl = document.getElementById("shots");
const windEl  = document.getElementById("wind");
const resetBtn = document.getElementById("reset");

const W = canvas.width;
const H = canvas.height;

let score = 0;
let shots = 10;

let wind = 0; // changes each kick

// Ball state
const ball = {
  r: 14,
  x: 140,
  y: H - 95,
  vx: 0,
  vy: 0,
  flying: false
};

// Aim
let aiming = false;
let aimStart = {x:0, y:0};
let aimNow = {x:0, y:0};

// Target (moves left-right)
const target = {
  w: 44,
  h: 44,
  x: W - 160,
  y: H - 160,
  vx: 2.2,
  // rings for points
  rings: [44, 30, 16] // outer to inner radii
};

const groundY = H - 70;
const gravity = 0.38;

function resetBall() {
  ball.x = 140;
  ball.y = H - 95;
  ball.vx = 0;
  ball.vy = 0;
  ball.flying = false;
}

function resetGame() {
  score = 0;
  shots = 10;
  scoreEl.textContent = score;
  shotsEl.textContent = shots;
  setNewWind();
  resetBall();
}

function setNewWind() {
  // wind from -0.18 to +0.18
  wind = Math.round((Math.random()*0.36 - 0.18) * 100) / 100;
  windEl.textContent = wind.toFixed(2);
}

function drawField() {
  // Sky already from canvas bg; draw lines on grass area
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.font = "12px system-ui";
  // yard lines
  for (let x = 0; x <= W; x += 90) {
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.beginPath();
    ctx.moveTo(x, H*0.30);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  // ground strip
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.fillRect(0, groundY, W, H-groundY);

  // simple goal post
  ctx.strokeStyle = "rgba(255,204,0,0.95)";
  ctx.lineWidth = 6;
  const gx = W - 90, gy = H - 250;
  ctx.beginPath();
  ctx.moveTo(gx, groundY);
  ctx.lineTo(gx, gy);
  ctx.stroke();

  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(gx - 45, gy);
  ctx.lineTo(gx + 45, gy);
  ctx.stroke();

  ctx.restore();
}

function drawBall() {
  ctx.save();
  // shadow
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.beginPath();
  ctx.ellipse(ball.x, groundY+8, ball.r*1.2, ball.r*0.55, 0, 0, Math.PI*2);
  ctx.fill();

  // football
  ctx.translate(ball.x, ball.y);
  const angle = Math.atan2(ball.vy, ball.vx || 1) * 0.5;
  ctx.rotate(angle);

  ctx.fillStyle = "#8b4a2b";
  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.ellipse(0, 0, ball.r*1.4, ball.r, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.stroke();

  // laces
  ctx.strokeStyle = "rgba(255,255,255,0.8)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-6, 0);
  ctx.lineTo(6, 0);
  ctx.stroke();

  ctx.lineWidth = 1.6;
  for (let i=-5; i<=5; i+=2.5){
    ctx.beginPath();
    ctx.moveTo(i, -5);
    ctx.lineTo(i, 5);
    ctx.stroke();
  }

  ctx.restore();
}

function drawTarget() {
  ctx.save();
  // move
  // outer ring
  const cx = target.x + target.w/2;
  const cy = target.y + target.h/2;

  // board
  ctx.fillStyle = "rgba(255,255,255,0.10)";
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 2;
  ctx.fillRect(target.x, target.y, target.w, target.h);
  ctx.strokeRect(target.x, target.y, target.w, target.h);

  // rings
  const colors = ["rgba(255, 80, 80, 0.95)","rgba(255, 204, 0, 0.95)","rgba(80, 255, 140, 0.95)"];
  for (let i=0; i<target.rings.length; i++){
    ctx.beginPath();
    ctx.fillStyle = colors[i];
    ctx.arc(cx, cy, target.rings[i]/2, 0, Math.PI*2);
    ctx.fill();
  }

  ctx.restore();
}

function drawAimLine() {
  if (!aiming || ball.flying) return;

  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.lineWidth = 2;
  ctx.setLineDash([6,6]);

  ctx.beginPath();
  ctx.moveTo(ball.x, ball.y);
  ctx.lineTo(aimNow.x, aimNow.y);
  ctx.stroke();

  // power indicator
  const dx = ball.x - aimNow.x;
  const dy = ball.y - aimNow.y;
  const power = Math.min(Math.hypot(dx,dy), 180);
  ctx.setLineDash([]);
  ctx.fillStyle = "rgba(255,204,0,0.85)";
  ctx.fillRect(18, 18, power, 10);
  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.strokeRect(18, 18, 180, 10);

  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = "12px system-ui";
  ctx.fillText("Power", 18, 46);

  ctx.restore();
}

function updateTarget() {
  target.x += target.vx;
  // bounce inside right half area
  if (target.x < W*0.55) { target.x = W*0.55; target.vx *= -1; }
  if (target.x + target.w > W - 60) { target.x = W - 60 - target.w; target.vx *= -1; }
}

function checkHit() {
  // Check distance to target center
  const cx = target.x + target.w/2;
  const cy = target.y + target.h/2;
  const d = Math.hypot(ball.x - cx, ball.y - cy);

  // If ball overlaps the target rings
  // Use ring thresholds for points (inner = more points)
  if (d < target.rings[2]/2 + ball.r) return 30; // bullseye
  if (d < target.rings[1]/2 + ball.r) return 15;
  if (d < target.rings[0]/2 + ball.r) return 5;
  return 0;
}

function stepPhysics() {
  if (!ball.flying) return;

  // wind nudges horizontal velocity
  ball.vx += wind;

  // gravity
  ball.vy += gravity;

  ball.x += ball.vx;
  ball.y += ball.vy;

  // out of bounds or ground
  const hitGround = (ball.y + ball.r >= groundY);
  const outOfBounds = (ball.x < -50 || ball.x > W + 50 || ball.y < -100 || ball.y > H + 100);

  // hit target while in air
  const pts = checkHit();
  if (pts > 0) {
    score += pts;
    scoreEl.textContent = score;
    ball.flying = false;
    // little reward: speed up target slightly
    target.vx *= 1.03;
    endShot(`Hit! +${pts}`);
    return;
  }

  if (hitGround || outOfBounds) {
    ball.flying = false;
    endShot(hitGround ? "Miss (ground)" : "Miss (out)");
  }
}

function endShot(msg){
  shots--;
  shotsEl.textContent = shots;

  // small toast-style text
  flashMessage(msg);

  if (shots <= 0) {
    setTimeout(() => {
      alert(`Game Over!\nFinal Score: ${score}`);
    }, 50);
  } else {
    setNewWind();
    resetBall();
  }
}

let flashT = 0;
let flashText = "";
function flashMessage(t){
  flashText = t;
  flashT = 90; // frames
}

function drawFlash(){
  if (flashT <= 0) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, flashT/30);
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fillRect(W/2 - 120, 62, 240, 38);
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.font = "14px system-ui";
  ctx.textAlign = "center";
  ctx.fillText(flashText, W/2, 86);
  ctx.restore();
  flashT--;
}

function clear() {
  ctx.clearRect(0,0,W,H);
}

function render() {
  clear();
  drawField();
  updateTarget();
  drawTarget();
  drawAimLine();
  stepPhysics();
  drawBall();
  drawFlash();
  requestAnimationFrame(render);
}

function getMousePos(e){
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  };
}

canvas.addEventListener("mousedown", (e) => {
  if (ball.flying || shots <= 0) return;

  const m = getMousePos(e);
  const d = Math.hypot(m.x - ball.x, m.y - ball.y);
  if (d <= ball.r*2.2) {
    aiming = true;
    aimStart = {x: ball.x, y: ball.y};
    aimNow = m;
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (!aiming) return;
  aimNow = getMousePos(e);
});

window.addEventListener("mouseup", () => {
  if (!aiming) return;
  aiming = false;

  if (shots <= 0) return;

  // launch based on drag vector (pull back to shoot forward)
  const dx = aimStart.x - aimNow.x;
  const dy = aimStart.y - aimNow.y;

  // cap power
  const mag = Math.min(Math.hypot(dx,dy), 180);

  // if tiny drag, ignore
  if (mag < 10) return;

  const ux = dx / (Math.hypot(dx,dy) || 1);
  const uy = dy / (Math.hypot(dx,dy) || 1);

  const power = mag * 0.16; // tuning
  ball.vx = ux * power;
  ball.vy = uy * power;
  ball.flying = true;
});

resetBtn.addEventListener("click", resetGame);

// init
resetGame();
render();
