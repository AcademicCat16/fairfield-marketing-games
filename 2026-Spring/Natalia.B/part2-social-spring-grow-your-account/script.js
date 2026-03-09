// ======= Game State =======
let timeLeft = 60;
let goal = 250;
let followers = 0;
let engagement = 0;
let posts = 0;
let streak = 0;
let bestStreak = 0;
let boostActive = false;
let boostTime = 0;
let boostsUsed = 0;
let difficulty = "normal";
let timerId = null;
let tickId = null;

const arena = document.getElementById("arena");

// ======= UI =======
const timeText      = document.getElementById("timeText");
const goalText      = document.getElementById("goalText");
const followersText = document.getElementById("followersText");
const engagementText= document.getElementById("engagementText");
const streakText    = document.getElementById("streakText");
const progressText  = document.getElementById("progressText");
const progressBar   = document.getElementById("progressBar");
const boostText     = document.getElementById("boostText");
const boostBar      = document.getElementById("boostBar");
const postBtn       = document.getElementById("postBtn");
const boostBtn      = document.getElementById("boostBtn");
const resetBtn      = document.getElementById("resetBtn");
const toast         = document.getElementById("toast");
const toastMsg      = document.getElementById("toastMsg");
const toastTag      = document.getElementById("toastTag");
const modalBackdrop = document.getElementById("modalBackdrop");
const endTitle      = document.getElementById("endTitle");
const endSubtitle   = document.getElementById("endSubtitle");
const kpiFollowers  = document.getElementById("kpiFollowers");
const kpiPosts      = document.getElementById("kpiPosts");
const kpiStreak     = document.getElementById("kpiStreak");
const kpiBoosts     = document.getElementById("kpiBoosts");
const playAgainBtn  = document.getElementById("playAgainBtn");
const closeBtn      = document.getElementById("closeBtn");

// ======= Difficulty =======
document.getElementById("easyBtn").addEventListener("click",   () => setDifficulty("easy"));
document.getElementById("normalBtn").addEventListener("click", () => setDifficulty("normal"));
document.getElementById("hardBtn").addEventListener("click",   () => setDifficulty("hard"));

function setDifficulty(level) {
  difficulty = level;
  if (level === "easy")   { timeLeft = 75; goal = 220; }
  if (level === "normal") { timeLeft = 60; goal = 250; }
  if (level === "hard")   { timeLeft = 55; goal = 300; }
  resetGame(true);
}

// ======= Helpers =======
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function showFloat(text, good = true) {
  const el = document.createElement("div");
  el.className = "floating";
  el.textContent = text;
  el.style.left   = rand(20, arena.clientWidth - 120) + "px";
  el.style.bottom = rand(25, 70) + "px";
  el.style.color  = good ? "var(--good)" : "var(--bad)";
  arena.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

let toastTimeout = null;
function showToast(message, type = "info") {
  toastMsg.textContent = message;
  toastTag.className = "tag";
  if (type === "good") { toastTag.classList.add("good"); toastTag.textContent = "BOOST"; }
  else if (type === "bad") { toastTag.classList.add("bad"); toastTag.textContent = "RISK"; }
  else { toastTag.textContent = "UPDATE"; }
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("show"), 2200);
}

function updateUI() {
  timeText.textContent       = timeLeft;
  goalText.textContent       = goal;
  followersText.textContent  = followers;
  engagementText.textContent = engagement;
  streakText.textContent     = streak;
  progressText.textContent   = `${followers} / ${goal}`;

  const pct = clamp((followers / goal) * 100, 0, 100);
  progressBar.style.width = pct + "%";

  if (boostActive) {
    boostText.textContent = `Active (${Math.ceil(boostTime / 1000)}s)`;
    const bpct = clamp((boostTime / 6000) * 100, 0, 100);
    boostBar.style.width = bpct + "%";
  } else {
    boostText.textContent = "Inactive";
    boostBar.style.width  = "0%";
  }

  const running = isRunning();
  boostBtn.disabled = engagement < 30 || !running;
  boostBtn.classList.toggle("disabled", engagement < 30 || !running);
  postBtn.disabled = !running;
  postBtn.classList.toggle("disabled", !running);
}

function isRunning() {
  return timeLeft > 0 && followers < goal && !modalBackdrop.classList.contains("show");
}

// ======= Timers =======
function startTimers() {
  clearInterval(timerId);
  clearInterval(tickId);

  timerId = setInterval(() => {
    if (timeLeft <= 0) return;
    timeLeft--;
    maybeTriggerEvent();
    if (timeLeft <= 0) endGame(false);
    updateUI();
  }, 1000);

  tickId = setInterval(() => {
    if (boostActive) {
      boostTime -= 100;
      if (boostTime <= 0) {
        boostActive = false;
        boostTime   = 0;
        showToast("Boost ended. Back to organic reach.", "info");
      }
      updateUI();
    }
  }, 100);
}

// Streak decay
setInterval(() => {
  if (!isRunning()) return;
  if (streak > 0) {
    streak = Math.max(0, streak - 1);
    updateUI();
  }
}, 2200);

