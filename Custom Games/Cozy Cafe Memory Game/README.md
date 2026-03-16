# ☕ Cozy Café Memory

> Flip the cards and match the café treats — in as few moves as possible!

---

## ☕ About

Cozy Café Memory is a browser-based card matching game with a warm, cozy café aesthetic. Twelve cards are laid out face-down in a 4×3 grid — six pairs of café photos. Flip two cards at a time to find matching pairs. The game ends when all six pairs are matched!

---

## 🕹️ How to Play

1. The game starts automatically when the page loads
2. Click any card to flip it over and reveal a café image
3. Click a second card to try to find its match
4. If the two cards match — they stay face-up!
5. If they don't match — both cards flip back over after 1 second
6. Keep going until all 6 pairs are matched
7. A congratulations alert appears when the board is complete
8. Refresh the page to shuffle and play again

---

## 🖼️ Card Images

All 6 café images are loaded from Unsplash and include coffee, pastries, and café scenes. Cards are shuffled randomly each time the page loads — no two games are the same.

---

## ⚙️ Game Details

| Stat | Value |
|------|-------|
| Grid size | 4 × 3 (12 cards) |
| Pairs to match | 6 |
| Flip-back delay | 1 second on mismatch |
| Card flip animation | CSS 3D rotateY (0.5s transition) |
| Move counter | Increments on every second card flip |
| Win condition | All 6 pairs matched |

---

## 🗂️ File Structure

```
cozy-cafe-memory/
├── index.html    # Body-only HTML — board container and move counter
├── style.css     # Card flip animation, grid layout, cozy brown theme
├── script.js     # Card generation, shuffle, flip logic, match checking
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. An **internet connection** is required — all card images are loaded from Unsplash

---

## 🛠️ Tech Stack

- **HTML** — game board container and move counter display
- **CSS** — CSS 3D card flip with `preserve-3d` and `backface-visibility`, warm beige theme
- **Vanilla JavaScript** — dynamic card generation, Fisher-Yates-style shuffle, match detection, board lock during flip-back

---

## 💡 Tips

- Try to remember where each card was even after it flips back — the fewer moves the better!
- The board locks briefly after a mismatch so you can see both cards before they flip back
- Clicking the same card twice does nothing — you must pick two different cards

---

*Sip, flip, match. Beat it in under 12 moves! ☕🧁*
