let size = 4;
let grid = [];
let previousState = null;
let score = 0;

function newGame() {
    grid = Array(size).fill().map(() => Array(size).fill(0));
    score = 0;
    previousState = null;
    addTile();
    addTile();
    render();
}

function changeSize(val) {
    size = parseInt(val);
    newGame();
}

function addTile() {
    let empty = [];
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (grid[r][c] === 0) empty.push({ r, c });
        }
    }
    if (empty.length === 0) return;
    let { r, c } = empty[Math.floor(Math.random() * empty.length)];
    grid[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function render() {
    const game = document.getElementById("game");
    game.style.gridTemplateColumns = `repeat(${size}, 80px)`;
    game.innerHTML = "";
    
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            let cell = document.createElement("div");
            cell.className = "tile";
            if (grid[r][c] !== 0) {
                cell.textContent = grid[r][c];
                // Optional: Add color logic based on value here
            }
            game.appendChild(cell);
        }
    }
    document.getElementById("score").textContent = score;
}

function move(dir) {
    // Save state for undo
    previousState = JSON.parse(JSON.stringify({ grid, score }));

    let changed = false;

    for (let i = 0; i < size; i++) {
        let row = [];
        for (let j = 0; j < size; j++) {
            // Pick values based on direction
            let val = (dir === "left" || dir === "right") ? grid[i][j] : grid[j][i];
            if (val !== 0) row.push(val);
        }

        if (dir === "right" || dir === "down") row.reverse();

        // Merge logic
        for (let k = 0; k < row.length - 1; k++) {
            if (row[k] === row[k + 1]) {
                row[k] *= 2;
                score += row[k];
                row.splice(k + 1, 1);
            }
        }

        while (row.length < size) row.push(0);
        if (dir === "right" || dir === "down") row.reverse();

        // Update the grid
        for (let j = 0; j < size; j++) {
            if (dir === "left" || dir === "right") {
                if (grid[i][j] !== row[j]) changed = true;
                grid[i][j] = row[j];
            } else {
                if (grid[j][i] !== row[j]) changed = true;
                grid[j][i] = row[j];
            }
        }
    }

    if (changed) {
        addTile();
        render();
    }
}

function undo() {
    if (!previousState) return;
    grid = previousState.grid;
    score = previousState.score;
    previousState = null; // Can only undo once in this version
    render();
}

document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") move("left");
    if (e.key === "ArrowRight") move("right");
    if (e.key === "ArrowUp") move("up");
    if (e.key === "ArrowDown") move("down");
});

// Initialize game on load
newGame();
