# 🎯 Focus Click

A simple clicker game where you race to stay focused before distractions drain your points.

---

## How to Set Up in CodePen

1. Paste **HTML** into the **HTML** panel
2. Paste **CSS** into the **CSS** panel
3. Paste **JS** into the **JS** panel
4. Click the **JS panel gear icon ⚙️** → **"Add Behavior"** → **"No wrap - bottom of body"** → Save
5. No external libraries needed!

---

## How to Play

- You start with **10 Focus Points**
- Click **"Stay Focused"** to gain **+1 point** each click
- Every 2 seconds, there's a random chance a **distraction hits** and you lose **3 points**
- Reach **30 points** to win 🎉
- Drop to **0 points** and it's Game Over 😵

---

## Win & Lose Conditions

| Condition | Result |
|---|---|
| Score reaches 30 | 🎉 You win! Button disables. |
| Score drops to 0 | 😵 Game Over. Button disables. |

---

## Bug Fixed

The original code kept the distraction timer running after game over, which could push the score below zero even after the game ended. Fixed by adding a check at the top of the interval:

```javascript
if (button.disabled) return;
```

---

## Key Concepts Used

- **Event listeners** — button click adds points
- **setInterval** — runs a distraction check every 2 seconds
- **Math.random()** — randomly decides if a distraction occurs (40% chance)
- **DOM manipulation** — score and message update live with `innerText`
- **Conditional logic** — checks win/lose thresholds after every update
