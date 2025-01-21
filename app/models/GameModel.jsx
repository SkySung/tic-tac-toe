// models/GameModel.js

class Player {
    constructor(symbol) {
      this.symbol = symbol;
    }
  
    getMove(board) {
      throw new Error('getMove must be implemented by subclass');
    }
  }
  
  class HumanPlayer extends Player {
    async getMove(board, index) {
      if (board[index] === null) {
        return index;
      }
      return null;
    }
  }
  
  class GameMode {
    constructor(players, onStateChange) {
      this.board = Array(9).fill(null);
      this.currentPlayerIndex = 0;
      this.players = players;
      this.onStateChange = onStateChange;
      this.history = [];
      this.isGameOver = false;
      this.winner = null;
      this.winningLine = [];
    }
  
    getCurrentPlayer() {
      return this.players[this.currentPlayerIndex];
    }
  
    async handleMove(index) {
      if (this.isGameOver || this.board[index] !== null) {
        return false;
      }
  
      const currentPlayer = this.getCurrentPlayer();
      const move = await currentPlayer.getMove(this.board, index);
  
      if (move === null) {
        return false;
      }
  
      this.board[move] = currentPlayer.symbol;
      this.checkGameStatus();
      
      if (!this.isGameOver) {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
      }
  
      this.notifyStateChange();
      return true;
    }
  
    checkGameStatus() {
      const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
      ];
  
      for (const line of lines) {
        const [a, b, c] = line;
        if (this.board[a] && 
            this.board[a] === this.board[b] && 
            this.board[a] === this.board[c]) {
          this.winner = this.board[a];
          this.winningLine = line;
          this.isGameOver = true;
          return;
        }
      }
  
      if (this.board.every(square => square !== null)) {
        this.isGameOver = true;
        this.winner = 'Draw';
      }
    }
  
    restart() {
      if (this.board.some(square => square !== null)) {
        this.history.unshift({
          board: [...this.board],
          winner: this.winner
        });
        this.history = this.history.slice(0, 10); // Keep last 10 games
      }
  
      this.board = Array(9).fill(null);
      this.currentPlayerIndex = 0;
      this.isGameOver = false;
      this.winner = null;
      this.winningLine = [];
      this.notifyStateChange();
    }
  
    getState() {
      return {
        board: this.board,
        currentPlayer: this.getCurrentPlayer().symbol,
        isGameOver: this.isGameOver,
        winner: this.winner,
        winningLine: this.winningLine,
        history: this.history
      };
    }
  
    notifyStateChange() {
      if (this.onStateChange) {
        this.onStateChange(this.getState());
      }
    }
  }
  
  class LocalGame extends GameMode {
    constructor(onStateChange) {
      const players = [
        new HumanPlayer('X'),
        new HumanPlayer('O')
      ];
      super(players, onStateChange);
    }
  }
  
  const GameFactory = {
    createGame(mode, options) {
      switch (mode) {
        case 'local':
          return new LocalGame(options.onStateChange);
        default:
          throw new Error(`Unknown game mode: ${mode}`);
      }
    }
  };
  
  export { GameFactory };