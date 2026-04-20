# 🌿 Fit & Cozy

> A cozy fitness life simulator — take care of George one day at a time!

---

## 🌿 About

Fit & Cozy is a browser-based fitness life simulator. Each day you choose activities for George — runs, yoga, weight lifting, swimming, and more. Manage his Energy, Fitness, and Mood stats, earn coins, and buy upgrades from the Wellness Shop. End each day to rest and carry your progress forward.

---

## 🕹️ How to Play

1. Click any **activity button** to perform it — each activity affects Energy, Fitness, and Mood
2. Earn **coins** from activities and spend them in the **Wellness Shop** on upgrades
3. Some activities cost coins (e.g. Healthy Meal costs 5 coins)
4. Each activity can only be done **once per day**
5. Click **End Day & Rest →** when you're done — George recovers +30 Energy overnight
6. You must complete at least one activity before ending the day
7. Keep playing across multiple days to grow George's stats and score!

---

## 🏃 Activities

| Activity | Energy | Fitness | Mood | Coins Earned |
|----------|--------|---------|------|-------------|
| 🏃 Morning Run | −15 | +12 | +8 | +10 |
| 🧘 Yoga Session | −5 | +5 | +15 | +6 |
| 🏋️ Weight Lift | −20 | +18 | +10 | +14 |
| 🏊 Swimming | −12 | +14 | +12 | +12 |
| 🚶 Chill Walk | −3 | +4 | +10 | +4 |
| 😴 Power Nap | +25 | +0 | +5 | +2 |
| 🥗 Healthy Meal | +10 | +3 | +8 | −5 (costs) |
| 🏀 Play Sports | −10 | +10 | +20 | +8 |

---

## 🛍️ Wellness Shop

| Item | Cost | Bonus |
|------|------|-------|
| 🧘 Yoga Mat | 20c | Yoga gives +5 extra mood |
| 💧 Water Bottle | 15c | All activities +5 energy |
| 👟 Running Shoes | 30c | Run & walk give +5 fitness |
| 🎧 Headphones | 25c | +3 coins per activity |

Upgrades are permanent and apply to all future activities.

---

## 📊 Avatar Progression

George's avatar evolves as his Fitness increases:

| Fitness | Avatar |
|---------|--------|
| 0–19% | 🧍 Standing |
| 20–39% | 🚶 Walking |
| 40–59% | 🏃 Running |
| 60–79% | 🤸 Stretching |
| 80–99% | 💪 Strong |
| 100% | 🦸 Hero |

---

## ⚙️ Scoring

- Each activity adds `fitness + abs(mood)` to your score
- Ending a day gives a bonus of `floor((fitness + mood + energy) / 10)`
- Higher stats = bigger daily bonuses — keep all three bars high!

---

## 🗂️ File Structure

```
fit-and-cozy/
├── index.html    # Body-only HTML — inline styles, layout, stat bars
├── style.css     # Placeholder (all styles inline in HTML)
├── script.js     # Game state, activity logic, shop, day cycle, log
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. No installation or internet connection required

---

## 💡 Tips

- **Headphones** (+3 coins/activity) pays for itself fastest — buy it first
- **Power Nap** restores 25 Energy with no fitness cost — use it when low
- End each day with high stats for the biggest score bonus
- **Yoga + Yoga Mat** is the best mood combo — great for score
- You start with 50 coins — enough for Water Bottle + Headphones on Day 1

---

*Move. Rest. Grow. Make George a champion. 🌿💪*
