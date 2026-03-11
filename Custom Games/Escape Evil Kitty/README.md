# 🐱 Escape Evil Kitty!

> Run from the evil kitty and reach the golden exit before it catches you!

---

## 🐾 About

Escape Evil Kitty is a browser-based chase game drawn entirely with Canvas 2D. You play as a friendly white kitty trying to escape a red-eyed evil kitty that relentlessly chases you across a dark forest. Reach the golden exit portal on the right wall to win — or get caught and lose!

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

1. The game starts immediately — move right away!
2. Avoid the evil kitty chasing you from the right side
3. Reach the **golden portal** on the right wall to escape and win
4. If the evil kitty gets within 50px of you, it's game over
5. Click **Play Again** to restart

---

## ⚙️ Game Details

| Stat | Value |
|------|-------|
| Canvas size | 800 × 500px |
| Player speed | 7 px/frame |
| Evil kitty speed | 2.8 px/frame |
| Catch distance | 50px |
| Exit portal | Right wall, 50×140px, at y: 180 |
| Timer | Counts up — tracks how long you survive |

The evil kitty always moves directly toward your position using angle-based chase logic — it never gives up!

---

## 🏆 Win / Lose Conditions

| Outcome | Condition |
|---------|-----------|
| 🩷 **YOU ESCAPED EVIL KITTY!** | Player reaches the golden exit portal |
| 🔴 **CAUGHT BY EVIL KITTY!** | Evil kitty closes within 50px of player |

---

## 🎨 Characters

Both characters are drawn entirely with Canvas 2D — no images needed.

| Character | Appearance |
|-----------|------------|
| 🐱 Friendly Kitty (you) | White body, black eyes, pink bow |
| 😈 Evil Kitty (chaser) | Dark grey body, red glowing eyes, red glow shadow |

---

## 🗂️ File Structure

```
escape-evil-kitty/
├── index.html    # Game HTML (body content)
├── style.css     # Dark forest background, overlay, button styling
├── script.js     # Canvas drawing, chase AI, collision, win/lose logic
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. No installation or internet connection required — all graphics are Canvas-drawn

---

## 🛠️ Tech Stack

- **HTML5 Canvas** — both kitty characters drawn with arcs, ellipses, and fills
- **Vanilla JavaScript** — angle-based chase AI, collision detection, survival timer
- **CSS** — dark forest gradient, game over overlay

---

## 💡 Tips

- You move at 7 px/frame vs the evil kitty's 2.8 — you're faster, so use it!
- The evil kitty always chases your current position — lure it away then cut back toward the exit
- The exit portal is tall (140px) so you don't need to be perfectly aligned — just get your right edge past it
- Moving diagonally covers more ground — hold two arrow keys to get to the portal faster

---

*Run. Dodge. Escape. Don't get caught. 🐱💨*
