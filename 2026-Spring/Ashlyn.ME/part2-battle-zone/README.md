# ⚔️ Battle Zone

A top-down battle royale–style mini game. Survive the shrinking storm, eliminate enemies, and collect loot before time runs out!

---

## How to Set Up in CodePen

1. Paste **HTML** into the **HTML** panel
2. Paste **CSS** into the **CSS** panel
3. Paste **JS** into the **JS** panel
4. No external libraries needed — all visuals are drawn with canvas shapes!

> No ⚙️ setting needed — the game only starts when the Start button is clicked.

### Optional: Custom Background Images
At the top of the JS, paste your CodePen Asset URLs:
```js
const MENU_BG_URL = "your-menu-image-url-here";
const GAME_BG_URL = "your-game-image-url-here";
```
Leave them blank to use the built-in gradient/grid fallback — the game works fine either way.

---

## How to Play

| Input | Action |
|---|---|
| W / A / S / D or Arrow Keys | Move |
| Mouse | Aim |
| Left Click or Space | Shoot |
| P | Pause / Resume |

**Goal:** Eliminate **15 enemies** before your HP hits zero or the storm closes in.

---

## Game Elements

| Element | Description |
|---|---|
| 🔵 Blue circle (you) | Your player — the arrow points in your aim direction |
| 🔴 Red circles | Enemies — they chase and damage you on contact |
| 🟢 Cyan dot (+) | Health loot — restores 25 HP |
| 🔵 Blue dot (A) | Ammo loot — restores 15 rounds |
| 🟣 Purple ring | Storm boundary — stay inside or take damage |

---

## Stats (HUD)

| Stat | What it tracks |
|---|---|
| HP | Your health (max 100) — enemies deal 15/sec on contact, storm deals 10/sec |
| Ammo | Rounds remaining (max 90, starts at 30) |
| Elims | Enemies eliminated — reach 15 to win |
| Time | How long you've survived |

---

## Winning & Losing

- ✅ **Win:** Eliminate 15 enemies
- ❌ **Lose:** HP drops to 0 (from enemy contact or storm damage)

---

## Storm System

- A purple ring shrinks over 3 minutes from radius **1400** down to **320**
- If you wander outside the ring, you take **10 damage per second**
- A warning message appears on screen when you're outside the safe zone

---

## Loot System

- Loot drops every **10 seconds** — 4 items spawn around the player
- Walk over loot to collect it automatically
- 50% chance of health pack, 50% chance of ammo pack

---

## Enemy AI

- Enemies spawn off-screen every **2.5 seconds** (max 12 alive at once)
- Each enemy moves directly toward the player
- Speed varies slightly per enemy (+0–40 px/sec randomness)
- Each enemy has **50 HP** and takes **25 damage** per bullet (2 shots to kill)

---

## Scoring / Progression

There is no persistent score — the win condition is reaching **15 eliminations** in a single run. The timer tracks how fast you achieved it.

---

## Key Concepts Used

- **Canvas 2D rendering** — all game elements drawn with `ctx` shape methods (no image files required)
- **Delta time game loop** — `requestAnimationFrame` with `dt` for smooth, frame-rate-independent movement
- **Camera system** — the world (3000×2000) is larger than the screen; the camera smoothly follows the player
- **DPR scaling** — canvas resolution adapts to device pixel ratio for sharp rendering on retina screens
- **Circle collision detection** — `Math.hypot` distance checks between all game entities
- **Particle effects** — small burst particles on hits, kills, and loot pickups
- **State machine** — game switches between `menu`, `playing`, `paused`, and `over` states
- **Safe zone / storm** — shrinking circle calculated from elapsed time with out-of-bounds damage
