var canvas   = document.getElementById('game');
var ctx      = canvas.getContext('2d');
var W = canvas.width;
var H = canvas.height;

var scoreEl  = document.getElementById('scoreEl');
var bestEl   = document.getElementById('bestEl');
var shotsEl  = document.getElementById('shotsEl');

var score      = 0;
var best       = 0;
var shots      = 0;
var shooting   = false;
var charging   = false;
var charge     = 0;
var MAX_CHARGE = 1.5;
var chargeTime = 0;

var BALL_START_X = 80;
var BALL_START_Y = H - 70;
var ball = { x: BALL_START_X, y: BALL_START_Y, r: 13, vx: 0, vy: 0 };

var aimAngle = -Math.PI / 3;
var AIM_SPEED = 1.2;

var hoop  = { x: 420, y: 130, w: 50 };
var board = { x: hoop.x + hoop.w + 4, y: hoop.y - 40, w: 10, h: 90 };
var pole  = { x: board.x + board.w, y: board.y, h: H - board.y };
var FLOOR_Y = H - 40;
var GRAVITY  = 800;   // px/s²  — tuned so a full-charge shot arcs over the court

var trail  = [];
var popups = [];

var keys = {};
document.addEventListener('keydown', function(e) {
  if (e.code === 'Space' || e.code === 'ArrowLeft' || e.code === 'ArrowRight') e.preventDefault();
  keys[e.code] = true;
  if (e.code === 'Space' && !shooting) {
    charging   = true;
    chargeTime = 0;
    charge     = 0;
  }
});
document.addEventListener('keyup', function(e) {
  keys[e.code] = false;
  if (e.code === 'Space' && charging && !shooting) shoot();
});

function shoot() {
  charging = false;
  shooting = true;
  shots++;
  shotsEl.textContent = shots;
  // power in px/s — min 380, max 900 at full charge
  var power = 380 + charge * 520;
  ball.vx = Math.cos(aimAngle) * power;
  ball.vy = Math.sin(aimAngle) * power;
  trail   = [];
}

function resetBall() {
  ball.x  = BALL_START_X;
  ball.y  = BALL_START_Y;
  ball.vx = 0;
  ball.vy = 0;
  shooting   = false;
  charging   = false;
  charge     = 0;
  chargeTime = 0;
  trail      = [];
}

var lastTime = 0;
function update(ts) {
  var dt = Math.min((ts - lastTime) / 1000, 0.05);
  lastTime = ts;

  // Aim
  if (!shooting) {
    if (keys['ArrowLeft'])  aimAngle -= AIM_SPEED * dt;
    if (keys['ArrowRight']) aimAngle += AIM_SPEED * dt;
    aimAngle = Math.max(-Math.PI * 0.9, Math.min(-Math.PI * 0.1, aimAngle));
  }

  // Charge
  if (charging) {
    chargeTime += dt;
    charge = Math.min(chargeTime / MAX_CHARGE, 1);
  }

  // Physics — all in px/s and px/s²
  if (shooting) {
    trail.push({ x: ball.x, y: ball.y });
    if (trail.length > 24) trail.shift();

    ball.vy += GRAVITY * dt;   // gravity in px/s²
    ball.x  += ball.vx * dt;
    ball.y  += ball.vy * dt;

    // Wall bounces
    if (ball.x - ball.r < 0)  { ball.x = ball.r;     ball.vx =  Math.abs(ball.vx) * 0.6; }
    if (ball.x + ball.r > W)  { ball.x = W - ball.r; ball.vx = -Math.abs(ball.vx) * 0.6; }

    // Floor bounce
    if (ball.y + ball.r >= FLOOR_Y) {
      ball.y  = FLOOR_Y - ball.r;
      ball.vy = -Math.abs(ball.vy) * 0.45;
      ball.vx *= 0.8;
      if (Math.abs(ball.vy) < 40) { resetBall(); }
    }

    // Backboard bounce
    if (ball.x + ball.r > board.x &&
        ball.x - ball.r < board.x + board.w &&
        ball.y          > board.y &&
        ball.y          < board.y + board.h) {
      ball.vx = -Math.abs(ball.vx) * 0.7;
      ball.x  = board.x - ball.r;
    }

    // Score: pass through hoop downward
    var hoopCX = hoop.x + hoop.w / 2;
    var dx = ball.x - hoopCX;
    var dy = ball.y - hoop.y;
    if (Math.abs(dx) < hoop.w * 0.38 && Math.abs(dy) < 16 && ball.vy > 0) {
      score++;
      if (score > best) { best = score; bestEl.textContent = best; }
      scoreEl.textContent = score;
      popups.push({ x: hoopCX, y: hoop.y - 20, alpha: 1 });
      shooting = false;
      setTimeout(resetBall, 500);
    }

    // Off screen — missed
    if (ball.y > H + 30) resetBall();
  }

  // Popups
  for (var i = popups.length - 1; i >= 0; i--) {
    popups[i].y    -= 60 * dt;
    popups[i].alpha -= 0.9 * dt;
    if (popups[i].alpha <= 0) popups.splice(i, 1);
  }

  draw();
  requestAnimationFrame(update);
}

