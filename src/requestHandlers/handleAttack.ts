import WebSocket from 'ws';
import {
  AttackRequest,
  RoomRequest,
  Room,
  Hit,
  AttackFeedback,
} from '../utils/types';
import { randomUUID } from 'crypto';
import { getFormattedResponse } from '../utils/helpers/getFormattedResponse';
import { stateManager } from '../state/clientManager';
import { getOpponentData } from '../utils/helpers/getOpponentData';
import { checkHit } from '../utils/helpers/checkHit';
import { sendFinish } from '../responses/finish';

export function handleAttack(ws: WebSocket, data: string, clientId: string) {
  const attackData = JSON.parse(data) as AttackRequest;
  const gameData = stateManager.getGameData(attackData.gameId);
  const anotherPlayer = getOpponentData(gameData, clientId);
  if (!anotherPlayer) {
    throw new Error(`opponent wasn't found`);
  }

  if (stateManager.getCurrentPlayer() !== clientId) {
    console.warn(`Now is another player's turn`);
    return;
  }

  const opponentId = anotherPlayer.indexPlayer;
  const { ws: opponentWs } = stateManager.getClient(opponentId);

  const isCellnotHit = stateManager.checkCell(
    opponentId,
    attackData.x,
    attackData.y
  );

  if (!isCellnotHit) {
    console.warn(`This cell is not available`);
    const turnResponseJSON = JSON.stringify({ currentPlayer: clientId });
    const response = getFormattedResponse('turn', turnResponseJSON);
    ws.send(response);
    opponentWs.send(response);
    return;
  } else {
    stateManager.updateCell(opponentId, attackData.x, attackData.y);
  }

  const { missed, shoted, killed, isGameOver } = checkHit(
    opponentId,
    attackData.x,
    attackData.y
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
  stateManager.setCurrentPlayer(turnData.currentPlayer);
  const turnResponseJSON = JSON.stringify(turnData);
  const response = getFormattedResponse('turn', turnResponseJSON);
  ws.send(response);
  opponentWs.send(response);

  if (isGameOver) {
    stateManager.addWin(clientId);
    sendFinish(clientId, opponentId, ws, opponentWs, attackData.gameId);
  }
}
