import { WebSocket } from 'ws';
import { Room, RoomUser } from '../utils/types';

interface ClientData {
  ws: WebSocket;
  name: string;
  password: string | number;
}

class ClientManager {
  private clients: Map<string, ClientData> = new Map();
  private roomsMap: Map<string, Room> = new Map();

  public createRoom(roomId: string, clientId: string) {
    const userName = this.getName(clientId);
    const room = {
      roomId,
      roomUsers: [{ name: userName, index: clientId }],
    };
    this.roomsMap.set(roomId, room);
    return this.getRooms();
  }

  public addClient(clientId: string, data: ClientData): void {
    this.clients.set(clientId, { ...data });
  }

  public getClient(clientId: string): ClientData | undefined {
    return this.clients.get(clientId);
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
}

export const clientManager = new ClientManager();
