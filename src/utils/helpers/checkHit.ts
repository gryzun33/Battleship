import { stateManager } from '../../state/clientManager';
import { Coord, Hit } from '../types';
import { BOARD_SIZE } from '../constants';

export function checkHit(opponentId: string, xHit: number, yHit: number) {
  let isCellAvailable = true;
  const { shipsCoord } = stateManager.getClient(opponentId);
  if (!shipsCoord) {
    throw new Error('No ships data available for the opponent.');
  }

  const isCellnotHit = stateManager.checkCell(opponentId, xHit, yHit);
  if (!isCellnotHit) {
    // console.warn(`This cell is not available`);
    isCellAvailable = false;
  } else {
    stateManager.updateCell(opponentId, xHit, yHit);
  }

  const missed: Hit[] = [];
  const shoted: Hit[] = [];
  let killed: Hit[] = [];

  outer: for (let i = 0; i < shipsCoord.length; i++) {
    const ship = shipsCoord[i];

    for (let j = 0; j < ship.positions.length; j++) {
      const pos = ship.positions[j];

      if (pos.x === xHit && pos.y === yHit) {
        pos.isHit = true;

        const isKilled = ship.positions.every((pos: Coord) => pos.isHit);
        if (isKilled) {
          killed = ship.positions;
          break outer;
        } else {
          shoted.push({ x: xHit, y: yHit });
          break outer;
        }
      }
    }
  }

  if (killed.length > 0) {
    for (let i = 0; i < killed.length; i++) {
      const killedPos = killed[i];
      const surroundCoords = [
        { x: killedPos.x - 1, y: killedPos.y },
        { x: killedPos.x + 1, y: killedPos.y },
        { x: killedPos.x, y: killedPos.y - 1 },
        { x: killedPos.x, y: killedPos.y + 1 },
        { x: killedPos.x - 1, y: killedPos.y - 1 },
        { x: killedPos.x + 1, y: killedPos.y - 1 },
        { x: killedPos.x - 1, y: killedPos.y + 1 },
        { x: killedPos.x + 1, y: killedPos.y + 1 },
      ];

      for (let j = 0; j < surroundCoords.length; j++) {
        const coord = surroundCoords[j];

        if (
          coord.x >= 0 &&
          coord.x < BOARD_SIZE &&
          coord.y >= 0 &&
          coord.y < BOARD_SIZE
        ) {
          if (
            !killed.some((pos) => pos.x === coord.x && pos.y === coord.y) &&
            !missed.some(
              (missedPos) => missedPos.x === coord.x && missedPos.y === coord.y
            )
          ) {
            missed.push({ ...coord });
            stateManager.updateCell(opponentId, coord.x, coord.y);
          }
        }
      }
    }
  }

  if (killed.length === 0 && shoted.length === 0) {
    missed.push({ x: xHit, y: yHit });
  }

  return { missed, shoted, killed, isCellAvailable };
}
