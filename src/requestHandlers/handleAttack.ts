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

export function handleAttack(ws: WebSocket, data: string, clientId: string) {
  const attackData = JSON.parse(data) as AttackRequest;
  const gameData = stateManager.getGameData(attackData.gameId);
  const anotherPlayer = getOpponentData(gameData, clientId);
  if (!anotherPlayer) {
    throw new Error(`opponent wasn't found`);
  }
  const opponentId = anotherPlayer.indexPlayer;
  const { ws: opponentWs } = stateManager.getClient(opponentId);
  const { missed, shoted, killed } = checkHit(
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

  const turnResponseJSON = JSON.stringify(turnData);
  const response = getFormattedResponse('turn', turnResponseJSON);
  ws.send(response);
  opponentWs.send(response);
}
