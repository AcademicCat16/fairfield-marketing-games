(() => {
  // ── Constants ──
  const COLORS     = ['R','Y','G','B'];
  const COLOR_NAME = { R:'Red', Y:'Yellow', G:'Green', B:'Blue', W:'Wild' };
  const VALUES     = [0,1,2,3,4,5,6,7,8,9,'Skip','Reverse','Draw2'];
  const WILD_CARDS = ['Wild','WildDraw4'];

  // ── DOM ──
  const elPlayers      = document.getElementById('players');
  const elStatus       = document.getElementById('status');
  const elDeckCount    = document.getElementById('deckCount');
  const elDiscardTop   = document.getElementById('discardTop');
  const elCurrentColor = document.getElementById('currentColor');
  const elHand         = document.getElementById('hand');
  const elModal        = document.getElementById('modal');
  const btnNew         = document.getElementById('newGameBtn');
  const btnDraw        = document.getElementById('drawBtn');
  const btnDeck        = document.getElementById('deckBtn');
  const btnCancelColor = document.getElementById('cancelColorBtn');

  let state        = null;
  let pendingWild  = null;

  // ── Deck builder ──
  function makeDeck() {
    const deck = [];
    for (const c of COLORS) {
      for (const v of VALUES) {
        deck.push({ color: c, value: v });
        if (v !== 0) deck.push({ color: c, value: v });
      }
    }
    for (const w of WILD_CARDS) {
      for (let i = 0; i < 4; i++) deck.push({ color: 'W', value: w });
    }
    return shuffle(deck);
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ── Card helpers ──
  function cardText(card) {
    if (card.color === 'W') return card.value === 'WildDraw4' ? '+4' : '★';
    if (card.value === 'Skip')    return '🚫';
    if (card.value === 'Reverse') return '↺';
    if (card.value === 'Draw2')   return '+2';
    return String(card.value);
  }

  function cardShort(card) {
    if (card.color === 'W') return card.value;
    return `${COLOR_NAME[card.color]} ${cardText(card)}`;
  }

  function isPlayable(card, top, currentColor) {
    if (card.color === 'W') return true;
    if (card.color === currentColor) return true;
    if (top.color !== 'W' && card.color === top.color) return true;
    if (top.color !== 'W' && card.value === top.value) return true;
    return false;
  }

  function replenishDeck() {
    if (state.deck.length < 4 && state.discard.length > 1) {
      const top = state.discard.pop();
      state.deck = shuffle(state.discard);
      state.discard = [top];
    }
  }

  // ── Game logic ──
  function drawCard(playerIndex) {
    replenishDeck();
    if (state.deck.length === 0) return null;
    const card = state.deck.pop();
    state.players[playerIndex].hand.push(card);
    return card;
  }

  function playCard(playerIndex, handIndex, chosenColor) {
    const player = state.players[playerIndex];
    const card   = player.hand.splice(handIndex, 1)[0];
    state.discard.push(card);

    if (card.color === 'W') {
      state.currentColor = chosenColor || 'R';
    } else {
      state.currentColor = card.color;
    }

    const n = state.players.length;

    // Special actions
    if (card.value === 'Skip') {
      state.turn = (state.turn + 2) % n;
      log(`${player.name} played Skip.`);
    } else if (card.value === 'Reverse') {
      state.turn = (state.turn + 2) % n; // with 3 players reverse = skip
      log(`${player.name} played Reverse.`);
    } else if (card.value === 'Draw2') {
      const next = (state.turn + 1) % n;
      drawCard(next); drawCard(next);
      log(`${player.name} played Draw 2. ${state.players[next].name} draws 2.`);
      state.turn = (state.turn + 2) % n;
    } else if (card.value === 'WildDraw4') {
      const next = (state.turn + 1) % n;
      for (let i = 0; i < 4; i++) drawCard(next);
      log(`${player.name} played Wild Draw 4. ${state.players[next].name} draws 4. Color: ${COLOR_NAME[state.currentColor]}.`);
      state.turn = (state.turn + 2) % n;
    } else if (card.value === 'Wild') {
      log(`${player.name} played Wild. Color: ${COLOR_NAME[state.currentColor]}.`);
      state.turn = (state.turn + 1) % n;
    } else {
      log(`${player.name} played ${cardShort(card)}.`);
      state.turn = (state.turn + 1) % n;
    }

    // Win check
    if (player.hand.length === 0) {
      state.over = true;
      log(`🎉 ${player.name} wins!`);
    }
  }

  function log(msg) {
    state.log.unshift(msg);
    if (state.log.length > 6) state.log.pop();
  }

  // ── CPU logic ──
  function cpuTurn() {
    const i      = state.turn;
    const player = state.players[i];
    const top    = state.discard[state.discard.length - 1];

    // Find playable card
    let idx = player.hand.findIndex(c => isPlayable(c, top, state.currentColor));

    if (idx === -1) {
      // Draw and try once
      const drawn = drawCard(i);
      log(`${player.name} draws.`);
      if (drawn && isPlayable(drawn, top, state.currentColor)) {
        idx = player.hand.length - 1;
      } else {
        state.turn = (state.turn + 1) % state.players.length;
        render();
        setTimeout(tick, 500);
        return;
      }
    }

    const card = player.hand[idx];
    let chosenColor = null;
    if (card.color === 'W') {
      // CPU picks most common color in hand
      const freq = { R:0, Y:0, G:0, B:0 };
      player.hand.forEach(c => { if (c.color !== 'W') freq[c.color]++; });
      chosenColor = Object.entries(freq).sort((a,b) => b[1]-a[1])[0][0];
    }

    playCard(i, idx, chosenColor);
    render();
    if (!state.over) setTimeout(tick, 600);
  }

  // ── Human actions ──
  function humanDraw() {
    if (!state || state.over || state.turn !== 0) return;
    const card = drawCard(0);
    if (card) log(`You drew ${cardShort(card)}.`);
    state.turn = (state.turn + 1) % state.players.length;
    render();
    setTimeout(tick, 450);
  }

  function openColorModal(handIndex) {
    pendingWild = { handIndex };
    elModal.classList.remove('hidden');
  }

  function closeColorModal() {
    pendingWild = null;
    elModal.classList.add('hidden');
  }

  // ── Render ──
  function render() {
    if (!state) return;
    const top = state.discard[state.discard.length - 1];

    // Deck count
    elDeckCount.textContent = state.deck.length;

    // Discard top
    const cc = top.color === 'W' ? 'cW' : 'c' + top.color;
    elDiscardTop.className  = `card big ${cc}`;
    elDiscardTop.innerHTML  = `
      <div class="corner">${top.color === 'W' ? 'WILD' : COLOR_NAME[top.color].toUpperCase()}</div>
      <div class="center">${cardText(top)}</div>
      <div class="type">${top.color === 'W' ? 'WILD' : 'MATCH'}</div>
    `;

    // Current color pill
    const pillColors = { R:'#e05', Y:'#ca0', G:'#0b5', B:'#07e' };
    elCurrentColor.textContent = COLOR_NAME[state.currentColor] || '—';
    elCurrentColor.style.background = state.currentColor !== 'W'
      ? (pillColors[state.currentColor] + '44') : '';

    // Players list
    elPlayers.innerHTML = '';
    const list = document.createElement('div');
    list.className = 'playersList';
    state.players.forEach((p, i) => {
      const row = document.createElement('div');
      row.className = 'playerRow' + (i === state.turn && !state.over ? ' active' : '');
      row.innerHTML = `
        <span class="name">${escHtml(p.name)}${p.isCPU ? '<span class="badge">CPU</span>' : ''}</span>
        <span class="cards">${p.hand.length} card${p.hand.length !== 1 ? 's' : ''}</span>
      `;
      list.appendChild(row);
    });
    elPlayers.appendChild(list);

    // Status / log
    const turnName = state.players[state.turn].name;
    elStatus.innerHTML = `
      <div><b>Turn:</b> ${escHtml(turnName)}${state.players[state.turn].isCPU && !state.over ? ' <em>(thinking…)</em>' : ''}</div>
      ${state.over ? `<div style="margin-top:8px;font-size:14px;font-weight:900;color:#fff;">${escHtml(state.log[0])}</div>` : ''}
      <div style="margin-top:8px;"><b>Log</b></div>
      <div>${state.log.slice(0,5).map(x => `• ${escHtml(x)}`).join('<br>')}</div>
    `;

    // Hand
    elHand.innerHTML = '';
    const human = state.players[0];
    human.hand.forEach((card, i) => {
      const playable = !state.over && state.turn === 0 && isPlayable(card, top, state.currentColor);
      const div = document.createElement('div');
      div.className = `card ${card.color === 'W' ? 'cW' : 'c'+card.color} ${playable ? 'playable' : 'disabled'}`;
      div.innerHTML = `
        <div class="corner">${card.color === 'W' ? 'WILD' : COLOR_NAME[card.color].toUpperCase()}</div>
        <div class="center">${cardText(card)}</div>
        <div class="type">${typeof card.value === 'number' ? 'NUMBER' : 'ACTION'}</div>
      `;
      div.title = cardShort(card);
      div.addEventListener('click', () => {
        if (state.over || state.turn !== 0 || !playable) return;
        if (card.color === 'W') { openColorModal(i); return; }
        playCard(0, i);
        render();
        setTimeout(tick, 450);
      });
      elHand.appendChild(div);
    });

    // Button states
    const humanTurn = !state.over && state.turn === 0;
    btnDraw.disabled = !humanTurn;
    btnDeck.disabled = !humanTurn;
  }

  function escHtml(s) {
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function tick() {
    if (!state || state.over) return;
    if (state.players[state.turn].isCPU) cpuTurn();
  }

  // ── Start game ──
  function startGame() {
    closeColorModal();
    const deck = makeDeck();
    const players = [
      { name: 'You',   hand: [], isCPU: false },
      { name: 'CPU 1', hand: [], isCPU: true  },
      { name: 'CPU 2', hand: [], isCPU: true  },
    ];
    for (let r = 0; r < 7; r++) {
      for (const p of players) p.hand.push(deck.pop());
    }
    let first = deck.pop();
    while (first.color === 'W') { deck.unshift(first); shuffle(deck); first = deck.pop(); }
    state = {
      deck,
      discard: [first],
      currentColor: first.color,
      players,
      turn: 0,
      over: false,
      log: [`Game start! Top card: ${cardShort(first)}.`]
    };
    render();
  }

  // ── Event listeners ──
  btnNew.addEventListener('click',  startGame);
  btnDraw.addEventListener('click', humanDraw);
  btnDeck.addEventListener('click', humanDraw);

  document.querySelectorAll('.colorBtn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!pendingWild) return;
      const color = btn.getAttribute('data-color');
      const i     = pendingWild.handIndex;
      if (!state.players[0].hand[i]) return;
      playCard(0, i, color);
      log(`You chose ${COLOR_NAME[color]}.`);
      closeColorModal();
      render();
      setTimeout(tick, 450);
    });
  });

  btnCancelColor.addEventListener('click', closeColorModal);

  // Start!
  startGame();
})();
