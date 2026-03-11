# 🃏 Xtreme Blackjack

> Classic blackjack in the browser — fast, simple, and styled.

---

## 🎮 About

Xtreme Blackjack is a browser-based blackjack game built with vanilla HTML, CSS, and JavaScript. No chips, no betting — just pure card gameplay against the dealer. Features a custom card back image and a bold gradient title.

---

## 📋 How to Play

1. The game deals you and the dealer two cards each
2. The dealer's first card is hidden
3. Choose to **Hit** or **Stand**
4. Try to get as close to **21** as possible without going over
5. The dealer must hit until reaching 17 or higher

---

## 🃏 Card Values

| Card | Value |
|------|-------|
| 2 – 10 | Face value |
| J, Q, K | 10 |
| A | 11 (counts as 1 if hand would bust) |

---

## 🖱️ Buttons

| Button | Action |
|--------|--------|
| **Hit** | Draw another card |
| **Stand** | End your turn, dealer plays |
| **Restart** | Start a new game with a fresh deck |

---

## 🏆 Win Conditions

| Result | Condition |
|--------|-----------|
| **You win** | Your score is higher than the dealer's |
| **Dealer wins** | Dealer's score is higher than yours |
| **You busted** | Your score exceeds 21 |
| **Dealer busts** | Dealer's score exceeds 21 — you win |
| **Tie** | Both scores are equal |

---

## 🗂️ File Structure

```
xtreme-blackjack/
├── index.html    # Game HTML (body content)
├── style.css     # Styling and card layout
├── script.js     # Game logic and deck management
└── README.md     # You are here
```

---

## 🖥️ How to Run

1. Place all files in the same folder
2. Open `index.html` in any modern browser
3. No installation or dependencies required

---

## 🛠️ Tech Stack

- **HTML5** — structure and layout
- **CSS3** — dark theme, gradient title, card styling
- **Vanilla JavaScript** — deck creation, hand logic, dealer AI

---

## 💡 Notes

- The deck is a standard 52-card deck, reshuffled on every restart
- The card back image is loaded from GitHub — an internet connection is needed to display it
- Aces automatically adjust between 11 and 1 to avoid busting

---

*Deal 'em and good luck! 🎰*
