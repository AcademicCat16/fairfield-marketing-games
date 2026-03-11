# 🎓 Campus Cozy Quest Match

> Flip cards, match campus items, and complete your cozy study quest!

---

## 📚 About

Campus Cozy Quest Match is a browser-based memory card matching game with a cozy college aesthetic. Flip cards to find matching pairs of campus-themed emoji, race against the timer, and complete a randomly assigned quest before the board is clear.

---

## 🕹️ How to Play

1. Choose a board size to start your quest
2. Click any card to flip it and reveal the emoji
3. Click a second card — if both match, they stay face-up ✅
4. If they don't match, both flip back after a short delay
5. Match all pairs to complete the quest!

---

## 📐 Board Sizes

| Size | Cards | Pairs |
|------|-------|-------|
| 3 × 4 | 12 | 6 |
| 4 × 4 | 16 | 8 |
| 4 × 5 | 20 | 10 |
| 5 × 6 | 30 | 15 |

---

## 📊 Stats

| Stat | Description |
|------|-------------|
| **Time** | Elapsed time since the board started (mm:ss) |
| **Moves** | Total pairs of cards attempted (matched + mismatched) |
| **Quest** | Randomly assigned quest name for the current round |

---

## 🗺️ Quests

A random quest is assigned each game — purely for flavour:

- ☕ **Coffee Run** — Match all pairs to fuel your study day
- 📖 **Library Helper** — Match all pairs to return books
- 📝 **Note Passing** — Match pairs to help a classmate
- 🔑 **Lost & Found** — Match pairs to return keycards

---

## 🎒 Card Emoji Set

18 campus-themed emoji are used as card faces (shuffled each game):

📚 🎒 ✏️ 📝 ☕ 🧋 🎧 💻 🖊️ 📖 🗒️ 🔖 📐 📌 🖇️ 🗃️ ⏰ 🎓

---

## 🗂️ File Structure

```
campus-cozy-quest-match/
├── index.html    # Game HTML (body content)
├── style.css     # Dark campus theme, 3D card flip, overlay panels
├── script.js     # Board generation, flip logic, timer, quest system
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. No installation or internet connection required

---

## 🛠️ Tech Stack

- **HTML Table** — card grid layout
- **CSS3** — 3D card flip via `transform-style: preserve-3d`, dark radial gradient background
- **Vanilla JavaScript** — board generation, match detection, timer, quest assignment

---

## 💡 Tips

- Mismatched cards stay visible for **850ms** — use that window to memorise both positions
- Matched cards count toward moves just like mismatches — fewer moves is better
- The emoji pool is shuffled before each game, so the same emojis appear in different positions every round
- Try the **5 × 6** board for the biggest challenge — 15 pairs to find!

---

*Study hard. Match fast. Complete the quest. 🎓✨*
