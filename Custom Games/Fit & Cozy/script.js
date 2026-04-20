var state = {
  day: 1, coins: 50, score: 0,
  energy: 70, fitness: 30, mood: 60,
  actsDoneToday: [],
  upgrades: { mat: false, bottle: false, shoes: false, headphones: false }
};

var ACTIVITIES = [
  { id:'run',  emoji:'🏃', name:'Morning Run',    desc:'+12 fitness, -15 energy, +8 mood',  cost:0,  fitness:12, energy:-15, mood:8,  coins:10 },
  { id:'yoga', emoji:'🧘', name:'Yoga Session',   desc:'+5 fitness, -5 energy, +15 mood',   cost:0,  fitness:5,  energy:-5,  mood:15, coins:6  },
  { id:'lift', emoji:'🏋️', name:'Weight Lift',    desc:'+18 fitness, -20 energy, +10 mood', cost:0,  fitness:18, energy:-20, mood:10, coins:14 },
  { id:'swim', emoji:'🏊', name:'Swimming',       desc:'+14 fitness, -12 energy, +12 mood', cost:0,  fitness:14, energy:-12, mood:12, coins:12 },
  { id:'walk', emoji:'🚶', name:'Chill Walk',     desc:'+4 fitness, -3 energy, +10 mood',   cost:0,  fitness:4,  energy:-3,  mood:10, coins:4  },
  { id:'nap',  emoji:'😴', name:'Power Nap',      desc:'+0 fitness, +25 energy, +5 mood',   cost:0,  fitness:0,  energy:25,  mood:5,  coins:2  },
  { id:'meal', emoji:'🥗', name:'Healthy Meal',   desc:'+3 fitness, +10 energy, +8 mood',   cost:5,  fitness:3,  energy:10,  mood:8,  coins:0  },
  { id:'game', emoji:'🏀', name:'Play Sports',    desc:'+10 fitness, -10 energy, +20 mood', cost:0,  fitness:10, energy:-10, mood:20, coins:8  }
];

var SHOP = [
  { id:'mat',        emoji:'🧘', name:'Yoga Mat',     cost:20, desc:'Yoga gives +5 extra mood'   },
  { id:'bottle',     emoji:'💧', name:'Water Bottle', cost:15, desc:'All activities +5 energy'   },
  { id:'shoes',      emoji:'👟', name:'Running Shoes',cost:30, desc:'Run & walk give +5 fitness' },
  { id:'headphones', emoji:'🎧', name:'Headphones',   cost:25, desc:'+3 coins per activity'      }
];

function clamp(v) { return Math.max(0, Math.min(100, Math.round(v))); }

function renderBars() {
  var stats = ['energy', 'fitness', 'mood'];
  for (var i = 0; i < stats.length; i++) {
    var s = stats[i];
    document.getElementById(s + 'Bar').style.width = state[s] + '%';
    document.getElementById(s + 'Val').textContent = state[s] + '%';
  }
  var avatars = ['🧍','🚶','🏃','🤸','💪','🦸'];
  var idx = Math.min(5, Math.floor(state.fitness / 20));
  document.getElementById('avatar').textContent = avatars[idx];
  document.getElementById('dayNum').textContent  = state.day;
  document.getElementById('coins').textContent   = state.coins;
  document.getElementById('score').textContent   = state.score;
}

function renderActivities() {
  var grid = document.getElementById('actGrid');
  grid.innerHTML = '';
  for (var i = 0; i < ACTIVITIES.length; i++) {
    (function(act) {
      var done    = state.actsDoneToday.indexOf(act.id) !== -1;
      var costStr = act.cost > 0 ? '<span class="act-desc" style="color:#e07a5f">costs ' + act.cost + ' coins</span>' : '';
      var btn     = document.createElement('button');
      btn.className = 'act-btn';
      btn.disabled  = done || (state.energy <= 0 && act.energy < 0);
      btn.innerHTML =
        '<span class="act-emoji">' + act.emoji + '</span>' +
        '<span class="act-name">'  + act.name  + '</span>' +
        '<span class="act-desc">'  + act.desc  + '</span>' +
        costStr;
      btn.addEventListener('click', function() { doActivity(act); });
      grid.appendChild(btn);
    })(ACTIVITIES[i]);
  }
}

