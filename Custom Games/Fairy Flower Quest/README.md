# ✨ Fairy Flower Quest

A simple top-down movement game where you guide a fairy around a forest to collect 10 flowers.

## How to Play

- Use the **Arrow Keys** to move the fairy 🧚‍♀️ around the forest
- Walk over a **🌸 flower** to collect it — it disappears on contact
- Collect all **10 flowers** to win
- The counter at the top tracks your progress: **Flowers collected: X / 10**
- A win message appears when all 10 are collected 🌸

---

## Win Condition

Collect all 10 flowers → win message appears at the bottom of the screen.

There is no lose condition or timer — it's a relaxed, cozy game!

---

## Notes

- Flowers spawn at **random positions** every time the page loads or is refreshed
- The fairy is kept inside the game area boundaries (can't walk off the edge)
- Collision detection uses **`getBoundingClientRect()`** to compare the fairy's position to each flower's position in real time

---
