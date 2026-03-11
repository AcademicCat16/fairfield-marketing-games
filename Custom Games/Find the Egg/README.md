# 🥚 Find the Egg!

> Watch the hats shuffle — then pick the one hiding the egg!

---

## 🎩 About

Find the Egg is a browser-based shell game. An egg is shown under one of three hats, then hidden while the hats shuffle around. Track the right hat and click it to win!

---

## 🕹️ How to Play

1. Click **Start Game** to begin
2. Watch carefully — the egg appears briefly under one hat
3. The hats shuffle around 10 times
4. Click the hat you think is hiding the egg
5. The correct hat is revealed — see if you got it right!
6. Click **Start Game** again to play another round

---

## ⚙️ Game Details

| Stat | Value |
|------|-------|
| Number of hats | 3 |
| Egg shown for | 2 seconds before hiding |
| Shuffle count | 10 swaps |
| Shuffle speed | One swap every 600ms |
| Total shuffle time | ~6 seconds |

- The egg position is tracked correctly through every swap
- You can't click hats while shuffling is in progress
- After guessing, the correct hat is always revealed regardless of whether you were right or wrong

---

## 🗂️ File Structure

```
find-the-egg/
├── index.html    # Game HTML (body content)
├── style.css     # Hat shapes, egg, dark background, animations
├── script.js     # Shuffle logic, egg tracking, guess checking
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. No installation or internet connection required

---

## 🛠️ Tech Stack

- **HTML/CSS** — hat and egg shapes drawn entirely with CSS (no images)
- **CSS transitions** — smooth left-position sliding for hat movement
- **Vanilla JavaScript** — shuffle logic, position tracking, win/lose detection

---

## 💡 Tips

- Focus on one hat the whole time rather than trying to follow the egg directly
- The shuffle speed is fixed — it doesn't get faster, so every round is equally fair
- If you miss the egg reveal, just start a new game

---

*Eyes on the hat. Don't blink. 🥚🎩*
