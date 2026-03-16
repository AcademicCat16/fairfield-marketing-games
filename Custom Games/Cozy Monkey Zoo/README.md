# 🐒 Cozy Monkey Zoo

> Wander through a peaceful zoo, collect stuffed monkeys, and make visitors smile!

---

## 🐒 About

Cozy Monkey Zoo is a browser-based exploration game drawn entirely with Canvas 2D. You play as a monkey carrying your favourite stuffed monkey friend, wandering through a cozy zoo with ponds, trees, flowers, and winding paths. Collect all 5 plushies and cheer up all 3 visitors to win!

---

## 🕹️ Controls

| Key | Action |
|-----|--------|
| `W` / `↑` | Move up |
| `S` / `↓` | Move down |
| `A` / `←` | Move left |
| `D` / `→` | Move right |

Diagonal movement is supported — hold two direction keys at once. The player faces the direction they're moving.

---

## 🎯 How to Play

1. Click **Start Game** on the opening screen
2. Walk around the zoo collecting glowing **stuffed monkeys** 🐒
3. Walk near **visitors** to cheer them up — they turn golden when happy!
4. Collect all **5 plushies** and help all **3 visitors** to win
5. Click **Play Again** to restart

---

## ⚙️ Game Details

| Stat | Value |
|------|-------|
| Canvas size | 960 × 540px |
| Plushies to collect | 5 |
| Visitors to help | 3 |
| Player speed | 2.5 px/frame (normalized diagonal) |
| Plushie collect radius | 34px |
| Visitor help radius | 55px |
| Player hit radius | 18px |

Fences and ponds block movement using circle-rectangle collision detection. Ponds have an extra 4px buffer so the player can't walk into the water.

---

## 🗺️ Zoo Layout

The zoo features two ponds, tree clusters, a flower field, winding dirt paths, fence barriers dividing the space into sections, and two signs — **Monkey Walk** and **Plush Corner**. All scenery is drawn with Canvas 2D — no image files needed.

---

## 🏆 Win Condition

Collect all 5 stuffed monkeys **and** cheer up all 3 visitors. Both conditions must be met at the same time — the win screen appears automatically.

---

## 🗂️ File Structure

```
cozy-monkey-zoo/
├── index.html    # Body-only HTML — canvas, overlays, stat pills
├── style.css     # Cozy warm theme, overlay cards, topbar layout
├── script.js     # Game loop, movement, collision, drawing, win logic
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. No installation or internet connection required — all graphics are Canvas-drawn

---

## 🛠️ Tech Stack

- **HTML5 Canvas 2D** — all characters, scenery, ponds, trees, flowers, signs drawn in JS
- **Vanilla JavaScript** — game loop, WASD/arrow input, circle-rect collision, win detection
- **CSS** — cozy warm layout, glassmorphism game shell, overlay cards

---

## 💡 Tips

- Plushies bob up and down with a golden glow — scan the whole zoo before heading off
- Visitors have a larger interaction radius (55px) than plushies (34px) — you don't need to be exactly on top of them
- Fences divide the zoo into sections — use the paths to navigate between areas
- The message bar at the top of the canvas updates when you collect a plushie or help a visitor

---

*Wander the zoo. Collect your plushies. Make everyone smile. 🐒🌸*
