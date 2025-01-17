// GamePieces.jsx
import React from 'react';

const XPiece = ({ className = "" }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={`game-piece ${className}`}
    aria-label="X piece"
  >
    <line 
      x1="4" 
      y1="4" 
      x2="20" 
      y2="20" 
      strokeWidth="3" 
      strokeLinecap="round"
    />
    <line 
      x1="20" 
      y1="4" 
      x2="4" 
      y2="20" 
      strokeWidth="3" 
      strokeLinecap="round"
    />
  </svg>
);

const OPiece = ({ className = "" }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={`game-piece ${className}`}
    aria-label="O piece"
  >
    <circle 
      cx="12" 
      cy="12" 
      r="8" 
      fill="none" 
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

// 注意這裡使用 default export 匯出一個對象
const GamePieces = {
  XPiece,
  OPiece
};

export default GamePieces;