// ======= Game Mechanics =======
function baseGains() {
  if (difficulty === "easy") return { f: rand(6, 10), e: rand(4, 7) };
  if (difficulty === "hard") return { f: rand(4, 8),  e: rand(3, 6) };
  return { f: rand(5, 9), e: rand(3, 7) };
}

function post() {
  if (!isRunning()) return;
  posts++;
  streak++;
  bestStreak = Math.max(bestStreak, streak);

  const gains       = baseGains();
  const streakBonus = Math.floor(streak / 3);
  const mult        = boostActive ? 2.2 : 1;
  const algoSwing   = rand(-1, 2);

  let gainedFollowers  = Math.max(1, Math.round((gains.f + streakBonus + algoSwing) * mult));
  let gainedEngagement = Math.max(1, Math.round((gains.e + Math.floor(streakBonus / 2)) * (boostActive ? 1.6 : 1)));

  followers  += gainedFollowers;
  engagement += gainedEngagement;

  showFloat(`+${gainedFollowers} followers`, true);
  showFloat(`+${gainedEngagement} engagement`, true);

  if (followers >= goal) {
    followers = goal;
    endGame(true);
  }
  updateUI();
}

function boost() {
  if (engagement < 30 || !isRunning()) return;
  engagement  -= 30;
  boostActive  = true;
  boostTime    = 6000;
  boostsUsed++;
  showToast("Ad campaign live! Post fast for max growth.", "good");
  updateUI();
}

function maybeTriggerEvent() {
  if (!isRunning()) return;
  const chance = difficulty === "easy" ? 0.18 : difficulty === "hard" ? 0.28 : 0.22;
  if (Math.random() > chance) return;

  const events = [
    { type:"good", msg:"Trending audio hits — your reach spikes!",        f:+rand(10,18), e:+rand(8,14)  },
    { type:"good", msg:"Collab post goes semi-viral!",                     f:+rand(12,20), e:+rand(10,16) },
    { type:"good", msg:"Perfect posting time — engagement surges.",        f:+rand(8,14),  e:+rand(10,18) },
    { type:"bad",  msg:"Algorithm change — organic reach dips.",           f:-rand(6,12),  e:-rand(4,8)   },
    { type:"bad",  msg:"Content fatigue — audience slows down.",           f:-rand(5,10),  e:-rand(3,7)   },
    { type:"bad",  msg:"Bad hashtag choice — low discovery.",              f:-rand(4,9),   e:-rand(2,6)   },
    { type:"info", msg:"Audience insights updated — adapt your strategy.", f:+rand(0,6),   e:+rand(0,8)   },
  ];

  const ev = events[rand(0, events.length - 1)];
  followers  = clamp(followers  + ev.f, 0, goal);
  engagement = clamp(engagement + ev.e, 0, 99999);

  showFloat((ev.f >= 0 ? "+" : "") + ev.f + " followers",  ev.f >= 0);
  showFloat((ev.e >= 0 ? "+" : "") + ev.e + " engagement", ev.e >= 0);
  showToast(ev.msg, ev.type);

  if (ev.type === "bad" && streak > 0) {
    streak = Math.floor(streak * 0.5);
    showToast("Streak disrupted! Keep posting to rebuild.", "bad");
  }

  if (followers >= goal) {
    followers = goal;
    endGame(true);
  }
  updateUI();
}

function endGame(won) {
  clearInterval(timerId);
  clearInterval(tickId);
  postBtn.disabled  = true;
  boostBtn.disabled = true;
  modalBackdrop.classList.add("show");
  endTitle.textContent    = won ? "You hit the goal 🎉" : "Time's up ⏰";
  endSubtitle.textContent = won
    ? "Nice! You grew the account by balancing organic posts + paid boosts."
    : "Try saving engagement for boosts and posting rapidly during boost windows.";
  kpiFollowers.textContent = followers;
  kpiPosts.textContent     = posts;
  kpiStreak.textContent    = bestStreak;
  kpiBoosts.textContent    = boostsUsed;
}

function resetGame(keepDifficulty = false) {
  if (!keepDifficulty) { difficulty = "normal"; timeLeft = 60; goal = 250; }
  followers = engagement = posts = streak = bestStreak = boostsUsed = 0;
  boostActive = false;
  boostTime   = 0;
  modalBackdrop.classList.remove("show");
  updateUI();
  startTimers();
}

// ======= Button Events =======
postBtn.addEventListener("click", post);
boostBtn.addEventListener("click", boost);
resetBtn.addEventListener("click", () => resetGame(true));
playAgainBtn.addEventListener("click", () => resetGame(true));
closeBtn.addEventListener("click", () => modalBackdrop.classList.remove("show"));

// Keyboard support
window.addEventListener("keydown", (e) => {
  if (e.key === " ")               { e.preventDefault(); post(); }
  if (e.key.toLowerCase() === "b") boost();
  if (e.key.toLowerCase() === "r") resetGame(true);
});

// Start
updateUI();
startTimers();
