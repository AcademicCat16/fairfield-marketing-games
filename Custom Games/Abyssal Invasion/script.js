// ─── Canvas Setup ────────────────────────────────────────────
var canvas  = document.getElementById('game');
var ctx     = canvas.getContext('2d');
var W = canvas.width;
var H = canvas.height;

// ─── Game State ───────────────────────────────────────────────
var STATE_TITLE    = 0;
var STATE_PLAYING  = 1;
var STATE_WIN      = 2;
var STATE_LOSE     = 3;

var state      = STATE_TITLE;
var score      = 0;
var lives      = 3;
var levelNum   = 1;
var frameId    = null;
var lastTime   = 0;

// ─── Input ────────────────────────────────────────────────────
var keys = {};
document.addEventListener('keydown', function(e) {
  keys[e.code] = true;
  if (e.code === 'Space') e.preventDefault();
  if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') e.preventDefault();
  // Start / restart
  if (e.code === 'Space' && state !== STATE_PLAYING) {
    initGame();
  }
});
document.addEventListener('keyup', function(e) { keys[e.code] = false; });

// ─── Stars ────────────────────────────────────────────────────
var stars = [];
function initStars() {
  stars = [];
  for (var i = 0; i < 120; i++) {
    stars.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 40 + 20,
      alpha: Math.random() * 0.6 + 0.2
    });
  }
}
function updateStars(dt) {
  for (var i = 0; i < stars.length; i++) {
    stars[i].y += stars[i].speed * dt;
    if (stars[i].y > H) stars[i].y = 0;
  }
}
function drawStars() {
  for (var i = 0; i < stars.length; i++) {
    var s = stars[i];
    ctx.globalAlpha = s.alpha;
    ctx.fillStyle = '#b2ebf2';
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// ─── Player (Submarine) ───────────────────────────────────────
var player = {};
function initPlayer() {
  player = {
    x: W / 2 - 20,
    y: H - 80,
    w: 40,
    h: 22,
    speed: 220,
    reload: 0,
    reloadTime: 0.22,
    alive: true
  };
}
function drawSubmarine(x, y, w, h) {
  // Hull
  ctx.fillStyle = '#0a9396';
  ctx.beginPath();
  ctx.ellipse(x + w/2, y + h*0.6, w/2, h*0.42, 0, 0, Math.PI*2);
  ctx.fill();
  // Conning tower
  ctx.fillStyle = '#005f73';
  ctx.beginPath();
  ctx.roundRect(x + w*0.35, y, w*0.3, h*0.55, 4);
  ctx.fill();
  // Periscope
  ctx.strokeStyle = '#94d2bd';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + w*0.5, y);
  ctx.lineTo(x + w*0.5, y - 8);
  ctx.lineTo(x + w*0.65, y - 8);
  ctx.stroke();
  // Propeller
  ctx.fillStyle = '#94d2bd';
  ctx.beginPath();
  ctx.ellipse(x + w, y + h*0.6, 4, 8, 0.4, 0, Math.PI*2);
  ctx.fill();
  // Porthole
  ctx.fillStyle = '#e0f7fa';
  ctx.beginPath();
  ctx.arc(x + w*0.3, y + h*0.65, 4, 0, Math.PI*2);
  ctx.fill();
}
function updatePlayer(dt) {
  if (!player.alive) return;
  if (keys['ArrowLeft'])  player.x -= player.speed * dt;
  if (keys['ArrowRight']) player.x += player.speed * dt;
  player.x = Math.max(0, Math.min(W - player.w, player.x));
  player.reload -= dt;
  if (keys['Space'] && player.reload <= 0) {
    player.reload = player.reloadTime;
    torpedoes.push({ x: player.x + player.w/2 - 2, y: player.y - 4, w: 4, h: 12, vy: -550 });
    torpedoes.push({ x: player.x + player.w - 6,   y: player.y - 4, w: 4, h: 12, vy: -550 });
  }
}

// ─── Torpedoes (Player) ───────────────────────────────────────
var torpedoes = [];
function updateTorpedoes(dt) {
  for (var i = torpedoes.length - 1; i >= 0; i--) {
    torpedoes[i].y += torpedoes[i].vy * dt;
    if (torpedoes[i].y < -20) torpedoes.splice(i, 1);
  }
}
function drawTorpedoes() {
  ctx.fillStyle = '#ffd166';
  for (var i = 0; i < torpedoes.length; i++) {
    var t = torpedoes[i];
    ctx.beginPath();
    ctx.roundRect(t.x, t.y, t.w, t.h, 2);
    ctx.fill();
    // Trail
    ctx.fillStyle = 'rgba(255,209,102,0.3)';
    ctx.fillRect(t.x, t.y + t.h, t.w, 8);
    ctx.fillStyle = '#ffd166';
  }
}

// ─── Enemy Missiles ───────────────────────────────────────────
var eMissiles = [];
function updateEMissiles(dt) {
  for (var i = eMissiles.length - 1; i >= 0; i--) {
    eMissiles[i].y += 200 * dt;
    if (eMissiles[i].y > H + 20) {
      eMissiles.splice(i, 1);
      continue;
    }
    // Hit player
    if (player.alive && rectsOverlap(eMissiles[i], player)) {
      eMissiles.splice(i, 1);
      hitPlayer();
    }
  }
}
function drawEMissiles() {
  ctx.fillStyle = '#ef233c';
  for (var i = 0; i < eMissiles.length; i++) {
    var m = eMissiles[i];
    ctx.fillRect(m.x, m.y, m.w, m.h);
  }
}

// ─── Enemies ─────────────────────────────────────────────────
var ENEMY_TYPES = {
  jellyfish: {
    symbol: '🪼', w: 38, h: 38, health: 10, points: 100,
    A:0, B:80, C:1.2, D:0, E:60, F:0, G:0, H:0, reloadTime:1.2, missiles:1
  },
  fish: {
    symbol: '🐡', w: 38, h: 38, health: 20, points: 150,
    A:0, B:60, C:3, D:0, E:80, F:0, G:0, H:0, reloadTime:0.9, missiles:2
  },
  shark: {
    symbol: '🦈', w: 42, h: 32, health: 10, points: 100,
    A:0, B:0, C:0, D:0, E:90, F:0, G:0, H:0, reloadTime:1.5, missiles:1
  },
  mine: {
    symbol: '💣', w: 30, h: 30, health: 10, points: 80,
    A:0, B:-120, C:1, D:0, E:20, F:100, G:1, H:Math.PI/2, reloadTime:99, missiles:0
  },
  octopus: {
    symbol: '🐙', w: 40, h: 40, health: 30, points: 200,
    A:0, B:70, C:2, D:0, E:70, F:0, G:0, H:0, reloadTime:0.6, missiles:2
  }
};

var enemies = [];
var enemySpawnQueue = [];
var levelTimer = 0;

// Level definition: [startTime, endTime, gap, type, xOverride]
var LEVELS = {
  1: [
    [0,    4000, 600,  'shark',     { x: 80 }],
    [0,    4000, 600,  'shark',     { x: 240 }],
    [3000, 8000, 700,  'jellyfish', { x: 60 }],
    [5000, 9000, 500,  'mine',      { x: 200 }],
    [7000, 12000, 600, 'fish',      { x: 150 }],
    [10000,14000, 400, 'octopus',   { x: 100 }]
  ],
  2: [
    [0,    3000, 400,  'shark',     { x: 50  }],
    [0,    3000, 400,  'shark',     { x: 300 }],
    [2000, 7000, 500,  'jellyfish', { x: 120 }],
    [4000, 8000, 400,  'mine',      { x: 180 }],
    [6000, 11000,450,  'fish',      { x: 80  }],
    [6000, 11000,450,  'fish',      { x: 250 }],
    [10000,14000,350,  'octopus',   { x: 150 }],
    [10000,14000,350,  'octopus',   { x: 280 }]
  ]
};

function initLevel(lvl) {
  enemies = [];
  eMissiles = [];
  torpedoes = [];
  levelTimer = 0;
  var def = LEVELS[lvl] || LEVELS[1];
  enemySpawnQueue = [];
  for (var i = 0; i < def.length; i++) {
    var d = def[i];
    var start = d[0], end = d[1], gap = d[2], type = d[3], ov = d[4] || {};
    var t = start;
    while (t <= end) {
      enemySpawnQueue.push({ t: t, type: type, x: ov.x !== undefined ? ov.x : Math.random()*(W-50) });
      t += gap;
    }
  }
  enemySpawnQueue.sort(function(a,b){ return a.t - b.t; });
}

function spawnEnemy(type, x) {
  var tmpl = ENEMY_TYPES[type];
  enemies.push({
    type: type,
    symbol: tmpl.symbol,
    x: x, y: -tmpl.h - 5,
    w: tmpl.w, h: tmpl.h,
    health: tmpl.health,
    maxHealth: tmpl.health,
    points: tmpl.points,
    A: tmpl.A, B: tmpl.B, C: tmpl.C, D: tmpl.D,
    E: tmpl.E, F: tmpl.F, G: tmpl.G, H: tmpl.H,
    t: 0,
    reloadTime: tmpl.reloadTime,
    reload: tmpl.reloadTime * Math.random(),
    missiles: tmpl.missiles
  });
}

function updateEnemies(dt) {
  // Spawn from queue
  var ms = levelTimer;
  while (enemySpawnQueue.length && enemySpawnQueue[0].t <= ms) {
    var q = enemySpawnQueue.shift();
    spawnEnemy(q.type, q.x);
  }

  for (var i = enemies.length - 1; i >= 0; i--) {
    var e = enemies[i];
    e.t += dt;
    e.vx = e.A + e.B * Math.sin(e.C * e.t + e.D);
    e.vy = e.E + e.F * Math.sin(e.G * e.t + e.H);
    e.x += e.vx * dt;
    e.y += e.vy * dt;

    // Off screen
    if (e.y > H + e.h || e.x < -e.w*2 || e.x > W + e.w*2) {
      enemies.splice(i, 1); continue;
    }

    // Collide with player
    if (player.alive && rectsOverlap(e, player)) {
      hitPlayer();
      addExplosion(e.x + e.w/2, e.y + e.h/2);
      enemies.splice(i, 1); continue;
    }

    // Check torpedo hits
    var hit = false;
    for (var j = torpedoes.length - 1; j >= 0; j--) {
      if (rectsOverlap(torpedoes[j], e)) {
        torpedoes.splice(j, 1);
        e.health -= 10;
        if (e.health <= 0) {
          score += e.points;
          updateHUD();
          addExplosion(e.x + e.w/2, e.y + e.h/2);
          enemies.splice(i, 1);
          hit = true; break;
        }
      }
    }
    if (hit) continue;

    // Fire missiles
    e.reload -= dt;
    if (e.missiles > 0 && e.reload <= 0 && e.y > 0) {
      e.reload = e.reloadTime;
      if (e.missiles === 2) {
        eMissiles.push({ x: e.x + 4,       y: e.y + e.h, w: 4, h: 10 });
        eMissiles.push({ x: e.x + e.w - 8, y: e.y + e.h, w: 4, h: 10 });
      } else {
        eMissiles.push({ x: e.x + e.w/2 - 2, y: e.y + e.h, w: 4, h: 10 });
      }
    }
  }
}

function drawEnemies() {
  ctx.font = '32px serif';
  ctx.textAlign = 'center';
  for (var i = 0; i < enemies.length; i++) {
    var e = enemies[i];
    ctx.fillText(e.symbol, e.x + e.w/2, e.y + e.h);
    // Health bar
    if (e.health < e.maxHealth) {
      ctx.fillStyle = '#333';
      ctx.fillRect(e.x, e.y - 8, e.w, 5);
      ctx.fillStyle = '#ef233c';
      ctx.fillRect(e.x, e.y - 8, e.w * (e.health / e.maxHealth), 5);
    }
  }
  ctx.textAlign = 'left';
}

// ─── Explosions ───────────────────────────────────────────────
var explosions = [];
function addExplosion(cx, cy) {
  explosions.push({ x: cx, y: cy, r: 4, maxR: 36 + Math.random()*16, alpha: 1 });
  explosions.push({ x: cx + (Math.random()-0.5)*20, y: cy + (Math.random()-0.5)*20,
                    r: 2, maxR: 20 + Math.random()*14, alpha: 0.85 });
}
function updateExplosions(dt) {
  for (var i = explosions.length - 1; i >= 0; i--) {
    var ex = explosions[i];
    ex.r += ex.maxR * dt * 2.2;
    ex.alpha -= dt * 2.4;
    if (ex.alpha <= 0) explosions.splice(i, 1);
  }
}
function drawExplosions() {
  for (var i = 0; i < explosions.length; i++) {
    var ex = explosions[i];
    var grd = ctx.createRadialGradient(ex.x, ex.y, 0, ex.x, ex.y, ex.r);
    grd.addColorStop(0,   'rgba(255,255,200,' + ex.alpha + ')');
    grd.addColorStop(0.4, 'rgba(255,150,0,'   + ex.alpha + ')');
    grd.addColorStop(1,   'rgba(255,50,0,0)');
    ctx.beginPath();
    ctx.arc(ex.x, ex.y, ex.r, 0, Math.PI*2);
    ctx.fillStyle = grd;
    ctx.fill();
  }
}

// ─── Player Hit ───────────────────────────────────────────────
var invincible = 0;
function hitPlayer() {
  if (invincible > 0) return;
  lives--;
  updateHUD();
  addExplosion(player.x + player.w/2, player.y + player.h/2);
  invincible = 2.0;
  if (lives <= 0) {
    player.alive = false;
    setTimeout(function() { state = STATE_LOSE; }, 1200);
  }
}

// ─── Collision ────────────────────────────────────────────────
function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x &&
         a.y < b.y + b.h && a.y + a.h > b.y;
}

