# 💖 Pink Ping Pong 💖

> A cute pink twist on the classic arcade game — you vs. the AI!

---

## 🎮 About

Pink Ping Pong is a browser-based Pong game with a pastel pink aesthetic. Play as the right paddle against an AI-controlled left paddle. First to let the ball past loses a point — rally as long as you can!

---

## 🕹️ Controls

| Key | Action |
|-----|--------|
| `↑` Arrow Up | Move your paddle up |
| `↓` Arrow Down | Move your paddle down |

You control the **right paddle**. The left paddle is controlled by the AI.

---

## 🤖 AI Opponent

The left paddle automatically tracks the ball's vertical position, moving up or down at a fixed speed of **4px per frame**. It's beatable — react faster than it can track!

---

## ⚙️ Game Details

- Ball starts in the centre and reverses horizontal direction on each reset
- Ball speeds up is **not** implemented — speed stays constant throughout
- Scoring: a point is awarded whenever the ball passes a paddle and exits the screen
- No win condition — the game runs continuously, scores accumulate indefinitely

| Stat | Value |
|------|-------|
| Ball speed | 5px horizontal, 4px vertical |
| Paddle speed (player) | 7px per frame |
| Paddle speed (AI) | 4px per frame |
| Ball radius | 12px |
| Paddle size | 15 × 100px |

---

## 🗂️ File Structure

This game is designed as three separate files or can be combined into one HTML file.

```
pink-ping-pong/
├── index.html    # Game HTML (body content)
├── style.css     # Pink gradient background, canvas border styling
├── script.js     # Game loop, ball physics, paddle movement, scoring
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. No installation or internet connection required

---

## 🛠️ Tech Stack

- **HTML5 Canvas** — all game rendering (paddles, ball, net, scores)
- **Vanilla JavaScript** — game loop, collision detection, AI logic
- **CSS3** — pink gradient background, rounded canvas with glow border

---

## 💡 Tips

- The AI moves at 4px/frame — the ball moves at 5px/frame horizontally, so angling your shots can outpace it
- Hit the ball near the edge of your paddle to get a slightly different bounce angle
- There's no speed increase, so long rallies are totally possible!

---

*Serve it pink. Rally in style. 💖*
