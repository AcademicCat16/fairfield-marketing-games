# 🚀 Asteroid Dodge

> Dodge the asteroids. Survive as long as you can. Beat your score!

---

## 🚀 About

Asteroid Dodge is a browser-based survival game drawn on an HTML5 Canvas. You pilot a cyan spaceship at the bottom of the screen, dodging a relentless barrage of asteroids falling from above. Every asteroid you survive past scores a point — how long can you last?

---

## 🕹️ Controls

| Key | Action |
|-----|--------|
| `←` Arrow Left | Move ship left |
| `→` Arrow Right | Move ship right |
| **Start / Play Again** button | Begin or restart |

The ship is clamped to the canvas edges — it can't move off screen.

---

## 🎯 How to Play

1. Click **Start** to begin
2. Use the arrow keys to dodge incoming asteroids
3. Each asteroid that passes off the bottom of the screen scores **+1 point**
4. Getting hit ends the game — a Game Over screen appears on the canvas
5. Click **Play Again** to restart immediately

---

## ⚙️ Game Details

| Stat | Value |
|------|-------|
| Canvas size | 400 × 500px |
| Player size | 40 × 40px triangle |
| Player move step | 20px per key press |
| Asteroid spawn rate | ~3% chance per frame |
| Asteroid size | 20–40px radius (random) |
| Asteroid speed | 2–5 px/frame (random) |
| Collision detection | Circle vs rectangle (accurate) |
| Score | +1 per asteroid that exits the bottom |

---

## 🗂️ File Structure

```
asteroid-dodge/
├── index.html    # Everything — styles, canvas, and script in one body-only file
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Open `index.html` in any modern browser
2. No installation or internet connection required — all graphics are Canvas-drawn

---

## 🛠️ Tech Stack

- **HTML5 Canvas 2D** — spaceship triangle, asteroid circles, game over overlay
- **Vanilla JavaScript** — game loop, asteroid spawning, collision detection, score tracking
- **CSS** — deep space radial gradient background

---

## 🔧 Fixes Applied

The original code had several bugs that were corrected:

- **Collision detection** was a rough box check that missed most hits — replaced with accurate circle-vs-rectangle detection
- **Player could move off screen** — added boundary clamping on both sides
- **`alert()` on game over** blocked the page — replaced with an in-canvas Game Over overlay
- **Asteroid splice during forward loop** could skip asteroids — fixed by iterating in reverse
- **No restart** without page reload — Start button now fully resets state and restarts the loop
- **AI image generator** removed — it required a local backend server (`localhost:3000`) that doesn't exist in the browser

---

## 💡 Tips

- Asteroids vary in size and speed — big slow ones are easier to read, small fast ones are the real danger
- Stay near the center early so you can dodge either direction
- Score only counts asteroids that exit the bottom — staying alive matters more than position

---

*Dodge everything. Score everything. Don't get hit. 🚀☄️*
