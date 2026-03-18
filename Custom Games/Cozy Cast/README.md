# 🎣 Cozy Cast

> Cast your line, catch fish, and fill your bucket before your energy runs out!

---

## 🐟 About

Cozy Cast is a browser-based fishing game with a relaxing sky-blue aesthetic. You have 10 energy — each cast uses one. Reel in small fish, big fish, or the occasional old boot, and try to reach 50 points before you run out of casts!

---

## 🕹️ How to Play

1. Click **Cast Line** to use 1 energy and fish
2. Wait 1.5 seconds for the result to appear
3. Collect points from your catch
4. Reach **50 points** to win — or run out of energy and lose
5. Click **Restart Game** to play again

---

## 🎣 Catch Table

| Catch | Chance | Points |
|-------|--------|--------|
| 🐟 Small Fish | 50% | +5 pts |
| 🐠 Big Fish | 30% | +10 pts |
| 🗑️ Old Boot | 20% | +0 pts |

---

## ⚙️ Game Details

| Stat | Value |
|------|-------|
| Starting energy | 10 |
| Energy per cast | −1 |
| Points to win | 50 |
| Cast delay | 1.5 seconds |
| Max possible score | 100 pts (10 Big Fish) |

To win you need to average at least **5 points per cast** — a mix of small and big fish with few boots.

---

## 🏆 Win & Lose Conditions

| Outcome | Condition |
|---------|-----------|
| 🎉 **You Win!** | Score reaches 50 before energy runs out |
| 💀 **Game Over** | Energy hits 0 before reaching 50 points |

---

## 🗂️ File Structure

```
cozy-cast/
├── index.html    # Body-only HTML — score, energy, result, cast and restart buttons
├── style.css     # Sky-to-ocean gradient, button styling
├── script.js     # Cast logic, random catch system, win/lose detection
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. No installation or internet connection required

---

## 🛠️ Tech Stack

- **HTML** — game layout, score and energy display, action buttons
- **CSS** — sky blue gradient background, hover button animation
- **Vanilla JavaScript** — probability-based catch system, energy tracking, win/lose logic

---

## 💡 Tips

- You need 50 points from 10 casts — that's an average of 5 per cast
- A perfect run of 10 Big Fish scores 100 points — but that's only a 0.3^10 chance!
- Boots waste precious energy — you can still win with 2–3 boots if you catch enough Big Fish
- The minimum winning combo is 5 Big Fish (50 pts in 5 casts) — leaving 5 energy to spare

---

*Cast. Wait. Reel. Fill the bucket. 🎣*
