# 🩰 Ballerina Match

A Candy Crush–style match-3 game where scoring points unlocks new ballet dance animations.

---

## How to Set Up in CodePen

1. Paste **`ballerina_html.html`** into the **HTML** panel
2. Paste **`ballerina.css`** into the **CSS** panel
3. Paste **`ballerina.js`** into the **JS** panel
4. No external libraries needed — works out of the box!

> ⚙️ If you see a `null` error, go to the JS panel gear icon → **"No wrap - bottom of body"**

---

## How to Play

- The board is an **8×8 grid** of colored tiles (white, pink, red, black)
- **Click** one tile, then **click** an adjacent tile to swap them
- If the swap creates **3 or more tiles in a row** (horizontal or vertical), they clear and new tiles fall in
- Chains can happen automatically — keep watching!
- On mobile, you can **swipe** a tile in any direction to swap

---

## Scoring

| Match Size | Points |
|---|---|
| 3 tiles | 30 pts |
| 4 tiles | 60 pts |
| 5 tiles | 110 pts |
| 6+ tiles | 110 + 25 per extra tile |

You have **30 moves** per game.

---

## Dance Step Unlocks

| Score Needed | Dance Step Unlocked |
|---|---|
| Free | Plié |
| 200 | Pirouette 🩰 |
| 500 | Arabesque 🌀 |
| 900 | Jeté ✨ |

Once unlocked, click a dance button (or press a keyboard shortcut) to animate the ballerina!

**Keyboard shortcuts:** `1` Plié · `2` Pirouette · `3` Arabesque · `4` Jeté

---

## Fixing the Ballerina Image

The dancer image uses a base64-encoded JPEG. If the image appears grey/cut off, it means the base64 data was truncated when pasting. To fix it:

1. Upload any ballerina image to [imgur.com](https://imgur.com)
2. In the HTML panel, find the `<img id="dancer" ...>` tag
3. Replace the `src="data:image/jpeg;base64,..."` with your image URL:
```
src="https://i.imgur.com/YOURIMAGE.jpg"
```

---

## Key Concepts Used

- **DOM manipulation** — tiles are dynamically created with `createElement`
- **2D arrays** — the board is stored as a grid of objects
- **Async/await + setTimeout** — used to animate matches and collapses
- **CSS animations** — dance moves use `@keyframes` (plie, spin, arabesque, jump)
- **Touch events** — swipe support via `touchstart` / `touchend`
- **CSS custom properties** — `--cell`, `--gap`, `--pink`, etc. control layout and palette
