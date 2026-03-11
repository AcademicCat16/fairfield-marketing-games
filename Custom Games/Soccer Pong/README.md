# ⚽ Soccer Pong

> Classic Pong — but on a soccer field with Messi and a rival striker!

---

## ⚽ About

Soccer Pong is a browser-based two-player Pong game with a soccer twist. Two players control silhouette sprites on a green field, bouncing a ball back and forth. Score by getting the ball past your opponent's side. First to score as many goals as you can!

---

## 🕹️ Controls

| Player | Move Up | Move Down |
|--------|---------|-----------|
| **Player 1** (left) | `W` | `S` |
| **Player 2** (right) | `↑` Arrow Up | `↓` Arrow Down |

Both players can move simultaneously — no turn-taking.

---

## 🎯 How to Play

1. Open the page — the game starts immediately
2. Move your player up and down to intercept the ball
3. The ball bounces off the top and bottom walls
4. If the ball passes your side, the opponent scores
5. After each goal the ball resets to center and reverses direction
6. Play until you decide to stop — there's no win condition or round limit

---

## ⚙️ Game Details

| Stat | Value |
|------|-------|
| Canvas size | 800 × 500px |
| Player size | 60 × 100px |
| Player speed | 7 px/frame |
| Ball radius | 10px |
| Starting ball speed | 5 px/frame (X and Y) |
| Speed increase on hit | ×1.1 per bounce off a player |
| Ball reset speed | 5 px/frame (direction reverses) |

The ball speeds up slightly every time it bounces off a player — rallies get faster over time!

---

## 🏟️ Field Markings

The canvas is drawn as a soccer field with:
- Center line and center circle
- Left and right penalty boxes

All markings are decorative — the playable area is the full canvas width.

---

## 🗂️ File Structure

```
soccer-pong/
├── index.html    # Game HTML (body content)
├── style.css     # Green field background, score overlay
├── script.js     # Game loop, movement, ball physics, collision, scoring
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. An **internet connection** is needed to load the player sprites from GitHub

---

## 🛠️ Tech Stack

- **HTML5 Canvas** — field markings, player sprites, ball rendering
- **Vanilla JavaScript** — game loop, keyboard input, collision detection, scoring
- **External images** — Messi and rival silhouette sprites hosted on GitHub

---

## 💡 Tips

- Ball speed increases by 10% on every player hit — the longer the rally, the faster it gets
- After a goal, the ball always launches toward the player who just conceded — be ready!
- Watch the ball's angle — hitting it with the edge of your player sends it on a steeper path

---

*Two players. One ball. No mercy. ⚽*
