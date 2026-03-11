# 🐷 Barnyard Blitz

> You are the Pig. Dodge mud, weave through fences, and race to the barn first!

---

## 🏁 About

Barnyard Blitz is a browser-based top-down racing game set on a barnyard obstacle course. You control the Pig and race against the Cow and Duck AI opponents across a 960×540 field. Mud slows you down, fences block your path, and hay bales bump your speed — first to the finish line wins!

---

## 🕹️ Controls

| Key | Action |
|-----|--------|
| `↑` / `W` | Move up |
| `↓` / `S` | Move down |
| `←` / `A` | Move left |
| `→` / `D` | Move right |
| **Start** button | Begin the race |
| **Reset** button | Reset all positions |

Diagonal movement is supported — hold two direction keys at once.

---

## 🎯 How to Play

1. Click **Start** to begin the race
2. Move the Pig (🐷) with arrow keys or WASD
3. Avoid obstacles or push through them carefully
4. Reach the white finish line on the right side first to win
5. If an AI opponent crosses first, they win — click **Reset** to try again

---

## 🐄 Racers

| Racer | Emoji | Base Speed | Controlled by |
|-------|-------|-----------|---------------|
| Pig | 🐷 | 180 px/s | You (player) |
| Cow | 🐮 | 155 px/s | AI |
| Duck | 🦆 | 165 px/s | AI |

The Pig is the fastest — but obstacles can slow you enough for the AI to overtake!

---

## 🚧 Obstacles

| Type | Colour | Effect |
|------|--------|--------|
| 🟫 **Mud** | Brown | Speed reduced to **40%** |
| 🟤 **Fence** | Dark brown | Speed reduced to **20%**, pushes racer back |
| 🟡 **Hay** | Yellow | Speed reduced to **70%** |

Collision is calculated using AABB vs circle — you're affected the moment your racer overlaps an obstacle.

---

## 🤖 AI Behaviour

Both Cow and Duck move forward at a constant pace with a gentle sine-wave vertical drift to simulate wandering. They are affected by the same obstacle collision and speed penalties as the player.

---

## 🗂️ File Structure

```
barnyard-blitz/
├── index.html    # Game HTML (body content)
├── style.css     # Dark panel theme, legend pills, canvas styling
├── script.js     # Game loop, obstacle collision, AI movement, win detection
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. No installation or internet connection required — all graphics use emoji and Canvas fills

---

## 🛠️ Tech Stack

- **HTML5 Canvas** — field, obstacles, racer emoji, finish line
- **Vanilla JavaScript** — delta-time game loop, AABB vs circle collision, AI sine drift
- **CSS** — dark panel layout, legend colour pills

---

## 💡 Tips

- The Pig's 180 px/s speed gives you a big advantage — don't waste it in mud
- Fences push you back as well as slowing you — don't run straight into them
- The AI drifts vertically but always moves forward — cut a clean path to stay ahead
- Diagonal movement covers ground faster — use it to navigate around obstacle corners

---

*Oink your way to the finish. Don't get muddy. 🐷🏁*
