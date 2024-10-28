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
  ws.send(response);
  console.log('response type = finish');
  opponentWs.send(response);

  // response2
  const sockets = stateManager.getAllSockets();
  const winners: WinnersData = stateManager.getWinners();
  const winnersJSON = JSON.stringify(winners);
  const responseWinners = getFormattedResponse('update_winners', winnersJSON);
  sockets.map((socket) => {
    console.log('response type = update_winners');
    socket.send(responseWinners);
  });

  resetGame(winnerId, opponentId, gameId);
}
