import { Ship, Coord, ShipCoord } from '../types';

// function createEmptyBoard(size: number): Cell[][] {
//   const board: Cell[][] = [];
//   for (let y = 0; y < size; y++) {
//     const row: Cell[] = [];
//     for (let x = 0; x < size; x++) {
//       row.push('empty');
//     }
//     board.push(row);
//   }
//   return board;
// }

// function generateShipPositions(ship: Ship): Coord[] {
//   const coord: Coord[] = [];

//   for (let i = 0; i < ship.length; i++) {
//     const y = ship.direction ? ship.position.y + i : ship.position.y;
//     const x = ship.direction ? ship.position.x : ship.position.x + i;
//     coord.push({ x, y, status: 'ship' });
//   }

//   return coord;
// }

// function convertToPositions(shipsData: Ship[]): ShipsCoord {
//   return shipsData.map((ship) => generateShipPositions(ship));
// }

// export function getBoard(shipsData: Ship[], size: number) {
//   const board: Cell[][] = createEmptyBoard(size);
//   const shipsCoord = convertToPositions(shipsData);

//   shipsCoord.forEach((shipCoord: Coord[]) => {
//     shipCoord.forEach((pos: Coord) => {
//       board[pos.x][pos.y] = 'ship';
//     });
//   });

//   console.log('board=', board);

//   return { board, shipsCoord };
// }

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
