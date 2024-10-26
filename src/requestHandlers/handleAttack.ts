import WebSocket from 'ws';
import { AttackRequest, RoomRequest, Room } from '../utils/types';
import { randomUUID } from 'crypto';
import { getFormattedResponse } from '../utils/helpers/getFormattedResponse';
import { stateManager } from '../state/clientManager';
import { getOpponentData } from '../utils/helpers/getOpponentData';
import { checkHit } from '../utils/helpers/checkHit';

export function handleAttack(ws: WebSocket, data: string, clientId: string) {
  const attackData = JSON.parse(data) as AttackRequest;
  const gameData = stateManager.getGameData(attackData.gameId);
  const anotherPlayer = getOpponentData(gameData, clientId);
  if (!anotherPlayer) {
    throw new Error(`opponent wasn't found`);
  }
  const opponentId = anotherPlayer.indexPlayer;
  const { ws: opponentWs } = stateManager.getClient(opponentId);
  const result = checkHit(opponentId, attackData.x, attackData.y);

  // response1
  if (result === 'miss' || 'shot') {
    const responseData = {
      position: {
        x: attackData.x,
        y: attackData.y,
      },
      currentPlayer: clientId,
      status: result,
    };

    const responseJSON = JSON.stringify(responseData);
    const response = getFormattedResponse('attack', responseJSON);
    ws.send(response);
    opponentWs.send(response);
  }

  // console.log('result=', result);

  // console.log('ATTACK');
  // console.log('X=', attackData.x);
  // console.log('Y=', attackData.y);
  // console.log('clientId=', clientId);
  // console.log('currentPlayer=', attackData.indexPlayer);
}
