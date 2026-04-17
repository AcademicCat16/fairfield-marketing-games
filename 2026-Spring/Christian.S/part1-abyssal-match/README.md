# 🌊 Abyssal Match

> Flip the ocean tiles and match the sea creatures in the deep blue!

---

## 🐙 About

Abyssal Match is a browser-based memory card game with a deep ocean theme. Flip tiles to reveal sea creatures hidden beneath the waves — find matching pairs to collect bubbles and explore the whole abyss. Match all 8 pairs to win!

---

## 🕹️ How to Play

1. Click **Dive In** to start the game
2. Click any tile to flip it and reveal a sea creature
3. Click a second tile to find its match
4. Matching pairs stay face-up and glow gold ✨
5. Non-matching pairs flip back after a short pause
6. Match all **8 pairs** to win!
7. Click **Restart Dive** to shuffle and play again

---

## 🐠 Sea Creatures

| Emoji | Creature |
|-------|----------|
| 🐠 | Clownfish |
| 🦈 | Shark |
| 🐢 | Turtle |
| 🐳 | Whale |
| 🐙 | Octopus |
| 🦀 | Crab |
| 🐡 | Blowfish |
| 🦑 | Squid |

---

## ⚙️ Game Details

| Stat | Value |
|------|-------|
| Grid | 4 × 4 (16 tiles, 8 pairs) |
| Points per match | +10 |
| Points per mismatch | −2 (min 0) |
| Flip-back delay | 900ms on mismatch |
| Win condition | All 8 pairs matched |
| Tile backs | 🌊 Wave emoji |

---

## 🔧 What Was Fixed

The original code had several issues that were rebuilt from scratch:

- **JS was incomplete** — only `buildArray()` existed with no flip logic, match detection, score tracking, or win condition
- **Broken image URLs** — `source.unsplash.com/featured/` is deprecated and returns errors; replaced with emoji so no internet needed
- **Missing back image** — `images/back.jpg` referenced a local file that didn't exist; replaced with a 🌊 wave tile
- **Bootstrap classes with no Bootstrap** — `btn-info`, `btn-lg`, `btn-block` had no effect without the library loaded; replaced with custom CSS
- **No game state** — added flip tracking, match detection, score system, and win screen

---

## 🗂️ File Structure

```
abyssal-match/
├── index.html    # Body-only HTML — board, score, message, start button
├── style.css     # Deep ocean gradient, 3D card flip animation, tile styling
├── script.js     # Shuffle, flip logic, match detection, scoring, win condition
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. No installation or internet connection required — all graphics are emoji

---

## 🛠️ Tech Stack

- **HTML/CSS** — deep ocean dark theme, CSS 3D card flip with `preserve-3d`
- **Vanilla JavaScript** — Fisher-Yates shuffle, click handling, match detection, score tracking

---

## 💡 Tips

- Mismatches cost 2 points — pay attention to every tile you flip
- The board reshuffles completely on every restart
- Matched tiles glow gold so you can clearly see your progress
- Try to win with a perfect score of 80 (8 matches × 10, zero mismatches)!

---

*Dive deep. Match them all. Explore the abyss. 🌊*
