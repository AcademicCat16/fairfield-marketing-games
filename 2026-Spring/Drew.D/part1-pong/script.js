// ================= GAME ENGINE =================
const Game = {
  start(id, game, cfg) {
    return Object.assign(Object.create(game), {
      cfg,
      canvas: document.getElementById(id),
      ctx: document.getElementById(id).getContext("2d"),
      width: 640,
      height: 480,
      start() {
        this.last = performance.now();
        requestAnimationFrame(this.loop.bind(this));
      },
      loop(t) {
        const dt = (t - this.last) / 1000;
        this.last = t;
        this.update(dt);
        this.draw(this.ctx);
        requestAnimationFrame(this.loop.bind(this));
      }
    });
  }
};

// ================= PONG GAME =================
const Pong = {
  // 0 = demo, 1 = single player, 2 = two player
  mode: null,

  startMode(m) {
    this.mode = m;
    this.playing = true;
  },

  update(dt) {
    if (!this.playing) return;

    // AI for right paddle in single player OR demo
    if (this.mode === 1 || this.mode === 0) {
      const target = this.ball.y - 40; // aim paddle center at ball
      const speed = 220;              // px/sec
      if (this.right.y < target) this.right.y += speed * dt;
      if (this.right.y > target) this.right.y -= speed * dt;
    }

    // AI for left paddle in demo
    if (this.mode === 0) {
      const target = this.ball.y - 40;
      const speed = 220;
      if (this.left.y < target) this.left.y += speed * dt;
      if (this.left.y > target) this.left.y -= speed * dt;
    }

    // clamp paddles
    this.left.y = Math.max(0, Math.min(this.height - 80, this.left.y));
    this.right.y = Math.max(0, Math.min(this.height - 80, this.right.y));

    // move ball
    this.ball.x += this.ball.vx * dt;
    this.ball.y += this.ball.vy * dt;

    // bounce off top/bottom (use ball size so it doesn't half-disappear)
    if (this.ball.y < 5) { this.ball.y = 5; this.ball.vy *= -1; }
    if (this.ball.y > this.height - 5) { this.ball.y = this.height - 5; this.ball.vy *= -1; }

    // bounce off left paddle
    if (
      this.ball.x - 5 < 20 &&
      this.ball.y > this.left.y &&
      this.ball.y < this.left.y + 80 &&
      this.ball.vx < 0
    ) {
      this.ball.vx *= -1;
    }

    // bounce off right paddle
    if (
      this.ball.x + 5 > this.width - 20 &&
      this.ball.y > this.right.y &&
      this.ball.y < this.right.y + 80 &&
      this.ball.vx > 0
    ) {
      this.ball.vx *= -1;
    }

    // reset if out of bounds
    if (this.ball.x < 0 || this.ball.x > this.width) {
      this.ball.x = this.width / 2;
      this.ball.y = this.height / 2;
      // send ball toward the player who just got scored on (simple)
      this.ball.vx = this.ball.vx > 0 ? -200 : 200;
      this.ball.vy = (Math.random() > 0.5 ? 150 : -150);
    }
  },

  draw(ctx) {
    ctx.clearRect(0, 0, this.width, this.height);

    // paddles = BLUE
    ctx.fillStyle = "blue";
    ctx.fillRect(10, this.left.y, 10, 80);
    ctx.fillRect(this.width - 20, this.right.y, 10, 80);

    // ball = RED
    ctx.fillStyle = "red";
    ctx.fillRect(this.ball.x - 5, this.ball.y - 5, 10, 10);

    if (!this.playing) {
      ctx.font = "20px Arial";
      ctx.textAlign = "center";
      ctx.fillStyle = "white";
      ctx.fillText("Press 1 (single), 2 (two-player), 0 (demo)", this.width / 2, this.height / 2);
    }
  },

  onkeydown(key) {
    if (key === 49) this.startMode(1); // 1 = single player
    if (key === 50) this.startMode(2); // 2 = two player
    if (key === 48) this.startMode(0); // 0 = demo

    if (!this.playing) return;

    // Player 1 always controllable in modes 1 and 2
    if (this.mode === 1 || this.mode === 2) {
      if (key === 81) this.left.y -= 20; // Q
      if (key === 65) this.left.y += 20; // A
    }

    // Player 2 controllable only in two-player mode
    if (this.mode === 2) {
      if (key === 80) this.right.y -= 20; // P
      if (key === 76) this.right.y += 20; // L
    }

    // Esc to stop
    if (key === 27) {
      this.playing = false;
      this.mode = null;
    }
  }
};

// ================= START GAME =================
const pong = Game.start("game", Pong, { stats: true });

pong.left = { y: 200 };
pong.right = { y: 200 };
pong.ball = { x: 320, y: 240, vx: 200, vy: 150 };
pong.playing = false;

document.addEventListener("keydown", (e) => pong.onkeydown(e.keyCode));
pong.start();
