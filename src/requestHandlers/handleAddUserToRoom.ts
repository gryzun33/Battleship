import WebSocket from 'ws';
import { PlayerAnswer, GameResponse, RoomRequest, Room } from '../utils/types';
import { randomUUID } from 'crypto';
import { getFormattedResponse } from '../utils/helpers/getFormattedResponse';
import { clientManager } from '../state/clientManager';

export function handleAddUserToRoom(
  ws: WebSocket,
  data: string,
  clientId: string
) {
  const { indexRoom } = JSON.parse(data) as RoomRequest;
  const clientIdInRoom = clientManager.getClientInRoom(indexRoom);

  if (clientIdInRoom === clientId) {
    return;
  }
  const wsInRoom = clientManager.getWebSocket(clientIdInRoom);
  clientManager.removeRoom(indexRoom);

  // response1
  const rooms: Room[] = clientManager.getRooms();
  const roomsJSON = JSON.stringify(rooms);
  const response = getFormattedResponse('update_room', roomsJSON);
  const sockets = clientManager.getAllSockets();
  sockets.forEach((ws) => ws.send(response));

  // createGame
  const gameId = randomUUID();

  // response2
  const gameOne: GameResponse = {
    idGame: gameId,
    idPlayer: clientIdInRoom,
  };
  const playerOne = JSON.stringify(gameOne);
  const responseOne = getFormattedResponse('create_game', playerOne);
  wsInRoom.send(responseOne);

  const gameTwo: GameResponse = {
    idGame: gameId,
    idPlayer: clientId,
  };
  const playerTwo = JSON.stringify(gameTwo);
  const responseTwo = getFormattedResponse('create_game', playerTwo);
  ws.send(responseTwo);
}
