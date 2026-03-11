# 🐾 Mini Maple Bone Catcher

> Help Maple the dog catch falling bones before they hit the ground!

---

## 🐶 About

Mini Maple Bone Catcher is a cute browser-based arcade game starring Maple — a adorable doodle dog. Bones fall from the top of the screen and your job is to move Maple left and right to catch them. Miss too many and it's game over!

---

## 🕹️ Controls

| Key | Action |
|-----|--------|
| `←` Arrow Left | Move Maple left |
| `→` Arrow Right | Move Maple right |
| Click **Start Game** | Begin |
| Click **Play Again** | Restart after game over |

---

## 🎯 How to Play

1. Click **Start Game** on the title screen
2. Move Maple with the arrow keys to catch falling 🦴 bones
3. Each bone caught adds **1 point**
4. Missing a bone costs **1 life** — you start with 3
5. Catching a bone triggers a ✨ sparkle effect
6. Lose all 3 lives and the game ends

---

## 🏆 Scoring

| Event | Effect |
|-------|--------|
| Catch a bone | +1 score |
| Miss a bone | -1 life |
| Score beats high score | High score updates |

Your high score is saved for the session and shown on the game over screen.

---

## 🗂️ File Structure

```
mini-maple-bone-catcher/
├── index.html      # Game HTML (body content)
├── style.css       # Pink theme, game area, overlays, animations
├── script.js       # Game loop, bone spawning, collision detection
└── README.md       # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. An internet connection is needed to load Maple's image from postimg

---

## 🛠️ Tech Stack

- **HTML/CSS** — layout, pink pastel theme, overlay screens
- **Vanilla JavaScript** — bone spawning, falling animation, collision detection, score tracking
- **External image** — Maple's doodle sprite hosted on postimg.cc

---

## 💡 Notes

- Bones spawn every **1 second** at a random horizontal position
- Bone fall speed is fixed at **6px per frame** (~20ms intervals)
- Maple moves **45px** per arrow key press
- High score resets on page refresh (no local storage)

---

*Catch every bone for Maple! 🦴🐾*
