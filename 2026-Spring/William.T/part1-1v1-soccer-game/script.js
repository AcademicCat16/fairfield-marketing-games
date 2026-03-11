const canvas = document.getElementById('gameCanvas');

const ctx = canvas.getContext('2d');


// Game Dimensions (increased for better visuals)

canvas.width = 1024;

canvas.height = 512;


// Physics Constants

const gravity = 0.6;

const friction = 0.985;

const groundY = 410; // The top of the green area


// Load Player Images from the links provided

const imgP1 = new Image();

imgP1.src = "https://raw.githubusercontent.com/willtateossian-cloud/game-assets/refs/heads/main/Unknown%20messi.jpeg";

const imgP2 = new Image();

imgP2.src = "https://raw.githubusercontent.com/willtateossian-cloud/game-assets/refs/heads/main/Unknown.jpeg";


// Game Objects

const ball = {

  x: canvas.width / 2, y: 150, dx: 0, dy: 0, 

  radius: 20, color: '#fff', 

  bounciness: -0.7 // Energy absorption when hitting ground

};


const p1 = {

  x: 150, y: 300, dx: 0, dy: 0, 

  size: 80, // Increased size for "Big Head" feel

  img: imgP1, score: 0, jumping: false

};


const p2 = {

  x: canvas.width - 230, y: 300, dx: 0, dy: 0, 

  size: 80, 

  img: imgP2, score: 0, jumping: false

};


// Controls tracking

const keys = {};

window.addEventListener('keydown', e => keys[e.code] = true);

window.addEventListener('keyup', e => keys[e.code] = false);


// Resets ball after a goal

function resetBall() {

  ball.x = canvas.width / 2;

  ball.y = 150;

  ball.dx = (Math.random() - 0.5) * 8; // Slight randomized kickoff direction

  ball.dy = 0;

}


// Draw Realistic Goals and Nets

function drawGoals() {

  const goalHeight = 160;

  const goalDepth = 40;

  const topBarY = groundY - goalHeight;


  // Left Goal Structure

  ctx.strokeStyle = "white";

  ctx.lineWidth = 4;

  ctx.strokeRect(0, topBarY, goalDepth, goalHeight); // Left Post


  // Draw realistic netting for Left Goal

  ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";

  ctx.lineWidth = 1;

  for (let i = 10; i < goalDepth; i += 10) {

    ctx.beginPath();

    ctx.moveTo(i, topBarY);

    ctx.lineTo(i, groundY);

    ctx.stroke();

  }

  for (let i = topBarY; i < groundY; i += 10) {

    ctx.beginPath();

    ctx.moveTo(0, i);

    ctx.lineTo(goalDepth, i);

    ctx.stroke();

  }


  // Right Goal Structure

  ctx.strokeStyle = "white";

  ctx.lineWidth = 4;

  ctx.strokeRect(canvas.width - goalDepth, topBarY, goalDepth, goalHeight); // Right Post


  // Draw realistic netting for Right Goal

  ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";

  ctx.lineWidth = 1;

  for (let i = canvas.width - goalDepth + 10; i < canvas.width; i += 10) {

    ctx.beginPath();

    ctx.moveTo(i, topBarY);

    ctx.lineTo(i, groundY);

    ctx.stroke();

  }

  for (let i = topBarY; i < groundY; i += 10) {

    ctx.beginPath();

    ctx.moveTo(canvas.width - goalDepth, i);

    ctx.lineTo(canvas.width, i);

    ctx.stroke();

  }

}


// Draw realistic city skyline silhouette in the back

function drawSkyline() {

  ctx.fillStyle = "#1c2833"; // Dark blue-gray silhouette

  ctx.beginPath();

  ctx.moveTo(0, groundY);

  

  // Create stylized varying height city blocks

  let blocks = [60, 100, 150, 70, 90, 160, 120, 100, 130, 90, 150, 80, 110, 140];

  let blockWidth = canvas.width / blocks.length;

  

  for (let i = 0; i < blocks.length; i++) {

    ctx.lineTo(i * blockWidth, groundY - blocks[i]);

    ctx.lineTo((i + 1) * blockWidth, groundY - blocks[i]);

  }

  ctx.lineTo(canvas.width, groundY);

  ctx.closePath();

  ctx.fill();

}


