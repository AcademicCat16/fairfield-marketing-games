# 💥 Asphalt Rush

A top-down arcade racing game. Dodge the oncoming red car as long as you can — one crash and it's over!

---

## How to Set Up in CodePen

1. Paste **HTML** into the **HTML** panel
2. Paste **CSS** into the **CSS** panel
3. Paste **JS** into the **JS** panel
4. No external libraries needed!

> No ⚙️ setting needed — the game starts immediately on page load.

---

## How to Play

| Key | Action |
|---|---|
| W / Arrow Up | Accelerate forward |
| S / Arrow Down | Brake / reverse |
| A / Arrow Left | Steer left |
| D / Arrow Right | Steer right |

- Avoid the **red AI car** coming down the road
- If you collide, you get a **CRASH!** alert and the cars reset
- Try to survive as long as possible!

---

## Game Features

- Top-down canvas road with animated center lane dashes that scroll with your speed
- Your **blue car** accelerates and decelerates with momentum (`speed *= 0.98` friction)
- The **red AI car** loops from top to bottom repeatedly, spawning at a random lane position each time
- Speed is capped between -2 (reverse) and 7 (full speed)
- Soft reset on crash — no full page reload

---

## Bug Fixed from Original

| Problem | Fix |
|---|---|
| Blank gray screen | Original used two local image files (`eb7922e8...png`, `c79a71a8...png`) that don't exist in CodePen — `startGame()` never ran because `imagesLoaded` never reached 2 |
| Fix applied | Replaced image-based cars with canvas-drawn shapes (body, roof, windshield, wheels, headlights) — no external files needed |
| `location.reload()` on crash | Replaced with a soft reset that repositions both cars without reloading the page |

---

## Key Concepts Used

- **Canvas drawing** — road, lane markings, and both cars are all drawn with `ctx` shape methods
- **Class inheritance** — `AICar extends Car`, overriding `update()` and `draw()` for different behavior
- **Keyboard input** — `keydown`/`keyup` events tracked in a `keys` object for smooth held-key movement
- **Momentum physics** — speed builds up with input and decays each frame via friction multiplier
- **AABB collision detection** — simple rectangle overlap check between player and AI car
- **requestAnimationFrame** — smooth 60fps game loop
