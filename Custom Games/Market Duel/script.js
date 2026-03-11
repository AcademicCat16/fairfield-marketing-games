// ====== IMAGE URLS (YOUR GITHUB RAW LINKS) ======
const HERO_IMAGE_URL =
"https://github.com/prestonbiedenkapp51-web/game-assets1/blob/main/ChatGPT%20Image%20Feb%2028,%202026,%2012_11_34%20PM.png?raw=true";
const VILLAIN_IMAGE_URL =
"https://github.com/prestonbiedenkapp51-web/game-assets1/blob/main/ChatGPT%20Image%20Feb%2028,%202026,%2012_13_25%20PM.png?raw=true";
// ====== SIMPLE GAME SETTINGS ======
const MAX_DAYS = 30;
const GOAL_NET = 200000;
const TRADE_SIZE = 10; // shares per click
const START_CASH = 50000;
const START_PRICE = 100;
const HACK_CHANCE = 0.18; // 18% chance per day
const GOOD_NEWS_CHANCE = 0.14;
// daily move parameters
const NORMAL_MOVE = { min: -0.06, max: 0.07 }; // -6% to +7%
const GOOD_MOVE = { min: 0.03, max: 0.14 }; // +3% to +14%
const HACK_MOVE = { min: -0.28, max:-0.08 }; // -28% to -8%
// ====== GAME STATE ======
let day, cash, shares, price, lastEvent, gameOver;
const el = (id) => document.getElementById(id);
const ui = {
heroImg: el("heroImg"),
villainImg: el("villainImg"),
day: el("day"),
price: el("price"),
event: el("event"),
cash: el("cash"),
shares: el("shares"),
net: el("net"),
log: el("log"),
buyBtn: el("buyBtn"),
sellBtn: el("sellBtn"),
holdBtn: el("holdBtn"),
resetBtn: el("resetBtn"),
};
function setCharacterImages() {
ui.heroImg.src = HERO_IMAGE_URL;
ui.villainImg.src = VILLAIN_IMAGE_URL;
ui.heroImg.onerror = () => {
ui.heroImg.alt = "Hero image failed to load (check URL).";
};
ui.villainImg.onerror = () => {
ui.villainImg.alt = "Villain image failed to load (check URL).";
};
}
const fmtMoney = (n) =>
n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const fmtPrice = (n) =>
n.toLocaleString(undefined, { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
function randBetween(min, max) {
return min + Math.random() * (max - min);
}
function pushLog(html) {
const div = document.createElement("div");
div.innerHTML = html;
ui.log.prepend(div);
}
function netWorth() {
return cash + shares * price;
}
function setButtonsEnabled(enabled) {
ui.buyBtn.disabled = !enabled;
ui.sellBtn.disabled = !enabled;
ui.holdBtn.disabled = !enabled;
ui.buyBtn.style.opacity = enabled ? "1" : "0.5";
ui.sellBtn.style.opacity = enabled ? "1" : "0.5";
ui.holdBtn.style.opacity = enabled ? "1" : "0.5";
}
function updateUI() {
ui.day.textContent = `${day} / ${MAX_DAYS}`;
ui.price.textContent = fmtPrice(price);
ui.event.textContent = lastEvent;
ui.cash.textContent = fmtMoney(cash);
ui.shares.textContent = shares.toLocaleString();
ui.net.textContent = fmtMoney(netWorth());
ui.net.className = "v";
if (netWorth() >= GOAL_NET) ui.net.classList.add("good");
ui.price.className = "v";
if (lastEvent === "HACK") ui.price.classList.add("bad");
if (lastEvent === "GOOD NEWS") ui.price.classList.add("good");
}
function endGame(win, reason) {
gameOver = true;
setButtonsEnabled(false);
const tag = win ? "good" : "bad";
pushLog(`<b class="${tag}">${win ? "YOU WIN" : "YOU LOSE"}</b> — ${reason}`);
}
function nextDay() {
if (gameOver) return;
if (day > MAX_DAYS) {
const net = netWorth();
if (net >= GOAL_NET) endGame(true, `You reached ${fmtMoney(net)} by Day ${MAX_DAYS}.`);
else endGame(false, `Day ${MAX_DAYS} ended. Final net worth: ${fmtMoney(net)}.`);
return;
}
const r = Math.random();
let move;
if (r < HACK_CHANCE) {
lastEvent = "HACK";
move = randBetween(HACK_MOVE.min, HACK_MOVE.max);
} else if (r < HACK_CHANCE + GOOD_NEWS_CHANCE) {
lastEvent = "GOOD NEWS";
move = randBetween(GOOD_MOVE.min, GOOD_MOVE.max);
} else {
lastEvent = "Normal";
move = randBetween(NORMAL_MOVE.min, NORMAL_MOVE.max);
}
const old = price;
price = Math.max(1, price * (1 + move)); // never below $1
const pct = ((price - old) / old) * 100;
const cls = pct >= 0 ? "good" : "bad";
pushLog(
`Day <b>${day}</b>: Event <b>${lastEvent}</b> → Price ${fmtPrice(old)} → <b class="${cls}">${fmtPrice(price)} (${pct.toFixed(1)}%)</b>`
);
if (netWorth() >= GOAL_NET) {
endGame(true, `Net worth hit ${fmtMoney(netWorth())} on Day ${day}.`);
return;
}
day += 1;
updateUI();
}
function buy() {
if (gameOver) return;
const cost = TRADE_SIZE * price;
if (cash < cost) {
pushLog(`<span class="bad">Not enough cash</span> to buy ${TRADE_SIZE} shares.`);
return nextDay();
}
cash -= cost;
shares += TRADE_SIZE;
pushLog(`You <b>BOUGHT</b> ${TRADE_SIZE} shares at ${fmtPrice(price)} (cost ${fmtMoney(cost)}).`);
updateUI();
nextDay();
}
function sell() {
if (gameOver) return;
if (shares < TRADE_SIZE) {
pushLog(`<span class="bad">Not enough shares</span> to sell ${TRADE_SIZE}.`);
return nextDay();
}
const revenue = TRADE_SIZE * price;
shares -= TRADE_SIZE;
cash += revenue;
pushLog(`You <b>SOLD</b> ${TRADE_SIZE} shares at ${fmtPrice(price)} (gain ${fmtMoney(revenue)}).`);
updateUI();
nextDay();
}
function hold() {
if (gameOver) return;
pushLog(`You <b>HELD</b>.`);
nextDay();
}
function reset() {
day = 1;
cash = START_CASH;
shares = 0;
price = START_PRICE;
lastEvent = "Normal";
gameOver = false;
ui.log.innerHTML = "";
pushLog(`Start: Cash <b>${fmtMoney(cash)}</b>, Price <b>${fmtPrice(price)}</b>. Reach <b>${fmtMoney(GOAL_NET)}</b> by Day <b>${MAX_DAYS}</b>.`);
setButtonsEnabled(true);
updateUI();
}
// hook up buttons
ui.buyBtn.addEventListener("click", buy);
ui.sellBtn.addEventListener("click", sell);
ui.holdBtn.addEventListener("click", hold);
ui.resetBtn.addEventListener("click", reset);
// start
setCharacterImages();
reset();
