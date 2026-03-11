const p1 = document.getElementById("player1");
const p2 = document.getElementById("player2");
const ball = document.getElementById("ball");
let score1 = 0;
let score2 = 0;
let ballHolder = null;
let ballMoving = false;
let shooter = null;
let p1Pos = { x: 80, y: 190 };
let p2Pos = { x: 760, y: 190 };
let ballPos = { x: 460, y: 240 };
let ballVelocity = { x: 0, y: 0 };
const speed = 4;
const keys = {};

document.addEventListener("keydown", e => {
  keys[e.key] = true;
  if (e.key === "f" && ballHolder === "p1" && !ballMoving) shoot("p1");
  if (e.key === "l" && ballHolder === "p2" && !ballMoving) shoot("p2");
});
document.addEventListener("keyup", e => {
  keys[e.key] = false;
});

function gameLoop() {
  movePlayers();
  updatePositions();
  checkBallPickup();
  updateBall();
  requestAnimationFrame(gameLoop);
}

function movePlayers() {
  if (keys["w"]) p1Pos.y -= speed;
  if (keys["s"]) p1Pos.y += speed;
  if (keys["a"]) p1Pos.x -= speed;
  if (keys["d"]) p1Pos.x += speed;
  if (keys["ArrowUp"]) p2Pos.y -= speed;
  if (keys["ArrowDown"]) p2Pos.y += speed;
  if (keys["ArrowLeft"]) p2Pos.x -= speed;
  if (keys["ArrowRight"]) p2Pos.x += speed;

  p1Pos.x = Math.max(0, Math.min(850, p1Pos.x));
  p1Pos.y = Math.max(0, Math.min(350, p1Pos.y));
  p2Pos.x = Math.max(0, Math.min(850, p2Pos.x));
  p2Pos.y = Math.max(0, Math.min(350, p2Pos.y));
}

function updatePositions() {
  p1.style.left = p1Pos.x + "px";
  p1.style.top  = p1Pos.y + "px";
  p2.style.left = p2Pos.x + "px";
  p2.style.top  = p2Pos.y + "px";

  if (ballHolder === "p1") {
    ballPos.x = p1Pos.x + 60;
    ballPos.y = p1Pos.y + 50;
  }
  if (ballHolder === "p2") {
    ballPos.x = p2Pos.x - 10;
    ballPos.y = p2Pos.y + 50;
  }

  ball.style.left = ballPos.x + "px";
  ball.style.top  = ballPos.y + "px";
}

function checkBallPickup() {
  if (ballMoving) return;
  if (!ballHolder) {
    if (collision(p1, ball)) ballHolder = "p1";
    if (collision(p2, ball)) ballHolder = "p2";
  }
}

function shoot(player) {
  ballHolder = null;
  ballMoving = true;
  shooter = player;

  // Aim toward the opponent's hoop
  const targetX = player === "p1" ? 920 : 20;
  const targetY = 245; // vertical centre of hoop
  const dx = targetX - ballPos.x;
  const dy = targetY - ballPos.y;

  // Time of flight based on horizontal distance
  const tof = Math.abs(dx) / 14;
  // Vertical velocity needed to arc up and land at targetY
  // dy = vy*t + 0.5*g*t^2  =>  vy = (dy - 0.5*g*t^2) / t
  const gravity = 0.35;
  const vy = (dy - 0.5 * gravity * tof * tof) / tof;

  ballVelocity.x = dx / tof;
  ballVelocity.y = vy;
}

function updateBall() {
  if (!ballMoving) return;

  ballPos.x += ballVelocity.x;
  ballPos.y += ballVelocity.y;
  ballVelocity.y += 0.35;

  // Block: opposing player intercepts ball mid-flight
  if (shooter === "p1" && collision(ball, p2)) { resetBall(); return; }
  if (shooter === "p2" && collision(ball, p1)) { resetBall(); return; }

  // Score: P1 shoots into right hoop (x > 880, hoop y 205–290)
  if (shooter === "p1" && ballPos.x > 880 && ballPos.y > 205 && ballPos.y < 290) {
    score1 += 2;
    updateScore();
    resetBall();
    return;
  }

  // Score: P2 shoots into left hoop (x < 60, hoop y 205–290)
  if (shooter === "p2" && ballPos.x < 60 && ballPos.y > 205 && ballPos.y < 290) {
    score2 += 2;
    updateScore();
    resetBall();
    return;
  }

  // Ball fell off bottom
  if (ballPos.y > 520) resetBall();

  ball.style.left = ballPos.x + "px";
  ball.style.top  = ballPos.y + "px";
}

function updateScore() {
  document.getElementById("score1").innerText = score1;
  document.getElementById("score2").innerText = score2;
  if (score1 >= 11) document.getElementById("winner").innerText = "Player 1 Wins!";
  if (score2 >= 11) document.getElementById("winner").innerText = "Player 2 Wins!";
}

function resetBall() {
  ballMoving = false;
  ballHolder = null;
  shooter = null;
  ballPos = { x: 460, y: 240 };
  ballVelocity = { x: 0, y: 0 };
}

function collision(a, b) {
  const r1 = a.getBoundingClientRect();
  const r2 = b.getBoundingClientRect();
  return !(
    r1.top > r2.bottom ||
    r1.right < r2.left ||
    r1.bottom < r2.top ||
    r1.left > r2.right
  );
}

gameLoop();
