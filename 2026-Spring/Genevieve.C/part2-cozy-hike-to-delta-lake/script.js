const startBtn      = document.getElementById("startBtn");
const restartBtn    = document.getElementById("restartBtn");
const instructions  = document.getElementById("instructions");
const game          = document.getElementById("game");
const puppy         = document.getElementById("puppy");
const livesDisplay  = document.getElementById("lives");
const timerDisplay  = document.getElementById("timer");
const message       = document.getElementById("message");

const GROUND_Y  = 90;
const JUMP_PEAK = 240;  // very high
const RISE_STEP = 18;   // fast up
const FALL_STEP = 5;    // slow down — long airtime
const HANG_MS   = 150;  // pause at peak

let lives, timeLeft, jumping, jumpY;
let gameInterval, rockInterval;
let gameActive  = false;
let jumpTimeout = null;

// ── Add a progress bar to HUD ──
const hud = document.getElementById("hud");
const progressWrap = document.createElement("div");
progressWrap.style.cssText = "width:800px;margin:4px auto;";
progressWrap.innerHTML = `
  <div style="background:#ccc;border-radius:8px;height:12px;width:100%;overflow:hidden;">
    <div id="progressBar" style="height:100%;width:0%;background:linear-gradient(to right,#5a8f5a,#87ceeb);transition:width 1s linear;border-radius:8px;"></div>
  </div>
  <div style="font-size:11px;color:#555;margin-top:2px;">🐾 Trail to Delta Lake</div>
`;
hud.insertAdjacentElement("afterend", progressWrap);
const progressBar = document.getElementById("progressBar");

// ── Start / Restart ──
startBtn.onclick = () => {
  instructions.style.display = "none";
  startGame();
};

restartBtn.onclick = () => {
  restartBtn.style.display = "none";
  document.querySelectorAll(".rock").forEach(r => r.remove());
  startGame();
};

function startGame() {
  lives      = 3;
  timeLeft   = 45;
  jumping    = false;
  jumpY      = GROUND_Y;
  gameActive = true;

  puppy.style.bottom       = GROUND_Y + "px";
  livesDisplay.textContent = "❤️❤️❤️";
  timerDisplay.textContent = timeLeft;
  progressBar.style.width  = "0%";
  message.textContent      = "";

  gameInterval = setInterval(updateGame, 1000);
  rockInterval = setInterval(spawnRock, 2200);
}

function updateGame() {
  timeLeft--;
  timerDisplay.textContent = timeLeft;
  // progress bar fills as time counts down
  const pct = Math.round(((45 - timeLeft) / 45) * 100);
  progressBar.style.width = pct + "%";
  if (timeLeft <= 0) endGame(true);
}

// ── Jump — G or Space ──
document.addEventListener("keydown", e => {
  const k = e.key.toLowerCase();
  if ((k === "g" || k === " ") && !jumping && gameActive) {
    e.preventDefault();
    jumping = true;
    doJump();
  }
});

function doJump() {
  // Rise phase
  const up = setInterval(() => {
    if (jumpY < JUMP_PEAK) {
      jumpY = Math.min(jumpY + RISE_STEP, JUMP_PEAK);
      puppy.style.bottom = jumpY + "px";
    } else {
      clearInterval(up);
      // Hang at peak
      jumpTimeout = setTimeout(() => {
        // Fall phase
        const down = setInterval(() => {
          if (jumpY > GROUND_Y) {
            jumpY = Math.max(jumpY - FALL_STEP, GROUND_Y);
            puppy.style.bottom = jumpY + "px";
          } else {
            jumpY   = GROUND_Y;
            jumping = false;
            puppy.style.bottom = GROUND_Y + "px";
            clearInterval(down);
          }
        }, 20);
      }, HANG_MS);
    }
  }, 16);
}

// ── Rocks ──
function spawnRock() {
  if (!gameActive) return;

  const rock      = document.createElement("div");
  rock.className  = "rock";
  const rw        = 25 + Math.random() * 15;  // slightly smaller rocks
  const rh        = 18 + Math.random() * 10;
  rock.style.width  = rw + "px";
  rock.style.height = rh + "px";
  rock.style.left   = "810px";
  game.appendChild(rock);

  let x       = 810;
  let hit     = false;

  const move = setInterval(() => {
    if (!gameActive) { rock.remove(); clearInterval(move); return; }

    x -= 5;
    rock.style.left = x + "px";

    if (!hit) {
      // Tight collision zone: rock centre is between puppy left (80) and right (140)
      const rockCentreX = x + rw / 2;
      const inDangerX   = rockCentreX > 75 && rockCentreX < 145;

      // Puppy is safe if jumpY is more than 55px off ground
      const safeHeight  = jumpY > GROUND_Y + 55;

      if (inDangerX && !safeHeight) {
        hit = true;
        rock.style.background = "radial-gradient(#f00,#900)"; // flash red
        setTimeout(() => { rock.remove(); clearInterval(move); }, 200);
        loseLife();
        return;
      }
    }

    if (x < -60) { rock.remove(); clearInterval(move); }
  }, 30);
}

function loseLife() {
  lives = Math.max(0, lives - 1);
  const hearts = "❤️".repeat(lives) + "🖤".repeat(3 - lives);
  livesDisplay.textContent = hearts;
  // flash puppy red
  puppy.style.filter = "hue-rotate(180deg)";
  setTimeout(() => { puppy.style.filter = ""; }, 400);
  if (lives <= 0) endGame(false);
}

function endGame(win) {
  gameActive = false;
  clearInterval(gameInterval);
  clearInterval(rockInterval);
  progressBar.style.width = win ? "100%" : progressBar.style.width;
  message.textContent = win
    ? "🏔️ Your puppy reached Delta Lake! 🐾🎉"
    : "💔 Too many rocks — try again!";
  restartBtn.style.display = "inline-block";
}
