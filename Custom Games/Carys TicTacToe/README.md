# 🌸 Tic Tac Toe — Carys Edition

> A dreamy, sparkly take on Tic Tac Toe with glowing tokens, confetti wins, and soft pastel magic.

---

## 🌸 About

Carys Edition is a two-player Tic Tac Toe game reimagined with a luxe pastel aesthetic. Floating sparkles, an animated mesh gradient background, glowing X and O tokens, a live score tracker, and a 55-piece confetti explosion on every win make this anything but a boring game of noughts and crosses.

---

## 🕹️ How to Play

1. Player X goes first — click any cell to place your token
2. Players alternate turns until someone gets three in a row
3. Win by connecting three tokens horizontally, vertically, or diagonally
4. A gradient line animates across the winning row on victory
5. Click **↺ New Game** to reset the board — scores carry over between rounds

---

## ✨ Visual Features

| Feature | Description |
|---------|-------------|
| 🌈 Mesh gradient background | Animated rose-to-lilac radial gradient that slowly hue-shifts |
| ✦ Floating sparkles | 28 pastel particles drift upward continuously |
| 💗 X token | Two glowing pink bars crossing with a neon rose shadow |
| 💜 O token | Gradient purple ring using CSS border-box technique with lilac glow |
| 🎊 Confetti explosion | 55 rose and purple pieces rain down on every win |
| ➰ Win line | SVG line animates itself across the three winning cells |
| 🫧 Cell hover | Soft pink radial bloom appears under the cursor |
| 🎯 Token pop-in | Spring bounce animation when a token is placed |
| 🏆 Win pulse | Winning tokens do a celebratory spin-scale animation |

---

## 📊 Score Tracker

- Both players' scores are displayed above the board
- Scores persist across rounds — only reset on full page refresh
- The winning player's score pops with a scale animation on update
- Status pill changes border glow colour to match whose turn it is

---

## ⚙️ Game Details

| Stat | Value |
|------|-------|
| Players | 2 (local, same device) |
| Grid | 3 × 3 |
| Win conditions | 8 (3 rows, 3 columns, 2 diagonals) |
| Score reset | Page refresh only |
| Token animation | Spring cubic-bezier pop-in |
| Confetti pieces | 55 per win |

---

## 🗂️ File Structure

This game is fully self-contained — body-only HTML with inline `<style>` and `<script>`. No separate files needed.

```
carys-tictactoe/
├── index.html    # Body-only: style, HTML structure, and script in one file
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Paste the file contents into your platform's HTML body field, or open as a standalone `.html` file
2. An **internet connection** is needed to load Google Fonts (Playfair Display + DM Sans)
3. If offline the game falls back to system fonts — all gameplay works without internet

---

## 🛠️ Tech Stack

- **CSS3** — animated mesh gradient, sparkle particles, CRT-free pastel theme, SVG win line
- **HTML5 SVG** — gradient win line that draws itself across winning cells
- **Vanilla JavaScript** — game logic, score tracking, confetti system, win detection

---

## 💡 Tips

- Scores carry over between rounds — play a best-of-5 series!
- The centre cell (index 4) controls the most win conditions — take it early
- The gradient win line always draws from the first to last cell in the winning trio

---

*Three in a row. Sparkles everywhere. Carys wins. 🌸✨*
