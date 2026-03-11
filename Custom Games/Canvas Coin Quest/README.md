# 🪙 Canvas Coin Quest

> Move, collect 10 coins, and dodge the enemies — all drawn with pure Canvas!

---

## 🎮 About

Canvas Coin Quest is a browser-based arcade game where you guide a friendly blue character around a starry night arena collecting gold coins while avoiding bouncing red enemies. Collect all 10 coins before losing your 3 lives to win!

---

## 🕹️ Controls

| Key | Action |
|-----|--------|
| `W` / `↑` | Move up |
| `S` / `↓` | Move down |
| `A` / `←` | Move left |
| `D` / `→` | Move right |
| **Restart** button | Reset the game |

Diagonal movement is normalized — you move at the same speed in all directions.

---

## 🎯 How to Play

1. The game starts automatically — move right away
2. Collect all **10 gold coins** scattered around the arena
3. Avoid the **red enemy blobs** bouncing around the field
4. Getting hit knocks you back to the start and costs **1 life**
5. Collect all 10 coins to win — lose all 3 lives and it's game over
6. Click **Restart** to play again

---

## ⚙️ Game Details

| Stat | Value |
|------|-------|
| Canvas size | 720 × 420px |
| Goal | Collect 10 coins |
| Starting lives | 3 |
| Player speed | 240 px/s |
| Enemy count | 2 |
| Enemy speeds | ~140–160 px/s (bounce off walls) |
| Invincibility after hit | 1.2 seconds |
| Collision type | Circle vs circle (radius-based) |

After taking a hit, you have **1.2 seconds of invincibility** — the player blinks to indicate this. You're also respawned at the left side so back-to-back hits aren't possible.

---

## 🎨 Visuals

All graphics are drawn with the **HTML5 Canvas 2D API** — no image files used:

| Element | Description |
|---------|-------------|
| 🔵 Player | Blue circle with dot eyes and a smile |
| 🟡 Coins | Gold circles with inner ring and shine highlight |
| 🔴 Enemies | Red circles with dot eyes and angry angled brows |
| 🌌 Background | Dark gradient sky, pseudo-random star field, floor tiles, vignette |

---

## 🗂️ File Structure

```
canvas-coin-quest/
├── index.html    # Game HTML — canvas element, HUD, layout
├── style.css     # Dark theme, canvas border, HUD styling
├── script.js     # Game loop, drawing, movement, collision, lives
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all three files in the same folder
2. Open `index.html` in any modern browser
3. No installation or internet connection required — everything is drawn in JS

---

## 🛠️ Tech Stack

- **HTML5 Canvas 2D** — all game graphics rendered in JS (no sprites or images)
- **Vanilla JavaScript** — delta-time game loop, circle collision, keyboard input
- **CSS** — dark panel layout, canvas border and shadow

---

## 💡 Tips

- Coins spawn at random positions each game — check the full arena before committing to a path
- The two enemies move independently — watch both at once when collecting coins near the center
- After a hit you respawn at x:80 — enemies may still be nearby, use the 1.2s invincibility window to get clear
- Diagonal movement is normalized so cutting corners is no faster than moving straight

---

*Collect. Dodge. Win. All in Canvas. 🪙✨*
