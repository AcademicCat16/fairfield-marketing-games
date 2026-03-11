class ConnectFour {
    constructor(rows = 6, cols = 7) {
        this.rows = rows;
        this.cols = cols;
        this.board = Array(rows).fill(null).map(() => Array(cols).fill(0));
        this.currentPlayer = 1;
        this.gameOver = false;
        this.init();
    }

    init() {
        this.renderBoard();
    }

    dropPiece(col) {
        if (col < 0 || col >= this.cols || this.gameOver) {
            return false;
        }

        // Find the lowest empty row in the column
        for (let row = this.rows - 1; row >= 0; row--) {
            if (this.board[row][col] === 0) {
                this.board[row][col] = this.currentPlayer;
                this.renderBoard();
                return true;
            }
        }

        return false; // Column is full
    }

    checkWinner() {
        // Check horizontal
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols - 3; col++) {
                if (this.board[row][col] !== 0 &&
                    this.board[row][col] === this.board[row][col + 1] &&
                    this.board[row][col] === this.board[row][col + 2] &&
                    this.board[row][col] === this.board[row][col + 3]) {
                    return this.board[row][col];
                }
            }
        }

        // Check vertical
        for (let row = 0; row < this.rows - 3; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.board[row][col] !== 0 &&
                    this.board[row][col] === this.board[row + 1][col] &&
                    this.board[row][col] === this.board[row + 2][col] &&
                    this.board[row][col] === this.board[row + 3][col]) {
                    return this.board[row][col];
                }
            }
        }

        // Check diagonal (bottom-left to top-right)
        for (let row = 0; row < this.rows - 3; row++) {
            for (let col = 0; col < this.cols - 3; col++) {
                if (this.board[row][col] !== 0 &&
                    this.board[row][col] === this.board[row + 1][col + 1] &&
                    this.board[row][col] === this.board[row + 2][col + 2] &&
                    this.board[row][col] === this.board[row + 3][col + 3]) {
                    return this.board[row][col];
                }
            }
        }

        // Check diagonal (top-left to bottom-right)
        for (let row = 3; row < this.rows; row++) {
            for (let col = 0; col < this.cols - 3; col++) {
                if (this.board[row][col] !== 0 &&
                    this.board[row][col] === this.board[row - 1][col + 1] &&
                    this.board[row][col] === this.board[row - 2][col + 2] &&
                    this.board[row][col] === this.board[row - 3][col + 3]) {
                    return this.board[row][col];
                }
            }
        }

        return 0; // No winner
    }

    isBoardFull() {
        return this.board.every(row => row.every(cell => cell !== 0));
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    }

    renderBoard() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = document.createElement('button');
                cell.className = 'cell';
                const value = this.board[row][col];

                if (value === 0) {
                    cell.classList.add('empty');
                } else if (value === 1) {
                    cell.classList.add('player1');
                    cell.textContent = '●';
                } else if (value === 2) {
                    cell.classList.add('player2');
                    cell.textContent = '●';
                }

                cell.onclick = () => this.handleCellClick(col);
                boardElement.appendChild(cell);
            }
        }

        this.updateGameStatus();
    }

    handleCellClick(col) {
        if (this.gameOver) {
            return;
        }

        if (this.dropPiece(col)) {
            const winner = this.checkWinner();
            
            if (winner) {
                this.gameOver = true;
                document.getElementById('status').innerHTML = `
                    <span class="winner">🎉 Player ${winner} Wins! 🎉</span>
                `;
                return;
            }

            if (this.isBoardFull()) {
                this.gameOver = true;
                document.getElementById('status').innerHTML = `
                    <span class="tie">It's a Tie!</span>
                `;
                return;
            }

            this.switchPlayer();
            this.updateGameStatus();
        }
    }

    updateGameStatus() {
        const playerTurnElement = document.getElementById('playerTurn');
        const playerName = this.currentPlayer === 1 ? 'Player 1 (Red)' : 'Player 2 (Yellow)';
        playerTurnElement.textContent = `${playerName}'s Turn`;
    }

    reset() {
        this.board = Array(this.rows).fill(null).map(() => Array(this.cols).fill(0));
        this.currentPlayer = 1;
        this.gameOver = false;
        document.getElementById('status').innerHTML = '';
        this.renderBoard();
    }
}

// Initialize the game
let game = new ConnectFour();

function resetGame() {
    game.reset();
}
