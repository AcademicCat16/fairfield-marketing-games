# ⚔️ Aric the Ironblade vs Draxis the Wickedblade

> A turn-based fantasy duel. Slash, strike, and guard your way to victory!

---

## 🗡️ About

A browser-based turn-based RPG battle between Aric the Ironblade (you) and Draxis the Wickedblade (the enemy). Choose your action each turn, manage cooldowns, and bring Draxis down before he defeats you.

---

## 🕹️ How to Play

1. Open the page — the battle starts immediately
2. Choose an action from the four buttons each turn
3. After your action, Draxis automatically attacks
4. Reduce Draxis's HP to 0 to win
5. Don't let your own HP hit 0!

---

## ⚔️ Actions

| Button | Effect | Cooldown |
|--------|--------|----------|
| ⚔️ **Slash** | Reliable damage every turn | None |
| 💥 **Power Strike** | 1.5× damage multiplier | 2 turns |
| 🌀 **Whirl Slash** | 1.2× damage multiplier | 3 turns |
| 🛡️ **Guard** | Halves the next enemy attack | None |

Damage formula: `max(1, floor(attacker.attack × multiplier - defender.defense))`

---

## 📊 Character Stats

| Stat | Aric (Player) | Draxis (Enemy) |
|------|--------------|----------------|
| Max HP | 28 | 32 |
| Attack | 6 | 8 |
| Defense | 5 | 4 |

- Aric hits for **1–5 damage** base (Slash)
- Power Strike hits for **4–5 damage**
- Draxis hits for **3–4 damage** base, reduced to **1–2** if you Guard

---

## ⏱️ Cooldowns

- **Power Strike** is disabled for **2 turns** after use
- **Whirl Slash** is disabled for **3 turns** after use
- Hover over a greyed-out button to see remaining cooldown turns

---

## 🗂️ File Structure

This game is fully self-contained in a **single HTML file** — no separate CSS or JS files needed.

```
aric-vs-draxis/
├── index.html    # Everything: styles, HTML structure, and script in one file
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Open `index.html` in any modern browser
2. No installation, no dependencies, no internet required

---

## 🛠️ Tech Stack

- **HTML** — battle layout, HP bars, action buttons, combat log
- **Inline CSS** — dark RPG theme, HP bar transitions, hit flash animation
- **Vanilla JavaScript** — turn system, damage calculation, cooldown tracking, win/lose detection

---

## 💡 Tips

- **Guard** is most effective when your HP is low — halving Draxis's 8 attack can save you
- Use **Power Strike** early to get ahead on HP, then manage cooldowns
- **Slash** every turn when specials are on cooldown — never skip your turn
- Draxis has more HP but lower defense — consistent damage beats trading hits

---

*Strike hard. Guard smart. Defeat the Wickedblade. ⚔️*
