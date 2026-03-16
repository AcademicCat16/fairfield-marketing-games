let zen = 0;
let puppyList = [];
let posing = false;

const zenEl = document.getElementById('zen-score');
const countEl = document.getElementById('puppy-count');
const studio = document.getElementById('puppy-layer');
const player = document.getElementById('player');
const btn = document.getElementById('pose-btn');

// Start/Stop Posing
btn.addEventListener('mousedown', () => { posing = true; player.innerText = '🧘'; btn.innerText = "Posing..."; });
btn.addEventListener('mouseup', () => { posing = false; player.innerText = '🧍'; btn.innerText = "Begin Yoga Flow"; });

function createPuppy() {
    const pup = document.createElement('div');
    pup.className = 'puppy';
    pup.innerText = '🐕'; // Represents our Golden Retriever puppies
    
    // Spawn at random edges
    const side = Math.floor(Math.random() * 4);
    if(side === 0) { pup.style.top = '0px'; pup.style.left = Math.random() * 100 + '%'; }
    else { pup.style.bottom = '0px'; pup.style.left = Math.random() * 100 + '%'; }

    pup.onclick = () => {
        zen += 25;
        pup.innerText = '💖';
        setTimeout(() => pup.remove(), 600);
        zenEl.innerText = zen;
    };

    studio.appendChild(pup);
    puppyList.push(pup);
    countEl.innerText = studio.children.length;
}

// Game Loop
setInterval(() => {
    if (posing) {
        zen += 1;
        zenEl.innerText = zen;

        // Random chance to spawn a puppy while posing
        if (Math.random() < 0.05 && studio.children.length < 10) {
            createPuppy();
        }

        // Make puppies move toward the mat
        const puppies = document.querySelectorAll('.puppy');
        puppies.forEach(p => {
            let top = parseFloat(p.style.top || 0);
            let left = parseFloat(p.style.left || 0);
            
            // Very simple "move toward center" logic
            if (top < 60) p.style.top = (top + 1) + '%';
            if (left < 45) p.style.left = (left + 1) + '%';
            if (left > 55) p.style.left = (left - 1) + '%';
        });
    }
}, 100);
