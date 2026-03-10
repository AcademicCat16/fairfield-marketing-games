document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  const tileSize = 20;
  const rows = 20;
  const cols = 20;

  const MOVE_INTERVAL = 120; // ⏱️ higher = slower game
  let lastMoveTime = 0;

  const originalMap = [
    "####################",
    "#........##........#",
    "#.####.#.##.#.####..#",
    "#........##........#",
    "#.####.######.####.#",
    "#..................#",
    "######.##.##.##.####",
    "#........##........#",
    "#.####.#.##.#.####.#",
    "#......#....#.....#",
    "######.######.######",
    "#..................#",
    "#.####.##.##.####..#",
    "#........##........#",
    "#.####.#.##.#.####.#",
    "#........##........#",
    "#.####.######.####.#",
    "#..................#",
    "#........##........#",
    "####################"
  ];

  let map, pacman, ghosts, gameStarted;

  function resetGame() {
    map = [...originalMap];
    pacman = { x: 1, y: 1, dx: 0, dy: 0 };

    ghosts = [
      { x: 10, y: 9, dx: 1, dy: 0, color: "red" },
      { x: 9, y: 9, dx: -1, dy: 0, color: "pink" },
      { x: 10, y: 10, dx: 0, dy: 1, color: "cyan" },
      { x: 9, y: 10, dx: 0, dy: -1, color: "orange" }
    ];

    gameStarted = false;
    lastMoveTime = 0;
  }

  resetGame();

  function drawMap() {
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (map[y][x] === "#") {
          ctx.fillStyle = "blue";
          ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        } else if (map[y][x] === ".") {
          ctx.fillStyle = "white";
          ctx.beginPath();
          ctx.arc(
            x * tileSize + tileSize / 2,
            y * tileSize + tileSize / 2,
            3,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }
    }
  }

  function drawPacman() {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(
      pacman.x * tileSize + tileSize / 2,
      pacman.y * tileSize + tileSize / 2,
      tileSize / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  function drawGhost(g) {
    ctx.fillStyle = g.color;
    ctx.beginPath();
    ctx.arc(
      g.x * tileSize + tileSize / 2,
      g.y * tileSize + tileSize / 2,
      tileSize / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  function movePacman() {
    const nx = pacman.x + pacman.dx;
    const ny = pacman.y + pacman.dy;

    if (map[ny][nx] !== "#") {
      pacman.x = nx;
      pacman.y = ny;

      if (map[ny][nx] === ".") {
        map[ny] = map[ny].substring(0, nx) + " " + map[ny].substring(nx + 1);
      }
    }
  }

  function moveGhost(g) {
    const dirs = [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 }
    ];

    const nx = g.x + g.dx;
    const ny = g.y + g.dy;

    if (map[ny][nx] === "#") {
      const valid = dirs.filter(d => map[g.y + d.dy][g.x + d.dx] !== "#");
      const choice = valid[Math.floor(Math.random() * valid.length)];
      g.dx = choice.dx;
      g.dy = choice.dy;
    }

    g.x += g.dx;
    g.y += g.dy;
  }

  function checkCollision() {
    if (!gameStarted) return;

    ghosts.forEach(g => {
      if (g.x === pacman.x && g.y === pacman.y) {
        alert("👻 Game Over");
        resetGame();
      }
    });
  }

  function gameLoop(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawMap();
    drawPacman();
    ghosts.forEach(drawGhost);

    if (gameStarted && timestamp - lastMoveTime > MOVE_INTERVAL) {
      movePacman();
      ghosts.forEach(moveGhost);
      lastMoveTime = timestamp;
    }

    checkCollision();
    requestAnimationFrame(gameLoop);
  }

  document.addEventListener("keydown", e => {
    if (
      e.key === "ArrowUp" ||
      e.key === "ArrowDown" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight"
    ) {
      gameStarted = true;
    }

    if (e.key === "ArrowUp") pacman.dx = 0, pacman.dy = -1;
    if (e.key === "ArrowDown") pacman.dx = 0, pacman.dy = 1;
    if (e.key === "ArrowLeft") pacman.dx = -1, pacman.dy = 0;
    if (e.key === "ArrowRight") pacman.dx = 1, pacman.dy = 0;
  });

  requestAnimationFrame(gameLoop);
});

