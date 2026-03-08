// Pierinos cool StarPong
(() => {
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const W = canvas.width;
const H = canvas.height;

const COLORS = {
  white: "#fff", black: "#000", bg: "rgb(0,14,46)",
  p1A: "rgb(70,150,180)", p1B: "rgb(120,220,255)",
  p2A: "rgb(200,70,90)",  p2B: "rgb(255,150,180)",
};
const PADDLE_BASE_SPEED = 11;
const BALL_BASE = 11;

// --- Audio ---
let audioCtx = null;
function beep(freq = 440, dur = 0.05, type = "sine", gain = 0.07) {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const t0 = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(audioCtx.destination);
  osc.start(t0); osc.stop(t0 + dur);
}
const sound = {
  hit:   () => beep(620, 0.04, "square",   0.05),
  wall:  () => beep(320, 0.05, "sine",     0.06),
  score: () => beep(180, 0.09, "triangle", 0.08),
};

// --- Input ---
const keys = new Set();
window.addEventListener("keydown", (e) => {
  keys.add(e.code);
  if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
});
window.addEventListener("keyup", (e) => keys.delete(e.code));

// --- State ---
const State = Object.freeze({ MENU:"menu", POINTS:"points", PLAY:"play", GAMEOVER:"gameover", QUIT:"quit" });
let state = State.MENU;
let gameMode = "ai";
let winningScore = 5;

const paddleW = 34, paddleH = 110, ballS = 14;
const p1 = { x: 50, y: 250, w: paddleW, h: paddleH };
const p2 = { x: W - 50 - paddleW, y: 250, w: paddleW, h: paddleH };
const ball = { x: W/2, y: H/2, w: ballS, h: ballS, vx: BALL_BASE, vy: BALL_BASE, angle: 0, speedMult: 1 };
let paddleMult = 1;
let score1 = 0, score2 = 0;

const trail = [];
const TRAIL_LENGTH = 34;
let hueShift = 0;
const particles = [];
const MAX_PARTICLES = 520;
let lastTs = performance.now();

// --- Helpers ---
function rand(min, max) { return Math.random() * (max - min) + min; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function rectsOverlap(a, b) {
  return a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y;
}
function ballCenter() { return { x: ball.x + ball.w/2, y: ball.y + ball.h/2 }; }
function currentBallSpeed()   { return BALL_BASE   * clamp(ball.speedMult, 1, 2.3); }
function currentPaddleSpeed() { return PADDLE_BASE_SPEED * clamp(paddleMult, 1, 2.0); }
function applyBallSpeed() {
  const s = currentBallSpeed();
  ball.vx = Math.sign(ball.vx || 1) * s;
  ball.vy = Math.sign(ball.vy || 1) * s;
}

function resetBall(scoredBy = "p1") {
  ball.x = (W - ball.w) / 2; ball.y = (H - ball.h) / 2;
  ball.speedMult = 1;
  const s = currentBallSpeed();
  ball.vx = (scoredBy === "p1" ? 1 : -1) * s;
  ball.vy = (Math.random() < 0.5 ? -1 : 1) * s;
  ball.angle = 0; trail.length = 0;
}
function resetMatch() {
  p1.y = 250; p2.y = 250;
  ball.x = (W - ball.w)/2; ball.y = (H - ball.h)/2;
  ball.speedMult = 1; paddleMult = 1;
  const s = currentBallSpeed();
  ball.vx = (Math.random() < 0.5 ? -1 : 1) * s;
  ball.vy = (Math.random() < 0.5 ? -1 : 1) * s;
  ball.angle = 0; trail.length = 0;
  score1 = 0; score2 = 0; particles.length = 0;
}

function aiMove(dt, spd) {
  const target = ball.y + ball.h/2;
  const center = p2.y + p2.h/2;
  const aiSpd = spd * 0.9;
  if (center < target - 6) p2.y += aiSpd * dt * 60;
  else if (center > target + 6) p2.y -= aiSpd * dt * 60;
  p2.y = clamp(p2.y, 0, H - p2.h);
}

// --- Draw ---
function clear(color = COLORS.black) { ctx.fillStyle = color; ctx.fillRect(0,0,W,H); }
function drawCentered(text, y, size=28, color=COLORS.white) {
  ctx.fillStyle = color; ctx.font = `${size}px Arial`;
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(text, W/2, y);
}
function roundRectPath(x, y, w, h, r) {
  const rr = Math.min(r, w/2, h/2);
  ctx.beginPath();
  ctx.moveTo(x+rr, y);
  ctx.arcTo(x+w,y, x+w,y+h, rr);
  ctx.arcTo(x+w,y+h, x,y+h, rr);
  ctx.arcTo(x,y+h, x,y, rr);
  ctx.arcTo(x,y, x+w,y, rr);
  ctx.closePath();
}
function drawPaddle(p, side, glowHue) {
  const r = 14;
  ctx.save();
  ctx.shadowColor = `hsla(${glowHue},100%,70%,0.55)`; ctx.shadowBlur = 18;
  const g = ctx.createLinearGradient(p.x, p.y, p.x, p.y+p.h);
  if (side === "left") { g.addColorStop(0, COLORS.p1B); g.addColorStop(1, COLORS.p1A); }
  else                 { g.addColorStop(0, COLORS.p2B); g.addColorStop(1, COLORS.p2A); }
  roundRectPath(p.x, p.y, p.w, p.h, r);
  ctx.fillStyle = g; ctx.fill();
  ctx.shadowBlur = 0;
  const sheen = ctx.createLinearGradient(p.x, p.y, p.x+p.w, p.y);
  sheen.addColorStop(0, "rgba(255,255,255,0.45)");
  sheen.addColorStop(0.35, "rgba(255,255,255,0.08)");
  sheen.addColorStop(1, "rgba(255,255,255,0)");
  roundRectPath(p.x+3, p.y+3, p.w-6, p.h-6, r-4);
  ctx.fillStyle = sheen; ctx.fill();
  ctx.globalAlpha = 0.25; ctx.fillStyle = "#fff";
  for (let i = 0; i < 5; i++) {
    const ny = p.y + 14 + i * ((p.h-28)/4);
    roundRectPath(p.x+p.w*0.22, ny, p.w*0.56, 5, 3); ctx.fill();
  }
  ctx.restore(); ctx.globalAlpha = 1;
}
function drawStar(cx, cy, spikes, outerR, innerR, color, alpha=1) {
  ctx.save(); ctx.globalAlpha = alpha;
  let rot = (Math.PI/2)*3; const step = Math.PI/spikes;
  ctx.beginPath(); ctx.moveTo(cx, cy-outerR);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx+Math.cos(rot)*outerR, cy+Math.sin(rot)*outerR); rot += step;
    ctx.lineTo(cx+Math.cos(rot)*innerR, cy+Math.sin(rot)*innerR); rot += step;
  }
  ctx.closePath(); ctx.fillStyle = color; ctx.fill(); ctx.restore();
}
function withGlow(color, blur, fn) {
  ctx.save(); ctx.shadowColor = color; ctx.shadowBlur = blur; fn(); ctx.restore();
}

// --- Particles ---
function spawnExplosion(x, y, baseHue, count, power) {
  for (let i = 0; i < Math.min(count,150); i++) {
    if (particles.length >= MAX_PARTICLES) particles.shift();
    const ang = rand(0, Math.PI*2), spd = rand(power*0.4, power);
    particles.push({ x, y, vx: Math.cos(ang)*spd, vy: Math.sin(ang)*spd,
      r: rand(1.3,3.8), life: rand(0.35,0.8), age: 0, hue: (baseHue+rand(-25,25)+360)%360 });
  }
}
function updateParticles(dt) {
  for (let i = particles.length-1; i >= 0; i--) {
    const p = particles[i]; p.age += dt;
    if (p.age >= p.life) { particles.splice(i,1); continue; }
    p.vx *= Math.pow(0.985, dt*60); p.vy *= Math.pow(0.985, dt*60);
    p.vy += 10*dt; p.x += p.vx*dt*60; p.y += p.vy*dt*60;
  }
}
function drawParticles() {
  ctx.save(); ctx.globalCompositeOperation = "lighter";
  for (const p of particles) {
    const t = 1 - p.age/p.life, alpha = clamp(t,0,1)*0.85;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r*(0.75+0.6*(1-t)), 0, Math.PI*2);
    ctx.fillStyle = `hsla(${p.hue},100%,60%,${alpha})`;
    ctx.shadowColor = `hsla(${p.hue},100%,60%,${alpha})`;
    ctx.shadowBlur = 10; ctx.fill();
  }
  ctx.restore();
}

