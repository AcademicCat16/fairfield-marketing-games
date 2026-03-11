# 🏃 Schuyler Sprint

> Explore the cabin grounds, meet the family, and race with Schuyler!

---

## 🐶 About

Molly's World is a browser-based top-down exploration game starring Molly the dog. Roam around a cozy cabin scene, bump into family characters who share their personalities, and trigger a fun running mini-game with Schuyler!

---

## 🕹️ Controls

### World Exploration
| Key | Action |
|-----|--------|
| `↑` Arrow Up | Move up |
| `↓` Arrow Down | Move down |
| `←` Arrow Left | Move left |
| `→` Arrow Right | Move right |
| `Enter` | Interact with nearby character |
| `R` | Return to world from mini-game |

### Schuyler Runner Mini-Game
| Key | Action |
|-----|--------|
| `Space` | Jump over hurdles |
| `Space` | Restart after tripping |
| `R` | Return to world map |

---

## 🌍 World Map

Roam the grassy area around the cabin and approach characters to see their speech bubbles. Walk within **70px** of a character to trigger their greeting.

### Characters
| Name | Personality |
|------|-------------|
| Uncle Chris | "Let's go for a run!" |
| Jessie | "Push-ups first!" |
| Rachel | "Yo yo yo I'm Rachel!" |
| Schuyler | "Im Schuyler! Let's do a race!" |
| Annie | "I'm hungry!" |
| Courtney | "Dinner's ready!" |
| Will | "I'm a cookie!" |
| Caroline | "Heyyyy I'm Caroline!" |
| Monaco Family | "We prefer New Jersey!" |

All characters wander the map randomly and bounce off the edges.

---

## 🏃 Schuyler Runner Mini-Game

Walk up to **Schuyler** and press **Enter** to start the runner.

- Molly and Schuyler run together across a Cal Poly mountain backdrop
- White hurdles scroll toward you — press **Space** to jump
- Schuyler shouts running tips in a speech bubble as you go
- Obstacle speed increases gradually over time
- Trip a hurdle and it's game over — press **Space** to retry or **R** to go home

### Running Tips (shown in order, cycling every 3 seconds)
- "Running boosts mood!"
- "5Ks build endurance!"
- "Proper form prevents injury!"
- "Hydration is key!"
- "Cadence matters!"

---

## 🗂️ File Structure

```
schuyler-sprint/
├── index.html    # Game HTML (body content)
├── style.css     # Sky background, canvas border, overlay
├── script.js     # World map, character AI, runner mini-game, input
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. An **internet connection** is required — all character sprites and Molly's image are loaded from Imgur

---

## 🛠️ Tech Stack

- **HTML5 Canvas** — all rendering (world, cabin, characters, mini-game)
- **Vanilla JavaScript** — game loop, character wandering AI, runner physics, collision detection
- **External images** — all character sprites hosted on Imgur

---

## 💡 Tips

- Characters wander randomly so you may need to chase them down
- In the runner, jump early — the hurdle hitbox activates as soon as the bar reaches Molly
- Speed increases the longer you survive, so later hurdles are harder to time
- Press **R** any time during the mini-game to return to the world map

---

*Explore. Meet everyone. Race with Schuyler. 🐾*
