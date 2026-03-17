# 🐦 Pinky Flap

> Tap to flap. Dodge the purple pipes. Beat your high score!

---

## 🐣 About

Pinky Flap is a browser-based Flappy Bird-style game featuring an adorable pink bird. Tap or press Space to flap your wings, weave through the purple pipe gaps, and see how far you can go. Your high score is tracked for the session — can you beat it?

---

## 🕹️ Controls

| Input | Action |
|-------|--------|
| `Click` / `Tap` | Flap wings / Start / Restart |
| `Space` | Flap wings / Start / Restart |

---

## 🎯 How to Play

1. Click or press **Space** to begin
2. Tap or press Space repeatedly to keep the bird airborne
3. Fly through the gaps between the purple pipes to score points
4. Each pipe pair cleared = **+1 point**
5. Hit a pipe or the ground — game over!
6. Your **High Score** is shown on the game over screen
7. Click or press Space to restart

---

## ⚙️ Game Details

| Stat | Value |
|------|-------|
| Canvas size | 320 × 480px |
| Gravity | 0.25 px/frame² |
| Flap lift | −4.6 velocity |
| Pipe speed | 2 px/frame |
| Pipe gap | 100px |
| Pipe spawn rate | Every 100 frames |
| Bird hit radius | 12px |
| High score | Session only (resets on page refresh) |

---

## 🐦 The Bird

Pinky is drawn entirely with Canvas 2D — no image files needed:
- 🩷 Pink ellipse body
- 💗 Hot pink wing
- 🟠 Orange triangle beak
- ⚫ Black dot eye
- Rotates to face the direction of travel based on velocity

---

## 🗂️ File Structure

```
pinky-flap/
├── index.html    # Body-only HTML — canvas element and Google Font link
├── style.css     # Sky blue background, centered canvas
├── script.js     # Bird physics, pipe spawning, collision, scoring, game loop
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. An **internet connection** is needed to load the Squada One font from Google Fonts
4. All gameplay works offline — only the font changes

---

## 🛠️ Tech Stack

- **HTML5 Canvas 2D** — bird, pipes, score text, all drawn in JS
- **Vanilla JavaScript** — physics engine, pipe generation, collision detection, state machine
- **Google Fonts** — Squada One (arcade display font)

---

## 💡 Tips

- Short quick taps keep the bird more stable than one big flap
- Pipes spawn every 100 frames — at 60fps that's roughly every 1.6 seconds
- The gap is always 100px — aim for the centre to give yourself the most margin
- The bird tilts based on velocity — when it tips downward, flap immediately

---

*Flap fast. Stay alive. Beat your best. 🩷*
