import { GameSession, PlayerData } from '../types';

export function getOpponentData(
  gameSession: GameSession,
  currentPlayerId: string
): PlayerData | undefined {
  for (const [playerId, playerData] of gameSession.players) {
    if (playerId !== currentPlayerId) {
      return playerData;
    }
  }
  return undefined;
}
