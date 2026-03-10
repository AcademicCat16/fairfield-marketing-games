# 🌿 Lantern Meadow

A cozy top-down task game. Gather ingredients, craft teas at the campfire, and deliver orders to the Villager before the daylight runs out!

---

## How to Set Up in CodePen

1. Paste **HTML** into the **HTML** panel
2. Paste **CSS** into the **CSS** panel
3. Paste **JS** into the **JS** panel
4. No external libraries needed — all visuals are drawn with canvas shapes!

> No ⚙️ setting needed — the game starts immediately on load.

---

## How to Play

| Key | Action |
|---|---|
| W / A / S / D or Arrow Keys | Move your character |
| E | Interact (gather, craft, deliver) |
| R | Restart the game |

**Goal:** Complete **5 deliveries** before the Daylight bar runs out.

---

## Game Loop

1. **Gather** ingredients from bushes, mushroom pads, and berry shrubs by walking up and pressing **E**
2. **Craft** teas at the campfire (press **E** when nearby)
3. **Deliver** the requested items to the Villager (press **E** when nearby)
4. Earn **coins** and **score** for each delivery
5. Spend **20 coins** at the campfire to upgrade your backpack (+2 capacity)

---

## Map

| Tile | Description |
|---|---|
| 🟩 Dark green | Grass — walkable |
| 🟫 Brown path | Dirt trail — walkable |
| 🟦 Dark blue | Water — solid, blocks movement |
| ⬛ Gray rocks | Rocks — solid, blocks movement |

### Points of Interest

| Location | What it does |
|---|---|
| 🌿 Green bushes (top-left area) | Gather **Mint** |
| 🍄 Brown pads (top-center) | Gather **Mushroom** |
| 🌸 Berry shrubs (right side) | Gather **Berry** |
| 🔥 Campfire (center path) | Craft teas / upgrade backpack |
| 🧍 Villager (right of campfire) | Deliver orders for coins |

---

## Crafting Recipes

| Output | Ingredients |
|---|---|
| Herbal Tea | Mint × 2 |
| Forest Tea | Mushroom × 1 + Mint × 1 |
| Sweet Tea | Berry × 1 + Mint × 1 |

> The campfire automatically crafts the first recipe it finds that you have ingredients for.

---

## Orders

- 3 active orders are always shown in the HUD
- Orders ask for either **teas** (72% chance) or **raw ingredients** (28% chance)
- Each completed delivery rewards **6–12 coins** and **40–80 score points**
- A new order replaces each completed one automatically

---

## Scoring

| Action | Points |
|---|---|
| Gather an ingredient | +5 |
| Craft a tea | +10 |
| Complete a delivery | +40 to +80 |

---

## Backpack Upgrade

- Default capacity: **6 items**
- Spend **20 coins** at the campfire to expand by **+2** (up to max 12)
- The game notifies you when an upgrade is available

---

## Winning & Losing

- ✅ **Win:** Deliver **5 orders** before daylight runs out
- ❌ **Lose:** Daylight bar reaches 0% — press **R** to restart

---

## Key Concepts Used

- **Canvas 2D drawing** — all tiles, props, and the player are drawn with `ctx` shape methods (no image files needed)
- **Tile-based map** — 22×22 grid with grass, path, water, and rock tile types
- **AABB collision** — corner-point checks against solid tiles prevent walking into water or rocks
- **Game loop with delta time** — `requestAnimationFrame` with `dt` ensures consistent speed regardless of frame rate
- **Inventory system** — `Map` object tracks item quantities with a backpack capacity cap
- **Cooldown system** — gathering nodes have a 4-second cooldown before they can be used again
- **Order system** — randomly generated orders with weighted tea/ingredient distribution
- **IIFE pattern** — entire game wrapped in `(() => { ... })()` to avoid polluting global scope