function update() {

  // Player 1 Controls (WASD)

  p1.dx = 0;

  if (keys['KeyA']) p1.dx = -7;

  if (keys['KeyD']) p1.dx = 7;

  if (keys['KeyW'] && !p1.jumping) { p1.dy = -15; p1.jumping = true; }


  // Player 2 Controls (Arrows)

  p2.dx = 0;

  if (keys['ArrowLeft']) p2.dx = -7;

  if (keys['ArrowRight']) p2.dx = 7;

  if (keys['ArrowUp'] && !p2.jumping) { p2.dy = -15; p2.jumping = true; }


  // Physics for Players

  [p1, p2].forEach(p => {

    p.x += p.dx;

    p.y += p.dy;

    if (p.y + p.size < groundY) {

      p.dy += gravity;

    } else {

      p.y = groundY - p.size;

      p.dy = 0;

      p.jumping = false;

    }

    // Arena Boundaries for players

    p.x = Math.max(0, Math.min(canvas.width - p.size, p.x));

  });


  // Ball Physics

  ball.dy += gravity * 0.7; // Lower gravity impact on ball for "floatierness"

  ball.x += ball.dx;

  ball.y += ball.dy;

  ball.dx *= friction;


  // Ball Boundary/Wall Collisions

  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) ball.dx *= -0.8;

  if (ball.y + ball.radius > groundY) {

    ball.y = groundY - ball.radius;

    ball.dy *= ball.bounciness; // Apply ground impact energy loss

  }

  if (ball.y - ball.radius < 0) ball.dy *= -0.7; // Ceiling limit


  // Realistic Soccer Goal Detection (requires ball to be below the top bar)

  const topBarY = groundY - 160;

  if (ball.y > topBarY) {

    // Check if the ball is fully inside the left goal net area (depth 40)

    if (ball.x < 35 && ball.x - ball.radius < 40) { p2.score++; resetBall(); }

    // Check if the ball is fully inside the right goal net area

    if (ball.x > canvas.width - 35 && ball.x + ball.radius > canvas.width - 40) { p1.score++; resetBall(); }

  }


  // Standard Soccer Collision (Simple Circle-to-Square collision approximation)

  [p1, p2].forEach(p => {

    let pCenterX = p.x + p.size/2;

    let pCenterY = p.y + p.size/2;

    let dx = ball.x - pCenterX;

    let dy = ball.y - pCenterY;

    

    // Head Soccer requires the collision point to be higher, so we subtract size slightly

    let dist = Math.hypot(dx, dy);

    if (dist < p.size/2.1 + ball.radius) {

      // Calculate kick angle

      let angle = Math.atan2(dy, dx);

      // Modern arcade kick velocity boost

      ball.dx = Math.cos(angle) * 16;

      ball.dy = Math.sin(angle) * 16 - 3; // Add "kick lift" to the shot

    }

  });


  // Update Score UI

  document.getElementById('p1-score').innerText = p1.score;

  document.getElementById('p2-score').innerText = p2.score;

}


function drawBall() {

  // Draw the actual ball (modern aesthetic white ball with basic pattern)

  ctx.save();

  ctx.translate(ball.x, ball.y);

  

  // Base White Ball

  ctx.beginPath();

  ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);

  ctx.fillStyle = "#fff";

  ctx.fill();

  ctx.closePath();


  // Basic Soccer Pattern (Pentagons)

  ctx.fillStyle = "#222"; 

  ctx.beginPath();

  ctx.arc(0, 0, 8, 0, Math.PI * 2); ctx.fill(); // Center

  ctx.beginPath(); ctx.arc(-14, 0, 5, 0, Math.PI * 2); ctx.fill(); // Left

  ctx.beginPath(); ctx.arc(14, 0, 5, 0, Math.PI * 2); ctx.fill(); // Right

  ctx.beginPath(); ctx.arc(0, -14, 5, 0, Math.PI * 2); ctx.fill(); // Up

  ctx.beginPath(); ctx.arc(0, 14, 5, 0, Math.PI * 2); ctx.fill(); // Down

  ctx.restore();

}


function draw() {

  // Clear the canvas, allowing the CSS gradient background to show

  ctx.clearRect(0, 0, canvas.width, canvas.height);


  // 1. Draw Skyline Backdrop (behind goals/players)

  drawSkyline();


  // 2. Draw Realistic Soccer Goals

  drawGoals();


  // 3. Draw Players (The Head Soccer images)

  ctx.drawImage(p1.img, p1.x, p1.y, p1.size, p1.size);

  ctx.drawImage(p2.img, p2.x, p2.y, p2.size, p2.size);


  // 4. Draw Ball

  drawBall();


  // 5. Game Logic Update

  update();

  

  // 6. Request Next Frame (Animation loop)

  requestAnimationFrame(draw);

}


// Start the game loop when images finish loading

Promise.all([

  new Promise(r => imgP1.onload = r),

  new Promise(r => imgP2.onload = r)

]).then(draw);


