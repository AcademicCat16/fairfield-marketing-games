/* ============================================================
   CORNER CAFÉ & CO. - GAME LOGIC
   ============================================================ */

// ── Game State ──
const gameState = {
    money: 0,
    reputation: 0,
    followers: 0,
    currentCustomer: null,
    decorItems: [],
    rainActive: false,
    totalServed: 0
};

// ── Data ──
const drinks = [
    { name: 'Latte',             emoji: '☕' },
    { name: 'Strawberry Matcha', emoji: '🍓' },
    { name: 'Lavender Chai',     emoji: '💜' },
    { name: 'Iced Coffee',       emoji: '❄️' }
];

const customerNames = [
    'Luna','Sophie','Emma','Lily','Rose','Maya','Iris','Nova',
    'Aurora','Stella','Felix','Oliver','Kai','River'
];

const decorOptions = [
    { emoji: '✨', name: 'Fairy Lights', cost: 20 },
    { emoji: '🌸', name: 'Flowers',      cost: 15 },
    { emoji: '☕', name: 'Fancy Machine', cost: 30 },
    { emoji: '🕯️', name: 'Candles',      cost: 10 },
    { emoji: '🌿', name: 'Plants',        cost: 12 },
    { emoji: '🍃', name: 'Leaves',        cost: 8  }
];

const socialCaptions = [
    "☕✨ Just served the coziest drinks today!",
    "Our café radiates such calm vibes ✨💕",
    "Another day of cozy moments at Corner Café",
    "Come experience our aesthetic café life 💜",
    "Slow-living energy with every sip ☕",
    "Creating safe spaces, one café visit at a time",
    "The prettiest corner in town 🌸✨",
    "Aesthetic café goals achieved! 💕",
    "Found my peace at Corner Café & Co.",
    "Café life is the best life 🍓✨"
];

// ── DOM References ──
const moneyDisplay      = document.getElementById('moneyDisplay');
const reputationDisplay = document.getElementById('reputationDisplay');
const followersDisplay  = document.getElementById('followersDisplay');
const customerCard      = document.getElementById('customerCard');
const drinkOptions      = document.getElementById('drinkOptions');
const feedbackMessage   = document.getElementById('feedbackMessage');
const socialBtn         = document.getElementById('socialBtn');
const decorBtn          = document.getElementById('decorBtn');
const rainBtn           = document.getElementById('rainBtn');
const decorArea         = document.getElementById('decorArea');
const decorItems        = document.getElementById('decorItems');
const rainContainer     = document.getElementById('rainContainer');
const particlesContainer = document.querySelector('.particles-container');

// ── Init ──
function initGame() {
    createParticles(15);
    setupEventListeners();
    spawnCustomerInterval();
    updateUI();
}

// ── UI Updates ──
function updateUI() {
    moneyDisplay.textContent      = `$${gameState.money}`;
    reputationDisplay.textContent = gameState.reputation;
    followersDisplay.textContent  = gameState.followers;
}

function displayCustomer(customer) {
    const moodPct = customer.mood;
    const drinkObj = drinks.find(d => d.name === customer.favorite);
    customerCard.innerHTML = `
        <div class="customer-info" style="text-align:center;width:100%;">
            <div class="customer-name">${customer.name} 💭</div>
            <div class="customer-mood">
                Mood:
                <div class="mood-bar">
                    <div class="mood-fill" style="width:${moodPct}%"></div>
                </div>
            </div>
            <div class="customer-favorite">
                Loves: ${customer.favorite} ${drinkObj ? drinkObj.emoji : ''}
            </div>
        </div>
    `;
    drinkOptions.style.display = 'grid';
}

function clearCustomer() {
    customerCard.innerHTML = `
        <div class="customer-empty">
            <p>Waiting for a customer...</p>
            <p class="small-text">☕✨</p>
        </div>
    `;
    drinkOptions.style.display = 'none';
}

function showFeedback(message, type) {
    feedbackMessage.textContent = message;
    feedbackMessage.className = `feedback-message ${type}`;
    setTimeout(() => {
        feedbackMessage.textContent = '';
        feedbackMessage.className = 'feedback-message';
    }, 3000);
}

// ── Customer System ──
function generateCustomer() {
    return {
        name:     customerNames[Math.floor(Math.random() * customerNames.length)],
        favorite: drinks[Math.floor(Math.random() * drinks.length)].name,
        mood:     70 + Math.random() * 30
    };
}

function spawnCustomer() {
    if (!gameState.currentCustomer) {
        gameState.currentCustomer = generateCustomer();
        displayCustomer(gameState.currentCustomer);
    }
}

function spawnCustomerInterval() {
    const delay = 4000 + Math.random() * 4000;
    setTimeout(() => {
        spawnCustomer();
        spawnCustomerInterval();
    }, delay);
}

