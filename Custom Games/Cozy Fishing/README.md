# 🎣 Cozy Fishing

> Pick a spot, cast, relax, reel, collect. Cozy vibes only.

---

## 🌊 About

Cozy Fishing is a browser-based idle fishing game with a relaxing loop. Cast your line, wait for a nibble, reel in your catch, sell it for coins, and upgrade your rod to improve your luck. Three fishing spots offer different difficulty levels and loot tables — from peaceful ponds to risky oceans.

---

## 🕹️ How to Play

1. Pick a **Fishing Spot** from the dropdown
2. Click **Cast Line** and wait
3. When you see **"Nibble!"** — click **Reel In** for better odds
4. Check your **Latest Catch**, then click **Sell Catch** to earn coins
5. Spend coins on **Upgrade Rod** to improve luck and speed
6. Repeat and relax 🎏

---

## 📍 Fishing Spots

| Spot | Difficulty | Style |
|------|-----------|-------|
| 🏞️ Pond | Easy | Chill, fast nibbles, modest rewards |
| 🏔️ River | Balanced | Medium wait, better fish |
| 🌊 Ocean | Hard | Slower odds, highest rewards |

Switching spots mid-cast resets the current line safely.

---

## 🎲 Catch Tiers

Each spot has four tiers of loot:

| Tier | Examples | Coins | XP |
|------|----------|-------|----|
| **Junk** | Old Leaf, Driftwood, Seaweed | 0–1 | 1 |
| **Common** | Goldfish, Trout, Mackerel | 3–7 | 3–6 |
| **Rare** | Shimmer Koi, Moonfish, Pearl Eel | 10–19 | 8–14 |
| **Legendary** | Star Koi, River Spirit Fish, Mythic Marlin | 24–40 | 20–30 |

Catching junk **resets your streak**. All other tiers increase it.

---

## 📊 Luck Formula

Your catch quality is determined by:

| Factor | Bonus |
|--------|-------|
| Base spot luck | Pond: 18%, River: 14%, Ocean: 10% |
| Rod level | +6% per level |
| Reeling on nibble | +22% |
| Patience (wait time) | Up to +20% |
| Streak | Up to +5% (capped at 10 streak) |

Max possible luck: **85%**

---

## 🎣 Rod Upgrades

| Stat | Effect |
|------|--------|
| Upgrade cost | Starts at 15 coins, increases ~65% per level |
| Rod level cap | Level 5 (fills rod bar at 100%) |
| Benefits | +6% luck per level, slightly faster nibbles |

---

## 📈 Stats

| Stat | Description |
|------|-------------|
| 🪙 **Coins** | Earned by selling catches |
| ⭐ **XP** | Earned on every reel-in (including junk) |
| 🎯 **Streak** | Consecutive non-junk catches |
| Patience bar | Fills while waiting — increases luck |
| Luck bar | Current total luck percentage |
| Rod Level bar | Visual rod upgrade progress |

---

## 🗂️ File Structure

```
cozy-fishing/
├── index.html    # Full HTML document
├── style.css     # Cozy theme, water spot backgrounds, animations
├── game.js       # Game loop, loot tables, luck system, upgrades
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. No installation or internet connection required

---

## 🛠️ Tech Stack

- **HTML5** — semantic layout, accessible live region for log
- **CSS3** — per-spot water themes, bobber float animation, reel-up fish animation
- **Vanilla JavaScript** — timer-based nibble system, weighted loot rolls, upgrade scaling

---

## 💡 Tips

- Always wait for **"Nibble!"** before reeling — it adds +22% luck, the biggest single bonus
- The **Patience bar** fills over time and quietly boosts your odds — don't rush
- **Ocean** has a much lower base luck but legendary catches are worth 40 coins — upgrade your rod first before fishing there
- Streaks give a small bonus but reset on any junk catch — high-luck spots help maintain them
- Rod upgrades cost more each level, so sell rare and legendary catches before upgrading

---

*Cast. Wait. Reel. Relax. 🎣✨*
