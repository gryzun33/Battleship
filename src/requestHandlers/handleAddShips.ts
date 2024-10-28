import WebSocket from 'ws';
import { ShipsInitialData, PlayerData } from '../utils/types';
import { getFormattedResponse } from '../utils/helpers/getFormattedResponse';
import { stateManager } from '../state/clientManager';
import { getShipPositions } from '../utils/helpers/getShipPositions';

const BOARD_SIZE = 10;

export function handleAddShips(ws: WebSocket, data: string, clientId: string) {
  const shipsData = JSON.parse(data) as ShipsInitialData;

  const shipsCoord = getShipPositions(shipsData.ships);
  stateManager.updateClient(clientId, { shipsCoord });

  const playersCount = stateManager.addPlayerToGame(shipsData);
  if (playersCount < 2) {
    return;
  }

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
    console.log('response type = start_game');
    ws.send(responseGame);
    console.log('response type = turn');
    ws.send(responseTurn);
  });
}
