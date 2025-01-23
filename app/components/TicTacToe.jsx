// TicTacToe.jsx
"use client";

import React, { useState, useCallback, useEffect } from "react";
import GameBoard from "./GameBoard";
import "./TicTacToe.css";

const PLAYER = {
  X: "X",
  O: "O",
  EMPTY: null
};

const GAME_MODES = {
  LOCAL: "LOCAL",
  AI: "AI"
};

class GameState {
  constructor(prevState = null) {
    if (prevState) {
      this.board = [...prevState.board];
      this.currentPlayer = prevState.currentPlayer;
      this.winner = prevState.winner;
      this.winningLine = [...prevState.winningLine];
    } else {
      this.board = Array(9).fill(PLAYER.EMPTY);
      this.currentPlayer = PLAYER.X;
      this.winner = null;
      this.winningLine = [];
    }
  }

  copy() {
    return new GameState(this);
  }

  to2DBoard() {
    const board2D = [];
    for (let i = 0; i < 3; i++) {
      board2D.push(this.board.slice(i * 3, (i + 1) * 3));
    }
    return board2D;
  }

  checkWinner() {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (const [a, b, c] of lines) {
      if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
        this.winner = this.board[a];
        this.winningLine = [a, b, c];
        return true;
      }
    }

    if (this.board.every(square => square !== PLAYER.EMPTY)) {
      this.winner = "Draw";
      return true;
    }

    return false;
  }

  makeMove(index) {
    if (this.board[index] !== PLAYER.EMPTY || this.winner) {
      return null;
    }

    const newState = this.copy();
    newState.board[index] = this.currentPlayer;
    newState.checkWinner();
    newState.currentPlayer = this.currentPlayer === PLAYER.X ? PLAYER.O : PLAYER.X;
    return newState;
  }

  getAvailableMoves() {
    return this.board
      .map((value, index) => value === PLAYER.EMPTY ? index : null)
      .filter(index => index !== null);
  }

  minimax(depth, isMaximizing, alpha = -Infinity, beta = Infinity) {
    if (this.checkWinner()) {
      if (this.winner === PLAYER.X) return 1;
      if (this.winner === PLAYER.O) return -1;
      return 0;
    }

    if (depth === 0) return 0;

    const moves = this.getAvailableMoves();
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (const move of moves) {
        const newState = this.makeMove(move);
        const score = newState.minimax(depth - 1, false, alpha, beta);
        bestScore = Math.max(bestScore, score);
        alpha = Math.max(alpha, bestScore);
        if (beta <= alpha) break;
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (const move of moves) {
        const newState = this.makeMove(move);
        const score = newState.minimax(depth - 1, true, alpha, beta);
        bestScore = Math.min(bestScore, score);
        beta = Math.min(beta, bestScore);
        if (beta <= alpha) break;
      }
      return bestScore;
    }
  }
}

