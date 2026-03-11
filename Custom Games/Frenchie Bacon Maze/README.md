# 🐶 Frenchie Bacon Maze

> Guide the Frenchie through 5 increasingly tricky mazes to collect all the bacon!

---

## 🥓 About

Frenchie Bacon Maze is a browser-based top-down maze game. You navigate a French Bulldog 🐶 through hand-crafted maze levels, finding the path to the bacon 🥓 at the end. Each level is larger and more complex than the last.

---

## 🕹️ Controls

| Key | Action |
|-----|--------|
| `W` / `↑` | Move up |
| `S` / `↓` | Move down |
| `A` / `←` | Move left |
| `D` / `→` | Move right |
| **Restart Level** button | Reset current level (moves reset to 0) |
| **Reset Game** button | Return to Level 1 |

---

## 🎯 How to Play

1. Move the dog 🐶 through the maze using WASD or arrow keys
2. Reach the bacon 🥓 to complete the level and advance
3. Complete all 5 levels to win
4. Try to finish each level in as few moves as possible

---

## 🗺️ Levels

| Level | Grid Size | Description |
|-------|-----------|-------------|
| 1 | 10 × 10 | A simple warm-up maze |
| 2 | 12 × 12 | Longer corridors, more turns |
| 3 | 15 × 15 | A winding spiral path |
| 4 | 18 × 12 | Wide layout with branching paths |
| 5 | 21 × 17 | A deep nested maze — the hardest |

---

## 📊 HUD

| Display | Description |
|---------|-------------|
| **Level** | Current level out of 5 |
| **Moves** | Number of steps taken this level |

Moves reset when restarting or advancing to the next level.

---

## 🗂️ File Structure

```
frenchie-bacon-maze/
├── index.html    # Game HTML (body content)
├── style.css     # Grid layout, wall/floor/cell styling
├── script.js     # Level data, movement logic, rendering
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. No installation or internet connection required — all assets are emoji

---

## 🛠️ Tech Stack

- **HTML/CSS Grid** — maze board rendered as a CSS grid of div cells
- **Vanilla JavaScript** — level loading, movement, collision detection, win condition
- All graphics are **emoji** — no external images needed

---

## 💡 Tips

- Walls are dark, floors are light — plan your route before moving
- The bacon is always highlighted with a dashed gold border so you can spot the goal
- If you get stuck, hit **Restart Level** — it won't cost you your overall progress
- Level 5 has a deeply nested spiral — hug one wall and follow it all the way around

---

*Find the bacon. Every time. 🥓🐶*
