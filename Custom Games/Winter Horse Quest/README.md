# ❄️ Winter Horse Quest ❄️

> A brave winter steed battles through enchanted lands. Defeat all 5 bosses to win!

---

## 🐴 About

Winter Horse Quest is a browser-based turn-based RPG. You play as a heroic winter horse facing off against a series of increasingly fearsome bosses in a snowy, enchanted world. Choose your action each turn wisely — attack, defend, or heal — and defeat all five bosses to claim victory.

---

## 🕹️ How to Play

Each turn you choose one of four actions. After your action, the boss attacks you. Reduce the boss's HP to 0 to advance to the next boss. Reach 0 HP yourself and it's game over.

### Actions

| Button | Effect |
|--------|--------|
| **Attack** | Deals 10–24 damage. Always hits. |
| **Heavy Attack** | Deals 15–39 damage. 75% hit chance — misses 25% of the time. |
| **Defend** | Halves the damage from the boss's next attack. |
| **Heal** | Restores 30 HP (capped at 100). Limited to **3 uses per boss**. |

---

## 👾 Bosses

| # | Boss | Theme |
|---|------|-------|
| 1 | Frost Wolf | Icy predator of the tundra |
| 2 | Goblin Chief | Leader of the frozen goblin horde |
| 3 | Swamp Serpent | Lurking beast of the winter marsh |
| 4 | Flame Golem | Fire and ice collide |
| 5 | Dark Sorceress | The final enchanted threat |

Each boss starts with **100 HP**. Heals reset to 3 uses with each new boss.

---

## ⚔️ Combat Details

- **Boss damage per turn:** 3–10 (random), halved if you used Defend
- **Player HP:** Starts at 100, carries over between bosses
- **Boss HP:** Resets to 100 for each new boss
- **Heals:** 3 per boss, each restores 30 HP (cannot exceed 100)
- **Heavy Attack miss:** No damage dealt, but boss still attacks that turn

---

## 🌨️ Atmosphere

- Animated snowfall via HTML5 Canvas (250 snowflakes)
- Animated gradient sky background
- Horse and boss sprites gently float with a looping animation
- All boss sprites loaded from Imgur

---

## 🗂️ File Structure

```
winter-horse-quest/
├── index.html    # Game HTML (body content)
├── style.css     # Sky, snow canvas, battle stage, health bars
├── script.js     # Boss data, combat logic, snow animation
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. An **internet connection** is required to load the horse and boss images from Imgur

---

## 🛠️ Tech Stack

- **HTML5 Canvas** — animated snowfall
- **CSS animations** — gradient sky, floating sprites
- **Vanilla JavaScript** — turn-based combat engine, boss progression
- **External images** — horse and boss sprites hosted on Imgur

---

## 💡 Tips

- Use **Defend** when your HP is low — halving boss damage can save you
- Save **Heals** for when you're below 50 HP rather than topping off early
- **Heavy Attack** is high risk, high reward — best used when the boss is nearly dead
- Player HP carries over between bosses, so finish each fight as healthy as possible

---

*Ride bravely. Fight wisely. Survive the winter. ❄️🐴*
