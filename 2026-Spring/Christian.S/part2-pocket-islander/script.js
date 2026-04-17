const friends = ['🍃', '🐙', '🐸', '🐱', '🍃', '🐙', '🐸', '🐱'];
let choice = [];

function initGame() {
    const grid = document.getElementById('safari-grid');
    grid.innerHTML = '';
    // Shuffle
    friends.sort(() => 0.5 - Math.random());
    
    friends.forEach((friend, index) => {
        const tile = document.createElement('div');
        tile.classList.add('patch');
        tile.dataset.value = friend;
        tile.onclick = () => revealFriend(tile);
        grid.appendChild(tile);
    });
}

function revealFriend(tile) {
    if (choice.length < 2 && !tile.innerText) {
        tile.innerText = tile.dataset.value;
        choice.push(tile);
    }

    if (choice.length === 2) {
        setTimeout(checkMatch, 500);
    }
}

function checkMatch() {
    if (choice[0].innerText !== choice[1].innerText) {
        choice[0].innerText = '';
        choice[1].innerText = '';
    } else {
        choice[0].classList.add('found');
        choice[1].classList.add('found');
    }
    choice = [];
}

initGame();


