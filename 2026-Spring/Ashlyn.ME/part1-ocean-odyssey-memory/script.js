document.addEventListener("DOMContentLoaded", () => {

  const ICONS = [
    "🐳","🐙","🐠","🐢","🌊","🐬",
    "🦀","🦑","🪸","🐡","🐋","🐟"
  ];

  let tiles = shuffle([...ICONS, ...ICONS].map((emoji, i) => ({ id: i, emoji })));

  let firstCard  = null;
  let secondCard = null;
  let lockBoard  = false;
  let matches    = 0;
  let score      = 0;
  let combo      = 0;
  let mismatches = 0;
  let startTime  = null;
  let rafId      = null;

  const grid         = document.getElementById("grid");
  const timeEl       = document.getElementById("time");
  const scoreEl      = document.getElementById("score");
  const comboEl      = document.getElementById("combo");
  const resetBtn     = document.getElementById("resetBtn");
  const modal        = document.getElementById("modal");
  const finalTimeEl  = document.getElementById("finalTime");
  const finalScoreEl = document.getElementById("finalScore");
  const finalGradeEl = document.getElementById("finalGrade");
  const playAgainBtn = document.getElementById("playAgainBtn");

  buildGrid(tiles);
  startTimer();
  updateHUD();

  resetBtn.addEventListener("click", resetGame);
  playAgainBtn.addEventListener("click", resetGame);

  function buildGrid(items) {
    grid.innerHTML = "";
    const frag = document.createDocumentFragment();
    items.forEach((t, idx) => {
      const card = document.createElement("button");
      card.className = "card";
      card.type = "button";
      card.setAttribute("aria-label", "Memory card");
      card.dataset.emoji = t.emoji;
      card.dataset.index = String(idx);

      const inner = document.createElement("div");
      inner.className = "card__inner";

      const front = document.createElement("div");
      front.className = "face face--front";

      const back = document.createElement("div");
      back.className = "face face--back";

      const tile = document.createElement("span");
      tile.className = "tile";
      tile.textContent = t.emoji;

      back.appendChild(tile);   // ✅ emoji on back — revealed after flip
      inner.appendChild(front); // front is blank by default
      inner.appendChild(back);
      card.appendChild(inner);

      card.addEventListener("click", () => onCardSelected(card));
      card.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); card.click(); }
      });

      frag.appendChild(card);
    });
    grid.appendChild(frag);
  }

  function onCardSelected(card) {
    if (lockBoard) return;
    if (card === firstCard) return;
    if (card.classList.contains("is-matched")) return;
    card.classList.add("is-flipped");
    if (!firstCard) { firstCard = card; return; }
    secondCard = card;
    lockBoard  = true;
    firstCard.dataset.emoji === secondCard.dataset.emoji ? handleMatch() : handleMismatch();
  }

  function handleMatch() {
    matches += 1;
    combo   += 1;
    score   += 100 + combo * 25;
    [firstCard, secondCard].forEach(c => {
      c.classList.add("is-matched");
      c.setAttribute("aria-disabled", "true");
    });
    resetPick();
    matches === ICONS.length ? endGame() : updateHUD();
  }

  function handleMismatch() {
    mismatches += 1;
    combo  = 0;
    score  = Math.max(0, score - 15);
    [firstCard, secondCard].forEach(c => {
      c.classList.add("shake");
      setTimeout(() => c.classList.remove("shake"), 350);
    });
    setTimeout(() => {
      if (firstCard)  firstCard.classList.remove("is-flipped");
      if (secondCard) secondCard.classList.remove("is-flipped");
      resetPick();
      updateHUD();
    }, 600);
  }

  function resetPick() { firstCard = null; secondCard = null; lockBoard = false; }

  function startTimer() {
    startTime = performance.now();
    if (rafId) cancelAnimationFrame(rafId);
    const tick = () => {
      timeEl.textContent = ((performance.now() - startTime) / 1000).toFixed(1);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
  }

  function endGame() {
    cancelAnimationFrame(rafId);
    const totalTime = parseFloat(timeEl.textContent) || 0;
    const timeBonus = Math.max(0, Math.floor(600 - totalTime * 10));
    const final     = score + timeBonus;
    finalTimeEl.textContent  = totalTime.toFixed(1);
    finalScoreEl.textContent = String(final);
    finalGradeEl.textContent = grade(final, totalTime, mismatches);
    modal.hidden = false;
  }

  function grade(finalScore, t, miss) {
    if (finalScore >= 1200 && t < 40 && miss <= 3) return "S+";
    if (finalScore >= 1000) return "A";
    if (finalScore >= 800)  return "B";
    if (finalScore >= 600)  return "C";
    return "D";
  }

  function updateHUD() {
    scoreEl.textContent = String(score);
    comboEl.textContent = combo + "×";
  }

  function resetGame() {
    cancelAnimationFrame(rafId);
    modal.hidden = true;
    firstCard = null; secondCard = null; lockBoard = false;
    matches = 0; score = 0; combo = 0; mismatches = 0;
    tiles = shuffle([...ICONS, ...ICONS].map((emoji, i) => ({ id: i, emoji })));
    buildGrid(tiles);
    startTimer();
    updateHUD();
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

});
