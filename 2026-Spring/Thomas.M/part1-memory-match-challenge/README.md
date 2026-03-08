# 🏦 Memory Match Challenge

> "I changed the theme from image-based Mario cards to a Finance/NYC-themed Memory Match Challenge using emojis. I added a streak multiplier scoring system and redesigned the UI to look more polished and product-like."

A finance-themed memory card matching game with a streak-based scoring system. Flip cards to find matching emoji pairs — the longer your streak, the higher your score!

## How to Play

- Click any card to flip it over and reveal the emoji
- Click a second card to try to find its match
- If the two cards **match** — they stay flipped and your streak increases!
- If they **don't match** — they flip back and your streak resets to 0
- Match all 8 pairs to win!

## Scoring

| Action | Effect |
|---|---|
| Match on a 1-streak | +100 points |
| Match on a 2-streak | +200 points |
| Match on a 3-streak | +300 points |
| Miss | Streak resets to 0 |

Each consecutive correct match increases your streak multiplier — so matching without any mistakes is worth far more than matching with gaps.

## Card Theme

Cards use a Finance / NYC emoji set: ☕ 💳 📈 🏦 💼 📊 💰 🗽

## Features

- 4×4 grid of 16 cards (8 pairs)
- Streak multiplier scoring
- Live score and streak display
- Smooth 3D flip animation
- Restart button to replay

## What Was Modified From the Original

- Theme changed from Mario image cards to finance/NYC emojis (no broken local image paths)
- Completely redesigned UI — gradient background, rounded cards, top header with title and restart button
- Added score counter, streak multiplier, and win condition with final score
- Converted to be fully CodePen-compatible

## Tech Used

- HTML, CSS, JavaScript
- No external libraries needed
- Hosted on CodePen

## Running on CodePen

Paste into the three separate panels: HTML, CSS, and JS.

> ✅ No extra settings needed — works out of the box!
