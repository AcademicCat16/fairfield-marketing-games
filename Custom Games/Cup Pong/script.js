(() => {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  const statusEl = document.getElementById("status");
  const resetBtn = document.getElementById("resetBtn");
  const randomBtn = document.getElementById("randomBtn");

  // ----- Resize for full-screen + crispness -----
  const DPR = () => Math.max(1, Math.min(2, window.devicePixelRatio || 1));

  function resize() {
    const dpr = DPR();
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // draw in CSS pixels
    buildLevel();
    resetBall();
  }
  window.addEventListener("resize", resize);

  // ----- World / Level -----
  const world = {
    gravity: 1400,         // px/s^2
    airDrag: 0.999,        // per frame-ish (we apply with dt)
    stopSpeed: 18,         // below this -> consider asleep
    maxShots: 1
  };

  let table = null;
  let cup = null;

  function buildLevel() {
    const W = window.innerWidth;
    const H = window.innerHeight;

    const margin = Math.max(40, W * 0.06);
    const tableY = H * 0.72;
    const tableH = Math.max(18, H * 0.045);

    table = {
      x: margin,
      y: tableY,
      w: W - margin * 2,
      h: tableH,
      bounce: 0.62,        // restitution on table
      friction: 0.90       // tangential friction on bounce
    };

    // Cup sits near far right edge of table
    placeCup(W * 0.82);
  }

  function placeCup(xCenter) {
    const W = window.innerWidth;
    xCenter = Math.max(table.x + table.w * 0.55, Math.min(table.x + table.w - 70, xCenter));

    cup = {
      // Cup opening sits on table top
      x: xCenter,
      y: table.y - 2,
      r: Math.max(18, Math.min(28, window.innerWidth * 0.025)),
      rim: 6,              // rim thickness for drawing
      depth: 36,           // visual depth (not physics)
      scored: false
    };
  }

  // ----- Ball -----
  const ball = {
    x: 0, y: 0,
    vx: 0, vy: 0,
    r: 10,
    inPlay: false,
    shotsTaken: 0,
    bounceCount: 0
  };

  function resetBall() {
    const W = window.innerWidth;
    const H = window.innerHeight;

    ball.r = Math.max(9, Math.min(12, W * 0.012));
    ball.x = table.x + table.w * 0.12;
    ball.y = table.y - 120;
    ball.vx = 0;
    ball.vy = 0;
    ball.inPlay = false;
    ball.shotsTaken = 0;
    ball.bounceCount = 0;

    cup.scored = false;
    setStatus("Drag from the ball to aim. Release to shoot.");
  }

  // ----- Input (drag to aim) -----
  let dragging = false;
  let dragStart = { x: 0, y: 0 };
  let dragNow = { x: 0, y: 0 };

  function pointerPos(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left);
    const y = (e.clientY - rect.top);
    return { x, y };
  }

  function isOnBall(p) {
    const dx = p.x - ball.x;
    const dy = p.y - ball.y;
    return Math.hypot(dx, dy) <= ball.r + 10;
  }

  canvas.addEventListener("pointerdown", (e) => {
    const p = pointerPos(e);

    // Only allow aiming before shot
    if (ball.inPlay || cup.scored) return;

    if (isOnBall(p)) {
      dragging = true;
      dragStart = { x: ball.x, y: ball.y };
      dragNow = { ...p };
      canvas.setPointerCapture(e.pointerId);
    }
  });

  canvas.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    dragNow = pointerPos(e);
  });

  canvas.addEventListener("pointerup", (e) => {
    if (!dragging) return;
    dragging = false;

    // Velocity is opposite the drag vector (pull back to shoot forward)
    const dx = dragStart.x - dragNow.x;
    const dy = dragStart.y - dragNow.y;

    const power = Math.min(520, Math.hypot(dx, dy));
    if (power < 8) return;

    const maxSpeed = 1050; // clamp
    const speed = Math.min(maxSpeed, power * 3.1);

    const ang = Math.atan2(dy, dx); // direction of pull
    // shoot in same direction as pull (since we used start - now)
    ball.vx = Math.cos(ang) * speed;
    ball.vy = Math.sin(ang) * speed;

    ball.inPlay = true;
    ball.shotsTaken += 1;
    setStatus("Shot taken! Bounce it into the cup.");
  });

  // ----- Buttons -----
  resetBtn.addEventListener("click", () => resetBall());
  randomBtn.addEventListener("click", () => {
    const x = table.x + table.w * (0.65 + Math.random() * 0.3);
    placeCup(x);
    if (!ball.inPlay) setStatus("Cup moved. Drag from the ball to aim.");
  });

  // ----- Physics -----
  let lastT = performance.now();

  function step(t) {
    const dt = Math.min(0.02, (t - lastT) / 1000);
    lastT = t;

    update(dt);
    draw();

    requestAnimationFrame(step);
  }

  function update(dt) {
    if (!ball.inPlay || cup.scored) return;

    // Integrate
    ball.vy += world.gravity * dt;
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    // Air drag (mild)
    const drag = Math.pow(world.airDrag, dt * 60);
    ball.vx *= drag;
    ball.vy *= drag;

    // Collide with table top (simple)
    const tableTop = table.y;
    const withinX = (ball.x > table.x + ball.r && ball.x < table.x + table.w - ball.r);
    const hitFromAbove = (ball.y + ball.r >= tableTop && ball.vy > 0);

    if (withinX && hitFromAbove) {
      ball.y = tableTop - ball.r;
      ball.vy = -ball.vy * table.bounce;
      ball.vx = ball.vx * table.friction;
      ball.bounceCount += 1;
    }

    // Walls (keep on screen)
    const W = window.innerWidth;
    const H = window.innerHeight;

    if (ball.x - ball.r < 0) { ball.x = ball.r; ball.vx = -ball.vx * 0.65; }
    if (ball.x + ball.r > W) { ball.x = W - ball.r; ball.vx = -ball.vx * 0.65; }

    // Floor fail (below table area)
    if (ball.y - ball.r > H + 200) {
      ball.inPlay = false;
      setStatus("Missed. Click Reset to try again.");
    }

    // Cup scoring check:
    // - center must pass into opening area near cup top
    // - must be going downward
    // - must have at least 1 bounce on the table (so it's actually “pong-y”)
    const dxCup = ball.x - cup.x;
    const openingY = cup.y - cup.r * 0.15; // slightly above rim
    const inX = Math.abs(dxCup) < (cup.r - 3);
    const inY = ball.y > openingY - cup.r && ball.y < openingY + cup.r;
    const descending = ball.vy > 0;

    if (!cup.scored && ball.bounceCount >= 1 && inX && inY && descending) {
      // "Capture" the ball into the cup
      cup.scored = true;
      ball.inPlay = false;

      // snap ball to cup center visually
      ball.x = cup.x;
      ball.y = cup.y + cup.depth * 0.25;

      setStatus("✅ SCORED! Nice shot. Hit Reset to play again.");
    }

    // Stop if very slow on the table area
    const speed = Math.hypot(ball.vx, ball.vy);
    if (speed < world.stopSpeed && ball.y + ball.r >= tableTop - 2) {
      ball.inPlay = false;
      setStatus("Stopped. Click Reset to try again.");
    }
  }

  // ----- Drawing -----
  function draw() {
    const W = window.innerWidth;
    const H = window.innerHeight;

    ctx.clearRect(0, 0, W, H);

    // Background hint lines
    ctx.globalAlpha = 0.10;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const y = (H * 0.18) + i * 60;
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
    }
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Table
    // top
    ctx.fillStyle = "rgba(255,255,255,0.10)";
    ctx.fillRect(table.x, table.y, table.w, table.h);
    // edge line
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 2;
    ctx.strokeRect(table.x, table.y, table.w, table.h);

    // Cup (draw as a ring + depth)
    drawCup();

    // Aim line
    if (dragging) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(122,162,255,0.9)";
      ctx.beginPath();
      ctx.moveTo(dragStart.x, dragStart.y);
      ctx.lineTo(dragNow.x, dragNow.y);
      ctx.stroke();

      // power indicator
      const p = Math.min(520, Math.hypot(dragStart.x - dragNow.x, dragStart.y - dragNow.y));
      ctx.fillStyle = "rgba(231,236,255,0.9)";
      ctx.font = "600 12px system-ui";
      ctx.fillText(`Power: ${Math.round(p)}`, dragStart.x + 14, dragStart.y - 14);
    }

    // Ball
    drawBall();

    // Target hint
    ctx.fillStyle = "rgba(231,236,255,0.65)";
    ctx.font = "600 12px system-ui";
    ctx.fillText("Cup", cup.x - 12, cup.y - cup.r - 12);
  }

  function drawBall() {
    // shadow
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.ellipse(ball.x, table.y + 10, ball.r * 1.2, ball.r * 0.45, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.globalAlpha = 1;

    // ball body
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.fill();

    // highlight
    ctx.beginPath();
    ctx.arc(ball.x - ball.r * 0.35, ball.y - ball.r * 0.35, ball.r * 0.28, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.65)";
    ctx.fill();
  }

  function drawCup() {
    // cup depth
    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    ctx.ellipse(cup.x, cup.y + cup.depth, cup.r * 0.9, cup.r * 0.35, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.globalAlpha = 1;

    // cup body
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.strokeStyle = "rgba(255,255,255,0.20)";
    ctx.lineWidth = 2;

    // sides
    ctx.beginPath();
    ctx.moveTo(cup.x - cup.r * 0.75, cup.y);
    ctx.lineTo(cup.x - cup.r * 0.55, cup.y + cup.depth);
    ctx.lineTo(cup.x + cup.r * 0.55, cup.y + cup.depth);
    ctx.lineTo(cup.x + cup.r * 0.75, cup.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // rim (opening)
    ctx.beginPath();
    ctx.ellipse(cup.x, cup.y, cup.r, cup.r * 0.38, 0, 0, Math.PI * 2);
    ctx.strokeStyle = cup.scored ? "rgba(160,255,160,0.9)" : "rgba(255,255,255,0.55)";
    ctx.lineWidth = cup.rim;
    ctx.stroke();

    // inner hole
    ctx.beginPath();
    ctx.ellipse(cup.x, cup.y, cup.r * 0.72, cup.r * 0.25, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fill();
  }

  function setStatus(msg) {
    statusEl.textContent = msg;
  }

  // Init
  resize();
  requestAnimationFrame(step);
})();