const AIPlayer = {
  getBestMove(gameState, difficulty = 'hard') {
    const moves = gameState.getAvailableMoves();
    
    // Easy: Random move
    if (difficulty === 'easy') {
      return moves[Math.floor(Math.random() * moves.length)];
    }

    // Medium: 50% chance of best move, 50% chance of random move
    if (difficulty === 'medium' && Math.random() < 0.5) {
      return moves[Math.floor(Math.random() * moves.length)];
    }

    // Hard: Always best move
    let bestScore = -Infinity;
    let bestMove = moves[0];

    for (const move of moves) {
      const newState = gameState.makeMove(move);
      const score = newState.minimax(5, false);
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }
};

const GameModeSelection = ({ 
  onSelectMode, 
  difficulty, 
  setDifficulty, 
  playerSide, 
  setPlayerSide,
  PLAYER,
  GAME_MODES 
}) => (
  <div className="mode-selection">
    <button 
      className="mode-button"
      onClick={() => onSelectMode(GAME_MODES.LOCAL)}
    >
      Play Local Game
    </button>
    <button 
      className="mode-button"
      onClick={() => onSelectMode(GAME_MODES.AI)}
    >
      Play Against AI
    </button>
    <button 
      className="mode-button online"
      onClick={() => alert("Online mode coming soon!")}
      disabled
    >
      Play Online (Coming Soon)
    </button>
    
    <div className="game-settings">
      <div className="selector-group">
        <label htmlFor="difficulty">AI Difficulty:</label>
        <select 
          id="difficulty"
          value={difficulty} 
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      
      <div className="selector-group">
        <label htmlFor="side">Play as:</label>
        <select 
          id="side"
          value={playerSide} 
          onChange={(e) => setPlayerSide(e.target.value)}
        >
          <option value={PLAYER.X}>X (First Move)</option>
          <option value={PLAYER.O}>O (Second Move)</option>
        </select>
      </div>
    </div>
  </div>
);

const TicTacToe = () => {
  const [gameState, setGameState] = useState(() => new GameState());
  const [history, setHistory] = useState([]);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [gameMode, setGameMode] = useState(null);
  const [difficulty, setDifficulty] = useState('medium');
  const [playerSide, setPlayerSide] = useState(PLAYER.X);
  const [isAIThinking, setIsAIThinking] = useState(false);

  // AI move effect
  useEffect(() => {
    if (gameMode === GAME_MODES.AI && 
        gameState.currentPlayer !== playerSide && 
        !gameState.winner) {
      setIsAIThinking(true);
      // Simulate AI "thinking" time for better UX
      const timer = setTimeout(() => {
        const aiMove = AIPlayer.getBestMove(gameState, difficulty);
        setGameState(prev => prev.makeMove(aiMove) || prev);
        setIsAIThinking(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [gameState, gameMode, playerSide, difficulty]);

  const handleMove = useCallback((index) => {
    if (isAIThinking) return;
    setGameState(prevState => {
      const newState = prevState.makeMove(index);
      return newState || prevState;
    });
  }, [isAIThinking]);

  const handleRestart = useCallback(() => {
    if (gameState.board.some(cell => cell !== PLAYER.EMPTY)) {
      const currentGame = {
        board: [...gameState.board],
        winner: gameState.winner || "Draw",
        timestamp: Date.now()
      };
      setHistory(prev => [currentGame, ...prev].slice(0, 10));
    }
    setGameState(new GameState());
    
    // If AI goes first, trigger its move
    if (gameMode === GAME_MODES.AI && playerSide === PLAYER.O) {
      setIsAIThinking(true);
    }
  }, [gameState, gameMode, playerSide]);

  const handleModeSelect = (mode) => {
    setGameMode(mode);
    setGameState(new GameState());
    setHistory([]);
  };

  if (!gameMode) {
    return (
      <div className="game-container">
        <header className="game-title">
          <h1>Welcome to Tic Tac Toe</h1>
        </header>
        <GameModeSelection 
          onSelectMode={handleModeSelect}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          playerSide={playerSide}
          setPlayerSide={setPlayerSide}
          PLAYER={PLAYER}
          GAME_MODES={GAME_MODES}
        />
      </div>
    );
  }

  const status = gameState.winner
    ? gameState.winner === "Draw"
      ? "It's a Draw!"
      : `Winner: ${gameState.winner}`
    : isAIThinking
      ? `AI is thinking${'.'.repeat(Math.floor(Date.now() / 500) % 4)}`
      : `Next player: ${gameState.currentPlayer}`;

  return (
    <div className="game-container">
      <header className="game-title">
        <h1>Tic Tac Toe</h1>
      </header>
      <div className="mode-indicator">
        {gameMode === GAME_MODES.AI 
          ? `Playing Against AI (${difficulty}) - You are ${playerSide}` 
          : "Local Game"}
      </div>
      <div className="game-history-wrapper">
        <div className="game">
          <div className={`status ${isAIThinking ? 'ai-thinking' : ''}`} 
               aria-live="polite">
            {status}
          </div>
          <GameBoard
            board={gameState.board}
            onClick={handleMove}
            isClickable={!gameState.winner && !isAIThinking &&
              (gameMode === GAME_MODES.LOCAL || 
               gameState.currentPlayer === playerSide)}
            size="large"
            winningSquares={gameState.winningLine}
          />
          <div className="button-group">
            <button className="restart-button" onClick={handleRestart}>
              Restart
            </button>
            <button 
              className="restart-button"
              onClick={() => handleModeSelect(null)}
            >
              Change Mode
            </button>
          </div>
        </div>
        <div className="history-container">
          <h3>Game History</h3>
          {history.length === 0 ? (
            <div className="history-empty">No games played yet</div>
          ) : (
            (showAllHistory ? history : history.slice(0, 3)).map((game, index) => (
              <div 
                key={game.timestamp || index} 
                className={`history-item ${index === 0 ? 'new' : ''}`}
              >
                <div className="history-title">
                  Game {history.length - index}: {game.winner === "Draw" 
                    ? "Draw" 
                    : `${game.winner} Wins`}
                </div>
                <GameBoard
                  board={game.board}
                  isClickable={false}
                  size="small"
                  winningSquares={[]}
                />
              </div>
            ))
          )}
          {history.length > 3 && (
            <button 
              className="history-button" 
              onClick={() => setShowAllHistory(!showAllHistory)}
            >
              {showAllHistory ? "Show Less" : "Show All"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;