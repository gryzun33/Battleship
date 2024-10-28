import { Board, Hit } from '../types';

export function getRandomShot(board: Board, boardSize: number): Hit {
  let x: number, y: number;
  let shotKey: string;

  do {
    x = Math.floor(Math.random() * boardSize);
    y = Math.floor(Math.random() * boardSize);

    shotKey = `${x}${y}`;
  } while (!board.get(shotKey));

  return { x, y };
}
