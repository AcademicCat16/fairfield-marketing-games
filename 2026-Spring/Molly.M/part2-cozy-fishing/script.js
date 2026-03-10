// Cozy Fishing — spots + reel animation
// Loop: choose spot -> cast -> wait for nibble -> reel -> sell -> upgrade

const $ = (id) => document.getElementById(id);

const ui = {
  water: $("water"),
  line: $("line"),
  bobber: $("bobber"),
  reelFish: $("reelFish"),

  coins: $("coins"),
  xp: $("xp"),
  streak: $("streak"),

  spotSelect: $("spotSelect"),
  castBtn: $("castBtn"),
  reelBtn: $("reelBtn"),
  sellBtn: $("sellBtn"),
  upgradeBtn: $("upgradeBtn"),
  resetBtn: $("resetBtn"),
  upgradeCost: $("upgradeCost"),

  catchText: $("catchText"),
  log: $("log"),

  patienceBar: $("patienceBar"),
  luckBar: $("luckBar"),
  rodBar: $("rodBar")
};

const state = {
  coins: 0,
  xp: 0,
  streak: 0,
  rodLevel: 1,

  spot: "pond",

  patience: 0,
  waiting: false,
  nibble: false,
  currentCatch: null,

  timers: {
    nibbleTimeout: null,
    patienceInterval: null
  }
};

function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

function logLine(msg){
  const div = document.createElement("div");
  div.textContent = msg;
  ui.log.prepend(div);
}

function getUpgradeCost(){
  const base = 15;
  return Math.floor(base * (1 + (state.rodLevel - 1) * 0.65));
}

/**
 * Spot configs:
 * - themeClass changes water background
 * - loot tables differ
 * - base odds differ
 */
const SPOTS = {
  pond: {
    label: "Pond",
    themeClass: "spot-pond",
    nibbleMin: 1200,
    nibbleMax: 4200,
    baseLuck: 0.18, // easier
    loot: {
      junk: [
        { name: "Old Leaf", emoji: "🍃", coins: 0, xp: 1 },
        { name: "Tiny Pebble", emoji: "🪨", coins: 0, xp: 1 },
        { name: "Rusty Can", emoji: "🥫", coins: 1, xp: 1 }
      ],
      common: [
        { name: "Goldfish", emoji: "🐟", coins: 3, xp: 3 },
        { name: "Pond Carp", emoji: "🐟", coins: 4, xp: 3 },
        { name: "Lily Koi", emoji: "🐠", coins: 5, xp: 4 }
      ],
      rare: [
        { name: "Shimmer Koi", emoji: "✨", coins: 10, xp: 8 },
        { name: "Sunset Fish", emoji: "🌅", coins: 11, xp: 9 }
      ],
      legendary: [
        { name: "Star Koi", emoji: "⭐", coins: 24, xp: 20 }
      ]
    }
  },
  river: {
    label: "River",
    themeClass: "spot-river",
    nibbleMin: 900,
    nibbleMax: 3800,
    baseLuck: 0.14, // balanced
    loot: {
      junk: [
        { name: "Tangled Line", emoji: "🧵", coins: 0, xp: 1 },
        { name: "Driftwood", emoji: "🪵", coins: 1, xp: 1 }
      ],
      common: [
        { name: "Trout", emoji: "🐟", coins: 4, xp: 4 },
        { name: "Salmon", emoji: "🐠", coins: 6, xp: 5 }
      ],
      rare: [
        { name: "Silver Pike", emoji: "🥈", coins: 13, xp: 10 },
        { name: "Moonfish", emoji: "🌙", coins: 14, xp: 11 }
      ],
      legendary: [
        { name: "River Spirit Fish", emoji: "🫧", coins: 30, xp: 26 }
      ]
    }
  },
  ocean: {
    label: "Ocean",
    themeClass: "spot-ocean",
    nibbleMin: 800,
    nibbleMax: 3500,
    baseLuck: 0.10, // harder, better rewards
    loot: {
      junk: [
        { name: "Seaweed Clump", emoji: "🌿", coins: 0, xp: 1 },
        { name: "Broken Shell", emoji: "🐚", coins: 1, xp: 1 }
      ],
      common: [
        { name: "Mackerel", emoji: "🐟", coins: 6, xp: 5 },
        { name: "Tuna", emoji: "🐟", coins: 7, xp: 6 }
      ],
      rare: [
        { name: "Pearl Eel", emoji: "🦪", coins: 18, xp: 14 },
        { name: "Coral Fish", emoji: "🪸", coins: 19, xp: 14 }
      ],
      legendary: [
        { name: "Mythic Marlin", emoji: "🐬", coins: 36, xp: 28 },
        { name: "Starfin", emoji: "⭐", coins: 40, xp: 30 }
      ]
    }
  }
};

