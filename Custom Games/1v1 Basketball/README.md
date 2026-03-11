# 🏀 1v1 Basketball

> Two players, one court, first to 11 wins!

---

## 🏀 About

1v1 Basketball is a browser-based two-player basketball game. Both players share the same keyboard — move around the court, pick up the ball, and shoot it into the opponent's hoop. First to score 11 points wins!

---

## 🕹️ Controls

### Player 1 (left side)
| Key | Action |
|-----|--------|
| `W` | Move up |
| `S` | Move down |
| `A` | Move left |
| `D` | Move right |
| `F` | Shoot (when holding the ball) |

### Player 2 (right side)
| Key | Action |
|-----|--------|
| `↑` Arrow Up | Move up |
| `↓` Arrow Down | Move down |
| `←` Arrow Left | Move left |
| `→` Arrow Right | Move right |
| `L` | Shoot (when holding the ball) |

---

## 🎯 How to Play

1. The ball starts in the centre of the court
2. Walk into the ball to pick it up
3. Press your shoot key to launch the ball toward the opponent's hoop
4. Score by landing the ball in the hoop on the **opposite side** of the court
5. The ball resets to centre after each shot attempt
6. First player to reach **11 points** wins!

---

## ⚙️ Game Details

| Stat | Value |
|------|-------|
| Points per basket | 2 |
| Win condition | First to 11 points |
| Player speed | 4px per frame |
| Ball launch speed | 9px horizontal, −9px vertical |
| Ball gravity | 0.35px/frame² |

- Players can **block shots** — if the ball hits the opposing player mid-flight, it resets
- The ball resets if it falls off the bottom of the court
- Both players can move simultaneously since they use different keys

---

## 🗂️ File Structure

```
1v1-basketball/
├── index.html    # Game HTML (body content)
├── style.css     # Court, hoops, scoreboard, player sprites
├── script.js     # Movement, shooting physics, collision, scoring
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. An **internet connection** is needed to load the player headshot images

---

## 🛠️ Tech Stack

- **HTML/CSS** — court markings, paint areas, hoops, scoreboard (all CSS shapes)
- **Vanilla JavaScript** — game loop, two-player movement, parabolic ball physics, collision detection
- **External images** — player sprites from NBA/proballers CDN

---

## 💡 Tips

- Get close to your hoop before shooting — the ball has a fixed arc
- You can body-block your opponent's shot by moving into the ball's path
- There's no dribbling — pick up the ball and shoot immediately for best results
- Both players can move at the same time, so defense matters!

---

*Pick it up. Shoot it in. First to 11. 🏀*
