
# 🌸 Flower Garden Hunt

> Collect all the glowing flowers, dodge the weeds, and reach the gate before time runs out!

---

## 🌻 About

Flower Garden Hunt is a browser-based top-down collection game set in a lush garden. You control a glowing sun orb, collecting all 8 flowers scattered around the field while avoiding weeds. Once every flower is collected, race to the gate in the bottom-right corner to win — all within 20 seconds!

---

## 🕹️ Controls

| Key | Action |
|-----|--------|
| `↑` Arrow Up | Move up |
| `↓` Arrow Down | Move down |
| `←` Arrow Left | Move left |
| `→` Arrow Right | Move right |
| **Start Game** button | Begin the countdown |
| **Restart Game** button | Reset and try again |

---

## 🎯 How to Play

1. Click **Start Game** to begin the 20-second countdown
2. Move around the garden with the arrow keys
3. Walk over every **glowing flower** 🌸🌺🌼 to collect it — you need all 8
4. Avoid the **weeds** 🌿🍃 — touching one ends the game immediately
5. Once all 8 flowers are collected, a message tells you to head to the gate
6. Move your player onto the **🚪 gate** in the bottom-right corner to win
7. If time runs out, press **Restart Game** to try again with a new layout

---

## ⚙️ Game Details

| Stat | Value |
|------|-------|
| Game area | 700 × 500px |
| Flowers to collect | 8 |
| Weeds to avoid | 6 |
| Time limit | 20 seconds |
| Player move speed | 18px per key press |
| Player start | Top-left corner |
| Finish gate | Bottom-right corner |

Flowers and weeds are placed randomly every round — no two games look the same. Weeds always spawn at least 70px away from the player start and all flowers so you're never trapped right away.

---

## 🌺 Flowers & Weeds

Flowers are randomly chosen each round from: 🌸 🌺 🌼 🌻 💐 🌷

Weeds are randomly chosen each round from: 🌿 🪴 🍃 🌱

---

## 🏆 Win & Lose Conditions

| Outcome | Condition |
|---------|-----------|
| 🌻 **You win!** | All 8 flowers collected AND player reaches the 🚪 gate |
| 🌿 **Weed hit** | Player touches any weed — round ends immediately |
| ⏰ **Time's up** | Timer reaches 0 before all flowers are collected |

After losing, press **Restart Game** to reset — flowers and weeds respawn in new random positions.

---

## 🗂️ File Structure

```
flower-garden-hunt/
├── index.html    # Body-only HTML — game layout and structure
├── style.css     # Garden theme, flower glow animation, player styling
├── script.js     # Movement, emoji rendering, collision detection, timer
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all three files in the same folder
2. Open `index.html` in any modern browser
3. An **internet connection** is needed to load the Pacifico font from Google Fonts
4. All gameplay works offline — only the font changes

---

## 🛠️ Tech Stack

- **HTML/CSS** — garden background, flower glow pulse animation, layout
- **Vanilla JavaScript** — keyboard movement, emoji placement, AABB collision detection, random layout generation, countdown timer
- **Google Fonts** — Pacifico (cursive display font)

---

## 💡 Tips

- You must collect **all 8 flowers first** — going to the gate early does nothing
- Flowers pulse and glow so they're easy to spot — scan the whole field before you start moving
- Weeds are slightly larger than flowers (36px vs 28px) — give them extra space
- 20 seconds is tight — plan a rough path across the field before pressing Start
- Each restart randomises everything, so a tricky layout only lasts one round

---

*Collect every flower. Dodge every weed. Race to the gate. 🌸🏃*
