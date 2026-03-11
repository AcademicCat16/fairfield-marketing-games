# 🎮 Sing Your Path — Magical Platform Game

> Spawn platforms with your voice keys and reach the golden goal!

---

## 🌌 About

Sing Your Path is a browser-based platformer where instead of finding platforms, you **create them**. Press color keys to summon glowing platforms beneath you, jump across the gaps, and reach the golden exit before your platforms fade away.

---

## 🕹️ How to Play

### Movement
| Key | Action |
|-----|--------|
| `←` Arrow Left | Move left |
| `→` Arrow Right | Move right |
| `Space` | Jump (must be on a platform) |

### Spawning Platforms
| Key | Platform Color |
|-----|---------------|
| `R` | 🔴 Red platform |
| `G` | 🟢 Green platform |
| `B` | 🔵 Blue platform |

Platforms spawn **ahead of you** and fade away after ~3 seconds — plan your path carefully!

---

## 🎯 Goal

Reach the **golden glowing square** on the right side of the screen to complete the level.

Each level the goal moves to a new random height, making it progressively more challenging to reach.

---

## ⚙️ Game Rules

- You start on a permanent grey platform on the left
- Spawned platforms have a **limited lifespan** — they fade and disappear
- Falling off the bottom of the screen **resets your position** (no lives lost)
- There is no fail state — just keep trying!

---

## 🗂️ File Structure

```
sing-your-path/
├── index.html    # Game HTML (body content)
├── style.css     # Styling and layout
├── script.js     # Game logic and canvas rendering
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Download or clone the files into a folder
2. Open `index.html` in any modern browser
3. No installation or internet connection required

---

## 🛠️ Tech Stack

- **HTML5 Canvas** — all game rendering
- **Vanilla JavaScript** — game loop, physics, collision detection
- **CSS3** — centered layout, glow effects

---

## 💡 Tips

- Spawn a platform **just before you jump** so it's in position when you land
- Red, green, and blue platforms are identical in behavior — color is purely visual
- The starting grey platform is permanent and safe to return to
- If you're stuck, fall off and respawn — it costs nothing

---

*Made with ✨ — jump, spawn, and sing your way to the exit*
