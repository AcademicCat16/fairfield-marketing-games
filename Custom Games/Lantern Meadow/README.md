# 🏮 Lantern Meadow

> A cozy top-down task game. Gather, craft, and deliver before the daylight fades.

---

## 🌿 About

Lantern Meadow is a browser-based cozy game where you roam a small meadow, gathering ingredients from bushes and forest pads, crafting herbal teas at the campfire, and delivering orders to the village before the day ends. No combat, no fail screen — just a peaceful race against the sun.

---

## 🎮 Controls

| Key | Action |
|-----|--------|
| `W` / `↑` | Move up |
| `S` / `↓` | Move down |
| `A` / `←` | Move left |
| `D` / `→` | Move right |
| `E` | Interact (gather, craft, deliver, upgrade) |
| `R` | Restart game |

---

## 🌱 Gathering

Walk up to a resource node and press `E` to collect it. Each node has a **cooldown of ~4 seconds** after being harvested.

| Node | Item | Location |
|------|------|----------|
| 🌿 Bush | Mint | Top-left area |
| 🍄 Pad | Mushroom | Upper middle |
| 🫐 Berry bush | Berry | Right side |

---

## 🔥 Crafting

Walk to the **campfire** and press `E` to craft. The game automatically uses the first recipe you have ingredients for.

| Recipe | Ingredients | Output |
|--------|-------------|--------|
| Herbal Tea | Mint × 2 | Herbal Tea |
| Forest Tea | Mushroom × 1 + Mint × 1 | Forest Tea |
| Sweet Tea | Berry × 1 + Mint × 1 | Sweet Tea |

Crafting earns **+10 score** per tea made.

---

## 📦 Delivering Orders

Walk to the **Villager** and press `E` to deliver. The game automatically matches your inventory to an active order.

- Each delivery earns **coins** and **score**
- 3 orders are always active — new ones appear after delivery
- Orders ask for teas (most common) or raw ingredients

**Goal: Complete 5 deliveries before the Daylight bar empties.**

---

## 🎒 Backpack & Upgrades

Your backpack starts with **6 slots**. When you have **20+ coins**, pressing `E` at the campfire upgrades your backpack by +2 (max 12 slots) instead of crafting.

---

## ⏳ Daylight Bar

The bar drains continuously. When it hits zero, the day ends and the game stops. Press `R` to start a new day.

---

## 📊 Scoring

| Action | Points |
|--------|--------|
| Gather an ingredient | +5 |
| Craft a tea | +10 |
| Complete a delivery | +40 to +80 |

---

## 🗺️ Map Layout

- **Top-left** — Mint bushes, rock formations
- **Upper middle** — Mushroom pads
- **Centre path** — Campfire (row 11–12)
- **Right of campfire** — Villager
- **Right side** — Berry bushes
- **Bottom-right area** — Small pond (impassable)

---

## 🗂️ File Structure

```
lantern-meadow/
├── index.html    # Game HTML (body content)
├── style.css     # UI layout and canvas styling
├── script.js     # Full game logic, rendering, and loop
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. No build step, no dependencies, no internet required

---

## 🛠️ Tech Stack

- **HTML5 Canvas** — all game world rendering (tiles, props, player)
- **Vanilla JavaScript** — game loop, physics, crafting, order system
- **CSS Grid** — HUD + canvas side-by-side layout

---

## 💡 Tips

- Mint is used in **every tea recipe** — always prioritize gathering it
- Upgrade your backpack early so you can carry more before delivering
- Berry and Mushroom nodes are further away — plan your route
- If the day is almost out, skip crafting and deliver raw ingredients — some orders ask for them directly

---

*Made with 🌿 and ✨ — take it slow, the meadow isn't going anywhere*
