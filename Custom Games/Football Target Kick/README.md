# 🏈 Football Target Kick

> Drag and release to kick the football — hit the moving target for points!

---

## 🏈 About

Football Target Kick is a browser-based physics game where you aim and kick a football at a moving target. Wind affects every kick, the target speeds up as you score, and you only get 10 kicks — make them count!

---

## 🕹️ Controls

| Action | Input |
|--------|-------|
| Aim | Click and drag from the ball |
| Kick | Release the drag |
| Reset | Click **Reset Game** button |

Drag away from the target to pull back, release to kick in that direction — like a slingshot.

---

## 🎯 How to Play

1. Click and drag from the football to set your aim and power
2. Release to kick — the ball launches with gravity and wind applied
3. Hit the moving target to score points
4. Wind changes every kick — check the HUD before aiming
5. You have **10 kicks** total — highest score wins!

---

## 🎯 Scoring (Target Rings)

| Ring | Colour | Points |
|------|--------|--------|
| Outer ring | 🔴 Red | 5 pts |
| Middle ring | 🟡 Yellow | 15 pts |
| Bullseye | 🟢 Green | 30 pts |

The target moves left and right — every time you score, it speeds up slightly.

---

## ⚙️ Physics Details

| Factor | Value |
|--------|-------|
| Gravity | 0.38 px/frame² |
| Wind range | −0.18 to +0.18 (applied per frame to horizontal velocity) |
| Max kick power | 180px drag → ~28.8 launch speed |
| Power scaling | drag distance × 0.16 |
| Ball misses | Ground hit or out of bounds |

- Positive wind pushes the ball right, negative pushes left
- Wind is shown in the HUD and resets after every kick
- A power bar appears while aiming to show how hard you're about to kick

---

## 📊 HUD

| Display | Description |
|---------|-------------|
| **Score** | Total points earned this game |
| **Kicks Left** | Remaining kicks (starts at 10) |
| **Wind** | Current wind strength (positive = rightward) |

---

## 🗂️ File Structure

```
football-target-kick/
├── index.html    # Game HTML (body content)
├── style.css     # Dark stadium theme, HUD, canvas styling
├── script.js     # Physics, drag-to-kick input, target movement, scoring
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. No installation or internet connection required — all graphics are Canvas-drawn

---

## 🛠️ Tech Stack

- **HTML5 Canvas** — field, goal post, football, target rings, aim line, power bar
- **Vanilla JavaScript** — drag-to-kick input, parabolic physics, wind system, collision detection
- **CSS3** — dark radial gradient stadium background, HUD pill layout

---

## 💡 Tips

- Watch the **Wind** value carefully — even small wind adds up over a long flight
- Aim for the **green bullseye** (30 pts) — 10 perfect kicks = 300 points maximum
- The target moves faster after each hit — leading it slightly helps on later kicks
- Short kicks waste shots — use a full drag for better control and distance
- The power bar maxes out at 180px drag — you don't need to drag further than that

---

*10 kicks. Wind in your face. Hit the bullseye. 🏈🎯*
