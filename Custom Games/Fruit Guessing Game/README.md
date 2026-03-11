# 🍎 Fruit Guessing Game 🍍

> Look at the fruit photo and guess what it is!

---

## 🍊 About

Fruit Guessing Game is a simple browser-based guessing game. A photo of a fruit appears on screen — pick the correct name from four buttons to score a point. Wrong guesses show the correct answer before moving on.

---

## 🕹️ How to Play

1. Open the page — a fruit image appears immediately
2. Click the button matching the fruit you see
3. ✅ Correct — score goes up and the next fruit loads
4. ❌ Wrong — the correct answer is shown, then the next fruit loads after 1.5 seconds
5. The game continues indefinitely — try to get the highest score you can!

---

## 🍉 Fruits in the Game

| Fruit | Button |
|-------|--------|
| 🍎 Apple | Apple |
| 🍌 Banana | Banana |
| 🍊 Orange | Orange |
| 🍍 Pineapple | Pineapple |

Fruits are selected randomly each round — the same fruit can appear multiple times in a row.

---

## ⚙️ Game Details

| Stat | Value |
|------|-------|
| Number of fruits | 4 |
| Points per correct answer | 1 |
| Delay before next fruit | 1.5 seconds |
| Wrong answer | Shows correct fruit name, no score deduction |
| Score reset | On page refresh only |

---

## 🗂️ File Structure

```
fruit-guessing-game/
├── index.html    # Game HTML (body content)
├── style.css     # Peach gradient background, button styling
├── script.js     # Fruit data, random selection, answer checking
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. An **internet connection** is needed to load the fruit images from GitHub

---

## 🛠️ Tech Stack

- **HTML** — image display, 2×2 button grid
- **CSS** — peach gradient background, rounded card layout
- **Vanilla JavaScript** — random fruit selection, answer validation, score tracking
- **External images** — fruit photos hosted on GitHub

---

## 💡 Tips

- There are only 4 fruits, so if you're unsure, you have a 25% chance of guessing right
- Wrong answers don't deduct points — guess freely!
- Refresh the page to reset your score and start fresh

---

*Look. Guess. Score. 🍎🍌🍊🍍*
