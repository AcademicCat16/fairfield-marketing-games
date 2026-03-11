# 🍇 Purple Fruit Squish 🍓

> Click the fruits before they disappear — squish 50 to win!

---

## 🍑 About

Purple Fruit Squish is a fast-paced browser-based clicking game. Fruits pop up all over a glowing purple board — click them before they vanish! Squish 50 fruits within 30 seconds to win.

---

## 🕹️ How to Play

1. The game starts automatically when the page loads
2. Click any fruit emoji as fast as you can to squish it
3. Reach **50 squishes** before time runs out to win
4. If the timer hits 0 first, it's game over
5. Click **Play Again** to restart at any time

---

## 🍒 Fruits in the Game

🍓 Strawberry · 🍇 Grapes · 🍑 Peach · 🍒 Cherries · 🍎 Apple · 🫐 Blueberries

Fruits are chosen randomly — all six appear with equal probability.

---

## ⚙️ Game Details

| Stat | Value |
|------|-------|
| Goal | 50 squishes |
| Timer | 30 seconds |
| Spawn rate | 1 fruit every 500ms |
| Fruit lifespan | 2 seconds before auto-removing |
| Win condition | Score reaches 50 |
| Lose condition | Timer reaches 0 before 50 squishes |

Fruits disappear on their own after 2 seconds if not clicked — don't hesitate!

---

## 🗂️ File Structure

```
purple-fruit-squish/
├── index.html    # Game HTML (body content)
├── style.css     # Purple gradient theme, fruit hover scale animation
├── script.js     # Fruit spawning, click detection, timer, win/lose logic
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. No installation or internet connection required — all fruits are emoji

---

## 🛠️ Tech Stack

- **HTML/CSS** — purple gradient board, fruit hover animation, overlay screen
- **Vanilla JavaScript** — interval-based spawning, click handling, countdown timer

---

## 💡 Tips

- At 1 fruit every 500ms over 30 seconds, up to **60 fruits** can spawn total — you need to click 50 of them, so don't miss many!
- Fruits that pile up in one spot are easy multi-clicks — focus on clusters
- A fruit only lasts 2 seconds — prioritise newly appeared ones over ones about to vanish

---

*Click fast. Squish everything. Win in purple. 🍇💜*
