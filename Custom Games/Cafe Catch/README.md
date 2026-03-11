# ☕ Cafe Catch

> Move the coffee around the grid and catch as many food items as you can in 30 seconds!

---

## ☕ About

Cafe Catch is a browser-based arcade game played on an 8×8 grid. You control a coffee cup and chase down food items that appear at random positions. Catch as many as you can before time runs out!

---

## 🕹️ Controls

| Key | Action |
|-----|--------|
| `↑` Arrow Up | Move up |
| `↓` Arrow Down | Move down |
| `←` Arrow Left | Move left |
| `→` Arrow Right | Move right |
| **Start Game** button | Begin |

---

## 🎯 How to Play

1. Click **Start Game** to begin the 30-second countdown
2. Move the coffee ☕ with the arrow keys
3. Land on the same tile as the food item to collect it
4. Each catch scores **1 point** and spawns a new food item at a random location
5. When time runs out, your final score is shown

---

## ⚙️ Game Details

| Stat | Value |
|------|-------|
| Grid size | 8 × 8 (64 tiles) |
| Timer | 30 seconds |
| Points per catch | 1 |
| Food spawn | Random tile on every catch |
| Player start | Top-left corner (0, 0) |
| Food start | Position (5, 5) |

---

## 🗂️ File Structure

```
cafe-catch/
├── index.html    # Game HTML (body content)
├── style.css     # Grid layout, player and food tile styles
├── script.js     # Grid rendering, movement, collision, timer
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. An **internet connection** is needed to load the coffee and food images from GitHub

---

## 🛠️ Tech Stack

- **CSS Grid** — 8×8 tile board layout
- **Vanilla JavaScript** — keyboard input, tile rendering, score and timer logic
- **External images** — coffee and food sprites hosted on GitHub

---

## 💡 Tips

- Food spawns completely at random — it can appear anywhere including right next to you
- Move efficiently in straight lines rather than zigzagging
- There's no speed increase, so every second counts equally — stay focused!

---

*Move fast. Catch everything. Beat your score. ☕🍰*
