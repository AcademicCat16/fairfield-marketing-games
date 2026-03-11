# 🏓 Cup Pong (Bounce Shot)

> Drag, aim, release — bounce the ball into the cup!

---

## 🎮 About

Cup Pong is a browser-based physics game where you drag from the ball to aim and shoot. The twist: the ball **must bounce off the table at least once** before it can score. No direct shots allowed — it has to be a true bounce shot.

---

## 🕹️ How to Play

1. **Click and drag** from the white ball to set your aim and power
2. **Release** to shoot — the ball launches in the direction of your pull
3. The ball must **bounce off the table** before entering the cup
4. Land it in the cup to score ✅
5. Hit **Reset** to try again, or **Random Cup** to move the cup to a new position

---

## 🖱️ Controls

| Action | Input |
|--------|-------|
| Aim | Click and drag from the ball |
| Shoot | Release the drag |
| Reset ball | Click **Reset** button |
| Move cup randomly | Click **Random Cup** button |

---

## ⚙️ Physics & Rules

- **Gravity** pulls the ball down at 1400 px/s²
- **Bounce restitution** on the table is 62% (ball loses ~38% vertical speed per bounce)
- **Friction** slows horizontal speed slightly on each table bounce
- **Air drag** applies mild resistance mid-flight
- A shot only scores if:
  - The ball has bounced on the table **at least once**
  - The ball enters the cup **from above** (descending)
  - The ball lands within the **cup opening radius**
- The ball stops and resets as failed if it slows below a speed threshold on the table

---

## 📊 Power Indicator

While dragging, a **Power** value is shown near the ball (0–520). The actual launch speed is capped at **1050 px/s** regardless of drag distance.

---

## 🗂️ File Structure

```
cup-pong/
├── index.html    # Game HTML (body content)
├── style.css     # Dark UI, fixed canvas, panel styling
├── script.js     # Physics engine, input, drawing, scoring
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. No installation or internet connection required

---

## 🛠️ Tech Stack

- **HTML5 Canvas** — all game rendering (ball, cup, table, aim line)
- **Vanilla JavaScript** — physics loop, drag-to-shoot input, collision detection
- **CSS3** — dark radial gradient background, frosted glass UI panel

---

## 💡 Tips

- Pull further back for more power — short pulls make weak shots
- Aim slightly above the cup to account for the arc of the ball
- The cup glows green when you score
- Use **Random Cup** to practice different angles and distances

---

*Bounce it in. One shot. Make it count. 🏓*
