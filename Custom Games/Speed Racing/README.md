# 🏎️ Racing Game

> Hit the gas, dodge red cars, and collect coins for the highest score!

---

## 🏁 About

Racing Game is a browser-based top-down driving game. You control a pink car on a scrolling road — accelerate with Space, dodge oncoming red enemy cars, and collect gold coins to rack up points. You have 3 lives — lose them all and it's game over.

---

## 🕹️ Controls

| Key | Action |
|-----|--------|
| `←` / `A` | Move left |
| `→` / `D` | Move right |
| `Space` | Accelerate |
| **Start Game** button | Begin |
| **Reset** button | Reset everything |

Hold Space to build up speed — release to slow down gradually via friction.

---

## 🎯 How to Play

1. Click **Start Game** to begin
2. Hold **Space** to accelerate — the road scrolls faster as you speed up
3. Dodge red enemy cars coming from the top
4. Drive over gold coins to collect them (+10 points each)
5. Each collision with an enemy car costs 1 life and triggers an explosion effect
6. Lose all 3 lives and the game ends with your final score

---

## ⚙️ Game Details

| Stat | Value |
|------|-------|
| Canvas size | 800 × 600px |
| Starting lives | 3 |
| Coin value | +10 points |
| Max player speed | 8 px/frame |
| Player acceleration | 0.2 px/frame² |
| Player friction | 0.95 (per frame when not accelerating) |
| Player lateral speed | 6 px/frame |
| Enemy spawn rate | ~2% chance per frame |
| Enemy speed | 2–4 px/frame + current player speed |
| Coin spawn rate | ~1% chance per frame |
| Speed display | Player speed × 10 (shown as km/h) |
| Distance display | Cumulative speed sum (in metres) |

---

## 🚗 Obstacles & Collectibles

| Object | Colour | Effect |
|--------|--------|--------|
| Enemy car | 🔴 Red | -1 life, explosion particles |
| Coin | 🟡 Gold | +10 score, gold particle burst |

Enemy cars spawn at random X positions within the road boundary and scroll toward you at a speed based on their own speed plus your current speed — going faster makes enemies close in quicker!

---

## 🗂️ File Structure

```
racing-game/
├── index.html    # Game HTML (body content)
├── style.css     # Blue gradient background, stats bar, button styles
├── script.js     # Game loop, physics, spawning, collision, particles
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. No installation or internet connection required — all graphics are Canvas-drawn

---

## 🛠️ Tech Stack

- **HTML5 Canvas** — road, grass, cars, coins, particle effects
- **Vanilla JavaScript** — physics engine, spawn system, collision detection, particle system
- **CSS** — blue gradient background, glassmorphism stats bar

---

## 💡 Tips

- Going faster makes enemy cars scroll toward you faster — don't max out speed in heavy traffic
- Coins are worth more the riskier your run — chase them even when enemies are nearby
- After a collision you briefly respawn at the same position — move immediately to avoid double hits
- The road boundary limits movement to x: 80–670, so plan your dodges early

---

*Gas it. Dodge everything. Collect every coin. 🏎️💨*