// --- Screens ---
function drawMenu() {
  clear(COLORS.black);
  drawCentered("⭐ Pierinos cool StarPong ⭐", H*0.25, 52);
  drawCentered("Press 1  —  1 Player (vs AI)", H*0.48, 26);
  drawCentered("Press 2  —  2 Players", H*0.55, 26);
  drawCentered("Press Q  —  Quit", H*0.62, 26);
}
function drawPointsMenu() {
  clear(COLORS.black);
  drawCentered("Select Winning Score", H*0.23, 52);
  drawCentered("Press 5  —  First to 5 points", H*0.48, 26);
  drawCentered("Press 0  —  First to 10 points", H*0.55, 26);
  drawCentered("Press Q  —  Quit", H*0.62, 26);
}
function drawGameOver() {
  clear(COLORS.black);
  drawCentered("Game Over", H*0.27, 80);
  drawCentered("Press R  —  Restart", H*0.50, 26);
  drawCentered("Press M  —  Menu",    H*0.57, 26);
  drawCentered("Press Q  —  Quit",    H*0.64, 26);
}
function drawGame() {
  clear(COLORS.bg);
  const glowHue = (hueShift+30)%360;
  drawPaddle(p1, "left",  glowHue);
  drawPaddle(p2, "right", (glowHue+140)%360);
  drawParticles();
  ctx.save(); ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < trail.length; i++) {
    const t = trail[i], hue = (hueShift+i*10)%360;
    const alpha = (i/trail.length)*0.55;
    const sz = 11-(trail.length-1-i)*0.12;
    withGlow(`hsla(${hue},100%,60%,${alpha})`, 12, () =>
      drawStar(t.x, t.y, 5, sz, sz*0.5, `hsla(${hue},100%,60%,${alpha})`, 1)
    );
  }
  ctx.restore();
  const c = ballCenter();
  const mh = (hueShift+40)%360;
  ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(ball.angle);
  withGlow(`hsla(${mh},100%,70%,0.9)`, 18, () => drawStar(0,0,5,13,6.5,COLORS.white,1));
  ctx.restore();
  ctx.fillStyle = COLORS.white; ctx.font = "24px Arial";
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(`P1: ${score1}`, W/2, 40);
  ctx.fillText(`P2: ${score2}`, W/2, H-40);
  ctx.font = "13px Arial";
  ctx.fillText(`Ball ×${ball.speedMult.toFixed(2)}  Paddle ×${paddleMult.toFixed(2)}`, W/2, 68);
}

