# 🏀 Mini Basketball Game

> Charge your shot, aim with arrow keys, and swish it through the hoop!

---

## 🏀 About

Mini Basketball is a browser-based physics basketball game. Hold Space to charge your shot power, aim with the arrow keys, and release to launch the ball toward the hoop. The ball bounces off the floor, walls, and backboard — bank shots are possible!

---

## 🕹️ Controls

| Key | Action |
|-----|--------|
| Hold `Space` | Charge shot power |
| Release `Space` | Shoot |
| `←` Arrow Left | Aim left (rotate angle) |
| `→` Arrow Right | Aim right (rotate angle) |

---

## 🎯 How to Play

1. Use **← →** to rotate the aim arrow toward the hoop
2. Hold **Space** to charge — the bar below the ball fills up
3. Release **Space** to shoot — more charge = more power
4. Score by getting the ball through the hoop from above
5. Ball bounces off floor, walls, and backboard — use them!
6. Ball resets automatically after each shot

---

## ⚙️ Game Details

| Stat | Value |
|------|-------|
| Canvas size | 600 × 400px |
| Ball radius | 13px |
| Min shot power | 8 px/frame |
| Max shot power | 22 px/frame (full charge) |
| Charge time | 1.5 seconds for full charge |
| Gravity | 18 px/s² |
| Floor bounce | 45% energy retained |
| Backboard bounce | 70% energy retained |
| High score | Tracked in browser session |

---

## 🗂️ File Structure

```
mini-basketball/
├── index.html    # Body-only HTML — canvas, HUD, inline styles
├── style.css     # Placeholder (styles inline in HTML)
├── script.js     # Physics, aiming, charge system, scoring, rendering
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. No installation or internet connection required — all graphics are Canvas-drawn

---

## 🛠️ Tech Stack

- **HTML5 Canvas 2D** — ball with gradient and seams, hoop, net, backboard, court lines, trail
- **Vanilla JavaScript** — physics engine, charge mechanic, collision detection, score tracking

---

## 💡 Tips

- The charge bar turns red near full power — watch it carefully
- Full charge overshoots from close range — use medium power for accuracy
- The backboard is your friend — a slight bank shot from the left side is very reliable
- Aim the arrow slightly above the hoop to account for gravity drop
- Short taps (low charge) are useful for a high-arc lob over the rim

---

*Charge. Aim. Swish. 🏀*
