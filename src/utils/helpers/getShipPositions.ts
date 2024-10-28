import { Ship, Coord, ShipCoord } from '../types';

export function getShipPositions(ships: Ship[]): ShipCoord[] {
  const shipPositions = ships.map((ship) => ({
    positions: generateShipPositions(ship),
  }));

  return shipPositions;
}

function generateShipPositions(ship: Ship): Coord[] {
  const positions: Coord[] = [];

  for (let i = 0; i < ship.length; i++) {
    const x = ship.direction ? ship.position.x : ship.position.x + i;
    const y = ship.direction ? ship.position.y + i : ship.position.y;
    positions.push({ x, y, isHit: false });
  }

  return positions;
}
