import { randomUUID } from 'crypto';
import { getFormattedResponse } from '../utils/helpers/getFormattedResponse';
import { stateManager } from '../state/clientManager';

export function handleCreateRoom(clientId: string) {
  const { roomId } = stateManager.getClient(clientId);

  if (roomId) {
    console.warn(`Player can create only one room`);
    return;
  }

  const newRoomId = randomUUID();
  const rooms = stateManager.createRoom(newRoomId, clientId);

  // response1
  const roomsJSON = JSON.stringify(rooms);
  const response = getFormattedResponse('update_room', roomsJSON);
  const sockets = stateManager.getAllSockets();
  sockets.forEach((ws) => ws.send(response));
}
