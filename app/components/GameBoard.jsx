// GameBoard.jsx
import React from "react";
import GamePieces from "./GamePieces";
import "./GameBoard.css";

const GameBoard = React.memo(({ 
  board, 
  onClick, 
  isClickable = true, 
  size = "large", 
  winningSquares = [] 
}) => {
  const renderPiece = (value) => {
    if (!value) return null;
    const { XPiece, OPiece } = GamePieces;
    return value === "X" ? (
      <XPiece className="X" />
    ) : (
      <OPiece className="O" />
    );
  };

  return (
    <div className={`game-board ${size}`}>
      {board.map((value, index) => (
        <button
          key={index}
          className={`square ${winningSquares.includes(index) ? "winning-square" : ""}`}
          onClick={() => isClickable && onClick(index)}
          aria-label={`Square ${index + 1}, ${value ? value : "Empty"}`}
          disabled={!isClickable || !!value}
        >
          {renderPiece(value)}
        </button>
      ))}
    </div>
  );
});

GameBoard.displayName = "GameBoard";
export default GameBoard;