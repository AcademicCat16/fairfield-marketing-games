# ☕ Cozy Cafe Runner

> Collect 10 coffees before the spills get you!

---

## 🎮 About

Cozy Cafe Runner is a browser-based top-down arcade game. You play as a cafe worker dashing around the floor collecting coffee cups while dodging moving coffee spills. All graphics are drawn with inline SVG — no external assets needed.

---

## 🕹️ Controls

| Key | Action |
|-----|--------|
| `W` / `↑` | Move up |
| `S` / `↓` | Move down |
| `A` / `←` | Move left |
| `D` / `→` | Move right |
| `Space` | Start game |
| `R` | Restart |

---

## 🎯 How to Play

1. Press **Space** to start
2. Move around the canvas to collect ☕ coffee cups
3. Avoid the brown spills — each hit costs a life
4. Collect **10 coffees** to win
5. Run out of lives and it's game over — press **R** to try again

---

## ⚙️ Game Rules

- You start with **3 lives**
- Spills move continuously across the canvas and wrap around the edges
- Each coffee collected spawns a new one — there are always targets on screen
- Every ~35% chance, collecting a coffee also spawns an extra spill
- Getting hit by a spill resets your position to the center

---

## 🏆 Win & Lose Conditions

| Condition | Result |
|-----------|--------|
| Collect 10 coffees | ✅ You win! |
| Lives reach 0 | ❌ Game over |

---

## 🗂️ File Structure

```
cozy-cafe-runner/
├── index.html    # Game HTML (body content)
├── style.css     # Dark background, HUD, canvas styling
├── script.js     # Game loop, collision, SVG sprite generation
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. No internet connection required — all graphics are inline SVG

---

## 🛠️ Tech Stack

- **HTML5 Canvas** — game rendering
- **Inline SVG** — all sprites (player, coffee, spill, background) generated as data URIs
- **Vanilla JavaScript** — game loop, collision detection, input handling
- **CSS3** — centered layout, dark theme

---

## 💡 Tips

- Move diagonally to cover ground faster — speed is normalized so diagonals aren't slower
- Spills wrap around screen edges, so don't assume the edges are safe
- After collecting several coffees, more spills appear — stay alert!

---

*Stay cozy, dodge the mess, and collect every cup ☕*
