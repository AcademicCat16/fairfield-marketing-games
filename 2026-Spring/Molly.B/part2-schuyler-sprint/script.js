const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const molly = new Image();
molly.src = "https://i.imgur.com/pI9QKan.png";

const annieFullscreen = new Image();
annieFullscreen.src = "https://i.imgur.com/4dhI1yb.jpeg";

let gameState = "world";
let activeMiniGame = null;

let frameCount = 0;

const player = { x: 400, y: 300, width: 48, height: 64, speed: 5 };
const keys = {};

const characters = [
  { name: "Uncle Chris", src: "https://i.imgur.com/Dw7WR2e.jpeg", personality: "Let's go for a run!", x: 200, y: 420 },
  { name: "Jessie", src: "https://i.imgur.com/WLnN9iQ.png", personality: "Push-ups first!", x: 100, y: 480 },
  { name: "Rachel", src: "https://i.imgur.com/vKDxiS8.png", personality: "Yo yo yo I'm Rachel!", x: 250, y: 470 },
  { name: "Schuyler", src: "https://i.imgur.com/NWLNc7Y.png", personality: "Im Schuyler! Let's do a race!", x: 180, y: 500 },
  { name: "Annie", src: "https://i.imgur.com/mAir06Q.png", personality: "I'm hungry!", x: 600, y: 350 },
  { name: "Courtney", src: "https://i.imgur.com/bLDa4KY.png", personality: "Dinner's ready!", x: 650, y: 380 },
  { name: "Will", src: "https://i.imgur.com/0wRfeej.png", personality: "I'm a cookie!", x: 620, y: 420 },
  { name: "Caroline", src: "https://i.imgur.com/9uZAiH8.png", personality: "Heyyyy I'm Caroline!", x: 680, y: 400 },
  { name: "Monaco Family", src: "https://i.imgur.com/oY0pEUW.jpeg", personality: "We prefer New Jersey!", x: 400, y: 100 },
];

characters.forEach((c) => {
  c.img = new Image();
  c.img.src = c.src;
  c.vx = (Math.random() - 0.5) * 2;
  c.vy = (Math.random() - 0.5) * 2;
});

/* ================= WORLD ================= */
function drawCabin() {
  ctx.fillStyle = "#8B4513";
  ctx.fillRect(320, 180, 160, 130);

  ctx.fillStyle = "#5A2D0C";
  ctx.beginPath();
  ctx.moveTo(300, 180);
  ctx.lineTo(400, 120);
  ctx.lineTo(500, 180);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#654321";
  ctx.fillRect(385, 230, 40, 80);

  ctx.fillStyle = "#ADD8E6";
  ctx.fillRect(340, 210, 40, 40);
  ctx.fillRect(440, 210, 40, 40);
}

function resetWorld() {
  gameState = "world";
  activeMiniGame = null;
  keys[" "] = false;
  keys["Space"] = false;
  keys["Spacebar"] = false;
}

function startMiniGame(name) {
  activeMiniGame = name;
  gameState = "mini";

  if (name === "Schuyler") {
    obstacles = [];
    runner.y = 450;
    runner.vy = 0;
    runner.jumping = false;
    runnerGameOver = false;
    factIndex = 0;
    frameCount = 0;
  }
}

function updateWorld() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // sky + grass
  ctx.fillStyle = "#a3d9ff";
  ctx.fillRect(0, 0, canvas.width, 200);
  ctx.fillStyle = "#80c080";
  ctx.fillRect(0, 200, canvas.width, 440);

  drawCabin();

  // move player
  if (keys["ArrowUp"]) player.y -= player.speed;
  if (keys["ArrowDown"]) player.y += player.speed;
  if (keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["ArrowRight"]) player.x += player.speed;

  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));

  characters.forEach((c) => {
    c.x += c.vx;
    c.y += c.vy;

    if (c.x < 0 || c.x > canvas.width - 60) c.vx *= -1;
    if (c.y < 200 || c.y > canvas.height - 60) c.vy *= -1;

    ctx.drawImage(c.img, c.x, c.y, 60, 60);

    // distance between player and character
    const dx = (player.x + player.width / 2) - (c.x + 30);
    const dy = (player.y + player.height / 2) - (c.y + 30);
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 70) {
      ctx.fillStyle = "white";
      ctx.fillRect(c.x - 10, c.y - 40, 210, 30);

      ctx.fillStyle = "black";
      ctx.font = "12px sans-serif";
      ctx.fillText(c.personality, c.x - 5, c.y - 20);

      if (keys["Enter"]) {
        if (c.name === "Schuyler") startMiniGame(c.name);
      }
    }
  });

  ctx.drawImage(molly, player.x, player.y, player.width, player.height);

  // top hint
  ctx.fillStyle = "black";
  ctx.font = "16px sans-serif";
  const topMsg = "Go near Schuyler and hit ENTER to play";
  const tw = ctx.measureText(topMsg).width;
  ctx.fillText(topMsg, (canvas.width - tw) / 2, 22);
}

/* ================= SCHUYLER RUNNER ================= */
let runner = { y: 450, vy: 0, jumping: false };
let obstacles = [];
let facts = [
  "Running boosts mood!",
  "5Ks build endurance!",
  "Proper form prevents injury!",
  "Hydration is key!",
  "Cadence matters!",
];
let factIndex = 0;
let runnerGameOver = false;

function restartSchuyler() {
  obstacles = [];
  runner.y = 450;
  runner.vy = 0;
  runner.jumping = false;
  runnerGameOver = false;
  factIndex = 0;
  keys[" "] = false;
  keys["Space"] = false;
  keys["Spacebar"] = false;
}

