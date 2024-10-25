import WebSocket from 'ws';
import { PlayerAnswer, PlayerReg, Room, Winner } from '../utils/types';
import { randomUUID } from 'crypto';
import { getFormattedResponse } from '../utils/helpers/getFormattedResponse';
import { clientManager } from '../state/clientManager';

export function handleRegistration(
  ws: WebSocket,
  data: string,
  clientId: string
) {
  const parsedData = JSON.parse(data) as PlayerReg;
  clientManager.addClient(clientId, {
    ws,
    name: parsedData.name,
    password: parsedData.password,
  });

  const responses: string[] = [];

  // response1
  const createdPlayer: PlayerAnswer = {
    name: parsedData.name,
    index: clientId,
    error: false,
    errorText: '',
  };

  const createdPlayerJSON = JSON.stringify(createdPlayer);
  const responseReg = getFormattedResponse('reg', createdPlayerJSON);
  responses.push(responseReg);

  // response2
  const winners: Winner[] = [];
  const winnersJSON = JSON.stringify(winners);
  const responseWinners = getFormattedResponse('update_winners', winnersJSON);
  responses.push(responseWinners);

  // response3
  const rooms: Room[] = clientManager.getRooms();
  const roomsJSON = JSON.stringify(rooms);
  const responseRooms = getFormattedResponse('update_room', roomsJSON);
  responses.push(responseRooms);

  // const sockets = clientManager.getAllSockets();
  responses.forEach((response) => ws.send(response));
  console.log('clients=', clientManager.getAllClients());
}
