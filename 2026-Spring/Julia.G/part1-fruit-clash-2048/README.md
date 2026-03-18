# 🍒 Fruit Clash 2048

> Slide and merge fruits to reach the coconut — a fruity twist on 2048!

---

## 🍉 About

Fruit Clash 2048 is a browser-based puzzle game based on the classic 2048 mechanic. Instead of numbers, each tile is a fruit emoji. Slide tiles to merge matching fruits into rarer ones, building up through the fruit ladder until you reach the legendary 🥥 Coconut tile!

---

## 🕹️ Controls

| Key | Action |
|-----|--------|
| `←` Arrow Left | Slide all tiles left |
| `→` Arrow Right | Slide all tiles right |
| `↑` Arrow Up | Slide all tiles up |
| `↓` Arrow Down | Slide all tiles down |
| **Restart** button | Reset the board and score |

---

## 🎯 How to Play

1. The board starts with two random fruit tiles
2. Use arrow keys to slide all tiles in a direction
3. Two matching fruits that collide **merge into the next fruit**
4. Each merge adds points to your score
5. A new tile spawns after every move
6. Reach **🥥 Coconut (2048)** to win!
7. The game ends when no moves are possible

---

## 🍓 Fruit Ladder

| Value | Fruit |
|-------|-------|
| 2 | 🍒 Cherry |
| 4 | 🍓 Strawberry |
| 8 | 🍊 Orange |
| 16 | 🍎 Apple |
| 32 | 🍍 Pineapple |
| 64 | 🥭 Mango |
| 128 | 🍉 Watermelon |
| 256 | 🍇 Grapes |
| 512 | 🥝 Kiwi |
| 1024 | 🍌 Banana |
| 2048 | 🥥 Coconut |

---

## ⚙️ Game Details

| Stat | Value |
|------|-------|
| Grid size | 4 × 4 (16 tiles) |
| Starting tiles | 2 |
| New tile value | Always 2 (🍒) |
| Score | Accumulates on every merge |
| Win condition | Reach 🥥 Coconut (2048) |

---

## 🗂️ File Structure

```
fruit-clash-2048/
├── index.html    # Body-only HTML — board, score display, restart button
├── style.css     # Purple gradient theme, tile styling, hover effects
├── script.js     # Grid logic, slide/merge, keyboard input, fruit mapping
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. No installation or internet connection required

---

## 🛠️ Tech Stack

- **HTML/CSS** — 4×4 CSS Grid layout, purple gradient tile theme
- **Vanilla JavaScript** — row/column slide logic, merge detection, random tile spawning

---

## 💡 Tips

- Build your highest-value tile into a corner and work around it
- Never move away from your corner direction unnecessarily — it breaks your chain
- Two 🍒 Cherries → 🍓 Strawberry, two 🍓 Strawberries → 🍊 Orange, and so on
- Plan 2–3 moves ahead — the board fills up fast!

---

*Merge the fruits. Climb the ladder. Reach the Coconut. 🥥*
