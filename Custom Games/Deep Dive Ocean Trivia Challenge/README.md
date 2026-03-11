# 🌊 Deep Dive — Ocean Trivia Challenge

> Answer ocean trivia to descend into the darkest depths of the sea!

---

## 🌊 About

Deep Dive is a single-file browser-based trivia game with a deep-sea exploration theme. Answer 10 ocean questions to descend from the Sunlight Zone all the way to the Abyss. Each correct answer earns points and builds your streak multiplier — wrong answers cost a life. Lose all 3 lives and the dive ends early.

---

## 🕹️ How to Play

1. Click **Begin Descent** on the start screen
2. Read each question and pick the correct answer (A–D)
3. A fact about the topic is revealed after every answer
4. Click **Dive Deeper →** to continue to the next question
5. Reach question 10 and surface with the highest score possible!

---

## 🦭 Lives & Scoring

| Mechanic | Detail |
|----------|--------|
| Starting lives | 3 🦭 |
| Wrong answer | −1 life, streak resets to 0 |
| Correct answer (no streak) | +100 pts |
| Correct answer (2x streak) | +120 pts |
| Correct answer (3x+ streak) | +150 pts |
| Game ends early if | All 3 lives are lost |

---

## 🌊 Ocean Zones (Depth Progression)

| Questions | Zone | Depth |
|-----------|------|-------|
| 1–2 | Sunlight Zone | 0–200m |
| 3–4 | Twilight Zone | 200–1,000m |
| 5–6 | Midnight Zone | 1,000–4,000m |
| 7–8 | Abyssal Zone | 4,000–6,000m |
| 9–10 | The Abyss | 6,000m+ |

The depth bar and zone label update with each question, tracking your descent to 11,000m (Challenger Deep).

---

## 🏅 Ranks (End Screen)

| Correct Answers | Rank |
|-----------------|------|
| 9–10 | Abyss Master |
| 7–8 | Deep Sea Expert |
| 5–6 | Twilight Diver |
| 3–4 | Surface Swimmer |
| 0–2 | Rookie Diver |

---

## 🧠 Questions

All 10 questions cover real ocean science — shuffled randomly each game:

- Largest ocean, ocean surface coverage
- Mariana Trench / Challenger Deep
- Octopus biology (3 hearts, blue blood)
- Ocean exploration statistics
- Bioluminescence
- Thermohaline circulation
- The Gulf Stream
- The bathypelagic midnight zone
- Hydrothermal vents and chemosynthesis

Each question includes a detailed fun fact shown after answering.

---

## 🗂️ File Structure

This game is fully self-contained in a **single HTML file** — no external JS or CSS files needed.

```
deep-dive-ocean-trivia/
├── ocean-trivia-game.html    # Everything: styles, HTML, questions, and script
└── README.md                 # You are here
```

---

## 🖥️ How to Run

1. Open `ocean-trivia-game.html` in any modern browser
2. An **internet connection** is needed to load the Google Fonts (Space Mono + Playfair Display)
3. If offline, the game falls back to system fonts

---

## 🛠️ Tech Stack

- **HTML/CSS** — animated particles, depth bar, zone card, glassmorphism question card
- **Vanilla JavaScript** — question shuffle, streak multiplier, rank calculation, screen transitions
- **Google Fonts** — Space Mono (monospace UI) + Playfair Display (headings)
- **Web Audio** — none (no sound)

---

## 💡 Tips

- Build a **3x streak** as early as possible — +150 pts per correct answer adds up fast
- Questions are shuffled each game, so zone labels are cosmetic — difficulty isn't tied to question order
- Wrong answers reveal the correct answer and a fun fact — worth reading before diving again
- A perfect run (10/10, no lives lost, full streak): 100 + 120 + 150×8 = **1,420 pts**

---

*Dive deep. Answer true. Surface as an Abyss Master. 🌊🦭*
