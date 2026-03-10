document.addEventListener("DOMContentLoaded", function () {

  const bosses = [
    { name: "Frost Wolf",      img: "https://i.imgur.com/DmdtKgj.png" },
    { name: "Goblin Chief",    img: "https://i.imgur.com/oCWILea.png" },
    { name: "Swamp Serpent",   img: "https://i.imgur.com/e641AeX.png" },
    { name: "Flame Golem",     img: "https://i.imgur.com/sWTWges.png" },
    { name: "Dark Sorceress",  img: "https://i.imgur.com/GHXBEF9.png" }
  ];

  let level      = 0;
  let playerHP   = 100;
  let bossHP     = 100;
  let defending  = false;
  let healsLeft  = 3;

  const menu       = document.getElementById("menu");
  const gameEl     = document.getElementById("game");
  const startBtn   = document.getElementById("startBtn");
  const menuBtn    = document.getElementById("menuBtn");
  const bossImg    = document.getElementById("boss");
  const bossNameEl = document.getElementById("bossName");
  const playerBar  = document.getElementById("playerHealth");
  const bossBar    = document.getElementById("bossHealth");
  const playerHPText = document.getElementById("playerHPText");
  const bossHPText   = document.getElementById("bossHPText");

  // ── Menu ──
  startBtn.onclick = startGame;
  menuBtn.onclick  = returnToMenu;

  function startGame() {
    menu.style.display   = "none";
    gameEl.style.display = "block";
    resetGame();
  }

  function returnToMenu() {
    menu.style.display   = "flex";
    gameEl.style.display = "none";
  }

  // ── Game ──
  function resetGame() {
    level     = 0;
    playerHP  = 100;
    healsLeft = 3;
    loadBoss();
    updateBars();
  }

  function loadBoss() {
    bossImg.src       = bosses[level].img;
    bossNameEl.innerText = bosses[level].name;
    bossHP    = 100;
    healsLeft = 3;
    updateBars();
  }

  function updateBars() {
    if (playerHP < 0) playerHP = 0;
    if (bossHP   < 0) bossHP   = 0;
    playerBar.style.width  = playerHP + "%";
    bossBar.style.width    = bossHP   + "%";
    playerHPText.innerText = playerHP + " / 100";
    bossHPText.innerText   = bossHP   + " / 100";
  }

  function enemyTurn() {
    let damage = Math.floor(Math.random() * 8) + 3;
    if (defending) { damage = Math.floor(damage / 2); defending = false; }
    playerHP -= damage;
    if (playerHP <= 0) {
      updateBars();
      alert("You were defeated! 💀");
      returnToMenu();
      return;
    }
    updateBars();
  }

  function checkBoss() {
    if (bossHP <= 0) {
      level++;
      if (level >= bosses.length) {
        alert("⚔️ You defeated all bosses! You win!");
        returnToMenu();
        return true;
      }
      loadBoss();
      return true;
    }
    return false;
  }

  function attack() {
    bossHP -= Math.floor(Math.random() * 15) + 10;
    updateBars();
    if (!checkBoss()) enemyTurn();
  }

  function heavyAttack() {
    if (Math.random() < 0.75) {
      bossHP -= Math.floor(Math.random() * 25) + 15;
      updateBars();
    } else {
      alert("💨 Heavy attack missed!");
    }
    if (!checkBoss()) enemyTurn();
  }

  function defend() {
    defending = true;
    enemyTurn();
  }

  function heal() {
    if (healsLeft > 0) {
      playerHP = Math.min(playerHP + 30, 100);
      healsLeft--;
      updateBars();
    } else {
      alert("No heals left!");
    }
    enemyTurn();
  }

  document.getElementById("attackBtn").onclick = attack;
  document.getElementById("heavyBtn").onclick  = heavyAttack;
  document.getElementById("defendBtn").onclick = defend;
  document.getElementById("healBtn").onclick   = heal;

  // ── Snow ──
  const canvas = document.getElementById("snow");
  const ctx    = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const snowflakes = [];
  for (let i = 0; i < 250; i++) {
    snowflakes.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 3 + 1,
      speed: Math.random() * 1 + 0.5
    });
  }

  function drawSnow() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    snowflakes.forEach(flake => {
      ctx.beginPath();
      ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
      ctx.fill();
      flake.y += flake.speed;
      if (flake.y > canvas.height) { flake.y = -5; flake.x = Math.random() * canvas.width; }
    });
    requestAnimationFrame(drawSnow);
  }
  drawSnow();
});
