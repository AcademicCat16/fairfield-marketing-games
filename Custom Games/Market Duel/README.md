# 📈 Market Duel

A simple stock trading game where you race to build your net worth before a market hacker takes you down.

## Goal

Reach **$200,000 net worth** by the end of **Day 30**.

You start with **$50,000 cash** and a stock priced at **$100.00**. Each turn you choose to buy, sell, or hold — then the market moves based on a random daily event.

## How to Play

Each day you pick one action:

- **Buy 10 shares** — spends cash to buy 10 shares at the current price
- **Sell 10 shares** — sells 10 shares and adds the cash to your balance
- **Hold** — do nothing and let the market move on its own

After your action, the day advances and a random market event triggers.

## Market Events

Each day one of three events can happen:

| Event | Effect |
|---|---|
| **Normal** | Small random move, -6% to +7% |
| **Good News** | Price jumps +3% to +14% |
| **HACK** | The Market Hacker strikes — price drops -8% to -28% |

There is an 18% chance of a HACK each day, so they happen fairly often. Keeping some cash on hand lets you buy the dip when prices crash.

## Winning & Losing

- **Win** — your net worth (cash + value of shares) hits $200,000 at any point before Day 30 ends
- **Lose** — Day 30 ends and your net worth is still below $200,000

Net worth is calculated as: `cash + (shares × current price)`

## Tips

- Don't put all your cash into shares early — a HACK can wipe out your portfolio value fast
- After a HACK the price is low, which is a good time to buy
- Watch the event log to track price history and plan your next move

## Tech Used

- HTML, CSS, JavaScript
- No external libraries needed
- Hosted on CodePen

## Running on CodePen

Paste into the three separate panels: HTML, CSS, and JS.

> ✅ No extra settings needed — works out of the box!
