import WebSocket from 'ws';
import { getFormattedResponse } from '../utils/helpers/getFormattedResponse';

export function sendFinish(
  winnerId: string,
  opponentId: string,
  ws: WebSocket,
  opponentWs: WebSocket
) {
  // response1
  const responseData = { winPlayer: winnerId };
  const responseJSON = JSON.stringify(responseData);
  const response = getFormattedResponse('finish', responseJSON);
  ws.send(response);
  opponentWs.send(response);

  // response2
}
