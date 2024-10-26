import { WebSocket } from 'ws';
import {
  Room,
  ShipsInitialData,
  GameSession,
  PlayerReg,
  ShipCoord,
  // Board,
  // ShipsCoord,
} from '../utils/types';

interface ClientData {
  ws: WebSocket;
  name: string;
  // password: string;
  roomId?: string;
  gameId?: string;
  // board?: Board;
  shipsCoord?: ShipCoord[];
}

class StateManager {
  private users: Map<string, string> = new Map();
  private clients: Map<string, ClientData> = new Map();
  private roomsMap: Map<string, Room> = new Map();

  private games: Map<string, GameSession> = new Map();

  public login(data: PlayerReg): boolean {
    const isExist = this.users.has(data.name);
    if (isExist) {
      const storedPassword = this.users.get(data.name);
      if (storedPassword === data.password) {
        return true;
      } else {
        return false;
      }
    } else {
      this.users.set(data.name, data.password);
      return true;
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

  public removeRoom(roomId: string): void {
    this.roomsMap.delete(roomId);
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

  public getGameData(gameId: string): GameSession {
    let game = this.games.get(gameId);
    if (!game) {
      throw new Error(`Game with such id is not found`);
    }
    return game;
  }
}

export const stateManager = new StateManager();
