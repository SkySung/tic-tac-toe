import React from "react";
import "./GameBoard.css"; 

const GameBoard = React.memo(({ board, onClick, isClickable = true, size = "large", winningSquares = [] }) => {
  return (
    <div className={`game-board ${size}`}>
      {board.map((value, index) => (
        <button
          key={index}
          className={`square ${value} ${winningSquares.includes(index) ? "winning-square" : ""}`}
          onClick={() => isClickable && onClick(index)}
          aria-label={`Square ${index + 1}, ${value ? value : "Empty"}`}
          disabled={!isClickable || !!value}
        >
          {value}
        </button>
      ))}
    </div>
  );
});

GameBoard.displayName = "GameBoard";
export default GameBoard;