// ─── HUD ──────────────────────────────────────────────────────
function updateHUD() {
  document.getElementById('scoreDisplay').textContent = score;
  document.getElementById('livesDisplay').textContent = lives;
  document.getElementById('levelDisplay').textContent = levelNum;
}

// ─── Game Init ────────────────────────────────────────────────
function initGame() {
  score    = 0;
  lives    = 3;
  levelNum = 1;
  invincible = 0;
  initStars();
  initPlayer();
  initLevel(levelNum);
  updateHUD();
  state = STATE_PLAYING;
  lastTime = performance.now();
  if (frameId) cancelAnimationFrame(frameId);
  frameId = requestAnimationFrame(loop);
}

// ─── Screen Draws ─────────────────────────────────────────────
function drawOceanBg() {
  var grd = ctx.createLinearGradient(0, 0, 0, H);
  grd.addColorStop(0,   '#001219');
  grd.addColorStop(0.4, '#003049');
  grd.addColorStop(1,   '#005f73');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, H);
}

function drawTitleScreen(title, sub) {
  drawOceanBg();
  drawStars();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#7df9ff';
  ctx.font = 'bold 42px Arial';
  ctx.fillText(title, W/2, H/2 - 40);
  ctx.fillStyle = '#94d2bd';
  ctx.font = '20px Arial';
  ctx.fillText(sub, W/2, H/2 + 10);
  ctx.fillStyle = 'rgba(0,245,255,0.55)';
  ctx.font = '16px Arial';
  ctx.fillText('Press SPACE to start', W/2, H/2 + 50);
  if (title !== 'Abyssal Invasion') {
    ctx.fillStyle = '#e9d8a6';
    ctx.font = '18px Arial';
    ctx.fillText('Score: ' + score, W/2, H/2 + 90);
  }
  ctx.textAlign = 'left';
}

