# 🐶 Dog Bone Dash

> Chase down as many bones as you can in 30 seconds!

---

## 🦴 About

Dog Bone Dash is a browser-based arcade game where you control a dog dashing around the canvas collecting bones before the timer runs out. Every bone collected scores a point — how many can you grab in 30 seconds?

---

## 🕹️ Controls

| Key | Action |
|-----|--------|
| `↑` Arrow Up | Move up |
| `↓` Arrow Down | Move down |
| `←` Arrow Left | Move left |
| `→` Arrow Right | Move right |
| `R` | Restart after game over |

---

## 🎯 How to Play

1. Open the page — the game starts immediately
2. Move the dog with the arrow keys to collect bones
3. Each bone collected scores **1 point** and spawns a new bone at a random location
4. You have **30 seconds** — collect as many as possible!
5. When time runs out, your final score is shown
6. Press **R** to play again

---

## ⚙️ Game Details

| Stat | Value |
|------|-------|
| Timer | 30 seconds |
| Dog speed | 5px per frame |
| Dog size | 40px radius |
| Bone size | 50px |
| Canvas size | 800 × 500px |
| Collision radius | dog size + bone size × 0.6 |

- Bones spawn randomly within the canvas on every collect
- The dog cannot move outside the canvas boundary
- All graphics are drawn with Canvas 2D — no images needed

---

## 🗂️ File Structure

```
dog-bone-dash/
├── index.html    # Game HTML (body content)
├── style.css     # Sky gradient background, canvas border
├── script.js     # Game loop, movement, collision, timer, rendering
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. No installation or internet connection required — all graphics are Canvas-drawn

---

## 🛠️ Tech Stack

- **HTML5 Canvas** — dog, bone, shadows, game over screen all drawn in canvas
- **Vanilla JavaScript** — game loop, keyboard input, collision detection, countdown timer
- **CSS** — sky-to-white gradient background

---

## 💡 Tips

- Bones always spawn within the playable area so no bone is ever unreachable
- Move diagonally by holding two arrow keys — speed is not normalized so diagonal movement is slightly faster
- As soon as you grab a bone, look ahead for where the next one spawns

---

*Run fast. Grab every bone. Beat your high score! 🐶🦴*
