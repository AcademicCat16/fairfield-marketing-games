# 👾 NEON CHOMP — Cyberpunk Pac-Man

> Collect all the dots. Dodge the glowing ghosts. Don't get caught.

---

## 🌐 About

NEON CHOMP is a cyberpunk-themed Pac-Man remake built entirely in a single HTML file. It takes the classic Pac-Man formula and reimagines it with neon-glow walls, animated ghosts with tracking pupils, particle burst effects, CRT scanlines, and a pulsing arcade UI — all rendered with HTML5 Canvas and pure CSS.

---

## 🕹️ Controls

| Key | Action |
|-----|--------|
| `W` / `↑` | Move up |
| `S` / `↓` | Move down |
| `A` / `←` | Move left |
| `D` / `→` | Move right |
| **Click** | Start game |
| **↺ Play Again** | Restart after game over |

---

## 🎯 How to Play

1. Click anywhere on the screen to begin
2. Move NEON CHOMP through the maze with WASD or arrow keys
3. Collect every pink dot to clear the stage
4. Avoid the three glowing ghosts — getting touched ends the game
5. Clear all dots to win — get caught and it's game over

---

## ⚙️ Game Details

| Stat | Value |
|------|-------|
| Canvas size | 380 × 220px (19×11 tile grid) |
| Tile size | 20×20px |
| Points per dot | 10 |
| Ghosts | 3 (Pink, Magenta, Cyan) |
| Ghost AI | 75% chance to chase player, 25% random move |
| Pacman update rate | Every 2 frames (200ms) |
| Ghost update rate | Every 4 frames (400ms) — slightly slower |
| Frame interval | 100ms |

---

## ✨ Visual Features

| Feature | Description |
|---------|-------------|
| 🔵 Neon walls | Glowing cyan edges on exposed wall faces only — inner wall faces stay dark |
| 🩷 Pulsing dots | Pink dots breathe with a sine-wave opacity animation |
| 👾 Animated ghosts | Sine-wave vertical wobble, wavy skirt bottoms, tracking pupils |
| 💙 Chomping player | Mouth opens and closes, rotates to face movement direction, radial glow aura |
| ✨ Particle bursts | Dots explode into pink particles on collect; ghosts trigger red flash on catch |
| 🟢 Win explosion | Green particle burst on stage clear |
| 📺 CRT scanlines | CSS repeating gradient overlay for retro arcade feel |
| 🌐 Grid background | Faint animated cyan grid behind the entire UI |

---

## 👻 Ghosts

| Ghost | Color | Start Position |
|-------|-------|---------------|
| Ghost 1 | 🔴 Hot Pink | Bottom-left (1, 9) |
| Ghost 2 | 🩷 Soft Pink | Bottom-right (17, 9) |
| Ghost 3 | 🩵 Cyan | Center (9, 7) |

All three ghosts have pupils that actively rotate toward Pac-Man's position each frame. Ghost eyes track you even when they can't reach you.

---

## 🗂️ File Structure

This game is fully self-contained in a **single HTML file** — no separate CSS or JS files needed.

```
neon-chomp/
├── neon-chomp.html    # Everything: styles, canvas game, and script in one file
└── README.md          # You are here
```

---

## 🖥️ How to Run

1. Open `neon-chomp.html` in any modern browser
2. An **internet connection** is needed to load the Google Fonts (Orbitron + Share Tech Mono)
3. If offline, the game falls back to system fonts — all gameplay works without internet

---

## 🛠️ Tech Stack

- **HTML5 Canvas 2D** — maze, player, ghosts, dots, particles, flash effects
- **Vanilla JavaScript** — game loop, ghost AI, particle system, collision detection
- **CSS3** — cyberpunk dark theme, CRT scanline overlay, animated grid background, neon glow text
- **Google Fonts** — Orbitron (display) + Share Tech Mono (body)

---

## 💡 Tips

- Ghosts are 75% likely to move toward you — they're not perfect, use that 25% randomness to slip past
- Ghosts move half as often as you (every 4 frames vs every 2) — you're faster, use it
- Plan a route through the maze before moving — getting cornered by two ghosts is usually fatal
- The center corridor is a high-risk zone — all three ghosts pass through it

---

*Chomp fast. Glow bright. Don't get caught. 👾💙*