function setSpot(spotKey){
  state.spot = spotKey;

  // update water theme class
  ui.water.classList.remove("spot-pond","spot-river","spot-ocean");
  ui.water.classList.add(SPOTS[spotKey].themeClass);

  // reset current cast state (keeps it simple + avoids weird timers)
  if (state.waiting) {
    resetTimers();
    state.waiting = false;
    state.nibble = false;
    state.patience = 0;
    ui.line.classList.add("hidden");
    ui.bobber.classList.add("hidden");
    ui.catchText.textContent = `Switched to the ${SPOTS[spotKey].label}. Cast when ready.`;
    logLine(`📍 Moved to ${SPOTS[spotKey].label}.`);
  } else {
    ui.catchText.textContent = `You’re at the ${SPOTS[spotKey].label}. Cast when ready.`;
    logLine(`📍 Moved to ${SPOTS[spotKey].label}.`);
  }

  render();
}

function render(){
  ui.coins.textContent = state.coins;
  ui.xp.textContent = state.xp;
  ui.streak.textContent = state.streak;

  ui.patienceBar.style.width = `${clamp(state.patience, 0, 100)}%`;

  // luck bar: base + rod level
  const base = SPOTS[state.spot].baseLuck;
  const rod = 0.06 * state.rodLevel; // +6% per level
  const luckPct = clamp((base + rod) * 100, 0, 100);
  ui.luckBar.style.width = `${luckPct}%`;

  ui.rodBar.style.width = `${clamp(state.rodLevel * 20, 0, 100)}%`;

  ui.castBtn.disabled = state.waiting;
  ui.reelBtn.disabled = !state.waiting;
  ui.sellBtn.disabled = !state.currentCatch;
  ui.upgradeBtn.disabled = state.coins < getUpgradeCost();
  ui.upgradeCost.textContent = getUpgradeCost();
}

function resetTimers(){
  if (state.timers.nibbleTimeout) clearTimeout(state.timers.nibbleTimeout);
  if (state.timers.patienceInterval) clearInterval(state.timers.patienceInterval);
  state.timers.nibbleTimeout = null;
  state.timers.patienceInterval = null;
}

function startPatienceTick(){
  state.patience = 0;
  state.timers.patienceInterval = setInterval(() => {
    state.patience = clamp(state.patience + 3, 0, 100);
    render();
  }, 250);
}

function castLine(){
  if (state.waiting) return;

  state.waiting = true;
  state.nibble = false;
  state.currentCatch = null;

  ui.line.classList.remove("hidden");
  ui.bobber.classList.remove("hidden");

  ui.catchText.textContent = "You cast your line… cozy waters, calm mind. 🌊";
  logLine("🎣 Cast line.");

  resetTimers();
  startPatienceTick();

  const spotCfg = SPOTS[state.spot];

  // nibble timing, rod makes it slightly quicker
  const rodSpeed = state.rodLevel * 90;
  const min = Math.max(700, spotCfg.nibbleMin - rodSpeed);
  const max = Math.max(1400, spotCfg.nibbleMax - rodSpeed);

  const timeToNibble = Math.floor(min + Math.random() * (max - min));

  state.timers.nibbleTimeout = setTimeout(() => {
    state.nibble = true;
    ui.catchText.textContent = "Nibble! Reel now for better odds. 🎏";
    logLine("🐟 Nibble!");
    render();
  }, timeToNibble);

  render();
}

function pickFrom(list){
  return list[Math.floor(Math.random() * list.length)];
}

