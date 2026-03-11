// Campus Cozy Quest Match — JS

var em = ["📚","🎒","✏️","📝","☕","🧋","🎧","💻","🖊️","📖","🗒️","🔖","📐","📌","🖇️","🗃️","⏰","🎓"];

// Shuffle emojis
var tmp, c, p = em.length;
if (p) while (--p) {
  c = Math.floor(Math.random() * (p + 1));
  tmp = em[c]; em[c] = em[p]; em[p] = tmp;
}

var pre = "", pID, ppID = 0, turn = 0;
var t = "transform", flip = "rotateY(180deg)", flipBack = "rotateY(0deg)";
var timeInt, mode, rem = 0, noItems = 0;
var min = 0, sec = 0, moves = 0;

var quests = [
  { title: "Coffee Run",      text: "Match all pairs to fuel your study day." },
  { title: "Library Helper",  text: "Match all pairs to return books." },
  { title: "Note Passing",    text: "Match pairs to help a classmate." },
  { title: "Lost & Found",    text: "Match pairs to return keycards." }
];
var activeQuest = null;

const $ = (sel) => document.querySelector(sel);

function pad(n) { return n < 10 ? "0" + n : "" + n; }

window.onload = function () {
  $("#ol").innerHTML = `
    <div id="inst">
      <h3>Welcome to Campus Cozy Quest! 🎓</h3>
      <p><b>Instructions</b></p>
      <ul>
        <li>Flip cards to find matching quest items.</li>
        <li>If two cards don't match, they flip back.</li>
        <li>Complete the board to finish your cozy quest!</li>
      </ul>
      <p>Choose a board size to start:</p>
      <button onclick="start(3,4)">3 × 4</button>
      <button onclick="start(4,4)">4 × 4</button>
      <button onclick="start(4,5)">4 × 5</button>
      <button onclick="start(5,6)">5 × 6</button>
    </div>
  `;
};

function start(r, l) {
  min = 0; sec = 0; moves = 0;
  $("#time").textContent = "Time: 00:00";
  $("#moves").textContent = "Moves: 0";
  clearInterval(timeInt);
  timeInt = setInterval(function () {
    sec++;
    if (sec === 60) { min++; sec = 0; }
    $("#time").textContent = `Time: ${pad(min)}:${pad(sec)}`;
  }, 1000);

  activeQuest = quests[Math.floor(Math.random() * quests.length)];
  $("#quest").textContent = `Quest: ${activeQuest.title}`;

  rem = (r * l) / 2;
  noItems = rem;
  mode = r + "x" + l;

  var items = [];
  for (var i = 0; i < noItems; i++) items.push(em[i]);
  for (var i = 0; i < noItems; i++) items.push(em[i]);

  var tmp, c, p = items.length;
  if (p) while (--p) {
    c = Math.floor(Math.random() * (p + 1));
    tmp = items[c]; items[c] = items[p]; items[p] = tmp;
  }

  const board = $("#board");
  board.innerHTML = "";
  var n = 0;
  for (var i = 0; i < r; i++) {
    const tr = document.createElement("tr");
    for (var j = 0; j < l; j++) {
      const td = document.createElement("td");
      const emoji = items[n];
      td.innerHTML = `
        <div class="inner">
          <div class="front"></div>
          <div class="back">${emoji}</div>
        </div>
      `;
      // capture the inner element directly — no closure bug
      const innerEl = td.querySelector(".inner");
      const backEl  = td.querySelector(".back");
      innerEl.dataset.emoji = emoji;
      innerEl.dataset.matched = "0";
      td.addEventListener("click", function() { change(innerEl, backEl); });
      tr.appendChild(td);
      n++;
    }
    board.appendChild(tr);
  }

  $("#ol").style.display = "none";
  $("#ol").innerHTML = "";

  // reset flip state
  firstCard = null;
  turn = 0;
}

var firstCard = null;

function change(innerEl, backEl) {
  // ignore if: animating, already matched, or clicking same card twice
  if (turn === 2) return;
  if (innerEl.dataset.matched === "1") return;
  if (innerEl === firstCard) return;

  // flip it
  innerEl.style.transform = flip;

  if (!firstCard) {
    // first card
    firstCard = innerEl;
    turn = 1;
  } else {
    // second card
    turn = 2;
    const firstEmoji  = firstCard.dataset.emoji;
    const secondEmoji = innerEl.dataset.emoji;

    if (firstEmoji === secondEmoji) {
      // match!
      firstCard.dataset.matched = "1";
      innerEl.dataset.matched   = "1";
      rem--;
      firstCard = null;
      setTimeout(function() {
        turn = 0;
        moves++;
        $("#moves").textContent = "Moves: " + moves;
        if (rem === 0) finish();
      }, 400);
    } else {
      // no match — flip both back
      var f = firstCard; // capture for timeout
      setTimeout(function() {
        f.style.transform       = flipBack;
        innerEl.style.transform = flipBack;
        firstCard = null;
        turn = 0;
        moves++;
        $("#moves").textContent = "Moves: " + moves;
      }, 850);
    }
  }
}

function finish() {
  clearInterval(timeInt);
  let totalTime = (min === 0)
    ? `${sec} seconds`
    : `${min} minute(s) and ${sec} second(s)`;
  $("#ol").style.display = "grid";
  $("#ol").innerHTML = `
    <div id="iol">
      <h2>Quest Complete! 🎓</h2>
      <p><b>${activeQuest.title}</b> — ${activeQuest.text}</p>
      <p>You completed <b>${mode}</b> in <b>${moves}</b> moves.<br>
      Time: <b>${totalTime}</b></p>
      <button onclick="start(3,4)">3 × 4</button>
      <button onclick="start(4,4)">4 × 4</button>
      <button onclick="start(4,5)">4 × 5</button>
      <button onclick="start(5,6)">5 × 6</button>
      <button onclick="location.reload()">Full Restart</button>
    </div>
  `;
}
