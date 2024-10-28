import WebSocket from 'ws';
import { PlayerAnswer, PlayerReg, Room, WinnersData } from '../utils/types';
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

  const { isSuccess, errorText } = stateManager.login(parsedData);
  if (!isSuccess) {
    const createdPlayer: PlayerAnswer = {
      name: parsedData.name,
      index: clientId,
      error: true,
      errorText,
    };
    // console.log('SEND');
    const createdPlayerJSON = JSON.stringify(createdPlayer);
    const responseReg = getFormattedResponse('reg', createdPlayerJSON);
    console.log('response type = reg');
    ws.send(responseReg);
    return;
  }

  stateManager.addClient(clientId, {
    ws,
    name: parsedData.name,
    board: createBoard(BOARD_SIZE),
    roomId: stateManager.getRoomId(parsedData.name),
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
  console.log('response type = reg');
  ws.send(responseReg);

  // response2
  const winners: WinnersData = stateManager.getWinners();
  const winnersJSON = JSON.stringify(winners);
  const responseWinners = getFormattedResponse('update_winners', winnersJSON);

  sockets.forEach((ws) => {
    console.log('response type = update_winners');
    ws.send(responseWinners);
  });

  // response3
  const rooms: Room[] = stateManager.getRooms();
  const roomsJSON = JSON.stringify(rooms);
  const responseRooms = getFormattedResponse('update_room', roomsJSON);
  sockets.forEach((ws) => {
    console.log('response type = update_room');
    ws.send(responseRooms);
  });
}
