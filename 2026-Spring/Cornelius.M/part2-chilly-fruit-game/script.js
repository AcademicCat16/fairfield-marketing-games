const leftOverlay = document.getElementById("leftOverlay");
const rightOverlay = document.getElementById("rightOverlay");
const rightFridge = document.getElementById("rightFridge");
const msg = document.getElementById("msg");

const FRUITS_DATA = [
    { emoji: "🍎", x: 60, y: 330 },
    { emoji: "🍌", x: 120, y: 340 },
    { emoji: "🍇", x: 180, y: 330 },
    { emoji: "🍓", x: 90, y: 390 },
    { emoji: "🍊", x: 160, y: 390 }
];

let movedCount = 0;
let dragging = null;
let startX, startY;

function makeFruit(data) {
    const el = document.createElement("div");
    el.className = "fruit";
    el.textContent = data.emoji;
    el.style.left = data.x + "px";
    el.style.top = data.y + "px";

    el.addEventListener("pointerdown", (e) => {
        dragging = el;
        el.setPointerCapture(e.pointerId);
        
        // Calculate where inside the fruit we clicked
        const rect = el.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
        
        el.style.transition = "none";
    });

    el.addEventListener("pointermove", (e) => {
        if (!dragging) return;
        
        const parentRect = dragging.parentElement.getBoundingClientRect();
        const x = e.clientX - parentRect.left - startX;
        const y = e.clientY - parentRect.top - startY;
        
        dragging.style.left = x + "px";
        dragging.style.top = y + "px";

        // Visual feedback for the fridge
        const rRect = rightFridge.getBoundingClientRect();
        if (e.clientX > rRect.left && e.clientX < rRect.right) {
            rightFridge.classList.add('drag-over');
        } else {
            rightFridge.classList.remove('drag-over');
        }
    });

    el.addEventListener("pointerup", (e) => {
        if (!dragging) return;
        
        const rRect = rightFridge.getBoundingClientRect();
        rightFridge.classList.remove('drag-over');

        const inRight = e.clientX >= rRect.left && e.clientX <= rRect.right &&
                        e.clientY >= rRect.top && e.clientY <= rRect.bottom;

        if (inRight && dragging.parentElement !== rightOverlay) {
            // Move to right fridge
            const localX = e.clientX - rRect.left - startX;
            const localY = e.clientY - rRect.top - startY;
            
            rightOverlay.appendChild(dragging);
            dragging.style.left = localX + "px";
            dragging.style.top = localY + "px";
            
            movedCount++;
            updateStatus();
        } 
        
        dragging = null;
    });

    return el;
}

function updateStatus() {
    if (movedCount >= FRUITS_DATA.length) {
        msg.innerHTML = "<strong>Fridge Organized! 🌟</strong>";
    } else {
        msg.textContent = `Moved ${movedCount} of ${FRUITS_DATA.length} items.`;
    }
}

function resetGame() {
    leftOverlay.innerHTML = "";
    rightOverlay.innerHTML = "";
    movedCount = 0;
    FRUITS_DATA.forEach(data => leftOverlay.appendChild(makeFruit(data)));
    updateStatus();
}

resetGame();
