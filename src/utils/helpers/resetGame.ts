import { stateManager } from '../../state/clientManager';
import { BOARD_SIZE } from '../constants';
import { createBoard } from './createBoard';

export function resetGame(
  winnerId: string,
  opponentId: string,
  gameId: string
) {
  const clientData1 = stateManager.getClient(winnerId);
  const clientData2 = stateManager.getClient(opponentId);

  const clients = [clientData1, clientData2];

  clients.forEach((client) => {
    client.roomId = null;
    client.gameId = null;
    client.board = createBoard(BOARD_SIZE);
    client.shipsCoord = [];
  });

  stateManager.deleteGame(gameId);
}
