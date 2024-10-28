import WebSocket from 'ws';
import { GameResponse, RoomRequest, Room } from '../utils/types';
import { randomUUID } from 'crypto';
import { getFormattedResponse } from '../utils/helpers/getFormattedResponse';
import { stateManager } from '../state/clientManager';

export function handleAddUserToRoom(
  ws: WebSocket,
  data: string,
  clientId: string
) {
  const { indexRoom } = JSON.parse(data) as RoomRequest;
  const clientIdInRoom = stateManager.getClientInRoom(indexRoom);

  if (clientIdInRoom === clientId) {
    console.warn(`Player is in room already`);
    return;
  }

  const wsInRoom = stateManager.getWebSocket(clientIdInRoom);
  stateManager.removeRoom(indexRoom, clientIdInRoom);
  const { roomId: secondRoomId } = stateManager.getClient(clientId);
  if (secondRoomId) {
    stateManager.removeRoom(secondRoomId, clientId);
  }

  // response1
  const rooms: Room[] = stateManager.getRooms();
  const roomsJSON = JSON.stringify(rooms);
  const response = getFormattedResponse('update_room', roomsJSON);
  const sockets = stateManager.getAllSockets();
  sockets.forEach((ws) => {
    console.log('response type = update_room');
    ws.send(response);
  });

  // createGame
  const gameId = randomUUID();
  stateManager.updateClient(clientIdInRoom, { gameId });
  stateManager.updateClient(clientId, { gameId });

  // response2
  const gameOne: GameResponse = {
    idGame: gameId,
    idPlayer: clientIdInRoom,
  };
  const playerOne = JSON.stringify(gameOne);
  const responseOne = getFormattedResponse('create_game', playerOne);
  console.log('response type = create_game');
  wsInRoom.send(responseOne);

  const gameTwo: GameResponse = {
    idGame: gameId,
    idPlayer: clientId,
  };
  const playerTwo = JSON.stringify(gameTwo);
  const responseTwo = getFormattedResponse('create_game', playerTwo);
  console.log('response type = create_game');
  ws.send(responseTwo);
}