function renderShop() {
  var grid = document.getElementById('shopGrid');
  grid.innerHTML = '';
  for (var i = 0; i < SHOP.length; i++) {
    (function(item) {
      var owned   = state.upgrades[item.id];
      var canBuy  = !owned && state.coins >= item.cost;
      var div     = document.createElement('div');
      div.className = 'shop-item';
      div.innerHTML =
        '<div class="shop-item-top">' +
          '<span class="shop-name">' + item.emoji + ' ' + item.name + '</span>' +
          '<span class="shop-cost">' + (owned ? '✓' : item.cost + 'c') + '</span>' +
        '</div>' +
        '<div class="shop-desc">' + item.desc + '</div>';
      var buyBtn = document.createElement('button');
      buyBtn.className = 'buy-btn';
      buyBtn.disabled  = !canBuy;
      buyBtn.textContent = owned ? 'Owned' : 'Buy';
      buyBtn.addEventListener('click', function() { buyItem(item.id, item.cost); });
      div.appendChild(buyBtn);
      grid.appendChild(div);
    })(SHOP[i]);
  }
}

function doActivity(act) {
  if (state.actsDoneToday.indexOf(act.id) !== -1) return;
  if (act.cost > 0 && state.coins < act.cost) { showToast('Not enough coins!'); return; }
  if (state.energy <= 0 && act.energy < 0)    { showToast('Too tired! Take a nap first.'); return; }

  var fitBonus    = 0, energyBonus = 0, moodBonus = 0, coinsBonus = act.coins;
  if (state.upgrades.bottle     && act.energy < 0)                          energyBonus += 5;
  if (state.upgrades.shoes      && (act.id === 'run' || act.id === 'walk')) fitBonus    += 5;
  if (state.upgrades.mat        && act.id === 'yoga')                       moodBonus   += 5;
  if (state.upgrades.headphones)                                             coinsBonus  += 3;

  if (act.cost > 0) state.coins -= act.cost;
  state.fitness = clamp(state.fitness + act.fitness + fitBonus);
  state.energy  = clamp(state.energy  + act.energy  + energyBonus);
  state.mood    = clamp(state.mood    + act.mood     + moodBonus);
  state.coins   += coinsBonus;
  state.score   += act.fitness + Math.abs(act.mood);
  state.actsDoneToday.push(act.id);

  var avatar = document.getElementById('avatar');
  avatar.classList.add('bounce');
  setTimeout(function() { avatar.classList.remove('bounce'); }, 500);

  addLog(act.emoji + ' ' + act.name + ' done! +' + coinsBonus + ' coins');
  showToast(act.name + ' complete! 💪');
  renderBars();
  renderActivities();
  renderShop();
}

function buyItem(id, cost) {
  if (state.upgrades[id] || state.coins < cost) return;
  state.coins -= cost;
  state.upgrades[id] = true;
  var item = null;
  for (var i = 0; i < SHOP.length; i++) { if (SHOP[i].id === id) { item = SHOP[i]; break; } }
  if (item) addLog('🛍 Bought ' + item.emoji + ' ' + item.name);
  showToast('Upgrade unlocked!');
  renderBars();
  renderShop();
}

function nextDay() {
  if (state.actsDoneToday.length === 0) { showToast('Do at least one activity first!'); return; }
  var bonus = Math.floor((state.fitness + state.mood + state.energy) / 10);
  state.score += bonus;
  state.day++;
  state.energy = clamp(state.energy + 30);
  state.actsDoneToday = [];
  addLog('🌙 Day ' + (state.day - 1) + ' complete! Bonus: +' + bonus + ' score. New day started.');
  showToast('Day ' + (state.day - 1) + ' done! Rest bonus +' + bonus + ' score');
  renderBars();
  renderActivities();
  renderShop();
}

function addLog(msg) {
  var list = document.getElementById('logList');
  var item = document.createElement('div');
  item.className = 'log-item';
  item.innerHTML = msg + '<span class="log-time">Day ' + state.day + '</span>';
  list.insertBefore(item, list.firstChild);
}

function showToast(msg) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function() { t.classList.remove('show'); }, 2000);
}

document.getElementById('dayBtn').addEventListener('click', nextDay);

renderBars();
renderActivities();
renderShop();
addLog('🌿 Welcome to Fit & Cozy! Start your fitness journey, George!');
