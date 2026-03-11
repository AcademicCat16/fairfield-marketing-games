const CHARS = [
  {
    name: "Scout",
    trait: "Adventurous & cozy",
    img: "https://placehold.co/240x240/7c4dff/ffffff?text=Scout",
    intro: "I want my apartment to feel like an adventure — full of character, warmth, and a few good reading nooks. Can you help me settle in?",
    sideTitle: "Scout just returned from months of exploration. Help them build a cozy home base! 🌿",
    doneMsg: "I've seen breathtaking places in my travels, but this feels like home. Warm, full of character, and perfect for reading and dreaming. Thank you. 🌿💕"
  },
  {
    name: "Nova",
    trait: "Creative & dreamy",
    img: "https://placehold.co/240x240/f06292/ffffff?text=Nova",
    intro: "I want a place that feels magical and bright, like a little dream world I can come home to every day.",
    sideTitle: "Nova wants a colorful apartment full of sparkle and imagination. ✨",
    doneMsg: "This is exactly the kind of dreamy space I hoped for. It feels magical, playful, and so me. Thank you! ✨💜"
  },
  {
    name: "Moss",
    trait: "Calm & nature-loving",
    img: "https://placehold.co/240x240/43a047/ffffff?text=Moss",
    intro: "Could you help me make this apartment feel peaceful and grounded? I love plants, calm corners, and a sense of balance.",
    sideTitle: "Moss wants a peaceful retreat inspired by nature. 🍃",
    doneMsg: "This apartment feels so calm and grounding now. I can already imagine resting here with tea and soft music. Thank you. 🍃"
  },
  {
    name: "Pixel",
    trait: "Playful & bold",
    img: "https://placehold.co/240x240/29b6f6/ffffff?text=Pixel",
    intro: "I want something fun, stylish, and full of personality. Let’s make this place unforgettable.",
    sideTitle: "Pixel is ready for a bold apartment makeover. 🎮",
    doneMsg: "Wow. This place is full of energy and personality now. It feels fun, bold, and totally unforgettable. Thank you! 🎮💙"
  }
];

const FURNITURE = [
  { type: "couch", label: "Sofa", emoji: "🛋️", w: 140, h: 58 },
  { type: "tv", label: "TV", emoji: "📺", w: 120, h: 48 },
  { type: "rug", label: "Rug", emoji: "🟪", w: 140, h: 68 },
  { type: "table", label: "Table", emoji: "🪵", w: 90, h: 58 },
  { type: "lamp", label: "Lamp", emoji: "💡", w: 48, h: 48 },
  { type: "desk", label: "Desk", emoji: "🧰", w: 120, h: 52 },
  { type: "chair", label: "Chair", emoji: "🪑", w: 58, h: 58 },
  { type: "shelf", label: "Shelf", emoji: "📚", w: 110, h: 44 },
  { type: "plant", label: "Plant", emoji: "🪴", w: 48, h: 48 },
  { type: "bed", label: "Bed", emoji: "🛏️", w: 120, h: 88 },
  { type: "dresser", label: "Dresser", emoji: "🧺", w: 88, h: 48 }
];

const DIALOGUES = [
  "Love it there! ✨",
  "That fits perfectly!",
  "Looking amazing! 🌟",
  "You're so good at this!",
  "Ooh yes! 💜",
  "Great choice! 🎨",
  "This is coming together!",
  "So much personality!",
  "Chef's kiss! 💋",
  "Iconic. Truly."
];

let selectedChar = null;
let placementCount = 0;
let bubbleTimer = null;
let glitterAnim = null;

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}

function goToCharSelect() {
  const grid = document.getElementById("charGrid");
  grid.innerHTML = "";

  CHARS.forEach((ch, index) => {
    const card = document.createElement("div");
    card.className = "char-card";
    card.style.animationDelay = `${0.05 + index * 0.05}s`;

    const img = document.createElement("img");
    img.className = "char-portrait";
    img.src = ch.img;
    img.alt = ch.name;

    const nm = document.createElement("div");
    nm.className = "char-name";
    nm.textContent = ch.name;

    const tr = document.createElement("div");
    tr.className = "char-trait";
    tr.textContent = ch.trait;

    card.appendChild(img);
    card.appendChild(nm);
    card.appendChild(tr);

    card.addEventListener("click", () => selectChar(ch));
    grid.appendChild(card);
  });

  showScreen("charScreen");
}

function selectChar(ch) {
  selectedChar = ch;

  document.getElementById("introBubbleName").textContent = `${ch.name} says:`;
  document.getElementById("introBubbleText").textContent = ch.intro;
  document.getElementById("introSideTitle").textContent = ch.sideTitle;
  document.getElementById("introCharImg").src = ch.img;

  showScreen("introScreen");
}

function startDesign() {
  if (!selectedChar) return;

  document.getElementById("panelCharImg").src = selectedChar.img;
  buildPalette();
  resetApartment();
  showScreen("gameScreen");
  showBubble("Drag furniture in!");
}