// ─── Main Loop ────────────────────────────────────────────────
function loop(ts) {
  var dt = Math.min((ts - lastTime) / 1000, 0.05);
  lastTime = ts;

  if (state === STATE_TITLE) {
    drawTitleScreen('Abyssal Invasion', '🐠  Defend the deep!  🦈');
    frameId = requestAnimationFrame(loop);
    return;
  }
  if (state === STATE_WIN) {
    drawTitleScreen('You Win! 🎉', 'All enemies defeated!');
    frameId = requestAnimationFrame(loop);
    return;
  }
  if (state === STATE_LOSE) {
    drawTitleScreen('Game Over 💀', 'The abyss claims another...');
    frameId = requestAnimationFrame(loop);
    return;
  }

  // Playing
  levelTimer += dt * 1000;

  // Check level complete
  if (enemySpawnQueue.length === 0 && enemies.length === 0 && levelTimer > 1000) {
    if (levelNum < 2) {
      levelNum++;
      updateHUD();
      initLevel(levelNum);
      torpedoes = [];
      eMissiles = [];
    } else {
      state = STATE_WIN;
    }
  }

  // Update
  updateStars(dt);
  updatePlayer(dt);
  updateTorpedoes(dt);
  updateEnemies(dt);
  updateEMissiles(dt);
  updateExplosions(dt);
  if (invincible > 0) invincible -= dt;

  // Draw
  drawOceanBg();
  drawStars();
  drawTorpedoes();
  drawEMissiles();
  drawEnemies();
  drawExplosions();

  // Draw player (blink when invincible)
  if (player.alive && (invincible <= 0 || Math.floor(invincible * 10) % 2 === 0)) {
    drawSubmarine(player.x, player.y, player.w, player.h);
  }

  frameId = requestAnimationFrame(loop);
}

// ─── Start ────────────────────────────────────────────────────
initStars();
state = STATE_TITLE;
frameId = requestAnimationFrame(loop);
