import { WebSocket } from 'ws';
import {
  Room,
  ShipsInitialData,
  GameSession,
  PlayerReg,
  ShipCoord,
  Board,
  WinnersData,
} from '../utils/types';

interface ClientData {
  ws: WebSocket;
  name: string;
  roomId: string | null;
  gameId?: string | null;
  board: Board;
  shipsCoord?: ShipCoord[];
}

class StateManager {
  private users: Map<string, string> = new Map();
  private clients: Map<string, ClientData> = new Map();
  private roomsMap: Map<string, Room> = new Map();
  private games: Map<string, GameSession> = new Map();
  private winners: Map<string, number> = new Map();

  public login(data: PlayerReg): { isSuccess: boolean; errorText: string } {
    const names: string[] = [];
    for (const client of this.clients.values()) {
      names.push(client.name);
    }
    if (names.includes(data.name)) {
      return {
        isSuccess: false,
        errorText: `User with name "${data.name}" is already logged in.`,
      };
    } else {
      const isExist = this.users.has(data.name);
      if (isExist) {
        const storedPassword = this.users.get(data.name);
        if (storedPassword === data.password) {
          return { isSuccess: true, errorText: '' };
        } else {
          return { isSuccess: false, errorText: 'Wrong password' };
        }
      } else {
        this.users.set(data.name, data.password);
        return { isSuccess: true, errorText: '' };
      }
    }
  }

  public createRoom(roomId: string, clientId: string) {
    const userName = this.getName(clientId);
    const room = {
      roomId,
      roomUsers: [{ name: userName, index: clientId }],
    };
    this.roomsMap.set(roomId, room);
    this.updateClient(clientId, { roomId });
    return this.getRooms();
  }

  public addClient(clientId: string, data: ClientData): void {
    this.clients.set(clientId, { ...data });
  }

  public getClient(clientId: string): ClientData {
    const client = this.clients.get(clientId);
    if (!client) {
      throw new Error('client is not found');
    }
    return client;
  }

  public getWebSocket(clientId: string): WebSocket {
    const clientData = this.clients.get(clientId);
    if (clientData) {
      return clientData.ws;
    } else {
      throw new Error(`Client with ID ${clientId} not found`);
    }
  }

  public updateClient(clientId: string, data: Partial<ClientData>): void {
    const clientData = this.clients.get(clientId);
    if (clientData) {
      this.clients.set(clientId, { ...clientData, ...data });
    }
  }

  public removeClient(clientId: string): void {
    this.clients.delete(clientId);
  }

  public getAllClients(): Map<string, ClientData> {
    return this.clients;
  }

  public getName(clientId: string): string {
    const clientData = this.clients.get(clientId);
    if (clientData && clientData.name) {
      return clientData.name;
    } else {
      throw new Error('name is undefined');
    }
  }

  public getRooms(): Room[] {
    return Array.from(this.roomsMap.values());
  }

  public getAllSockets(): WebSocket[] {
    return Array.from(this.clients.values()).map((client) => client.ws);
  }

  public getClientInRoom(roomId: string): string {
    const room = this.roomsMap.get(roomId);

    if (!room || room.roomUsers.length === 0) {
      throw new Error(`Room with id ${roomId} is empty or does not exist.`);
    }

    return room.roomUsers[0].index;
  }

  public removeRoom(roomId: string, clientId: string): void {
    this.roomsMap.delete(roomId);
    const clientData = this.getClient(clientId);
    clientData.roomId = null;
  }

  public addPlayerToGame({
    gameId,
    ships,
    indexPlayer,
  }: ShipsInitialData): number {
    let game = this.games.get(gameId);
    if (!game) {
      game = { players: new Map(), currentPlayer: indexPlayer };
      this.games.set(gameId, game);
    }
    game.players.set(indexPlayer, { ships, indexPlayer });
    return game.players.size;
  }

  public deleteGame(gameId: string): boolean {
    return this.games.delete(gameId);
  }

  public getGameData(gameId: string): GameSession {
    let game = this.games.get(gameId);
    if (!game) {
      throw new Error(`Game with such id is not found`);
    }
    return game;
  }

  public checkCell(clientId: string, x: number, y: number): boolean {
    const client = this.clients.get(clientId);
    if (!client || !client.board) {
      throw new Error('Client or board not found');
    }
    const cellKey = `${x}${y}`;
    const isHit = client.board.get(cellKey);
    if (isHit === undefined) {
      throw new Error('Cell not found');
    }
    return isHit;
  }

  public updateCell(clientId: string, x: number, y: number): void {
    const client = this.clients.get(clientId);
    if (!client || !client.board) {
      throw new Error('Client or board not found');
    }
    const cellKey = `${x}${y}`;
    if (client.board.has(cellKey)) {
      client.board.set(cellKey, false);
    } else {
      throw new Error('Cell not found on the board');
    }
  }

  public addWin(clientId: string): void {
    const { name } = this.getClient(clientId);

    if (this.winners.has(name)) {
      const currentWins = this.winners.get(name)!;
      this.winners.set(name, currentWins + 1);
    } else {
      this.winners.set(name, 1);
    }
  }

  public getWinners(): WinnersData {
    const winnersArray: WinnersData = [];

    this.winners.forEach((wins, name) => {
      winnersArray.push({ name, wins });
    });

    return winnersArray;
  }
}

export const stateManager = new StateManager();
