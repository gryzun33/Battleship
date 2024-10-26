import WebSocket from 'ws';
import { PlayerAnswer, PlayerReg, Room, Winner } from '../utils/types';
import { randomUUID } from 'crypto';
import { getFormattedResponse } from '../utils/helpers/getFormattedResponse';
import { stateManager } from '../state/clientManager';

export function handleCreateRoom(ws: WebSocket, clientId: string) {
  const roomId = randomUUID();
  const rooms = stateManager.createRoom(roomId, clientId);

  // const filteredRooms = rooms.filter((room) => {
  //   return !room.roomUsers.some((user) => user.index === clientId);
  // });

  // response1
  const roomsJSON = JSON.stringify(rooms);
  const response = getFormattedResponse('update_room', roomsJSON);
  const sockets = stateManager.getAllSockets();
  sockets.forEach((ws) => ws.send(response));
}
