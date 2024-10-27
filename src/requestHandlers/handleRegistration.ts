import WebSocket from 'ws';
import { PlayerAnswer, PlayerReg, Room, Winner } from '../utils/types';
import { randomUUID } from 'crypto';
import { getFormattedResponse } from '../utils/helpers/getFormattedResponse';
import { stateManager } from '../state/clientManager';
import { createBoard } from '../utils/helpers/createBoard';
import { BOARD_SIZE } from '../utils/constants';

export function handleRegistration(
  ws: WebSocket,
  data: string,
  clientId: string
) {
  const parsedData = JSON.parse(data) as PlayerReg;

  const isLoginSuccess = stateManager.login(parsedData);
  if (!isLoginSuccess) {
    const createdPlayer: PlayerAnswer = {
      name: parsedData.name,
      index: clientId,
      error: true,
      errorText: 'Invalid password',
    };

    const createdPlayerJSON = JSON.stringify(createdPlayer);
    const responseReg = getFormattedResponse('reg', createdPlayerJSON);
    ws.send(responseReg);
    return;
  }

  stateManager.addClient(clientId, {
    ws,
    name: parsedData.name,
    board: createBoard(BOARD_SIZE),
  });

  const sockets = stateManager.getAllSockets();

  // response1
  const createdPlayer: PlayerAnswer = {
    name: parsedData.name,
    index: clientId,
    error: false,
    errorText: '',
  };

  const createdPlayerJSON = JSON.stringify(createdPlayer);
  const responseReg = getFormattedResponse('reg', createdPlayerJSON);
  ws.send(responseReg);

  // response2
  const winners: Winner[] = [];
  const winnersJSON = JSON.stringify(winners);
  const responseWinners = getFormattedResponse('update_winners', winnersJSON);
  sockets.forEach((ws) => ws.send(responseWinners));

  // response3
  const rooms: Room[] = stateManager.getRooms();
  const roomsJSON = JSON.stringify(rooms);
  const responseRooms = getFormattedResponse('update_room', roomsJSON);
  sockets.forEach((ws) => ws.send(responseRooms));
}
