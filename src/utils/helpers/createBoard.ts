import { Board } from '../types';

export function createBoard(size: number): Board {
  const board = new Map<string, boolean>();

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      const key = `${x}${y}`;
      board.set(key, true);
    }
  }

  return board;
}
