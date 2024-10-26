import WebSocket from 'ws';
import {
  ShipsInitialData,
  GameResponse,
  RoomRequest,
  Room,
  PlayerData,
} from '../utils/types';
import { randomUUID } from 'crypto';
import { getFormattedResponse } from '../utils/helpers/getFormattedResponse';
import { stateManager } from '../state/clientManager';
import { getShipPositions } from '../utils/helpers/getBoard';
// import { getBoard } from '../utils/helpers/getBoard';

const BOARD_SIZE = 10;

export function handleAddShips(ws: WebSocket, data: string, clientId: string) {
  const shipsData = JSON.parse(data) as ShipsInitialData;

  console.log('shipsData.ships=', shipsData.ships);

  const shipsCoord = getShipPositions(shipsData.ships);
  stateManager.updateClient(clientId, { shipsCoord });

  // const { board, shipsCoord } = getBoard(shipsData.ships, BOARD_SIZE);
  // stateManager.updateClient(clientId, { board, shipsCoord });

  // console.log('board=', board);

  const playersCount = stateManager.addPlayerToGame(shipsData);
  if (playersCount < 2) {
    return;
  }
  console.log('startgame');

  const { players, currentPlayer } = stateManager.getGameData(shipsData.gameId);
  players.forEach((playerData: PlayerData, playerId: string) => {
    const ws = stateManager.getWebSocket(playerId);
    const playerDataResponse = {
      ships: playerData.ships,
      currentPlayer: playerData.indexPlayer,
    };

    const dataJSON = JSON.stringify(playerDataResponse);
    const currentJSON = JSON.stringify({ currentPlayer });
    const responseGame = getFormattedResponse('start_game', dataJSON);
    const responseTurn = getFormattedResponse('turn', currentJSON);
    ws.send(responseGame);
    ws.send(responseTurn);
  });
}
