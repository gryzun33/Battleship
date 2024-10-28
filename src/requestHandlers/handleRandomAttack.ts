import WebSocket from 'ws';
import { Hit, AttackFeedback, AttackRandom } from '../utils/types';
import { getFormattedResponse } from '../utils/helpers/getFormattedResponse';
import { stateManager } from '../state/clientManager';
import { getOpponentData } from '../utils/helpers/getOpponentData';
import { checkHit } from '../utils/helpers/checkHit';
import { sendFinish } from '../responses/finish';
import { getRandomShot } from '../utils/helpers/getRandomCoord';
import { BOARD_SIZE } from '../utils/constants';

export function handleRandomAttack(
  ws: WebSocket,
  data: string,
  clientId: string
) {
  const attackData = JSON.parse(data) as AttackRandom;
  const gameData = stateManager.getGameData(attackData.gameId);
  const anotherPlayer = getOpponentData(gameData, clientId);
  if (!anotherPlayer) {
    throw new Error(`opponent wasn't found`);
  }
  const opponentId = anotherPlayer.indexPlayer;
  const { ws: opponentWs } = stateManager.getClient(opponentId);
  const { board } = stateManager.getClient(clientId);

  const randCoord: Hit = getRandomShot(board, BOARD_SIZE);

  const { missed, shoted, killed, isGameOver } = checkHit(
    opponentId,
    randCoord.x,
    randCoord.y
  );

  const responsesAttack: AttackFeedback[] = [];

  killed.forEach((hit: Hit) => {
    const responseData: AttackFeedback = {
      position: {
        x: hit.x,
        y: hit.y,
      },
      currentPlayer: clientId,
      status: 'killed',
    };

    responsesAttack.push(responseData);
  });

  missed.forEach((hit: Hit) => {
    const responseData: AttackFeedback = {
      position: {
        x: hit.x,
        y: hit.y,
      },
      currentPlayer: clientId,
      status: 'miss',
    };
    responsesAttack.push(responseData);
  });

  shoted.forEach((hit: Hit) => {
    const responseData: AttackFeedback = {
      position: {
        x: hit.x,
        y: hit.y,
      },
      currentPlayer: clientId,
      status: 'shot',
    };
    responsesAttack.push(responseData);
  });

  responsesAttack.forEach((resp: AttackFeedback) => {
    const responseJSON = JSON.stringify(resp);
    const response = getFormattedResponse('attack', responseJSON);
    ws.send(response);
    opponentWs.send(response);
  });

  const turnData = { currentPlayer: '' };
  if (killed.length || shoted.length) {
    turnData.currentPlayer = clientId;
  } else {
    turnData.currentPlayer = opponentId;
  }

  const turnResponseJSON = JSON.stringify(turnData);
  const response = getFormattedResponse('turn', turnResponseJSON);
  ws.send(response);
  opponentWs.send(response);

  if (isGameOver) {
    stateManager.addWin(clientId);
    sendFinish(clientId, opponentId, ws, opponentWs, attackData.gameId);
  }
}
