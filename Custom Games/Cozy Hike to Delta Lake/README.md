# 🐾 Cozy Hike to Delta Lake

> Help your puppy survive a 45-second hike through the Wyoming wilderness!

---

## 🏔️ About

Cozy Hike to Delta Lake is a browser-based endless runner set in the scenic trails of Jackson Hole, Wyoming. Your puppy walks automatically toward Delta Lake — your only job is to jump over rocks in the way. Survive 45 seconds without losing all 3 hearts to reach the lake!

---

## 🕹️ Controls

| Key | Action |
|-----|--------|
| `Space` | Jump |
| `G` | Jump |
| **Start Hike** button | Begin the game |
| **Hike Again 🐾** button | Restart after game over or win |

---

## 🎯 How to Play

1. Click **Start Hike** to begin
2. The puppy walks automatically — you can't stop or slow down
3. Press `Space` or `G` to jump over incoming rocks
4. You have **3 hearts** — each rock hit costs one
5. Lose all 3 hearts and the hike restarts
6. Survive **45 seconds** to reach Delta Lake and win!

---

## 💓 Lives

| State | Display |
|-------|---------|
| Full health | ❤️❤️❤️ |
| One hit | ❤️❤️🖤 |
| Two hits | ❤️🖤🖤 |
| Game over | 💔 |

---

## ⚙️ Game Details

- Rocks spawn every **2.2 seconds** and scroll left at **5px per frame**
- Rock sizes vary slightly each spawn for variety
- The puppy jumps very high with a slow fall — giving you plenty of airtime
- You are safe from a rock if you are more than **55px above ground** when it passes
- A progress bar fills over the 45 seconds showing your trail progress
- The puppy flashes on hit; rocks flash red when they connect

---

## 🏁 Win & Lose Conditions

| Condition | Result |
|-----------|--------|
| Survive 45 seconds | 🏔️ Your puppy reached Delta Lake! |
| Lose all 3 hearts | 💔 Too many rocks — try again! |

---

## 🗂️ File Structure

```
cozy-hike-delta-lake/
├── index.html    # Game HTML (body content)
├── style.css     # Scenery, puppy, trail, HUD styling
├── script.js     # Jump physics, rock spawning, collision, timer
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. No installation or internet connection required — all graphics are CSS

---

## 🛠️ Tech Stack

- **HTML/CSS** — fully CSS-drawn scene (mountains, trees, trail, sun, puppy)
- **Vanilla JavaScript** — jump physics (rise/hang/fall), rock spawning, collision detection, timer
- No images, no external libraries

---

## 💡 Tips

- Jump early — the puppy rises fast but the fall is slow, so you have plenty of hang time
- You only need to be 55px off the ground to clear a rock — you don't need to wait for peak height
- Rocks are always the same speed, so once you get the rhythm down, timing gets easier
- The progress bar fills over 45 seconds — watch it to gauge how close you are to the lake!

---

*One paw in front of the other. Delta Lake awaits. 🐾🏔️*
