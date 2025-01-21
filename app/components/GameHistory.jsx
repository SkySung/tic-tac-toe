// components/GameHistory.jsx
import React, { useState } from 'react';
import GameBoard from './GameBoard';

const GameHistory = ({ history }) => {
  const [showAllHistory, setShowAllHistory] = useState(false);
  const displayedHistory = showAllHistory ? history : history.slice(0, 3);

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="history-container">
      <h3>Game History</h3>
      {displayedHistory.map((game, index) => (
        <div key={index} className="history-item">
          <div className="history-title">
            Game {history.length - index}: {game.winner === 'Draw' ? 'Draw' : `${game.winner} Wins`}
          </div>
          <GameBoard
            board={game.board}
            isClickable={false}
            size="small"
            winningSquares={[]}
          />
        </div>
      ))}
      {history.length > 3 && (
        <button className="history-button" onClick={() => setShowAllHistory(!showAllHistory)}>
          {showAllHistory ? "Show Less" : "Show All"}
        </button>
      )}
    </div>
  );
};

export default GameHistory;