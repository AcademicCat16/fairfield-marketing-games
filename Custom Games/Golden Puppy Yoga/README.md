# 🧘 Golden Puppy Yoga Studio

> Hold your pose to attract golden puppies to your mat — click them for zen points!

---

## 🐾 About

Golden Puppy Yoga Studio is a browser-based relaxation game set in a cozy yoga studio. You play as a yogi on a mauve mat. Hold your yoga pose to attract bouncing golden retriever puppies from the edges of the studio — click them for bonus zen points and build your score!

---

## 🕹️ How to Play

1. Click and **hold** the **Begin Yoga Flow** button to start posing
2. While posing, your **Zen Level** increases by 1 every 100ms
3. Puppies randomly spawn and slowly drift toward your mat
4. **Click a puppy** to give it love — it turns into 💖 and awards **+25 zen points**
5. Release the button to stop posing — puppies stop moving and zen stops accumulating
6. The Happy Puppies counter shows how many puppies are currently on the mat

---

## ⚙️ Game Details

| Stat | Value |
|------|-------|
| Zen gain while posing | +1 per 100ms (10 pts/sec) |
| Zen gain per puppy click | +25 pts |
| Puppy spawn chance | 5% per tick while posing |
| Max puppies on screen | 10 |
| Puppy spawn location | Random edges (top or bottom) |
| Puppy movement | Drifts toward center at 1% per tick |
| Puppy click animation | Turns to 💖, removed after 600ms |

---

## 🗂️ File Structure

```
golden-puppy-yoga/
├── index.html    # Full HTML document — game layout and structure
├── style.css     # Studio theme, mat, puppy bounce animation, glassmorphism card
├── script.js     # Pose hold mechanic, puppy spawning, movement, zen scoring
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. An **internet connection** is required to load:
   - The studio background image (GitHub)
   - The golden puppy sprite (GitHub)

---

## 🛠️ Tech Stack

- **HTML/CSS** — glassmorphism game card, CSS bounce animation, mauve yoga mat
- **Vanilla JavaScript** — hold-to-pose mechanic, interval-based game loop, puppy spawn and movement
- **External images** — studio background and puppy sprite hosted on GitHub

---

## 💡 Tips

- Keep the button held down — zen only builds while you're actively posing
- Click puppies as soon as they appear for the +25 bonus before they pile up
- Puppies only move while you're posing, so releasing stops the whole session
- Up to 10 puppies can be on screen at once — the studio gets crowded fast!

---

*Hold the pose. Attract the puppies. Find your zen. 🧘🐕*
