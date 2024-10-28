import WebSocket from 'ws';
import { getFormattedResponse } from '../utils/helpers/getFormattedResponse';
import { WinnersData } from '../utils/types';
import { stateManager } from '../state/clientManager';
import { resetGame } from '../utils/helpers/resetGame';

export async function sendFinish(
  winnerId: string,
  opponentId: string,
  ws: WebSocket,
  opponentWs: WebSocket,
  gameId: string
) {
  // response1
  const responseData = { winPlayer: winnerId };
  const responseJSON = JSON.stringify(responseData);
  const response = getFormattedResponse('finish', responseJSON);
  console.log('response type = finish');
  await Promise.all([ws.send(response), opponentWs.send(response)]);

  // response2
  const sockets = stateManager.getAllSockets();
  const winners: WinnersData = stateManager.getWinners();
  const winnersJSON = JSON.stringify(winners);
  const responseWinners = getFormattedResponse('update_winners', winnersJSON);
  console.log('response type = update_winners');
  await Promise.all(sockets.map((socket) => socket.send(responseWinners)));

  resetGame(winnerId, opponentId, gameId);
}
