# 🌸 Garden Pollen Collector

> Guide your gardener through the garden, collect pollen, and avoid the frost!

---

## 🌿 About

Garden Pollen Collector is a browser-based top-down arcade game. You control a little gardener roaming a garden, collecting golden pollen while dodging icy frost patches. Collect enough pollen to level up — but watch out, each new level adds more frost!

---

## 🕹️ Controls

| Key | Action |
|-----|--------|
| `↑` Arrow Up | Move up |
| `↓` Arrow Down | Move down |
| `←` Arrow Left | Move left |
| `→` Arrow Right | Move right |

Press any arrow key to start the game.

---

## 🎯 How to Play

1. Press any **arrow key** to start
2. Move the gardener (green square) to collect **golden pollen circles** 🟡
3. Avoid the **frost patches** (light blue squares) ❄️
4. Every **10 pollen** collected increases the Garden Level and adds a new frost patch
5. Hitting a frost patch resets your position and costs **2 pollen**

---

## 📊 Scoring

| Event | Effect |
|-------|--------|
| Collect a pollen | +1 score |
| Hit a frost patch | −2 score (min 0), position reset |
| Every 10 pollen | +1 Garden Level, +1 new frost patch |

---

## ⚙️ Game Details

- Garden starts with **5 pollen** and **2 frost patches**
- Pollen respawns in a random location after collection
- Frost patches are **stationary** — they don't move
- Score cannot go below **0**
- There is no game over — just keep gardening!

---

## 🗂️ File Structure

```
garden-pollen-collector/
├── index.html    # Game HTML (body content)
├── style.css     # Dark background, wood border, canvas styling
├── script.js     # Game loop, movement, collision, scoring
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. No installation or internet connection required

---

## 🛠️ Tech Stack

- **HTML5 Canvas** — all game rendering
- **Vanilla JavaScript** — game loop, AABB collision detection, input handling
- **CSS3** — centered layout, wood-style border, dark background

---

## 💡 Tips

- Pollen respawns randomly — sometimes it appears right next to a frost patch, so approach carefully
- As the level rises, frost patches accumulate fast — plan your route
- If your score drops from frost hits, focus on a safe cluster of pollen to recover

---

*Collect every pollen. Dodge every frost. Happy gardening! 🌻*
