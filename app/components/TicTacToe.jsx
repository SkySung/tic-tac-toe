// app/components/TicTacToe.js

"use client"; // This tells Next.js that this component should be treated as a Client Component

import React, { useState } from "react";
import GameBoard from "./GameBoard";
import "./TicTacToe.css";

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([]);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const { winner, line } = calculateWinner(board);

  const handleClick = (index) => {
    if (board[index] || winner || board.every((square) => square !== null)) return;
    const newBoard = board.slice();
    newBoard[index] = xIsNext ? "X" : "O";
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const handleRestart = () => {
    const currentGame = {
      board: board.slice(),
      winner: winner ? winner : "Draw",
    };
    const newHistory = [currentGame, ...history].slice(0, 10);
    setHistory(newHistory);
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  // Updated renderHistoryBoard function using GameBoard component
  const renderHistoryBoard = (gameBoard, index) => (
    <GameBoard
      key={index}
      board={gameBoard}
      isClickable={false}
      size="small"
      winningSquares={winner && winner !== "Draw" ? line : []}
    />
  );

  const handleShowAllHistory = () => {
    setShowAllHistory(!showAllHistory);
  };

  const status = winner
    ? winner === "Draw" ? "It's a Draw!" : `Winner: ${winner}`
    : `Next player: ${xIsNext ? "X" : "O"}`;

  const displayedHistory = showAllHistory ? history : history.slice(0, 3);

  return (
    <div className="game-container">
      <header className="game-title">
        <h1>Welcome to Tic Tac Toe</h1>
      </header>
      <div className="game-history-wrapper">
        <div className="game">
          <div className="status" aria-live="polite">{status}</div>
          <GameBoard
            board={board}
            onClick={handleClick}
            isClickable={!winner && !board.every((square) => square !== null)}
            size="large"
            winningSquares={winner && winner !== "Draw" ? line : []}
          />
          <button className="restart-button" onClick={handleRestart}>
            Restart
          </button>
        </div>
        <div className="history-container">
          <h3>Game History</h3>
          {displayedHistory.map((game, index) => (
            <div key={index} className="history-item">
              <div className="history-title">
                Game {history.length - index}: {game.winner === "Draw" ? "Draw" : `${game.winner} Wins`}
              </div>
              {renderHistoryBoard(game.board, index)}
            </div>
          ))}
          <button className="history-button" onClick={handleShowAllHistory}>
            {showAllHistory ? "Show Less" : "Show All"}
          </button>
        </div>
      </div>
    </div>
  );  
};

// Helper function to calculate the winner
const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }

  if (squares.every((square) => square !== null)) {
    return { winner: "Draw", line: [] };
  }

  return { winner: null, line: [] };
};

export default TicTacToe;
