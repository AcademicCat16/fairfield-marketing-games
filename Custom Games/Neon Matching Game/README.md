# 🃏 Matching Game

> Flip two cards. Match all pairs to win.

---

## 🎮 About

Matching Game is a browser-based memory card game with a sleek dark UI. Flip cards to reveal emojis, remember their positions, and match all 12 pairs in as few moves as possible. Features a live move counter, timer, and smooth 3D card flip animations.

---

## 🕹️ How to Play

1. Click any card to flip it and reveal its emoji
2. Click a second card — if both emojis match, they stay face-up and turn green ✅
3. If they don't match, both cards flip back after a short delay
4. Find all **12 pairs** to win
5. Click **Restart** at any time to shuffle and start over

---

## 📊 Stats

| Stat | Description |
|------|-------------|
| **Moves** | Total pairs of cards flipped |
| **Time** | Elapsed time since first card flip |

The timer starts on your first flip and stops when you find the last pair.

---

## 🃏 Card Set

12 unique emoji pairs (24 cards total):

🍩 🎾 🧠 🌈 🍓 🚲 🎧 🐝 🧊 🌿 ✨ 🧃

Cards are shuffled randomly on every game.

---

## ♿ Accessibility

- Full keyboard navigation — all cards are focusable buttons
- `aria-pressed` state reflects flip status
- `aria-label` updates to show the emoji when a card is revealed
- Matched cards are disabled and removed from tab order
- Status message uses `aria-live` for screen reader announcements

---

## 🗂️ File Structure

```
matching-game/
├── index.html    # Game HTML (body content)
├── style.css     # Dark theme, 3D card flip, grid layout
├── script.js     # Card logic, timer, match detection, rendering
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. No installation or internet connection required

---

## 🛠️ Tech Stack

- **HTML5** — semantic structure with ARIA roles
- **CSS3** — 3D card flip via `transform-style: preserve-3d`, CSS grid, backdrop blur
- **Vanilla JavaScript** — deck shuffling, flip logic, match detection, timer

---

## 💡 Tips

- The grid is **4 columns** on small screens, **6 columns** on wider screens
- Non-matching cards flip back after **700ms** — use that moment to memorise both positions
- Your move count only goes up when you flip a second card, not the first

---

*Remember everything. Miss nothing. Match them all. 🧠*