function roundRect(ctx, x, y, w, h, r, fill, stroke) {
  if (typeof r === "number") {
    r = { tl: r, tr: r, br: r, bl: r };
  } else {
    const defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
    for (const side in defaultRadius) r[side] = r[side] || defaultRadius[side];
  }

  ctx.beginPath();
  ctx.moveTo(x + r.tl, y);
  ctx.lineTo(x + w - r.tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r.tr);
  ctx.lineTo(x + w, y + h - r.br);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
  ctx.lineTo(x + r.bl, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r.bl);
  ctx.lineTo(x, y + r.tl);
  ctx.quadraticCurveTo(x, y, x + r.tl, y);
  ctx.closePath();

  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

function updateRunner() {
  const groundY = 480;
  const baseSpeed = 6;
  const speedIncrease = Math.min(5, frameCount * 0.002);
  const obstacleSpeed = baseSpeed + speedIncrease;

  // sky
  ctx.fillStyle = "#87CEEB";
  ctx.fillRect(0, 0, canvas.width, 300);

  // mountains
  function mountain(x, width, height, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, groundY);
    ctx.lineTo(x + width / 2, groundY - height);
    ctx.lineTo(x + width, groundY);
    ctx.closePath();
    ctx.fill();
  }
  mountain(-50, 300, 180, "#1f4d2e");
  mountain(180, 350, 220, "#1b5e20");
  mountain(480, 320, 190, "#145a32");
  mountain(720, 260, 160, "#0e3d23");

  // label
  ctx.fillStyle = "white";
  ctx.font = "42px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("CAL POLY", canvas.width / 2, 120);
  ctx.textAlign = "left";

  // ground
  ctx.fillStyle = "#8B3A2F";
  ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);

  // obstacle spawning
  const minGap = 220;
  if (!runnerGameOver) {
    if (obstacles.length === 0) {
      obstacles.push({ x: canvas.width + 100 });
    } else {
      const last = obstacles[obstacles.length - 1];
      if (last.x < canvas.width - minGap) {
        if (Math.random() < 0.025) obstacles.push({ x: canvas.width + 60 });
      }
    }
  }

  // obstacles + collision
  obstacles.forEach((o) => {
    if (!runnerGameOver) o.x -= obstacleSpeed;

    const hurdleY = groundY - 30;
    ctx.fillStyle = "#222";
    ctx.fillRect(o.x, hurdleY, 6, 30);
    ctx.fillRect(o.x + 40, hurdleY, 6, 30);
    ctx.fillStyle = "white";
    ctx.fillRect(o.x, hurdleY - 8, 46, 6);

    // hitbox (runner at x=100, width about 40)
    if (!runnerGameOver && 100 + 40 > o.x && 100 < o.x + 46 && runner.y + 40 > hurdleY) {
      runnerGameOver = true;
    }
  });

  if (!runnerGameOver) {
    obstacles = obstacles.filter((o) => o.x > -100);
  }

  // jump physics
  if (!runnerGameOver) {
    if ((keys[" "] || keys["Space"] || keys["Spacebar"]) && !runner.jumping) {
      runner.vy = -12;
      runner.jumping = true;
    }

    runner.vy += 0.6;
    runner.y += runner.vy;

    if (runner.y >= 450) {
      runner.y = 450;
      runner.jumping = false;
    }
  }

  // draw runner (Molly)
  ctx.drawImage(molly, 100, runner.y, 40, 40);

  // draw Schuyler
  const schuylerImg = characters.find((c) => c.name === "Schuyler").img;
  const bounce = runnerGameOver ? 0 : Math.sin(frameCount * 0.3) * 4;
  const schuylerY = runner.y + bounce;
  ctx.drawImage(schuylerImg, 50, schuylerY, 40, 40);

  // speech bubble
  const shout = facts[factIndex];
  ctx.font = "14px sans-serif";
  const padding = 8;
  const textWidth = ctx.measureText(shout).width;
  const bubbleWidth = textWidth + padding * 2;
  const bubbleHeight = 28;
  const bubbleX = 110;
  const bubbleY = schuylerY - 40;

  ctx.fillStyle = "white";
  ctx.fillRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight);
  ctx.strokeStyle = "black";
  ctx.strokeRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight);

  ctx.fillStyle = "black";
  ctx.fillText(shout, bubbleX + padding, bubbleY + 18);

  if (!runnerGameOver && frameCount % 180 === 0) {
    factIndex = (factIndex + 1) % facts.length;
  }

  if (runnerGameOver) {
    ctx.fillStyle = "yellow";
    ctx.font = "20px sans-serif";
    ctx.fillText("You tripped! Press SPACE to play again or R to return home", 70, 260);
  }
}

/* ================= MINI GAME & LOOP ================= */
function updateMiniGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  frameCount++;

  // top hint (optional — remove if annoying during minigame)
  ctx.fillStyle = "black";
  ctx.font = "16px sans-serif";
  const topMsg = "Go near Schuyler and hit ENTER to play";
  const tw = ctx.measureText(topMsg).width;
  ctx.fillText(topMsg, (canvas.width - tw) / 2, 22);

  if (activeMiniGame === "Schuyler") updateRunner();
}

function gameLoop() {
  if (gameState === "world") updateWorld();
  if (gameState === "mini") updateMiniGame();
  requestAnimationFrame(gameLoop);
}

/* ================= INPUT HANDLING ================= */
window.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();

  keys[e.key] = true;
  keys[e.code] = true;

  // Return home from mini game on R
  if (key === "r") {
    resetWorld();
  }

  // Schuyler restart (when game over)
  if (gameState === "mini") {
    if (activeMiniGame === "Schuyler" && runnerGameOver && (e.code === "Space" || key === " ")) {
      restartSchuyler();
    }
  }
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
  keys[e.code] = false;
});

gameLoop();
