// app/components/TicTacToe.js

"use client"; // This tells Next.js that this component should be treated as a Client Component

import React, { useState } from "react";
import "./TicTacToe.css";

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([]);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const winner = calculateWinner(board);

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

  const renderSquare = (index) => (
    <button
      key={index}
      className={`square ${board[index]}`}
      onClick={() => handleClick(index)}
      aria-label={`Square ${index + 1}, ${board[index] ? board[index] : "Empty"}`}
    >
      {board[index]}
    </button>
  );

  const renderHistoryBoard = (board, index) => (
    <div key={index} className="history-board">
      {board.map((value, i) => (
        <div key={i} className={`small-square ${value}`}>
          {value}
        </div>
      ))}
    </div>
  );

  const handleShowAllHistory = () => {
    setShowAllHistory(!showAllHistory);
  };

  const status = winner
    ? `Winner: ${winner}`
    : `Next player: ${xIsNext ? "X" : "O"}`;

  const displayedHistory = showAllHistory ? history : history.slice(0, 3);

  return (
    <div className="game-container">
      <div className="game">
        <div className="status" aria-live="polite">{status}</div>
        <div className="board">
          {Array(9).fill().map((_, i) => renderSquare(i))}
        </div>
        <button className="restart-button" onClick={handleRestart}>
          Restart
        </button>
      </div>
      <div className="history-container">
        <h3>Game History</h3>
        {displayedHistory.map((game, index) => (
          <div key={index} className="history-item">
            <div className="history-title">
              Game {history.length - index}: {game.winner}
            </div>
            {renderHistoryBoard(game.board, index)}
          </div>
        ))}
        <button className="history-button" onClick={handleShowAllHistory}>
          {showAllHistory ? "Show Less" : "Show All"}
        </button>
      </div>
    </div>
  );
};

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  if (squares.every((square) => square !== null)) {
    return "Draw";
  }

  return null;
};

export default TicTacToe;
