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
import { getShipPositions } from '../utils/helpers/getShipPositions';
// import { getBoard } from '../utils/helpers/getBoard';

const BOARD_SIZE = 10;

export function handleAddShips(ws: WebSocket, data: string, clientId: string) {
  const shipsData = JSON.parse(data) as ShipsInitialData;

  // console.log('shipsData.ships=', shipsData.ships);

  const shipsCoord = getShipPositions(shipsData.ships);
  stateManager.updateClient(clientId, { shipsCoord });

  const playersCount = stateManager.addPlayerToGame(shipsData);
  if (playersCount < 2) {
    return;
  }
  console.log('startgame');

  const { players, currentPlayer } = stateManager.getGameData(shipsData.gameId);

  stateManager.setCurrentPlayer(currentPlayer);
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
