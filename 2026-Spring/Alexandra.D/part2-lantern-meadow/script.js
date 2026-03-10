// Lantern Meadow - from scratch top-down cozy task game
(() => {
  // ---------- Canvas / grid ----------
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  const TILE = 32;
  const W = canvas.width;
  const H = canvas.height;
  const COLS = Math.floor(W / TILE);
  const ROWS = Math.floor(H / TILE);

  // ---------- HUD ----------
  const scoreEl = document.getElementById("score");
  const coinsEl = document.getElementById("coins");
  const capEl = document.getElementById("cap");
  const invEl = document.getElementById("inv");
  const ordersEl = document.getElementById("orders");
  const dayBarEl = document.getElementById("dayBar");
  const toastEl = document.getElementById("toast");

  // ---------- Game state ----------
  let keys = new Set();
  let last = performance.now();
  let acc = 0;

  const game = {
    running: true,
    score: 0,
    coins: 0,
    delivered: 0,
    targetDeliveries: 5,
    day: 100,        // percent
    dayDrainPerSec: 2.4, // time pressure
    cap: 6,
    inventory: new Map(), // item -> qty
    orders: [], // {id, want: {item: qty}, rewardCoins, rewardScore, done}
    msgCooldown: 0
  };

  const ITEMS = ["Mint", "Mushroom", "Berry", "Herbal Tea", "Forest Tea", "Sweet Tea"];
  const INGREDIENTS = ["Mint", "Mushroom", "Berry"];

  // ---------- Map tiles ----------
  // 0 grass, 1 path, 2 water (solid), 3 rocks (solid)
  const map = Array.from({ length: ROWS }, (_, y) =>
    Array.from({ length: COLS }, (_, x) => {
      // base grass
      let t = 0;

      // path across
      if (y === 11 || y === 12) t = 1;

      // small pond
      const dx = x - 18, dy = y - 18;
      if (dx*dx + dy*dy <= 10) t = 2;

      // some rocks
      if ((x === 6 && y >= 4 && y <= 7) || (x === 7 && y === 7) || (x === 8 && y === 7)) t = 3;

      return t;
    })
  );

  // ---------- Entities (original “assets” drawn as shapes) ----------
  const player = {
    x: 4 * TILE,
    y: 12 * TILE,
    w: 20,
    h: 20,
    speed: 160, // px/sec
    facing: { x: 1, y: 0 }
  };

  const props = [
    // gather nodes
    { type: "bush", item: "Mint", x: 3, y: 5, cd: 0 },
    { type: "bush", item: "Mint", x: 5, y: 6, cd: 0 },
    { type: "pad", item: "Mushroom", x: 10, y: 4, cd: 0 },
    { type: "pad", item: "Mushroom", x: 12, y: 6, cd: 0 },
    { type: "berry", item: "Berry", x: 22, y: 8, cd: 0 },
    { type: "berry", item: "Berry", x: 24, y: 10, cd: 0 },

    // crafting + NPC
    { type: "campfire", x: 14, y: 12 },
    { type: "villager", x: 20, y: 12 }
  ];

  // ---------- Utilities ----------
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rand = (n) => Math.floor(Math.random() * n);

  function toast(text) {
    toastEl.textContent = text;
    toastEl.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toastEl.classList.remove("show"), 1400);
  }

  function setQty(item, qty) {
    if (qty <= 0) game.inventory.delete(item);
    else game.inventory.set(item, qty);
  }
  function getQty(item) {
    return game.inventory.get(item) || 0;
  }
  function invCountTotal() {
    let n = 0;
    for (const [, qty] of game.inventory) n += qty;
    return n;
  }
  function addItem(item, qty = 1) {
    const total = invCountTotal();
    if (total + qty > game.cap) {
      toast("Backpack full!");
      return false;
    }
    setQty(item, getQty(item) + qty);
    return true;
  }
  function removeItem(item, qty = 1) {
    const have = getQty(item);
    if (have < qty) return false;
    setQty(item, have - qty);
    return true;
  }

  function refreshHUD() {
    scoreEl.textContent = String(game.score);
    coinsEl.textContent = String(game.coins);
    capEl.textContent = String(game.cap);

    // inventory list
    invEl.innerHTML = "";
    const entries = Array.from(game.inventory.entries()).sort((a,b)=>a[0].localeCompare(b[0]));
    if (entries.length === 0) {
      const li = document.createElement("li");
      li.textContent = "(empty)";
      invEl.appendChild(li);
    } else {
      for (const [item, qty] of entries) {
        const li = document.createElement("li");
        li.textContent = `${item} × ${qty}`;
        invEl.appendChild(li);
      }
    }

    // orders
    ordersEl.innerHTML = "";
    for (const o of game.orders) {
      const li = document.createElement("li");
      const wantText = Object.entries(o.want).map(([k,v])=>`${k}×${v}`).join(", ");
      li.textContent = o.done
        ? `✅ Delivered (${wantText})`
        : `🧾 ${wantText} → +${o.rewardCoins} coins`;
      ordersEl.appendChild(li);
    }

    // daylight
    dayBarEl.style.width = `${clamp(game.day, 0, 100)}%`;
  }

  // ---------- Collisions ----------
  function tileAt(px, py) {
    const x = Math.floor(px / TILE);
    const y = Math.floor(py / TILE);
    if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return 2; // treat outside as water/solid
    return map[y][x];
  }
  function solidTile(t) {
    return t === 2 || t === 3;
  }

  function tryMove(dx, dy, dt) {
    const nx = player.x + dx * player.speed * dt;
    const ny = player.y + dy * player.speed * dt;

    // simple AABB collision against solid tiles
    // check corners with some padding
    const pad = 6;
    const corners = [
      { x: nx + pad, y: ny + pad },
      { x: nx + player.w - pad, y: ny + pad },
      { x: nx + pad, y: ny + player.h - pad },
      { x: nx + player.w - pad, y: ny + player.h - pad }
    ];

    for (const c of corners) {
      const t = tileAt(c.x, c.y);
      if (solidTile(t)) return; // block move
    }

    player.x = nx;
    player.y = ny;
  }

  // ---------- Orders / crafting ----------
  function newOrder() {
    // request 1-2 items; mostly teas, sometimes raw ingredients
    const wantsTea = Math.random() < 0.72;
    const want = {};

    if (wantsTea) {
      const teas = ["Herbal Tea", "Forest Tea", "Sweet Tea"];
      const tea = teas[rand(teas.length)];
      want[tea] = 1;
    } else {
      const ing = INGREDIENTS[rand(INGREDIENTS.length)];
      want[ing] = 2;
    }

    return {
      id: crypto?.randomUUID?.() || String(Date.now() + Math.random()),
      want,
      rewardCoins: 6 + rand(6),
      rewardScore: 40 + rand(40),
      done: false
    };
  }

  function ensureOrders() {
    // keep 3 orders active
    while (game.orders.filter(o=>!o.done).length < 3) {
      game.orders.push(newOrder());
    }
  }

  function craftAtCampfire() {
    // recipes:
    // Herbal Tea: Mint+Mint
    // Forest Tea: Mushroom+Mint
    // Sweet Tea: Berry+Mint
    const recipes = [
      { out: "Herbal Tea", need: { Mint: 2 } },
      { out: "Forest Tea", need: { Mushroom: 1, Mint: 1 } },
      { out: "Sweet Tea", need: { Berry: 1, Mint: 1 } }
    ];

    // choose first craftable recipe
    for (const r of recipes) {
      let ok = true;
      for (const [k,v] of Object.entries(r.need)) {
        if (getQty(k) < v) ok = false;
      }
      if (!ok) continue;

      // remove ingredients
      for (const [k,v] of Object.entries(r.need)) removeItem(k, v);

      // add output
      if (addItem(r.out, 1)) {
        game.score += 10;
        toast(`Crafted ${r.out}! (+10)`);
      } else {
        // if backpack full, revert (rare but possible)
        for (const [k,v] of Object.entries(r.need)) addItem(k, v);
        toast("No space to craft!");
      }
      refreshHUD();
      return;
    }

    toast("Need ingredients to craft!");
  }

  function deliverToVillager() {
    // find first matching incomplete order that player can satisfy
    for (const o of game.orders) {
      if (o.done) continue;

      let ok = true;
      for (const [item, qty] of Object.entries(o.want)) {
        if (getQty(item) < qty) ok = false;
      }
      if (!ok) continue;

      // fulfill
      for (const [item, qty] of Object.entries(o.want)) removeItem(item, qty);
      o.done = true;

      game.coins += o.rewardCoins;
      game.score += o.rewardScore;
      game.delivered += 1;

      toast(`Delivered! +${o.rewardCoins} coins`);
      ensureOrders();
      refreshHUD();

      // upgrade available
      if (game.coins >= 20 && game.cap < 12) {
        toast("Upgrade unlocked: +2 backpack (press E near campfire)");
      }

      // win check
      if (game.delivered >= game.targetDeliveries) {
        game.running = false;
        toast("You win! Press R to restart.");
      }

      return;
    }

    toast("You don't have what they want.");
  }

  function tryUpgradeAtCampfire() {
    if (game.coins >= 20 && game.cap < 12) {
      game.coins -= 20;
      game.cap += 2;
      toast("Backpack upgraded! (+2)");
      refreshHUD();
      return true;
    }
    return false;
  }

  // ---------- Interactions ----------
  function entityNear(type, radiusPx = 40) {
    const px = player.x + player.w/2;
    const py = player.y + player.h/2;
    for (const p of props) {
      if (p.type !== type) continue;
      const ex = p.x*TILE + TILE/2;
      const ey = p.y*TILE + TILE/2;
      const d = Math.hypot(px - ex, py - ey);
      if (d <= radiusPx) return p;
    }
    return null;
  }

  function gather(node) {
    if (node.cd > 0) { toast("That spot needs time…"); return; }
    const got = addItem(node.item, 1);
    if (got) {
      node.cd = 4.0; // seconds cooldown
      game.score += 5;
      toast(`Found ${node.item}! (+5)`);
      refreshHUD();
    }
  }

  function interact() {
    if (!game.running) return;

    // gathering nodes first
    for (const p of props) {
      if (!["bush","pad","berry"].includes(p.type)) continue;
      const ex = p.x*TILE + TILE/2;
      const ey = p.y*TILE + TILE/2;
      const px = player.x + player.w/2;
      const py = player.y + player.h/2;
      if (Math.hypot(px-ex, py-ey) < 36) {
        gather(p);
        return;
      }
    }

    // campfire (craft or upgrade)
    if (entityNear("campfire", 48)) {
      // if upgrade possible, do that first
      if (!tryUpgradeAtCampfire()) craftAtCampfire();
      return;
    }

    // villager deliver
    if (entityNear("villager", 48)) {
      deliverToVillager();
      return;
    }

    toast("Nothing to interact with.");
  }

  // ---------- Drawing (original visual assets via canvas) ----------
  function drawTile(x, y, t) {
    const px = x * TILE;
    const py = y * TILE;

    if (t === 0) { // grass
      ctx.fillStyle = "#12301f";
      ctx.fillRect(px, py, TILE, TILE);
      // blades
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = "#58ff9a";
      for (let i=0;i<3;i++){
        const gx = px + 6 + i*9;
        const gy = py + 8 + (i%2)*6;
        ctx.fillRect(gx, gy, 2, 6);
      }
      ctx.globalAlpha = 1;
    }

    if (t === 1) { // path
      ctx.fillStyle = "#2b2a1e";
      ctx.fillRect(px, py, TILE, TILE);
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = "#ffcc66";
      ctx.fillRect(px+6, py+10, TILE-12, 4);
      ctx.globalAlpha = 1;
    }

    if (t === 2) { // water
      ctx.fillStyle = "#0c2142";
      ctx.fillRect(px, py, TILE, TILE);
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = "#66b3ff";
      ctx.fillRect(px+6, py+14, TILE-12, 2);
      ctx.globalAlpha = 1;
    }

    if (t === 3) { // rocks
      ctx.fillStyle = "#1a1e22";
      ctx.fillRect(px, py, TILE, TILE);
      ctx.fillStyle = "#59626e";
      ctx.beginPath();
      ctx.roundRect(px+7, py+8, 18, 16, 6);
      ctx.fill();
    }
  }

  function drawProp(p) {
    const px = p.x * TILE;
    const py = p.y * TILE;

    if (p.type === "bush") {
      ctx.fillStyle = "#0f3d22";
      ctx.beginPath(); ctx.roundRect(px+4, py+6, 24, 20, 10); ctx.fill();
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = "#58ff9a";
      ctx.fillRect(px+10, py+10, 2, 8);
      ctx.fillRect(px+16, py+12, 2, 6);
      ctx.globalAlpha = 1;

      // cooldown overlay
      if (p.cd > 0) {
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = "#000";
        ctx.fillRect(px, py, TILE, TILE);
        ctx.globalAlpha = 1;
      }
    }

    if (p.type === "pad") {
      ctx.fillStyle = "#163b2a";
      ctx.beginPath(); ctx.roundRect(px+5, py+10, 22, 14, 8); ctx.fill();
      ctx.fillStyle = "#cdb38b";
      ctx.beginPath(); ctx.roundRect(px+14, py+8, 10, 10, 6); ctx.fill();
      if (p.cd > 0) {
        ctx.globalAlpha = 0.35; ctx.fillStyle="#000"; ctx.fillRect(px,py,TILE,TILE); ctx.globalAlpha=1;
      }
    }

    if (p.type === "berry") {
      ctx.fillStyle = "#0f3d22";
      ctx.beginPath(); ctx.roundRect(px+4, py+7, 24, 19, 10); ctx.fill();
      ctx.fillStyle = "#ff4aa2";
      ctx.beginPath(); ctx.arc(px+12, py+16, 4, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(px+18, py+18, 3, 0, Math.PI*2); ctx.fill();
      if (p.cd > 0) {
        ctx.globalAlpha = 0.35; ctx.fillStyle="#000"; ctx.fillRect(px,py,TILE,TILE); ctx.globalAlpha=1;
      }
    }

    if (p.type === "campfire") {
      // logs
      ctx.fillStyle = "#5a3a20";
      ctx.beginPath(); ctx.roundRect(px+7, py+16, 18, 6, 3); ctx.fill();
      ctx.beginPath(); ctx.roundRect(px+9, py+14, 14, 6, 3); ctx.fill();

      // flame glow
      ctx.save();
      ctx.shadowColor = "#ffcc66";
      ctx.shadowBlur = 16;
      ctx.fillStyle = "#ffcc66";
      ctx.beginPath();
      ctx.moveTo(px+16, py+10);
      ctx.quadraticCurveTo(px+10, py+16, px+16, py+22);
      ctx.quadraticCurveTo(px+22, py+16, px+16, py+10);
      ctx.fill();
      ctx.restore();
    }

    if (p.type === "villager") {
      // body
      ctx.fillStyle = "#1d2a3a";
      ctx.beginPath(); ctx.roundRect(px+9, py+12, 14, 16, 6); ctx.fill();
      // head
      ctx.fillStyle = "#ffd3b0";
      ctx.beginPath(); ctx.arc(px+16, py+10, 7, 0, Math.PI*2); ctx.fill();
      // hat
      ctx.fillStyle = "#0f141a";
      ctx.beginPath(); ctx.roundRect(px+8, py+4, 16, 6, 3); ctx.fill();
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = "#58ff9a";
      ctx.fillRect(px+24, py+10, 2, 10); // little marker
      ctx.globalAlpha = 1;
    }
  }

  function drawPlayer() {
    const px = player.x;
    const py = player.y;

    // shadow
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.ellipse(px+10, py+18, 10, 5, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // body
    ctx.fillStyle = "#0f141a";
    ctx.beginPath(); ctx.roundRect(px+3, py+8, 14, 14, 6); ctx.fill();

    // cloak glow
    ctx.save();
    ctx.shadowColor = "#58ff9a";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#1fe06d";
    ctx.beginPath(); ctx.roundRect(px+2, py+10, 16, 12, 6); ctx.fill();
    ctx.restore();

    // face
    ctx.fillStyle = "#ffd3b0";
    ctx.beginPath(); ctx.arc(px+10, py+8, 6, 0, Math.PI*2); ctx.fill();

    // facing indicator
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = "#ffcc66";
    ctx.fillRect(px+10 + player.facing.x*8, py+14 + player.facing.y*8, 3, 3);
    ctx.globalAlpha = 1;
  }

  function draw() {
    ctx.clearRect(0,0,W,H);

    // tiles
    for (let y=0;y<ROWS;y++){
      for (let x=0;x<COLS;x++){
        drawTile(x,y,map[y][x]);
      }
    }

    // props
    for (const p of props) drawProp(p);

    // player
    drawPlayer();

    // subtle vignette
    const g = ctx.createRadialGradient(W/2,H/2,220, W/2,H/2, 520);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.35)");
    ctx.fillStyle = g;
    ctx.fillRect(0,0,W,H);
  }

  // ---------- Game loop ----------
  function update(dt) {
    if (!game.running) return;

    // daylight drain
    game.day -= game.dayDrainPerSec * dt;
    if (game.day <= 0) {
      game.day = 0;
      game.running = false;
      toast("Day ended! Press R to restart.");
    }

    // prop cooldowns
    for (const p of props) {
      if (typeof p.cd === "number" && p.cd > 0) p.cd = Math.max(0, p.cd - dt);
    }

    // movement
    let mx = 0, my = 0;
    const up = keys.has("arrowup") || keys.has("w");
    const dn = keys.has("arrowdown") || keys.has("s");
    const lf = keys.has("arrowleft") || keys.has("a");
    const rt = keys.has("arrowright") || keys.has("d");

    if (up) my -= 1;
    if (dn) my += 1;
    if (lf) mx -= 1;
    if (rt) mx += 1;

    if (mx || my) {
      const mag = Math.hypot(mx,my) || 1;
      mx /= mag; my /= mag;
      player.facing = { x: Math.sign(mx) || player.facing.x, y: Math.sign(my) || player.facing.y };
      tryMove(mx, my, dt);
    }

    refreshHUD();
    draw();
  }

  function loop(ts) {
    const dt = (ts - last) / 1000;
    last = ts;
    update(dt);
    requestAnimationFrame(loop);
  }

  // ---------- Input ----------
  window.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    keys.add(k);

    if (k === "e") interact();
    if (k === "r") restart();
  });

  window.addEventListener("keyup", (e) => {
    keys.delete(e.key.toLowerCase());
  });

  function restart() {
    // reset state
    game.running = true;
    game.score = 0;
    game.coins = 0;
    game.delivered = 0;
    game.day = 100;
    game.cap = 6;
    game.inventory.clear();
    game.orders = [newOrder(), newOrder(), newOrder()];

    // reset props cooldowns
    for (const p of props) if (typeof p.cd === "number") p.cd = 0;

    // reset player
    player.x = 4*TILE;
    player.y = 12*TILE;
    player.facing = {x:1,y:0};

    toast("New day started!");
    refreshHUD();
    draw();
  }

  // ---------- Start ----------
  game.orders = [newOrder(), newOrder(), newOrder()];
  ensureOrders();
  refreshHUD();
  draw();
  requestAnimationFrame(loop);
})();
