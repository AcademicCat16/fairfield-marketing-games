# 🏆 Sports Memory Match

> Flip the cards and find matching sports emoji — in as few moves as possible!

---

## 🏅 About

Sports Memory Match is a browser-based card-flip memory game with a dark sports stadium aesthetic. 16 cards are laid out face-down — 8 pairs of sports emoji. Flip two cards at a time to find matching pairs. The game tracks your moves, matches, and time. Clear all 8 pairs to win!

---

## 🕹️ How to Play

1. Click any card to flip it and reveal a sports emoji
2. Click a second card to find its match
3. Matching pairs stay face-up and turn green ✅
4. Non-matching pairs flip back face-down after 750ms
5. Match all **8 pairs** to win — your moves and time are shown in the win screen
6. Click **New Game** to shuffle and restart at any time

---

## 🏀 Sports Emoji Pairs

⚽ ⚽ &nbsp; 🏀 🏀 &nbsp; 🎾 🎾 &nbsp; 🏈 🏈 &nbsp; ⚾ ⚾ &nbsp; 🏐 🏐 &nbsp; 🎱 🎱 &nbsp; 🏓 🏓

---

## ⚙️ Game Details

| Stat | Value |
|------|-------|
| Grid | 4 × 4 (16 cards, 8 pairs) |
| Flip-back delay | 750ms on mismatch |
| Timer | Starts on first card flip |
| Move counter | +1 per pair of flips |
| Win condition | All 8 pairs matched |
| Card backs | Dark gradient with green glow on match |

---

## 🗂️ File Structure

```
sports-memory-match/
├── index.html    # Body-only HTML — inline styles, grid, stats, win banner
├── style.css     # Placeholder (all styles inline in HTML)
├── script.js     # Shuffle, flip logic, match detection, timer, win screen
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. No installation or internet connection required

---

## 🛠️ Tech Stack

- **HTML/CSS** — dark navy gradient, CSS 3D card flip with `preserve-3d`, green match glow
- **Vanilla JavaScript** — Fisher-Yates shuffle, flip/lock logic, interval timer, win detection

---

## 💡 Tips

- The timer only starts when you flip your first card — take a moment to plan
- Try to remember where each emoji was even after it flips back
- A perfect game is 8 moves (every pair found on the first try) — can you do it?

---

*Flip. Match. Win. Set a new personal best. 🏆*
