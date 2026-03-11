# 🏈 QB Target Toss

> Drag to aim, release to throw — hit targets, build combos, and top the leaderboard!

---

## 🏈 About

QB Target Toss is a browser-based quarterback throwing game. Drag from the QB to set your throw direction and power, release to launch the football, and hit moving targets for points. Build combo streaks for score multipliers, level up every 300 points, and compete against your own best scores saved in the browser.

---

## 🕹️ Controls

| Action | Input |
|--------|-------|
| Aim | Click and drag from the QB |
| Throw | Release the drag |
| Start | Click **Start** button |
| Reset | Click **Reset** button |

Drag further from the QB for more power (up to 100%). The aim line and power percentage are shown while dragging.

---

## 🎯 How to Play

1. Click **Start** to begin the countdown
2. Click and drag from the QB (bottom-left) to aim
3. Release to throw — the ball curves with gravity and wind
4. Hit a target to score — bullseye (gold centre) earns more
5. Missing a target resets your combo to 0
6. Score 300 points to level up — targets shrink and wind increases
7. When time runs out your score is saved to the leaderboard

---

## 🎯 Scoring

| Hit | Base Points |
|-----|-------------|
| Outer ring | 90 pts |
| Bullseye (inner ring) | 150 pts |

**Combo multiplier:** each consecutive hit adds +0.18× (capped at ×2.5 total multiplier). Missing resets the combo.

Final points per throw = `base × (1 + min(2.5, combo × 0.18))`

---

## ⏱️ Difficulty Settings

| Difficulty | Time | Base Target Size | Wind Scale |
|------------|------|-----------------|------------|
| Easy | 55s | 30px radius | 0.7× |
| Normal | 45s | 26px radius | 1.0× |
| Hard | 38s | 22px radius | 1.3× |

Changing difficulty mid-session resets the current game.

---

## 📈 Leveling Up

- Every **300 points** increases the level
- Each level: targets shrink by 2px (min 14px), wind strength increases, one extra target spawns
- Wind pushes the ball horizontally — shown in the HUD, positive = rightward drift

---

## 🏆 Leaderboard

- Top 10 scores are saved automatically to **localStorage** in your browser
- Scores persist across page refreshes
- Each entry shows the score and the date it was set
- Leaderboard key: `qb_toss_scores_v1`

---

## ⚙️ Physics Details

| Factor | Value |
|--------|-------|
| Gravity | 9.8 × 0.07 per frame |
| Max drag distance | 220px |
| Ball speed (normal) | (power/220 × 10.5) + 5.5 px/frame |
| Wind effect | wind × 0.02 added to horizontal velocity per frame |
| Ball out of bounds | Resets ball, combo drops to 0 |

---

## 🗂️ File Structure

```
qb-target-toss/
├── index.html    # Full HTML document with layout
├── style.css     # Dark stadium theme, HUD pills, modal overlay
├── script.js     # Game loop, physics, combo system, leaderboard
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. No installation or internet connection required — all graphics are Canvas-drawn
4. Sound uses the Web Audio API — toggle with the **Sound** checkbox in Settings

---

## 🛠️ Tech Stack

- **HTML5 Canvas** — QB, football, targets, aim line, field yard lines
- **Vanilla JavaScript** — drag-to-throw input, arc physics, combo multiplier, level system
- **Web Audio API** — procedural beep sounds for throws, hits, and level-ups
- **localStorage** — persistent top-10 leaderboard

---

## 💡 Tips

- Aim for the **bullseye** consistently — 150 base pts vs 90 adds up fast with combo multipliers
- Let your combo build before going for risky shots — a ×2.5 multiplier turns 150 into 375 pts
- Watch the **Wind** indicator before every throw — at higher levels it drifts significantly
- On Hard, targets are small and time is short — aim for bullseyes only and don't miss

---

*Aim true. Build the combo. Beat your best. 🏈🎯*
