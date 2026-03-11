const EMOJIS = ["🍩","🎾","🧠","🌈","🍓","🚲","🎧","🐝","🧊","🌿","✨","🧃"];

const gridEl      = document.getElementById("grid");
const movesEl     = document.getElementById("moves");
const timeEl      = document.getElementById("time");
const pairCountEl = document.getElementById("pairCount");
const statusEl    = document.getElementById("status");
const restartBtn  = document.getElementById("restart");

let deck = [], flipped = [], lock = false;
let moves = 0, matchedPairs = 0;
let timer = null, startTime = null;

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(ms) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function startTimer() {
  if (timer) return;
  startTime = Date.now();
  timer = setInterval(() => { timeEl.textContent = formatTime(Date.now() - startTime); }, 250);
}

function stopTimer() {
  if (!timer) return;
  clearInterval(timer);
  timer = null;
}

function setStatus(text) {
  statusEl.querySelector("span").innerHTML = text;
}

function buildDeck() {
  const pairs = EMOJIS.slice(0, 12);
  pairCountEl.textContent = pairs.length;
  const cards = [];
  pairs.forEach((emoji, idx) => {
    cards.push({ id: idx, emoji });
    cards.push({ id: idx, emoji });
  });
  return shuffle(cards);
}

function render() {
  gridEl.innerHTML = "";
  deck.forEach((card, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "card";
    wrapper.dataset.index = index;

    const btn   = document.createElement("button");
    btn.type    = "button";
    btn.setAttribute("aria-pressed", "false");
    btn.setAttribute("aria-label", "Hidden card");
    btn.addEventListener("click", () => onFlip(index));

    const front = document.createElement("div");
    front.className = "face front";
    front.innerHTML = `<span>?</span><span class="sr-only">Hidden</span>`;

    const back = document.createElement("div");
    back.className = "face back";
    back.innerHTML = `<div class="emoji" aria-hidden="true">${card.emoji}</div>`;

    btn.appendChild(front);
    btn.appendChild(back);
    wrapper.appendChild(btn);
    gridEl.appendChild(wrapper);
  });
}

function setCardState(index, { flippedState, matchedState }) {
  const cardEl = gridEl.querySelector(`.card[data-index="${index}"]`);
  if (!cardEl) return;
  const btn = cardEl.querySelector("button");
  if (typeof flippedState === "boolean") {
    btn.setAttribute("aria-pressed", flippedState ? "true" : "false");
    btn.setAttribute("aria-label", flippedState ? `Card ${deck[index].emoji}` : "Hidden card");
  }
  if (typeof matchedState === "boolean") {
    cardEl.classList.toggle("matched", matchedState);
    btn.disabled = matchedState;
  }
}

function onFlip(index) {
  if (lock) return;
  const cardEl = gridEl.querySelector(`.card[data-index="${index}"]`);
  if (!cardEl) return;
  const btn = cardEl.querySelector("button");
  if (cardEl.classList.contains("matched")) return;
  if (btn.getAttribute("aria-pressed") === "true") return;
  if (flipped.includes(index)) return;

  startTimer();
  setCardState(index, { flippedState: true });
  flipped.push(index);

  if (flipped.length === 2) {
    moves++;
    movesEl.textContent = moves;
    const [a, b] = flipped;
    if (deck[a].id === deck[b].id) {
      matchedPairs++;
      setCardState(a, { matchedState: true });
      setCardState(b, { matchedState: true });
      flipped = [];
      if (matchedPairs === 12) {
        stopTimer();
        setStatus(`🎉 You won! <b>${moves}</b> moves in <b>${timeEl.textContent}</b>.`);
      } else {
        setStatus(`Nice! <b>${matchedPairs}</b> pair${matchedPairs===1?"":"s"} found.`);
      }
    } else {
      lock = true;
      setStatus(`Not a match — try again.`);
      setTimeout(() => {
        setCardState(a, { flippedState: false });
        setCardState(b, { flippedState: false });
        flipped = [];
        lock = false;
      }, 700);
    }
  }
}

function reset() {
  stopTimer();
  timeEl.textContent  = "0:00";
  movesEl.textContent = "0";
  moves = 0; matchedPairs = 0;
  flipped = []; lock = false;
  deck = buildDeck();
  render();
  setStatus(`Find all <b>12</b> pairs.`);
}

restartBtn.addEventListener("click", reset);
reset();
