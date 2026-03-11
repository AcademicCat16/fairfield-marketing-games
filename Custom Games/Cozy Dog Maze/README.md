# 🐶 Cozy Dog Maze

> Guide your pup through the maze to reach the food bowl!

---

## 🥣 About

Cozy Dog Maze is a browser-based top-down maze game starring a cute French Bulldog. Navigate through green walls to reach the food bowl in the corner — and celebrate with confetti when you make it!

---

## 🕹️ Controls

| Key | Action |
|-----|--------|
| `↑` Arrow Up | Move up |
| `↓` Arrow Down | Move down |
| `←` Arrow Left | Move left |
| `→` Arrow Right | Move right |

---

## 🎯 How to Play

1. Open the page — the dog starts in the bottom-left corner
2. Use the arrow keys to navigate through the maze
3. Reach the 🥣 bowl in the top-right corner to win
4. Walls block your path — find the route around them
5. Confetti launches when you reach the bowl!

---

## ⚙️ Game Details

- Dog moves at **8px per step**
- Collision detection prevents passing through walls
- The game ends when the dog overlaps the bowl — no restart built in (refresh to play again)
- 80 confetti pieces rain down on the win screen

---

## 🗂️ File Structure

```
cozy-dog-maze/
├── index.html    # Game HTML (body content)
├── style.css     # Green maze world, wall styling, confetti animation
├── script.js     # Movement, wall collision, win detection, confetti
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. An **internet connection** is needed to load the dog image from pngtree.com

---

## 🛠️ Tech Stack

- **HTML/CSS** — maze layout using absolutely positioned wall divs
- **Vanilla JavaScript** — keyboard movement, AABB collision detection, win check
- **External image** — French Bulldog sprite from pngtree.com

---

## 💡 Tips

- The dog is 70px wide — gaps in the maze are just wide enough to squeeze through
- If you feel stuck, trace back to a junction and try a different direction
- Refresh the page to reset and play again

---

*Find the food. Every pup deserves dinner. 🐶🥣*
