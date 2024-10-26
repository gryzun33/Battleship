import WebSocket from 'ws';
import {
  ShipsInitialData,
  GameResponse,
  RoomRequest,
  Room,
} from '../utils/types';
import { randomUUID } from 'crypto';
import { getFormattedResponse } from '../utils/helpers/getFormattedResponse';
import { stateManager } from '../state/clientManager';

export function handleAddShips(ws: WebSocket, data: string, clientId: string) {
  const shipsData = JSON.parse(data) as ShipsInitialData;

  const playersCount = stateManager.addPlayerToGame(shipsData);
  if (playersCount < 2) {
    return;
  }

  console.log('startgame');
}
