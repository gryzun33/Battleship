import { stateManager } from '../../state/clientManager';
import { Coord } from '../types';

export function checkHit(opponentId: string, xHit: number, yHit: number) {
  const { shipsCoord } = stateManager.getClient(opponentId);
  if (!shipsCoord) {
    throw new Error();
  }
  for (const ship of shipsCoord) {
    for (const pos of ship.positions) {
      if (pos.x === xHit && pos.y === yHit) {
        pos.isHit = true;
        const isKilled = ship.positions.every((p: Coord) => p.isHit);
        return isKilled ? 'killed' : 'shot';
      }
    }
  }
  return 'miss';
}
