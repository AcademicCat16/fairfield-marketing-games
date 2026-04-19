# 🌊 Abyssal Invasion

> Defend the deep — shoot torpedoes at sea creatures invading the abyss!

---

## 🐠 About

Abyssal Invasion is a browser-based vertical shoot-em-up with an underwater theme. You pilot a submarine at the bottom of the screen, firing torpedoes at waves of ocean enemies descending from above. Survive 2 levels to win!

---

## 🕹️ Controls

| Key | Action |
|-----|--------|
| `←` Arrow Left | Move submarine left |
| `→` Arrow Right | Move submarine right |
| `Space` | Fire torpedoes |
| `Space` | Start / restart game |

---

## 🎯 How to Play

1. Press **Space** on the title screen to begin
2. Move left and right to dodge enemies and their missiles
3. Hold **Space** to fire torpedoes at incoming enemies
4. Clear all enemies in Level 1 to advance to Level 2
5. Clear Level 2 to win!
6. Lose all 3 lives and it's game over

---

## 👾 Enemy Types

| Enemy | Symbol | Health | Points | Behaviour |
|-------|--------|--------|--------|-----------|
| Shark | 🦈 | 10 | 100 | Straight down, fires 1 missile |
| Jellyfish | 🪼 | 10 | 100 | Sine wave horizontal, fires 1 missile |
| Blowfish | 🐡 | 20 | 150 | Fast wiggle, fires 2 missiles |
| Mine | 💣 | 10 | 80 | Circular floating path, no missiles |
| Octopus | 🐙 | 30 | 200 | Wide sine wave, fires 2 missiles |

---

## ⚙️ Game Details

| Stat | Value |
|------|-------|
| Canvas size | 480 × 600px |
| Lives | 3 |
| Levels | 2 |
| Torpedo speed | 550 px/s |
| Enemy missile speed | 200 px/s |
| Player speed | 220 px/s |
| Invincibility after hit | 2 seconds (player blinks) |
| Enemy movement | Parametric sine equations (A + B·sin(C·t + D)) |

---

## 🗂️ File Structure

```
abyssal-invasion/
├── index.html    # Body-only HTML — canvas, HUD, inline styles
├── style.css     # Placeholder (all styles inline in HTML)
├── script.js     # Full game engine — stars, player, enemies, bullets, explosions
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. No installation or internet connection required — all graphics are emoji + Canvas

---

## 🛠️ Tech Stack

- **HTML5 Canvas 2D** — all rendering: submarine, enemies, torpedoes, explosions, starfield
- **Vanilla JavaScript** — full game loop, parametric enemy movement, collision detection, level system
- **Emoji** — enemy sprites rendered as font characters on canvas

---

## 💡 Tips

- Fire two torpedoes per shot — aim just ahead of moving enemies
- Mines float in circular patterns — wait for them to come to you
- Octopuses have 30 health and fire 2 missiles — prioritise them
- After taking a hit you have 2 seconds of invincibility — use it to reposition
- Level 2 has double the enemy density — hug the edges to dodge missile swarms

---

*Dive deep. Fire true. Defend the abyss. 🌊🚢*
