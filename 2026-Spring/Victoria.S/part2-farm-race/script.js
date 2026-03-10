const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const statusEl = document.getElementById("status");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");

const W = canvas.width, H = canvas.height;
const keys = new Set();

window.addEventListener("keydown", (e) => keys.add(e.key.toLowerCase()));
window.addEventListener("keyup", (e) => keys.delete(e.key.toLowerCase()));

const COLORS = {
    grassDark: "#2c5f2d", grassLight: "#3a7a3a", mud: "#6b4f2a",
    fence: "#8b5a2b", hay: "#f6c453", barn: "#b91c1c", roof: "#7f1d1d"
};

const finishLineX = W - 130;

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

// Collision logic using AABB vs Circle
// This calculates the closest point on the rectangle to the racer's center

function rectHitCircle(rect, cx, cy, r) {
    const nx = clamp(cx, rect.x, rect.x + rect.w);
    const ny = clamp(cy, rect.y, rect.y + rect.h);
    const dx = cx - nx;
    const dy = cy - ny;
    return Math.hypot(dx, dy) <= r;
}

const makeObstacles = () => [
    { type: "mud", x: 220, y: 90, w: 170, h: 70 },
    { type: "mud", x: 610, y: 160, w: 140, h: 70 },
    { type: "fence", x: 300, y: 210, w: 30, h: 150 },
    { type: "fence", x: 520, y: 70, w: 30, h: 170 },
    { type: "fence", x: 720, y: 280, w: 30, h: 170 },
    { type: "hay", x: 150, y: 280, w: 70, h: 45 },
    { type: "hay", x: 455, y: 250, w: 70, h: 45 }
];

const racersBase = () => [
    { id: "pig", name: "Pig", emoji: "🐷", color: "#fca5a5", x: 80, y: 140, r: 22, speed: 180, isPlayer: true },
    { id: "cow", name: "Cow", emoji: "🐮", color: "#d1d5db", x: 80, y: 270, r: 22, speed: 155, isPlayer: false },
    { id: "duck", name: "Duck", emoji: "🐥", color: "#fde68a", x: 80, y: 400, r: 22, speed: 165, isPlayer: false }
];

let obstacles = makeObstacles();
let racers = racersBase();
let running = false;
let ended = false;
let lastT = performance.now();

function resetGame() {
    obstacles = makeObstacles();
    racers = racersBase();
    running = false;
    ended = false;
    statusEl.textContent = "Press Start";
}

startBtn.addEventListener("click", () => { if(!ended) { running = true; statusEl.textContent = "Go! 🏁"; }});
resetBtn.addEventListener("click", resetGame);

function update(dt) {
    if (!running || ended) return;

    for (const r of racers) {
        let ux = 0, uy = 0;
        if (r.isPlayer) {
            if (keys.has("arrowleft") || keys.has("a")) ux -= 1;
            if (keys.has("arrowright") || keys.has("d")) ux += 1;
            if (keys.has("arrowup") || keys.has("w")) uy -= 1;
            if (keys.has("arrowdown") || keys.has("s")) uy += 1;
        } else {
            ux = 1; // Basic AI move forward
            uy = Math.sin(performance.now() / 500 + (r.id === 'cow' ? 0 : 2)) * 0.3;
        }

        const mag = Math.hypot(ux, uy) || 1;
        let speedMul = 1;

        // Check Obstacles
        for (const ob of obstacles) {
            if (rectHitCircle(ob, r.x, r.y, r.r)) {
                if (ob.type === "mud") speedMul = 0.4;
                if (ob.type === "hay") speedMul = 0.7;
                if (ob.type === "fence") {
                    // Push back from fence
                    const nx = clamp(r.x, ob.x, ob.x + ob.w);
                    const ny = clamp(r.y, ob.y, ob.y + ob.h);
                    r.x += (r.x - nx) * 0.2;
                    r.y += (r.y - ny) * 0.2;
                    speedMul = 0.2;
                }
            }
        }

        r.x += (ux / mag) * r.speed * speedMul * dt;
        r.y += (uy / mag) * r.speed * speedMul * dt;
        r.x = clamp(r.x, r.r, W - r.r);
        r.y = clamp(r.y, r.r, H - r.r);

        if (r.x + r.r >= finishLineX) {
            ended = true;
            running = false;
            statusEl.textContent = `${r.name} Wins! 🎉`;
        }
    }
}

function draw() {
    ctx.fillStyle = COLORS.grassDark;
    ctx.fillRect(0, 0, W, H);
    
    // Finish Area
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fillRect(finishLineX, 0, W, H);
    ctx.fillStyle = "white";
    ctx.fillRect(finishLineX - 5, 0, 5, H);

    obstacles.forEach(ob => {
        ctx.fillStyle = COLORS[ob.type];
        ctx.fillRect(ob.x, ob.y, ob.w, ob.h);
    });

    racers.forEach(r => {
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText(r.emoji, r.x, r.y + 10);
        ctx.fillStyle = "white";
        ctx.font = "12px sans-serif";
        ctx.fillText(r.name, r.x, r.y - 25);
    });

    if (!running && !ended) {
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0,0,W,H);
        ctx.fillStyle = "white";
        ctx.font = "bold 40px sans-serif";
        ctx.fillText("READY TO RACE?", W/2, H/2);
    }
}

function loop(t) {
    const dt = (t - lastT) / 1000;
    lastT = t;
    update(dt);
    draw();
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