// ── Drink Serving ──
function serveDrink(drinkName) {
    if (!gameState.currentCustomer) return;

    const isCorrect = drinkName === gameState.currentCustomer.favorite;

    if (isCorrect) {
        const moneyReward = 15 + Math.floor(Math.random() * 10);
        const repReward   = 5;
        const decorBonus  = Math.floor(gameState.decorItems.length * 0.5);

        gameState.money       += moneyReward + decorBonus;
        gameState.reputation  += repReward;
        gameState.totalServed += 1;
        gameState.followers    = Math.floor(gameState.reputation / 2);

        showFeedback(
            `✨ Perfect! ${gameState.currentCustomer.name} loved it! +$${moneyReward} +${repReward} rep`,
            'success'
        );
        clearCustomer();
        gameState.currentCustomer = null;
        celebrateSuccess();
    } else {
        gameState.currentCustomer.mood -= 15;

        if (gameState.currentCustomer.mood <= 0) {
            showFeedback(`😔 ${gameState.currentCustomer.name} left disappointed...`, 'error');
            clearCustomer();
            gameState.currentCustomer = null;
        } else {
            displayCustomer(gameState.currentCustomer);
            showFeedback(`💭 That's not what ${gameState.currentCustomer.name} wanted...`, 'error');
        }
    }

    updateUI();
}

// ── Social Media ──
function postOnSocial() {
    const caption     = socialCaptions[Math.floor(Math.random() * socialCaptions.length)];
    const followerGain = 5 + Math.floor(gameState.reputation / 10);
    gameState.followers += followerGain;
    showFeedback(`📱 Posted: "${caption}" +${followerGain} followers!`, 'social');
    updateUI();
    triggerSocialAnimation();
}

// ── Décor System ──
function unlockDecor() {
    if (gameState.money < 50) {
        showFeedback(`💰 Need $50 to unlock décor. Current: $${gameState.money}`, 'error');
        updateUI();
        return;
    }

    const randomDecor = decorOptions[Math.floor(Math.random() * decorOptions.length)];

    if (gameState.decorItems.find(d => d.name === randomDecor.name)) {
        showFeedback('✨ You already have that décor! Try again for something new.', 'error');
        updateUI();
        return;
    }

    gameState.money -= 50;
    gameState.decorItems.push(randomDecor);
    renderDecor();
    showFeedback(`✨ New décor unlocked: ${randomDecor.emoji} ${randomDecor.name}!`, 'social');

    if (gameState.currentCustomer) {
        gameState.currentCustomer.mood = Math.min(100, gameState.currentCustomer.mood + 5);
        displayCustomer(gameState.currentCustomer);
    }

    triggerDecorAnimation();
    updateUI();
}

function renderDecor() {
    decorItems.innerHTML = gameState.decorItems
        .map(item => `<div class="decor-item" title="${item.name}">${item.emoji}</div>`)
        .join('');
}

// ── Rain Toggle ──
function toggleRain() {
    gameState.rainActive = !gameState.rainActive;
    if (gameState.rainActive) {
        rainContainer.classList.add('active');
        createRain();
        showFeedback('🌧️ Rainy day mood activated...', 'social');
    } else {
        rainContainer.classList.remove('active');
        rainContainer.innerHTML = '';
        showFeedback('☀️ Clear skies again!', 'social');
    }
}

function createRain() {
    rainContainer.innerHTML = '';
    for (let i = 0; i < 50; i++) {
        const drop = document.createElement('div');
        drop.className = 'raindrop';
        drop.style.left      = (Math.random() * 100) + '%';
        drop.style.animation = `fall ${0.5 + Math.random() * 0.5}s linear ${Math.random() * 2}s infinite`;
        rainContainer.appendChild(drop);
    }
}

// ── Particles ──
function createParticles(count) {
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className  = 'particle';
        p.style.left = (Math.random() * 100) + '%';
        p.style.top  = (Math.random() * 100) + '%';
        p.style.animation = `float-particle ${4 + Math.random() * 4}s ease-in-out ${Math.random() * 2}s infinite`;
        particlesContainer.appendChild(p);
    }
}

// ── Celebration Effects ──
function celebrateSuccess() {
    const emojis = ['✨','💕','⭐','🌸'];
    for (let i = 0; i < 10; i++) {
        const el = document.createElement('div');
        el.textContent       = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.position    = 'fixed';
        el.style.fontSize    = '1.5em';
        el.style.pointerEvents = 'none';
        el.style.left        = (Math.random() * 100) + '%';
        el.style.top         = (Math.random() * 50)  + '%';
        el.style.animation   = 'pop-in 0.6s ease-out forwards';
        el.style.zIndex      = '999';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 600);
    }
}

function triggerSocialAnimation() {
    socialBtn.style.animation = 'none';
    setTimeout(() => { socialBtn.style.animation = 'pop-in 0.4s ease-out'; }, 10);
}

function triggerDecorAnimation() {
    decorArea.style.animation = 'none';
    setTimeout(() => { decorArea.style.animation = 'pop-in 0.4s ease-out'; }, 10);
}

// ── Event Listeners ──
function setupEventListeners() {
    document.querySelectorAll('.drink-btn').forEach(btn => {
        btn.addEventListener('click', e => serveDrink(e.currentTarget.dataset.drink));
    });

    socialBtn.addEventListener('click', postOnSocial);
    decorBtn.addEventListener('click', unlockDecor);
    rainBtn.addEventListener('click', toggleRain);

    document.getElementById('musicIndicator').addEventListener('click', () => {
        showFeedback('🎵 Imagining lo-fi café vibes...', 'social');
    });
}

// ── Start ──
document.addEventListener('DOMContentLoaded', initGame);

console.log('%c☕ Welcome to Corner Café & Co! ☕', 'font-size:20px;color:#d4a5a5;font-weight:bold;');
console.log('%cA cozy life-simulation game made with love ✨', 'font-size:14px;color:#8b7a7a;');
