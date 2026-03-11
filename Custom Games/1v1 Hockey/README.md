# 🏒 1v1 Hockey

> Face off against a rival AI on the ice — shoot the puck into the goal!

---

## 🏒 About

1v1 Hockey is a browser-based top-down hockey game featuring McDavid vs Crosby. You control McDavid and try to shoot the puck past the rival AI (Crosby) into the right-side goal. The AI guards the net and intercepts the puck — score as many goals as you can!

---

## 🕹️ Controls

| Key | Action |
|-----|--------|
| `W` / `↑` | Move up |
| `S` / `↓` | Move down |
| `A` / `←` | Move left |
| `D` / `→` | Move right |
| `Space` | Shoot (must be near puck) |
| `R` | Reset positions |

Diagonal movement is supported — hold two direction keys at once.

---

## 🎯 How to Play

1. Move toward the puck to get close
2. Face the direction you want to shoot, then press **Space**
3. Get the puck past the rival and into the right-side goal
4. After a goal, the puck resets to center ice and kicks back into play
5. No time limit — play as long as you like and beat your best score!

---

## ⚙️ Game Details

| Stat | Value |
|------|-------|
| Rink size | 900 × 520px canvas |
| Player speed | 4.2 px/frame |
| Rival speed | 3.2 px/frame |
| Shoot power | 9.2 px/frame (added to puck velocity) |
| Puck friction | 0.988 per frame (slow gradual stop) |
| Puck wall bounce | 90% velocity retained |
| Goal height | 120px on the right wall |

---

## 🤖 Rival AI

The rival (Crosby) has two behaviours:

| State | Trigger | Action |
|-------|---------|--------|
| **Shadow** | Puck is far away (> 220px) | Slides up and down to match the puck's Y position near the goal |
| **Intercept** | Puck is within 220px | Charges toward the puck to block or clear it |

The rival is slightly slower than the player (3.2 vs 4.2 px/frame) — use speed to beat it to the puck.

---

## 📊 Stats

| Display | Description |
|---------|-------------|
| **Score** | Goals scored this session |
| **Shots** | Total Space presses (attempted shots) |
| **Best** | All-time high score (saved in localStorage) |

Your best score is saved in the browser — it persists across page refreshes.

---

## 🗂️ File Structure

```
1v1-hockey/
├── index.html    # Game HTML (body content)
├── style.css     # Dark rink theme, HUD layout
├── script.js     # Physics, AI, shooting, goal detection, sprite loading
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. An **internet connection** is needed to load the McDavid and Crosby sprites from GitHub
4. If images fail to load, both players fall back to labelled circles automatically

---

## 🛠️ Tech Stack

- **HTML5 Canvas** — rink, ice markings, goal crease, puck, aim line, sprites
- **Vanilla JavaScript** — physics engine, AI state machine, collision resolution, localStorage best score
- **External images** — player sprites hosted on GitHub

---

## 💡 Tips

- You can only shoot when within ~32px of the puck — get close before pressing Space
- The blue aim line shows your current facing direction — adjust movement to line up your shot
- Diagonal movement is full speed in both axes — use it to dodge the rival quickly
- The puck drifts slowly due to friction — don't chase it, cut it off instead
- After scoring, the puck bounces back left at speed — be ready to receive it at center ice

---

*Skate fast. Shoot hard. Score on Crosby. 🏒⛸️*