function draw() {
  // Background
  var bgGrd = ctx.createLinearGradient(0, 0, 0, H);
  bgGrd.addColorStop(0, '#1a1a2e');
  bgGrd.addColorStop(1, '#0f0f1e');
  ctx.fillStyle = bgGrd;
  ctx.fillRect(0, 0, W, H);

  // Floor
  ctx.fillStyle = '#c8860a';
  ctx.fillRect(0, FLOOR_Y, W, H - FLOOR_Y);
  ctx.fillStyle = '#b5760a';
  ctx.fillRect(0, FLOOR_Y, W, 4);

  // Court lines
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(BALL_START_X - 10, FLOOR_Y, 180, -Math.PI * 0.85, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(200, FLOOR_Y - 110);
  ctx.lineTo(200, FLOOR_Y);
  ctx.stroke();

  // Pole
  ctx.fillStyle = '#555';
  ctx.fillRect(pole.x, pole.y, 8, pole.h);

  // Backboard
  ctx.fillStyle = '#ddd';
  ctx.fillRect(board.x, board.y, board.w, board.h);
  ctx.strokeStyle = 'rgba(255,100,0,0.6)';
  ctx.lineWidth = 2;
  ctx.strokeRect(board.x + 1, board.y + board.h * 0.28, board.w - 2, board.h * 0.44);

  // Hoop shadow
  ctx.strokeStyle = 'rgba(0,0,0,0.35)';
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.moveTo(hoop.x, hoop.y + 4);
  ctx.lineTo(hoop.x + hoop.w, hoop.y + 4);
  ctx.stroke();

  // Hoop
  ctx.strokeStyle = '#ff4500';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(hoop.x, hoop.y);
  ctx.lineTo(hoop.x + hoop.w, hoop.y);
  ctx.stroke();

  // Net
  drawNet();

  // Trail
  for (var i = 0; i < trail.length; i++) {
    var a = (i / trail.length) * 0.5;
    ctx.globalAlpha = a;
    ctx.fillStyle = '#ff8c00';
    ctx.beginPath();
    ctx.arc(trail[i].x, trail[i].y, ball.r * 0.45, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Aim line
  if (!shooting) {
    var alen = 55 + charge * 40;
    var ax = ball.x + Math.cos(aimAngle) * alen;
    var ay = ball.y + Math.sin(aimAngle) * alen;
    ctx.globalAlpha = 0.55 + charge * 0.45;
    ctx.strokeStyle = charge > 0.7 ? '#ff4500' : '#ffd166';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(ball.x, ball.y);
    ctx.lineTo(ax, ay);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = charge > 0.7 ? '#ff4500' : '#ffd166';
    drawArrowHead(ax, ay, aimAngle);
    ctx.globalAlpha = 1;
  }

  // Charge bar
  if (charging) {
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(ball.x - 25, ball.y + 20, 50, 8);
    ctx.fillStyle = charge < 0.6 ? '#3bff3b' : charge < 0.85 ? '#ffd166' : '#ff4500';
    ctx.fillRect(ball.x - 25, ball.y + 20, 50 * charge, 8);
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(ball.x - 25, ball.y + 20, 50, 8);
    ctx.fillStyle = 'white';
    ctx.font = '11px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(Math.round(charge * 100) + '%', ball.x, ball.y + 36);
    ctx.textAlign = 'left';
  }

  // Ball
  drawBall(ball.x, ball.y, ball.r);

  // Popups
  for (var j = 0; j < popups.length; j++) {
    ctx.globalAlpha = Math.max(0, popups[j].alpha);
    ctx.fillStyle   = '#ffd166';
    ctx.font        = 'bold 22px Arial';
    ctx.textAlign   = 'center';
    ctx.fillText('🏀 +1', popups[j].x, popups[j].y);
    ctx.textAlign   = 'left';
  }
  ctx.globalAlpha = 1;

  // Hint
  if (!shooting && !charging) {
    ctx.fillStyle  = 'rgba(255,255,255,0.22)';
    ctx.font       = '13px Arial';
    ctx.textAlign  = 'center';
    ctx.fillText('Hold SPACE to charge  ·  ← → to aim', W / 2, H - 10);
    ctx.textAlign  = 'left';
  }
}

function drawBall(x, y, r) {
  // Floor shadow
  ctx.fillStyle = 'rgba(0,0,0,0.28)';
  ctx.beginPath();
  ctx.ellipse(x, FLOOR_Y - 2, r * 1.1, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  var grd = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.05, x, y, r);
  grd.addColorStop(0,   '#ffb347');
  grd.addColorStop(0.5, '#ff8c00');
  grd.addColorStop(1,   '#c85a00');
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = grd;
  ctx.fill();

  ctx.strokeStyle = 'rgba(100,30,0,0.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.bezierCurveTo(x + r * 0.5, y - r * 0.3, x + r * 0.5, y + r * 0.3, x, y + r);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.bezierCurveTo(x - r * 0.5, y - r * 0.3, x - r * 0.5, y + r * 0.3, x, y + r);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - r, y);
  ctx.bezierCurveTo(x - r * 0.3, y - r * 0.4, x + r * 0.3, y - r * 0.4, x + r, y);
  ctx.stroke();

  ctx.fillStyle = 'rgba(255,255,255,0.32)';
  ctx.beginPath();
  ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.28, 0, Math.PI * 2);
  ctx.fill();
}

function drawNet() {
  var nx = hoop.x, ny = hoop.y, nw = hoop.w, nh = 28, segs = 6;
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 1;
  for (var i = 0; i <= segs; i++) {
    var px = nx + (nw / segs) * i;
    ctx.beginPath();
    ctx.moveTo(px, ny);
    ctx.lineTo(px + (i - segs / 2) * 2, ny + nh);
    ctx.stroke();
  }
  for (var row = 1; row <= 4; row++) {
    var py     = ny + nh * (row / 4);
    var shrink = row * 1.5;
    ctx.beginPath();
    ctx.moveTo(nx + shrink * 0.3,      py);
    ctx.lineTo(nx + nw - shrink * 0.3, py);
    ctx.stroke();
  }
}

function drawArrowHead(x, y, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-10, -5);
  ctx.lineTo(-10, 5);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

requestAnimationFrame(update);