// --- Logic ---
function handleMenus() {
  if (state === State.MENU) {
    if (keys.has("Digit1"))      { gameMode="ai"; winningScore=5; resetMatch(); state=State.PLAY; }
    else if (keys.has("Digit2")) { gameMode="2p"; state=State.POINTS; }
    else if (keys.has("KeyQ"))   { state=State.QUIT; }
  } else if (state === State.POINTS) {
    if (keys.has("Digit5"))      { winningScore=5;  resetMatch(); state=State.PLAY; }
    else if (keys.has("Digit0")) { winningScore=10; resetMatch(); state=State.PLAY; }
    else if (keys.has("KeyQ"))   { state=State.QUIT; }
  } else if (state === State.GAMEOVER) {
    if (keys.has("KeyR"))        { resetMatch(); state=State.PLAY; }
    else if (keys.has("KeyM"))   { state=State.MENU; }
    else if (keys.has("KeyQ"))   { state=State.QUIT; }
  }
}
function update(dt) {
  if (state !== State.PLAY) { handleMenus(); updateParticles(dt); return; }
  ball.speedMult = clamp(ball.speedMult + 0.015*dt, 1, 2.3);
  paddleMult     = clamp(paddleMult     + 0.01*dt,  1, 2.0);
  const spd = currentPaddleSpeed(), mv = spd*dt*60;
  if (keys.has("KeyW")) p1.y -= mv;
  if (keys.has("KeyS")) p1.y += mv;
  p1.y = clamp(p1.y, 0, H-p1.h);
  if (gameMode === "2p") {
    if (keys.has("ArrowUp"))   p2.y -= mv;
    if (keys.has("ArrowDown")) p2.y += mv;
    p2.y = clamp(p2.y, 0, H-p2.h);
  } else { aiMove(dt, spd); }
  applyBallSpeed();
  ball.x += ball.vx*dt*60; ball.y += ball.vy*dt*60;
  ball.angle += 0.18*dt*60;
  hueShift = (hueShift + 2*dt*60) % 360;
  const c = ballCenter();
  trail.push({x:c.x, y:c.y});
  if (trail.length > TRAIL_LENGTH) trail.shift();
  const preVx = ball.vx;
  if (rectsOverlap(ball,p1) && ball.vx < 0) {
    ball.x = p1.x+p1.w; ball.vx *= -1;
    ball.vy += ((c.y-(p1.y+p1.h/2))/(p1.h/2))*2.2;
    ball.speedMult = clamp(ball.speedMult+0.05,1,2.3);
    paddleMult = clamp(paddleMult+0.02,1,2.0);
    sound.hit(); spawnExplosion(p1.x+p1.w+6, c.y, hueShift, 70, 7);
  } else if (rectsOverlap(ball,p2) && ball.vx > 0) {
    ball.x = p2.x-ball.w; ball.vx *= -1;
    ball.vy += ((c.y-(p2.y+p2.h/2))/(p2.h/2))*2.2;
    ball.speedMult = clamp(ball.speedMult+0.05,1,2.3);
    paddleMult = clamp(paddleMult+0.02,1,2.0);
    sound.hit(); spawnExplosion(p2.x-6, c.y, hueShift, 70, 7);
  }
  if (Math.sign(preVx) !== Math.sign(ball.vx)) applyBallSpeed();
  if (ball.y <= 0) { ball.y=0; ball.vy*=-1; sound.wall(); spawnExplosion(c.x,8,hueShift+40,45,6); }
  else if (ball.y+ball.h >= H) { ball.y=H-ball.h; ball.vy*=-1; sound.wall(); spawnExplosion(c.x,H-8,hueShift+40,45,6); }
  if (ball.x+ball.w < 0) { score2++; sound.score(); spawnExplosion(30,c.y,hueShift+120,115,9); resetBall("p2"); }
  else if (ball.x > W)   { score1++; sound.score(); spawnExplosion(W-30,c.y,hueShift+120,115,9); resetBall("p1"); }
  if (score1>=winningScore || score2>=winningScore) { spawnExplosion(W/2,H/2,hueShift,190,10); state=State.GAMEOVER; }
  updateParticles(dt);
}
function render() {
  if      (state===State.MENU)     drawMenu();
  else if (state===State.POINTS)   drawPointsMenu();
  else if (state===State.PLAY)     drawGame();
  else if (state===State.GAMEOVER) drawGameOver();
  else if (state===State.QUIT)     { clear(COLORS.black); drawCentered("Quit — refresh to play again", H/2, 32); }
}
function loop(ts) {
  const dt = clamp((ts-lastTs)/1000, 0, 0.05);
  lastTs = ts; update(dt); render();
  requestAnimationFrame(loop);
}
window.addEventListener("pointerdown", () => {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
}, { once: true });
requestAnimationFrame((ts) => { lastTs=ts; loop(ts); });
})();
