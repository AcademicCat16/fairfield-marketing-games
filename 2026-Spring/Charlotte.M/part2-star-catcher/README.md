# ⭐ Star Catcher

> Click the stars before they disappear — catch as many as you can in 30 seconds!

---

## ⭐ About

Star Catcher is a fast-paced browser-based clicking game set against a deep space background. Stars appear randomly on a dark board and vanish after 1.5 seconds — click them before they disappear to score points. You have 30 seconds to catch as many as you can!

---

## 🕹️ How to Play

1. Click **Start Game** to begin the 30-second countdown
2. Stars appear randomly on the board every 800ms
3. Click a star to catch it and earn **1 point**
4. Stars disappear on their own after **1.5 seconds** if not clicked
5. When time runs out, your final score is shown on screen
6. Click **Start Game** again to play another round

---

## ⚙️ Game Details

| Stat | Value |
|------|-------|
| Timer | 30 seconds |
| Star spawn rate | Every 800ms |
| Star lifespan | 1.5 seconds |
| Points per star | 1 |
| Board size | 400 × 400px |
| Star spawn area | Random within 360 × 360px |

---

## 🗂️ File Structure

```
star-catcher/
├── index.html    # Body-only HTML — score, timer, button, board
├── style.css     # Space gradient background, twinkling star pattern, board
├── script.js     # Star spawning, click detection, countdown, game-over display
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. No installation or internet connection required

---

## 🛠️ Tech Stack

- **HTML/CSS** — deep space gradient background, CSS radial-gradient star field overlay
- **Vanilla JavaScript** — interval-based star spawning, click detection, countdown timer, inline game-over message

---

## 💡 Tips

- Stars hover slightly on mouse-over but don't wait around — click fast!
- At 800ms spawn rate over 30 seconds, up to **37 stars** can appear — but each only lasts 1.5s so overlapping clicks matter
- Stars spawn anywhere in the board so stay ready to move across the whole area

---

*Click fast. Catch every star. Beat your high score. ⭐*