function buildPalette() {
  const palette = document.getElementById("palette");
  palette.innerHTML = "";

  FURNITURE.forEach(item => {
    const div = document.createElement("div");
    div.className = "palette-item";
    div.innerHTML = `<span>${item.emoji}</span><span>${item.label}</span>`;
    div.addEventListener("click", () => addFurniture(item));
    palette.appendChild(div);
  });
}

function resetApartment() {
  const apt = document.getElementById("apartment");
  apt.querySelectorAll(".furniture-piece").forEach(el => el.remove());
  placementCount = 0;
}

function addFurniture(item) {
  const apt = document.getElementById("apartment");
  const piece = document.createElement("div");
  piece.className = "furniture-piece";
  piece.style.width = `${item.w}px`;
  piece.style.height = `${item.h}px`;
  piece.style.left = `${20 + (placementCount * 18) % 300}px`;
  piece.style.top = `${30 + (placementCount * 15) % 180}px`;
  piece.innerHTML = `<div class="f-emoji">${item.emoji}</div><div>${item.label}</div>`;

  makeDraggable(piece, apt);
  apt.appendChild(piece);

  placementCount++;
  showBubble(DIALOGUES[Math.floor(Math.random() * DIALOGUES.length)]);
}

function showBubble(text) {
  const bubble = document.getElementById("gameBubble");
  bubble.textContent = text;
  bubble.classList.add("visible");

  clearTimeout(bubbleTimer);
  bubbleTimer = setTimeout(() => {
    bubble.classList.remove("visible");
  }, 1800);
}

function makeDraggable(el, container) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  const onPointerDown = e => {
    isDragging = true;
    el.classList.add("dragging");

    const rect = el.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    el.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = e => {
    if (!isDragging) return;

    const cRect = container.getBoundingClientRect();
    let left = e.clientX - cRect.left - offsetX;
    let top = e.clientY - cRect.top - offsetY;

    left = Math.max(0, Math.min(left, container.clientWidth - el.offsetWidth));
    top = Math.max(0, Math.min(top, container.clientHeight - el.offsetHeight));

    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
  };

  const onPointerUp = e => {
    isDragging = false;
    el.classList.remove("dragging");
    el.releasePointerCapture?.(e.pointerId);
  };

  el.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
}

function finishDesign() {
  const pieces = [...document.querySelectorAll("#apartment .furniture-piece")];
  if (!pieces.length) {
    showBubble("Add at least one item first!");
    return;
  }

  const finalCharImg = document.getElementById("finalCharImg");
  const finalBubble = document.getElementById("finalBubble");
  const finalPreview = document.getElementById("finalAptPreview");

  finalCharImg.src = selectedChar.img;
  finalBubble.textContent = selectedChar.doneMsg;
  finalBubble.classList.remove("visible");

  finalPreview.innerHTML = `
    <svg class="apt-walls" viewBox="0 0 670 395" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="654" height="379" fill="none" stroke="rgba(167,100,255,.35)" stroke-width="3"/>
      <line x1="450" y1="8" x2="450" y2="260" stroke="rgba(167,100,255,.18)" stroke-width="1.5" stroke-dasharray="6,4"/>
      <line x1="450" y1="260" x2="670" y2="260" stroke="rgba(167,100,255,.18)" stroke-width="1.5" stroke-dasharray="6,4"/>
    </svg>
  `;

  pieces.forEach(piece => {
    const clone = piece.cloneNode(true);
    clone.classList.remove("dragging");
    finalPreview.appendChild(clone);
  });

  launchGlitter();
  showScreen("finalScreen");

  setTimeout(() => finalBubble.classList.add("visible"), 300);
}

function launchGlitter() {
  const overlay = document.getElementById("glitterOverlay");
  const canvas = document.getElementById("glitterCanvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  overlay.style.display = "block";

  const particles = Array.from({ length: 90 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: 1 + Math.random() * 3,
    vy: 0.5 + Math.random() * 2,
    vx: -0.5 + Math.random(),
    alpha: 0.4 + Math.random() * 0.6,
    char: Math.random() > 0.5 ? "✦" : "•"
  }));

  let frame = 0;

  cancelAnimationFrame(glitterAnim);

  function animate() {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "18px sans-serif";

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha *= 0.992;

      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = "#ffffff";
      ctx.fillText(p.char, p.x, p.y);
    });

    if (frame < 120) {
      glitterAnim = requestAnimationFrame(animate);
    } else {
      overlay.style.display = "none";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  animate();
}

function playAgain() {
  selectedChar = null;
  placementCount = 0;
  document.getElementById("finalAptPreview").innerHTML = "";
  showScreen("startScreen");
}

document.getElementById("btnPlay").addEventListener("click", goToCharSelect);
document.getElementById("btnStartDesign").addEventListener("click", startDesign);
document.getElementById("btnDone").addEventListener("click", finishDesign);
document.getElementById("btnPlayAgain").addEventListener("click", playAgain);

window.addEventListener("resize", () => {
  const canvas = document.getElementById("glitterCanvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
