import Link from 'next/link';
import TicTacToe from '@/components/TicTacToe';

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to Tic-Tac-Toe</h1>
      <TicTacToe />
    </div>
  );
}
