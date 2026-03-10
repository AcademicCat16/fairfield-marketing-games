# 🌿 Cozy Garden Pickup

A cozy top-down game where you play as a dachshund collecting flowers and returning them to a basket.

---

## How to Set Up in CodePen

1. Paste **HTML** into the **HTML** panel
2. Paste **CSS** into the **CSS** panel
3. Paste **JS** into the **JS** panel
4. No external libraries needed — works out of the box!

> ⚙️ If you see a null error, go to the JS panel gear icon → **"No wrap - bottom of body"**

---

## How to Play

- Move the dachshund around the garden using **WASD** or **Arrow Keys**
- Hold **Shift** to move faster
- **Collect 5 flowers** scattered around the map (small pink blooms)
- Once you have all 5, **return to the basket** (glowing yellow square in the bottom-right corner)
- Avoid the **pond** (blue area) — you can't walk through it
- **Fences** also block your path — navigate around them

---

## Win Condition

Collect all 5 flowers → walk to the basket → see the win banner 🌸

The HUD at the top tracks your progress:
- **FLOWERS** — how many you've picked up out of 5
- **STATUS** — tells you what to do next (exploring → collecting → return to basket → done ✅)

---

## Dog Image

The dachshund sprite is loaded from a GitHub URL. If it doesn't appear:
- The game still works — it falls back to a plain rectangle
- The student can replace the `DOG_URL` at the top of the JS with any hosted image URL
- The sprite **flips horizontally** when moving left, so a side-view image works best

---

## Bugs Fixed from Original

| Problem | Fix |
|---|---|
| Dog image URL split across two lines | Joined into a single string |
| CSS color variables had invalid hex values (`#bbb22`) | Replaced with valid `rgba()` values |
| Two `ctx.fillText()` strings split across lines | Joined onto single lines (JS strings can't have literal line breaks) |

---

## Key Concepts Used

- **Canvas 2D API** — everything is drawn with `ctx.fillRect`, `ctx.drawImage`, etc.
- **Collision detection** — `rectsOverlap()` checks if two rectangles overlap
- **Image loading** — `new Image()` with `onload` / `onerror` handlers
- **Sprite flipping** — `ctx.scale(-1, 1)` mirrors the dog when moving left
- **Keyboard input** — `Set` tracks which keys are currently held down
- **requestAnimationFrame** — smooth game loop that runs every frame
- **CSS custom properties** — `--bg1`, `--text`, `--muted` etc. control the dark theme