function rollQuality(){
  const cfg = SPOTS[state.spot];

  // Cozy math: baseLuck + rodLuck + nibble bonus + patience bonus + small streak bonus
  const base = cfg.baseLuck;
  const rodLuck = 0.06 * state.rodLevel;
  const nibbleBonus = state.nibble ? 0.22 : 0.0;
  const patienceBonus = state.patience / 500; // up to 0.20
  const streakBonus = Math.min(state.streak, 10) / 200; // up to +0.05

  const luck = clamp(base + rodLuck + nibbleBonus + patienceBonus + streakBonus, 0, 0.85);

  // Convert luck into tier weights (simple + readable)
  // More luck pushes weight toward rare/legendary.
  const wLegend = 0.02 + luck * 0.06;
  const wRare   = 0.10 + luck * 0.16;
  const wCommon = 0.48 + luck * 0.18;
  const wJunk   = Math.max(0.05, 1 - (wLegend + wRare + wCommon));

  const total = wLegend + wRare + wCommon + wJunk;
  const r = Math.random() * total;

  if (r < wLegend) return "legendary";
  if (r < wLegend + wRare) return "rare";
  if (r < wLegend + wRare + wCommon) return "common";
  return "junk";
}

function playReelAnimation(emoji){
  ui.reelFish.textContent = emoji;
  ui.reelFish.classList.remove("hidden");

  // restart CSS animation reliably
  ui.reelFish.style.animation = "none";
  void ui.reelFish.offsetHeight; // reflow
  ui.reelFish.style.animation = "";

  setTimeout(() => {
    ui.reelFish.classList.add("hidden");
  }, 600);
}

function reelIn(){
  if (!state.waiting) return;

  // stop waiting
  state.waiting = false;
  resetTimers();

  ui.line.classList.add("hidden");
  ui.bobber.classList.add("hidden");

  const quality = rollQuality();
  const loot = SPOTS[state.spot].loot[quality];
  const caught = pickFrom(loot);

  state.currentCatch = caught;
  state.xp += caught.xp;

  // streak rules
  if (quality === "junk") {
    state.streak = 0;
    ui.catchText.textContent = `You reeled in… ${caught.emoji} ${caught.name}. Still kinda cute.`;
    logLine(`🪝 Reeled in: ${caught.name} (junk). Streak reset.`);
  } else {
    state.streak += 1;
    ui.catchText.textContent = `Nice! You caught ${caught.emoji} ${caught.name} (${quality}).`;
    logLine(`🪝 Caught: ${caught.name} (${quality}). Streak: ${state.streak}`);
  }

  // reel animation (use the caught emoji)
  playReelAnimation(caught.emoji);

  // reset nibble/patience
  state.nibble = false;
  state.patience = 0;

  render();
}

function sellCatch(){
  if (!state.currentCatch) return;
  const c = state.currentCatch;

  state.coins += c.coins;
  ui.catchText.textContent = `Sold ${c.emoji} ${c.name} for ${c.coins} coins. 🪙`;
  logLine(`🪙 Sold ${c.name} (+${c.coins} coins).`);

  state.currentCatch = null;
  render();
}

function upgradeRod(){
  const cost = getUpgradeCost();
  if (state.coins < cost) return;

  state.coins -= cost;
  state.rodLevel += 1;

  ui.catchText.textContent = `Upgraded rod to Level ${state.rodLevel}! Cozy luck increased. ✨`;
  logLine(`✨ Upgraded rod to Level ${state.rodLevel} (−${cost} coins).`);

  render();
}

function resetGame(){
  resetTimers();

  state.coins = 0;
  state.xp = 0;
  state.streak = 0;
  state.rodLevel = 1;

  state.patience = 0;
  state.waiting = false;
  state.nibble = false;
  state.currentCatch = null;

  ui.log.innerHTML = "";
  ui.line.classList.add("hidden");
  ui.bobber.classList.add("hidden");
  ui.reelFish.classList.add("hidden");

  ui.catchText.textContent = `You’re at the ${SPOTS[state.spot].label}. Cast when ready.`;
  logLine("🌤️ Welcome back to the water.");

  render();
}

// ---- wire up ----
ui.spotSelect.addEventListener("change", (e) => setSpot(e.target.value));
ui.castBtn.addEventListener("click", castLine);
ui.reelBtn.addEventListener("click", reelIn);
ui.sellBtn.addEventListener("click", sellCatch);
ui.upgradeBtn.addEventListener("click", upgradeRod);
ui.resetBtn.addEventListener("click", resetGame);

// start
setSpot("pond");
resetGame();
